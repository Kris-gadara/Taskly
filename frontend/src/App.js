
import React, { useState } from 'react';
import TaskManager from './TaskManager';
import Auth from './Auth';
import './TaskManager.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');

  const handleAuth = (jwt) => {
    setToken(jwt);
    localStorage.setItem('jwt', jwt);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('jwt');
  };

  return token ? (
    <>
      <button style={{ position: 'absolute', top: 20, right: 20, background: '#2a5298', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', zIndex: 10 }} onClick={handleLogout}>Logout</button>
      <TaskManager token={token} />
    </>
  ) : (
    <Auth onAuth={handleAuth} />
  );
}

export default App;
