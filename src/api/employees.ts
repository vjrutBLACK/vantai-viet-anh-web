import { apiClient } from './client';
import { normalizeNumeric } from '@/utils/number';

/**
 * Body khớp `CreateEmployeeDto` / `UpdateEmployeeDto` (NestJS, `vantaiAnhViet`).
 * Trường camelCase: employeeCode, fullName (hoặc alias name), phone, email, position,
 * licenseNumber, licenseType, status, baseSalary.
 */
export type EmployeeCreatePayload = {
  employeeCode?: string;
  fullName: string;
  phone?: string;
  email?: string;
  position?: string;
  licenseNumber?: string;
  licenseType?: string;
  status?: string;
  baseSalary: number;
};

export type EmployeeUpdatePayload = Partial<EmployeeCreatePayload>;

/** Chuẩn hóa giá trị form → payload API (email/SĐT rỗng → không gửi, tránh @IsEmail fail với ""). */
export function normalizeEmployeeWritePayload(values: {
  employeeCode?: string;
  fullName: string;
  baseSalary: number;
  phone?: string;
  email?: string;
  position?: string;
  licenseNumber?: string;
  licenseType?: string;
  status?: string;
}): EmployeeCreatePayload {
  const trim = (s?: string | null) => {
    const t = s?.trim();
    return t === '' || t === undefined ? undefined : t;
  };
  return {
    employeeCode: trim(values.employeeCode),
    fullName: values.fullName.trim(),
    baseSalary: normalizeNumeric(values.baseSalary, 0),
    phone: trim(values.phone),
    email: trim(values.email),
    position: values.position || undefined,
    licenseNumber: trim(values.licenseNumber),
    licenseType: trim(values.licenseType),
    status: values.status,
  };
}

export interface Employee {
  id: string;
  employeeCode?: string;
  fullName: string;
  phone?: string;
  email?: string;
  position?: string;
  licenseNumber?: string;
  licenseType?: string;
  /** BE có thể trả number hoặc string (JSON). Dùng `normalizeNumeric` khi set form. */
  baseSalary?: number | string;
  /** Một số API trả snake_case */
  base_salary?: number | string;
  status: string;
}

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: string;
  status?: string;
}

export type EmployeeTrip = {
  id: string;
  tripCode?: string | null;
  tripDate: string;
  /** API trả `notes` (không phải `note`) */
  notes?: string | null;
  revenue?: number | string;
  status?: string;
};

export type EmployeeSalary = {
  id?: string;
  period?: string;
  fromDate?: string;
  toDate?: string;
  baseAmount?: number;
  bonus?: number;
  deduction?: number;
  total?: number;
};

export const employeesApi = {
  list: (params?: EmployeeListParams) =>
    apiClient.get<{ data: Employee[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/employees',
      { params },
    ),
  getDrivers: (search?: string) =>
    apiClient.get<{ data: Employee[] }>('/employees/drivers', { params: { search } }),
  getById: (id: string) => apiClient.get<{ data: Employee }>(`/employees/${id}`),
  getTrips: (
    id: string,
    params?: { fromDate?: string; toDate?: string; page?: number; limit?: number },
  ) =>
    apiClient.get<{
      data: EmployeeTrip[];
      pagination?: { page: number; limit: number; total: number; totalPages: number };
    }>(`/employees/${id}/trips`, { params }),
  getSalaries: (
    id: string,
    params: { fromDate: string; toDate: string; source?: 'dynamic' | 'transactions' },
  ) =>
    apiClient.get<{ data: EmployeeSalary[] }>(`/employees/${id}/salaries`, { params }),
  getIncome: (
    id: string,
    params: { fromDate: string; toDate: string },
  ) =>
    apiClient.get<{ data: { totalTrips: number; totalRevenue: number; salary: number } }>(
      `/employees/${id}/income`,
      { params },
    ),
  create: (data: EmployeeCreatePayload) => apiClient.post<{ data: Employee }>('/employees', data),
  update: (id: string, data: EmployeeUpdatePayload) =>
    apiClient.patch<{ data: Employee }>(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}`),
};
