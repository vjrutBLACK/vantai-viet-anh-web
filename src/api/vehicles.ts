import { apiClient } from './client';

export interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleType?: string;
  brand?: string;
  model?: string;
  year?: number;
  capacity?: number;
  status: string;
}

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehicleType?: string;
}

export const vehiclesApi = {
  list: (params?: VehicleListParams) =>
    apiClient.get<{ data: Vehicle[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/vehicles',
      { params },
    ),
  getById: (id: string) => apiClient.get<{ data: Vehicle }>(`/vehicles/${id}`),
  create: (data: Partial<Vehicle>) => apiClient.post<{ data: Vehicle }>('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>) => apiClient.patch<{ data: Vehicle }>(`/vehicles/${id}`, data),
  delete: (id: string) => apiClient.delete(`/vehicles/${id}`),
  getStats: () => apiClient.get<{ data: { total: number; active: number; inactive: number; maintenance: number } }>('/vehicles/stats'),
};
