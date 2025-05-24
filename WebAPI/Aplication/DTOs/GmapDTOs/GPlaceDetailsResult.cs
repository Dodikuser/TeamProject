using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GPlaceDetailsResult
    {
        [JsonProperty("name")]
        public string? Name { get; set; }

        [JsonProperty("formatted_address")]
        public string? Address { get; set; }

        [JsonProperty("geometry")]
        public GGeometry? Geometry { get; set; }

        [JsonProperty("formatted_phone_number")]
        public string? PhoneNumber { get; set; }

        [JsonProperty("opening_hours")]
        public GOpeningHours? OpeningHours { get; set; }

        [JsonProperty("rating")]
        public double? Rating { get; set; }

        [JsonProperty("editorial_summary")]
        public GEditorialSummary? EditorialSummary { get; set; }

        [JsonProperty("website")]
        public string? Website { get; set; }

        [JsonProperty("photos")]
        public List<GPhoto>? Photos { get; set; }

        [JsonProperty("price_level")]
        public int? PriceLevel { get; set; }

    }
}
