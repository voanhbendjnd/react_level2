import { loginAPI } from "@/services/api";
import { App, Button, Checkbox, Divider, Form, Input, type FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImageMain from "/src/assets/books-hd-8k-wallpaper-stock-photographic-image_1064748-3923.jpg"
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
          <p>Bạn chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link></p>
        </Form>
        <Divider />
      </fieldset>

    </div>
  )
}

export default LoginPage;