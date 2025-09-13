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
import { useRef, useState } from 'react';

interface IUsersTable {
    id: number;
    name: string;
    email: string;
    createdAt: string | number;
}

const UserTable = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    })



    const columns: ProColumns<IUsersTable>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            render(dom, entity, index, action, schema) {
                return (
                    <a href="#">{entity.id}</a>
                )
            },
            search: false,
            sorter: (a, b) => a.id - b.id, // Sửa: so sánh số thay vì string
            width: 80,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            fieldProps: {
                placeholder: 'Vui lòng nhập tên',
            },
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            fieldProps: {
                placeholder: 'Vui lòng nhập email',
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            valueType: "dateTime",
            search: false,
            render: (_, record) => {
                const date = new Date(record.createdAt);
                return date.toLocaleString('vi-VN');
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            valueType: 'option',
            width: 180,
            render: (_, record) => [
                <Space key="action-space">
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: "#FFC107",
                            borderColor: "#FFC107",
                            color: "#000"
                        }}
                        onClick={() => handleUpdate(record)}
                    >
                        Cập nhật
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ],
        },
    ];

    // Hàm xử lý cập nhật
    const handleUpdate = (record: IUsersTable) => {
        console.log('Cập nhật:', record);
    };

    // Hàm xử lý xóa
    const handleDelete = (id: number) => {
        console.log('Xóa ID:', id);
    };

    // Hàm refresh
    const handleRefresh = () => {
        actionRef.current?.reload();
    };

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
                rowSelection={{
                    type: 'checkbox',
                }}
                rowKey="id"
                // BỎ PAGINATION CONFIG - Để ProTable tự quản lý
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    // total: meta.pages,
                    showTotal: (total, range) => {
                        // Tính số trang thực tế
                        const currentPageSize = range[1] - range[0] + 1;
                        const totalPages = Math.ceil(total / (currentPageSize > 0 ? Math.max(currentPageSize, 1) : 5));
                        return (
                            <div>
                                Hiển thị {range[0]}-{range[1]} trong tổng số {total} bản ghi
                                ({totalPages} trang)
                            </div>
                        );
                    },
                    pageSizeOptions: ['5', '10', '20', '50'],
                    defaultPageSize: 5,
                    // Tự động ẩn pagination nếu chỉ có 1 trang
                    hideOnSinglePage: false,
                    // Đảm bảo không có trang trống
                    simple: false,
                }}
                search={{
                    labelWidth: 'auto',
                    resetText: 'Làm lại',
                    searchText: 'Tìm kiếm',
                }}
                toolBarRender={() => [
                    <Button
                        key="refresh"
                        type="primary"
                        onClick={handleRefresh}
                    >
                        Làm mới
                    </Button>,
                    <Button
                        key="add"
                        type="primary"
                        style={{
                            backgroundColor: "#52C41A",
                            borderColor: "#52C41A"
                        }}
                    >
                        Thêm mới
                    </Button>
                ]}
                request={async (params, sort, filter) => {
                    console.log('=== REQUEST PARAMS ===');
                    console.log('Params:', params);
                    console.log('Sort:', sort);
                    console.log('Filter:', filter);

                    try {
                        // Gọi API với page và pageSize từ params
                        const currentPage = params.current || 1;
                        const pageSize = params.pageSize || 5;

                        console.log(`Fetching page ${currentPage} with size ${pageSize}`);

                        const res = await fetchUsersAPI(currentPage, 40);

                        console.log('=== API RESPONSE ===');
                        console.log('Full response:', res);

                        // Kiểm tra cấu trúc response
                        if (!res || !res.data) {
                            console.error('Invalid response structure');
                            return {
                                data: [],
                                success: false,
                                total: 0,
                            };
                        }

                        const responseData = {
                            data: res.data.result || [],
                            success: true,
                            total: res.data.meta?.total || 0,
                        };

                        console.log('=== PROCESSED DATA ===');
                        console.log('Data count:', responseData.data.length);
                        console.log('Total:', responseData.total);
                        console.log('Success:', responseData.success);

                        return responseData;

                    } catch (error) {
                        console.error('=== API ERROR ===');
                        console.error('Error details:', error);

                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
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