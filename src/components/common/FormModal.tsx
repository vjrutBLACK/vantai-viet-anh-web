import type { ReactNode } from 'react';
import { Modal } from 'antd';

type FormModalProps = {
  title: string;
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  confirmLoading?: boolean;
  children: ReactNode;
  width?: number;
};

export function FormModal({
  title,
  open,
  onCancel,
  onOk,
  confirmLoading,
  children,
  width = 640,
}: FormModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      destroyOnClose
      width={width}
    >
      {children}
    </Modal>
  );
}

