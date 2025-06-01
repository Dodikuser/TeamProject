using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class PayPalOptions
    {
        public string ClientId { get; set; } = null!;
        public string Secret { get; set; } = null!;
        public bool UseSandbox { get; set; } = true;


    }

}
