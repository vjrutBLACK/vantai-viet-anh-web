import { useState } from 'react';
import { Card, Col, Descriptions, Row, Spin, Statistic, Tabs, Tag } from 'antd';
import type { TabsProps } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/common/DataTable';
import { fetchCustomerDetail } from '../services';
import { useCustomerTrips } from '../hooks/useCustomerTrips';
import { useCustomerPayments } from '../hooks/useCustomerPayments';
import type { Trip, Payment } from '../types';
import { formatMoneyVi } from '@/utils/number';

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: detail,
    isLoading: loadingDetail,
  } = useQuery({
    queryKey: ['customer-detail', id],
    queryFn: () => fetchCustomerDetail(id!),
    enabled: !!id,
  });

  const items: TabsProps['items'] = [
    {
      key: 'trips',
      label: 'Chuyến xe',
      children: <TripsTab customerId={id!} />,
    },
    {
      key: 'payments',
      label: 'Thanh toán',
      children: <PaymentsTab customerId={id!} />,
    },
  ];

  if (loadingDetail || !detail) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  const { customer, debt, recentTrips, recentPayments } = detail;

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Chi tiết khách hàng</h2>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Thông tin khách hàng" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Tên">{customer.name}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {customer.phone ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {customer.address ?? '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tổng quan công nợ" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Tổng tiền"
                  value={debt.totalAmount}
                  valueStyle={{ fontSize: 18 }}
                  precision={0}
                  formatter={(value) =>
                    Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 0 })
                  }
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đã thanh toán"
                  value={debt.paidAmount}
                  valueStyle={{ fontSize: 18 }}
                  precision={0}
                  formatter={(value) =>
                    Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 0 })
                  }
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Công nợ"
                  value={debt.remainingAmount}
                  valueStyle={{
                    fontSize: 18,
                    color: debt.remainingAmount > 0 ? 'red' : 'green',
                  }}
                  precision={0}
                  formatter={(value) =>
                    Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 0 })
                  }
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="Lịch sử">
        <Tabs items={items} />
      </Card>
    </div>
  );
}

function TripsTab({ customerId }: { customerId: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useCustomerTrips(customerId, { page, limit: pageSize });

  return (
    <DataTable<Trip>
      rowKey="id"
      loading={isLoading}
      dataSource={data?.data ?? []}
      columns={[
        { title: 'Ngày', dataIndex: 'tripDate' },
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
          render: (v: unknown) => formatMoneyVi(v, '—'),
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          render: (value: string) => <Tag>{value}</Tag>,
        },
      ]}
      locale={{ emptyText: 'Chưa có chuyến' }}
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
  );
}

function PaymentsTab({ customerId }: { customerId: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useCustomerPayments(customerId, { page, limit: pageSize });

  return (
    <DataTable<Payment>
      rowKey="id"
      loading={isLoading}
      dataSource={data?.data ?? []}
      columns={[
        { title: 'Ngày', dataIndex: 'transactionDate' },
        {
          title: 'Số tiền',
          dataIndex: 'amount',
          render: (value: number) => value.toLocaleString('vi-VN'),
        },
        { title: 'Nội dung', dataIndex: 'description' },
        { title: 'Phương thức', dataIndex: 'paymentMethod' },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          render: (value: string | undefined) => <Tag>{value ?? '-'}</Tag>,
        },
      ]}
      locale={{ emptyText: 'Chưa có thanh toán' }}
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
  );
}

