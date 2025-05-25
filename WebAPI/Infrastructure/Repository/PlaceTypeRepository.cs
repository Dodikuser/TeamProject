//using Entities.Models;
//using Google.Apis.Http;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Infrastructure.Repository
//{
//    public class PlaceTypeRepository(MyDbContext _context) : GenericRepository<PlaceType>(_context)
//    {

//        //Получить все типы мест места
//        public async Task<List<PlaceType>> GetPlaceTypesAsync(ulong placeId)
//        {
//            throw new NotImplementedException();
//        }

//        //Получить все разрешенные типы мест для абстрактного поиска
//        public async Task<List<PlaceType>> GetAllowedPlaceTypesAsync()
//        {
//            throw new NotImplementedException();
//        }

//        //получить айди по имени
//        public async Task<ulong> GetPlaceTypeByIdAsync(string type)
//        {
//            throw new NotImplementedException();
//        }

//        //проверить по названию добавлен ли тип места
//        public async Task<bool> IsExistAsync(string type)
//        {
//            throw new NotImplementedException();
//        }
//        public async Task AddAsync(string type)
//        {
//            throw new NotImplementedException();
//        }

//        //получить типы мест связанняе с хештегами
//        public async Task<List<PlaceType>> GetAsscociatedPlaceTypesAsync (ulong hashtagId)
//        {
//            throw new NotImplementedException();
//        }
//    }
//}
