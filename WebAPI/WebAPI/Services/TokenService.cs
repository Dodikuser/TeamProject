using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Controllers;

namespace WebAPI.Services
{
    public class TokenService
    {
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;

        public TokenService(string secretKey, string issuer, string audience)
        {
            _secretKey = secretKey;
            _issuer = issuer;
            _audience = audience;
        }

        public string GenerateToken(LoginData loginData)
        {
            List<Claim> claims = new();

            switch (loginData)
            {
                case StandardLoginData standard:
                    claims.Add(new Claim(ClaimTypes.Name, standard.Name ?? ""));
                    claims.Add(new Claim(ClaimTypes.Email, standard.Email ?? ""));
                    claims.Add(new Claim("auth_type", "standard"));
                    break;

                case GoogleLoginData google:
                    claims.Add(new Claim("google_id", google.GoogleId ?? ""));
                    claims.Add(new Claim("auth_type", "google"));
                    break;

                case FacebookLoginData facebook:
                    claims.Add(new Claim("facebook_id", facebook.FacebookId ?? ""));
                    claims.Add(new Claim("auth_type", "facebook"));
                    break;

                default:
                    throw new ArgumentException("Unsupported login type");
            }

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
    }
}
