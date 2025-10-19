using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TasklyApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = string.Empty;

        [BsonElement("role")]
        public string Role { get; set; } = "user";

        [BsonElement("joinedDate")]
        public DateTime JoinedDate { get; set; }

        [BsonElement("lastActive")]
        public DateTime LastActive { get; set; }

        [BsonElement("preferences")]
        public UserPreferences Preferences { get; set; } = new();

        [BsonElement("stats")]
        public Dictionary<string, int> Stats { get; set; } = new();
    }

    public class UserPreferences
    {
        [BsonElement("theme")]
        public string Theme { get; set; } = "light";

        [BsonElement("emailNotifications")]
        public bool EmailNotifications { get; set; } = true;

        [BsonElement("taskReminders")]
        public bool TaskReminders { get; set; } = true;
    }
}
