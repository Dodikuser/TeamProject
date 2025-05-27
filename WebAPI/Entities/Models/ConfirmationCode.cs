using Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class ConfirmationCode : IDbEntity
    {
        public ulong Id { get; set; }

        public string Code { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }

        public ulong PlaceId { get; set; }
        public ulong UserId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Place Place { get; set; } = null!;
    }

}
