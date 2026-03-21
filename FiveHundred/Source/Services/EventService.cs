using FiveHundred.Models;
using FiveHundred.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FiveHundred.Services
{
    public class EventService : IEventService
    {
        private readonly IMongoRepository<EventEntity, EventModel> eventRepository;
        private readonly IStatisticsService statService;

        public EventService(IMongoRepository<EventEntity, EventModel> EventRepository, IStatisticsService statService)
        {
            this.eventRepository = EventRepository;
            this.statService = statService;
        }

        public async Task<EventModel> GetEventById(string Id)
        {
            if (string.IsNullOrWhiteSpace(Id))
                throw new ArgumentNullException(nameof(Id));

            return await eventRepository.GetAsync(Id);
        }

        public async Task<EventModel> Create(CreateEventRequestModel request)
        {
            var creatorId = eventRepository.GenerateId();
            var users = new List<UserModel>(4);
            users.Add(new UserModel()
            {
                Id = creatorId,
                Email = $"{request.Username}@joe5hundo.com", // request.Email,
                Name = request.Username,
            });
            if (request.OtherUsers.Any())
            {
                users.AddRange(
                    request.OtherUsers.Take(3).Select(x => new UserModel()
                    {
                        Id = eventRepository.GenerateId(),
                        Name = x,
                        Email = $"{x}@joe5hundo.com"
                    })
                );
            }

            var name = string.IsNullOrWhiteSpace(request.EventName) ? $"{request.Username}'s Game" : request.EventName;

            var evt = new EventModel()
            {
                CreatedByUser = creatorId,
                Users = users,
                Created = DateTime.UtcNow,
                Id = eventRepository.GenerateId(),
                Name = name,
                VersionNumber = 1,
                Updated = DateTime.UtcNow
            };
            var result = await eventRepository.UpsertAsync(evt);

            return evt;
        }

        public async Task<bool> UpdateAsync(EventModel model)
        {
            model.VersionNumber++;
            model.Updated = DateTime.UtcNow;
            return await this.eventRepository.UpsertAsync(model);
        }

        public async Task<EventModel> Join(JoinEventRequestModel request)
        {
            var evt = await this.eventRepository.GetAsync(request.EventId);
            if (evt == null)
                return null;

            if (evt.Users == null)
                evt.Users = new List<UserModel>();
            else
            {
                var existing = evt.Users.FirstOrDefault(x => x.Id == request.UserId);
                if (existing != null) // user alrady joined
                {
                    //if (existing.Email != request.Email) // update email if necessary
                    //{
                    //    existing.Email = request.Email;
                    //    await this.UpdateAsync(evt);
                    //}
                    return evt;
                }
            }

            //evt.Users.Add(new UserModel()
            //{
            //    Email = request.Email,
            //    Id = eventRepository.GenerateId(),
            //    Name = request.Username
            //});
            //await this.UpdateAsync(evt);

            return evt;
        }

        public async Task<EventModel> Refresh(RefreshRequestModel model)
        {
            var id = this.eventRepository.ParseId(model.EventId);
            return (await this.eventRepository.FindFirst(x => x.Id == id && x.VersionNumber > model.VersionNumber, x => x.VersionNumber, true));
        }

        public async Task<EventModel> ForceRefresh(string eventId)
        {
            var evt = await GetEventById(eventId);
            if (evt == null)
                throw new ArgumentException("eventId not found", nameof(eventId));

            await UpdateAsync(evt);
            return evt;
        }

#if DEBUG
        public async Task<long> DeleteAll()
        {
            return await this.eventRepository.DeleteAllAsync();
        }
#endif
      
        /// <summary>
        /// Creates a new fucking chad with a random chadism
        /// </summary>
        /// <param name="eventId"></param>
        /// <param name="fromUserId"></param>
        /// <param name="toUserId"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public async Task<EventModel> FuckingChad(string eventId, string fromUserId, string toUserId)
        {
            var evt = await GetEventById(eventId);
            if (evt == null)
                throw new ArgumentException("eventId not found", nameof(eventId));

            var from = evt.Users.FirstOrDefault(x => x.Id == fromUserId).Name;
            var to = evt.Users.FirstOrDefault(x => x.Id == toUserId).Name;

            if (!(evt.Chadisms?.Count > 0))
                ResetChads(evt);

            evt.ChadIndex++;
            //var chadism = ChadIndex++; // chadSelector.Next(0, Chadisms.Length - 1);

            var model = new FuckinChadModel()
            {
                Chadism = evt.Chadisms[evt.ChadIndex],
                FromUserId = fromUserId,
                From = from,
                ToUserId = toUserId,
                To = to,
                CreateDate = DateTime.UtcNow
            };

            if (evt.ChadIndex >= (evt.Chadisms.Count - 1))
                ResetChads(evt);

            evt.FuckingChads.Insert(0, model);
            await this.UpdateAsync(evt);

            return evt;
        }

        private void ResetChads(EventModel model)
        {
            Random rng = new Random();
            if (!(model.Chadisms?.Count > 0))
                model.Chadisms = Constants.Chadisms.ToList();
            model.ChadIndex = -1;

            // randmoize list of chads
            int n = model.Chadisms.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                string value = model.Chadisms[k];
                model.Chadisms[k] = model.Chadisms[n];
                model.Chadisms[n] = value;
            }
        }
        /// <summary>
        /// Updates the winning score for the event
        /// </summary>
        /// <param name="eventId"></param>
        /// <param name="fromUserId"></param>
        /// <param name="toUserId"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public async Task<EventModel> UpdateSettings(string eventId, int score, bool nilAlone)
        {
            var evt = await GetEventById(eventId);
            if (evt == null)
                throw new ArgumentException("eventId not found", nameof(eventId));

            evt.WinningScore = score;
            evt.NilAlone = nilAlone;
            await this.UpdateAsync(evt);

            return evt;
        }

        public async Task<StatisticsModel> GetStatistics(string eventId, string gameId = null)
        {
            var evt = await GetEventById(eventId);
            if (evt == null)
                throw new ArgumentException("eventId not found", nameof(eventId));

            return statService.GetEventStatistics(evt, gameId);
        }

        public async Task<List<RecentEventModel>> GetRecentEventsAsync()
        {
            var cut_off = DateTime.UtcNow.AddDays(-90);

            var sort = Builders<EventEntity>.Sort.Descending(x => x.Updated);
            var dtos = await eventRepository.FindEntityAsync(x => x.Updated >= cut_off, new FindOptions<EventEntity, EventEntity>(){Sort = sort, Limit = 5});
            if (dtos.Any())
            {
                return dtos.Select(x => new RecentEventModel()
                {
                    Id = x.Id.ToString(),
                    Updated = x.Updated,
                    Players = string.Join(", ", x.Users.Select(y => y.Name))
                }).ToList();
            }

            return new List<RecentEventModel>(0);
        }
    }
}
