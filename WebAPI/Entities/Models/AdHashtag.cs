using Entities.Interfaces;

namespace Entities.Models
{
    public class AdHashtag : IDbEntity
    {
        public ulong Id { get; set; }
        public int PromotionCount { get; set; }


        public ulong PlaceId { get; set; }
        public ulong HashtagId { get; set; }

        // Связь с Place и Hashtag

        public virtual Place Place { get; set; } = null!;
        public virtual Hashtag Hashtag { get; set; } = null!;

    }
}
