using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class HashtagRepository
    {
        private readonly MyDbContext _context;
        public HashtagRepository(MyDbContext context)
        {
            _context = context;
        }
        public async Task<Hashtag> AddAsync(string tag, int price)
        {
            var hashtag = new Hashtag
            {
                Tag = tag,
                Price = price
            };

            _context.Hashtags.Add(hashtag);
            await _context.SaveChangesAsync();
            return hashtag;
        }
        public async Task<bool> RemoveAsync(int hashtagId)
        {
            var hashtag = await _context.Hashtags.FindAsync(hashtagId);
            if (hashtag == null) return false;

            _context.Hashtags.Remove(hashtag);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdatePriceAsync(int hashtagId, int newPrice)
        {
            var hashtag = await _context.Hashtags.FindAsync(hashtagId);
            if (hashtag == null) return false;

            hashtag.Price = newPrice;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<Place>> GetPlacesByHashtagAsync(ulong hashtagId)
        {
            return await _context.AdHashtags
                .Where(ah => ah.HashtagId == hashtagId)
                .Select(ah => ah.Place)
                .Distinct()
                .ToListAsync();
        }
    }
}
