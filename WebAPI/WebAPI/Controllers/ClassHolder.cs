namespace WebAPI.Controllers
{
    public abstract class LoginData { }

    public class StandardLoginData : LoginData
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class GoogleLoginData : LoginData
    {
        public string GoogleId { get; set; }
    }

    public class FacebookLoginData : LoginData
    {
        public string FacebookId { get; set; }
    }
}
