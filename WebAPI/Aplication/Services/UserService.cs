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


        //private readonly Dictionary<UserDTOEnum, Func<ulong, Task<object>>> _userInfoHandlers;
        //public static readonly Dictionary<UserDTOEnum, Type> _userDtoTypes = new()
        //{
        //    [UserDTOEnum.Full] = typeof(UserDTO),
        //    [UserDTOEnum.Public] = typeof(UserPublicDTO)
        //};

        public UserService(AuthorizationService authorizationService, UserRepository userRepository)
        {
            _authorizationService = authorizationService;
            _userRepository = userRepository;

            //_userInfoHandlers = new Dictionary<UserDTOEnum, Func<ulong, Task<object>>>
            //{
            //    [UserDTOEnum.Full] = async (id) => await GetUserDTOFull(id),
            //    [UserDTOEnum.Public] = async (id) => await GetUserDTOMain(id)
            //};

        }

        public async Task<Entities.Result> SetIncognito(ulong userId, bool enabled)
        {
            await _userRepository.SetVisitHistoryAsync(userId, enabled);
            await _userRepository.SetSearchHistoryAsync(userId, enabled);

            return Entities.Result.Ok();
        }




        //public async Task<T> GetUserInfo<T>(ulong userId, UserDTOEnum dataType)
        //{
        //    if (!_userInfoHandlers.TryGetValue(dataType, out var handler))
        //        throw new ArgumentException($"Handler not found for {dataType}");

        //    if (!_userDtoTypes.TryGetValue(dataType, out var expectedType))
        //        throw new ArgumentException($"Type not mapped for {dataType}");

        //    if (expectedType != typeof(T))
        //        throw new InvalidOperationException($"Requested type {typeof(T).Name} does not match mapped type {expectedType.Name} for {dataType}");

        //    var result = await handler(userId);
        //    return (T)result;
        //}


        public async Task<UserDTO?> GetUserDTOAsync(ulong userId)
        {
            var user = await _userRepository.GetByIdMainAsync(userId);
            if (user != null)
                return new UserDTO
                {
                    Email = user.Email,
                    Name = user.Name,
                    CreatedAt = user.CreatedAt,
                    SearchHistoryOn = user.SearchHistoryOn,
                    VisitHistoryOn = user.VisitHistoryOn,
                };
            return null;
        }
        public async Task<UserPublicDTO?> GetUserPublicDTO(ulong userId)
        {
            var user = await _userRepository.GetByIdMainAsync(userId);
            if (user != null)
                return new UserPublicDTO
                {
                    Name = user.Name,
                    CreatedAt = user.CreatedAt
                };
            return null;
        }
        //a pochemu eto ne v PlaceService??
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
                        Path = p.Path,
                        PlaceId = p.PlaceId,
                    })
                    .ToList() ?? new List<PhotoDTO>(),
            };
        }

        public async Task EditUser(ulong userId, UserDTO userDTO)
        {
            User user = (await _userRepository.GetByIdMainAsync(userId))!;
            user.Name = userDTO.Name;
            //...
            await _userRepository.Update(user);
        }

        public async Task<UserDeleteStatus> DeleteUser(ulong userId, ulong userToDeleteId)
        {
            User admin = (await _userRepository.GetByIdMainAsync(userId))!;
            User? userToBan = await _userRepository.GetByIdMainAsync(userToDeleteId);

            if (userToBan == null)
                return UserDeleteStatus.UserNotExists;

            if (admin.IsAdmin == false)
                return UserDeleteStatus.CantbanUsers;

            await _userRepository.RemoveAsync(userToBan);
            return UserDeleteStatus.Success;
        }
    }
}
