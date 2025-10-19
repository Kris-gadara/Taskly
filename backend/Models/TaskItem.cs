using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TasklyApi.Models
{
    public class TaskItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("status")]
        public string Status { get; set; } = "pending";

        [BsonElement("priority")]
        public string Priority { get; set; } = "medium";

        [BsonElement("dueDate")]
        public DateTime DueDate { get; set; }

        [BsonElement("assignedUserId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string AssignedUserId { get; set; } = string.Empty;

        [BsonElement("progress")]
        public int Progress { get; set; }

        [BsonElement("tags")]
        public string[] Tags { get; set; } = Array.Empty<string>();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }

        [BsonElement("order")]
        public int Order { get; set; }
    }
}
