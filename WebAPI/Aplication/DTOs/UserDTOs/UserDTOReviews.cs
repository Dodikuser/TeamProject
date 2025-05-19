using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    class UserDTOReviews
    {
        public string Email { get; set; }
        public virtual ICollection<ReviewDTO> Reviews { get; set; } = new List<ReviewDTO>();

    }
}
