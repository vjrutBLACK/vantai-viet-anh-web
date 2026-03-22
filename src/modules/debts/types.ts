export type DebtType = 'RECEIVABLE' | 'PAYABLE';
export type DebtStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

export type Debt = {
  id: string;
  type: DebtType;
  customerId?: string | null;
  supplierId?: string | null;
  tripId?: string | null;
  amount: number;
  paidAmount: number;
  remaining: number;
  dueDate: string;
  status: DebtStatus;
  createdAt?: string;
  updatedAt?: string;
  /** Populated by API */
  customer?: { id: string; name: string; customerCode?: string };
  supplier?: { id: string; name: string; code?: string };
  trip?: { id: string; tripCode?: string; address?: string };
};

export type Supplier = {
  id: string;
  name: string;
  code?: string;
  status?: string;
};
