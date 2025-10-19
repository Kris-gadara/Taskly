import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const handleLogin = useCallback(async (username, password) => {
    try {
      // For demo purposes, we're using a simple authentication
      // In production, you would make an API call here
      if (username === 'demo' && password === 'demo') {
        const demoToken = 'demo-token';
        localStorage.setItem('token', demoToken);
        localStorage.setItem('username', username);
        setToken(demoToken);
        setUser({ username });
        navigate('/');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, [navigate]);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        try {
          // You can add user profile fetching here if needed
          setUser({ username: localStorage.getItem('username') });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [handleLogout]);

  const value = {
    token,
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!token,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};