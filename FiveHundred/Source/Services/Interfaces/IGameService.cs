using FiveHundred.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FiveHundred.Services
{
    public interface IGameService
    {
        Task<EventModel> StartGame(StartGameRequestModel model);
        Task<EventModel> Bid(BidRequestModel model);
        Task<EventModel> Score(ScoreRequestModel model);
        Task<EventModel> EndCurrentGame(string eventId);
        Task<EventModel> AdjustScore(AdjustScoreRequest model);
        Task<List<StatisticGroupModel>> GetStatistics(string eventId, string gameId);
        List<StatisticGroupModel> GetGameStatistic(EventModel evt, string gameId);
    }
}