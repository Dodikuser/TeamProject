using System.ComponentModel.DataAnnotations;

namespace WebAPI.EF.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? GoogleId { get; set; }
        public string? FacebookId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? OauthProvider { get; set; }
        public bool SearchHistoryOn { get; set; }
        public bool VisitHistoryOn { get; set; }





        // Навигационные свойства: Search, History, Favorite, Place, Review

        public virtual ICollection<Search> Searches { get; set; } = new List<Search>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<History> Histories { get; set; } = new List<History>();
        public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public virtual ICollection<Place> Places { get; set; } = new List<Place>();
    }
}
