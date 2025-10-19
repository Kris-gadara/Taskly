using System;

namespace TasklyApi.DTOs
{
    public class TaskDTO
    {
        public string? Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "pending";
        public string Priority { get; set; } = "medium";
        public DateTime DueDate { get; set; }
        public string AssignedUserId { get; set; } = string.Empty;
        public int Progress { get; set; }
        public string[] Tags { get; set; } = Array.Empty<string>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateTaskDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public DateTime DueDate { get; set; }
        public string[] Tags { get; set; } = Array.Empty<string>();
    }

    public class UpdateTaskDTO
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public int? Progress { get; set; }
        public string[]? Tags { get; set; }
    }
}