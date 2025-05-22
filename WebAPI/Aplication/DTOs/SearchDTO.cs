namespace Application.DTOs
{
    public class SearchDTO
    {
        public string Text { get; set; }
        public DateTime? SearchDateTime { get; set; }
        public ulong? UserId { get; set; }
    }
}
