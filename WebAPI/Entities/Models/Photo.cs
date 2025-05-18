using Entities.Interfaces;

namespace Entities.Models
{
    public class Photo : IDbEntity
    {
        public int Id { get; set; }
        public string Path { get; set; }



        public int PlaceId { get; set; }

        // Связь с Place

        public virtual Place Place { get; set; } = null!;
    }
}
