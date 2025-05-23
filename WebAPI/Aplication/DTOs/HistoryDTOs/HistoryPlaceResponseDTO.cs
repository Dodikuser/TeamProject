namespace Application.DTOs
{
    public class HistoryPlaceResponseDTO
    {
        public DateTime VisitDateTime { get; set; }
        public string GmapsPlaceId { get; set; }
        public PlaceDTODefaultCard placeDTO { get; set; }
    }
}
