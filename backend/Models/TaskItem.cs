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
        public string Status { get; set; } = "NotStarted";

        [BsonElement("isCompleted")]
        public bool IsCompleted { get; set; }

        [BsonElement("priority")]
        public string Priority { get; set; } = "Medium";

        [BsonElement("dueDate")]
        public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(1);

        [BsonElement("completedDate")]
        public DateTime? CompletedDate { get; set; }

        [BsonElement("assignedUserId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string AssignedUserId { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
