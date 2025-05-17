namespace Entities.Models
{
    public class AdHashtag
    {
        public int PromotionCount { get; set; }


        public int PlaceId { get; set; }
        public int HashtagId { get; set; }

        // Связь с Place и Hashtag

        public virtual Place Place { get; set; } = null!;
        public virtual Hashtag Hashtag { get; set; } = null!;
    }
}
