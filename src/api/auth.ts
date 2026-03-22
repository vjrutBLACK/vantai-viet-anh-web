import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyId: string;
}

export interface LoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken }),

  getMe: () => apiClient.get<ApiResponse<AuthUser>>('/auth/me'),
};
