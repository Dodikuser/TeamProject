using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Entities;
using Entities.Models;
using Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Application.Services.Email;

namespace Application.Services.Payment
{
    public class OrderService : BackgroundService
    {
        private readonly ILogger<OrderService> _logger;
        private readonly IServiceProvider _services;
        private readonly Config _config;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);

        public OrderService(
            ILogger<OrderService> logger,
            IServiceProvider services,
            Config config)
        {
            _logger = logger;
            _services = services;
            _config = config;
        }

        public PaymentOrder ProcessOrder(PaymentOrder order)
        {
            if (!order.Success)
                throw new InvalidOperationException("Payment was not successful.");

            if (order.DeliveredAt != DateTime.MinValue)
                throw new InvalidOperationException("Order already delivered.");

            if (!_config.TokensPerCurrency.TryGetValue(order.Currency, out var rate))
                throw new Exception($"Unsupported currency: {order.Currency}");

            // Вычисляем токены
            var amount = order.AmountInMinorUnits / 100m;
            var tokens = (int)(amount * rate);

            // Обновляем заказ
            order.TokensAmount = tokens;
            order.DeliveredAt = DateTime.UtcNow;
            order.User.TokensAvailable += tokens;

            return order;
        }

        // Фоновая задача (наследуем от BackgroundService)
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OrderService background task started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessPendingOrdersAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in OrderService background task.");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        // Обработка невыполненных заказов
        private async Task ProcessPendingOrdersAsync(CancellationToken ct)
        {
            using var scope = _services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<EmailTemplateService>();
            var mailService = scope.ServiceProvider.GetRequiredService<IMail>();

            var pendingOrders = await dbContext.PaymentOrders
                .Where(o => o.Success && o.DeliveredAt == DateTime.MinValue)
                .Include(o => o.User)
                .ToListAsync(ct);

            foreach (var order in pendingOrders)
            {
                try
                {
                    ProcessOrder(order);
                    await dbContext.SaveChangesAsync(ct);

                    try
                    {
                        var html = await emailService.GetReceiptEmailBodyAsync(
                            provider: order.Provider,
                            amount: order.AmountInMinorUnits / 100m,
                            currency: order.Currency,
                            tokens: order.TokensAmount,
                            transactionId: order.ProviderTransactionId,
                            date: order.CreatedAt
                        );

                        await mailService.SendEmailAsync(order.User.Email, "Квитанція про оплату", html);
                        _logger.LogInformation($"Email sent for order {order.Id}.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send email for order {order.Id}.");
                    }

                    _logger.LogInformation($"Processed order {order.Id} for user {order.UserId}.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Failed to process order {order.Id}.");
                }
            }
        }



    }
}