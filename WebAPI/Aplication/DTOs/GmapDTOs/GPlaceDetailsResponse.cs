using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GPlaceDetailsResponse
    {
        [JsonProperty("result")]
        public GPlaceDetailsResult Result { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }
}
