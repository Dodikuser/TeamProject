namespace WebAPI.EF.Models
{
    public class Hashtag
    {
        public int HashtagId { get; set; }
        public string Tag { get; set; }
        public int Price { get; set; }



        public virtual ICollection<AdHashtag> AdHashtags { get; set; } = new List<AdHashtag>();
    }
}
