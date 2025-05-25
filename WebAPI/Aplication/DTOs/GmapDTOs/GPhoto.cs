using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GPhoto
    {
        [JsonProperty("photo_reference")]
        public string PhotoReference { get; set; }

        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }

        [JsonProperty("html_attributions")]
        public List<string> HtmlAttributions { get; set; }

        public string GetPhotoUrl(string apiKey)
        {
            return $"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={PhotoReference}&key={apiKey}";
        }
    }
}
