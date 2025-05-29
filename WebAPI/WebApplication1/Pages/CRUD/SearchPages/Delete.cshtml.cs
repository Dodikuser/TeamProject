using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.SearchPages
{
    public class DeleteModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public DeleteModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Search Search { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var search = await _context.Searches.FirstOrDefaultAsync(m => m.Id == id);

            if (search == null)
            {
                return NotFound();
            }
            else
            {
                Search = search;
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var search = await _context.Searches.FindAsync(id);
            if (search != null)
            {
                Search = search;
                _context.Searches.Remove(Search);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
