import { fetchUsersAPI } from '@/services/api';
import { dataRangeValidate } from '@/services/helper';
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
    id: string;
    name: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}
type TSearch = {
    name: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const UserTable = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

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
            width: 80,
            sorter: true,
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
            dataIndex: "createdAtRange",
            valueType: "dateRange",
            search: true,
            render: (_, record) => {
                const date = new Date(record.createdAt);
                return date.toLocaleString('vi-VN');
            },
            hideInTable: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            valueType: "date",
            search: false,
            sorter: true,

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
    const handleDelete = (id: string) => {
        console.log('Xóa ID:', id);
    };

    // Hàm refresh
    const handleRefresh = () => {
        actionRef.current?.reload();
    };

    return (
        <ConfigProvider locale={vi_VN}>
            <ProTable<IUsersTable, TSearch>
                columns={columns}
                actionRef={actionRef} // cho phép tải lại bảng, reset
                bordered // thêm viền cho các ô
                size="large"
                headerTitle="Bảng thông tin người dùng"
                tooltip="Thêm sửa xóa người dùng"
                showHeader={true}
                rowSelection={{
                    type: 'checkbox',
                }}
                rowKey="id"
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                Hiển thị {range[0]}-{range[1]} trong tổng số {total} bản ghi
                            </div>
                        );
                    },
                    pageSizeOptions: ['5', '10', '20', '50'],
                    defaultPageSize: 5,
                    hideOnSinglePage: false,
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
                    console.log('Current page:', params.current);
                    console.log('Page size:', params.pageSize);
                    console.log('Sort:', sort);
                    console.log('Filter:', filter);

                    try {
                        let query = "";
                        if (params) {
                            query += `page=${params.current}&size=${params.pageSize}`
                        }

                        if (params.email || params.name) {
                            query += `&filter=`
                        }
                        if (params.email) {
                            query += `email~'${params.email}'`
                        }
                        if (params.name) {
                            query += params.email ? ` and name~'${params.name}'` : `name~'${params.name}'`
                        }
                        const createDateRange = dataRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            if (params.email || params.name) {
                                query += ` and `
                            }
                            else {
                                query += `&filter=`
                            }
                            console.log("date", createDateRange[0]);
                            console.log("date", createDateRange[1]);


                            query += `createdAt>='${createDateRange[0]}' and createdAt<='${createDateRange[1]}'`;

                        }
                        // Gọi API với đúng tham số
                        const res = await fetchUsersAPI(
                            query
                        );

                        console.log('=== API RESPONSE ===');
                        console.log('Full response:', res);

                        // Cập nhật meta state
                        if (res.data) {
                            setMeta(res.data.meta);
                            console.log('Meta updated:', res.data.meta);
                        }

                        const responseData = {
                            data: res.data?.result || [],
                            success: true,
                            total: res.data?.meta?.total || 0,
                        };

                        console.log('=== RETURN DATA ===');
                        console.log('Data length:', responseData.data.length);
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