import { apiClient } from './client';

/** Loại giao dịch — API trả INCOME | EXPENSE */
export type TransactionType = 'INCOME' | 'EXPENSE' | 'income' | 'expense';

/** Danh mục chuẩn — DB lưu chữ HOA */
export type TransactionCategory = 'TRIP_PAYMENT' | 'FUEL' | 'REPAIR' | 'SALARY';

export interface Transaction {
  id: string;
  transactionCode?: string;
  /** API trả type; alias transactionType */
  type?: TransactionType;
  transactionType?: string;
  transactionDate?: string;
  date?: string;
  category?: string;
  amount: number;
  description?: string;
  note?: string;
  status?: string;
  tripId?: string;
  vehicleId?: string;
  employeeId?: string;
  customerId?: string;
}

export interface TransactionListParams {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE' | 'income' | 'expense';
  category?: string;
  tripId?: string;
  vehicleId?: string;
  employeeId?: string;
  customerId?: string;
  status?: string;
}

export type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  profit: number;
};

export type TransactionBreakdown = {
  income?: Record<string, number>;
  expense?: Record<string, number>;
};

export type TransactionExportResult = {
  buffer: string;
  fileName: string;
};

const normalizeListParams = (params?: TransactionListParams): Record<string, string | number | undefined> => {
  if (!params) return {};
  const p = { ...params };
  if (p.startDate && !p.fromDate) p.fromDate = p.startDate;
  if (p.endDate && !p.toDate) p.toDate = p.endDate;
  return p;
};

export const transactionsApi = {
  list: (params?: TransactionListParams) =>
    apiClient.get<{ data: Transaction[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/transactions',
      { params: normalizeListParams(params) },
    ),
  getById: (id: string) => apiClient.get<{ data: Transaction }>(`/transactions/${id}`),
  create: (data: {
    type: 'INCOME' | 'EXPENSE';
    category: TransactionCategory;
    amount: number;
    date?: string;
    note?: string;
    tripId?: string;
    vehicleId?: string;
    employeeId?: string;
    customerId?: string;
  }) =>
    apiClient.post<{ data: Transaction }>('/transactions', {
      ...data,
      date: data.date ?? new Date().toISOString().slice(0, 10),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiClient.patch<{ data: Transaction }>(`/transactions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/transactions/${id}`),
  getSummary: (params?: { fromDate?: string; toDate?: string }) =>
    apiClient.get<TransactionSummary>('/transactions/summary', { params }),
  getBreakdown: (params?: { fromDate?: string; toDate?: string }) =>
    apiClient.get<TransactionBreakdown>('/transactions/breakdown', { params }),
  getExport: (params?: { fromDate?: string; toDate?: string }) =>
    apiClient.get<TransactionExportResult>('/transactions/export', { params }),
  getVehicleSummary: (vehicleId: string, params?: { fromDate?: string; toDate?: string }) =>
    apiClient.get<TransactionSummary>(`/transactions/vehicle/${vehicleId}/summary`, { params }),
  getEmployeeSummary: (employeeId: string, params?: { fromDate?: string; toDate?: string }) =>
    apiClient.get<TransactionSummary>(`/transactions/employee/${employeeId}/summary`, { params }),
  getStats: (params?: { fromDate?: string; toDate?: string; startDate?: string; endDate?: string }) =>
    apiClient.get<{ data: { totalIncome?: number; totalExpense?: number; netAmount?: number; byCategory?: unknown } }>(
      '/transactions/stats',
      { params },
    ),
  getBalance: () =>
    apiClient.get<{ data?: number }>('/transactions/balance'),
};
