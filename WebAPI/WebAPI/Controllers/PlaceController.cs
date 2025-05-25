using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Entities.Models;
using Application;
using Application.DTOs;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaceController(PlaceService _placeService, GmapsService _gmapsService) : ControllerBase
    {

        /// <summary> Получить список своих мест. </summary>
        [HttpGet("my")]
        [Authorize]
        public IActionResult GetMyPlaces(int skip = 0, int take = 50)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            return Ok(_placeService.GetByUserIdAsync(userId, skip, take));
        }

        /// <summary> Получить информацию о конкретном своем месте. </summary>
        /// <exception cref="HttpRequestException">If status code from map API is not Success code</exception>
        /// <exception cref="Exception">If status code != OK</exception>
        [HttpGet("info/")]
        public async Task<IActionResult> GetPlaceInfo(string placeId)
        {
            Place place = await _placeService.RegisterPlaceIfNotExist(placeId);
            PlaceDTOFull placeInfo = PlaceTypesConverter.ToDTOFull(place);

            return Ok(new { placeInfo });
        }

        /// <summary> Обновить информацию о своем месте. </summary>
        [HttpPut("my/{placeId}/info")]
        public IActionResult UpdatePlaceInfo(int placeId, [FromBody] object placeInfo) => Ok();

        /// <summary> Обновить настройки своего места. </summary>
        [HttpPut("my/{placeId}/settings")]
        public IActionResult UpdatePlaceSettings(int placeId, [FromBody] object settings) => Ok();

        /// <summary> Получить список всех мест (для модераторов). </summary>
        [HttpGet]
        public IActionResult GetAllPlaces() => Ok();

        /// <summary> Поиск по всем местам (фильтры и пагинация). </summary>
        [HttpPost("search")]
        public IActionResult SearchPlaces([FromBody] object filters) => Ok();

        /// <summary> Привязать пользователя к месту. </summary>
        [HttpPost("{placeId}/bind-user")]
        public IActionResult BindUserToPlace(int placeId, [FromBody] object bindRequest) => Ok();
    }

}
