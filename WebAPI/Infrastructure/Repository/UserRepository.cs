using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class UserRepository(MyDbContext _context) : GenericRepository<User>(_context)
    {
        public async Task<User?> GetByIdAsync(ulong userId)
        {
            return await _context.Users
                .Include(u => u.Searches)
                .Include(u => u.Reviews)
                .Include(u => u.Histories)
                .Include(u => u.Favorites)
                .Include(u => u.Places)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User?> GetByIdMainAsync(ulong userId)
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

        public async Task SetSearchHistoryAsync(ulong userId, bool enabled)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.SearchHistoryOn = enabled;
                await _context.SaveChangesAsync();
            }
        }
        public async Task SetVisitHistoryAsync(ulong userId, bool enabled)
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