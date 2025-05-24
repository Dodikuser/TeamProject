using Newtonsoft.Json;

namespace Application.DTOs.GmapDTOs
{
    public class GOpeningHours
    {
        [JsonProperty("open_now")]
        public bool? OpenNow { get; set; }

        [JsonProperty("weekday_text")]
        public List<string> WeekdayText { get; set; }
    }
}
