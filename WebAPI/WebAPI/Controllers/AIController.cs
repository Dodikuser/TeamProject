using Microsoft.AspNetCore.Mvc;
using WebAPI.Services.AI;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService;

        public AIController(IAIService aiService)
        {
            _aiService = aiService;
        }

        [HttpGet("generate")]
        public async Task<IActionResult> Generate([FromQuery] string prompt)
        {
            if (string.IsNullOrWhiteSpace(prompt))
                return BadRequest("Prompt is required.");

            var result = await _aiService.GenerateTextAsync(prompt);
            return Ok(result);
        }
    }
}
