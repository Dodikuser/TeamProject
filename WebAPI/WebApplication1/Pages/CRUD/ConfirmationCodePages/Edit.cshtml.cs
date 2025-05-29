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

namespace AdminPanel.Pages.CRUD.ConfirmationCodePages
{
    public class EditModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public EditModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public ConfirmationCode ConfirmationCode { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var confirmationcode =  await _context.ConfirmationCodes.FirstOrDefaultAsync(m => m.Id == id);
            if (confirmationcode == null)
            {
                return NotFound();
            }
            ConfirmationCode = confirmationcode;
           ViewData["PlaceId"] = new SelectList(_context.Places, "Id", "Address");
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

            _context.Attach(ConfirmationCode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConfirmationCodeExists(ConfirmationCode.Id))
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

        private bool ConfirmationCodeExists(ulong id)
        {
            return _context.ConfirmationCodes.Any(e => e.Id == id);
        }
    }
}
