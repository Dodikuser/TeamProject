using Application.DTOs;
using Entities;
using Entities.Models;
using Infrastructure.Repository;

namespace Application.Services
{
    public class UserService(AuthorizationService _authorizationService, UserRepository _userRepository)
    {
        public async Task<Entities.Result> SetIncognito(ulong userId, bool enabled)
        {
            await _userRepository.SetVisitHistoryAsync(userId, enabled);
            await _userRepository.SetSearchHistoryAsync(userId, enabled);

            return Entities.Result.Ok();
        }
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
