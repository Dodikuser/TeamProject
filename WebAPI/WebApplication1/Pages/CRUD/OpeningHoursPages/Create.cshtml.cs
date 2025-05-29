using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.OpeningHoursPages
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
            return Page();
        }

        [BindProperty]
        public OpeningHours OpeningHours { get; set; } = default!;

        // For more information, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.OpeningHours.Add(OpeningHours);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
