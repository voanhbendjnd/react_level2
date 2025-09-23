import { registerAPI } from "@/services/api";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
type FieldType = {
    name?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    email?: string;
};

const RegisterPage = () => {
    const { message, notification } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    // Đặt kiểu dữ liệu cho values nếu cần
    const onFinish = async (values: FieldType) => {
        console.log('>>> Success:', values);
        setLoading(true);
        const res = await registerAPI(
            values.name || "",
            values.email || "",
            values.password || "",
            values.confirmPassword || "",
            values.phone || ""
        );

        if (res.data) {
            message.success("Đăng ký người dùng thành công");
            navigate('/login')
        } else {
            // Thay vì Modal, dùng notification hoặc message để hiển thị lỗi
            notification.error({
                message: "Đã gặp phải lỗi khi đăng ký người dùng",
                description: res.message || "Lỗi không xác định." // Kiểm tra res.message trước khi hiển thị
            });
        }
        setLoading(false)
    };
    return (
        <div className="login-page">
            <fieldset
                className="login-card card fade-in"
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px"
                }}>
                <legend>Đăng ký</legend>

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                    style={{ padding: "30px", borderRadius: "10px" }}
                >
                    <Form.Item<FieldType>
                        label="Họ và tên"
                        name="name"
                        rules={[
                            { required: true, message: 'Tên không được bỏ trống' },
                        ]}
                    >
                        <Input />

                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được bỏ trống' },
                            { type: "email", message: "Email không đúng định dạng" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được bỏ trống' }]}

                    >
                        <Input.Password />

                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Mật khẩu không được bỏ trống' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit">Đăng ký</Button>
                    </Form.Item>
                </Form>
                <Divider />
                <p style={{ textAlign: "center" }}>Bạn đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link></p>
            </fieldset>

        </div>
    )
}

export default RegisterPage;