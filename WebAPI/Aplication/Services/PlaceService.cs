using Entities;
using Entities.Models;
using Infrastructure.Repository;

namespace Application.Services
{
    public class PlaceService
    {
        private readonly FavoritesRepository _favoritesRepository;
        private readonly PlaceRepository _placeRepository;

        public PlaceService(FavoritesRepository favoritesRepository, PlaceRepository placeRepository)
        {
            _favoritesRepository = favoritesRepository;
            _placeRepository = placeRepository;
        }
        public async Task FavoriteAction(ulong UserId, string gmapsPlaceId, FavoriteActionEnum action)
        {
            ulong placeId = (await _placeRepository.GetIdByGmapsPlaceIdAsync(gmapsPlaceId)).Value;

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

        public async Task<List<Favorite>> GetFavorites(ulong UserId, int skip = 0, int take = 10)
        {
            return await _favoritesRepository.GetFavoritesForUserAsync(UserId, skip, take);
        }
        public async Task<List<Favorite>> SearchFavorites(ulong UserId, string keyword, int skip = 0, int take = 10)
        {
            return await _favoritesRepository.SearchFavoritesAsync(UserId, keyword, skip, take);
        }

    }
}
