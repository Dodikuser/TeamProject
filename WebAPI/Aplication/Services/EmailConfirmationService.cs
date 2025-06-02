using Application.Services.Email;
using Infrastructure.Repository;

namespace Application.Services
{
    public class EmailConfirmationService
    {
        private IMail _mailService;
        private EmailTemplateService _emailTemplateService;
        private ConfirmationCodeRepository _confirmationCodeRepository;
        private PlaceRepository _placeRepository;

        public EmailConfirmationService(IMail mailService, EmailTemplateService emailTemplateService, ConfirmationCodeRepository confirmationCodeRespository, PlaceRepository placeRepository)
        {
            this._mailService = mailService;
            this._emailTemplateService = emailTemplateService;
            this._confirmationCodeRepository = confirmationCodeRespository;
            this._placeRepository = placeRepository;
        }

        public async Task SendCodeAsync(ulong placeId, ulong userId)
        {

            var place = await _placeRepository.GetByIdAsync(placeId);
            if (place == null) throw new ArgumentException("Место еще не добавлено");
            if (string.IsNullOrWhiteSpace(place.Email)) throw new ArgumentException("это место без имейла");

            var code = await _confirmationCodeRepository.CreateCodeAsync(placeId, userId);
            var htmlBody = await _emailTemplateService.GetConfirmationEmailBodyAsync(code.Code);
            _mailService.SendEmailAsync(place.Email, "Код підтвердження для AroundMe", htmlBody);

        }

        public async Task<bool> VerifyCodeAsync(ulong placeId, ulong userId, string input)
        {
            //надо бы сделать _confirmationCodeRepository.VerifyCodeAsync разбить на подметоды, но работает и так 
            var ans = await _confirmationCodeRepository.VerifyCodeAsync(placeId, userId, input);
            return ans;
        }
    }
}
