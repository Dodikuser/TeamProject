using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.ConfirmationCodePages
{
    public class DetailsModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public DetailsModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        public ConfirmationCode ConfirmationCode { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(ulong? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var confirmationcode = await _context.ConfirmationCodes.FirstOrDefaultAsync(m => m.Id == id);
            if (confirmationcode == null)
            {
                return NotFound();
            }
            else
            {
                ConfirmationCode = confirmationcode;
            }
            return Page();
        }
    }
}
