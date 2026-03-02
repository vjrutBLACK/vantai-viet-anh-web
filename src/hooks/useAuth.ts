import { useState, useCallback, useEffect } from 'react';
import { authApi, type LoginResponse } from '@/api/auth';
import { APP_CONFIG } from '@/config';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyId: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(APP_CONFIG.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password }) as { data: LoginResponse };
      const { token, user: u } = res.data;
      localStorage.setItem(APP_CONFIG.TOKEN_KEY, token);
      localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(u));
      setUser(u);
      return u;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Đăng nhập thất bại';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    if (!token) return null;
    try {
      const res = await authApi.getMe() as { data: AuthUser };
      const u = res.data;
      localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(u));
      setUser(u);
      return u;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    if (user) return;
    checkAuth();
  }, []);

  return { user, loading, error, login, logout, checkAuth };
}
