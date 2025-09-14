import { registerAPI } from "@/services/api";
import { App, Button, Form, Input, Modal, type FormProps } from "antd";
interface IProps {
    isOpenFormModal: boolean;
    setIsOpenFormModal: (v: boolean) => void;
    handleRefresh: () => void;
}
type FieldType = {
    name: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
}
const UserForm = (props: IProps) => {
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const { isOpenFormModal, setIsOpenFormModal, handleRefresh } = props;
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        const res = await registerAPI(
            values.name || "",
            values.email || "",
            values.password || "",
            values.confirmPassword || "",
            values.phone || ""
        );
        console.log(res.data)
        if (res && res.data) {
            message.success("Tạo mới người dùng thành công")
            form.resetFields(); // xóa data
            setIsOpenFormModal(false);
            handleRefresh();
        }
        else {
            notification.error({
                message: "Tạo mới người dùng thất bại",
                description: JSON.stringify(res.message),
            })
        }
    };
    return (
        <Modal
            title="Tạo mới người dùng" // Changed title to match the button
            open={isOpenFormModal}
            onOk={() => form.submit()} // This will trigger the onFinish function
            okButtonProps={{
                loading: false
            }}
            onCancel={() => {
                setIsOpenFormModal(false);
            }}
            maskClosable={false}
            okText={"Tạo mới"}
            cancelText={"Hủy"} // Changed "OUT" to a more standard "CANCEL"
            forceRender // Ensures the form instance is available even when the modal is not visible
        >
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

            </Form>

        </Modal>
    )
}
export default UserForm;