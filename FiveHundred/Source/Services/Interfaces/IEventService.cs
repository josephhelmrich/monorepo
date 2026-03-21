using FiveHundred.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FiveHundred.Services
{
    public interface IEventService
    {
        Task<EventModel> GetEventById(string Id);
        Task<EventModel> Create(CreateEventRequestModel request);
        Task<EventModel> Join(JoinEventRequestModel request);
        Task<bool> UpdateAsync(EventModel model);
        Task<EventModel> Refresh(RefreshRequestModel model);
#if DEBUG
        Task<long> DeleteAll();
#endif

        /// <summary>
        /// Creates a new fucking chad with a random chadism
        /// </summary>
        /// <param name="eventId"></param>
        /// <param name="fromUserId"></param>
        /// <param name="toUserId"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        Task<EventModel> FuckingChad(string eventId, string fromUserId, string toUserId);

        /// <summary>
        /// Updates the winning score for the event
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        Task<EventModel> UpdateSettings(string eventId, int score, bool nilAlone);

        Task<StatisticsModel> GetStatistics(string eventId, string gameId = null);

        Task<EventModel> ForceRefresh(string eventId);
        Task<List<RecentEventModel>> GetRecentEventsAsync();
    }
}