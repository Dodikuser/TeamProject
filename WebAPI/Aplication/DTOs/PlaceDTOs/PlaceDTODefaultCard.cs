namespace Application.DTOs
{
    public class PlaceDTODefaultCard
    {
        public string Name { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string GmapsPlaceId { get; set; }
        public PhotoDTO Photo { get; set; }
        public int Stars { get; set; }

    }
}
