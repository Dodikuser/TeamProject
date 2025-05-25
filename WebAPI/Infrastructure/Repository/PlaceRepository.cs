using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class PlaceRepository(MyDbContext _context) : GenericRepository<Place>(_context)
    {
        public async Task UpdateAllowedFieldsAsync(int placeId, string? name, string? description, string? site, string? phoneNumber, string? email, int? radius)
        {
            var existing = await _context.Places.FindAsync(placeId);
            if (existing == null)
                throw new KeyNotFoundException("Place not found");

            // Только разрешённые поля
            if (name != null) existing.Name = name;
            if (description != null) existing.Description = description;
            if (site != null) existing.Site = site;
            if (phoneNumber != null) existing.PhoneNumber = phoneNumber;
            if (email != null) existing.Email = email;
            if (radius.HasValue) existing.Radius = radius;

            await _context.SaveChangesAsync();
        }
        public async Task<bool> ExistsAsync(string gmapsPlaceId)
        {
            return await _context.Places.AnyAsync(p => p.GmapsPlaceId == gmapsPlaceId);
        }
        public async Task AddTokensAsync(int placeId, int count)
        {
            if (count <= 0) throw new ArgumentException("Token count must be positive");

            var place = await _context.Places.FindAsync(placeId);
            if (place == null) throw new KeyNotFoundException("Place not found");

            place.TokensAvailable = (place.TokensAvailable ?? 0) + count;
            await _context.SaveChangesAsync();
        }
        public async Task RemoveTokensAsync(int placeId, int count)
        {
            if (count <= 0) throw new ArgumentException("Token count must be positive");

            var place = await _context.Places.FindAsync(placeId);
            if (place == null) throw new KeyNotFoundException("Place not found");

            int current = place.TokensAvailable ?? 0;
            if (current < count)
                throw new InvalidOperationException("Not enough tokens to remove");

            place.TokensAvailable = current - count;
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int placeId)
        {
            var place = await _context.Places.FindAsync(placeId);
            if (place != null)
            {
                _context.Places.Remove(place);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<Place?> GetByIdAsync(int placeId)
        {
            return await _context.Places.FindAsync(placeId);
        }
        public async Task<Place?> GetByIdGmapsPlaceId(string gmapsPlaceId)
        {
            return await _context.Places.FirstOrDefaultAsync(p => p.GmapsPlaceId == gmapsPlaceId);
        }
        public async Task<ulong?> GetIdByGmapsPlaceIdAsync(string gmapsPlaceId)
        {
            return await _context.Places
                .Where(p => p.GmapsPlaceId == gmapsPlaceId)
                .Select(p => (ulong?)p.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Place>> SearchAsync(string query, int skip = 0, int take = 50)
        {
            return await _context.Places
                .Where(p => p.Name.Contains(query) || p.Description.Contains(query))
                .OrderBy(p => p.Name)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
        public async Task<List<Place>> GetAllAsync(int skip = 0, int take = 100)
        {
            return await _context.Places
                .OrderBy(p => p.Id)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
        public async Task<List<Place>> GetByUserIdAsync(ulong userId, int skip = 0, int take = 50)
        {
            return await _context.Places
                .Where(p => p.UserId == userId)
                .Include(p => p.Photos)
                .OrderByDescending(p => p.Name)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
        public async Task<List<Place>> GetByPromoteHashtagAsync(ulong hashTagId, int skip = 0, int take = 50)
        {
            return await _context.Places
                .Where(p => p.AdHashtags.Any(a => a.HashtagId == hashTagId))
                .OrderBy(p => p.Name)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        //Добавить свзять между местом и типом мест
        public async Task AddPlaceTypeToPlace(ulong placeId, ulong placeTypeId)
        {
            throw new NotImplementedException();
        }

        //добавить место с проверкой


    }
}