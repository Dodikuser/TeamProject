using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Options;
using Entities;
using System.Net.Mail;
using Application.Services.Email;
using Application.Services;

public class MailService : IMail
{
    private readonly SmtpSettings _smtpSettings;

    public MailService(Config config)
    {
        _smtpSettings = config.SmtpSettings;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_smtpSettings.SenderName, _smtpSettings.SenderEmail));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;
        email.Body = new TextPart("html") { Text = htmlBody };

        using var smtp = new MailKit.Net.Smtp.SmtpClient();
        await smtp.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port,
            _smtpSettings.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto);
        await smtp.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
