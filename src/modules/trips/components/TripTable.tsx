import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import type { Trip } from '../types';
import { formatMoneyVi } from '@/utils/number';

function driverLabel(t: Trip) {
  const d = t.driver;
  if (!d) return '—';
  return d.fullName ?? d.name ?? '—';
}

type TripTableProps = {
  data: Trip[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
};

export default function TripTable({ data, loading, pagination }: TripTableProps) {
  const navigate = useNavigate();

  const columns: ColumnsType<Trip> = [
    { title: 'Ngày', dataIndex: 'tripDate' },
    {
      title: 'Mã',
      dataIndex: 'tripCode',
      render: (code: string | null | undefined) => code ?? '—',
    },
    {
      title: 'Khách',
      dataIndex: ['customer', 'name'],
      render: (_, record) => record.customer?.name ?? '—',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      ellipsis: true,
      render: (v: string | null | undefined) => v?.trim() ?? '—',
    },
    {
      title: 'Xe',
      dataIndex: ['vehicle', 'licensePlate'],
      render: (_, record) => record.vehicle?.licensePlate ?? '—',
    },
    { title: 'Tài xế', key: 'driver', render: (_, record) => driverLabel(record) },
    {
      title: 'Giá cước / Doanh thu',
      dataIndex: 'revenue',
      align: 'right',
      render: (value: unknown) => formatMoneyVi(value, '—'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, record) => <StatusBadge status={record.status} />,
    },
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onRow={(record) => ({
        onClick: () => navigate(`/trips/${record.id}`),
        style: { cursor: 'pointer' },
      })}
    />
  );
}

