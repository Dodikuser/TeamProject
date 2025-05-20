using Application.DTOs.UserDTOs;
using Application.Services;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;


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
        public async Task<IActionResult> Register(LoginData loginData)
        {
            Entities.Result result = await _authorizationService.Register(loginData);

            if (!result.Success)
                return BadRequest(result.Error);
            return Ok(new { message = "Регистрация прошла успешно" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginData loginData)
        {
            var result = await _authorizationService.LoginUser(loginData);

            if (!result.Success)
                return BadRequest(result.Error);

            var token = await _tokenService.GenerateToken(loginData);
            return Ok(new { token });
        }


        [Authorize]
        [HttpPost("incognito")]
        public async Task<IActionResult> SetIncognitoMode(bool enabled)
        {
            int userId = Convert.ToInt32(User.FindFirst("Id")!.Value);

            Entities.Result result = await _userService.SetIncognito(userId, !enabled);

            if (!result.Success)
                return BadRequest(result.Error);
            return Ok();
        }

        [Authorize]
        [HttpPost("info")]
        public async Task<IActionResult> GetUserInfo(UserDTOEnum dataType)
        {
            int userId = Convert.ToInt32(User.FindFirst("Id")!.Value);

            if (!UserService._userDtoTypes.TryGetValue(dataType, out var expectedType))
            {
                return BadRequest($"Unknown DTO type for: {dataType}");
            }

            Type type = UserService._userDtoTypes[dataType];

            var method = typeof(UserService)
                .GetMethod("GetUserInfo")!
                .MakeGenericMethod(type);

            var task = (Task)method.Invoke(_userService, new object[] { userId, dataType })!;

            await task.ConfigureAwait(false);

            var resultProperty = task.GetType().GetProperty("Result");
            dynamic result = resultProperty.GetValue(task);

            if (result == null || result.GetType() != expectedType)
            {
                return StatusCode(500, $"Handler returned unexpected type: {result?.GetType().Name}, expected: {expectedType.Name}");
            }

            return Ok(new { userDTO = result });
        }

    }

}
