const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7224';

export const API_ENDPOINTS = {
  tasks: `${API_BASE_URL}/api/tasks`,
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    refreshToken: `${API_BASE_URL}/api/auth/refresh-token`,
  }
};

export const getAuthHeader = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});