using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Text.Json.Serialization;

public class AiPlaceSearchDTO
{
    [JsonPropertyName("googlePlaceIds")]
    public List<string> GooglePlaceIds { get; set; } = new();

    public bool IsSpecifiedQuery { get; set; }
}


