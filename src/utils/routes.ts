export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  VEHICLES: '/vehicles',
  EMPLOYEES: '/employees',
  CUSTOMERS: '/customers',
  TRIPS: '/trips',
  TRANSACTIONS: '/transactions',
  REPORTS: '/reports',
  ORDERS: '/orders',
  DEBTS: '/debts',
  SALARY: '/salary',
  REVENUE: '/revenue',
  INCOME_EXPENSE: '/income-expense',
  SYSTEM_AUDIT: '/system/audit',
} as const;

export type AppRouteKey = keyof typeof ROUTES;

