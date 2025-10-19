import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TaskManager.css';
import { API_ENDPOINTS, getAuthHeader } from './config/api';
import { useAuth } from './context/AuthContext';


function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_ENDPOINTS.tasks, {
        headers: getAuthHeader(token)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const newTask = {
        title,
        description,
        dueDate: date.toISOString(),
        isCompleted: false,
        priority: "Medium",
        status: "NotStarted"
      };

      const res = await fetch(API_ENDPOINTS.tasks, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  const completeTask = async (id, task) => {
    try {
      setError(null);
      const res = await fetch(`${API_ENDPOINTS.tasks}/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify({
          ...task,
          isCompleted: true,
          status: "Completed",
          completedDate: new Date().toISOString()
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      fetchTasks();
    } catch (err) {
      setError('Failed to complete task. Please try again.');
      console.error('Error completing task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      setError(null);
      const res = await fetch(`${API_ENDPOINTS.tasks}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(token)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      fetchTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="task-manager-container">
      <h1>Task Manager</h1>
      
      {error && (
        <div className="error-message p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="calendar-section bg-white p-4 rounded-lg shadow mb-6">
            <Calendar value={date} onChange={setDate} className="w-full" />
          </div>

          <form className="task-form bg-white p-6 rounded-lg shadow" onSubmit={addTask}>
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter task description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>

        <div className="tasks-list">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No tasks yet. Add your first task!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`task-item bg-white p-4 rounded-lg shadow transition-all ${
                    task.isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'
                  }`}
                >
                  <div className="mb-2">
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="task-actions flex justify-end space-x-2 mt-4">
                    {!task.isCompleted && (
                      <button
                        onClick={() => completeTask(task.id, task)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
