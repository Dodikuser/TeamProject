using Entities.Interfaces;

namespace Entities.Models
{
    public class Hashtag : IDbEntity
    {
        public int Id { get; set; }
        public string Tag { get; set; }
        public int Price { get; set; }



        public virtual ICollection<AdHashtag> AdHashtags { get; set; } = new List<AdHashtag>();
    }
}
