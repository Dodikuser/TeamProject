namespace Entities.Models
{
    public class Photo
    {
        public int PhotoId { get; set; }
        public string Path { get; set; }



        public int PlaceId { get; set; }

        // Связь с Place

        public virtual Place Place { get; set; } = null!;
    }
}
