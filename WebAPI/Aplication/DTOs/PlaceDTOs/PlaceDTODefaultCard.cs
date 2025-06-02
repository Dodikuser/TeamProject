using Entities.Models;

namespace Application.DTOs
{
    public class PlaceDTODefaultCard
    {
        public string Name { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string Address { get; set; }
        public string GmapsPlaceId { get; set; }
        public PhotoDTO Photo { get; set; }
        public double Stars { get; set; }
        public bool IsFavorite { get; set; } = false;
        public ICollection<OpeningHours> OpeningHours { get; set; }
    }
}
