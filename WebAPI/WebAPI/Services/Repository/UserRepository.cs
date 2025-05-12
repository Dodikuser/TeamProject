using WebAPI.EF.Models;
using WebAPI.EF;
using Microsoft.EntityFrameworkCore;

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
    public async Task<User?> GetByIdAsync(int userId)
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
            .OrderBy(u => u.UserId)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }
    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
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