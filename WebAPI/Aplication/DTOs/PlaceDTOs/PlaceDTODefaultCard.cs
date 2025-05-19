namespace Application.DTOs
{
    public class PlaceDTODefaultCard
    {
        public string Name { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Radius { get; set; }
        public string GmapsPlaceId { get; set; }
        public virtual ICollection<PhotoDTO> Photos { get; set; } = new List<PhotoDTO>();

        //сука рейтинга нет и всей остальной лабуды

    }
}
