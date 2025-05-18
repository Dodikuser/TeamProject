using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class LoginDTO
    {

        public string Name { get; set; }

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? GoogleId { get; set; }
        public string? FacebookId { get; set; }
        public string? OauthProvider { get; set; }
    }
}
