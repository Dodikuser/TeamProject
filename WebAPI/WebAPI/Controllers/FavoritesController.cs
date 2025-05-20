using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using System.Threading.Tasks;
using Entities.Models;

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

        [Authorize]
        [HttpPost("get")]
        public async Task<IActionResult> GetFavorites(int skip = 0, int take = 10)
        {
            int userId = Convert.ToInt32(User.FindFirst("Id")!.Value);
            List<Favorite> favorites = await _placeService.GetFavorites(userId, skip, take);
            return Ok(new { favorites });
        }

        [Authorize]
        [HttpPost("search")]
        public async Task<IActionResult> SearchFavorites(string keyWord, int skip = 0, int take = 10)
        {
            int userId = Convert.ToInt32(User.FindFirst("Id")!.Value);
            List<Favorite> results = await _placeService.SearchFavorites(userId, keyWord, skip, take);
            return Ok(new { results });
        }

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
