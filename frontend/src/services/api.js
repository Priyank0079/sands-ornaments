import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearStoredSession = () => {
  localStorage.removeItem('sands_token');
  localStorage.removeItem('sands_current_user');
  localStorage.removeItem('sellerToken');
  localStorage.removeItem('sellerAuth');
  localStorage.removeItem('currentSeller');
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sands_token') || localStorage.getItem('sellerToken');
    if (token && token !== 'undefined' && token !== 'null') {
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
    if (error.response && error.response.status === 401 && !error.config?.skipUnauthorizedLogout) {
      clearStoredSession();
      // Optional: Optional: Redirect to login or refresh page
      // window.location.href = '/login';
    }

    if (error.response && error.response.status === 403 && error.response?.data?.error === 'ACCOUNT_BLOCKED') {
      clearStoredSession();
    }

    return Promise.reject(error);
  }
);

export default api;
