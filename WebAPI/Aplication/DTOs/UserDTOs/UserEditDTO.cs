using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class UserEditDTO
    {
        public string? Name { get; set; }
        public string? PasswordOld { get; set; }
        public string? PasswordNew { get; set; }
    }
}
