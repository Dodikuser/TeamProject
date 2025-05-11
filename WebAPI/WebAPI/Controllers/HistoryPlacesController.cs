using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/history/places")]
    public class HistoryPlacesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok();

        [HttpPost("search")]
        public IActionResult Search([FromBody] object filters) => Ok();

        [HttpPost("add")]
        public IActionResult Add([FromBody] object place) => Ok();

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id) => Ok();

        [HttpDelete("clear")]
        public IActionResult Clear() => Ok();
    }

}
