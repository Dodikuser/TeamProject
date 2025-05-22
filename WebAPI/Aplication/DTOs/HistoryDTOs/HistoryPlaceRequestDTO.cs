namespace Application.DTOs
{
    public class HistoryPlaceRequestDTO
    {
        public DateTime? VisitDateTime { get; set; }
        public string? GmapsPlaceId { get; set; }
        public bool? IsFromRecs { get; set; }
    }
}
