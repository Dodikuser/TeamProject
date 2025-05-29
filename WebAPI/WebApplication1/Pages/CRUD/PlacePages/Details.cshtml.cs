using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.PlacePages
{
    public class DetailsModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public DetailsModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        public Place Place { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var place = await _context.Places.FirstOrDefaultAsync(m => m.Id == id);
            if (place == null)
            {
                return NotFound();
            }
            else
            {
                Place = place;
            }
            return Page();
        }
    }
}
