using Entities.Models;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class PlaceDTOFull
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Address { get; set; }

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
        public double Stars { get; set; }

        //тут будут доп поля которые есть на Гмапах но не было у нас
        public bool? IsOpen { get; set; }
        public ICollection<OpeningHours> OpeningHours { get; set; }

        //это не внешний ключ
        public string GmapsPlaceId { get; set; }
        public int? UserId { get; set; }


        public virtual ICollection<PhotoDTO> Photos { get; set; } = new List<PhotoDTO>();
    }
}
