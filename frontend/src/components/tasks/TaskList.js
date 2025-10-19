import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import TaskForm from './TaskForm';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { TaskService } from '../../services/api';

const priorityColors = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-green-500',
};

const TaskItem = ({ task, onEdit, onDelete, provided, snapshot }) => {
  const dueDateColor =
    new Date(task.dueDate) < new Date()
      ? 'text-red-500'
      : new Date(task.dueDate) < new Date(Date.now() + 86400000)
      ? 'text-yellow-500'
      : 'text-gray-500';

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`card mb-4 transform transition-all duration-200 ${
        snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
          <div className="mt-2 flex items-center space-x-4 text-sm">
            <span className={`flex items-center ${dueDateColor}`}>
              <ClockIcon className="mr-1 h-4 w-4" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
            <span className={`flex items-center ${priorityColors[task.priority]}`}>
              <ExclamationCircleIcon className="mr-1 h-4 w-4" />
              {task.priority}
            </span>
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-100 dark:bg-primary-900 px-2 py-0.5 text-xs text-primary-700 dark:text-primary-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="ml-4 flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-primary-500"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="relative h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary-500"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      const data = await TaskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filters.status !== 'all') {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFilteredTasks(items);

    try {
      await TaskService.updateTaskOrder(items.map((task) => task.id));
    } catch (error) {
      console.error('Error updating task order:', error);
      loadTasks(); // Reload original order if update fails
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await TaskService.createTask({
        ...taskData,
        progress: 0,
        tags: [],
      });
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await TaskService.updateTask(taskId, taskData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Tasks
        </h1>
        <button 
          onClick={() => {
            setEditingTask(null);
            setIsTaskFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          New Task
        </button>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? 
          (data) => handleUpdateTask(editingTask.id, data) : 
          handleCreateTask}
        initialTask={editingTask}
      />

      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search tasks..."
          className="input-field"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />
        <select
          className="input-field"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="input-field"
          value={filters.priority}
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div>
                {filteredTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <TaskItem
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        provided={provided}
                        snapshot={snapshot}
                      />
                    )}
                  </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;