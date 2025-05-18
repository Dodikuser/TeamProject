using Entities.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models
{
    public class Review : IDbEntity
    {
        public int Id { get; set; }
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
        public DateTime ReviewDateTime { get; set; }




        public int PlaceId { get; set; }
        public int UserId { get; set; }

        // Связь с Place и User

        public virtual Place Place { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
