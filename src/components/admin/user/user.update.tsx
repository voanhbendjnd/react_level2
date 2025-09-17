import { updateUserAPI } from "@/services/api";
import { App, Form, Input, Modal } from "antd";
import { useEffect } from "react";
type TypeField = {
    id: string;
    name: string;
    email: string;
    phone: string;
}
interface IProps {
    isOpenModalUpdate: boolean
    setIsOpenModalUpdate: (v: boolean) => void;
    dataDetail: IUsersTable | undefined;
    setDataDetail: (v: IUsersTable | undefined) => void;
    handleRefresh: () => void;
}
const UserUpdate = (props: IProps) => {
    const { handleRefresh, isOpenModalUpdate, setIsOpenModalUpdate, dataDetail, setDataDetail } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    useEffect(() => {
        if (dataDetail) {
            form.setFieldsValue({
                id: dataDetail.id,
                email: dataDetail.email,
                name: dataDetail.name,
                phone: dataDetail.phone
            })
        }
    }, [dataDetail, form]);
    const onFinish = async (values: TypeField) => {
        try {
            if (!dataDetail?.id) {
                throw new Error('User ID is required');
            }
            const res = await updateUserAPI(dataDetail.id, values.email, values.name, values.phone)
            if (res) {
                message.success("Cập nhật người dùng thành công")
                form.resetFields();
                setDataDetail(undefined)
                handleRefresh()
                setIsOpenModalUpdate(false)
            }
        } catch (error: any) {
            notification.error({
                message: "Cập nhật người dùng thất bại",
                description: error?.message || 'Có lỗi xảy ra'
            })
        }

    }
    return (
        <>
            <Modal
                title="Cập nhật thông tin người dùng"
                open={isOpenModalUpdate}
                onCancel={() => {
                    setIsOpenModalUpdate(false)
                    setDataDetail(undefined)
                    form.resetFields()
                }}
                onOk={() => form.submit()}
            >
                <fieldset
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px"
                    }}>
                    <legend>Form</legend>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item<TypeField>
                            label="Email"
                            name="email"
                        >
                            <Input disabled />

                        </Form.Item>
                        <Form.Item<TypeField>
                            label="Tên người dùng"
                            name="name"
                        >
                            <Input />

                        </Form.Item>
                        <Form.Item<TypeField>
                            label="Số điện thoại"
                            name="phone"
                        >
                            <Input />

                        </Form.Item>


                    </Form>
                </fieldset>

            </Modal>
        </>
    )
}

export default UserUpdate;