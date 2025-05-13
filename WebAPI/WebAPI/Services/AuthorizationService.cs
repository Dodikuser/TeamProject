using WebAPI.EF.Models;
using WebAPI.Controllers;

namespace WebAPI.Services
{
    public class AuthorizationService
    {
        static public void Register(LoginData loginData)
        {
            switch (loginData)
            {
                case StandardLoginData standard:
                    RegisterUsereDefault(standard.Name, standard.Name, standard.Email, standard.Password);
                    break;

                case GoogleLoginData google:
                    RegisterUserGoogle(google.GoogleId);
                    break;

                case FacebookLoginData facebook:
                    RegisterUserFacebook(facebook.FacebookId);
                    break;
            }


        }

        static public void RegisterUsereDefault(string firstName, string? lastName, string email, string password)
        {
            if (UserExist()) return;

            string passwordHash = Convert.ToString(password.GetHashCode()); // можно сделать через другую хеш функцию
            User user = new User()
            {
                UserId = 0,
                Name = firstName,
                Email = email,
                PasswordHash = passwordHash,
                //
                //
                CreatedAt = DateTime.Now,
                SearchHistoryOn = true,
                VisitHistoryOn = true
            };

            //запрос в базу на создание юзера
        }
        static public void RegisterUserGoogle(string GoogleId)
        {
            if (UserExist()) return;

        }
        static public void RegisterUserFacebook(string FacebookId)
        {
            if (UserExist()) return;

        }

        static public bool UserExist()
        {
            return false; // запрос в базу 
        }
    }
}
