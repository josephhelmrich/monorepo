using FiveHundred.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FiveHundred.Services
{
    public interface IStatisticsService
    {
        List<StatisticGroupModel> GetGameStatistic(EventModel evt, string gameId);
        StatisticsModel GetEventStatistics(EventModel evt, string gameId = null);
    }
}