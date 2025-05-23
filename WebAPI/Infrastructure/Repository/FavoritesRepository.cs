using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class FavoritesRepository(MyDbContext _context) : GenericRepository<Favorite>(_context)
    {

        public async Task AddAsync(ulong userId, ulong placeId)
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
        public async Task<bool> ExistsAsync(ulong userId, ulong placeId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.PlaceId == placeId);
        }
        public async Task RemoveAsync(ulong userId, ulong placeId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PlaceId == placeId);

            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<Favorite>> GetFavoritesForUserAsync(ulong userId, int skip = 0, int take = 10)
        {
            var one = _context.Favorites.Where(f => f.UserId == userId);
            var two = one.OrderByDescending(f => f.FavoritedAt).Skip(skip).Take(take);
            var three = two
            .Include(f => f.Place)
                .ThenInclude(p => p.Photos);
            var four = await three.ToListAsync();
            return four;
        }
        public async Task<List<Favorite>> SearchFavoritesAsync(ulong userId, string keyword, int skip = 0, int take = 10)
        {
            keyword = keyword.ToLower();

            return await _context.Favorites
                .Where(f => f.UserId == userId)
                .Where(f =>
                    f.Place.Name.ToLower().Contains(keyword) ||
                    (f.Place.Description != null && f.Place.Description.ToLower().Contains(keyword)) ||
                    (f.Place.Site != null && f.Place.Site.ToLower().Contains(keyword)) ||
                    (f.Place.Address != null && f.Place.Address.ToLower().Contains(keyword)) ||
                    (f.Place.PhoneNumber != null && f.Place.PhoneNumber.ToLower().Contains(keyword)))
                .OrderByDescending(f => f.FavoritedAt)
                .Skip(skip)
                .Take(take)
                .Include(f => f.Place)
                    .ThenInclude(p => p.Photos)
                .ToListAsync();
        }


    }
}
