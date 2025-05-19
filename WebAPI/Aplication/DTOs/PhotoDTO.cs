namespace Application.DTOs
{
    public class PhotoDTO
    {
        public int PhotoId { get; set; }
        public string Path { get; set; }



        public int PlaceId { get; set; }

        // Связь с Place

        public virtual PlaceDTOFull Place { get; set; } = null!;
    }
}
