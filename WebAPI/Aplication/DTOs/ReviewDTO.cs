using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class ReviewDTO
    {
        [MaxLength(250)]
        public string? Text { get; set; }

        [Range(1, 5)]
        public int Price { get; set; }
        [Range(1, 5)]
        public int Quality { get; set; }
        [Range(1, 5)]
        public int Congestion { get; set; }
        [Range(1, 5)]
        public int Location { get; set; }
        [Range(1, 5)]
        public int Infrastructure { get; set; }
        [Range(1, 5)]
        public int Stars { get; set; } // пускай будет общая оценка тоже - OK
        public DateTime ReviewDateTime { get; set; }

        public string GmapId { get; set; }
        public ulong? PlaceId { get; set; }
        public ulong UserId { get; set; }
        // поля которые заполняются только если дто полетит ОТ апи
        public string? UserName { get; set; }
        public PhotoDTO? Photo { get; set; }
    }
}
