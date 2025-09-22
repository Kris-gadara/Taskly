import React, { useState } from 'react';
import './TaskManager.css';

const API_URL = 'http://localhost:5174/api/auth';

function Auth({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? 'login' : 'signup';
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data);
      return;
    }
    if (isLogin && data.token) {
      onAuth(data.token);
    } else if (!isLogin) {
      setIsLogin(true);
      setError('Signup successful! Please login.');
    }
  };

  return (
    <div className="task-manager-container">
      <h2>{isLogin ? 'Login to Taskly' : 'Sign Up for Taskly'}</h2>
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: '#2a5298', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}

export default Auth;
