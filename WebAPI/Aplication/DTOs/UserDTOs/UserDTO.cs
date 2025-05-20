using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class UserDTO
    {
        public string Name { get; set; }

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format.")]
        public string? Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool SearchHistoryOn { get; set; }
        public bool VisitHistoryOn { get; set; }
    }
}
