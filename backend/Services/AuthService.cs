using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TasklyApi.DTOs;
using TasklyApi.Models;
using TasklyApi.Repositories;

namespace TasklyApi.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly string _jwtSecret;

        public AuthService(
            IUserRepository userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IConfiguration config)
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _jwtSecret = config["Jwt:Secret"] ?? throw new InvalidOperationException("JWT secret not configured");
        }

        public async Task<(User User, string Token, string RefreshToken)> RegisterAsync(
            string name,
            string email,
            string password)
        {
            if (await _userRepository.GetByEmailAsync(email) != null)
            {
                throw new Exception("Email already exists");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = passwordHash,
                Role = "user",
                JoinedDate = DateTime.UtcNow,
                LastActive = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);
            var token = await GenerateTokenAsync(user.Id);
            var refreshToken = await GenerateRefreshTokenAsync(user.Id);

            return (user, token, refreshToken);
        }

        public async Task<(User User, string Token, string RefreshToken)> LoginAsync(
            string email,
            string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new Exception("Invalid credentials");
            }

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials");
            }

            var token = await GenerateTokenAsync(user.Id);
            var refreshToken = await GenerateRefreshTokenAsync(user.Id);

            return (user, token, refreshToken);
        }

        public async Task<string> GenerateTokenAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new Exception("User not found");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("userId", user.Id),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private async Task<string> GenerateRefreshTokenAsync(string userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            await _refreshTokenRepository.CreateAsync(refreshToken);
            return refreshToken.Token;
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            return user;
        }

        public async Task<User> UpdateUserAsync(string userId, UserUpdateDTO updateDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Check if email is being changed and if it's already taken
            if (updateDto.Email != user.Email)
            {
                var existingUser = await _userRepository.GetByEmailAsync(updateDto.Email);
                if (existingUser != null)
                {
                    throw new Exception("Email already in use");
                }
            }

            user.Name = updateDto.Name;
            user.Email = updateDto.Email;
            user.LastActive = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            return user;
        }

        public async Task ChangePasswordAsync(
            string userId,
            string currentPassword,
            string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                throw new Exception("Current password is incorrect");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.LastActive = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Revoke all refresh tokens when password is changed
            await _refreshTokenRepository.DeleteAllForUserAsync(userId);
        }

        public async Task<object> GetUserStatsAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            user.LastActive = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            var stats = user.Stats;
            return new
            {
                TasksCompleted = stats.GetValueOrDefault("completed", 0),
                TasksPending = stats.GetValueOrDefault("pending", 0),
                LastActive = user.LastActive,
                JoinedDays = (DateTime.UtcNow - user.JoinedDate).Days
            };
        }
    }
}
