using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.ConfirmationCodePages
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
        ViewData["PlaceId"] = new SelectList(_context.Places, "Id", "Address");
        ViewData["UserId"] = new SelectList(_context.Users, "Id", "Name");
            return Page();
        }

        [BindProperty]
        public ConfirmationCode ConfirmationCode { get; set; } = default!;

        // For more information, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.ConfirmationCodes.Add(ConfirmationCode);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
