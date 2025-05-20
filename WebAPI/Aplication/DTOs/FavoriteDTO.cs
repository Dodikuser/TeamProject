namespace Application.DTOs
{
    public class FavoriteDTO
    {
        public DateTime FavoritedAt { get; set; }
        public ulong PlaceId { get; set; }
        public virtual PlaceDTODefaultCard Place { get; set; } = null!;
    }
}
