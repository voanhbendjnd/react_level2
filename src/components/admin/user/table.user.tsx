import type {
    ProColumnType,
    ProFormInstance,
} from '@ant-design/pro-components';
import {
    ProTable,
} from '@ant-design/pro-components';
import { Button, ConfigProvider } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import { useRef } from 'react';

type DataType = {
    age: number;
    address: string;
    name: string;
    time: number;
    key: number;
    description: string;
};

const columns: ProColumnType<DataType>[] = [
    {
        title: 'Tên',
        dataIndex: 'name',
        // CHÍNH XÁC: Tùy chỉnh placeholder cho ô tìm kiếm
        fieldProps: {
            placeholder: 'Vui lòng nhập tên',
        },
    },
    {
        title: 'Tên',
        dataIndex: 'name',
        valueType: 'text',
        // CHÍNH XÁC: Tùy chỉnh placeholder cho ô chọn ngày
        fieldProps: {
            placeholder: 'Vui lòng chọn thời gian',
        },
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
        },
        // CHÍNH XÁC: Tùy chỉnh placeholder cho ô chọn địa chỉ
        fieldProps: {
            placeholder: 'Vui lòng chọn địa chỉ',
        },
    },
    {
        // date time là có thêm giờ phút giây
        title: "Ngày tạo",
        dataIndex: "time",
        valueType: "date",
        sorter: (a, b) => a.time - b.time,
    },
    {
        title: 'Thao tác',
        key: 'action',
        valueType: 'option',
        width: "200px",
        render: () => [
            <Button
                style={{
                    backgroundColor: "#FFC107",
                }}
            >Cập nhật</Button>,
            <Button
                style={{
                    backgroundColor: "red",
                }}
            >
                Xóa
            </Button>
        ],
    },
];

const genData = (total: number) => {
    if (total < 1) {
        return [];
    }
    const data: DataType[] = [];
    for (let i = 1; i <= total; i += 1) {
        data.push({
            key: i,
            name: 'John Brown',
            age: i + 10,
            time: 1661136793649 + i * 1000,
            address: i % 2 === 0 ? 'london' : 'New York',
            description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
        });
    }
    return data;
};

const UserTable = () => {
    const ref = useRef<ProFormInstance>();

    return (
        // Bọc ProTable trong ConfigProvider để thiết lập ngôn ngữ
        <ConfigProvider locale={vi_VN}>
            <ProTable
                formRef={ref}
                bordered
                size="middle"
                headerTitle="Bảng thông tin người dùng"
                tooltip="Thêm sửa xóa người dùng"
                showHeader={true}
                // footer={() => 'Đây là phần chân trang'}
                expandable={{
                    expandedRowRender: (record: DataType) => (
                        <p>{record.description}</p>
                    ),
                }}
                rowSelection={{}}
                pagination={{
                    pageSize: 5,
                    current: 1,
                    total: 100,
                }}
                search={{
                    span: 12,
                    labelWidth: 80,
                    filterType: 'query',
                    layout: 'horizontal',
                    // CHÍNH XÁC: Tùy chỉnh chữ trên nút tìm kiếm
                    // searchText: 'Tìm kiếm',
                    resetText: 'Làm mới',
                }}
                options={{
                    density: true,
                    fullScreen: true,
                    setting: true,
                }}
                toolBarRender={() => [
                    <Button key="refresh" type="primary">
                        Làm mới
                    </Button>,
                ]}
                columns={columns}
                dataSource={genData(100)}
                locale={{
                    emptyText: 'Không có dữ liệu',
                    filterConfirm: 'Tìm kiếm',
                    filterReset: 'Làm lại',

                    // jumpTo: 'Đến trang',
                    // page: 'Trang',
                    // prev_page: 'Trang trước',
                    // next_page: 'Trang tiếp',
                    // prev_5: '5 trang trước',
                    // next_5: '5 trang tiếp',
                }}
            />
        </ConfigProvider>
    );
};

export default UserTable;
