import { Tag } from 'antd';
import type { TripStatusApi, TripStatusPatch } from '../types';

const statusColor: Record<TripStatusPatch, string> = {
  NEW: 'default',
  ASSIGNED: 'blue',
  IN_PROGRESS: 'orange',
  COMPLETED: 'green',
  CANCELLED: 'red',
};

const statusLabel: Record<TripStatusPatch, string> = {
  NEW: 'Mới',
  ASSIGNED: 'Đã phân công',
  IN_PROGRESS: 'Đang chạy',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Hủy',
};

function normalizeStatus(status: string): TripStatusPatch {
  const u = status.toUpperCase().replace(/ /g, '_');
  if (u in statusLabel) return u as TripStatusPatch;
  return 'NEW';
}

/** Nhận status từ API (thường chữ thường: new, in_progress, …) */
export function StatusBadge({ status }: { status: TripStatusApi | string }) {
  const key = normalizeStatus(String(status));
  return <Tag color={statusColor[key]}>{statusLabel[key]}</Tag>;
}
