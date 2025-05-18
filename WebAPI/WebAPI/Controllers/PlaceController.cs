using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaceController : ControllerBase
    {
        private readonly GmapsService _gmapsService;
        public PlaceController(GmapsService gmapsService)
        {
            _gmapsService = gmapsService;
        }

        /// <summary> Получить список своих мест. </summary>
        [HttpGet("my")]
        public IActionResult GetMyPlaces() => Ok();

        /// <summary> Получить информацию о конкретном своем месте. </summary>
        [HttpGet("info/")]
        public async Task<IActionResult> GetPlaceInfo(string placeId)
        {
            var placeInfo = await _gmapsService.GetPlaceDetailsAsync(placeId);

            return Ok( new { placeInfo });
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
