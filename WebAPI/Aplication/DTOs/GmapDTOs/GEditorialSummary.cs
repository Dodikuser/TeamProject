using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GEditorialSummary
    {
        [JsonProperty("overview")]
        public string Overview { get; set; }
    }
}
