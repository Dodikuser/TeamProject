using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/history/requests")]
    public class HistoryRequestsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok();

        [HttpPost("search")]
        public IActionResult Search([FromBody] object filters) => Ok();

        [HttpPost("add")]
        public IActionResult Add([FromBody] object request) => Ok();

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id) => Ok();

        [HttpDelete("clear")]
        public IActionResult Clear() => Ok();
    }

}
