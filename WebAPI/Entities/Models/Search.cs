using Entities.Interfaces;

namespace Entities.Models
{
    public class Search : IDbEntity
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime SearchDateTime { get; set; }


        public int UserId { get; set; }

        // Связь с User

        public virtual User User { get; set; } = null!;
    }
}
