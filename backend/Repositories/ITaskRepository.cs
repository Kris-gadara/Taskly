using TasklyApi.Models;

namespace TasklyApi.Repositories
{
    public interface ITaskRepository
    {
        Task<List<TaskItem>> GetAllAsync();
        Task<List<TaskItem>> GetUserTasksAsync(string userId);
        Task<TaskItem?> GetByIdAsync(string id);
        Task CreateAsync(TaskItem task);
        Task UpdateAsync(string id, TaskItem task);
        Task DeleteAsync(string id);
        Task CompleteTaskAsync(string id);
    }
}
