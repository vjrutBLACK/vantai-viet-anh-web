export type VehicleStatus = 'active' | 'inactive' | 'maintenance';

export type Vehicle = {
  id: string;
  licensePlate: string;
  vehicleType: string;
  brand?: string;
  model?: string;
  year?: number;
  capacity?: number;
  status: VehicleStatus;
  /** Chỉ khi status = maintenance; BE đồng bộ Thu–Chi */
  maintenanceCost?: number | string | null;
};

