/**
 * Route definitions - centralized routing config
 */

export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  VEHICLES: '/vehicles',
  EMPLOYEES: '/employees',
  CUSTOMERS: '/customers',
  TRIPS: '/trips',
  DEBTS: '/debts',
  TRANSACTIONS: '/transactions',
  REPORTS: '/reports',
} as const;

export const MENU_ROUTES = [
  { path: ROUTES.DASHBOARD, name: 'Tổng quan', icon: 'DashboardOutlined' },
  { path: ROUTES.VEHICLES, name: 'Quản lý xe', icon: 'CarOutlined' },
  { path: ROUTES.EMPLOYEES, name: 'Quản lý nhân viên', icon: 'UserOutlined' },
  { path: ROUTES.CUSTOMERS, name: 'Quản lý khách hàng', icon: 'TeamOutlined' },
  { path: ROUTES.TRIPS, name: 'Chuyến xe', icon: 'SwapOutlined' },
  { path: ROUTES.DEBTS, name: 'Quản lý công nợ', icon: 'DollarOutlined' },
  { path: ROUTES.TRANSACTIONS, name: 'Thu - Chi', icon: 'AccountBookOutlined' },
  { path: ROUTES.REPORTS, name: 'Báo cáo', icon: 'BarChartOutlined' },
] as const;
