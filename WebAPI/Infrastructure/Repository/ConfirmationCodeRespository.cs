using Entities.Models;

namespace Infrastructure.Repository
{
    public class ConfirmationCodeRepository(MyDbContext _context) : GenericRepository<ConfirmationCode>(_context)
    {
        public async Task<ConfirmationCode> CreateCodeAsync(ulong placeId, ulong userId)
        {
            var code = new Random().Next(100000, 999999).ToString();
            var claimCode = new ConfirmationCode
            {
                PlaceId = placeId,
                UserId = userId,
                Code = code,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };

            _context.ConfirmationCodes.Add(claimCode);
            await _context.SaveChangesAsync();
            return claimCode;
        }

        public async Task<bool> VerifyCodeAsync(ulong placeId, ulong userId, string inputCode)
        {
            var code = _context.ConfirmationCodes
                .Where(c => c.PlaceId == placeId && c.UserId == userId && !c.IsUsed)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefault();

            if (code == null || code.ExpiresAt < DateTime.UtcNow || code.Code != inputCode)
                return false;

            code.IsUsed = true;

            var place = await _context.Places.FindAsync(placeId);
            if (place == null) return false;

            place.UserId = userId;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}

