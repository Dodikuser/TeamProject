using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class UserDTOHistory
    {
        public string Email { get; set; }
        public bool VisitHistoryOn { get; set; }
        public virtual ICollection<HistoryDTO> Histories { get; set; } = new List<HistoryDTO>();

    }
}
