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

        public async Task<Result> SetIncognito(int userId, bool enabled)
        {
            await _userRepository.SetVisitHistoryAsync(userId, enabled);
            await _userRepository.SetSearchHistoryAsync(userId, enabled);

            return Result.Ok();
        }
    }
}
