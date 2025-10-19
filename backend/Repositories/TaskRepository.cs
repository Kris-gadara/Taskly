using MongoDB.Driver;
using TasklyApi.Models;

namespace TasklyApi.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly IMongoCollection<TaskItem> _tasks;

        public TaskRepository(MongoDbSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _tasks = database.GetCollection<TaskItem>("Tasks");

            // Create indexes
            var indexKeysDefinition = Builders<TaskItem>.IndexKeys.Ascending(task => task.AssignedUserId);
            _tasks.Indexes.CreateOne(new CreateIndexModel<TaskItem>(indexKeysDefinition));
        }

        public async Task<List<TaskItem>> GetAllAsync() =>
            await _tasks.Find(_ => true)
                .SortByDescending(t => t.CreatedAt)
                .ToListAsync();

        public async Task<List<TaskItem>> GetUserTasksAsync(string userId) =>
            await _tasks.Find(t => t.AssignedUserId == userId)
                .SortByDescending(t => t.CreatedAt)
                .ToListAsync();

        public async Task<TaskItem?> GetByIdAsync(string id) =>
            await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(TaskItem task)
        {
            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;
            await _tasks.InsertOneAsync(task);
        }

        public async Task UpdateAsync(string id, TaskItem task)
        {
            task.UpdatedAt = DateTime.UtcNow;
            if (task.IsCompleted && !task.CompletedDate.HasValue)
            {
                task.CompletedDate = DateTime.UtcNow;
                task.Status = "Completed";
            }
            await _tasks.ReplaceOneAsync(t => t.Id == id, task);
        }

        public async Task DeleteAsync(string id) =>
            await _tasks.DeleteOneAsync(t => t.Id == id);

        public async Task CompleteTaskAsync(string id)
        {
            var update = Builders<TaskItem>.Update
                .Set(t => t.IsCompleted, true)
                .Set(t => t.Status, "Completed")
                .Set(t => t.CompletedDate, DateTime.UtcNow)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            await _tasks.UpdateOneAsync(t => t.Id == id, update);
        }
    }
}
