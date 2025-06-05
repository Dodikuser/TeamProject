using Application.Services.Email;
using Application.Services.Payment;
using Entities;
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
        private readonly Config _config;


        public PaymentsController(PayPalService payPalService, Config config)
        {
            _payPalService = payPalService;
            _config = config;
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

        [HttpGet("conversion-table")]
        public IActionResult GetConversionTable()
        {
            // Возвращаем таблицу конвертаций токенов из конфига
            return Ok(_config.TokensPerCurrency);
        }

    }


}
