using Microsoft.AspNetCore.Mvc;
using TasklyApi.Models;
using TasklyApi.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace TasklyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _service;

        public TasksController(TaskService service)
        {
            _service = service;
        }

        private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

        [HttpGet]
        public async Task<ActionResult<List<TaskItem>>> GetUserTasks()
        {
            var userId = GetUserId();
            return await _service.GetUserTasksAsync(userId);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem?>> Get(string id)
        {
            var task = await _service.GetByIdAsync(id);
            if (task == null) return NotFound();

            var userId = GetUserId();
            if (task.AssignedUserId != userId)
                return Forbid();

            return task;
        }

        [HttpPost]
        public async Task<IActionResult> Create(TaskItem task)
        {
            task.AssignedUserId = GetUserId();
            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;

            await _service.CreateAsync(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, TaskItem task)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var userId = GetUserId();
            if (existing.AssignedUserId != userId)
                return Forbid();

            task.Id = id;
            task.AssignedUserId = userId;
            task.UpdatedAt = DateTime.UtcNow;

            if (task.IsCompleted && !task.CompletedDate.HasValue)
            {
                task.CompletedDate = DateTime.UtcNow;
                task.Status = "Completed";
            }

            await _service.UpdateAsync(id, task);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var userId = GetUserId();
            if (existing.AssignedUserId != userId)
                return Forbid();

            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteTask(string id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var userId = GetUserId();
            if (existing.AssignedUserId != userId)
                return Forbid();

            await _service.CompleteTaskAsync(id);
            return NoContent();
        }
    }
}
