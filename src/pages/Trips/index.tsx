import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { tripsApi, type Trip } from '@/api/trips';
import dayjs from 'dayjs';

export default function TripsPage() {
  const columns: ProColumns<Trip>[] = [
    { title: 'Mã chuyến', dataIndex: 'tripCode', key: 'tripCode', width: 100 },
    {
      title: 'Ngày',
      dataIndex: 'tripDate',
      key: 'tripDate',
      width: 110,
      render: (_, r) => r.tripDate && dayjs(r.tripDate).format('DD/MM/YYYY'),
    },
    {
      title: 'Xe',
      dataIndex: ['vehicle', 'licensePlate'],
      key: 'vehicle',
      width: 100,
    },
    {
      title: 'Lái xe',
      dataIndex: ['driver', 'fullName'],
      key: 'driver',
      width: 120,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['customer', 'name'],
      key: 'customer',
      width: 150,
    },
    { title: 'Địa chỉ chuyến', dataIndex: 'address', key: 'address', width: 180, ellipsis: true },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      render: (_, r) => r.revenue != null && new Intl.NumberFormat('vi-VN').format(Number(r.revenue)),
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      width: 120,
      render: (_, r) => r.profit != null && new Intl.NumberFormat('vi-VN').format(Number(r.profit)),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Chuyến xe</h2>
      <ProTable<Trip>
        columns={columns}
        request={async (params) => {
          const res = await tripsApi.list({
            page: params.current,
            limit: params.pageSize,
            search: params.keyword,
          }) as { data: Trip[]; pagination: { total: number } };
          return { data: res.data, total: res.pagination?.total ?? 0, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [
          <Button key="import" icon={<UploadOutlined />}>
            Import Excel
          </Button>,
          <Button key="export" icon={<DownloadOutlined />}>
            Export
          </Button>,
          <Button type="primary" key="add">
            Thêm chuyến
          </Button>,
        ]}
      />
    </div>
  );
}
