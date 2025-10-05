import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Tabs, Typography, Space, Tag, Modal, Descriptions, Divider, Spin, Empty, Pagination, message, Popconfirm, Grid } from "antd";
import { EyeOutlined, ShoppingCartOutlined, MessageOutlined, ShopOutlined, HeartOutlined, CloseSquareOutlined } from "@ant-design/icons";
import { handleOrderStatusAPI, watchingHistoryAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import type { PopconfirmProps } from "antd/lib";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export const HistoryOrderPage = () => {
    const [orders, setOrders] = useState<IOrderHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<IOrderHistory | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [activeTab, setActiveTab] = useState("all");
    const [isLoaderPage, setIsLoaderPage] = useState<boolean>();
    const navigate = useNavigate();

    // Add responsive detection
    const screens = Grid.useBreakpoint();
    const isMobile = !screens?.md;

    useEffect(() => {
        fetchOrderHistory();
    }, [currentPage, pageSize, activeTab, isLoaderPage]);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const response = await watchingHistoryAPI(currentPage, pageSize, activeTab);
            console.log("Full API Response:", response);
            console.log("Response Data:", response?.data);

            const payload: any = response?.data ?? response;
            console.log("Payload:", payload);

            // Try multiple possible response structures
            let ordersData = null;
            let totalCount = 0;

            if (payload?.data?.result && Array.isArray(payload.data.result)) {
                // Structure: { data: { result: [...], meta: {...} } }
                ordersData = payload.data.result;
                totalCount = payload.data.meta?.total || payload.data.result.length;
                console.log("Orders found (data.result structure):", ordersData);
            } else if (payload?.result && Array.isArray(payload.result)) {
                // Structure: { result: [...], meta: {...} }
                ordersData = payload.result;
                totalCount = payload.meta?.total || payload.result.length;
                console.log("Orders found (result structure):", ordersData);
            } else if (Array.isArray(payload)) {
                // Structure: [...] (direct array)
                ordersData = payload;
                totalCount = payload.length;
                console.log("Orders found (direct array):", ordersData);
            } else {
                console.log("No orders found. Payload structure:", Object.keys(payload || {}));
                console.log("Full payload:", JSON.stringify(payload, null, 2));
            }

            if (ordersData) {
                setOrders(ordersData);
                setTotalOrders(totalCount);
            } else {
                setOrders([]);
                setTotalOrders(0);
            }
        } catch (error) {
            console.error("Error fetching order history:", error);
            setOrders([]);
            setTotalOrders(0);
        } finally {
            setIsLoaderPage(false);
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentMethodTag = (type: string) => {
        const paymentMap: { [key: string]: { color: string; text: string } } = {
            "CASH_ON_DELIVERY": { color: "green", text: "Thanh toán khi nhận hàng" },
            "VNPay": { color: "blue", text: "VNPay" },
            "NAPAS": { color: "purple", text: "NAPAS" },
            "Google_Pay": { color: "orange", text: "Google Pay" },
        };
        const payment = paymentMap[type] || { color: "default", text: type };
        return <Tag color={payment.color}>{payment.text}</Tag>;
    };

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

    const handleOrderStatus = async (id: number, status: string) => {
        try {
            const res = await handleOrderStatusAPI(id, status);
            if (!res || !res.data) {
                message.error("Cập nhật trạng thái đơn hàng thất bại");
            } else {
                // Tối ưu: chỉ fetch lại data thay vì reload toàn bộ trang
                await fetchOrderHistory();
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        }
    }
    const cancel: PopconfirmProps['onCancel'] = () => {
        // Cancel action - do nothing
    };


    const handleViewDetails = (order: IOrderHistory) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleBuyAgain = () => {
        navigate("/");
    };

    const backendUrl = "http://localhost:8080";

    const OrderCard = ({ order }: { order: IOrderHistory }) => {
        const screens = Grid.useBreakpoint();
        const isMobile = !screens?.md;

        return (
            <Card
                style={{ marginBottom: 16, borderRadius: 8 }}
                bodyStyle={{ padding: 16 }}
            >
                {/* Header with seller info */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                    <Col xs={24} sm={12}>
                        <Space wrap>
                            <Tag color="red" icon={<HeartOutlined />}>
                                Yêu thích
                            </Tag>
                            <Text strong>Đơn hàng #{order.id}</Text>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Space wrap style={{ justifyContent: isMobile ? 'flex-start' : 'flex-end', width: '100%' }}>
                            <Button type="text" icon={<MessageOutlined />} size="small">
                                {isMobile ? 'Chat' : 'Chat'}
                            </Button>
                            <Button type="text" icon={<ShopOutlined />} size="small">
                                {isMobile ? 'Shop' : 'Xem Shop'}
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Status */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Space>
                            {getStatusTag(order.status)}
                        </Space>
                    </Col>
                </Row>

                {/* Product details */}
                {order.details.map((detail, index) => (
                    <div key={index}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={6} md={4}>
                                {detail.coverImage ? (
                                    <img
                                        src={`${backendUrl}/api/v1/images/book/${detail.coverImage}`}
                                        alt={detail.bookName}
                                        style={{ width: "100%", height: 80, objectFit: "contain", borderRadius: 6, background: "#fafafa" }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: 80,
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: 6,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text type="secondary">📚</Text>
                                    </div>
                                )}
                            </Col>
                            <Col xs={24} sm={18} md={20}>
                                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                    <Text strong style={{ fontSize: 14 }}>
                                        {detail.bookName}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Phân loại hàng: Mặc định
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Số lượng: x{detail.quantity}
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                        {index < order.details.length - 1 && <Divider style={{ margin: "12px 0" }} />}
                    </div>
                ))}

                {/* Pricing and dates */}
                <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
                    <Col>
                        <Space direction="vertical" size={4}>
                            <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                                Thành tiền: {currency.format(order.totalAmount)}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Ngày đặt: {formatDate(order.createdAt)}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Cập nhật: {formatDate(order.updatedAt)}
                            </Text>
                        </Space>
                    </Col>
                    <Col>
                        {getPaymentMethodTag(order.type)}
                    </Col>
                </Row>

                {/* Action buttons */}
                {isMobile ? (
                    // Mobile layout - cải thiện để không bị tràn
                    <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
                        <Col xs={24}>
                            <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        icon={<EyeOutlined />}
                                        onClick={() => handleViewDetails(order)}
                                        size="small"
                                    >
                                        Chi tiết
                                    </Button>
                                    <Button
                                        icon={<MessageOutlined />}
                                        size="small"
                                    >
                                        Liên hệ
                                    </Button>
                                </Space>
                                <Space wrap>
                                    {/* Chỉ hiển thị nút hủy đơn khi đơn hàng đang ở trạng thái PENDING */}
                                    {order.status === "PENDING" && (
                                        <Popconfirm
                                            title="Xác nhận hủy đơn hàng"
                                            description="Bạn chắc chắn muốn hủy đơn hàng này chứ!"
                                            onConfirm={() => {
                                                handleOrderStatus(order.id, "CANCELED")
                                            }}
                                            onCancel={cancel}
                                            okText="Đồng ý"
                                            cancelText="Hủy"
                                        >
                                            <Button
                                                icon={<CloseSquareOutlined />}
                                                size="small"
                                                danger
                                            >
                                                Hủy
                                            </Button>
                                        </Popconfirm>
                                    )}

                                    {/* Hiển thị nút mua lại khi đơn hàng đã được giao thành công hoặc đã hủy */}
                                    {(order.status === "DELIVERED" || order.status === "CANCELED") && (
                                        <Button
                                            type="default"
                                            icon={<ShoppingCartOutlined />}
                                            onClick={handleBuyAgain}
                                            size="small"
                                        >
                                            Mua lại
                                        </Button>
                                    )}
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                ) : (
                    // Desktop layout - nút hủy đơn ở góc phải
                    <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
                        <Col>
                            <Space wrap>
                                <Button
                                    type="primary"
                                    icon={<EyeOutlined />}
                                    onClick={() => handleViewDetails(order)}
                                    size="small"
                                >
                                    Xem chi tiết
                                </Button>
                                <Button
                                    icon={<MessageOutlined />}
                                    size="small"
                                >
                                    Liên hệ người bán
                                </Button>
                                {/* Hiển thị nút mua lại khi đơn hàng đã được giao thành công hoặc đã hủy */}
                                {(order.status === "DELIVERED" || order.status === "CANCELED") && (
                                    <Button
                                        type="default"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleBuyAgain}
                                        size="small"
                                    >
                                        Mua lại
                                    </Button>
                                )}
                            </Space>
                        </Col>
                        <Col>
                            {/* Chỉ hiển thị nút hủy đơn khi đơn hàng đang ở trạng thái PENDING - ở góc phải */}
                            {order.status === "PENDING" && (
                                <Popconfirm
                                    title="Xác nhận hủy đơn hàng"
                                    description="Bạn chắc chắn muốn hủy đơn hàng này chứ!"
                                    onConfirm={() => {
                                        handleOrderStatus(order.id, "CANCELED")
                                    }}
                                    onCancel={cancel}
                                    okText="Đồng ý"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        icon={<CloseSquareOutlined />}
                                        size="small"
                                        danger
                                    >
                                        Hủy đơn
                                    </Button>
                                </Popconfirm>
                            )}
                        </Col>
                    </Row>
                )}
            </Card>
        );
    };

    const OrderDetailModal = () => (
        <Modal
            title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
        >
            {selectedOrder && (
                <>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Tên người nhận">
                            {selectedOrder.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {selectedOrder.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {selectedOrder.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phương thức thanh toán">
                            {getPaymentMethodTag(selectedOrder.type)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái đơn hàng">
                            {getStatusTag(selectedOrder.status)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">
                            <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                                {currency.format(selectedOrder.totalAmount)}
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt hàng">
                            {formatDate(selectedOrder.createdAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            {formatDate(selectedOrder.updatedAt)}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider>Chi tiết sản phẩm</Divider>

                    {selectedOrder.details.map((detail, index) => (
                        <Card key={index} style={{ marginBottom: 8 }}>
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} sm={6} md={4}>
                                    {detail.coverImage ? (
                                        <img
                                            src={`${backendUrl}/api/v1/images/book/${detail.coverImage}`}
                                            alt={detail.bookName}
                                            style={{ width: "100%", height: 80, objectFit: "contain", borderRadius: 6, background: "#fafafa" }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: 80,
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: 6,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Text type="secondary">📚</Text>
                                        </div>
                                    )}
                                </Col>
                                <Col xs={24} sm={18} md={20}>
                                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                        <Text strong style={{ fontSize: 16 }}>
                                            {detail.bookName}
                                        </Text>
                                        <Text type="secondary">
                                            ID sản phẩm: {detail.id}
                                        </Text>
                                        <Text type="secondary">
                                            Số lượng: {detail.quantity}
                                        </Text>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </>
            )}
        </Modal>
    );

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                    <Text>Đang tải lịch sử đơn hàng...</Text>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
            <style>
                {`
                    .ant-tabs-tab-bar {
                        overflow-x: auto !important;
                        scrollbar-width: thin !important;
                        -webkit-overflow-scrolling: touch !important;
                    }
                    .ant-tabs-tab-bar::-webkit-scrollbar {
                        height: 4px !important;
                    }
                    .ant-tabs-tab-bar::-webkit-scrollbar-track {
                        background: #f1f1f1 !important;
                    }
                    .ant-tabs-tab-bar::-webkit-scrollbar-thumb {
                        background: #c1c1c1 !important;
                        border-radius: 2px !important;
                    }
                    .ant-tabs-tab-bar::-webkit-scrollbar-thumb:hover {
                        background: #a8a8a8 !important;
                    }
                `}
            </style>
            {/* Header */}
            <div style={{ background: "#fff", padding: "16px 0", marginBottom: 16 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
                    <Title level={2} style={{ margin: 0, color: "#ff4d4f" }}>
                        Lịch sử đơn hàng
                    </Title>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
                {/* Tabs */}
                <Card style={{ marginBottom: 16 }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => {
                            setActiveTab(key);
                            setCurrentPage(1); // Reset to first page when changing tabs
                        }}
                        centered={!isMobile}
                        tabPosition="top"
                        style={{
                            overflowX: 'auto',
                            scrollbarWidth: 'thin'
                        }}
                        tabBarStyle={{
                            marginBottom: 0,
                            overflowX: 'auto',
                            scrollbarWidth: 'thin',
                            ...(isMobile && {
                                justifyContent: 'flex-start',
                                paddingLeft: 0,
                                paddingRight: 0
                            })
                        }}
                    >
                        <TabPane tab={isMobile ? "Tất cả" : "Tất cả"} key="all">
                            {orders.length === 0 ? (
                                <Empty
                                    description="Chưa có đơn hàng nào"
                                    style={{ padding: "50px 0" }}
                                />
                            ) : (
                                orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </TabPane>
                        <TabPane tab={isMobile ? "Xử lý" : "Đang xử lý"} key="PENDING">
                            {orders.length === 0 ? (
                                <Empty description="Không có đơn hàng đang xử lý" />
                            ) : (
                                orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </TabPane>
                        <TabPane tab={isMobile ? "Vận chuyển" : "Đã vận chuyển"} key="SHIPPED">
                            {orders.length === 0 ? (
                                <Empty description="Không có đơn hàng đã vận chuyển" />
                            ) : (
                                orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </TabPane>
                        <TabPane tab={isMobile ? "Đã giao" : "Đã giao"} key="DELIVERED">
                            {orders.length === 0 ? (
                                <Empty description="Chưa có đơn hàng đã giao" />
                            ) : (
                                orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </TabPane>
                        <TabPane tab={isMobile ? "Hủy" : "Đã hủy"} key="CANCELED">
                            {orders.length === 0 ? (
                                <Empty description="Không có đơn hàng đã hủy" />
                            ) : (
                                orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </TabPane>
                        <TabPane tab={isMobile ? "Thất bại" : "Thất bại"} key="FAILED">
                            {orders.length === 0 ? (
                                <Empty description="Không có đơn hàng thất bại" />
                            ) : (
                                orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </TabPane>
                    </Tabs>
                </Card>

                {/* Pagination */}
                {totalOrders > pageSize && (
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalOrders}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                            showQuickJumper
                            showTotal={(total, range) =>
                                `${range[0]}-${range[1]} của ${total} đơn hàng`
                            }
                        />
                    </div>
                )}
            </div>

            <OrderDetailModal />
        </div>
    );
};
