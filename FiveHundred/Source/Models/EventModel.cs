using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Models
{
    public class MongoModel
    {
        public string Id { get; set; } = string.Empty;
        public DateTime? Updated { get; set; }
    }

    public class EventModel : MongoModel
    {
        public string Name { get; set; } = string.Empty;
        public DateTime? Created { get; set; } = DateTime.Now;
        public string CreatedByUser { get; set; } = string.Empty;
        public int VersionNumber { get; set; } = 1;


        public GameModel CurrentGame { get; set; } = null;
        public List<GameModel> PastGames { get; set; } = new List<GameModel>();
        public List<UserModel> Users { get; set; } = new List<UserModel>();
        public List<FuckinChadModel> FuckingChads { get; set; } = new List<FuckinChadModel>();

        public int WinningScore { get; set; } = 500;
        public bool NilAlone { get; set; } = false;

        public List<string> Chadisms { get; set; } = new List<string> { };
        public int ChadIndex { get; set; } = -1;
    }

    public class GameModel : MongoModel
    {
        public List<TeamModel> Teams { get; set; }= new List<TeamModel>();
        public HandModel CurrentHand { get; set; } = null;
        public List<HandModel> PastHands { get; set; } = new List<HandModel>();
    }

    public class FuckinChadModel
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Chadism { get; set; }
        public DateTime CreateDate { get; set; }
    }

    public class TeamModel : MongoModel
    {
        public string Name { get; set; } = string.Empty;
        public List<string> UserIds { get; set; } = new List<string>();
        public int Score { get; set; } = 0;
        //public StatisticsModel Stats { get; set; } = new StatisticsModel();
    }

    public class UserModel : MongoModel
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        //public StatisticsModel Statistics { get; set; } = new StatisticsModel();
    }

    public class StatisticsModel
    {
        public List<StatisticsPageModel> Pages { get; set; } = new List<StatisticsPageModel>();
    }

    public class StatisticsPageModel
    {
        public string Name { get; set; }
        public List<StatisticGroupModel> Groups { get; set; } = new List<StatisticGroupModel>();
    }

    public class StatisticGroupModel
    {
        public string Name { get; set; }
        public List<StatModel> Statistics { get; set; } = new List<StatModel>();
    }

    public class StatModel
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public decimal? NumericValue { get; set; } = null;
        //public DateTime? DateValue { get; set; } = null;
    }



    //public class StatisticsModel
    //{
    //    public int Calls { get; set; } = 0;
    //    public int SetOpponents { get; set; } = 0;
    //    public int GotSet { get; set; } = 0;
    //    public int PointsTaken { get; set; } = 0;
    //    public int PointsGiven { get; set; } = 0;
    //    public List<HandModel> Hands { get; set; } = new List<HandModel>();
    //}

    public class HandModel: MongoModel
    {
        public string BidTeamId { get; set; }
        public string BidUserId { get; set; }
        public Suit Suit { get; set; }
        public int Bid { get; set; } = 0;
        public int ActualTricks { get; set; } = 0;
        public int PotentialScore { get; set; } = 0;
        public int PartnerNilTricks { get; set; } = 0;
        public bool WasAdjusted { get; set; } = false;

        public ScoreSnapshotModel TeamAScore { get; set; } = new ScoreSnapshotModel();
        public ScoreSnapshotModel TeamBScore { get; set; } = new ScoreSnapshotModel();
    }

    public class ScoreSnapshotModel
    {
        public int HandScore { get; set; }
        public int GameScore { get; set; }
    }

    public class RecentEventModel : MongoModel
    {
        public string Players { get; set; }
    }
}
