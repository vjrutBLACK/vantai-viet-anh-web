import { apiClient } from '@/api/client';
import type { Customer, Trip, Payment } from './types';

export type CustomerListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
};

export async function fetchCustomers(params: CustomerListParams) {
  const res = await apiClient.get<{
    success: boolean;
    data: Customer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/customers', { params });
  return {
    data: res.data,
    total: res.pagination.total,
  };
}

export async function fetchCustomerDetail(id: string) {
  const res = await apiClient.get<{
    success: boolean;
    data: {
      customer: Customer;
      debt: {
        totalAmount: number;
        paidAmount: number;
        remainingAmount: number;
      };
      recentTrips: Trip[];
      recentPayments: Payment[];
    };
  }>(`/customers/${id}`);
  return res.data;
}

export async function fetchCustomerTrips(id: string, params: { page?: number; limit?: number }) {
  const res = await apiClient.get<{
    success: boolean;
    data: Trip[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`/customers/${id}/trips`, { params });
  return {
    data: res.data,
    total: res.pagination.total,
  };
}

export async function fetchCustomerPayments(
  id: string,
  params: { page?: number; limit?: number },
) {
  const res = await apiClient.get<{
    success: boolean;
    data: Payment[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`/customers/${id}/payments`, { params });
  return {
    data: res.data,
    total: res.pagination.total,
  };
}

export async function createCustomer(payload: {
  customerCode?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  contactEmployeeId?: string | null;
  commissionRateMin?: number;
  commissionRateMax?: number;
  status?: 'active' | 'inactive';
}) {
  const res = await apiClient.post<{ success: boolean; data: Customer }>(
    '/customers',
    payload,
  );
  return res.data;
}

export async function updateCustomer(
  id: string,
  payload: {
    customerCode?: string;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    taxCode?: string;
    contactEmployeeId?: string | null;
    commissionRateMin?: number;
    commissionRateMax?: number;
    status?: 'active' | 'inactive';
  },
) {
  const res = await apiClient.patch<{ success: boolean; data: Customer }>(
    `/customers/${id}`,
    payload,
  );
  return res.data;
}

