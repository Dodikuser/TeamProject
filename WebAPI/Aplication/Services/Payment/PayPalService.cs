using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Services.Payment;
using Entities;
using Entities.Models;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;

namespace Application.Services.Payment
{
    public class PayPalService
    {
        private readonly MyDbContext _dbContext;
        private readonly Config _config;
        private readonly PayPalHttpClient _client;

        public PayPalService(MyDbContext dbContext, Config config)
        {
            _dbContext = dbContext;
            _config = config;

            PayPalEnvironment environment = config.PayPalOptions.UseSandbox
                ? new SandboxEnvironment(config.PayPalOptions.ClientId, config.PayPalOptions.Secret)
                : new LiveEnvironment(config.PayPalOptions.ClientId, config.PayPalOptions.Secret);


            _client = new PayPalHttpClient(environment);
        }

        public async Task<PaymentOrder> CapturePaymentAsync(string orderId, ulong userId)
        {
            var orderRequest = new OrdersGetRequest(orderId);
            var response = await _client.Execute(orderRequest);

            if (response.StatusCode != System.Net.HttpStatusCode.OK)
                throw new Exception("Failed to retrieve PayPal order.");

            var order = response.Result<Order>();
            if (order.Status != "COMPLETED")
                throw new Exception($"PayPal order is not completed. Status: {order.Status}");

            var purchaseUnit = order.PurchaseUnits.FirstOrDefault();
            if (purchaseUnit == null || purchaseUnit.Payments?.Captures == null || !purchaseUnit.Payments.Captures.Any())
                throw new Exception("No capture information found.");

            var capture = purchaseUnit.Payments.Captures.First();
            var transactionId = capture.Id;
            var amount = decimal.Parse(capture.Amount.Value);
            var currency = capture.Amount.CurrencyCode;

            DateTime createTime;
            var timeStr = capture.CreateTime ?? order.CreateTime;

            if (!DateTime.TryParse(timeStr, out createTime))
            {
                createTime = DateTime.UtcNow;
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new Exception("User not found.");

            var exists = await _dbContext.PaymentOrders
                .AnyAsync(p => p.ProviderTransactionId == transactionId);

            if (exists)
                throw new Exception("Payment already processed.");

            var paymentOrder = new PaymentOrder
            {
                ProviderTransactionId = transactionId,
                Provider = "PayPal",
                Success = true,
                AmountInMinorUnits = amount * 100,
                Currency = currency,
                CreatedAt = createTime,
                TokensAmount = 0,
                DeliveredAt = DateTime.MinValue,
                UserId = user.Id,
                User = user
            };

            await _dbContext.PaymentOrders.AddAsync(paymentOrder);
            await _dbContext.SaveChangesAsync();

            return paymentOrder;
        }
    }
}
