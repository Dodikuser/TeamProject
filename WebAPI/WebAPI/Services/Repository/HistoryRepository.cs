using Microsoft.EntityFrameworkCore;
using WebAPI.EF;
using WebAPI.EF.Models;

namespace WebAPI.Services.Repository
{

    public class HistoryRepository
    {
        private readonly MyDbContext _context;

        public HistoryRepository(MyDbContext context)
        {
            _context = context;
        }

        // Добавить посещение
        public async Task AddAsync(int userId, int placeId, bool isFromRecs = false)
        {
            var history = new History
            {
                UserId = userId,
                PlaceId = placeId,
                VisitDateTime = DateTime.UtcNow,
                IsFromRecs = isFromRecs
            };

            _context.Histories.Add(history);
            await _context.SaveChangesAsync();
        }

        // Получить последние посещения пользователя
        public async Task<List<History>> GetHistoryAsync(int userId, int count = 50)
        {
            return await _context.Histories
                .Where(h => h.UserId == userId)
                .Include(h => h.Place)
                .OrderByDescending(h => h.VisitDateTime)
                .Take(count)
                .ToListAsync();
        }

        // Удалить одно посещение
        public async Task RemoveAsync(int historyId, int userId)
        {
            var record = await _context.Histories
                .FirstOrDefaultAsync(h => h.HistoryId == historyId && h.UserId == userId);

            if (record != null)
            {
                _context.Histories.Remove(record);
                await _context.SaveChangesAsync();
            }
        }

        // Удалить всю историю пользователя
        public async Task RemoveAllAsync(int userId)
        {
            var records = await _context.Histories
                .Where(h => h.UserId == userId)
                .ToListAsync();

            _context.Histories.RemoveRange(records);
            await _context.SaveChangesAsync();
        }

        // Проверка: посещал ли пользователь это место
        public async Task<bool> WasVisitedAsync(int userId, int placeId)
        {
            return await _context.Histories
                .AnyAsync(h => h.UserId == userId && h.PlaceId == placeId);
        }
    }


}
