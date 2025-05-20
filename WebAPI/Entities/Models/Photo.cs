using Entities.Interfaces;

namespace Entities.Models
{
    public class Photo : IDbEntity
    {
        public ulong Id { get; set; }
        public string Path { get; set; }

        public ulong PlaceId { get; set; }

        // Связь с Place

        public virtual Place Place { get; set; } = null!;
    }
}
