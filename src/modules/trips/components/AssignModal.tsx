import { useEffect } from 'react';
import { Form, Modal, Select } from 'antd';

type AssignModalProps = {
  open: boolean;
  onOk: (vehicleId: string, driverId: string) => void;
  onCancel: () => void;
  vehicleId?: string;
  driverId?: string;
  vehicles: { label: string; value: string; disabled?: boolean }[];
  drivers: { label: string; value: string; disabled?: boolean }[];
  loading?: boolean;
};

export default function AssignModal({
  open,
  onOk,
  onCancel,
  vehicleId,
  driverId,
  vehicles,
  drivers,
  loading = false,
}: AssignModalProps) {
  const [form] = Form.useForm<{ vehicleId: string; driverId: string }>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        vehicleId: vehicleId ?? undefined,
        driverId: driverId ?? undefined,
      });
    }
  }, [open, vehicleId, driverId, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values.vehicleId, values.driverId);
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      title="Phân công xe / tài xế"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="vehicleId"
          label="Xe"
          rules={[{ required: true, message: 'Chọn xe' }]}
        >
          <Select
            placeholder="Chọn xe"
            options={vehicles}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          name="driverId"
          label="Tài xế"
          rules={[{ required: true, message: 'Chọn tài xế' }]}
        >
          <Select
            placeholder="Chọn tài xế"
            options={drivers}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

