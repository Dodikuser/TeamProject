using Application.DTOs.UserDTOs;
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

        public async Task<RegisterStatus> Register(UserRegisterDTO loginData)
        {

            if (loginData.FacebookId != null)
                return await RegisterUserFacebook(loginData.FacebookId);
            else if (loginData.GoogleId != null)
                return await RegisterUserGoogle(loginData.GoogleId);
            else if (loginData.Password != null)
                return await RegisterUserDefault(loginData.Name, loginData.Name, loginData.Email, loginData.Password);


            return RegisterStatus.UnknownOathProvider;

        }
        private async Task<RegisterStatus> RegisterUserDefault(string firstName, string? lastName, string email, string password)
        {
            if (await _userRepository.GetByEmailAsync(email) != null)
                return RegisterStatus.EmailBusy;

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

            return RegisterStatus.Success;
        }
        private async Task<RegisterStatus> RegisterUserGoogle(string googleId)
        {
            if (await _userRepository.GetByGoogleIdAsync(googleId) != null)
                return RegisterStatus.EmailBusy;

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

            return RegisterStatus.Success;
        }
        private async Task<RegisterStatus> RegisterUserFacebook(string facebookId)
        {
            if (await _userRepository.GetByGoogleIdAsync(facebookId) != null)
                return RegisterStatus.EmailBusy;

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

            return RegisterStatus.Success;

        }

        public async Task<LoginStatus> LoginUser(UserLoginDTO loginData)
        {




            if (loginData.GoogleId != null)
                return await LoginUserGoogle(loginData.GoogleId);
            else if (loginData.FacebookId != null)
                return await LoginUserFacebook(loginData.FacebookId);
            else if (loginData.PasswordHash != null)
                return await LoginUserDefault(loginData.Email, loginData.PasswordHash);



            return LoginStatus.UnknownOathProvider;

        }
        private async Task<LoginStatus> LoginUserDefault(string email, string password)
        {
            bool userExists = await _userRepository.ExistsByEmailAsync(email);

            if (!userExists)
                return LoginStatus.IncorrectEmail;

            string passwordHash = HashFunction(password);

            bool isPasswordValid = await _userRepository.IsPasswordValidByEmailAsync(email, passwordHash);

            return isPasswordValid
                ? LoginStatus.Success
                : LoginStatus.IncorrectPassword;
        }
        private async Task<LoginStatus> LoginUserGoogle(string googleId)
        {
            if (await _userRepository.GetByGoogleIdAsync(googleId) == null)
                return LoginStatus.UnregisteredGoogle;

            return LoginStatus.Success;
        }
        private async Task<LoginStatus> LoginUserFacebook(string facebookId)
        {
            if (await _userRepository.GetByFacebookIdAsync(facebookId) == null)
                return LoginStatus.UnregisteredFacebook;

            return LoginStatus.Success;
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
