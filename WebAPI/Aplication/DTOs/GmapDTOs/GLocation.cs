using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GLocation
    {
        [JsonProperty("lat")]
        public double Lat { get; set; }

        [JsonProperty("lng")]
        public double Lng { get; set; }
    }
}
