import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sands_token'); // Standardized token name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (Expired token, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sands_token');
      localStorage.removeItem('sands_current_user');
      // Optional: Optional: Redirect to login or refresh page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
