using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/history/requests")]
    public class HistoryRequestsController : ControllerBase
    {
        [Authorize]
        [HttpPost("get")]
        public IActionResult GetHistory(int skip = 0, int take = 10)
        {

            return Ok();
        }

        [Authorize]
        [HttpPost("search")]
        public IActionResult Search(string keyword, int skip = 0, int take = 10)
        {

            return Ok();
        }

        [Authorize]
        [HttpPost("action")]
        public IActionResult HistoryAction(HistoryActionEnum historyAction)
        {

           return Ok();
        }
    }

}
