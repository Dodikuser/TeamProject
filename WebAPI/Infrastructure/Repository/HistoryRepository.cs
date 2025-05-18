using Microsoft.EntityFrameworkCore;
using Entities;
using Entities.Models;

namespace Infrastructure.Repository
{

    public class HistoryRepository
    {
        private readonly MyDbContext _context;
        public HistoryRepository(MyDbContext context)
        {
            _context = context;
        }
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
        public async Task RemoveAsync(int historyId)
        {
            var record = await _context.Histories
                .FirstOrDefaultAsync(h => h.Id == historyId);

            if (record != null)
            {
                _context.Histories.Remove(record);
                await _context.SaveChangesAsync();
            }
        }
        public async Task RemoveAllAsync(int userId)
        {
            var records = await _context.Histories
                .Where(h => h.UserId == userId)
                .ToListAsync();

            _context.Histories.RemoveRange(records);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> WasVisitedAsync(int userId, int placeId)
        {
            return await _context.Histories
                .AnyAsync(h => h.UserId == userId && h.PlaceId == placeId);
        }
        public async Task<List<History>> GetHistoryPagedAsync(int userId, int skip = 0, int take = 50)
        {
            return await _context.Histories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.VisitDateTime)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }


    }
}
