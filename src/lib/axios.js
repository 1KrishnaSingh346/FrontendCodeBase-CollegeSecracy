import axios from 'axios';
import useAuthStore  from '../store/useAuthStore.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(config => {
  console.log('[Axios] Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
}, error => {
  console.error('[Axios] Request error:', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(response => {
  console.log('[Axios] Response:', {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers
  });
  return response;
}, error => {
  console.error('[Axios] Response error:', {
    message: error.message,
    config: error.config,
    response: error.response
  });
  return Promise.reject(error);
});

export default api;