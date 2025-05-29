using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.ReviewPages
{
    public class IndexModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public IndexModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        public IList<Review> Review { get;set; } = default!;

        public async Task OnGetAsync()
        {
            Review = await _context.Reviews
                .Include(r => r.Place)
                .Include(r => r.User).ToListAsync();
        }
    }
}
