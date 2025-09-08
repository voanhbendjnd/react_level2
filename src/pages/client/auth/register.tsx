import { Button, Divider, Form, Input, type FormProps } from "antd";
import { Link } from "react-router-dom";
type FieldType = {
    name?: string;
    password?: string;
    confirmPassword?: string;
    phone?: String;
    email?: String;
};
const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('>>> Success:', values);
};
const RegisterPage = () => {
    const [form] = Form.useForm();
    return (
        <div
            style={{
                position: "relative",
                height: "10vw"
            }}>
            <fieldset
                style={{
                    // padding: "15px",
                    // margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    // width: "40vw",
                    position: "absolute",
                    top: "50%",
                    left: "35%",
                    transform: "tranlate(-50%,-50%)",
                    width: "30%"


                }}>
                <legend>Đăng ký</legend>

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                    style={{
                        padding: "30px",
                        borderRadius: "10px"
                    }}
                >
                    <h1>Đăng ký thông tin người dùng</h1>
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

                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" loading={true} onClick={() => { form.submit() }}>Đăng ký</Button>
                    </Form.Item>
                </Form>
                <Divider />
                <p
                    style={{
                        textAlign: "center"
                    }}
                >Bạn đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link></p>
            </fieldset>

        </div>
    )
}

export default RegisterPage;