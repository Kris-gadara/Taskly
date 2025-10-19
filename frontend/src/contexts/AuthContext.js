import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  joinedDate: new Date().toISOString(),
};

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setUser(DEMO_USER);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    // Demo login - always succeeds
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    navigate('/');
    return { user: DEMO_USER };
  };

  const register = async (userData) => {
    // Demo register - always succeeds
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    navigate('/');
    return { user: DEMO_USER };
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};