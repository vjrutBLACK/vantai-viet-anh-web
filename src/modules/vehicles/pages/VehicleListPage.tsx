import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Form, Input, InputNumber, Select, Space, Tag } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/common/DataTable';
import type { Vehicle } from '../types';
import { createVehicle, fetchVehicles, updateVehicle } from '../services';
import { FormModal } from '@/components/common/FormModal';
import { ImportExcelModal } from '@/components/common/ImportExcelModal';
import { ROUTES } from '@/config/routes';
import { formatMoneyVi, normalizeNumeric } from '@/utils/number';

const STATUS_OPTIONS = [
  { label: 'Tất cả', value: '' },
  { label: 'Hoạt động', value: 'active' },
  { label: 'Bảo trì', value: 'maintenance' },
];

export function VehicleListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form] = Form.useForm<Vehicle>();
  const watchedStatus = Form.useWatch('status', form);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', { search, status, page, pageSize }],
    queryFn: () => fetchVehicles({ search, status, page, limit: pageSize }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      setEditingVehicle(null);
      form.resetFields();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Vehicle> }) =>
      updateVehicle(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      setEditingVehicle(null);
      form.resetFields();
    },
  });

  const handleOpenCreate = () => {
    setEditingVehicle(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: Vehicle) => {
    setEditingVehicle(record);
    form.setFieldsValue({
      ...record,
      maintenanceCost:
        record.maintenanceCost != null && record.maintenanceCost !== ''
          ? normalizeNumeric(record.maintenanceCost, 0)
          : undefined,
    });
    setIsModalOpen(true);
  };

  const buildVehiclePayload = (values: Vehicle): Partial<Vehicle> => {
    const base: Partial<Vehicle> = {
      licensePlate: values.licensePlate,
      vehicleType: values.vehicleType,
      brand: values.brand,
      model: values.model,
      year: values.year,
      capacity: values.capacity,
      status: values.status,
    };
    if (values.status === 'maintenance') {
      base.maintenanceCost = normalizeNumeric(values.maintenanceCost, 0);
    }
    return base;
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = buildVehiclePayload(values);
    if (editingVehicle) {
      await updateMutation.mutateAsync({
        id: editingVehicle.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload as Parameters<typeof createVehicle>[0]);
    }
  };

  return (
    <>
      <h2 style={{ marginBottom: 24 }}>Quản lý xe</h2>

      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Space>
          <Input.Search
            allowClear
            placeholder="Tìm kiếm theo biển số, loại xe..."
            onSearch={setSearch}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            options={STATUS_OPTIONS}
            style={{ width: 160 }}
            onChange={(value) => setStatus(value || undefined)}
          />
        </Space>
        <Space>
          <Button icon={<UploadOutlined />} onClick={() => setIsImportOpen(true)}>
            Import Excel
          </Button>
          <Button href="/templates/import-vehicles-template.xlsx" target="_blank">
            Tải template
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm xe
          </Button>
        </Space>
      </Flex>

      <DataTable<Vehicle>
        rowKey="id"
        loading={isLoading}
        dataSource={data?.data ?? []}
        onRow={(record) => ({
          onClick: () => navigate(`${ROUTES.VEHICLES}/${record.id}`),
          style: { cursor: 'pointer' },
        })}
        columns={[
          { title: 'Biển số', dataIndex: 'licensePlate' },
          { title: 'Loại xe', dataIndex: 'vehicleType' },
          { title: 'Hãng', dataIndex: 'brand' },
          { title: 'Model', dataIndex: 'model' },
          { title: 'Năm', dataIndex: 'year' },
          { title: 'Tải trọng (kg)', dataIndex: 'capacity' },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value: Vehicle['status']) => (
              <Tag color={value === 'active' ? 'green' : value === 'maintenance' ? 'orange' : 'default'}>
                {value === 'active'
                  ? 'Hoạt động'
                  : value === 'maintenance'
                  ? 'Bảo trì'
                  : 'Ngừng hoạt động'}
              </Tag>
            ),
          },
          {
            title: 'CP bảo trì',
            key: 'maintenanceCost',
            width: 120,
            align: 'right',
            render: (_: unknown, r: Vehicle) =>
              r.status === 'maintenance' ? formatMoneyVi(r.maintenanceCost, '—') : '—',
          },
          {
            title: 'Hành động',
            dataIndex: 'actions',
            render: (_, record) => (
              <Space onClick={(e) => e.stopPropagation()}>
                <Button type="link" onClick={() => navigate(`${ROUTES.VEHICLES}/${record.id}`)}>
                  Xem chi tiết
                </Button>
                <Button type="link" onClick={() => handleOpenEdit(record)}>
                  Sửa
                </Button>
              </Space>
            ),
          },
        ]}
        pagination={{
          current: page,
          pageSize,
          total: data?.total ?? 0,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      <FormModal
        title={editingVehicle ? 'Cập nhật xe' : 'Thêm xe'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingVehicle(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Biển số"
            name="licensePlate"
            rules={[{ required: true, message: 'Nhập biển số xe' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại xe"
            name="vehicleType"
            rules={[{ required: true, message: 'Nhập loại xe' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Hãng" name="brand">
            <Input />
          </Form.Item>
          <Form.Item label="Model" name="model">
            <Input />
          </Form.Item>
          <Form.Item label="Năm sản xuất" name="year">
            <InputNumber min={1900} max={2100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Tải trọng (kg)" name="capacity">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" initialValue="active">
            <Select
              options={[
                { label: 'Hoạt động', value: 'active' },
                { label: 'Bảo trì', value: 'maintenance' },
                { label: 'Ngừng hoạt động', value: 'inactive' },
              ]}
            />
          </Form.Item>
          {watchedStatus === 'maintenance' ? (
            <Form.Item
              label="Chi phí bảo trì (VND)"
              name="maintenanceCost"
              extra="Tùy chọn (≥ 0). Khi lưu, hệ thống ghi nhận vào Thu–Chi để công ty theo dõi."
              rules={[
                {
                  validator: (_, value) => {
                    if (value === null || value === undefined || value === '') {
                      return Promise.resolve();
                    }
                    const n = normalizeNumeric(value, NaN);
                    if (!Number.isFinite(n) || n < 0) {
                      return Promise.reject(new Error('Nhập số ≥ 0'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          ) : null}
        </Form>
      </FormModal>

      <ImportExcelModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        type="vehicles"
        title="Import xe từ Excel"
        templateHref="/templates/import-vehicles-template.xlsx"
        onImported={() => queryClient.invalidateQueries({ queryKey: ['vehicles'] })}
      />
    </>
  );
}

