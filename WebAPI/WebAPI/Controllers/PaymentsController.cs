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

                // 🔵 Лог в голубом цвете
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"[INFO] Capturing PayPal payment for Order ID: {payPalOrderId}, User ID: {userId}");
                Console.ResetColor();

                var paymentOrder = await _payPalService.CapturePaymentAsync(payPalOrderId, userId);

                // Получаем сумму в основных единицах валюты
                var amount = paymentOrder.AmountInMinorUnits / 100m;

                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"[SUCCESS] Payment captured. Payment ID: {paymentOrder.Id}, Amount: {amount}");
                Console.ResetColor();

                return Ok(new { success = true, paymentId = paymentOrder.Id, amount });
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"[ERROR] PayPal payment failed: {ex.Message}");
                Console.ResetColor();

                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("conversion-table")]
        public IActionResult GetConversionTable()
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("[INFO] Fetching conversion table...");
            Console.ResetColor();

            return Ok(_config.TokensPerCurrency);
        }
    }
}
