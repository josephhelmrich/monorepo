using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using FiveHundred.Services;
using FiveHundred.Models;

namespace FiveHundred.Host
{
    [Route("api/game")]
    [ApiController]
    public class GameController : FiveHundredController
    {
        private readonly IGameService gameServices;

        public GameController(IGameService gameService)
        {
            this.gameServices = gameService;
        }

        [HttpPut("start")]
        public async Task<IActionResult> Start(StartGameRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await TryAsync(async () =>
            {
                return await this.gameServices.StartGame(model);
            });
        }


        [HttpPost("end")]
        public async Task<IActionResult> End(string eventId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await TryAsync(async () =>
            {
                return await this.gameServices.EndCurrentGame(eventId);
            });
        }


        [HttpPut("bid")]
        public async Task<IActionResult> Bid(BidRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await TryAsync(async () =>
            {
                return await this.gameServices.Bid(model);
            });
        }

        [HttpPut("score")]
        public async Task<IActionResult> Score(ScoreRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await TryAsync(async () =>
            {
                return await this.gameServices.Score(model);
            });
        }

        [HttpPut("score/adjust")]
        public async Task<IActionResult> AdjustScore(AdjustScoreRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await TryAsync(async () =>
            {
                return await this.gameServices.AdjustScore(model);
            });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStatistics(string eventId, string gameId)
        {
            if (!ModelState.IsValid)
                return BadRequest("Event ID or Game ID is invalid");

            return await TryAsync(async () =>
            {
                return await this.gameServices.GetStatistics(eventId, gameId);
            });
        }

    }
}
