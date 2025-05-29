using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.SearchPages
{
    public class EditModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public EditModel(Infrastructure.MyDbContext context)
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

            var search =  await _context.Searches.FirstOrDefaultAsync(m => m.Id == id);
            if (search == null)
            {
                return NotFound();
            }
            Search = search;
           ViewData["UserId"] = new SelectList(_context.Users, "Id", "Name");
            return Page();
        }

        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more information, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(Search).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SearchExists(Search.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool SearchExists(ulong id)
        {
            return _context.Searches.Any(e => e.Id == id);
        }
    }
}
