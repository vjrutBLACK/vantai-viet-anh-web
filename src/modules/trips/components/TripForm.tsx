import { useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Typography,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import { customersApi, type Customer } from '@/api/customers';
import { vehiclesApi, type Vehicle } from '@/api/vehicles';
import { employeesApi, type Employee } from '@/api/employees';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  buildCreateTripBody,
  type TripFormSubmitValues,
} from '../utils/buildCreateTripBody';
import type { Trip } from '../types';

type TripFormProps = {
  mode?: 'create' | 'edit';
  /** Hydrate form khi sửa (sau khi GET detail) */
  tripDefaults?: TripFormSubmitValues | null;
  /** Trip gốc: đảm bảo Select hiển thị khách/xe/tài xế dù không có trong trang đầu list API */
  sourceTrip?: Trip | null;
  onSubmit: (values: Record<string, unknown>) => void;
  submitLoading?: boolean;
};

/** Phản hồi list từ apiClient (body có `data: T[]`) — tránh lỗi infer useQuery. */
function rows<T>(res: unknown): T[] {
  if (res && typeof res === 'object' && Array.isArray((res as { data?: T[] }).data)) {
    return (res as { data: T[] }).data;
  }
  return [];
}

export default function TripForm({
  mode = 'create',
  tripDefaults = null,
  sourceTrip = null,
  onSubmit,
  submitLoading = false,
}: TripFormProps) {
  const [form] = Form.useForm();
  const [customerSearch, setCustomerSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [driverSearch, setDriverSearch] = useState('');
  const [coDriverSearch, setCoDriverSearch] = useState('');
  const [commissionContactSearch, setCommissionContactSearch] = useState('');

  const debouncedCustomerSearch = useDebouncedValue(customerSearch, 300);
  const debouncedVehicleSearch = useDebouncedValue(vehicleSearch, 300);
  const debouncedDriverSearch = useDebouncedValue(driverSearch, 300);
  const debouncedCoDriverSearch = useDebouncedValue(coDriverSearch, 300);
  const debouncedCommissionContactSearch = useDebouncedValue(commissionContactSearch, 300);

  const { data: customersRes, isFetching: customersLoading } = useQuery({
    queryKey: ['trip-form-customers', debouncedCustomerSearch],
    queryFn: () =>
      customersApi.list({ page: 1, limit: 20, search: debouncedCustomerSearch }),
  });

  const { data: vehiclesRes, isFetching: vehiclesLoading } = useQuery({
    queryKey: ['trip-form-vehicles', debouncedVehicleSearch],
    queryFn: () =>
      vehiclesApi.list({ page: 1, limit: 20, search: debouncedVehicleSearch }),
  });

  const { data: driversRes, isFetching: driversLoading } = useQuery({
    queryKey: ['trip-form-drivers', debouncedDriverSearch],
    queryFn: () => employeesApi.getDrivers(debouncedDriverSearch),
  });

  const { data: coDriversRes, isFetching: coDriversLoading } = useQuery({
    queryKey: ['trip-form-codrivers', debouncedCoDriverSearch],
    queryFn: () => employeesApi.list({ page: 1, limit: 20, search: debouncedCoDriverSearch }),
  });

  const { data: commissionContactsRes, isFetching: commissionContactsLoading } = useQuery({
    queryKey: ['trip-form-commission-contacts', debouncedCommissionContactSearch],
    queryFn: () =>
      employeesApi.list({
        page: 1,
        limit: 20,
        search: debouncedCommissionContactSearch,
      }),
  });

  const customersList = useMemo(() => rows<Customer>(customersRes), [customersRes]);
  const vehiclesList = useMemo(() => rows<Vehicle>(vehiclesRes), [vehiclesRes]);
  const driversList = useMemo(() => rows<Employee>(driversRes), [driversRes]);
  const coDriversList = useMemo(() => rows<Employee>(coDriversRes), [coDriversRes]);
  const commissionContactsList = useMemo(
    () => rows<Employee>(commissionContactsRes),
    [commissionContactsRes],
  );

  const customerOptions = useMemo(() => {
    const base = customersList.map((c) => ({
      value: c.id,
      label: c.phone ? `${c.name} (${c.phone})` : c.name,
    }));
    const tid = sourceTrip?.customerId;
    if (mode === 'edit' && tid && sourceTrip?.customer && !base.some((o) => o.value === tid)) {
      const c = sourceTrip.customer;
      return [{ value: tid, label: c.phone ? `${c.name} (${c.phone})` : c.name }, ...base];
    }
    return base;
  }, [customersList, mode, sourceTrip]);

  const vehicleOptions = useMemo(() => {
    const base = vehiclesList.map((v) => ({
      value: v.id,
      label: `${v.licensePlate}${v.vehicleType ? ` – ${v.vehicleType}` : ''}${
        v.status && v.status !== 'active' ? ` (${v.status})` : ''
      }`,
      disabled: v.status != null && v.status !== 'active',
    }));
    const vid = sourceTrip?.vehicleId;
    if (mode === 'edit' && vid && sourceTrip?.vehicle && !base.some((o) => o.value === vid)) {
      const v = sourceTrip.vehicle;
      return [
        {
          value: vid,
          label: `${v.licensePlate}${v.vehicleType ? ` – ${v.vehicleType}` : ''}${
            v.status && v.status !== 'active' ? ` (${v.status})` : ''
          }`,
          disabled: v.status != null && v.status !== 'active',
        },
        ...base,
      ];
    }
    return base;
  }, [vehiclesList, mode, sourceTrip]);

  const driverOptions = useMemo(() => {
    const base = driversList.map((e) => ({
      value: e.id,
      label: e.fullName,
    }));
    const did = sourceTrip?.driverId;
    if (mode === 'edit' && did && sourceTrip?.driver && !base.some((o) => o.value === did)) {
      const e = sourceTrip.driver;
      const label = e.fullName ?? e.name ?? did;
      return [{ value: did, label }, ...base];
    }
    return base;
  }, [driversList, mode, sourceTrip]);

  const coDriverOptions = useMemo(() => {
    const base = coDriversList.map((e) => ({
      value: e.id,
      label: e.phone ? `${e.fullName} (${e.phone})` : e.fullName,
    }));
    const cid = sourceTrip?.coDriverId;
    if (mode === 'edit' && cid && sourceTrip?.coDriver && !base.some((o) => o.value === cid)) {
      const e = sourceTrip.coDriver;
      const label = e.fullName ?? e.name ?? cid;
      return [{ value: cid, label }, ...base];
    }
    return base;
  }, [coDriversList, mode, sourceTrip]);

  const commissionContactOptions = useMemo(
    () =>
      commissionContactsList.map((e) => ({
        value: e.id,
        label: e.phone ? `${e.fullName} (${e.phone})` : e.fullName,
      })),
    [commissionContactsList],
  );

  const selectedVehicleId = Form.useWatch('vehicleId', form);
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return undefined;
    return vehiclesList.find((v) => v.id === selectedVehicleId);
  }, [selectedVehicleId, vehiclesList]);

  const selectedCustomerId = Form.useWatch('customerId', form);
  const selectedContactEmployeeId = Form.useWatch('contactEmployeeId', form);
  const selectedCommissionRateApplied = Form.useWatch('commissionRateApplied', form);
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return undefined;
    return customersList.find((c) => c.id === selectedCustomerId);
  }, [selectedCustomerId, customersList]);

  const customerCommissionMin = selectedCustomer?.commissionRateMin ?? 0;
  const customerCommissionMax = selectedCustomer?.commissionRateMax ?? 0;

  useEffect(() => {
    if (mode !== 'edit' || !tripDefaults) return;
    form.setFieldsValue({
      customerId: tripDefaults.customerId,
      vehicleId: tripDefaults.vehicleId,
      coDriverId: tripDefaults.coDriverId || undefined,
      driverId: tripDefaults.driverId,
      tripDate: tripDefaults.tripDate,
      address: tripDefaults.address,
      cargo: tripDefaults.cargo,
      cargoWeight: tripDefaults.cargoWeight,
      cargoQuantity: tripDefaults.cargoQuantity,
      price: tripDefaults.price,
      paidAmount: tripDefaults.paidAmount ?? 0,
      fuelCost: tripDefaults.fuelCost ?? 0,
      tollCost: tripDefaults.tollCost ?? 0,
      repairCost: tripDefaults.repairCost ?? 0,
      fineCost: tripDefaults.fineCost ?? 0,
      notes: tripDefaults.notes,
      contactEmployeeId: tripDefaults.contactEmployeeId,
      commissionRateApplied: tripDefaults.commissionRateApplied,
    });
  }, [mode, tripDefaults, form]);

  // Fallback tự động theo Customer (chỉ khi tạo mới — tránh ghi đè dữ liệu đã hydrate khi sửa)
  useEffect(() => {
    if (mode === 'edit') return;
    if (!selectedCustomerId) return;

    const nextContact = selectedCustomer?.contactEmployeeId ?? null;
    if ((selectedContactEmployeeId == null || selectedContactEmployeeId === '') && nextContact) {
      form.setFieldValue('contactEmployeeId', nextContact);
    }

    if (selectedCommissionRateApplied == null || selectedCommissionRateApplied === '') {
      if (customerCommissionMin > 0 || customerCommissionMax > 0) {
        form.setFieldValue('commissionRateApplied', customerCommissionMin);
      }
    }
  }, [
    selectedCustomerId,
    selectedCustomer?.contactEmployeeId,
    customerCommissionMin,
    customerCommissionMax,
    selectedContactEmployeeId,
    selectedCommissionRateApplied,
    form,
    mode,
  ]);

  const handleFinish = (values: TripFormSubmitValues) => {
    onSubmit(buildCreateTripBody(values));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ paidAmount: 0, fuelCost: 0, tollCost: 0, repairCost: 0, fineCost: 0 }}
    >
      <Typography.Title level={5}>Thông tin chung</Typography.Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn khách hàng"
              showSearch
              options={customerOptions}
              filterOption={false}
              onSearch={setCustomerSearch}
              loading={customersLoading}
              notFoundContent={customersLoading ? 'Đang tải...' : 'Không có dữ liệu'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="tripDate" label="Ngày chuyến" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="address" label="Địa chỉ chuyến">
            <Input placeholder="Địa chỉ / tuyến chuyến" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="cargo" label="Loại hàng">
            <Input placeholder="VD: Xi măng" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="cargoWeight" label="Trọng lượng (kg)">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="cargoQuantity" label="Số lượng">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Xe & tài xế
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginTop: -8 }}>
        Có thể để trống khi tạo — chuyến ở trạng thái <b>Mới</b>; gán sau qua màn chi tiết hoặc PATCH
        assign.
      </Typography.Paragraph>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="vehicleId" label="Xe">
            <Select
              placeholder="Chọn xe"
              showSearch
              options={vehicleOptions}
              filterOption={false}
              onSearch={setVehicleSearch}
              loading={vehiclesLoading}
              notFoundContent={vehiclesLoading ? 'Đang tải...' : 'Không có dữ liệu'}
            />
          </Form.Item>
          {selectedVehicle?.capacity != null ? (
            <div style={{ marginTop: -12, marginBottom: 8, color: '#666' }}>
              Tải trọng: {Number(selectedVehicle.capacity).toLocaleString('vi-VN')} kg
            </div>
          ) : null}
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="driverId" label="Tài xế">
            <Select
              placeholder="Chọn tài xế"
              showSearch
              options={driverOptions}
              filterOption={false}
              onSearch={setDriverSearch}
              loading={driversLoading}
              notFoundContent={driversLoading ? 'Đang tải...' : 'Không có dữ liệu'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="coDriverId" label="Phụ xe">
            <Select
              placeholder="Chọn phụ xe (tùy chọn)"
              showSearch
              options={coDriverOptions}
              filterOption={false}
              onSearch={setCoDriverSearch}
              loading={coDriversLoading}
              allowClear
              notFoundContent={coDriversLoading ? 'Đang tải...' : 'Không có dữ liệu'}
            />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Giá & thanh toán
      </Typography.Title>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="price"
            label="Giá / Doanh thu"
            rules={[
              {
                validator: (_, value) => {
                  if (value === null || value === undefined || value === '') {
                    return Promise.reject(new Error('Nhập giá cước'));
                  }
                  const num = Number(value);
                  if (!Number.isFinite(num)) {
                    return Promise.reject(new Error('Giá cước phải là số hợp lệ'));
                  }
                  if (num < 0) {
                    return Promise.reject(new Error('Giá cước phải >= 0'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="paidAmount"
            label="Đã thanh toán"
            dependencies={['price']}
            rules={[
              {
                validator: (_, value) => {
                  const priceRaw = form.getFieldValue('price');
                  const price = Number(priceRaw ?? 0);
                  const paid = Number(value ?? 0);
                  if (value == null || value === '' || paid <= price) return Promise.resolve();
                  return Promise.reject(new Error('Đã thanh toán không được lớn hơn giá cước'));
                },
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item shouldUpdate>
            {() => {
              const price = Number(form.getFieldValue('price') ?? 0);
              const paid = Number(form.getFieldValue('paidAmount') ?? 0);
              const remainingValue = price - paid;
              return (
                <div>
                  <div style={{ fontWeight: 500 }}>Còn nợ (tự tính)</div>
                  <div style={{ color: remainingValue > 0 ? 'red' : 'green' }}>
                    {Number.isFinite(remainingValue)
                      ? remainingValue.toLocaleString('vi-VN')
                      : '0'}
                  </div>
                </div>
              );
            }}
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Hoa hồng
      </Typography.Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="contactEmployeeId" label="Người liên hệ hưởng hoa hồng">
            <Select
              placeholder="Chọn nhân viên"
              showSearch
              options={commissionContactOptions}
              filterOption={false}
              onSearch={setCommissionContactSearch}
              loading={commissionContactsLoading}
              allowClear
            />
          </Form.Item>
          <div style={{ marginTop: -12, marginBottom: 8, color: '#666' }}>
            Khoảng hoa hồng cho khách:{' '}
            <b>
              {customerCommissionMin}% – {customerCommissionMax}%
            </b>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="commissionRateApplied"
            label="% chốt cho đơn"
            dependencies={['customerId']}
            rules={[
              {
                validator: (_, value) => {
                  if (value == null || value === '') return Promise.resolve();
                  const v = Number(value);
                  if (Number.isNaN(v)) return Promise.reject(new Error('Vui lòng nhập số'));
                  const min = customerCommissionMin;
                  const max = customerCommissionMax;
                  if (min === 0 && max === 0) {
                    if (v < 0 || v > 100) return Promise.reject(new Error('Giá trị phải trong 0..100'));
                    return Promise.resolve();
                  }
                  if (v < min || v > max) {
                    return Promise.reject(new Error(`% phải nằm trong khoảng ${min}..${max}`));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={customerCommissionMin}
              max={customerCommissionMax || 100}
              style={{ width: '100%' }}
              addonAfter="%"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => {
              const rate = Number(form.getFieldValue('commissionRateApplied') ?? 0);
              const price = Number(form.getFieldValue('price') ?? 0);
              const commissionAmount = (price * rate) / 100;
              return (
                <div style={{ color: '#666' }}>
                  Ước tính hoa hồng: <b>{commissionAmount.toLocaleString('vi-VN')}</b>
                </div>
              );
            }}
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Chi phí
      </Typography.Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="fuelCost" label="Dầu">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="tollCost" label="Phí cầu đường">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="repairCost" label="Sửa xe">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="fineCost" label="Phạt / luật">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú nội bộ" />
          </Form.Item>
        </Col>
      </Row>

      <Button type="primary" htmlType="submit" loading={submitLoading} style={{ marginTop: 24 }}>
        {mode === 'edit' ? 'Cập nhật chuyến' : 'Tạo đơn'}
      </Button>
    </Form>
  );
}

