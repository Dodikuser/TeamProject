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
    public class IndexModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public IndexModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        public IList<ConfirmationCode> ConfirmationCode { get;set; } = default!;

        public async Task OnGetAsync()
        {
            ConfirmationCode = await _context.ConfirmationCodes
                .Include(c => c.Place)
                .Include(c => c.User).ToListAsync();
        }
    }
}
