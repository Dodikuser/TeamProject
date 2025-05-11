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

        // Добавить новую строку поиска
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

        // Получить последние N запросов пользователя
        public async Task<List<Search>> GetRecentSearchesAsync(int userId, int count = 10)
        {
            return await _context.Searches
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SearchDateTime)
                .Take(count)
                .ToListAsync();
        }

        // Удалить один запрос
        public async Task RemoveAsync(int searchId, int userId)
        {
            var search = await _context.Searches
                .FirstOrDefaultAsync(s => s.SearchId == searchId && s.UserId == userId);

            if (search != null)
            {
                _context.Searches.Remove(search);
                await _context.SaveChangesAsync();
            }
        }

        // Удалить все запросы пользователя
        public async Task RemoveAllAsync(int userId)
        {
            var searches = await _context.Searches
                .Where(s => s.UserId == userId)
                .ToListAsync();

            _context.Searches.RemoveRange(searches);
            await _context.SaveChangesAsync();
        }
    }


}
