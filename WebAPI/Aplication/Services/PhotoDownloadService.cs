using Entities.Models;
using Infrastructure;

namespace Aplication.Services
{
    public class PhotoDownloadService
    {
        private readonly HttpClient _httpClient;
        private readonly MyDbContext _dbContext;

        public PhotoDownloadService(HttpClient httpClient, MyDbContext dbContext)
        {
            _httpClient = httpClient;
            _dbContext = dbContext;
        }

        public async Task<Photo> DownloadAndSavePhotoAsync(string imageUrl, ulong placeId, string path = "")
        {
            // Скачиваем изображение как массив байтов
            byte[] imageBytes = await _httpClient.GetByteArrayAsync(imageUrl);

            // Создаём объект Photo
            var photo = new Photo
            {
                Path = path, // Можно сохранить imageUrl или относительный путь, если будете сохранять файл на диск
                PlaceId = placeId,
                Data = imageBytes,
            };

            // Сохраняем в БД
            _dbContext.Photos.Add(photo);

            return photo;
        }
    }
}