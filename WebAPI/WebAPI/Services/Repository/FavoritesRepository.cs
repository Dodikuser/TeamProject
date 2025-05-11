using Microsoft.EntityFrameworkCore;
using WebAPI.EF;
using WebAPI.EF.Models;

namespace WebAPI.Services.Repository
{
    public class FavoritesRepository
    {
        private readonly MyDbContext _context;

        public FavoritesRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(int userId, int placeId)
        {
            var favorite = new Favorite
            {
                UserId = userId,
                PlaceId = placeId,
                FavoritedAt = DateTime.UtcNow
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int userId, int placeId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.PlaceId == placeId);
        }

        public async Task RemoveAsync(int userId, int placeId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PlaceId == placeId);

            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Place>> GetFavoritesForUserAsync(int userId)
        {
            return await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Place)
                .Select(f => f.Place)
                .ToListAsync();
        }
    }
}
