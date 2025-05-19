using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    class UserDTOFavorites
    {
        public string Email { get; set; }
        public virtual ICollection<FavoriteDTO> Favorites { get; set; } = new List<FavoriteDTO>();

    }
}
