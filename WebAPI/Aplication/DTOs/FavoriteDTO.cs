namespace Application.DTOs
{
    public class FavoriteDTO
    {
        public DateTime FavoritedAt { get; set; }
        public int PlaceId { get; set; }
        public virtual PlaceDTODefaultCard Place { get; set; } = null!;
    }
}
