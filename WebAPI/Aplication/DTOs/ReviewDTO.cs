using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class ReviewDTO
    {
        public ulong ReviewId { get; set; }
        public string? Text { get; set; }

        [Range(1, 5)]
        public int Stars { get; set; }
        public DateTime ReviewDateTime { get; set; }




        public ulong PlaceId { get; set; }
        public ulong UserId { get; set; }

        // Связь с Place и User

        public virtual PlaceDTODefaultCard Place { get; set; } = null!;
        public virtual UserDTOMain User { get; set; } = null!;
    }
}
