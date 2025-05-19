namespace Application.DTOs
{
    public class HistoryDTO
    {
        public DateTime VisitDateTime { get; set; }
        public bool IsFromRecs { get; set; }
        public int PlaceId { get; set; }
        public virtual PlaceDTODefaultCard Place { get; set; } = null!;
    }
}
