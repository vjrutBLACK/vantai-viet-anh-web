import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { customersApi, type Customer } from '@/api/customers';

export default function CustomersPage() {
  const columns: ProColumns<Customer>[] = [
    { title: 'Mã KH', dataIndex: 'customerCode', key: 'customerCode', width: 100 },
    { title: 'Tên khách hàng', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, r) => <Tag color={r.status === 'active' ? 'green' : 'default'}>{r.status === 'active' ? 'Hoạt động' : 'Dừng'}</Tag>,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Quản lý khách hàng</h2>
      <ProTable<Customer>
        columns={columns}
        request={async (params) => {
          const res = await customersApi.list({
            page: params.current,
            limit: params.pageSize,
            search: params.keyword,
          }) as { data: Customer[]; pagination: { total: number } };
          return { data: res.data, total: res.pagination?.total ?? 0, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [<Button type="primary" key="add">Thêm khách hàng</Button>]}
      />
    </div>
  );
}
