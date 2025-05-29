using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.OpeningHoursPages
{
    public class DeleteModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public DeleteModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public OpeningHours OpeningHours { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var openinghours = await _context.OpeningHours.FirstOrDefaultAsync(m => m.Id == id);

            if (openinghours == null)
            {
                return NotFound();
            }
            else
            {
                OpeningHours = openinghours;
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var openinghours = await _context.OpeningHours.FindAsync(id);
            if (openinghours != null)
            {
                OpeningHours = openinghours;
                _context.OpeningHours.Remove(OpeningHours);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
