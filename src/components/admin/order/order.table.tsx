import { getAllOrderAPI, handleOrderStatusAPI } from "@/services/api";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { Col, Row, Tag, Select, message, Popconfirm } from "antd";
import { useRef, useState } from "react";

interface ITableOrder {
    id: string;
    name: string;
    address: string;
    totalAmount: number;
    createdAt: string;
    status: string;
}
type TSearch = {
    name: string;
    address: string;
    status: string;
}
export const OrderTable = () => {
    const actionRef = useRef<ActionType>();
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [statusChanges, setStatusChanges] = useState<{ [key: string]: string }>({});

    // Helper functions for status
    const getStatusTag = (status: string) => {
        const statusMap: { [key: string]: { color: string; text: string } } = {
            "PENDING": { color: "orange", text: "Đang xử lý" },
            "SHIPPED": { color: "blue", text: "Đã vận chuyển" },
            "DELIVERED": { color: "green", text: "Đã giao" },
            "CANCELED": { color: "red", text: "Đã hủy" },
            "FAILED": { color: "red", text: "Thất bại" },
        };
        const statusInfo = statusMap[status] || { color: "default", text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await handleOrderStatusAPI(parseInt(orderId), newStatus);
            if (res && res.data) {
                message.success("Cập nhật trạng thái đơn hàng thành công");
                // Remove from pending changes
                setStatusChanges(prev => {
                    const newChanges = { ...prev };
                    delete newChanges[orderId];
                    return newChanges;
                });
                actionRef.current?.reload();
            } else {
                message.error("Cập nhật trạng thái đơn hàng thất bại");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        }
    };

    const handleStatusSelect = (orderId: string, newStatus: string, currentStatus: string) => {
        if (newStatus !== currentStatus) {
            setStatusChanges(prev => ({
                ...prev,
                [orderId]: newStatus
            }));
        }
    };

    const confirmStatusChange = async (orderId: string) => {
        const newStatus = statusChanges[orderId];
        if (newStatus) {
            await handleStatusChange(orderId, newStatus);
        }
    };

    const cancelStatusChange = (orderId: string) => {
        setStatusChanges(prev => {
            const newChanges = { ...prev };
            delete newChanges[orderId];
            return newChanges;
        });
    };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            "PENDING": "Đang xử lý",
            "SHIPPED": "Đã vận chuyển",
            "DELIVERED": "Đã giao",
            "CANCELED": "Đã hủy",
            "FAILED": "Thất bại",
        };
        return statusMap[status] || status;
    };

    const columns: ProColumns<ITableOrder>[] = [
        {
            title: "ID",
            dataIndex: "id",
            search: false,
            render: (_, record) => [
                <a href="#">
                    {record.id}
                </a>
            ]
        },
        {
            title: "Tên",
            dataIndex: "name",
            search: true
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            sorter: true,
            search: false,
            render(_dom, entity) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(entity.totalAmount)}
                    </>
                )
            }
        },
        {
            title: "Ngày khởi tạo",
            dataIndex: "createdAt",
            search: false
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            search: true,
            valueType: 'select',
            valueEnum: {
                'PENDING': { text: 'Đang xử lý', status: 'Warning' },
                'SHIPPED': { text: 'Đã vận chuyển', status: 'Processing' },
                'DELIVERED': { text: 'Đã giao', status: 'Success' },
                'CANCELED': { text: 'Đã hủy', status: 'Error' },
                'FAILED': { text: 'Thất bại', status: 'Error' },
            },
            render: (_, record) => {
                const currentStatus = statusChanges[record.id] || record.status;
                const hasPendingChange = statusChanges[record.id];

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusTag(currentStatus)}
                        <Popconfirm
                            title="Xác nhận thay đổi trạng thái"
                            description={`Bạn có chắc chắn muốn chuyển đơn hàng #${record.id} từ "${getStatusText(record.status)}" sang "${getStatusText(currentStatus)}" không?`}
                            onConfirm={() => confirmStatusChange(record.id)}
                            onCancel={() => cancelStatusChange(record.id)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            disabled={!hasPendingChange}
                        >
                            <Select
                                size="small"
                                value={currentStatus}
                                style={{ width: 150 }}
                                onChange={(value) => handleStatusSelect(record.id, value, record.status)}
                                options={[
                                    { value: 'PENDING', label: 'Đang xử lý' },
                                    { value: 'SHIPPED', label: 'Đã vận chuyển' },
                                    { value: 'DELIVERED', label: 'Đã giao' },
                                    { value: 'CANCELED', label: 'Đã hủy' },
                                    { value: 'FAILED', label: 'Thất bại' },
                                ]}
                            />
                        </Popconfirm>
                    </div>
                );
            }
        }
    ]
    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div style={{
                        padding: '16px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Lọc theo trạng thái:</span>
                        <Select
                            value={selectedStatus}
                            onChange={(value) => {
                                setSelectedStatus(value);
                                actionRef.current?.reload();
                            }}
                            style={{ width: 200 }}
                            options={[
                                { value: 'ALL', label: 'Tất cả đơn hàng' },
                                { value: 'PENDING', label: 'Đang xử lý' },
                                { value: 'SHIPPED', label: 'Đã vận chuyển' },
                                { value: 'DELIVERED', label: 'Đã giao' },
                                { value: 'CANCELED', label: 'Đã hủy' },
                                { value: 'FAILED', label: 'Thất bại' },
                            ]}
                        />
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <ProTable<ITableOrder, TSearch>
                        actionRef={actionRef}
                        columns={columns}
                        bordered
                        size="large"
                        headerTitle="Bảng quản lý đơn hàng"
                        tooltip="Xem các đơn hàng"
                        showHeader={true}
                        scroll={{ x: 'max-content' }}
                        search={{
                            labelWidth: 'auto',
                            span: { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 }
                        }}
                        // ô đứng trước id
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
                                        Hiển thị {range[0]}-{range[1]} trong tổng số {total} trang
                                    </div>
                                );
                            },
                            pageSizeOptions: ['5', '10', '20', '50'],
                            defaultPageSize: 5,
                            hideOnSinglePage: false,
                            simple: false,
                        }}
                        toolBarRender={() => [
                            // <CSVLink
                            //     data={currentDataTable}
                            //     filename='export-book.csv'>
                            //     <Button
                            //         icon={<ExportOutlined />}
                            //         type="primary"
                            //     >
                            //         Export
                            //     </Button>
                            // </CSVLink>
                            ,

                        ]}
                        request={async (params, sort) => {
                            try {
                                let query = `page=${params.current}&size=${params.pageSize}`
                                const filters: string[] = [];
                                if (params.address) {
                                    filters.push(`addressShipping~'${params.address}'`)
                                }
                                if (params.name) {
                                    filters.push(`name~'${params.name}'`)
                                }
                                if (params.status) {
                                    filters.push(`status='${params.status}'`)
                                }
                                if (selectedStatus !== 'ALL') {
                                    filters.push(`status='${selectedStatus}'`)
                                }
                                if (filters.length > 0) {
                                    query += `&filter=${filters.join(' and ')}`
                                }
                                if (sort && sort.totalAmount) {
                                    query += `&sort=totalAmount,${sort.totalAmount === "ascend" ? "asc" : "desc"}`;
                                }
                                else {
                                    query += `&sort=orderCreateDate,desc`;
                                }

                                const res = await getAllOrderAPI(query)
                                const responseData = {
                                    data: res.data?.result || [],
                                    success: true,
                                    total: res.data?.meta.total || 0,
                                }
                                return responseData;
                            }
                            catch (error) {
                                return {
                                    data: [],
                                    success: false,
                                    total: 0,
                                };
                            }
                        }}
                    />

                </Col>
            </Row>
        </>
    )
}