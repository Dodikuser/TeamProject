namespace WebAPI.EF.Models
{
    public class Favorite
    {
        public int FavoritesId { get; set; }
        public DateTime FavoritedAt { get; set; }



        public int UserId { get; set; }
        public int PlaceId { get; set; }

        // Связь с User и Place

        public virtual User User { get; set; } = null!;
        public virtual Place Place { get; set; } = null!;
    }
}
