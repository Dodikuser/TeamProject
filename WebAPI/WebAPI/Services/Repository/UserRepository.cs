//using WebAPI.EF.Models;
//using WebAPI.EF;

//namespace WebAPI.Services.Repository
//{
//    public class UsersRepository
//    {
//        private readonly MyDbContext _context;

//        public UsersRepository(MyDbContext context)
//        {
//            _context = context;
//        }

//        // Получить пользователя по ID
//        public async Task<User?> GetByIdAsync(int userId)
//        {
//            return await _context.Users
//                .Include(u => u.Favorites)
//                .Include(u => u.Histories)
//                .Include(u => u.Searches)
//                .Include(u => u.Reviews)
//                .FirstOrDefaultAsync(u => u.UserId == userId);
//        }

//        // Получить пользователя по email
//        public async Task<User?> GetByEmailAsync(string email)
//        {
//            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
//        }

//        // Получить пользователя по OAuth
//        public async Task<User?> GetByOAuthAsync(string provider, string externalId)
//        {
//            return provider switch
//            {
//                "Google" => await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == externalId),
//                "Facebook" => await _context.Users.FirstOrDefaultAsync(u => u.FacebookId == externalId),
//                _ => null
//            };
//        }

//        // Создать нового пользователя
//        public async Task CreateAsync(User user)
//        {
//            user.CreatedAt = DateTime.UtcNow;
//            _context.Users.Add(user);
//            await _context.SaveChangesAsync();
//        }

//        // Обновить флаги истории
//        public async Task UpdateHistorySettingsAsync(int userId, bool searchHistoryOn, bool visitHistoryOn)
//        {
//            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
//            if (user != null)
//            {
//                user.SearchHistoryOn = searchHistoryOn;
//                user.VisitHistoryOn = visitHistoryOn;
//                await _context.SaveChangesAsync();
//            }
//        }

//        // Удалить пользователя
//        public async Task DeleteAsync(int userId)
//        {
//            var user = await _context.Users.FindAsync(userId);
//            if (user != null)
//            {
//                _context.Users.Remove(user);
//                await _context.SaveChangesAsync();
//            }
//        }
//    }

//}
