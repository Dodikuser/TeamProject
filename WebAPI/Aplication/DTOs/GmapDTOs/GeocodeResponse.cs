using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.GmapDTOs
{
    public class GeocodeResponse
    {
        [JsonProperty("plus_code")]
        public PlusCode? PlusCode { get; set; }
    }

    public class PlusCode
    {
        [JsonProperty("compound_code")]
        public string? CompoundCode { get; set; }

        [JsonProperty("global_code")]
        public string? GlobalCode { get; set; }
    }

}
