using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpPost("register")]
        public IActionResult Register() => Ok();

        [HttpPost("login")]
        public IActionResult Login() => Ok();

        [HttpPost("incognito")]
        public IActionResult SetIncognitoMode() => Ok();
    }

}
