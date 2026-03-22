import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { vehiclesApi, type Vehicle } from '@/api/vehicles';

export default function VehiclesPage() {
  const columns: ProColumns<Vehicle>[] = [
    { title: 'Biển số', dataIndex: 'licensePlate', key: 'licensePlate', width: 120 },
    { title: 'Loại xe', dataIndex: 'vehicleType', key: 'vehicleType', width: 100 },
    { title: 'Hãng', dataIndex: 'brand', key: 'brand', width: 120 },
    { title: 'Model', dataIndex: 'model', key: 'model', width: 120 },
    { title: 'Năm', dataIndex: 'year', key: 'year', width: 80 },
    { title: 'Tải trọng (tấn)', dataIndex: 'capacity', key: 'capacity', width: 120 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, r) => (
        <Tag color={r.status === 'active' ? 'green' : r.status === 'maintenance' ? 'orange' : 'default'}>
          {r.status === 'active' ? 'Hoạt động' : r.status === 'maintenance' ? 'Bảo trì' : 'Dừng'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Quản lý xe</h2>
      <ProTable<Vehicle>
        columns={columns}
        request={async (params) => {
          const res = await vehiclesApi.list({
            page: params.current,
            limit: params.pageSize,
            search: params.keyword,
          }) as { data: Vehicle[]; pagination: { total: number } };
          return { data: res.data, total: res.pagination?.total ?? 0, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [
          <Button type="primary" key="add">
            Thêm xe
          </Button>,
        ]}
      />
    </div>
  );
}
