using Application.DTOs.UserDTOs;
using Entities;
using Infrastructure.Repository;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace Application.Services
{

    public class TokenService
    {
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly UserRepository _userRepository;

        public TokenService(IOptions<JwtConfig> config, UserRepository userRepository)
        {
            _secretKey = config.Value.Key;
            _issuer = config.Value.Issuer;
            _audience = config.Value.Audience;
            _userRepository = userRepository;
        }


        public async Task<string> GenerateToken(UserLoginDTO loginData)
        {
            List<Claim> claims = new();
            ulong? UserId = null;

            if (loginData.Email != null)
            {
                var userByEmail = await _userRepository.GetByEmailAsync(loginData.Email);
                UserId = userByEmail?.Id;
            }
            if (loginData.GoogleId != null)
            {
                var userByGoogle = await _userRepository.GetByGoogleIdAsync(loginData.GoogleId);
                UserId = userByGoogle?.Id;
            }
            if (loginData.FacebookId != null)
            {
                var userByFacebook = await _userRepository.GetByFacebookIdAsync(loginData.FacebookId);
                UserId = userByFacebook?.Id;
            }
            else
                return LoginStatus.UnknownOathProvider.ToString();


            if (UserId == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            claims.Add(new Claim("Id", UserId.Value.ToString()));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public int GetUserIdFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secretKey);

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _issuer,
                ValidAudience = _audience,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var userIdClaim = principal.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new SecurityTokenException("Id claim missing or invalid");
            }

            return userId;
        }

    }
}
