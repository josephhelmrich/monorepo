using FiveHundred.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace FiveHundred.Host
{
    [Route("api/event")]
    [ApiController]
    public class FiveHundredController : ControllerBase
    {
        protected async Task<IActionResult> TryAsync<T>(Func<Task<T>> action, bool allowNullResult = false)
        {
            try
            {
                var result = await action();
                if (result == null)
                {
                    if (allowNullResult)
                        return NoContent();
                    else
                        return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return HandleError(ex);
            }
        }

        protected async Task<IActionResult> TryAsync(Func<Task> action)
        {
            try
            {
                await action();
                return Ok();
            }
            catch (Exception ex)
            {
                return HandleError(ex);
            }
        }

        protected void PublishException(Exception ex)
        {
            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("JoeHelmrich@gmail.com", "isevcutoounqxkif"),
                    EnableSsl = true,
                    UseDefaultCredentials = false
                };

                smtpClient.Send("FiveHundred@joe5hundo.com", "JoeHelmrich@gmail.com", "Error", ex.ToString());
            }
            catch (Exception exInner)
            {
                System.Diagnostics.Debug.WriteLine(new Exception(exInner.Message, ex).ToString());
            }
        }

        private IActionResult HandleError(Exception ex)
        {
            PublishException(ex);
            if (ex is BadRequestException)
                return BadRequest(ex.Message);
            else
                return StatusCode(500, ex.ToString());
        }
    }
}
