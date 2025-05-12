using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        [HttpPost("{placeId}")]
        public IActionResult AddReview(int placeId, [FromBody] object reviewDto) => Ok();

        [HttpGet("{placeId}")]
        public IActionResult GetReviews(int placeId) => Ok();

        [HttpPut("{reviewId}")]
        public IActionResult EditReview(int reviewId, [FromBody] object reviewDto) => Ok();

        [HttpDelete("{reviewId}")]
        public IActionResult DeleteReview(int reviewId) => Ok();
    }

}
