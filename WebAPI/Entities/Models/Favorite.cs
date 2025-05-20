using Entities.Interfaces;

namespace Entities.Models
{
    public class Favorite : IDbEntity
    {
        public ulong Id { get; set; }
        public DateTime FavoritedAt { get; set; }

        public ulong UserId { get; set; }
        public ulong PlaceId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Place Place { get; set; } = null!;
    }
}
