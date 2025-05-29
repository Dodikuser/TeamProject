using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.HashtagPages
{
    public class DeleteModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public DeleteModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Hashtag Hashtag { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var hashtag = await _context.Hashtags.FirstOrDefaultAsync(m => m.Id == id);

            if (hashtag == null)
            {
                return NotFound();
            }
            else
            {
                Hashtag = hashtag;
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var hashtag = await _context.Hashtags.FindAsync(id);
            if (hashtag != null)
            {
                Hashtag = hashtag;
                _context.Hashtags.Remove(Hashtag);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
