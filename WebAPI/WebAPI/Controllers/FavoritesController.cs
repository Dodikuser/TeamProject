using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/favorites")]
    public class FavoritesController : ControllerBase
    {
        private readonly PlaceService _placeService;
        public FavoritesController(PlaceService placeService)
        {
            _placeService = placeService;
        }

        [HttpGet]
        public IActionResult GetFavorites() => Ok();

        [HttpPost("search")]
        public IActionResult SearchFavorites([FromBody] object filters) => Ok();

        [Authorize]
        [HttpPost("action")]
        public async Task<IActionResult> FavoriteAction(string gmapsPlaceId, FavoriteActionEnum action)
        {
            int userId = Convert.ToInt32(User.FindFirst("Id")!.Value);
            await _placeService.FavoriteAction(userId, gmapsPlaceId, action);
            return Ok();
        } 
    }
}
