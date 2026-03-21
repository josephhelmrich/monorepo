using FiveHundred.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Repository
{

    public class EventEntity: MongoEntity
    {
        public string Name { get; set; } = string.Empty;
        public DateTime? Created { get; set; } = DateTime.Now;
        public string CreatedByUser { get; set; } = string.Empty;
        public int VersionNumber { get; set; } = 1;

        public GameEntity CurrentGame { get; set; } = new GameEntity();
        public List<GameEntity> PastGames { get; set; } = new List<GameEntity>();
        public List<UserEntity> Users { get; set; } = new List<UserEntity>();
        public List<FuckinChadEntity> FuckingChads { get; set; } = new List<FuckinChadEntity>();
        public int WinningScore { get; set; } = 500;
        public List<string> Chadisms { get; set; } = new List<string> { };
        public int ChadIndex { get; set; } = -1;
        public bool NilAlone { get; set; } = false;
    }

    public class GameEntity : MongoEntity
    {
        public List<TeamEntity> Teams { get; set; } = new List<TeamEntity>();
        public HandEntity CurrentHand { get; set; } = new HandEntity();
        public List<HandEntity> PastHands { get; set; } = new List<HandEntity>();
    }

    public class FuckinChadEntity
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string Chadism { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public DateTime CreateDate { get; set; }
    }

    public class TeamEntity : MongoEntity
    {
        public string Name { get; set; } = string.Empty;
        public List<string> UserIds { get; set; } = new List<string>();
        public int Score { get; set; } = 0;
        public StatisticsEntity Stats { get; set; } = new StatisticsEntity();
    }

    public class UserEntity : MongoEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public StatisticsEntity Statistics { get; set; } = new StatisticsEntity();
    }

    public class StatisticsEntity
    {
        public int Calls { get; set; } = 0;
        public int SetOpponents { get; set; } = 0;
        public int GotSet { get; set; } = 0;
        public int PointsTaken { get; set; } = 0;
        public int PointsGiven { get; set; } = 0;
        public List<HandEntity> Hands { get; set; } = new List<HandEntity>();
    }

    public class HandEntity: MongoEntity
    {
        public string BidTeamId { get; set; }
        public string BidUserId { get; set; }
        [BsonRepresentation(BsonType.String)]
        public Suit Suit { get; set; }
        public int Bid { get; set; } = 0;
        public int ActualTricks { get; set; } = 0;
        public int PotentialScore { get; set; } = 0;
        public int PartnerTricks { get; set; } = 0;
        public bool WasAdjusted { get; set; } = false;
        public ScoreSnapshotEntity TeamAScore { get; set; }
        public ScoreSnapshotEntity TeamBScore { get; set; }
    }

    public class ScoreSnapshotEntity
    {
        public int HandScore { get; set; }
        public int GameScore { get; set; }
    }

}