import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/utils/routes';

type PermissionGuardProps = {
  allowedRoles?: UserRole[];
  children: ReactNode;
};

export function PermissionGuard({ allowedRoles, children }: PermissionGuardProps) {
  const { user, isInitialized } = useAuthContext();

  // Chờ hydrate auth từ localStorage để tránh redirect nhầm khi reload
  if (!isInitialized) {
    return null;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
}

