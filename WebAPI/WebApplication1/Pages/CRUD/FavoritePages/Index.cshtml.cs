using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Entities.Models;
using Infrastructure;

namespace AdminPanel.Pages.CRUD.FavoritePages
{
    public class IndexModel : PageModel
    {
        private readonly Infrastructure.MyDbContext _context;

        public IndexModel(Infrastructure.MyDbContext context)
        {
            _context = context;
        }

        public IList<Favorite> Favorite { get;set; } = default!;

        public async Task OnGetAsync()
        {
            Favorite = await _context.Favorites
                .Include(f => f.Place)
                .Include(f => f.User).ToListAsync();
        }
    }
}
