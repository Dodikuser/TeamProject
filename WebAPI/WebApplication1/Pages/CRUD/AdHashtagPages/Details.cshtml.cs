using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.AdHashtagPages
{
    public class DetailsModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public DetailsModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        public AdHashtag AdHashtag { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var adhashtag = await _context.AdHashtags.FirstOrDefaultAsync(m => m.PlaceId == id);
            if (adhashtag == null)
            {
                return NotFound();
            }
            else
            {
                AdHashtag = adhashtag;
            }
            return Page();
        }
    }
}
