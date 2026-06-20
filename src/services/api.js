/**
 * Axios instance with:
 * - Base URL from environment variable
 * - Automatic Authorization header injection
 * - Access token refresh on 401 (using stored refresh token)
 * - Centralized error normalization
 */

import axios from 'axios';
import { useAuthStore } from '@store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Attaches the access token to every outgoing request automatically.
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401: attempt a silent token refresh using the stored refresh token.
// If that also fails, log the user out.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // The backend does not expose a /auth/refresh endpoint yet,
        // so we log out if the access token expires.
        // When the backend adds refresh, replace this block.
        logout();
        isRefreshing = false;
        processQueue(new Error('Session expired'), null);
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    // Normalize error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';

    return Promise.reject(new Error(message));
  },
);

export default api;
