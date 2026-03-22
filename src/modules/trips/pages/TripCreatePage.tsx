import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/TripForm';
import { useCreateTrip } from '../hooks/useCreateTrip';

export default function TripCreatePage() {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      await createTrip.mutateAsync(values);
      message.success('Tạo đơn vận chuyển thành công');
      navigate('/trips');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Tạo đơn vận chuyển thất bại';
      message.error(msg);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Tạo đơn vận chuyển</h2>
      <Card>
        <TripForm onSubmit={handleSubmit} submitLoading={createTrip.isPending} />
      </Card>
    </div>
  );
}

