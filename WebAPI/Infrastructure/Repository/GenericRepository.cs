using Entities.Interfaces;

namespace Infrastructure.Repository
{
    public abstract class GenericRepository<T> where T : class, IDbEntity
    {
        private MyDbContext _context;
        public GenericRepository(MyDbContext context)
        {
            _context = context;
        }
        public virtual async Task AddAsync(T? entity)
        {
            if (entity != null)
            {
                await _context.AddAsync(entity);
                await _context.SaveChangesAsync();
            }
        }
        public virtual async Task<T?> FindAsync(int Id)
        {
            return await _context.FindAsync<T>(Id);
        }
        public virtual async Task RemoveAsync(T? entity)
        {
            T? result = entity == null ? null : _context.Remove(entity).Entity;
            if (result != null)
                await _context.SaveChangesAsync();
        }
        public virtual async Task RemoveByIdAsync(int Id)
        {
            T? entity = await FindAsync(Id);
            await RemoveAsync(entity);
        }
    }
}
