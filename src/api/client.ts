/**
 * API client - Axios instance with auth & error handling
 */

import axios, { AxiosError } from 'axios';
import { APP_CONFIG } from '@/config';

export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
      localStorage.removeItem(APP_CONFIG.USER_KEY);
      window.location.href = '/login';
    }
    const message = error.response?.data?.message ?? error.message ?? 'Có lỗi xảy ra';
    return Promise.reject(new Error(message));
  },
);
