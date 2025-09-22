using TasklyApi.Models;
using TasklyApi.Repositories;

namespace TasklyApi.Services
{
    public class TaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        public Task<List<TaskItem>> GetAllAsync() => _repository.GetAllAsync();
        public Task<TaskItem?> GetByIdAsync(string id) => _repository.GetByIdAsync(id);
        public Task CreateAsync(TaskItem task) => _repository.CreateAsync(task);
        public Task UpdateAsync(string id, TaskItem task) => _repository.UpdateAsync(id, task);
        public Task DeleteAsync(string id) => _repository.DeleteAsync(id);
    }
}
