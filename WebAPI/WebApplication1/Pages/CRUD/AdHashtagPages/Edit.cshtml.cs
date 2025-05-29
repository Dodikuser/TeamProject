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

namespace AdminPanel.Pages.CRUD.AdHashtagPages
{
    public class EditModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public EditModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public AdHashtag AdHashtag { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var adhashtag =  await _context.AdHashtags.FirstOrDefaultAsync(m => m.PlaceId == id);
            if (adhashtag == null)
            {
                return NotFound();
            }
            AdHashtag = adhashtag;
           ViewData["HashtagId"] = new SelectList(_context.Hashtags, "Id", "Tag");
           ViewData["PlaceId"] = new SelectList(_context.Places, "Id", "Address");
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

            _context.Attach(AdHashtag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdHashtagExists(AdHashtag.PlaceId))
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

        private bool AdHashtagExists(ulong id)
        {
            return _context.AdHashtags.Any(e => e.PlaceId == id);
        }
    }
}
