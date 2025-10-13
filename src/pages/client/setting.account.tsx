import { useEffect, useState, useRef } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Radio,
    Row,
    Modal,
    Divider,
    Space,
    Typography,
    notification
} from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import { useCurrentApp } from "@/components/context/app.context";
import type { UploadFile } from "antd/lib";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { v4 as uuidv4 } from 'uuid';
import { changePasswordAPI, changePasswordByOtpAPI, forgotPasswordAPI, updateCurrentUser, uploadAvatar, verifyOtpAPI } from "@/services/api";

const { Title, Text } = Typography;

interface UserInfo {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    address?: string;
    avatar?: UploadFile[];
}


export const SettingAccountPage = () => {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [forgotPasswordForm] = Form.useForm();
    const [changePasswordForm] = Form.useForm();
    const [otpForm] = Form.useForm();
    const { user, refreshUserData } = useCurrentApp();
    const [isOpenChangePassword, setIsOpenChangePassword] = useState<boolean>(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarURL = `http://localhost:8080/api/v1/images/user/${user?.avatar}`
    const [currentEmail, setCurrentEmail] = useState<string>('');
    // User data state - sync với context user
    const [userInfo, setUserInfo] = useState<UserInfo>({
        id: user?.id || "",
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        address: user?.address || "",
        avatar: [],
    });

    // Sync userInfo với context user khi user data thay đổi
    useEffect(() => {
        if (user) {
            setUserInfo({
                id: user.id || "",
                fullName: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "",
                address: user.address || "",
                avatar: [],
            });
        }
    }, [user]);

    // Cập nhật form values khi user data thay đổi
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                id: user.id,
                fullName: user.name,
                phone: user.phone,
                gender: user.gender,
                address: user.address,
            });
        }
    }, [user, form]);
    // const initialValues = {
    //     email: user?.email
    // }


    const handleChangePassword = async (values: any) => {
        setLoading(true);
        const res = await changePasswordAPI(values.oldPassword, values.newPassword, values.confirmPassword);
        if (res && res.data) {
            message.success("Đổi mật khẩu thành công!");
            setIsPasswordModalOpen(false);
            passwordForm.resetFields();
        } else {
            notification.error({
                message: "Đổi mật khẩu thất bại!",
                description: JSON.stringify(res.message),
            });
        }
        passwordForm.resetFields();
        setLoading(false);
    };
    const handleChangePasswordByOtp = async (values: any) => {
        const res = await changePasswordByOtpAPI(currentEmail, values.newPassword, values.confirmPassword);
        if (res && res.data) {
            message.success("Đổi mật khẩu thành công!");
            setIsOpenChangePassword(false);
            changePasswordForm.resetFields();
        }
        else {
            notification.error({
                message: "Đổi mật khẩu thất bại!",
                description: JSON.stringify(res.message),
            })
        }
        passwordForm.resetFields();
        forgotPasswordForm.resetFields();
        // setCurrentEmail('');
        setLoading(false);
    };

    const handleForgotPassword = async (values: any) => {
        setLoading(true);
        const res = await forgotPasswordAPI(values.email);
        setCurrentEmail(values.email);
        if (res && res.data) {
            message.success("Mã OTP đã được gửi đến email của bạn!");
            setIsForgotPasswordModalOpen(false);
            setIsOtpModalOpen(true);
        } else {
            notification.error({
                message: "Gửi mã OTP thất bại!",
                description: JSON.stringify(res.message),
            });
        }
        // forgotPasswordForm.resetFields();
        setLoading(false);
    };

    const handleVerifyOtp = async (values: any) => {
        setLoading(true);
        const res = await verifyOtpAPI(currentEmail, values.otp);
        if (res && res.data) {
            message.success("Xác thực OTP thành công! Vui lòng đặt mật khẩu mới.");
            setIsOtpModalOpen(false);
            setIsOpenChangePassword(true);
        } else {
            notification.error({
                message: "Xác thực OTP thất bại, vui lòng thử lại!",
                description: JSON.stringify(res.message),
            });
        }
        passwordForm.resetFields();
        forgotPasswordForm.resetFields();
        otpForm.resetFields();
        setLoading(false);
    };
    const handleUpdateProfile = async (values: any) => {
        setLoading(true);
        try {
            // Update user information
            const res = await updateCurrentUser(values.id, user?.email || "", values.fullName, values.phone, values.gender, values.address);
            if (!res || !res.data) {
                throw new Error("Cập nhật thông tin người dùng thất bại, vui lòng thử lại");
            }

            // Refresh user data từ backend để cập nhật context
            await refreshUserData();

            // Update local state để sync với form
            setUserInfo(prev => ({
                ...prev,
                fullName: values.fullName,
                phone: values.phone,
                gender: values.gender,
                address: values.address,
            }));

            message.success("Cập nhật thông tin thành công!");
        } catch (error: any) {
            message.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin!");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAvatar = async () => {
        setAvatarLoading(true);
        try {
            const avatarFile = form.getFieldValue('avatar')?.[0]?.originFileObj;
            if (!avatarFile) {
                message.warning("Vui lòng chọn ảnh để cập nhật!");
                return;
            }

            const avatarRes = await uploadAvatar(userInfo.id, avatarFile);
            if (!avatarRes || !avatarRes.data) {
                throw new Error("Cập nhật avatar thất bại");
            }

            // Refresh user data từ backend để cập nhật context với avatar mới
            await refreshUserData();

            message.success("Cập nhật avatar thành công!");
            setSelectedImage(''); // Reset preview
        } catch (error: any) {
            message.error(error.message || "Có lỗi xảy ra khi cập nhật avatar!");
        } finally {
            setAvatarLoading(false);
        }
    };
    useEffect(() => {
        if (user?.avatar) {
            const avatarUserFile: UploadFile[] = [{
                uid: uuidv4(),
                name: user.avatar as string,
                status: 'done',
                url: `http://localhost:8080/api/v1/images/user/${user.avatar}`
            }];
            form.setFieldsValue({
                avatar: avatarUserFile
            });
        }
    }, [user, form]);

    return (
        <div style={{
            minHeight: "100vh",
            background: "rgb(213, 224, 235)",
            padding: "20px 0"
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
                {/* Header */}
                <div style={{
                    background: "#d32f2f",
                    color: "white",
                    padding: "20px",
                    borderRadius: "8px 8px 0 0",
                    marginBottom: 0
                }}>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                        Hồ Sơ Của Tôi
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </Text>
                </div>

                {/* Main Content */}
                <Card style={{ borderRadius: "0 0 8px 8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                    <Row gutter={[24, 24]}>
                        {/* Profile Form */}
                        <Col xs={24} lg={16}>
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={{
                                    id: user?.id,
                                    fullName: user?.name,
                                    phone: user?.phone,
                                    gender: user?.gender,
                                    address: user?.address,
                                }}
                                onFinish={handleUpdateProfile}
                            >
                                <Title level={4}>Thông tin cá nhân</Title>
                                <Form.Item label="ID" name="id" hidden={true}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Email">
                                    <Input
                                        value={userInfo.email}
                                        disabled
                                        prefix={<MailOutlined />}
                                        style={{ background: "#f5f5f5" }}
                                    // addonAfter={
                                    //     <Button type="link" size="small">
                                    //         Thay Đổi
                                    //     </Button>
                                    // }
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Tên"
                                    name="fullName"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tên!" },
                                        { min: 2, message: "Tên phải có ít nhất 2 ký tự!" }
                                    ]}
                                >
                                    <Input prefix={<UserOutlined />} />
                                </Form.Item>



                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                                        { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" }
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <Space>
                                            <QuestionCircleOutlined />
                                            Giới tính
                                        </Space>
                                    }
                                    name="gender"
                                    rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                                >
                                    <Radio.Group>
                                        <Radio value="MALE">Nam</Radio>
                                        <Radio value="FEMALE">Nữ</Radio>
                                        <Radio value="OTHER">Khác</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập địa chỉ!" },
                                        { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự!" }
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Nhập địa chỉ đầy đủ của bạn"
                                        style={{ resize: 'vertical' }}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        size="large"
                                        style={{
                                            background: "#d32f2f",
                                            borderColor: "#d32f2f",
                                            width: "100%"
                                        }}
                                    >
                                        Lưu
                                    </Button>
                                </Form.Item>

                                <Divider />

                                <Form.Item>
                                    <Button
                                        type="default"
                                        icon={<LockOutlined />}
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        size="large"
                                        style={{ width: "100%" }}
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>

                        {/* Avatar Section */}
                        <Col xs={24} lg={8}>
                            <div style={{ textAlign: "center" }}>
                                <Title level={4}>Ảnh đại diện</Title>

                                <div style={{ marginBottom: 16 }}>
                                    <Avatar
                                        size={150}
                                        src={selectedImage || (user?.avatar ? avatarURL : undefined)}
                                        icon={<UserOutlined />}
                                        style={{ border: "4px solid #f0f0f0" }}
                                    />
                                </div>


                                {/* Hidden file input for manual file selection */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Validate file
                                            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                            const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;

                                            if (!isJpgOrPng) {
                                                message.error('Chỉ được chọn ảnh là file JPG hoặc PNG!');
                                                return;
                                            }
                                            if (!isLt2M) {
                                                message.error(`Ảnh phải có dung lượng bé hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
                                                return;
                                            }

                                            // Create preview URL and set to state
                                            const previewURL = URL.createObjectURL(file);
                                            setSelectedImage(previewURL);

                                            // Create UploadFile object and set to form
                                            const uploadFile: UploadFile = {
                                                uid: uuidv4(),
                                                name: file.name,
                                                status: 'done',
                                                originFileObj: file as any,
                                                url: previewURL
                                            };

                                            form.setFieldsValue({
                                                avatar: [uploadFile]
                                            });
                                        }
                                    }}
                                />

                                <div style={{ marginBottom: 16, display: "flex", gap: "8px" }}>
                                    <Button
                                        type="default"
                                        onClick={() => {
                                            fileInputRef.current?.click();
                                        }}
                                        style={{ flex: 1 }}
                                    >
                                        Chọn ảnh mới
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleUpdateAvatar}
                                        loading={avatarLoading}
                                        style={{
                                            background: "#d32f2f",
                                            borderColor: "#d32f2f",
                                            flex: 1
                                        }}
                                    >
                                        Cập nhật
                                    </Button>
                                </div>

                                <div style={{ color: "#666", fontSize: "12px" }}>
                                    <div>Dụng lượng file tối đa 1 MB</div>
                                    <div>Định dạng: .JPEG, .PNG</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Change Password Modal */}
            <Modal
                title="Đổi mật khẩu"
                open={isPasswordModalOpen}
                onCancel={() => setIsPasswordModalOpen(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button onClick={() => setIsPasswordModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{ background: "#d32f2f", borderColor: "#d32f2f" }}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                <Divider />

                <div style={{ textAlign: "center" }}>
                    <Button
                        type="link"
                        onClick={() => {
                            setIsPasswordModalOpen(false);
                            setIsForgotPasswordModalOpen(true);
                        }}
                    >
                        Quên mật khẩu?
                    </Button>
                </div>
            </Modal>
            {/* Forgot Password Modal */}
            <Modal
                title="Quên mật khẩu"
                open={isForgotPasswordModalOpen}
                onCancel={() => setIsForgotPasswordModalOpen(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={forgotPasswordForm}
                    layout="vertical"
                    onFinish={(values) => handleForgotPassword(values)}
                // initialValues={initialValues}
                >
                    <Form.Item
                        label="Email"
                        name="email"

                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button onClick={() => setIsForgotPasswordModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{ background: "#d32f2f", borderColor: "#d32f2f" }}
                                onClick={() => {
                                    setIsForgotPasswordModalOpen(false)
                                    setIsOtpModalOpen(true)
                                }}
                            >
                                Gửi mã OTP
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Change Password By OTP Modal */}
            <Modal
                title="Đổi mật khẩu"
                open={isOpenChangePassword}
                onCancel={() => setIsOpenChangePassword(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={changePasswordForm}
                    layout="vertical"
                    onFinish={handleChangePasswordByOtp}
                >
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button onClick={() => setIsOpenChangePassword(false)}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{ background: "#d32f2f", borderColor: "#d32f2f" }}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* OTP Verification Modal */}
            <Modal
                title="Xác thực OTP"
                open={isOtpModalOpen}
                onCancel={() => setIsOtpModalOpen(false)}
                footer={null}
                width={400}
            >
                <Form
                    form={otpForm}
                    layout="vertical"
                    onFinish={handleVerifyOtp}
                >
                    <Form.Item
                        label="Mã OTP"
                        name="otp"
                        rules={[
                            { required: true, message: "Vui lòng nhập mã OTP!" },
                            { len: 4, message: "Mã OTP phải có 4 số!" }
                        ]}
                    >
                        <Input
                            placeholder="Nhập mã OTP 4 số"
                            maxLength={4}
                            style={{ textAlign: "center", fontSize: "18px", letterSpacing: "4px" }}
                        />
                    </Form.Item>

                    <div style={{ textAlign: "center", marginBottom: 16, color: "#666" }}>
                        Mã OTP đã được gửi đến email của bạn
                    </div>

                    <Form.Item>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button onClick={() => setIsOtpModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{ background: "#d32f2f", borderColor: "#d32f2f" }}
                            >
                                Xác thực
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};
