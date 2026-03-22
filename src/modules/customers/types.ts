export type Customer = {
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
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  totalAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
};

export type Trip = {
  id: string;
  tripDate: string;
  tripCode?: string | null;
  /** API: `notes` */
  notes?: string | null;
  revenue?: number | string;
  status: string;
};

export type Payment = {
  id: string;
  amount: number;
  transactionDate: string;
  description?: string;
  paymentMethod?: string;
  status?: string;
};

