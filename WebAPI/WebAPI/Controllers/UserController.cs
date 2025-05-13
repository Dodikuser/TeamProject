using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebAPI.EF.Models;
using WebAPI.Services;


namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly TokenService _tokenService;

        [HttpPost("register")]
        public IActionResult Register(LoginData loginData) 
        {
            AuthorizationService.Register(loginData);

            return Ok();
        }

        [HttpPost("login")]
        public IActionResult Login(LoginData loginData)
        {
            //проверка юзера

            var token = _tokenService.GenerateToken(loginData);

            return Ok(token);
        } 

        [HttpPost("incognito")]
        public IActionResult SetIncognitoMode()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // дальше логика запроса в бд
            return Ok();
        } 
    }

}
