using Entities;
using Entities.Models;
using Infrastructure.Repository;
using System.Security.Cryptography;
using System.Text;


namespace Application.Services
{

    public class AuthorizationService
    {
        private readonly UserRepository _userRepository;

        public AuthorizationService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Entities.Result> Register(LoginData loginData)
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
                    return Entities.Result.Fail("Unknown login type.");
            }
        }
        private async Task<Entities.Result> RegisterUsereDefault(string firstName, string? lastName, string email, string password)
        {
            if (await _userRepository.GetByEmailAsync(email) != null)
                return Entities.Result.Fail("this email is already registered");

            string passwordHash = HashFunction(password);
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
        private async Task<Result> RegisterUserGoogle(string googleId)
        {
            if (await _userRepository.GetByGoogleIdAsync(googleId) != null)
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
        private async Task<Result> RegisterUserFacebook(string facebookId)
        {
            if (await _userRepository.GetByGoogleIdAsync(facebookId) != null)
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

        public async Task<Result> LoginUser(LoginData loginData)
        {
            switch (loginData)
            {
                case StandardLoginData standard:
                    return await LoginUsereDefault(standard.Email, standard.Password);

                case GoogleLoginData google:
                    return await LoginUserGoogle(google.GoogleId);

                case FacebookLoginData facebook:
                    return await LoginUserFacebook(facebook.FacebookId);

                default:
                    return Result.Fail("Unknown login type.");
            }
        }
        private async Task<Entities.Result> LoginUsereDefault(string email, string password)
        {
            bool userExists = await _userRepository.ExistsByEmailAsync(email);

            if (!userExists)
                return Entities.Result.Fail("Incorrect email");

            string passwordHash = HashFunction(password);

            bool isPasswordValid = await _userRepository.IsPasswordValidByEmailAsync(email, passwordHash);

            return isPasswordValid
                ? Entities.Result.Ok()
                : Entities.Result.Fail("Incorrect password");
        }
        private async Task<Entities.Result> LoginUserGoogle(string googleId)
        {
            if (await _userRepository.GetByGoogleIdAsync(googleId) == null)
                return Entities.Result.Fail("this email is not registered");

            return Entities.Result.Ok();
        }
        private async Task<Entities.Result> LoginUserFacebook(string facebookId)
        {
            if (await _userRepository.GetByFacebookIdAsync(facebookId) == null)
                return Entities.Result.Fail("this facebook is not registered");

            return Entities.Result.Ok();
        }

        public string HashFunction(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                    builder.Append(b.ToString("x2"));
                return builder.ToString();
            }
        }

    }
}
