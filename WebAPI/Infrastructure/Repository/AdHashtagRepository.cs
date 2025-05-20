using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class AdHashtagRepository(MyDbContext _context)
    {

        public async Task AddHashtagToPlaceAd(ulong placeId, ulong hashTagId)
        {
            var record = new AdHashtag() { PlaceId = placeId, HashtagId = hashTagId };
            _context.AdHashtags.AddAsync(record);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsExistAsync(ulong placeId, ulong hashTagId)
        {
            return await _context.AdHashtags.AnyAsync(a => a.PlaceId == placeId && a.HashtagId == hashTagId);
        }
        public async Task IncrementPromotionCount(int adHashTagId, int promotionCount = 1)
        {
            var x = await _context.AdHashtags.FindAsync(adHashTagId);
            x.PromotionCount += promotionCount;
            await _context.SaveChangesAsync();
        }
    }
}
