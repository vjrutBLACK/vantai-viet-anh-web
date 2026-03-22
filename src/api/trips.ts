import { apiClient } from './client';

export interface Trip {
  id: string;
  tripCode?: string;
  tripDate: string;
  vehicle?: { id: string; licensePlate: string };
  driver?: { id: string; fullName: string };
  coDriver?: { id: string; fullName: string };
  customer?: { id: string; name: string };
  cargoType?: string;
  cargoWeight?: number;
  cargoQuantity?: number;
  address?: string;
  revenue?: number | string;
  fuelCost?: number | string;
  tollCost?: number | string;
  driverSalary?: number | string;
  otherCosts?: number | string;
  profit?: number | string;
  status: string;
  notes?: string;
}

export interface TripListParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
  driverId?: string;
  customerId?: string;
  status?: string;
  search?: string;
}

export const tripsApi = {
  list: (params?: TripListParams) =>
    apiClient.get<{ data: Trip[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/trips',
      { params },
    ),
  getById: (id: string) => apiClient.get<{ data: Trip }>(`/trips/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post<{ data: Trip }>('/trips', data),
  update: (id: string, data: Record<string, unknown>) => apiClient.patch<{ data: Trip }>(`/trips/${id}`, data),
  delete: (id: string) => apiClient.delete(`/trips/${id}`),
  getStats: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<{ data: { totalTrips: number; totalRevenue: number; totalProfit: number } }>('/trips/stats', {
      params,
    }),
};
