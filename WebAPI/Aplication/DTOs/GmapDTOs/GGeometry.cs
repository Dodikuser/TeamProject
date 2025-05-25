using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GGeometry
    {
        [JsonProperty("location")]
        public GLocation Location { get; set; }
    }
}
