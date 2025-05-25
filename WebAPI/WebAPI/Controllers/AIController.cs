using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Application.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly WtfService _wtfService;
        private readonly GmapsService _gmapsService;

        public AIController(WtfService wtfService, GmapsService gmapsService)
        {
            _wtfService = wtfService;
            _gmapsService = gmapsService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> AiPlaceSearch(
            [FromQuery] string text,
            [FromQuery] List<ulong>? hashTagIds,
            [FromQuery] int radius,
            [FromQuery] double latitude,
            [FromQuery] double longitude)
        {
            var dto = await _wtfService.AiPlaceSearch(text, hashTagIds, radius, longitude, latitude);

            foreach (var x in dto.GooglePlaceIds)
            {
                Console.WriteLine("------------------------------------------------------------------" + x);
            }

            return Ok(dto);
        }

        [HttpGet("recommend")]
        public async Task<IActionResult> AiPlaceRecommendation(
            [FromQuery] ulong hashTagId,
            [FromQuery] int radius,
            [FromQuery] double latitude,
            [FromQuery] double longitude)
        {
            var dto = await _wtfService.AiPlaceRecommendation(hashTagId, radius, longitude, latitude);
            return Ok(dto);
        }

        [HttpGet("reverseGeocoding")]
        public async Task<IActionResult> ReverseGeocodingAsync2([FromQuery] double latitude, [FromQuery] double longitude)
        {
            var x = await _gmapsService.ReverseGeocodingAsync(latitude, longitude);
            return Ok(x);
        }
    }
}