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
    public class UserController(AuthorizationService _authorizationService, TokenService _tokenService, UserService _userService) : ControllerBase
    {


        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO registerData)
        {
            RegisterStatus result = await _authorizationService.Register(registerData);

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
        public async Task<IActionResult> SetIncognitoMode([FromBody] bool enabled)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);

            Entities.Result result = await _userService.SetIncognito(userId, !enabled);

            if (!result.Success)
                return BadRequest(result.Error);
            return Ok();
        }


        [HttpPost("get")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUser()
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            UserDTO? user = await _userService.GetUserDTOAsync(userId);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPost("get-public")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserPublic()
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            UserPublicDTO? user = await _userService.GetUserPublicDTO(userId);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPatch("edit")]
        [Authorize]
        public async Task<IActionResult> EditUser(UserEditDTO userDTO)
        {
            if (userDTO.Name == "")
                return BadRequest();

            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            var result = await _userService.EditUser(userId, userDTO);

            return result == UserEditStatus.Success ? Ok() : BadRequest(result);
        }

        [HttpPatch("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(ulong userToBanId)
        {
            ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
            UserDeleteStatus result = await _userService.DeleteUser(userId, userToBanId);
            switch (result)
            {
                case UserDeleteStatus.UserNotExists:
                    return NotFound();
                case UserDeleteStatus.CantbanUsers:
                    return Forbid();
            }
            return Ok();
        }
    }

}
