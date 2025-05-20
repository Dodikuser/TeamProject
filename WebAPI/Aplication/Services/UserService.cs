using Application.DTOs;
using Entities;
using Entities.Models;
using Infrastructure.Repository;

namespace Application.Services
{
    public class UserService
    {
        private readonly AuthorizationService _authorizationService;
        private readonly UserRepository _userRepository;


        private readonly Dictionary<UserDTOEnum, Func<ulong, Task<object>>> _userInfoHandlers;
        public static readonly Dictionary<UserDTOEnum, Type> _userDtoTypes = new()
        {
            [UserDTOEnum.Searches] = typeof(UserDTOSearches),
            [UserDTOEnum.Reviews] = typeof(UserDTOReviews),
            [UserDTOEnum.Histories] = typeof(UserDTOHistory),
            [UserDTOEnum.Favorites] = typeof(UserDTOFavorites),
            [UserDTOEnum.Places] = typeof(UserDTOPlaces),
            [UserDTOEnum.Full] = typeof(UserDTOFull),
            [UserDTOEnum.Main] = typeof(UserDTOMain)
        };

        public UserService(AuthorizationService authorizationService, UserRepository userRepository)
        {
            _authorizationService = authorizationService;
            _userRepository = userRepository;

            _userInfoHandlers = new Dictionary<UserDTOEnum, Func<ulong, Task<object>>>
            {
                [UserDTOEnum.Searches] = async (id) => await GetUserDTOSearches(id),
                [UserDTOEnum.Reviews] = async (id) => await GetUserDTOReviews(id),
                [UserDTOEnum.Histories] = async (id) => await GetUserDTOHistories(id),
                [UserDTOEnum.Favorites] = async (id) => await GetUserDTOFavorites(id),
                [UserDTOEnum.Places] = async (id) => await GetUserDTOPlaces(id),
                [UserDTOEnum.Full] = async (id) => await GetUserDTOFull(id),
                [UserDTOEnum.Main] = async (id) => await GetUserDTOMain(id)
            };

        }

        public async Task<Entities.Result> SetIncognito(int userId, bool enabled)
        {
            await _userRepository.SetVisitHistoryAsync(userId, enabled);
            await _userRepository.SetSearchHistoryAsync(userId, enabled);

            return Entities.Result.Ok();
        }




        public async Task<T> GetUserInfo<T>(ulong userId, UserDTOEnum dataType)
        {
            if (!_userInfoHandlers.TryGetValue(dataType, out var handler))
                throw new ArgumentException($"Handler not found for {dataType}");

            if (!_userDtoTypes.TryGetValue(dataType, out var expectedType))
                throw new ArgumentException($"Type not mapped for {dataType}");

            if (expectedType != typeof(T))
                throw new InvalidOperationException($"Requested type {typeof(T).Name} does not match mapped type {expectedType.Name} for {dataType}");

            var result = await handler(userId);
            return (T)result;
        }


        private async Task<UserDTOMain> GetUserDTOMain(ulong userId)
        {
            var user = await _userRepository.GetByIdMainAsync(userId);
            return new UserDTOMain
            {
                Email = user.Email,
                Name = user.Name,
                CreatedAt = user.CreatedAt
            };
        }

        private async Task<UserDTOSearches> GetUserDTOSearches(ulong userId)
        {
            var user = await _userRepository.GetByUserIdWithSearchesAsync(userId);
            return new UserDTOSearches
            {
                Email = user.Email,
                SearchHistoryOn = user.SearchHistoryOn,
                Searches = user.Searches?
                    .Select(s => new SearchDTO
                    {
                        Text = s.Text,
                        SearchDateTime = s.SearchDateTime
                    })
                    .ToList() ?? new List<SearchDTO>()
            };
        }

        private async Task<UserDTOReviews> GetUserDTOReviews(ulong userId)
        {
            var user = await _userRepository.GetByUserIdWithReviewsAsync(userId);
            var reviewDTOs = await Task.WhenAll(
            user.Reviews?.Select(async r => new ReviewDTO
            {
                ReviewId = r.Id,
                Text = r.Text,
                Stars = r.Stars,
                ReviewDateTime = r.ReviewDateTime,
                PlaceId = r.PlaceId,
                UserId = r.UserId,
                Place = MapPlaceToDefaultCard(r.Place),
                User = null,
            }) ?? Enumerable.Empty<Task<ReviewDTO>>()
            );

            return new UserDTOReviews
            {
                Email = user.Email,
                Reviews = reviewDTOs.ToList()
            };

        }

        private async Task<UserDTOHistory> GetUserDTOHistories(ulong userId)
        {
            User? user = await _userRepository.GetUserDTOHistoryByIdAsync(userId);

            return new UserDTOHistory
            {
                Email = user.Email,
                VisitHistoryOn = user.VisitHistoryOn,
                Histories = user.Histories?
                    .Select(h => new HistoryDTO
                    {
                        PlaceId = h.PlaceId,
                        VisitDateTime = h.VisitDateTime,
                        IsFromRecs = h.IsFromRecs,
                        Place = MapPlaceToDefaultCard(h.Place),
                    })
                    .ToList() ?? new List<HistoryDTO>()
            };
        }

        private async Task<UserDTOFavorites> GetUserDTOFavorites(ulong userId)
        {
            var user = await _userRepository.GetByUserIdWithFavoritesAsync(userId);

            return new UserDTOFavorites
            {
                Email = user.Email,
                Favorites = user.Favorites?
                    .Select(f => new FavoriteDTO
                    {
                        PlaceId = f.PlaceId,
                        Place = MapPlaceToDefaultCard(f.Place),
                    })
                    .ToList() ?? new List<FavoriteDTO>()
            };
        }

        private async Task<UserDTOPlaces> GetUserDTOPlaces(ulong userId)
        {
            var user = await _userRepository.GetByUserIdWithPlacesAsync(userId);

            return new UserDTOPlaces
            {
                Email = user.Email,
                Places = user.Places?
                    .Select(MapPlaceToDefaultCard)
                    .ToList() ?? new List<PlaceDTODefaultCard>()
            };
        }

        private async Task<UserDTOFull> GetUserDTOFull(ulong userId)
        {
            var user = await _userRepository.GetByIdMainAsync(userId);
            return new UserDTOFull
            {
                Email = user.Email,
                Name = user.Name,
                CreatedAt = user.CreatedAt,
                SearchHistoryOn = user.SearchHistoryOn,
                VisitHistoryOn = user.VisitHistoryOn,
                Searches = (await GetUserDTOSearches(userId)).Searches,
                Reviews = (await GetUserDTOReviews(userId)).Reviews,
                Histories = (await GetUserDTOHistories(userId)).Histories,
                Favorites = (await GetUserDTOFavorites(userId)).Favorites,
                Places = (await GetUserDTOPlaces(userId)).Places
            };
        }

        private PlaceDTODefaultCard MapPlaceToDefaultCard(Place place)
        {
            return new PlaceDTODefaultCard
            {
                Name = place.Name,
                Longitude = place.Longitude,
                Latitude = place.Latitude,
                Radius = place.Radius,
                GmapsPlaceId = place.GmapsPlaceId,
                Photos = place.Photos?
                    .Select(p => new PhotoDTO
                    {
                        PhotoId = p.Id,
                        Path = p.Path,
                        PlaceId = p.PlaceId,
                    })
                    .ToList() ?? new List<PhotoDTO>(),
            };
        }

    }
}
