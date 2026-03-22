export type UserRole = 'ADMIN' | 'DRIVER' | 'ACCOUNTANT' | 'DISPATCHER';

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

