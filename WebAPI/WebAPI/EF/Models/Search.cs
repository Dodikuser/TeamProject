namespace WebAPI.EF.Models
{
    public class Search
    {
        public int SearchId { get; set; }
        public string Text { get; set; }
        public DateTime SearchDateTime { get; set; }


        public int UserId { get; set; }

        // Связь с User

        public virtual User User { get; set; } = null!;
    }
}
