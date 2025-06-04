using Application.DTOs;
using Application.Services;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly PlaceService _placeService;
        public FavoritesController(PlaceService placeService)
        {
            _placeService = placeService;
        }

        [Authorize]
        [HttpGet("get")]
        public async Task<IActionResult> GetFavorites(int skip = 0, int take = 10)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            Stopwatch sw = new Stopwatch();
            sw.Start();
            List<FavoriteDTO> favorites = await _placeService.GetFavorites(userId, skip, take);
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("GetFavorites take - " + sw.Elapsed.ToString());
            Console.ForegroundColor = ConsoleColor.White;
            return Ok(new { favorites });
        }

        [Authorize]
        [HttpPost("search")]
        public async Task<IActionResult> SearchFavorites(string keyWord, int skip = 0, int take = 10)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            List<FavoriteDTO> results = await _placeService.SearchFavorites(userId, keyWord, skip, take);
            return Ok(new { results });
        }

        [Authorize]
        [HttpPost("action")]
        public async Task<IActionResult> FavoriteAction(string gmapsPlaceId, FavoriteActionEnum action)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            await _placeService.FavoriteAction(userId, gmapsPlaceId, action);
            return Ok();
        }

        [Authorize]
        [HttpPost("isFavorite")]
        public async Task<IActionResult> IsFavorite(ulong placeId)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            return Ok(await _placeService.IsFavorite(userId, placeId));
        }
    }
}
