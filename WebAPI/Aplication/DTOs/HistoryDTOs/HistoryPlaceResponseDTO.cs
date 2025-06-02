namespace Application.DTOs
{
    public class HistoryPlaceResponseDTO
    {
        public ulong? HistoryId { get; set; }
        public DateTime VisitDateTime { get; set; }
        public string GmapsPlaceId { get; set; }
        public PlaceDTODefaultCard placeDTO { get; set; }
    }
}
