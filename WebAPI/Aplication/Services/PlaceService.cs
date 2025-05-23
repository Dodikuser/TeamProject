using Application.DTOs;
using Application.DTOs.GmapDTOs;
using Entities;
using Entities.Models;
using Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class PlaceService(FavoritesRepository _favoritesRepository, PlaceRepository _placeRepository, GmapsService _gmapsService, Config _config)
    {

        private readonly string _googleMapsKey { get { return _config.GoogleMapsKey; } };

        public async Task FavoriteAction(ulong UserId, string gmapsPlaceId, FavoriteActionEnum action)
        {
            bool exists = await _placeRepository.ExistsAsync(gmapsPlaceId);

            if (!exists) // регаем место если его нет в базе
            {
                GPlaceDetailsResult gPlaceDetailsResult = await _gmapsService.GetPlaceDetailsAsync(gmapsPlaceId);
                Place place = PlaceTypesConverter.ConvertFromGPlace(gPlaceDetailsResult, 2, gmapsPlaceId, _googleMapsKey);

                await _placeRepository.AddAsync(place);
            }

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
                        GmapsPlaceId = place.GmapsPlaceId,
                        Stars = (int)Double.Round(await _reviewRepository.GetAvgStarsAsync(place.Id))
                    }
                );
            }
            return result;
        }

    }
}
