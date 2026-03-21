using FiveHundred.Models;
using FiveHundred.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FiveHundred.Host.Controllers
{
    [Route("api/event")]
    [ApiController]
    public class EventController : FiveHundredController
    {
        private readonly IEventService eventService;

        public EventController(IEventService eventService)
        {
            this.eventService = eventService;
        }

        [HttpGet("{eventId}")]
        public async Task<IActionResult> Get([FromRoute] string eventId)
        {
            if (string.IsNullOrWhiteSpace(eventId) || eventId.Length != ValidationConstants.ObjectIdLength)
                return BadRequest($"Invalid {nameof(eventId)}");

            return await TryAsync(async () =>
            {
                return await this.eventService.GetEventById(eventId);
            });
        }


        [HttpGet("refresh/{eventId}/{versionNumber}")]
        [ResponseCache(NoStore = true)]
        public async Task<IActionResult> Refresh([FromRoute] string eventId, [FromRoute] int versionNumber)
        {
            if (string.IsNullOrWhiteSpace(eventId) || eventId.Length != ValidationConstants.ObjectIdLength)
                return BadRequest($"Invalid {nameof(eventId)}");
            if (versionNumber <= 0)
                return BadRequest($"Invalid {nameof(versionNumber)}");

            return await TryAsync(async () =>
            {
                return await this.eventService.Refresh(new RefreshRequestModel()
                {
                    EventId = eventId,
                    VersionNumber = versionNumber
                });
            }, allowNullResult: true);
        }

        [HttpGet("refresh/{eventId}/force")]
        [ResponseCache(NoStore = true)]
        public async Task<IActionResult> ForceRefresh([FromRoute] string eventId)
        {
            if (string.IsNullOrWhiteSpace(eventId) || eventId.Length != ValidationConstants.ObjectIdLength)
                return BadRequest($"Invalid {nameof(eventId)}");

            return await TryAsync(async () =>
            {
                return await this.eventService.ForceRefresh(eventId);
            }, allowNullResult: true);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEventRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await TryAsync(async () =>
            {
                return await this.eventService.Create(model);
            });
        }

        [HttpPut("join")]
        public async Task<IActionResult> Join([FromBody] JoinEventRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await TryAsync(async () =>
            {
                return await this.eventService.Join(model);
            });
        }


#if DEBUG
        [HttpDelete("delete-all")]
        public async Task<IActionResult> DeleteAll()
        {
            return await TryAsync(async () =>
            {
                return await this.eventService.DeleteAll();
            });
        }
#endif

        [HttpPost("fucking-chad")]
        public async Task<IActionResult> FuckingChad(string eventId, string fromUserId, string toUserId)
        {
            return await TryAsync(async () =>
            {
                return await this.eventService.FuckingChad(eventId, fromUserId, toUserId);
            });
        }


        [HttpPut("update-settings")]
        public async Task<IActionResult> UpdateSettings(string eventId, int score, bool nilAlone)
        {
            return await TryAsync(async () =>
            {
                return await this.eventService.UpdateSettings(eventId, score, nilAlone);
            });
        }


        [HttpGet("stats")]
        public async Task<IActionResult> GetStatistics(string eventId, string gameId = null)
        {
            return await TryAsync(async () =>
            {
                return await this.eventService.GetStatistics(eventId, gameId);
            });
        }


        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentEvents()
        {
            return await TryAsync(async () =>
            {
                return await this.eventService.GetRecentEventsAsync();
            });
        }
    }
}
