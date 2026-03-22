import { apiClient } from '@/api/client';
import type { Vehicle } from './types';

type VehicleListResponse = {
  success: boolean;
  data: Vehicle[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

export type VehicleQueryParams = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export async function fetchVehicles(params: VehicleQueryParams) {
  const res = await apiClient.get<VehicleListResponse>('/vehicles', {
    params,
  });
  const total = res.total ?? res.pagination?.total ?? 0;
  return {
    data: res.data ?? [],
    total,
  };
}

export async function fetchVehicleDetail(id: string) {
  const res = await apiClient.get<{ success?: boolean; data: Vehicle }>(`/vehicles/${id}`);
  return (res as { data?: Vehicle }).data ?? res;
}

export type VehicleTripsParams = {
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
};

type VehicleTripsResponse = {
  data?: Array<{
    id: string;
    tripCode?: string;
    tripDate: string;
    note?: string;
    revenue?: number;
    status?: string;
  }>;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

export async function fetchVehicleTrips(id: string, params: VehicleTripsParams) {
  const res = await apiClient.get<VehicleTripsResponse>(`/vehicles/${id}/trips`, { params });
  const data = res?.data ?? [];
  const total = res?.pagination?.total ?? data.length;
  return { data, total };
}

export type VehicleRepairsParams = {
  fromDate?: string;
  toDate?: string;
};

/** Khớp `getRepairHistory` (BE): map từ transaction REPAIR gắn xe */
export type VehicleRepair = {
  id: string;
  /** BE trả `date` (transactionDate) */
  date?: string;
  amount?: number | string;
  /** BE trả `note` (description) */
  note?: string | null;
  category?: string;
};

type VehicleRepairsResponse = {
  data?: VehicleRepair[];
};

export async function fetchVehicleRepairs(id: string, params?: VehicleRepairsParams) {
  const res = await apiClient.get<VehicleRepairsResponse>(`/vehicles/${id}/repairs`, { params });
  return { data: res?.data ?? [] };
}

/**
 * API: plateNumber|licensePlate (ít nhất một), type alias vehicleType, status ACTIVE→active
 */
export async function createVehicle(
  payload: Omit<Vehicle, 'id' | 'status'> & { status?: Vehicle['status']; maintenanceCost?: number },
) {
  const body: Record<string, unknown> = { ...payload };
  if (payload.licensePlate) body.plateNumber = payload.licensePlate;
  if (payload.vehicleType) body.type = payload.vehicleType;
  if (payload.status === 'active') body.status = 'ACTIVE';
  else if (payload.status) body.status = payload.status;
  const res = await apiClient.post<{ success: boolean; data: Vehicle }>('/vehicles', body);
  return (res as { data?: Vehicle }).data ?? res;
}

/** API: plateNumber|licensePlate, type|vehicleType, status ACTIVE→active */
export async function updateVehicle(id: string, payload: Partial<Omit<Vehicle, 'id'>>) {
  const body: Record<string, unknown> = { ...payload };
  if (payload.licensePlate != null) body.plateNumber = payload.licensePlate;
  if (payload.vehicleType != null) body.type = payload.vehicleType;
  if (payload.status === 'active') body.status = 'ACTIVE';
  else if (payload.status) body.status = payload.status;
  const res = await apiClient.patch<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`, body);
  return (res as { data?: Vehicle }).data ?? res;
}

