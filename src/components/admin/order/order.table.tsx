import { getAllOrderAPI } from "@/services/api";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { Button, Col, Row } from "antd";
import { useRef, useState } from "react";

interface ITableOrder {
    id: string;
    name: string;
    address: string;
    totalAmount: number;
    createdAt: string;
}
type TSearch = {
    name: string;
    address: string;
}
export const OrderTable = () => {
    const actionRef = useRef<ActionType>();
    const [currentDataTable, setCurrentDataTable] = useState<ITableOrder[]>([]);

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
            render(dom, entity, index, action, schema) {
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
        }
    ]
    return (
        <>
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
                                if (res.data) {
                                    setCurrentDataTable(res.data.result ?? []);
                                }
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