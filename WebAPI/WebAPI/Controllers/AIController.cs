using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application;
using Entities.Models;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly WtfService _wtfService;
        private readonly GmapsService _gmapsService;
        private readonly PlaceService _placeService;

        public AIController(WtfService wtfService, GmapsService gmapsService, PlaceService placeService)
        {
            _wtfService = wtfService;
            _gmapsService = gmapsService;
            _placeService = placeService;
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
            AiPlaceSearchDTO dto = await _wtfService.AiPlaceRecommendation(hashTagId, radius, longitude, latitude);

            var resultList = new List<PlaceDTODefaultCard>();

            foreach (var placeId in dto.GooglePlaceIds)
            {
                Place place = await _placeService.RegisterPlaceIfNotExist(placeId);

                PlaceDTODefaultCard placeInfo = PlaceTypesConverter.ToDTODefault(place);

                resultList.Add(placeInfo);
            }

            return Ok(resultList);
        }


        [HttpGet("reverseGeocoding")]
        public async Task<IActionResult> ReverseGeocodingAsync2([FromQuery] double latitude, [FromQuery] double longitude)
        {
            var x = await _gmapsService.ReverseGeocodingAsync(latitude, longitude);
            return Ok(x);
        }
    }
}