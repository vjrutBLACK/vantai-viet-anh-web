import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import VehiclesPage from '@/pages/Vehicles';
import EmployeesPage from '@/pages/Employees';
import CustomersPage from '@/pages/Customers';
import TripsPage from '@/pages/Trips';
import TransactionsPage from '@/pages/Transactions';
import ReportsPage from '@/pages/Reports';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path={ROUTES.VEHICLES.slice(1)} element={<VehiclesPage />} />
        <Route path={ROUTES.EMPLOYEES.slice(1)} element={<EmployeesPage />} />
        <Route path={ROUTES.CUSTOMERS.slice(1)} element={<CustomersPage />} />
        <Route path={ROUTES.TRIPS.slice(1)} element={<TripsPage />} />
        <Route path={ROUTES.TRANSACTIONS.slice(1)} element={<TransactionsPage />} />
        <Route path={ROUTES.REPORTS.slice(1)} element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
