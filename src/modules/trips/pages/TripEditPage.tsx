import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import TripForm from '../components/TripForm';
import { useTripDetail } from '../hooks/useTripDetail';
import { useUpdateTrip } from '../hooks/useUpdateTrip';
import { tripToFormValues } from '../utils/buildCreateTripBody';

export default function TripEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useTripDetail(id);
  const updateTrip = useUpdateTrip();

  const trip = data?.data;

  const tripDefaults = useMemo(() => (trip ? tripToFormValues(trip) : null), [trip]);

  const handleSubmit = async (body: Record<string, unknown>) => {
    if (!id) return;
    try {
      await updateTrip.mutateAsync({ id, data: body });
      message.success('Cập nhật chuyến thành công');
      await queryClient.invalidateQueries({ queryKey: ['trip', id] });
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      navigate(`/trips/${id}`);
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Cập nhật thất bại');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !trip || !id) {
    return (
      <div>
        <Alert type="error" message="Không tải được chuyến" showIcon />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/trips')}>
          Về danh sách
        </Button>
      </div>
    );
  }

  if (trip.status === 'completed') {
    return (
      <div>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/trips/${id}`)}>
            Quay lại chi tiết
          </Button>
          <Alert
            type="warning"
            showIcon
            message="Không thể sửa chuyến đã hoàn thành"
            description="API từ chối PATCH khi status = completed."
          />
        </Space>
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/trips/${id}`)}>
          Chi tiết chuyến
        </Button>
      </Space>
      <h2 style={{ marginBottom: 24 }}>Sửa chuyến {trip.tripCode ? `· ${trip.tripCode}` : ''}</h2>
      <Card>
        <TripForm
          mode="edit"
          tripDefaults={tripDefaults}
          sourceTrip={trip}
          onSubmit={handleSubmit}
          submitLoading={updateTrip.isPending}
        />
      </Card>
    </div>
  );
}
