import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { employeesApi, type Employee } from '@/api/employees';

export default function EmployeesPage() {
  const columns: ProColumns<Employee>[] = [
    { title: 'Mã NV', dataIndex: 'employeeCode', key: 'employeeCode', width: 100 },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', width: 180 },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Vị trí', dataIndex: 'position', key: 'position', width: 100 },
    { title: 'Bằng lái', dataIndex: 'licenseType', key: 'licenseType', width: 80 },
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
      <h2 style={{ marginBottom: 24 }}>Quản lý nhân viên</h2>
      <ProTable<Employee>
        columns={columns}
        request={async (params) => {
          const res = await employeesApi.list({
            page: params.current,
            limit: params.pageSize,
            search: params.keyword,
          }) as { data: Employee[]; pagination: { total: number } };
          return { data: res.data, total: res.pagination?.total ?? 0, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [<Button type="primary" key="add">Thêm nhân viên</Button>]}
      />
    </div>
  );
}
