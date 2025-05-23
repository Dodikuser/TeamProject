using Application.DTOs;
using Application.Services;
using Entities.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController(ReviewService _reviewService) : ControllerBase
    {

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddReview([FromBody] ReviewDTO review)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);

            review.UserId = userId;
            review.ReviewDateTime = DateTime.UtcNow;

            await _reviewService.AddAsync(review);
            return Ok();
        }

        [HttpGet("get")]
        [Authorize]
        public async Task<IActionResult> GetReviews(ulong placeId, int skip = 0, int take = 10)
        {
            return Ok(await _reviewService.GetAsync(placeId, skip, take));
        }

        [HttpPut("edit")]
        [Authorize]
        public async Task<IActionResult> EditReview(ulong reviewId, ReviewDTO review)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            ReviewOperationResult result = await _reviewService.EditAsync(review, reviewId, userId);
            switch (result)
            {
                case ReviewOperationResult.Success:
                    return Ok();
                case ReviewOperationResult.NotFound:
                    return NotFound();
                case ReviewOperationResult.AccessDenied:
                    return Forbid();
                default: return BadRequest();
            }
        }

        [HttpDelete("remove")]
        [Authorize]
        public async Task<IActionResult> RemoveReview(ulong reviewId)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            ReviewOperationResult result = await _reviewService.RemoveAsync(reviewId, userId);
            switch (result)
            {
                case ReviewOperationResult.Success:
                    return Ok();
                case ReviewOperationResult.NotFound:
                    return NotFound();
                case ReviewOperationResult.AccessDenied:
                    return Forbid();
                default: return BadRequest();
            }
        }
    }

}
