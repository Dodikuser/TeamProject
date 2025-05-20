using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class PhotoRepository
    {
        //todo
        private readonly MyDbContext _context;
        //private readonly IWebHostEnvironment _env;
        private readonly string WebRootPath;
        //public PhotoRepository(MyDbContext context, IWebHostEnvironment env)
        //{
        //    _context = context;
        //    _env = env;
        //}
        //public PhotoRepository(MyDbContext context, string webRootPath)
        //{
        //    _context = context;
        //    WebRootPath = webRootPath;
        //}
        public async Task AddAsync(ulong placeId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file.");

            var uploadsPath = Path.Combine(WebRootPath, "uploads", "places", placeId.ToString());

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullPath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = Path.Combine("uploads", "places", placeId.ToString(), fileName).Replace("\\", "/");

            var photo = new Photo
            {
                PlaceId = placeId,
                Path = relativePath
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> RemoveAsync(int photoId)
        {
            var photo = await _context.Photos.FindAsync(photoId);

            if (photo == null)
                return false;

            // Удаление физического файла
            var fullPath = Path.Combine(WebRootPath, photo.Path.Replace("/", Path.DirectorySeparatorChar.ToString()));

            if (File.Exists(fullPath))
                File.Delete(fullPath);

            _context.Photos.Remove(photo);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<List<Photo>> GetPagedAsync(ulong placeId, int skip = 0, int take = 50)
        {
            return await _context.Photos
                .Where(p => p.PlaceId == placeId)
                .OrderByDescending(p => p.Id)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
        public async Task<List<Photo>> GetAllByPlaceAsync(ulong placeId)
        {
            return await _context.Photos
                .Where(p => p.PlaceId == placeId)
                .ToListAsync();
        }
    }
}
