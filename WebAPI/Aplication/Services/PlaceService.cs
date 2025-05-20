using Entities;
using Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PlaceService
    {
        private readonly FavoritesRepository _favoritesRepository;
        private readonly PlaceRepository _placeRepository;

        public PlaceService(FavoritesRepository favoritesRepository, PlaceRepository placeRepository ) 
        {
            _favoritesRepository = favoritesRepository;
            _placeRepository = placeRepository;
        }
        public async Task FavoriteAction(int UserId, string gmapsPlaceId, FavoriteActionEnum action)
        {
            int placeId = (int)(await _placeRepository.GetIdByGmapsPlaceIdAsync(gmapsPlaceId));

            switch (action)
            {
                case FavoriteActionEnum.Add:
                    await _favoritesRepository.AddAsync(UserId, placeId);
                    break;
                case FavoriteActionEnum.Remove:
                    await _favoritesRepository.RemoveAsync(UserId, placeId);
                    break;
                default:
                    break;
            }
        }
    }
}
