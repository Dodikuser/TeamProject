namespace Application.DTOs
{
    public class FavoriteDTO
    {
        public DateTime FavoritedAt { get; set; }
        public ulong UserId { get; set; }
        public ulong PlaceId { get; set; }
    }
}
