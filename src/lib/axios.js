import axios from 'axios';

const api = axios.create({
  baseURL:"https://collegesecracy-backend.onrender.com",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 📦 Request Interceptor
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

// 🔁 Response Interceptor with Refresh Token Handling
api.interceptors.response.use(
  response => {
    console.log('[Axios] Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async error => {
    console.error('[Axios] Response error:', {
      message: error.message,
      config: error.config,
      response: error.response
    });

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      const isRefreshRoute = originalRequest.url.includes('/auth/refresh-token');
      const isLogoutRoute = originalRequest.url.includes('/auth/logout');
      const isCheckSession = originalRequest.skipAuthRetry;

      if (isRefreshRoute || isLogoutRoute || isCheckSession) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        const res = await api.post('/api/v1/auth/refresh-token', {}, { withCredentials: true });
        console.log('[Axios] 🔁 Token refreshed');

        processQueue(null);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshErr) {
        console.error('[Axios] 🔁 Refresh token failed:', refreshErr);
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Prevent redirect spam
        if (!window.__redirectedToLogin) {
          window.__redirectedToLogin = true;
          window.location.href = '/';
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
