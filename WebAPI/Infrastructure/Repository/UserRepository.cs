using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class UserRepository
    {
        private readonly MyDbContext _context;
        public UserRepository(MyDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        
        }

        // Только Searches
        public async Task<User?> GetByUserIdWithSearchesAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Searches)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        // Только Reviews
        public async Task<User?> GetByUserIdWithReviewsAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Reviews)
                    .ThenInclude(h => h.Place)
                        .ThenInclude(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        // Только Histories
        public async Task<User?> GetUserDTOHistoryByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Histories)
                    .ThenInclude(h => h.Place)
                        .ThenInclude(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }




        // Только Favorites
        public async Task<User?> GetByUserIdWithFavoritesAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Favorites)
                    .ThenInclude(h => h.Place)
                        .ThenInclude(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        // Только Places
        public async Task<User?> GetByUserIdWithPlacesAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Places)
                    .ThenInclude(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        // Всё сразу
        public async Task<User?> GetByUserIdWithAllAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Searches)
                .Include(u => u.Reviews)
                .Include(u => u.Histories)
                .Include(u => u.Favorites)
                .Include(u => u.Places)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<User?> GetByIdMainAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task<User?> GetByGoogleIdAsync(string googleId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);
        }
        public async Task<User?> GetByFacebookIdAsync(string facebookId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.FacebookId == facebookId);
        }
        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<User>> GetAllAsync(int skip = 0, int take = 100)
        {
            return await _context.Users
                .OrderBy(u => u.Id)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.Users.AnyAsync(u => u.Name == name);
        }
        public async Task<bool> IsPasswordValidNasmeAsync(string name, string passwordHash)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Name == name);

            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
                return false;

            return user.PasswordHash == passwordHash;
        }
        public async Task<bool> IsPasswordValidByEmailAsync(string email, string passwordHash)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
                return false;

            return user.PasswordHash == passwordHash;
        }

        public async Task SetSearchHistoryAsync(int userId, bool enabled)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.SearchHistoryOn = enabled;
                await _context.SaveChangesAsync();
            }
        }
        public async Task SetVisitHistoryAsync(int userId, bool enabled)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.VisitHistoryOn = enabled;
                await _context.SaveChangesAsync();
            }
        }
    }
}