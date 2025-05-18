using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class UserDTO
    {
        public string Name { get; set; }

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool SearchHistoryOn { get; set; }
        public bool VisitHistoryOn { get; set; }

        // Навигационные свойства: Search, History, Favorite, Place, Review

        public virtual ICollection<SearchDTO> Searches { get; set; } = new List<SearchDTO>();
        public virtual ICollection<ReviewDTO> Reviews { get; set; } = new List<ReviewDTO>();
        public virtual ICollection<HistoryDTO> Histories { get; set; } = new List<HistoryDTO>();
        public virtual ICollection<FavoriteDTO> Favorites { get; set; } = new List<FavoriteDTO>();
        public virtual ICollection<PlaceDTO> Places { get; set; } = new List<PlaceDTO>();
    }
}
