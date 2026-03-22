import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { ROUTES } from '@/utils/routes';

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleFinish = async (values: LoginFormValues) => {
    try {
      await login({ username: values.email, password: values.password });
      navigate(ROUTES.ROOT, { replace: true });
    } catch (error) {
      // Error đã được ném từ authService / AuthContext
      const msg =
        error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      message.error(msg);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        title="Đăng nhập - Vận Tải Anh Việt"
        style={{ width: 400 }}
        headStyle={{ textAlign: 'center', fontSize: 18 }}
      >
        <Form<LoginFormValues> name="login" onFinish={handleFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}


