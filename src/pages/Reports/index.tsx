import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Table } from 'antd';
import { reportsApi } from '@/api/reports';

export default function ReportsPage() {
  const { data: vehicles, isLoading: loadingV } = useQuery({
    queryKey: ['reports-vehicles'],
    queryFn: () => reportsApi.getVehicles() as Promise<{ data: { licensePlate: string; totalTrips: number; totalRevenue: number }[] }>,
  });
  const { data: drivers, isLoading: loadingD } = useQuery({
    queryKey: ['reports-drivers'],
    queryFn: () => reportsApi.getDrivers() as Promise<{ data: { driverName: string; totalTrips: number; totalRevenue: number }[] }>,
  });

  const vehicleColumns = [
    { title: 'Biển số', dataIndex: 'licensePlate', key: 'licensePlate' },
    { title: 'Số chuyến', dataIndex: 'totalTrips', key: 'totalTrips', width: 100 },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: 140,
      render: (v: number) => v != null && new Intl.NumberFormat('vi-VN').format(v),
    },
  ];
  const driverColumns = [
    { title: 'Lái xe', dataIndex: 'driverName', key: 'driverName' },
    { title: 'Số chuyến', dataIndex: 'totalTrips', key: 'totalTrips', width: 100 },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: 140,
      render: (v: number) => v != null && new Intl.NumberFormat('vi-VN').format(v),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Báo cáo</h2>
      <Row gutter={[16, 16]}>
        <Col span={24} lg={12}>
          <Card title="Báo cáo theo xe" loading={loadingV}>
            <Table
              columns={vehicleColumns}
              dataSource={vehicles?.data ?? []}
              rowKey="licensePlate"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={24} lg={12}>
          <Card title="Báo cáo theo lái xe" loading={loadingD}>
            <Table
              columns={driverColumns}
              dataSource={drivers?.data ?? []}
              rowKey="driverName"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
