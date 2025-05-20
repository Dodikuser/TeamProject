namespace Application.DTOs
{
    public class PhotoDTO
    {
        public ulong PhotoId { get; set; }
        public string Path { get; set; }



        public ulong PlaceId { get; set; }

        // Связь с Place

        public virtual PlaceDTOFull Place { get; set; } = null!;
    }
}
