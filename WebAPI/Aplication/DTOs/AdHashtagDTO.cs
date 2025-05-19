namespace Application.DTOs
{
    public class AdHashtagDTO
    {
        public int PromotionCount { get; set; }

        public int PlaceId { get; set; }
        public int HashtagId { get; set; }

        // Связь с Place и Hashtag

        public virtual PlaceDTOFull Place { get; set; } = null!;
        public virtual HashtagDTO Hashtag { get; set; } = null!;
    }
}
