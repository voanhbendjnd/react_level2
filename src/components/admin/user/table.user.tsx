import { fetchUsersAPI } from '@/services/api';
import type {
    ActionType,
    ProColumns,
} from '@ant-design/pro-components';
import {
    ProTable,
} from '@ant-design/pro-components';
import { Button, ConfigProvider, Space } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import { useRef } from 'react';

/**
 * Định nghĩa Interface cho dữ liệu người dùng
 */



const columns: ProColumns<IUsersTable>[] = [
    {
        title: 'id',
        dataIndex: 'id', // backend
        // CHÍNH XÁC: Tùy chỉnh placeholder cho ô tìm kiếm
        fieldProps: {
            placeholder: 'Vui lòng nhập tên',
        },
        sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
        title: 'Tên',
        dataIndex: 'name', // backend
        // CHÍNH XÁC: Tùy chỉnh placeholder cho ô tìm kiếm
        fieldProps: {
            placeholder: 'Vui lòng nhập tên',
        },
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        valueType: 'select',
        filters: true,
        onFilter: true,
        valueEnum: {
            london: {
                text: 'Luân Đôn',
            },
            'New York': {
                text: 'New York',
            },
            'can tho': {
                text: 'Cần Thơ'
            }
        },
        // CHÍNH XÁC: Tùy chỉnh placeholder cho ô chọn địa chỉ
        fieldProps: {
            placeholder: 'Vui lòng chọn địa chỉ',
        },
    },
    {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        valueType: "date",
        // sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
        title: 'Thao tác',
        key: 'action',
        valueType: 'option',
        width: 150,
        render: () => [
            <Space key="action-space">
                <Button
                    style={{
                        backgroundColor: "#FFC107"
                    }}
                >Cập nhật</Button>,
                <Button
                    style={{
                        backgroundColor: "red"
                    }}
                >
                    Xóa
                </Button>
            </Space>
        ],
    },
];

const UserTable = () => {
    const actionRef = useRef<ActionType>();

    return (
        <ConfigProvider locale={vi_VN}>
            <ProTable<IUsersTable>
                columns={columns}
                actionRef={actionRef}
                bordered
                size="large"
                headerTitle="Bảng thông tin người dùng"
                tooltip="Thêm sửa xóa người dùng"
                showHeader={true}
                rowSelection={{}}
                pagination={{
                    pageSize: 5,
                    current: 1,
                }}
                toolBarRender={() => [
                    <Button key="refresh" type="primary">
                        Làm mới
                    </Button>,
                ]}
                // SỬ DỤNG 'request' THAY CHO 'dataSource'
                request={async (params, sort, filter) => {
                    // Gọi hàm giả lập API
                    console.log(params)
                    console.log(sort);
                    console.log(filter)
                    const res = await fetchUsersAPI();
                    return {
                        data: res.data?.result,
                        "page": 1,
                        "success": true,
                        "total": res.data?.meta.total
                    }
                }}
                locale={{
                    emptyText: 'Không có dữ liệu',
                }}
            />
        </ConfigProvider>
    );
};

export default UserTable;
