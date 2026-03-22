import { apiClient } from '@/api/client';
import type { Debt, Supplier } from './types';

export type DebtListParams = {
  page?: number;
  limit?: number;
  type?: 'RECEIVABLE' | 'PAYABLE';
  status?: 'UNPAID' | 'PAID' | 'OVERDUE';
  customerId?: string;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'dueDate' | 'remaining' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
};

type DebtListResponse = {
  data: Debt[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export async function fetchDebts(params: DebtListParams) {
  const res = await apiClient.get<DebtListResponse>('/debts', { params });
  return {
    data: res.data ?? [],
    total: res.pagination?.total ?? 0,
    pagination: res.pagination,
  };
}

export async function fetchDebtDetail(id: string) {
  const res = await apiClient.get<{ data: Debt }>(`/debts/${id}`);
  return res.data;
}

export type CreateDebtPayload = {
  type: 'RECEIVABLE' | 'PAYABLE';
  customerId?: string;
  supplierId?: string;
  tripId?: string;
  amount: number;
  dueDate: string;
};

export async function createDebt(payload: CreateDebtPayload) {
  const res = await apiClient.post<{ data: Debt }>('/debts', payload);
  return res.data;
}

export async function payDebt(id: string, amount: number) {
  const res = await apiClient.post<{ data: Debt }>(`/debts/${id}/pay`, { amount });
  return res.data;
}

export async function deleteDebt(id: string) {
  await apiClient.delete(`/debts/${id}`);
}

/** Suppliers - for PAYABLE debts */
export async function fetchSuppliers(params?: { page?: number; limit?: number }) {
  const res = await apiClient.get<{
    data: Supplier[];
    pagination?: { page: number; limit: number; total: number; totalPages: number };
  }>('/suppliers', { params });
  const data = Array.isArray(res?.data) ? res.data : (res as { data?: Supplier[] })?.data ?? [];
  const total = res.pagination?.total ?? data.length;
  return { data, total };
}

export async function createSupplier(payload: { name: string; code?: string; status?: string }) {
  const res = await apiClient.post<{ data: Supplier }>('/suppliers', payload);
  return res.data;
}
