import { deleteUserAPI, fetchUsersAPI } from '@/services/api';
import { dataRangeValidate } from '@/services/helper';
import type {
    ActionType,
    ProColumns,
} from '@ant-design/pro-components';
import {
    ProTable,
} from '@ant-design/pro-components';
import { Button, ConfigProvider, message, notification, Space } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import { useRef, useState } from 'react';
import UserDetail from './user.detail';
import UserForm from './user.form';
import { ExportOutlined } from '@ant-design/icons';
import ImportModalUser from './data/import.user';
import { CSVLink } from 'react-csv';

interface IUserTable {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    gender: string;
    avatar: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    role: string;
    // createdAtRange: string;
}
type TSearch = {
    name: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const UserTable = () => {
    // Hàm refresh
    const handleRefresh = () => {
        actionRef.current?.reload();
    };
    const actionRef = useRef<ActionType>();
    const [isOpenModalImport, setIsOpenModalImport] = useState(false);
    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const [dataDetail, setDataDetail] = useState<IUsersTable>();
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const columns: ProColumns<IUserTable>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            render(dom, entity, index, action, schema) {
                return (
                    <a href="#" onClick={() => {
                        setDataDetail(entity)
                        setIsOpenModalDetail(true);

                    }}>{entity.id}</a>
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
                        color="default" variant="filled"
                        onClick={() => handleUpdate(record)}
                    >
                        Cập nhật
                    </Button>
                    <Button
                        color="default" variant="dashed"
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
    const handleDelete = async (id: string) => {
        const res = await deleteUserAPI(id);
        if (res.data) {
            message.success("Delete user successful");
            handleRefresh();
        }
        else {
            notification.error({
                message: "Xóa người dùng thất bại",
                description: JSON.stringify(res.message)
            })
        }
    };



    return (
        <ConfigProvider locale={vi_VN}>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef} // cho phép tải lại bảng, reset = loadUser()
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
                        icon={<ExportOutlined />}
                        type="primary"

                    >
                        <CSVLink
                            data={currentDataTable}
                            filename='export-user.csv'>
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        key="refresh"
                        type="primary"
                        icon={<ExportOutlined />}
                        onClick={() => setIsOpenModalImport(true)}
                    >
                        Import
                    </Button>,
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
                        onClick={() => {
                            setIsOpenFormModal(true);
                        }}
                        style={{
                            backgroundColor: "#52C41A",
                            borderColor: "#52C41A"
                        }}
                    >
                        Thêm mới
                    </Button>,

                ]}
                request={async (params, sort, filter) => {
                    console.log('=== REQUEST PARAMS ===');
                    console.log('Params:', params);
                    console.log('Current page:', params.current);
                    console.log('Page size:', params.pageSize);
                    console.log('Sort:', sort);
                    console.log('Filter:', filter);

                    try {
                        // Khởi tạo query với page và size
                        let query = `page=${params.current}&size=${params.pageSize}`;

                        // Tạo mảng để chứa các điều kiện filter
                        const filterConditions: string[] = [];
                        filterConditions.push(`active:true`)
                        // Thêm điều kiện filter cho email
                        if (params.email) {
                            filterConditions.push(`email~'${params.email}'`);
                        }

                        // Thêm điều kiện filter cho name
                        if (params.name) {
                            filterConditions.push(`name~'${params.name}'`);
                        }

                        // Xử lý date range
                        const createDateRange = dataRangeValidate(params.createdAtRange);
                        if (createDateRange && createDateRange.length === 2) {
                            console.log("Start date:", createDateRange[0]);
                            console.log("End date:", createDateRange[1]);

                            filterConditions.push(`createdAt>='${createDateRange[0]}' and createdAt<='${createDateRange[1]}'`);
                        }

                        // Nếu có điều kiện filter, thêm vào query
                        if (filterConditions.length > 0) {
                            query += `&filter=${filterConditions.join(' and ')}`;
                        }

                        // Xử lý sorting
                        if (sort && sort.createdAt) {
                            query += `&sort=createdAt,${sort.createdAt === "ascend" ? "asc" : "desc"}`;
                        }
                        else {
                            query += `&sort=createdAt,desc`;

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
                            setCurrentDataTable(res.data?.result ?? []);
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
            <UserDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isOpenModalDetail={isOpenModalDetail}
                setIsOpenModalDetail={setIsOpenModalDetail}
            />
            <UserForm
                handleRefresh={handleRefresh}
                setIsOpenFormModal={setIsOpenFormModal}
                isOpenFormModal={isOpenFormModal}
            />
            <ImportModalUser
                handleRefresh={handleRefresh}
                setIsOpenModalImport={setIsOpenModalImport}
                isOpenModalImport={isOpenModalImport}
            />
        </ConfigProvider>
    );
};

export default UserTable;