using Microsoft.AspNetCore.Mvc;

namespace FiveHundred.Host.Controllers
{
    [Route("healthcheck")]
    public class HealthCheckController : Controller
    {
        [HttpGet()]
        public IActionResult Healthcheck()
        {
            return Ok();
        }
    }
}
