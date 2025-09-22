using Microsoft.AspNetCore.Mvc;
using TasklyApi.Models;
using TasklyApi.Services;

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

        [HttpGet]
        public async Task<ActionResult<List<TaskItem>>> Get() => await _service.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem?>> Get(string id)
        {
            var task = await _service.GetByIdAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        public async Task<IActionResult> Create(TaskItem task)
        {
            await _service.CreateAsync(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, TaskItem task)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();
            task.Id = id;
            await _service.UpdateAsync(id, task);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
