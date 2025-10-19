using MongoDB.Driver;
using TasklyApi.Models;

namespace TasklyApi.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly IMongoCollection<RefreshToken> _tokens;

        public RefreshTokenRepository(MongoDbSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _tokens = database.GetCollection<RefreshToken>("refresh_tokens");

            var indexKeysDefinition = Builders<RefreshToken>.IndexKeys.Ascending(t => t.Token);
            _tokens.Indexes.CreateOne(new CreateIndexModel<RefreshToken>(indexKeysDefinition));

            indexKeysDefinition = Builders<RefreshToken>.IndexKeys.Ascending(t => t.UserId);
            _tokens.Indexes.CreateOne(new CreateIndexModel<RefreshToken>(indexKeysDefinition));
        }

        public async Task<RefreshToken> CreateAsync(RefreshToken refreshToken)
        {
            refreshToken.CreatedAt = DateTime.UtcNow;
            await _tokens.InsertOneAsync(refreshToken);
            return refreshToken;
        }

        public async Task<RefreshToken?> GetByToken(string token)
        {
            return await _tokens.Find(t => t.Token == token).FirstOrDefaultAsync();
        }

        public async Task<bool> RevokeAsync(string token)
        {
            var update = Builders<RefreshToken>.Update.Set(t => t.IsRevoked, true);
            var result = await _tokens.UpdateOneAsync(t => t.Token == token, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAllForUserAsync(string userId)
        {
            var update = Builders<RefreshToken>.Update.Set(t => t.IsRevoked, true);
            var result = await _tokens.UpdateManyAsync(t => t.UserId == userId, update);
            return result.ModifiedCount > 0;
        }
    }
}