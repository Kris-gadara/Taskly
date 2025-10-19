using MongoDB.Driver;
using TasklyApi.Models;

namespace TasklyApi.Repositories
{
    public interface IActivityLogRepository
    {
        Task<List<ActivityLog>> GetUserActivityLogs(string userId);
        Task<List<ActivityLog>> GetTaskActivityLogs(string taskId);
        Task CreateLog(ActivityLog log);
    }

    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly IMongoCollection<ActivityLog> _logs;

        public ActivityLogRepository(MongoDbSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _logs = database.GetCollection<ActivityLog>("activity_logs");

            var indexKeysDefinition = Builders<ActivityLog>.IndexKeys.Ascending(log => log.UserId);
            _logs.Indexes.CreateOne(new CreateIndexModel<ActivityLog>(indexKeysDefinition));

            indexKeysDefinition = Builders<ActivityLog>.IndexKeys.Ascending(log => log.TaskId);
            _logs.Indexes.CreateOne(new CreateIndexModel<ActivityLog>(indexKeysDefinition));
        }

        public async Task<List<ActivityLog>> GetUserActivityLogs(string userId)
        {
            return await _logs.Find(log => log.UserId == userId)
                            .Sort(Builders<ActivityLog>.Sort.Descending(log => log.Timestamp))
                            .ToListAsync();
        }

        public async Task<List<ActivityLog>> GetTaskActivityLogs(string taskId)
        {
            return await _logs.Find(log => log.TaskId == taskId)
                            .Sort(Builders<ActivityLog>.Sort.Descending(log => log.Timestamp))
                            .ToListAsync();
        }

        public async Task CreateLog(ActivityLog log)
        {
            log.Timestamp = DateTime.UtcNow;
            await _logs.InsertOneAsync(log);
        }
    }
}