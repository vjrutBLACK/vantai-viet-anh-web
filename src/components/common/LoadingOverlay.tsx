import { Spin } from 'antd';

type LoadingOverlayProps = {
  spinning: boolean;
};

export function LoadingOverlay({ spinning }: LoadingOverlayProps) {
  if (!spinning) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.6)',
        zIndex: 1000,
      }}
    >
      <Spin size="large" />
    </div>
  );
}

