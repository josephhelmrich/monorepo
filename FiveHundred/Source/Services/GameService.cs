using FiveHundred.Models;
using FiveHundred.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Services
{
    public class GameService : IGameService
    {
        private static readonly Random Randomizer = new Random();
        private readonly IMongoRepository<GameEntity, GameModel> gameRepository;
        private readonly IEventService eventService;

        public GameService(IMongoRepository<GameEntity, GameModel> gameRepository, IEventService eventService)
        {
            this.gameRepository = gameRepository;
            this.eventService = eventService;
        }


        public async Task<EventModel> StartGame(StartGameRequestModel model)
        {
            var evt = await eventService.GetEventById(model.EventId);
            if (evt == null)
                return null;

            EndCurrentGameInternal(evt);

            if (string.IsNullOrWhiteSpace(model.TeamA.Id))
                model.TeamA.Id = gameRepository.GenerateId();
            if (string.IsNullOrWhiteSpace(model.TeamB.Id))
                model.TeamB.Id = gameRepository.GenerateId();

            model.TeamA.Score = 0;
            model.TeamB.Score = 0;

            var dealerUserId = evt.Users[Randomizer.Next(evt.Users.Count)].Id;
            TeamModel dealersTeam, opponentTeam;
            if (model.TeamA.UserIds.Contains(dealerUserId))
            {
                dealersTeam = model.TeamA;
                opponentTeam = model.TeamB;
            }
            else
            {
                opponentTeam = model.TeamA;
                dealersTeam = model.TeamB;
            }

            var teamAModified = new TeamModel()
            {
                Id = dealersTeam.Id ,
                Name = model.TeamA.Name,
                Score = model.TeamA.Score,
                Updated = model.TeamA.Updated
            };
            teamAModified.UserIds.Add(dealerUserId);
            teamAModified.UserIds.Add(dealersTeam.UserIds.First(x => x != dealerUserId));


            evt.CurrentGame = new GameModel()
            {
                Id = gameRepository.GenerateId(),
                Teams = new List<TeamModel>()
                {
                    teamAModified,
                    opponentTeam
                },
                PastHands = new List<HandModel>()
            };

            await eventService.UpdateAsync(evt);

            return evt;
        }


        public void EndCurrentGameInternal(EventModel evt)
        {
            if (evt == null)
                return;
            if (evt.PastGames == null)
                evt.PastGames = new List<GameModel>();
            if (evt.CurrentGame != null)
                evt.PastGames.Add(evt.CurrentGame);



            evt.CurrentGame = null;
        }

        public async Task<EventModel> EndCurrentGame(string eventId)
        {
            var evt = await eventService.GetEventById(eventId);
            if (evt == null)
                return null;

            EndCurrentGameInternal(evt);
            await eventService.UpdateAsync(evt);

            return evt;
        }

        public async Task<EventModel> Bid(BidRequestModel model)
        {
            var evt = await eventService.GetEventById(model.EventId);
            if (evt == null)
                return null;

            if (evt.CurrentGame == null)
                throw new BadRequestException("You must start a game before you can bid");

            //if (!string.IsNullOrWhiteSpace(evt.CurrentGame.CurrentHand?.BidUserId))
            //    throw new BadRequestException("You must end the current game before starting a new one");

            var team = GetTeamByUserId(evt, model.UserId);
            if (team == null)
                throw new BadRequestException("This user isn't on either team");

            evt.CurrentGame.CurrentHand = new HandModel()
            {
                Id = gameRepository.GenerateId(),
                BidTeamId = team.Id,
                Suit = model.Suit,
                Bid = model.Bid,
                BidUserId = model.UserId,
                ActualTricks = -1,
                PotentialScore = GetScore(evt, model.Suit, model.Bid)
            };
            await eventService.UpdateAsync(evt);

            return evt;
        }

        private TeamModel GetTeamByUserId(EventModel evt, string userId)
        {
            return evt.CurrentGame.Teams.SingleOrDefault(x => x.UserIds.Contains(userId));
        }

        public async Task<EventModel> Score(ScoreRequestModel model)
        {
            var evt = await eventService.GetEventById(model.EventId);
            if (evt == null)
                return null;

            if (string.IsNullOrWhiteSpace(evt.CurrentGame?.CurrentHand?.BidUserId))
                throw new BadRequestException("You must start a hand before you can score");

            var hand = evt.CurrentGame.CurrentHand;
            var team = evt.CurrentGame.Teams.SingleOrDefault(x => x.Id == hand.BidTeamId);
            var opponent = evt.CurrentGame.Teams.SingleOrDefault(x => x.Id != hand.BidTeamId);
            var isTeamA = evt.CurrentGame.Teams.IndexOf(team) == 0;
            if (team == null || opponent == null)
                throw new BadRequestException("Team is not part of the game");

            evt.CurrentGame.CurrentHand = null;
            evt.CurrentGame.PastHands.Add(hand);
            hand.ActualTricks = model.ActualTricks;
            if (evt.NilAlone)
                hand.PartnerNilTricks = 0;
            else
                hand.PartnerNilTricks = model.PartnerTricks;

            int score = GetScore(evt, hand.Suit, hand.Bid);
            if ((hand.Suit == Models.Suit.Nil && model.ActualTricks > 0) || (model.ActualTricks < hand.Bid))
                score = score * -1;

            //if (hand.Suit == Models.Suit.Nil)
            //    score += (model.PartnerTricks * 10);

            var oScore = evt.NilAlone ? 0 : (10 - model.ActualTricks - model.PartnerTricks) * 10;
            opponent.Score += oScore;
            team.Score += score;
            
            // record a scoring snapshot.  This is used to display the score table for the game
            var teamSnap = isTeamA ? hand.TeamAScore : hand.TeamBScore;
            var opponentSnap = isTeamA ? hand.TeamBScore : hand.TeamAScore;
            teamSnap.HandScore = score;
            teamSnap.GameScore = team.Score;
            opponentSnap.HandScore = oScore;
            opponentSnap.GameScore = opponent.Score;

            await eventService.UpdateAsync(evt);
            return evt;
        }

        public async Task<EventModel> AdjustScore(AdjustScoreRequest request)
        {
            var evt = await eventService.GetEventById(request.EventId);
            if (evt == null)
                return null;

            var hand =
                evt.CurrentGame?.CurrentHand?.Id == request.HandId ?
                evt.CurrentGame?.CurrentHand :
                evt.CurrentGame?.PastHands.SingleOrDefault(x => x.Id == request.HandId);

            if (hand == null)
                return null;

            hand.TeamAScore.HandScore = request.TeamAScore;
            hand.TeamBScore.HandScore = request.TeamBScore;

            var teamA = evt.CurrentGame.CurrentHand?.TeamAScore.HandScore ?? 0;
            var teamB = evt.CurrentGame.CurrentHand?.TeamBScore.HandScore ?? 0;
            foreach (var ph in evt.CurrentGame.PastHands)
            {
                teamA += ph.TeamAScore.HandScore;
                ph.TeamAScore.GameScore = teamA;
                teamB += ph.TeamBScore.HandScore;
                ph.TeamBScore.GameScore = teamB;
            }

            evt.CurrentGame.Teams[0].Score = teamA;
            evt.CurrentGame.Teams[1].Score = teamB;

            await eventService.UpdateAsync(evt);
            return evt;
        }

        //private EventModel UpdateSnapsh

        private int GetScore(EventModel evt, Models.Suit suit, int tricks)
        {
            int score = 0;
            
            switch (suit)
            {
                case Models.Suit.Spades: score = 60; break;
                case Models.Suit.Clubs: score = 80; break;
                case Models.Suit.Diamonds: score = 100; break;
                case Models.Suit.Hearts: score = 120; break;
                case Models.Suit.NoTrump: score = 140; break;
                case Models.Suit.Nil: score = (evt.NilAlone ? 250 : 150); break;
            }

            if (suit != Models.Suit.Nil)
            {
                score += (tricks - 6) * 100;
            }

            return score;
        }

        public async Task<List<StatisticGroupModel>> GetStatistics(string eventId, string gameId)
        {
            var evt = await eventService.GetEventById(eventId);
            if (evt == null)
                return null;
           

            return GetGameStatistic(evt, gameId);
        }

        public List<StatisticGroupModel> GetGameStatistic(EventModel evt, string gameId)
        {
            var result = new List<StatisticGroupModel>();

            var game =
               string.IsNullOrWhiteSpace(gameId) || evt.CurrentGame.Id == gameId ? evt.CurrentGame :
               evt.PastGames.FirstOrDefault(x => x.Id == gameId);
            if (game == null)
                return null;

            //var gamePage = new StatisticsPageModel() { Name = "Games" };
            //var userPage = new StatisticsPageModel() { Name = "Users" };
            //result.Pages.Add(gamePage);
            //result.Pages.Add(userPage);


            var hands =
                game.CurrentHand == null ?
                game.PastHands :
                new HandModel[] { game.CurrentHand }.Union(game.PastHands).ToList();
            var nonNilHands = hands.Where(x => x.Suit != Models.Suit.Nil).ToList();


            var overall = new StatisticGroupModel()
            {
                Name = "Overall"
            };
            result.Add(overall);
            var sets = hands.Count(x => x.TeamAScore.HandScore < 0 || x.TeamBScore.HandScore < 0);
            // add # of hands, sets, made
            overall.Statistics.Add(new StatModel() { Name = "Hands", Value = hands.Count.ToString(), NumericValue = hands.Count });
            overall.Statistics.Add(GetCountAndPercent("Made", (hands.Count - sets), hands.Count));
            overall.Statistics.Add(GetCountAndPercent("Set", sets, hands.Count));
            // add how much teams underbid on average
            var underBids = nonNilHands.Where(x => !x.WasAdjusted && x.ActualTricks >= x.Bid);
            if (underBids.Count() > 2)
            {
                var underBidAvg = Convert.ToDecimal(underBids.Average(x => x.ActualTricks - x.Bid));
                overall.Statistics.Add(new StatModel() { Name = "Underbid Avg", Value = underBidAvg.ToString("f2"), NumericValue = underBidAvg });
            }
            // count by suit
            var countsBySuit = hands.GroupBy(x => x.Suit).Select(x => GetCountAndPercent(x.Key.ToString(), x.Count(), hands.Count)).ToList();
            result.Add(GetStatisticGroup("Suits", countsBySuit));

            // count by bid
            var countsByBid = nonNilHands.GroupBy(x => x.Bid).Select(x => GetCountAndPercent(x.Key.ToString(), x.Count(), nonNilHands.Count)).ToList();
            if (countsByBid.Any())
                result.Add(GetStatisticGroup("Bids", countsByBid));

            // count by user
            var countsByUser = hands.GroupBy(x => x.BidUserId).Select(x => GetCountAndPercent(GetUsername(evt, x.Key), x.Count(), hands.Count)).ToList();
            result.Add(GetStatisticGroup("Calls by User", countsByUser));


            return result;
        }

        private string GetUsername(EventModel evt, string userId)
        {
            return evt.Users.FirstOrDefault(x => x.Id == userId).Name ?? "UNKNOWN";
        }

        private StatisticGroupModel GetStatisticGroup(string groupName, List<StatModel> stats)
        {
            return new StatisticGroupModel()
            {
                Name = groupName,
                Statistics = stats
            };
        }

        private StatModel GetCountAndPercent(string name, int itemCount, int? totalCount = null)
        {
            if (totalCount == null)
            {
                return new StatModel()
                {
                    Name = name,
                    NumericValue = itemCount,
                    Value = itemCount.ToString()
                };
            }

            var pct = itemCount / Convert.ToDecimal(totalCount);
            return new StatModel()
            {
                Name = name,
                NumericValue = pct,
                Value = $"{itemCount} - {pct:P1}"
            };                
        }
    }    
}
