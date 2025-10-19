using TasklyApi.Models;

namespace TasklyApi.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByToken(string token);
        Task<RefreshToken> CreateAsync(RefreshToken refreshToken);
        Task<bool> RevokeAsync(string token);
        Task<bool> DeleteAllForUserAsync(string userId);
    }
}