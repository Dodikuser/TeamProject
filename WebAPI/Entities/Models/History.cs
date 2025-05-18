using Entities.Interfaces;

namespace Entities.Models
{
    public class History : IDbEntity
    {
        public int Id { get; set; }
        public DateTime VisitDateTime { get; set; }
        public bool IsFromRecs { get; set; }



        public int UserId { get; set; }
        public int PlaceId { get; set; }

        // Связь с User и Place

        public virtual Place Place { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
