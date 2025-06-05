using Application;
using Application.DTOs;
using Application.Services;
using Entities;
using Entities.Models;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly WtfService _wtfService;
        private readonly GmapsService _gmapsService;
        private readonly PlaceService _placeService;
        private readonly Config _config;
        private readonly UserRepository _userRepository;

        public AIController(WtfService wtfService, GmapsService gmapsService, PlaceService placeService, UserRepository userRepository, Config config)
        {
            _wtfService = wtfService;
            _gmapsService = gmapsService;
            _placeService = placeService;
            _userRepository = userRepository;
            _config = config;
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> AiPlaceSearch(
            [FromQuery] string text,
            [FromQuery] List<ulong>? hashTagIds,
            [FromQuery] int radius,
            [FromQuery] double latitude,
            [FromQuery] double longitude)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);

            try
            {
                await _userRepository.RemoveTokensAsync(userId, _config.SearchPrice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }


            var dto = await _wtfService.AiPlaceSearch(text, hashTagIds, radius, longitude, latitude);

            foreach (var x in dto.GooglePlaceIds)
            {
                Console.WriteLine("---->" + x);
            }

            var resultList = new List<PlaceDTODefaultCard>();

            foreach (var placeId in dto.GooglePlaceIds)
            {
                Place place = await _placeService.RegisterPlaceIfNotExist(placeId);

                PlaceDTODefaultCard placeInfo = PlaceTypesConverter.ToDTODefault(place);

                resultList.Add(placeInfo);
            }

            return Ok(resultList);
        }

        [HttpGet("recommend")]
        public async Task<IActionResult> AiPlaceRecommendation(
            [FromQuery] ulong hashTagId,
            [FromQuery] int radius,
            [FromQuery] double latitude,
            [FromQuery] double longitude,
            [FromQuery] string tag
            )

        {
            AiPlaceSearchDTO dto = await _wtfService.AiPlaceRecommendation(hashTagId, radius, longitude, latitude, tag);

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