using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{

    public class SearchesRepository(MyDbContext _context) : GenericRepository<Search>(_context)
    {
        public async Task AddAsync(ulong userId, string queryText)
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
        public async Task RemoveAsync(ulong searchId)
        {
            var search = await _context.Searches
                .FirstOrDefaultAsync(s => s.Id == searchId);

            if (search != null)
            {
                _context.Searches.Remove(search);
                await _context.SaveChangesAsync();
            }
        }
        public async Task RemoveAllAsync(ulong userId)
        {
            var searches = await _context.Searches
                .Where(s => s.UserId == userId)
                .ToListAsync();

            _context.Searches.RemoveRange(searches);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Search>> GetSearchesPagedAsync(ulong userId, int skip = 0, int take = 50)
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
