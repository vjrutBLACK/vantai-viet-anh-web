import { apiClient } from './client';

export interface Transaction {
  id: string;
  transactionCode?: string;
  transactionDate: string;
  transactionType: string;
  category?: string;
  amount: number;
  description?: string;
  status: string;
}

export interface TransactionListParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
  status?: string;
}

export const transactionsApi = {
  list: (params?: TransactionListParams) =>
    apiClient.get<{ data: Transaction[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/transactions',
      { params },
    ),
  getById: (id: string) => apiClient.get<{ data: Transaction }>(`/transactions/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post<{ data: Transaction }>('/transactions', data),
  update: (id: string, data: Record<string, unknown>) => apiClient.patch<{ data: Transaction }>(`/transactions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/transactions/${id}`),
  getStats: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<{ data: { totalIncome: number; totalExpense: number; netAmount: number } }>('/transactions/stats', {
      params,
    }),
};
