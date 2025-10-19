using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TasklyApi.Models
{
    public class RefreshToken
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("token")]
        public string Token { get; set; } = string.Empty;

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("isRevoked")]
        public bool IsRevoked { get; set; }

        public bool IsActive => !IsRevoked && ExpiresAt > DateTime.UtcNow;
    }
}