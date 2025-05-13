using WebAPI.EF.Models;
using WebAPI.Controllers;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebAPI.Services
{

    public class AuthorizationService
    {
        private readonly UserRepository _userRepository;

        public AuthorizationService(UserRepository userRepository)
        {
            _userRepository=userRepository;
        }

        public async Task<Result> Register(LoginData loginData)
        {
            switch (loginData)
            {
                case StandardLoginData standard:
                    return await RegisterUsereDefault(standard.Name, standard.Name, standard.Email, standard.Password);

                case GoogleLoginData google:
                    return await RegisterUserGoogle(google.GoogleId);

                case FacebookLoginData facebook:
                    return await RegisterUserFacebook(facebook.FacebookId);

                default:
                    return Result.Fail("Unknown login type.");
            }
        }

        public async Task<Result> RegisterUsereDefault(string firstName, string? lastName, string email, string password)
        {
            if (_userRepository.GetByEmailAsync(email) != null) 
                return Result.Fail("this email is already registered");

            string passwordHash = Convert.ToString(password.GetHashCode()); // можно сделать через другую хеш функцию
            User user = new User()
            {
                Name = firstName,
                Email = email,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.Now,
                SearchHistoryOn = true,
                VisitHistoryOn = true
            };

           await _userRepository.AddAsync(user);

            return Result.Ok();
        }
        public async Task<Result> RegisterUserGoogle(string googleId)
        {
            if (_userRepository.GetByGoogleIdAsync(googleId) != null)
                return Result.Fail("this email is already registered");

            // нужно вытянуть из googleId 
            string name = "";
            string email = "";

            User user = new User()
            {
                Name = name,
                Email = email,
                GoogleId = googleId,
                CreatedAt = DateTime.Now,
                SearchHistoryOn = true,
                VisitHistoryOn = true
            };

            await _userRepository.AddAsync(user);

            return Result.Ok();
        }
        public async Task<Result> RegisterUserFacebook(string facebookId)
        {
            if (_userRepository.GetByGoogleIdAsync(facebookId) != null)
                return Result.Fail("this facebook account is already registered");

            // нужно вытянуть из FacebookId 
            string name = "";
            string email = "";

            User user = new User()
            {
                Name = name,
                Email = email,
                FacebookId = facebookId,
                CreatedAt = DateTime.Now,
                SearchHistoryOn = true,
                VisitHistoryOn = true
            };

            await _userRepository.AddAsync(user);

            return Result.Ok();

        }

        public async Task<Result> LoginUser(ClaimsPrincipal claimsPrincipal)
        {
            int userId = await GetUserIdAsync(claimsPrincipal);

            if (_userRepository.GetByIdAsync(userId) == null)
                return Result.Fail("user not found");
            else 
                return Result.Ok();
        }

        public async Task<int> GetUserIdAsync(ClaimsPrincipal claimsPrincipal)
        {
            var authType = claimsPrincipal.FindFirst("auth_type")?.Value;

            if (string.IsNullOrEmpty(authType))
                throw new UnauthorizedAccessException("Authentication type is missing.");

            User? user = authType switch
            {
                "standard" =>
                    await _userRepository.GetByEmailAsync(claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty),

                "google" =>
                    await _userRepository.GetByGoogleIdAsync(claimsPrincipal.FindFirst("google_id")?.Value ?? string.Empty),

                "facebook" =>
                    await _userRepository.GetByFacebookIdAsync(claimsPrincipal.FindFirst("facebook_id")?.Value ?? string.Empty),

                _ => throw new UnauthorizedAccessException("Unsupported authentication type.")
            };

            if (user == null)
                throw new UnauthorizedAccessException("User not found.");

            return user.UserId;
        }  
    }
}
