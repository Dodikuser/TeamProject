using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/data")]
    public class DataController : ControllerBase
    {
        [HttpPost]
        public IActionResult ReceiveData([FromBody] MessageModel request)
        {
            Console.WriteLine($"Received message: {request.Message}");
            return Ok(new { response = $"Received: {request.Message}" });
        }
    }

    public class MessageModel
    {
        public string Message { get; set; }
    }

}
