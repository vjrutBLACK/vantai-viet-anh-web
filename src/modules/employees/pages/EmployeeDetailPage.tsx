import { useState } from 'react';
import { Button, Card, Col, DatePicker, Descriptions, Row, Select, Spin, Tabs, Tag } from 'antd';
import type { TabsProps } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/common/DataTable';
import { employeesApi, type Employee, type EmployeeTrip, type EmployeeSalary } from '@/api/employees';
import { ROUTES } from '@/config/routes';
import { formatMoneyVi } from '@/utils/number';

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: employeeRes,
    isLoading: loadingDetail,
  } = useQuery({
    queryKey: ['employee-detail', id],
    queryFn: () => employeesApi.getById(id!),
    enabled: !!id,
  });

  const employee = employeeRes?.data as (Employee & { base_salary?: number }) | undefined;
  const baseSalaryRaw = employee?.baseSalary ?? employee?.base_salary;
  const baseSalary =
    typeof baseSalaryRaw === 'number' ? baseSalaryRaw : Number(baseSalaryRaw);

  const items: TabsProps['items'] = [
    {
      key: 'trips',
      label: 'Lịch sử chuyến xe',
      children: <EmployeeTripsTab employeeId={id!} />,
    },
    {
      key: 'salaries',
      label: 'Lương',
      children: <EmployeeSalariesTab employeeId={id!} />,
    },
  ];

  if (loadingDetail || !employee) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Chi tiết nhân viên</h2>

      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Card title="Thông tin nhân viên" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Mã NV">{employee.employeeCode ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">{employee.fullName}</Descriptions.Item>
              <Descriptions.Item label="Lương cơ bản">
                {!Number.isNaN(baseSalary) && baseSalary >= 0
                  ? baseSalary.toLocaleString('vi-VN')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí">{employee.position ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{employee.phone ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Email">{employee.email ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Số GPLX">{employee.licenseNumber ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Hạng GPLX">{employee.licenseType ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={employee.status === 'active' ? 'green' : 'default'}>
                  {employee.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                </Tag>
              </Descriptions.Item>
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

function EmployeeTripsTab({ employeeId }: { employeeId: string }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['employee-trips', employeeId, page, pageSize, dateRange],
    queryFn: async () => {
      const res = await employeesApi.getTrips(employeeId, {
        page,
        limit: pageSize,
        fromDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        toDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      });
      const d = res.data ?? [];
      const total = res.pagination?.total ?? d.length;
      return { data: d, total };
    },
    enabled: !!employeeId,
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
      <DataTable<EmployeeTrip>
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

function EmployeeSalariesTab({ employeeId }: { employeeId: string }) {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ] as [Dayjs | null, Dayjs | null]);
  const [source, setSource] = useState<'dynamic' | 'transactions'>('dynamic');
  const [hasQueried, setHasQueried] = useState(false);

  const fromDate = dateRange[0]?.format('YYYY-MM-DD');
  const toDate = dateRange[1]?.format('YYYY-MM-DD');
  const canQuery = !!fromDate && !!toDate;

  const { data, isLoading } = useQuery({
    queryKey: ['employee-salaries', employeeId, fromDate, toDate, source],
    queryFn: async () => {
      const res = await employeesApi.getSalaries(employeeId, {
        fromDate: fromDate!,
        toDate: toDate!,
        source,
      });
      return res.data ?? [];
    },
    enabled: !!employeeId && canQuery && hasQueried,
  });

  const salaries = data ?? [];

  const handleQuery = () => {
    if (canQuery) setHasQueried(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(r) => {
            setDateRange(r ?? [null, null]);
            setHasQueried(false);
          }}
          placeholder={['Từ ngày', 'Đến ngày']}
        />
        <Select
          value={source}
          onChange={(v) => {
            setSource(v);
            setHasQueried(false);
          }}
          options={[
            { label: 'Từ chuyến + cấu hình lương', value: 'dynamic' },
            { label: 'Từ giao dịch', value: 'transactions' },
          ]}
          style={{ width: 220 }}
        />
        <Button type="primary" onClick={handleQuery} disabled={!canQuery}>
          Tra cứu
        </Button>
      </div>
      {!hasQueried && (
        <p style={{ color: '#8c8c8c' }}>Chọn khoảng ngày và nhấn Tra cứu để xem bảng lương</p>
      )}
      {hasQueried && (
        <DataTable<EmployeeSalary>
          rowKey={(_, i) => String(i)}
          loading={isLoading}
          dataSource={salaries}
          columns={[
            { title: 'Kỳ', dataIndex: 'period' },
            { title: 'Từ ngày', dataIndex: 'fromDate' },
            { title: 'Đến ngày', dataIndex: 'toDate' },
            {
              title: 'Lương cơ bản',
              dataIndex: 'baseAmount',
              align: 'right',
              render: (v: unknown) => formatMoneyVi(v, '-'),
            },
            {
              title: 'Thưởng',
              dataIndex: 'bonus',
              align: 'right',
              render: (v: unknown) => formatMoneyVi(v, '-'),
            },
            {
              title: 'Khấu trừ',
              dataIndex: 'deduction',
              align: 'right',
              render: (v: unknown) => formatMoneyVi(v, '-'),
            },
            {
              title: 'Tổng',
              dataIndex: 'total',
              align: 'right',
              render: (v: unknown) => {
                const s = formatMoneyVi(v, '-');
                return s === '-' ? '-' : <strong>{s}</strong>;
              },
            },
          ]}
          locale={{ emptyText: 'Không có dữ liệu lương' }}
          pagination={false}
        />
      )}
    </div>
  );
}
