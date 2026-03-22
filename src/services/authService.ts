import { authApi } from '@/api/auth';
import type { LoginResponse, UserRole } from '@/types/auth';

export const authService = {
  async login(payload: { username: string; password: string }): Promise<LoginResponse> {
    const res = await authApi.login({
      email: payload.username,
      password: payload.password,
    });

    // Support both shapes: { success, data: { token, user } } and { token, user }
    const raw = (res as any).data;
    const inner = raw?.data ?? raw;
    if (!inner || (!inner.accessToken && !inner.token) || !inner.refreshToken || !inner.user) {
      throw new Error('Invalid login response');
    }

    const accessToken = inner.accessToken ?? inner.token;
    const { refreshToken, user } = inner;
    const normalizedRole = user.role.toUpperCase() as UserRole;

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        companyId: user.companyId,
        role: normalizedRole,
      },
    };
  },
};

