using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class ReviewDTO
    {
        public int ReviewId { get; set; }
        public string? Text { get; set; }

        [Range(1, 5)]
        public int Stars { get; set; }
        public DateTime ReviewDateTime { get; set; }




        public int PlaceId { get; set; }
        public int UserId { get; set; }

        // Связь с Place и User

        public virtual PlaceDTO Place { get; set; } = null!;
        public virtual UserDTO User { get; set; } = null!;
    }
}
