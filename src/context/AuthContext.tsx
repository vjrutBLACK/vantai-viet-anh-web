import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { authService } from '@/services/authService';
import type { User, UserRole } from '@/types/auth';
import { APP_CONFIG } from '@/config';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
  login: (payload: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(APP_CONFIG.USER_KEY);
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(APP_CONFIG.TOKEN_KEY),
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem('vantai_refresh_token'),
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    const storedUser = localStorage.getItem(APP_CONFIG.USER_KEY);
    const storedRefresh = localStorage.getItem('vantai_refresh_token');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedRefresh) {
        setRefreshToken(storedRefresh);
      }
    }
    setIsInitialized(true);
  }, []);

  const login: AuthContextValue['login'] = async (payload) => {
    const res = await authService.login(payload);
    setUser(res.user);
    setToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    localStorage.setItem(APP_CONFIG.TOKEN_KEY, res.accessToken);
    localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(res.user));
    localStorage.setItem('vantai_refresh_token', res.refreshToken);
    message.success('Đăng nhập thành công');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
    localStorage.removeItem('vantai_refresh_token');
    message.success('Đã đăng xuất');
  };

  const hasRole: AuthContextValue['hasRole'] = (roles) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      isInitialized,
      login,
      logout,
      hasRole,
    }),
    [user, token, refreshToken, isInitialized],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}

