using Microsoft.EntityFrameworkCore;
using WebAPI.EF;
using WebAPI.EF.Models;

namespace WebAPI.Services.Repository
{
    public class AdHashtagRepository
    {
        private readonly MyDbContext _context;
        public AdHashtagRepository(MyDbContext context)
        {
            _context = context;
        }
        public async Task AddHashtagToPlaceAd(int placeId, int hashTagId)
        {
            var record = new AdHashtag() { PlaceId = placeId, HashtagId = hashTagId };
            _context.AdHashtags.AddAsync(record);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsExistAsync(int placeId, int hashTagId)
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
