using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class ReviewRepository(MyDbContext _context) : GenericRepository<Review>(_context)
    {
        public async Task AddAsync(ulong userId, ulong placeId, int stars, string? text)
        {
            var review = new Review() { UserId = userId, PlaceId = placeId, Stars = stars, Text = text, ReviewDateTime = DateTime.Now };
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> WasReviedAsync(ulong userId, ulong placeId)
        {
            return await _context.Reviews.AnyAsync(r => r.UserId == userId && r.PlaceId == placeId);
        }
        public async Task<List<Review>> GetReviewsPagedAsync(ulong placeId, int skip = 0, int take = 50)
        {

            return await _context.Reviews
                .Where(r => r.PlaceId == placeId)
                .Include(r => r.User)
                .OrderByDescending(h => h.ReviewDateTime)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
        public async Task<double> GetAvgStars(ulong placeId)
        {
            return await _context.Reviews
                .Where(r => r.PlaceId == placeId)
                .Select(r => (double?)r.Stars)
                .AverageAsync() ?? 0;
        }

    }
}
