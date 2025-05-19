using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    class UserDTOPlaces
    {
        public string Email { get; set; }
        public virtual ICollection<PlaceDTODefaultCard> Places { get; set; } = new List<PlaceDTODefaultCard>();

    }
}
