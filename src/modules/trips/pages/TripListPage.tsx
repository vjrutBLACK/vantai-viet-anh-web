import { useMemo, useState } from 'react';
import { Button, DatePicker, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import TripTable from '../components/TripTable';
import { useTrips } from '../hooks/useTrips';
import type { TripStatusApi } from '../types';
import { customersApi, type Customer } from '@/api/customers';
import { vehiclesApi, type Vehicle } from '@/api/vehicles';
import { employeesApi, type Employee } from '@/api/employees';

const STATUS_OPTIONS: { value: TripStatusApi; label: string }[] = [
  { value: 'new', label: 'Mới' },
  { value: 'assigned', label: 'Đã phân công' },
  { value: 'in_progress', label: 'Đang chạy' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Hủy' },
];

function toList<T>(res: unknown): T[] {
  if (res && typeof res === 'object' && Array.isArray((res as { data?: T[] }).data)) {
    return (res as { data: T[] }).data;
  }
  return [];
}

export default function TripListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TripStatusApi | undefined>(undefined);
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);
  const [vehicleId, setVehicleId] = useState<string | undefined>(undefined);
  const [driverId, setDriverId] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const { data: customersRes } = useQuery({
    queryKey: ['trips-filter-customers'],
    queryFn: () => customersApi.list({ page: 1, limit: 100 }),
  });
  const { data: vehiclesRes } = useQuery({
    queryKey: ['trips-filter-vehicles'],
    queryFn: () => vehiclesApi.list({ page: 1, limit: 100 }),
  });
  const { data: driversRes } = useQuery({
    queryKey: ['trips-filter-drivers'],
    queryFn: () => employeesApi.getDrivers(),
  });

  const customerOptions = useMemo(
    () =>
      toList<Customer>(customersRes).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [customersRes],
  );
  const vehicleOptions = useMemo(
    () =>
      toList<Vehicle>(vehiclesRes).map((v) => ({
        value: v.id,
        label: v.licensePlate,
      })),
    [vehiclesRes],
  );
  const driverOptions = useMemo(
    () =>
      toList<Employee>(driversRes).map((e) => ({
        value: e.id,
        label: e.fullName,
      })),
    [driversRes],
  );

  const { data, isLoading } = useTrips({
    page,
    limit: pageSize,
    search: search || undefined,
    status,
    customerId,
    vehicleId,
    driverId,
    startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
    endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
  });

  const trips = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Danh sách đơn vận chuyển</h2>
      <Space wrap style={{ marginBottom: 16 }} align="start">
        <Input.Search
          allowClear
          placeholder="Mã chuyến, địa chỉ chuyến..."
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          style={{ width: 280 }}
        />
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 140 }}
          options={STATUS_OPTIONS}
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
        <Select
          allowClear
          placeholder="Khách hàng"
          style={{ width: 180 }}
          options={customerOptions}
          value={customerId}
          onChange={(v) => {
            setCustomerId(v);
            setPage(1);
          }}
        />
        <Select
          allowClear
          placeholder="Xe"
          style={{ width: 140 }}
          options={vehicleOptions}
          value={vehicleId}
          onChange={(v) => {
            setVehicleId(v);
            setPage(1);
          }}
        />
        <Select
          allowClear
          placeholder="Tài xế"
          style={{ width: 160 }}
          options={driverOptions}
          value={driverId}
          onChange={(v) => {
            setDriverId(v);
            setPage(1);
          }}
        />
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(r) => {
            setDateRange(r);
            setPage(1);
          }}
          placeholder={['Từ ngày', 'Đến ngày']}
        />
      </Space>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/trips/create')}
        >
          Thêm chuyến
        </Button>
      </Space>
      <TripTable
        data={trips}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />
    </div>
  );
}
