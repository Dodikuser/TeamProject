using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    class UserDTOSearches
    {
        public string Email { get; set; }
        public bool SearchHistoryOn { get; set; }
        public virtual ICollection<SearchDTO> Searches { get; set; } = new List<SearchDTO>();
    }
}
