import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: token ekle
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('fbet_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Response interceptor: 401 → logout
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fbet_token');
      localStorage.removeItem('fbet_user');
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
