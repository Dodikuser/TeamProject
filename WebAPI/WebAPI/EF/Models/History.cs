namespace WebAPI.EF.Models
{
    public class History
    {
        public int HistoryId { get; set; }
        public DateTime VisitDateTime { get; set; }
        public bool IsFromRecs { get; set; }



        public int UserId { get; set; }
        public int PlaceId { get; set; }

        // Связь с User и Place

        public virtual Place Place { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
