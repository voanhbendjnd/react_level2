import { loginAPI } from "@/services/api";
import { App, Button, Checkbox, Divider, Form, Input, type FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "/src/assets/2784.jpg";
import bgImageMain from "/src/assets/hinh-nen-toi-4k_061742487.jpg"
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};


const LoginPage = () => {
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    const res = await loginAPI(values.username || "", values.password || "")
    setLoading(true)
    if (res && res.data) {
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
      style={{
        margin: "0",
        height: "100vh", /* full chiều cao màn hình */
        position: "relative",
        backgroundImage: `url(${bgImageMain})`,
        backgroundSize: "100%",
        backgroundPosition: "center",
        color: "white"
      }}
    >
      <fieldset
        style={{
          maxWidth: 600,
          position: "absolute",
          top: "30%",
          left: "35%",
          transform: "tranlate(-50%, -50%)",
          width: "30%",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}>
        <legend>Đăng nhập</legend>
        <Form
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{
            color: "white"
          }}
        >
          <h1>Đăng nhập thông tin người dùng</h1>
          <Form.Item<FieldType>
            label={<span style={{ color: "white" }}>Email</span>}
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label={<span style={{ color: "white" }}>Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
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
            <Button type="primary" htmlType="submit" loading={loading}>
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