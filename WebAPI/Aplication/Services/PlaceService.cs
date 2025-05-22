using Application.DTOs;
using Application.DTOs.GmapDTOs;
using Entities;
using Entities.Models;
using Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class PlaceService
    {
        private readonly FavoritesRepository _favoritesRepository;
        private readonly PlaceRepository _placeRepository;
        private readonly GmapsService _gmapsService;
        private readonly string _googleMapsKey;


        public PlaceService(FavoritesRepository favoritesRepository, PlaceRepository placeRepository, GmapsService gmapsService, Config config)
        {
            _favoritesRepository = favoritesRepository;
            _placeRepository = placeRepository;
            _gmapsService=gmapsService;
            _googleMapsKey = config.GoogleMapsKey;
        }

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
