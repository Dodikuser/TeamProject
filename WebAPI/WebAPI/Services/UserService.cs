using System.Security.Claims;

namespace WebAPI.Services
{
    public class UserService
    {
        private readonly AuthorizationService _authorizationService;
        private readonly UserRepository _userRepository;


        public UserService(AuthorizationService authorizationService, UserRepository userRepository)
        {
            _authorizationService= authorizationService;
            _userRepository=userRepository;
        }

        public async Task<Result> SetIncognito(ClaimsPrincipal claimsPrincipal, bool enabled)
        {
            int UsetId = await _authorizationService.GetUserIdAsync(claimsPrincipal);
            await _userRepository.SetVisitHistoryAsync(UsetId, enabled);
            await _userRepository.SetSearchHistoryAsync(UsetId, enabled);

            return Result.Ok();
        }
    }
}
