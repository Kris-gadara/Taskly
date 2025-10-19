using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TasklyApi.Models
{
    public class ActivityLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("taskId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TaskId { get; set; } = string.Empty;

        [BsonElement("action")]
        public string Action { get; set; } = string.Empty;

        [BsonElement("details")]
        public string Details { get; set; } = string.Empty;

        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; }

        [BsonElement("changes")]
        public Dictionary<string, object> Changes { get; set; } = new();
    }
}