import { apiClient } from './client';

export interface Employee {
  id: string;
  employeeCode?: string;
  fullName: string;
  phone?: string;
  email?: string;
  position?: string;
  licenseNumber?: string;
  licenseType?: string;
  status: string;
}

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: string;
  status?: string;
}

export const employeesApi = {
  list: (params?: EmployeeListParams) =>
    apiClient.get<{ data: Employee[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/employees',
      { params },
    ),
  getDrivers: (search?: string) =>
    apiClient.get<{ data: Employee[] }>('/employees/drivers', { params: { search } }),
  getById: (id: string) => apiClient.get<{ data: Employee }>(`/employees/${id}`),
  create: (data: Partial<Employee>) => apiClient.post<{ data: Employee }>('/employees', data),
  update: (id: string, data: Partial<Employee>) => apiClient.patch<{ data: Employee }>(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}`),
};
