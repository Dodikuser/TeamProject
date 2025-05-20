namespace Application.DTOs
{
    public class HistoryDTO
    {
        public DateTime VisitDateTime { get; set; }
        public bool IsFromRecs { get; set; }
        public ulong PlaceId { get; set; }
        public virtual PlaceDTODefaultCard Place { get; set; } = null!;
    }
}
