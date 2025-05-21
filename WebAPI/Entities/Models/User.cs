using Entities.Interfaces;

namespace Entities.Models
{
    public class User : IDbEntity
    {
        public ulong Id { get; set; }
        public string Name { get; set; }

        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? GoogleId { get; set; }
        public string? FacebookId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? OauthProvider { get; set; }
        public bool SearchHistoryOn { get; set; }
        public bool VisitHistoryOn { get; set; }
        public bool IsAdmin { get; set; }




        // Навигационные свойства: Search, History, Favorite, Place, Review

        public virtual ICollection<Search> Searches { get; set; } = new List<Search>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<History> Histories { get; set; } = new List<History>();
        public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public virtual ICollection<Place> Places { get; set; } = new List<Place>();
    }
}
