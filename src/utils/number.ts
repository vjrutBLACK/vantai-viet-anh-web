/**
 * Chuẩn hóa giá trị số từ API (thường là string) hoặc form sang number.
 * Dùng cho lương, giá cước, v.v. để tránh lỗi rule `type: 'number'` của Ant Design Form.
 */
export function normalizeNumeric(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Hiển thị số tiền trong bảng (API TypeORM thường trả decimal dạng string). */
export function formatMoneyVi(value: unknown, empty = '—'): string {
  if (value === null || value === undefined || value === '') {
    return empty;
  }
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) {
    return empty;
  }
  return n.toLocaleString('vi-VN');
}
