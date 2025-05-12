using Microsoft.EntityFrameworkCore;
using WebAPI.EF;
using WebAPI.EF.Models;

namespace WebAPI.Services.Repository
{

    public class SearchesRepository
    {
        private readonly MyDbContext _context;
        public SearchesRepository(MyDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(int userId, string queryText)
        {
            var search = new Search
            {
                UserId = userId,
                Text = queryText,
                SearchDateTime = DateTime.UtcNow
            };

            _context.Searches.Add(search);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveAsync(int searchId)
        {
            var search = await _context.Searches
                .FirstOrDefaultAsync(s => s.SearchId == searchId);

            if (search != null)
            {
                _context.Searches.Remove(search);
                await _context.SaveChangesAsync();
            }
        }
        public async Task RemoveAllAsync(int userId)
        {
            var searches = await _context.Searches
                .Where(s => s.UserId == userId)
                .ToListAsync();

            _context.Searches.RemoveRange(searches);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Search>> GetSearchesPagedAsync(int userId, int skip = 0, int take = 50)
        {
            return await _context.Searches
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.SearchDateTime)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
    }


}
