import { useState } from 'react';
import { Card, Col, Descriptions, DatePicker, Row, Spin, Tabs, Tag } from 'antd';
import type { TabsProps } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/common/DataTable';
import { fetchVehicleDetail, fetchVehicleTrips, fetchVehicleRepairs } from '../services';
import { ROUTES } from '@/config/routes';
import { formatMoneyVi } from '@/utils/number';
import type { VehicleRepair } from '../services';

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: vehicle,
    isLoading: loadingDetail,
  } = useQuery({
    queryKey: ['vehicle-detail', id],
    queryFn: () => fetchVehicleDetail(id!),
    enabled: !!id,
  });

  const items: TabsProps['items'] = [
    {
      key: 'trips',
      label: 'Lịch sử chuyến xe',
      children: <VehicleTripsTab vehicleId={id!} />,
    },
    {
      key: 'repairs',
      label: 'Lịch sử sửa chữa',
      children: <VehicleRepairsTab vehicleId={id!} />,
    },
  ];

  if (loadingDetail || !vehicle) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Chi tiết xe</h2>

      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Card title="Thông tin xe" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Biển số">{vehicle.licensePlate}</Descriptions.Item>
              <Descriptions.Item label="Loại xe">{vehicle.vehicleType ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Hãng">{vehicle.brand ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Model">{vehicle.model ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Năm sản xuất">{vehicle.year ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Tải trọng (kg)">{vehicle.capacity ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    vehicle.status === 'active'
                      ? 'green'
                      : vehicle.status === 'maintenance'
                      ? 'orange'
                      : 'default'
                  }
                >
                  {vehicle.status === 'active'
                    ? 'Hoạt động'
                    : vehicle.status === 'maintenance'
                    ? 'Bảo trì'
                    : 'Ngừng hoạt động'}
                </Tag>
              </Descriptions.Item>
              {vehicle.status === 'maintenance' ? (
                <Descriptions.Item label="Chi phí bảo trì (VND)">
                  {formatMoneyVi(vehicle.maintenanceCost, '—')}
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Lịch sử vận hành">
        <Tabs items={items} />
      </Card>
    </div>
  );
}

function VehicleTripsTab({ vehicleId }: { vehicleId: string }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-trips', vehicleId, page, pageSize, dateRange],
    queryFn: () =>
      fetchVehicleTrips(vehicleId, {
        page,
        limit: pageSize,
        fromDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        toDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      }),
    enabled: !!vehicleId,
  });

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(r) => {
            setDateRange(r);
            setPage(1);
          }}
          placeholder={['Từ ngày', 'Đến ngày']}
        />
      </div>
      <DataTable
        rowKey="id"
        loading={isLoading}
        dataSource={data?.data ?? []}
        onRow={(record) => ({
          onClick: () => navigate(`${ROUTES.TRIPS}/${record.id}`),
          style: { cursor: 'pointer' },
        })}
        columns={[
          { title: 'Ngày', dataIndex: 'tripDate', width: 120 },
          { title: 'Mã chuyến', dataIndex: 'tripCode' },
          {
            title: 'Ghi chú',
            dataIndex: 'notes',
            ellipsis: true,
            render: (v: string | null | undefined) => v?.trim() || '—',
          },
          {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            align: 'right',
            render: (v: unknown) => formatMoneyVi(v, '-'),
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v: string) => <Tag>{v ?? '-'}</Tag>,
          },
        ]}
        locale={{ emptyText: 'Chưa có chuyến' }}
        pagination={{
          current: page,
          pageSize,
          total: data?.total ?? 0,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps ?? 10);
          },
        }}
      />
    </div>
  );
}

function VehicleRepairsTab({ vehicleId }: { vehicleId: string }) {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-repairs', vehicleId, dateRange],
    queryFn: () =>
      fetchVehicleRepairs(vehicleId, {
        fromDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        toDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      }),
    enabled: !!vehicleId,
  });

  const repairs = data?.data ?? [];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder={['Từ ngày', 'Đến ngày']}
        />
      </div>
      <DataTable<VehicleRepair>
        rowKey="id"
        loading={isLoading}
        dataSource={repairs}
        columns={[
          {
            title: 'Ngày',
            dataIndex: 'date',
            width: 120,
            render: (v: string | undefined) => v ?? '—',
          },
          {
            title: 'Số tiền',
            dataIndex: 'amount',
            align: 'right',
            render: (v: unknown) => formatMoneyVi(v, '—'),
          },
          {
            title: 'Nội dung',
            dataIndex: 'note',
            ellipsis: true,
            render: (v: string | null | undefined) => v?.trim() || '—',
          },
          { title: 'Loại', dataIndex: 'category', render: (c: string) => c ?? '—' },
        ]}
        locale={{ emptyText: 'Chưa có ghi nhận sửa chữa' }}
        pagination={false}
      />
    </div>
  );
}
