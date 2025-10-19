namespace TasklyApi.Models
{
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = "mongodb://localhost:27017";
        public string DatabaseName { get; set; } = "TasklyDb";
        public string TasksCollectionName { get; set; } = "Tasks";
        public string UsersCollectionName { get; set; } = "Users";
        public string RefreshTokensCollectionName { get; set; } = "RefreshTokens";
    }
}
