import { FORMATE_DATE_VN } from "@/services/helper";
import { Avatar, Descriptions, Drawer } from "antd";
import type { DescriptionsProps } from "antd/lib";
import dayjs from "dayjs";

interface IProps {
    dataDetail?: IUsersTable;
    isOpenModalDetail: boolean;
    setIsOpenModalDetail: (v: boolean) => void;
    setDataDetail: (v: IUsersTable | undefined) => void;
}
const UserDetail = (props: IProps) => {
    const { dataDetail, isOpenModalDetail, setIsOpenModalDetail, setDataDetail } = props;
    const avatarURL = `http://localhost:8080/api/v1/images/user/${dataDetail?.avatar}`
    const items: DescriptionsProps['items'] = [
        {
            key: 'id',
            label: 'ID',
            children: <p>{dataDetail?.id}</p>
            , span: 1
        },
        {
            key: 'name',
            label: 'Tên hiển thị',
            children: <p>{dataDetail?.name}</p>,
            span: 3,

        },
        {
            key: 'email',
            label: 'Gmail',
            children: <p>{dataDetail?.email}</p>,
        },
        {
            key: 'phone',
            label: 'Số điện thoại',
            children: <p>{dataDetail?.phone}</p>,
            span: 2,
        },
        {
            key: 'role',
            label: 'Quyền',
            children: <p>{dataDetail?.role}</p>,
        },
        {
            key: 'avatar',
            label: 'Ảnh đại diện',
            children: <Avatar size={40} src={avatarURL}>USER</Avatar>,
            span: 3
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            children: <p>{dayjs(dataDetail?.createdAt).format(FORMATE_DATE_VN)}</p>,
        },
        {
            key: 'updatedAt',
            label: 'Ngày cập nhật',
            children: <p>{dayjs(dataDetail?.updatedAt).format(FORMATE_DATE_VN)}</p>,
        },
    ];
    return (
        <>
            <Drawer
                open={isOpenModalDetail}
                onClose={() => {
                    setDataDetail(undefined);
                    setIsOpenModalDetail(false);
                }}
                width={"100vh"}
            >
                <Descriptions title="Thông tin người dùng" bordered items={items} />;

            </Drawer>
        </>
    )
}

export default UserDetail;