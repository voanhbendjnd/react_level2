import { loginAPI, getGoogleLoginUrlAPI } from "@/services/api";
import { App, Button, Checkbox, Divider, Form, Input, type FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImageMain from "/src/assets/hinh-nen-toi-4k_061742487.jpg"
import { useCurrentApp } from "@/components/context/app.context";
// match between backend and frontend
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};


const LoginPage = () => {
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    const res = await loginAPI(values.username || "", values.password || "")
    setLoading(true)
    if (res && res.data) {
      setIsAuthenticated(true)
      setUser(res.data.user)
      localStorage.setItem('access_token', res.data.access_token)
      message.success("Đăng nhập thành công")
      navigate("/")
    }
    else {
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Thông tin đăng nhập không chính xác"
      })
    }
    setLoading(false)
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // Gọi API backend để lấy Google OAuth URL
      const res = await getGoogleLoginUrlAPI();

      if (res && res.data && res.data.url) {
        // Redirect to Google OAuth URL từ backend
        console.log('Redirecting to Google OAuth URL:', res.data.url);
        window.location.href = res.data.url;
      } else {
        throw new Error('Không thể lấy URL đăng nhập Google từ server');
      }

    } catch (error) {
      console.error('Google login error:', error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Có lỗi xảy ra khi đăng nhập bằng Google";

      if (error.response) {
        // Lỗi từ server
        const status = error.response.status;
        if (status === 404) {
          errorMessage = "Chức năng đăng nhập Google chưa được cấu hình trên server";
        } else if (status === 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        } else if (status >= 400 && status < 500) {
          errorMessage = "Yêu cầu không hợp lệ";
        }
      } else if (error.request) {
        // Lỗi network
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng";
      } else {
        // Lỗi khác
        errorMessage = error.message || "Có lỗi không xác định";
      }

      notification.error({
        message: "Lỗi đăng nhập Google",
        description: errorMessage,
        duration: 5
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="login-page"
      style={{
        margin: "0",
        minHeight: "100vh",
        backgroundImage: `url(${bgImageMain})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white"
      }}
    >
      <fieldset
        className="login-card card fade-in"
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px"
        }}>
        <legend>Đăng nhập</legend>
        <Form
          className="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{
            color: "white"
          }}
        >
          {/* <h1>Đăng nhập thông tin người dùng</h1> */}
          <Form.Item<FieldType>
            label={<span style={{ color: "white" }}>Email</span>}
            name="username"
            rules={[
              { required: true, message: 'Email không được để trống!' },
              { type: "email", message: "Email không đúng định dạng" },

            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label={<span style={{ color: "white" }}>Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: 'Password không được để trống!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
            <Checkbox
              style={{
                color: "white"
              }}
            >Nhớ mật khẩu</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="btn-primary-modern login-submit-btn">
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider style={{ color: "white", borderColor: "#ccc" }}>Hoặc</Divider>

          <Form.Item>
            <Button
              type="default"
              htmlType="button"
              loading={loading}
              onClick={handleGoogleLogin}
              className="google-login-btn"
              disabled={loading}
              style={{
                width: "100%",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: loading ? "#f5f5f5" : "#fff",
                borderColor: "#dadce0",
                color: loading ? "#999" : "#3c4043",
                fontSize: "14px",
                fontWeight: "500",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? "Đang kết nối..." : "Đăng nhập với Google"}
            </Button>
          </Form.Item>

          <p>Bạn chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link></p>
        </Form>
      </fieldset>

    </div>
  )
}

export default LoginPage;