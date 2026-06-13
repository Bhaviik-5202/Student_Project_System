import axios from 'axios';
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const hasContentType =
      config.headers['Content-Type'] || config.headers['content-type'];

    if (
      config.data &&
      !(config.data instanceof FormData) &&
      !hasContentType
    ) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Prevent caching for GET requests by adding a timestamp
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // If the response has the standardized structure, return the inner object
    if (response.data && typeof response.data.success !== 'undefined') {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ROLE);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
