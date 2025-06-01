using Application.Services.Email;
using Application.Services.Payment;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly PayPalService _payPalService;


        public PaymentsController(PayPalService payPalService)
        {
            _payPalService = payPalService;

        }

        [Authorize]
        [HttpPost("paypal/complete")]
        public async Task<IActionResult> CompletePayPalPayment([FromBody] string payPalOrderId)
        {
            try
            {
                ulong userId = Convert.ToUInt64(User.FindFirst("Id")!.Value);
                var paymentOrder = await _payPalService.CapturePaymentAsync(payPalOrderId, userId);
                return Ok(new { success = true, paymentId = paymentOrder.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }


}
