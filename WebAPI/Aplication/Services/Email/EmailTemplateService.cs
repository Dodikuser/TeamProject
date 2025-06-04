using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Application.Services.Email
{
    public class EmailTemplateService
    {

        public async Task<string> GetConfirmationEmailBodyAsync(string code)
        {
            var path = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "ConfirmationTemplate.html");

            var html = await File.ReadAllTextAsync(path);
            return html.Replace("{{CODE}}", code);
        }

        public async Task<string> GetReceiptEmailBodyAsync(
            string provider,
            decimal amount,
            string currency,
            int tokens,
            string transactionId,
            DateTime date)
        {
            var path = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "ReceiptTemplate.html");
            var html = await File.ReadAllTextAsync(path);

            return html
                .Replace("{{PROVIDER}}", provider)
                .Replace("{{AMOUNT}}", amount.ToString("0.00"))
                .Replace("{{CURRENCY}}", currency)
                .Replace("{{TOKENS}}", tokens.ToString())
                .Replace("{{TXID}}", transactionId)
                .Replace("{{DATE}}", date.ToString("dd.MM.yyyy HH:mm"));
        }

    }

}
