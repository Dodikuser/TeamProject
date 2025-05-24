using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.GmapDTOs
{
    public class GSearchNearbyResult
    {
        public string Name { get; set; } = default!;
        public double? Rating { get; set; }
        public string Type { get; set; } = default!;
    }
}
