namespace Application.DTOs
{
    public class HistoryPlaceRequestDTO
    {
        public ulong? HistoryId { get; set; }
        public DateTime? VisitDateTime { get; set; }
        public string? GmapsPlaceId { get; set; }
        public bool? IsFromRecs { get; set; }
    }
}
