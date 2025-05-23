using Application.DTOs;
using Entities;
using Entities.Models;
using Infrastructure.Repository;

namespace Application.Services
{
    public class PlaceService(FavoritesRepository _favoritesRepository, PlaceRepository _placeRepository, ReviewRepository _reviewRepository)
    {
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

        public async Task<List<PlaceDTODefaultCard>> GetByUserIdAsync(ulong userId, int skip, int take)
        {
            List<Place> rawPlaces = await _placeRepository.GetByUserIdAsync(userId, skip, take);
            List<PlaceDTODefaultCard> result = new List<PlaceDTODefaultCard>();

            foreach (Place place in rawPlaces)
            {
                result.Add(
                    new PlaceDTODefaultCard()
                    {
                        Name = place.Name,
                        Longitude = place.Longitude,
                        Latitude = place.Latitude,
                        Radius = place.Radius,
                        GmapsPlaceId = place.GmapsPlaceId,
                        Stars = (int)Double.Round(await _reviewRepository.GetAvgStarsAsync(place.Id))
                    }
                );
            }
            return result;
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
