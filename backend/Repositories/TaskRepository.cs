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
        }

        public async Task<List<TaskItem>> GetAllAsync() => await _tasks.Find(_ => true).ToListAsync();

        public async Task<TaskItem?> GetByIdAsync(string id) => await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(TaskItem task) => await _tasks.InsertOneAsync(task);

        public async Task UpdateAsync(string id, TaskItem task) => await _tasks.ReplaceOneAsync(t => t.Id == id, task);

        public async Task DeleteAsync(string id) => await _tasks.DeleteOneAsync(t => t.Id == id);
    }
}
