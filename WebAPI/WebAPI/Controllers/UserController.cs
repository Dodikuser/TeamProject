using Microsoft.AspNetCore.Authorization;
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
        private readonly AuthorizationService _authorizationService;
        private readonly UserService _userService;

        public UserController(AuthorizationService authorizationService, TokenService tokenService, UserService userService)
        {
            _authorizationService = authorizationService;
            _tokenService = tokenService;
            _userService=userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(LoginData loginData) 
        {
            var result = await _authorizationService.Register(loginData);

            if (!result.Success)
                return BadRequest(result.Error);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginData loginData)
        {
            var result = await _authorizationService.LoginUser(loginData);

            if (!result.Success)
                return BadRequest(result.Error);

            var token = await _tokenService.GenerateToken(loginData);
            return Ok(token);
        }


        [Authorize]
        [HttpPost("incognito")]
        public async Task<IActionResult> SetIncognitoMode(bool enabled)
        {
            int userId = Convert.ToInt32(User.FindFirst("UserId").Value);

            var result = await _userService.SetIncognito(userId, !enabled);

            if (!result.Success)
                return BadRequest(result.Error);
            return Ok();
        } 
    }

}
