import dayjs, { type Dayjs } from 'dayjs';
import type { Trip } from '../types';

/**
 * Giá trị form tạo chuyến — align CreateTripDto (whitelist, forbidNonWhitelisted).
 * - Bắt buộc: tripDate, customerId
 * - BE: otherCosts = otherCosts + repairCost + fineCost
 * - Không gửi: driverSalary (BE set từ baseSalary NV), companyId, profit
 */
export type TripFormSubmitValues = {
  customerId: string;
  vehicleId?: string;
  driverId?: string;
  coDriverId?: string | null;
  /** Ant Design DatePicker */
  tripDate: Dayjs;
  address?: string;
  cargo?: string;
  cargoWeight?: number;
  cargoQuantity?: number;
  price?: number;
  paidAmount?: number;
  fuelCost?: number;
  tollCost?: number;
  repairCost?: number;
  fineCost?: number;
  notes?: string;
  contactEmployeeId?: string | null;
  commissionRateApplied?: number | string | null;
};

/**
 * Body POST /trips — chỉ các key được DTO chấp nhận (tránh 400 forbidNonWhitelisted).
 */
export function buildCreateTripBody(values: TripFormSubmitValues): Record<string, unknown> {
  const tripDate = values.tripDate.format('YYYY-MM-DD');

  const notesTrim = values.notes?.trim();
  const repair = Number(values.repairCost ?? 0);
  const fine = Number(values.fineCost ?? 0);

  const body: Record<string, unknown> = {
    tripDate,
    customerId: values.customerId,
    paidAmount: Number(values.paidAmount ?? 0),
    fuelCost: Number(values.fuelCost ?? 0),
    tollCost: Number(values.tollCost ?? 0),
    repairCost: repair,
    fineCost: fine,
  };

  if (values.vehicleId) body.vehicleId = values.vehicleId;
  if (values.driverId) body.driverId = values.driverId;
  if (values.coDriverId) body.coDriverId = values.coDriverId;

  const cargoTrim = values.cargo?.trim();
  if (cargoTrim) body.cargoType = cargoTrim;
  const cw = values.cargoWeight;
  if (cw != null && String(cw).trim() !== '' && Number.isFinite(Number(cw))) {
    body.cargoWeight = Number(cw);
  }
  const cq = values.cargoQuantity;
  if (cq != null && String(cq).trim() !== '' && Number.isFinite(Number(cq))) {
    body.cargoQuantity = Math.floor(Number(cq));
  }

  const addressTrim = values.address?.trim();
  if (addressTrim) body.address = addressTrim;

  if (values.price != null && String(values.price).trim() !== '') {
    body.price = Number(values.price);
  }

  if (notesTrim) {
    body.notes = notesTrim;
  }

  if (values.contactEmployeeId != null && values.contactEmployeeId !== '') {
    body.contactEmployeeId = values.contactEmployeeId;
  } else {
    body.contactEmployeeId = null;
  }

  const rate = values.commissionRateApplied;
  if (rate != null && rate !== '') {
    body.commissionRateApplied = Number(rate);
  } else {
    body.commissionRateApplied = null;
  }

  return body;
}

/**
 * Map trip từ API → giá trị form (sửa chuyến).
 * `otherCosts` BE không tách sửa xe/phạt — đưa hết vào `repairCost`, `fineCost` = 0 khi hydrate.
 */
function n(v: unknown, fallback = 0): number {
  if (v == null || v === '') return fallback;
  const x = Number(v);
  return Number.isFinite(x) ? x : fallback;
}

export function tripToFormValues(trip: Trip): TripFormSubmitValues {
  return {
    customerId: trip.customerId,
    vehicleId: trip.vehicleId,
    driverId: trip.driverId,
    coDriverId: trip.coDriverId ?? null,
    tripDate: dayjs(trip.tripDate),
    address: trip.address?.trim() ? trip.address : undefined,
    cargo: trip.cargoType ?? undefined,
    cargoWeight: trip.cargoWeight != null ? n(trip.cargoWeight) : undefined,
    cargoQuantity: trip.cargoQuantity != null ? n(trip.cargoQuantity) : undefined,
    /** API đôi khi trả decimal dạng string — InputNumber + rule type:number cần number thuần */
    price: n(trip.revenue),
    paidAmount: n(trip.paidAmount),
    fuelCost: n(trip.fuelCost),
    tollCost: n(trip.tollCost),
    repairCost: n(trip.otherCosts),
    fineCost: 0,
    notes: trip.notes?.trim() ? trip.notes : undefined,
    contactEmployeeId: trip.contactEmployeeId ?? null,
    commissionRateApplied:
      trip.commissionRateApplied == null || String(trip.commissionRateApplied).trim() === ''
        ? null
        : (() => {
            const x = Number(trip.commissionRateApplied);
            return Number.isFinite(x) ? x : null;
          })(),
  };
}
