using Application.DTOs.UserDTOs;
using Application.Services.Email;
using Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class EmailConfirmationService
    {
        private IMail _mailService;
        private EmailTemplateService _emailTemplateService;
        private ConfirmationCodeRespository _confirmationCodeRespository;
        private PlaceRepository _placeRepository;

        public EmailConfirmationService(IMail mailService, EmailTemplateService emailTemplateService, ConfirmationCodeRespository confirmationCodeRespository, PlaceRepository placeRepository)
        {
            this._mailService = mailService;
            this._emailTemplateService = emailTemplateService;
            this._confirmationCodeRespository = confirmationCodeRespository;
            this._placeRepository = placeRepository;
        }

        public async Task SendCodeAsync(ulong placeId, ulong userId)
        {

            var place = await _placeRepository.GetByIdAsync(placeId);
            if (place == null) throw new ArgumentException("Место еще не добавлено");
            if (string.IsNullOrWhiteSpace(place.Email)) throw new ArgumentException("это место без имейла");

            var code = await _confirmationCodeRespository.CreateCodeAsync(placeId, userId);
            var htmlBody = await _emailTemplateService.GetConfirmationEmailBodyAsync(code.Code);
            _mailService.SendEmailAsync(place.Email, "Код підтвердження для AroundMe", htmlBody);

        }

        public async Task<bool> VerifyCodeAsync(ulong placeId, ulong userId, string input)
        {
            //надо бы сделать _confirmationCodeRespository.VerifyCodeAsync разбить на подметоды, но работает и так 
            var ans = await _confirmationCodeRespository.VerifyCodeAsync(placeId, userId, input);
            return ans;
        }
    }
}
