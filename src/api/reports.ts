import { apiClient } from './client';

export const reportsApi = {
  getDashboard: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<{
      data: {
        summary: {
          totalTrips: number;
          totalRevenue: number;
          totalProfit: number;
          activeVehicles: number;
          activeDrivers: number;
        };
      };
    }>('/reports/dashboard', { params }),

  getVehicles: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<{ data: unknown[] }>('/reports/vehicles', { params }),

  getDrivers: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<{ data: unknown[] }>('/reports/drivers', { params }),

  getCustomers: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<{ data: unknown[] }>('/reports/customers', { params }),

  getProfitLoss: (params: { startDate: string; endDate: string; groupBy?: string }) =>
    apiClient.get<{ data: unknown[] }>('/reports/profit-loss', { params }),
};
