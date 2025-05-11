using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetRecommendations([FromBody] object tegs)
        {
            return Ok(); 
        }

        [HttpPost("search")]
        public IActionResult SearchRecommendations()
        {
            return Ok();
        }
    }
}
