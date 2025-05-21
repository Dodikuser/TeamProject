using Application.DTOs;
using Application.DTOs.UserDTOs;
using Application.Services;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


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
            _userService = userService;
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO loginData)
        {
            RegisterStatus result = await _authorizationService.Register(loginData);

            if (result != RegisterStatus.Success)
                return BadRequest(result.ToString());
            return Ok(result.ToString());
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO loginData)
        {
            LoginStatus result = await _authorizationService.LoginUser(loginData);

            if (result != LoginStatus.Success)
                return BadRequest(result.ToString());

            var token = await _tokenService.GenerateToken(loginData);
            return Ok(new { token });
        }


        [Authorize]
        [HttpPost("incognito")]
        public async Task<IActionResult> SetIncognitoMode(bool enabled)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);

            Entities.Result result = await _userService.SetIncognito(userId, !enabled);

            if (!result.Success)
                return BadRequest(result.Error);
            return Ok();
        }

        [Authorize]
        [HttpPost("get")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserInfo()
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            UserDTO? user = await _userService.GetUserDTOAsync(userId);
            return user == null ? NotFound() : Ok(user);
        }
        [Authorize]
        [HttpPost("get-public")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserPublicInfo()
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            UserPublicDTO? user = await _userService.GetUserPublicDTO(userId);
            return user == null ? NotFound() : Ok(user);
        }
    }

}
