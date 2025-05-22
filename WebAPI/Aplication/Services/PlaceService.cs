using Application.DTOs;
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

        public async Task<List<FavoriteDTO>> GetFavorites(ulong UserId, int skip = 0, int take = 10)
        {
            return (await _favoritesRepository
                .GetFavoritesForUserAsync(UserId, skip, take))
                .Select(FavoriteToDTO)
                .ToList();
        }
        public async Task<List<FavoriteDTO>> SearchFavorites(ulong UserId, string keyword, int skip = 0, int take = 10)
        {
            return (await _favoritesRepository
                .SearchFavoritesAsync(UserId, keyword, skip, take))
                .Select(FavoriteToDTO)
                .ToList();
        }


        public static FavoriteDTO FavoriteToDTO(Favorite favorite)
        {
            if (favorite == null)
                throw new ArgumentNullException(nameof(favorite));

            var place = favorite.Place;

            return new FavoriteDTO
            {
                FavoritedAt = favorite.FavoritedAt,
                placeDTO = new PlaceDTODefaultCard
                {
                    Name = place.Name,
                    Longitude = place.Longitude,
                    Latitude = place.Latitude,
                    Radius = place.Radius,
                    GmapsPlaceId = place.GmapsPlaceId,
                    Stars = place.Reviews?.Any() == true
                        ? (int)Math.Round(place.Reviews.Average(r => r.Stars))
                        : 0,
                    Photo = place.Photos != null && place.Photos.Any()
                        ? new PhotoDTO
                        {
                            Path = place.Photos.First().Path,
                            PlaceId = place.Photos.First().PlaceId
                        }
                        : null
                }
            };
        }


    }
}
