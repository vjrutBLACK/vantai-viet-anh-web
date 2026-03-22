import { apiClient } from './client';

export interface Customer {
  id: string;
  customerCode?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  contactEmployeeId?: string | null;
  commissionRateMin?: number;
  commissionRateMax?: number;
  status: string;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const customersApi = {
  list: (params?: CustomerListParams) =>
    apiClient.get<{ data: Customer[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/customers',
      { params },
    ),
  getById: (id: string) => apiClient.get<{ data: Customer }>(`/customers/${id}`),
  create: (data: Partial<Customer>) => apiClient.post<{ data: Customer }>('/customers', data),
  update: (id: string, data: Partial<Customer>) => apiClient.patch<{ data: Customer }>(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/customers/${id}`),
};
