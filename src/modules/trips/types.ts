/** Trạng thái từ API (chữ thường) */
export type TripStatusApi =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

/** Gửi lên PATCH /trips/:id/status (DTO Nest — UPPERCASE) */
export type TripStatusPatch =
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type TripPerson = {
  id: string;
  fullName?: string;
  name?: string;
};

export type Trip = {
  id: string;
  companyId?: string;
  tripCode?: string | null;
  tripDate: string;
  vehicleId?: string;
  driverId?: string;
  coDriverId?: string | null;
  customerId: string;
  contactEmployeeId?: string | null;
  commissionRateApplied?: number | null;
  paidAmount?: number | string;
  cargoType?: string;
  cargoWeight?: number;
  cargoQuantity?: number;
  address?: string | null;
  revenue?: number | string;
  fuelCost?: number | string;
  tollCost?: number | string;
  driverSalary?: number | string;
  otherCosts?: number | string;
  profit?: number | string;
  status: TripStatusApi;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  customer?: {
    id: string;
    name: string;
    phone?: string;
  };
  vehicle?: {
    id: string;
    licensePlate: string;
    vehicleType?: string;
    status?: string;
  };
  driver?: TripPerson;
  coDriver?: TripPerson;
};

export type TripsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
};

export type TripsListResponse = {
  success: boolean;
  data: Trip[];
  pagination?: TripsPagination;
};
