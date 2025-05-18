namespace Application.DTOs
{
    public class HashtagDTO
    {
        public string Tag { get; set; }
        public int Price { get; set; }
        public virtual ICollection<AdHashtagDTO> AdHashtags { get; set; } = new List<AdHashtagDTO>();
    }
}
