namespace Application.DTOs
{
    public class PlaceDTODefaultCard
    {
        public string Name { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Radius { get; set; }
        public string GmapsPlaceId { get; set; }
        public ICollection<PhotoDTO> Photos { get; set; } = new List<PhotoDTO>();
        public int Stars { get; set; }

        //сука рейтинга нет и всей остальной лабуды

    }
}
