import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TaskManager.css';

const API_URL = 'http://localhost:5174/api/tasks';


function TaskManager({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch(API_URL, { headers: { ...authHeader } });
    if (res.status === 401) {
      setTasks([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  const addTask = async (e) => {
    e.preventDefault();
    const newTask = { title, description, isCompleted: false };
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(newTask),
    });
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const completeTask = async (id, task) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ ...task, isCompleted: true }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { ...authHeader } });
    fetchTasks();
  };

  return (
    <div className="task-manager-container">
      <h1>Stunning Task Manager</h1>
      <div className="calendar-section">
        <Calendar value={date} onChange={setDate} />
      </div>
      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      <div className="tasks-list">
        {loading ? <p>Loading...</p> : tasks.length === 0 ? <p>No tasks yet.</p> : (
          tasks.map(task => (
            <div key={task.id} className={`task-item${task.isCompleted ? ' completed' : ''}`}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div className="task-actions">
                {!task.isCompleted && (
                  <button onClick={() => completeTask(task.id, task)}>Complete</button>
                )}
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskManager;
