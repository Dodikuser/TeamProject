using Entities.Interfaces;

namespace Entities.Models
{
    public class Hashtag : IDbEntity
    {
        public ulong Id { get; set; }
        public string Tag { get; set; }
        public int Price { get; set; }
        public string? Prompt { get;set; }



        public virtual ICollection<AdHashtag> AdHashtags { get; set; } = new List<AdHashtag>();
        //public virtual ICollection<PlaceType> PlaceTypes { get; set; } = new List<PlaceType>();

    }
}
