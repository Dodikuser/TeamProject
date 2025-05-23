using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace Infrastructure.Repository
{

    public class HistoryRepository(MyDbContext _context) : GenericRepository<History>(_context)
    {
        public async Task AddAsync(ulong userId, ulong placeId, bool isFromRecs = false)
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
        public async Task RemoveAsync(ulong historyId)
        {
            var record = await _context.Histories
                .FirstOrDefaultAsync(h => h.Id == historyId);

            if (record != null)
            {
                _context.Histories.Remove(record);
                await _context.SaveChangesAsync();
            }
        }
        public async Task RemoveAllAsync(ulong userId)
        {
            var records = await _context.Histories
                .Where(h => h.UserId == userId)
                .ToListAsync();

            _context.Histories.RemoveRange(records);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> WasVisitedAsync(ulong userId, ulong placeId)
        {
            return await _context.Histories
                .AnyAsync(h => h.UserId == userId && h.PlaceId == placeId);
        }
        public async Task<List<History>> GetHistoryPagedAsync(ulong userId, int skip = 0, int take = 50)
        {
            return await _context.Histories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.VisitDateTime)
                .Skip(skip)
                .Take(take)
                .Include(h => h.Place)
                    .ThenInclude(p => p.Photos)
                .ToListAsync();
        }

        public async Task<List<History>> SearchUserHistoryByKeywordAsync(ulong userId, string keyword, int skip = 0, int take = 10)
        {
            keyword = keyword.ToLower();

            return await _context.Histories
                .Include(h => h.Place)
                .Where(h => h.UserId == userId && (
                    h.Place.Name.ToLower().Contains(keyword) ||
                    h.Place.Address.ToLower().Contains(keyword) ||
                    (h.Place.Description != null && h.Place.Description.ToLower().Contains(keyword)) ||
                    (h.Place.Site != null && h.Place.Site.ToLower().Contains(keyword)) ||
                    (h.Place.PhoneNumber != null && h.Place.PhoneNumber.ToLower().Contains(keyword)) ||
                    (h.Place.Email != null && h.Place.Email.ToLower().Contains(keyword))
                ))
                .Skip(skip)
                .Take(take)
                .Include(h => h.Place)
                    .ThenInclude(p => p.Photos)
                .ToListAsync();
        }

        public async Task<ulong?> GetHistoryIdByVisitDateAndGmapsPlaceIdAsync(DateTime visitDateTime, string gmapsPlaceId)
        {
            var history = await _context.Histories
                .Include(h => h.Place)
                .Where(h => h.VisitDateTime == visitDateTime && h.Place.GmapsPlaceId == gmapsPlaceId)
                .Select(h => (ulong?)h.Id)
                .FirstOrDefaultAsync();

            return history;
        }

    }
}
