using FiveHundred.Models;
using FiveHundred.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Services
{
    public class StatisticsService : IStatisticsService
    {
        private const string NAME_HANDS = "Called";
        private const string NAME_POINTS = "Points";
        private const string NAME_HANDS_MADE = "Made";
        private const string NAME_HANDS_SET = "Set";
        private const string NAME_UNDERBID = "Underbid Avg";
        private const string NAME_SUITS = "Suits";
        private const string NAME_BIDS = "Bids";
        private const string NAME_SETS = "Sets";
        private const string NAME_POINTS_PER_USER = "Points by Player";
        private const string NAME_CALLS_PER_USER = "Calls by Player";
        private const string NAME_FCS = "Fucking Chads";
        private const string NAME_FCS_PER_USER = "Fucking Chads by Player";
        private const string NAME_SETS_PER_USER = "Sets by Player";

        public StatisticsService()
        {
        }

        public List<StatisticGroupModel> GetGameStatistic(EventModel evt, string gameId)
        {
            var result = new List<StatisticGroupModel>();

            var game =
               string.IsNullOrWhiteSpace(gameId) || evt.CurrentGame.Id == gameId ? evt.CurrentGame :
               evt.PastGames.FirstOrDefault(x => x.Id == gameId);
            if (game == null)
                return null;

            var hands =
                game.CurrentHand == null ?
                game.PastHands :
                new HandModel[] { game.CurrentHand }.Union(game.PastHands).ToList();
            hands = hands.Where(x => !x.WasAdjusted).ToList();
            
            var overall = new StatisticGroupModel()
            {
                Name = "Overall"
            };
            result.Add(overall);

            if (game.Teams.Count == 2 && game.Teams[0].UserIds.Count == 2 && game.Teams[1].UserIds.Count == 2)
            {
                var scoreStats = new List<StatModel>(2);

                scoreStats.Add(new StatModel() { Name = $"{GetUsername(evt, game.Teams[0].UserIds[0])} & {GetUsername(evt, game.Teams[0].UserIds[1])}", Value = game.Teams[0].Score.ToString(), NumericValue = game.Teams[0].Score });
                scoreStats.Add(new StatModel() { Name = $"{GetUsername(evt, game.Teams[1].UserIds[0])} & {GetUsername(evt, game.Teams[1].UserIds[1])}", Value = game.Teams[1].Score.ToString(), NumericValue = game.Teams[1].Score });

                overall.Statistics.AddRange(scoreStats.OrderByDescending(x => x.NumericValue));
            }

            AddStatitics(evt, hands, result, overall, true, false);

            return result;
        }

        public StatisticsModel GetEventStatistics(EventModel evt, string gameId = null)
        {
            var result = new StatisticsModel();

            var allGames = evt.PastGames.Where(x => x.PastHands.Count > 0).ToList();
            if (evt.CurrentGame?.PastHands?.Count > 0)
                allGames.Add(evt.CurrentGame);

            var hands =
                allGames
                .SelectMany(x => x.PastHands.Where(y => y.TeamAScore.HandScore != 0 || y.TeamBScore.HandScore != 0))
                .ToList();
            // exclude hands where the score was manually adjusted
            hands = hands.Where(x => !x.WasAdjusted).ToList();

            var overall = new StatisticsPageModel()
            {
                Name = "Overall"
            };
            result.Pages.Add(overall);

            var overallGroup = new StatisticGroupModel()
            {
                Name = "Overall"
            };
            overall.Groups.Add(overallGroup);

            AddStatitics(evt, hands, overall.Groups, overallGroup, true);

            // total points awarded
            var totalPoints = hands.Sum(x => (x.TeamAScore?.HandScore ?? 0) + (x.TeamBScore?.HandScore ?? 0));
            overallGroup.Statistics.Insert(0, new StatModel() { Name = "Games", Value = allGames.Count.ToString(), NumericValue = allGames.Count });
            if (allGames.Count > 0)
            {
                var handsPerGame = Decimal.Round(hands.Count / Convert.ToDecimal(allGames.Count), 1);
                overallGroup.Statistics.Add(new StatModel() { Name = "Hands Per Game", Value = handsPerGame.ToString(), NumericValue = handsPerGame });

                var pointsPerGame = GetStatByName(overallGroup.Statistics, NAME_POINTS);
                if (pointsPerGame > 0)
                {
                    var ppg = Decimal.Round(pointsPerGame / Convert.ToDecimal(allGames.Count), 1);
                    overallGroup.Statistics.Add(new StatModel() { Name = "Points Per Game", Value = ppg.ToString(), NumericValue = ppg });
                }
            }


            if (allGames.Count > 0)
            { 
                var marginOfVictory = Decimal.Round(Convert.ToDecimal(allGames.Average(x => x.Teams.Count == 2 ? Math.Abs(x.Teams[0].Score - x.Teams[1].Score) : 0)), 2);
                overallGroup.Statistics.Add(new StatModel() { Name = "Margin of Victory", Value = marginOfVictory.ToString(), NumericValue = marginOfVictory });
            }

            if (evt.FuckingChads.Count > 0)
            {
                // Chads by user
                var chadsByUser = evt.Users
                    .Select(x => GetCountAndPercent(GetUsername(evt, x.Id), evt.FuckingChads.Count(y => y.ToUserId == x.Id), evt.FuckingChads.Count))
                    .OrderByDescending(x => x.NumericValue)
                    .ToList();
                overall.Groups.Add(GetStatisticGroup(NAME_FCS_PER_USER, chadsByUser));
            }

            // add "Game" stats
            var game =
               string.IsNullOrWhiteSpace(gameId) || evt.CurrentGame.Id == gameId ? evt.CurrentGame :
               evt.PastGames.FirstOrDefault(x => x.Id == gameId);
            if (game == null)
                return null;

            //var idx = allGames.IndexOf(game);
            //if (idx == -1)
            //    idx = evt.PastGames.IndexOf(game);
            //if (idx == -1)
            //    idx = evt.PastGames.Count;

            result.Pages.Add(new StatisticsPageModel() { Name = "Games", Groups = GetGameStatistic(evt, gameId) });


            // add stats for each user
            var userPages = new List<StatisticsPageModel>(4);
            foreach (var user in evt.Users)
            {
                var userHands = hands.Where(x => x.BidUserId == user.Id).ToList();
                if (userHands.Count == 0)
                    continue;
                var userGroups = new List<StatisticGroupModel>();
                userGroups.Add(new StatisticGroupModel() { Name = "Overall" });
                AddStatitics(evt, userHands, userGroups, userGroups[0], false);

                var gamesWon = allGames.Count(x => GetWinningTeam(x, evt)?.UserIds.Contains(user.Id) == true);
                userGroups[0].Statistics.Insert(0, GetCountAndPercent("Games Won", gamesWon, allGames.Count));

                var fcs = evt.FuckingChads.Count(x => x.ToUserId == user.Id);
                if (fcs > 0)
                    userGroups[0].Statistics.Insert(0, GetCountAndPercent(NAME_FCS, fcs, evt.FuckingChads.Count));

                var userPage = new StatisticsPageModel() { Name = user.Name, Groups = userGroups };
                userPages.Add(userPage);
            }

            if (userPages.Count > 0)
                result.Pages.AddRange(userPages.OrderByDescending(z => GetStatByName(z.Groups[0].Statistics, NAME_POINTS)));

            return result;
        }

        private decimal GetStatByName(List<StatModel> stats, string name)
        {
            return stats.FirstOrDefault(x => x.Name == name)?.NumericValue ?? 0;
        }

        private TeamModel GetWinningTeam(GameModel game, EventModel evt)
        {
            var ws = evt.WinningScore;
            var ls = evt.WinningScore * -1;
            return
                game.Teams
                .Where(x => x.Score >= ws || x.Score <= ls)
                .OrderByDescending(x => x.Score)
                .FirstOrDefault();
        }


        public void AddStatitics(EventModel evt, List<HandModel> hands, List<StatisticGroupModel> groupList, StatisticGroupModel overallGroup, bool includeUserStats, bool includePoints = true)
        {
            var nonNilHands = hands.Where(x => x.Suit != Models.Suit.Nil).ToList();

            var sets = hands.Count(x => x.TeamAScore.HandScore < 0 || x.TeamBScore.HandScore < 0);
            // total points awarded
            if (includePoints)
            {
                var totalPoints = hands.Sum(x => (x.TeamAScore?.HandScore ?? 0) + (x.TeamBScore?.HandScore ?? 0));
                overallGroup.Statistics.Add(new StatModel() { Name = NAME_POINTS, Value = totalPoints.ToString(), NumericValue = totalPoints });
            }
            // add # of hands, sets, made
            overallGroup.Statistics.Add(new StatModel() { Name = NAME_HANDS, Value = hands.Count.ToString(), NumericValue = hands.Count });
            overallGroup.Statistics.Add(GetCountAndPercent(NAME_HANDS_MADE, (hands.Count - sets), hands.Count));
            overallGroup.Statistics.Add(GetCountAndPercent(NAME_HANDS_SET, sets, hands.Count));
            // add how much teams underbid on average
            var underBids = nonNilHands.Where(x => x.ActualTricks >= x.Bid);
            if (underBids.Count() > 2)
            {
                var underBidAvg = Convert.ToDecimal(underBids.Average(x => x.ActualTricks - x.Bid));
                overallGroup.Statistics.Add(new StatModel() { Name = NAME_UNDERBID, Value = underBidAvg.ToString("f2"), NumericValue = underBidAvg });
            }
            // count by suit
            var countsBySuit = hands.GroupBy(x => x.Suit).Select(x => GetCountAndPercent(x.Key.ToString(), x.Count(), hands.Count)).OrderByDescending(x => x.NumericValue).ToList();
            groupList.Add(GetStatisticGroup(NAME_SUITS, countsBySuit));

            // count by bid
            var countsByBid = hands.GroupBy(x => x.Suit == Models.Suit.Nil ? "Nil" : x.Bid.ToString()).Select(x => GetCountAndPercent(x.Key.ToString(), x.Count(), hands.Count)).OrderByDescending(x => x.NumericValue).ToList();
            if (countsByBid.Any())
                groupList.Add(GetStatisticGroup(NAME_BIDS, countsByBid));

            // sets by bid
            var setByBid = hands
                .Where(x => x.TeamAScore.HandScore < 0 || x.TeamBScore.HandScore < 0)
                .GroupBy(x => x.Suit == Models.Suit.Nil ? "Nil" : x.Bid.ToString()).Select(x => GetCountAndPercent(x.Key.ToString(), x.Count(), nonNilHands.Count)).OrderByDescending(x => x.NumericValue)
                .ToList();

            if (setByBid.Any())
                groupList.Add(GetStatisticGroup(NAME_SETS, setByBid));

            if (includeUserStats)
            {
                // points by user
                var totalPointsWon = Convert.ToInt32(hands.Sum(x => GetPointsAwarded(x)));
                var pointsByUser = hands
                    .GroupBy(x => x.BidUserId)
                    .Select(x => GetCountAndPercent(GetUsername(evt, x.Key), x.Sum(y => Convert.ToInt32(GetPointsAwarded(y))), totalPointsWon))
                    .OrderByDescending(x => x.NumericValue)
                    .ToList();
                groupList.Add(GetStatisticGroup(NAME_POINTS_PER_USER, pointsByUser));

                // count by user
                var countsByUser = hands.GroupBy(x => x.BidUserId).Select(x => GetCountAndPercent(GetUsername(evt, x.Key), x.Count(), hands.Count)).OrderByDescending(x => x.NumericValue).ToList();
                groupList.Add(GetStatisticGroup(NAME_CALLS_PER_USER, countsByUser));

                // sets by user
                var setByUser = hands
                    .Where(x => x.TeamAScore.HandScore < 0 || x.TeamBScore.HandScore < 0)
                    .GroupBy(x => x.BidUserId)
                    .OrderByDescending(x => x.Count())
                    .Select(x =>  GetCountAndPercent(GetUsername(evt, x.Key), x.Count(), sets))
                    .ToList();
                groupList.Add(GetStatisticGroup(NAME_SETS_PER_USER, setByUser));
            }
        }

        private decimal GetPointsAwarded(HandModel hand)
        {
            var scores = new decimal[2]
            {
                hand.TeamAScore?.HandScore ?? 0,
                hand.TeamBScore?.HandScore ?? 0
            };

            if (Math.Abs(scores[0]) > Math.Abs(scores[1]))
                return scores[0];

            return scores[1];
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

            var pct = totalCount > 0 ? itemCount / Convert.ToDecimal(totalCount) : 0;
            return new StatModel()
            {
                Name = name,
                NumericValue = pct,
                Value = $"{itemCount} - {FormatPercent(pct)}"
            };
        }

        private string FormatPercent(decimal pct)
        {
            var result = $"{pct:P1}";
            if (pct < 0)
                result = result.Replace("-", "(") + ")";

            return result;
        }
    }
}
