import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic } from 'antd';
import { CarOutlined, UserOutlined, SwapOutlined, DollarOutlined } from '@ant-design/icons';
import { reportsApi } from '@/api/reports';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportsApi.getDashboard() as Promise<{ data: { summary: Record<string, number> } }>,
  });

  const summary = data?.data?.summary ?? {};

  const items = [
    { title: 'Tổng chuyến', value: summary.totalTrips ?? 0, icon: <SwapOutlined /> },
    { title: 'Doanh thu', value: new Intl.NumberFormat('vi-VN').format(summary.totalRevenue ?? 0), icon: <DollarOutlined /> },
    { title: 'Lợi nhuận', value: new Intl.NumberFormat('vi-VN').format(summary.totalProfit ?? 0), icon: <DollarOutlined /> },
    { title: 'Xe hoạt động', value: summary.activeVehicles ?? 0, icon: <CarOutlined /> },
    { title: 'Lái xe', value: summary.activeDrivers ?? 0, icon: <UserOutlined /> },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Tổng quan</h2>
      <Row gutter={[16, 16]}>
        {items.map((item, i) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={i}>
            <Card loading={isLoading}>
              <Statistic title={item.title} value={item.value} prefix={item.icon} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
