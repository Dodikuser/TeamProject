using System.ComponentModel.DataAnnotations;

namespace WebAPI.EF.Models
{
    public class Place
    {

        public int PlaceId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        [RegularExpression(@"^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$", ErrorMessage = "Invalid site URL format.")]
        public string? Site { get; set; }

        [RegularExpression(@"^\+?[1-9]\d{1,14}$", ErrorMessage = "Invalid phone number format.")]
        public string? PhoneNumber { get; set; }

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format.")]
        public string? Email { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Radius { get; set; }
        public int? TokensAvailable { get; set; }
        public DateTime? LastPromotionDateTime { get; set; }

        //это не внешний ключ
        public string GmapsPlaceId { get; set; }



        public int UserId { get; set; }

        // Связь с User, Review, History, Favorite, Photo, AdHashtag

        public virtual User User { get; set; } = null!;
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<History> Histories { get; set; } = new List<History>();
        public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public virtual ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public virtual ICollection<AdHashtag> AdHashtags { get; set; } = new List<AdHashtag>();
    }
}
