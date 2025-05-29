using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.AdHashtagPages
{
    public class CreateModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public CreateModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
        ViewData["HashtagId"] = new SelectList(_context.Hashtags, "Id", "Tag");
        ViewData["PlaceId"] = new SelectList(_context.Places, "Id", "Address");
            return Page();
        }

        [BindProperty]
        public AdHashtag AdHashtag { get; set; } = default!;

        // For more information, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.AdHashtags.Add(AdHashtag);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
