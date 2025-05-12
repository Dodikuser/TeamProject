using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/favorites")]
    public class FavoritesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetFavorites() => Ok();

        [HttpPost("search")]
        public IActionResult SearchFavorites([FromBody] object filters) => Ok();

        [HttpPost("add")]
        public IActionResult AddFavorite([FromBody] object favoriteItem) => Ok();

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteFavorite(int id) => Ok();
    }
}
