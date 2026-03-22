# Tích hợp Frontend — Vận Tải Anh Việt

## Transactions (Thu – Chi & Giao dịch)

Base: `/api/v1` · Header `Authorization: Bearer <token>`

### Nguyên tắc

- Mọi dòng tiền là **transaction** (cột `transactionType`: `income` | `expense`; API trả **`INCOME`** | **`EXPENSE`**).
- **Category** chuẩn: `TRIP_PAYMENT`, `FUEL`, `REPAIR`, `SALARY` (DB lưu chữ HOA).
- Ghép type ↔ category:
  - `TRIP_PAYMENT` → chỉ **`INCOME`**
  - `FUEL`, `REPAIR`, `SALARY` → chỉ **`EXPENSE`**

### API Paths

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/transactions` | Danh sách: `page`, `limit`, `fromDate`, `toDate` (hoặc `startDate`/`endDate`), `type`, `category`, `tripId`, `vehicleId`, `employeeId`, `customerId`, `status` |
| GET | `/transactions/:id` | Chi tiết (kèm quan hệ trip/vehicle/employee/customer) |
| POST | `/transactions` | Tạo: `type`, `category`, `amount`, `date`, `note`, `tripId`, `vehicleId`, `employeeId`, `customerId` |
| PATCH | `/transactions/:id` | Cập nhật (cùng quy tắc type/category) |
| DELETE | `/transactions/:id` | Hủy (set `status = cancelled`) |
| GET | `/transactions/summary` | Tổng hợp: `fromDate`, `toDate` → `{ totalIncome, totalExpense, profit }` |
| GET | `/transactions/breakdown` | Chi tiết theo danh mục: `fromDate`, `toDate` → `{ income: {...}, expense: {...} }` |
| GET | `/transactions/export` | Export: `fromDate`, `toDate` → `{ buffer, fileName }` |
| GET | `/transactions/vehicle/:vehicleId/summary` | Tổng theo xe: `fromDate`, `toDate` |
| GET | `/transactions/employee/:employeeId/summary` | Tổng theo nhân viên: `fromDate`, `toDate` |
| GET | `/transactions/stats` | Tương thích cũ: `byCategory`, `netAmount`, … |
| GET | `/transactions/balance` | Số dư lũy kế (completed) |

### POST body — Field alias

| Chuẩn mới | Alias cũ |
|-----------|----------|
| `type` | `transactionType` |
| `date` | `transactionDate` |
| `note` | `description` |

- `amount` > 0 (bắt buộc)
- `category` bắt buộc (một trong bốn mã trên)

### Tích hợp nghiệp vụ

- **Thu từ khách / chuyến:** `INCOME` + `TRIP_PAYMENT` + `tripId` + `customerId`
- **Nhiên liệu:** `EXPENSE` + `FUEL` + `vehicleId`
- **Sửa chữa:** `EXPENSE` + `REPAIR` + `vehicleId`
- **Lương:** `EXPENSE` + `SALARY` + `employeeId`

---

## Employees (Nhân viên)

Backend: `CreateEmployeeDto` / `UpdateEmployeeDto` (camelCase, `whitelist: true`).

### POST `/employees` — body tạo

| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| `fullName` | Có (hoặc `name`) | BE gộp `fullName ?? name` |
| `baseSalary` | Có | `number`, ≥ 0 (VND) |
| `employeeCode` | Không | |
| `phone` | Không | |
| `email` | Không | `@IsEmail` — **không gửi chuỗi rỗng** (FE dùng `normalizeEmployeeWritePayload`) |
| `position` | Không | vd. `lái xe`, `phụ xe` |
| `licenseNumber` | Không | |
| `licenseType` | Không | |
| `status` | Không | mặc định `active` |

### PATCH `/employees/:id`

Cùng các trường trên (partial). FE gửi object đã chuẩn hóa qua `normalizeEmployeeWritePayload` trong `src/api/employees.ts`.
