import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Tabs, Typography, Space, Tag, Modal, Descriptions, Divider, Spin, Empty } from "antd";
import { EyeOutlined, ShoppingCartOutlined, MessageOutlined, ShopOutlined, HeartOutlined } from "@ant-design/icons";
import { watchingHistoryAPI, getBookByIdAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export const HistoryOrderPage = () => {
    const [orders, setOrders] = useState<IOrderHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<IOrderHistory | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [bookIdToCover, setBookIdToCover] = useState<Record<number, string>>({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const response = await watchingHistoryAPI();
            const payload: any = response?.data ?? response;
            const list: IOrderHistory[] = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.result)
                    ? payload.result
                    : Array.isArray(payload?.orders)
                        ? payload.orders
                        : [];
            setOrders(list);
        } catch (error) {
            console.error("Error fetching order history:", error);
        } finally {
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

    const getStatusTag = (type: string) => {
        const statusMap: { [key: string]: { color: string; text: string } } = {
            "CASH_ON_DELIVERY": { color: "green", text: "Thanh toán khi nhận hàng" },
            "VNPay": { color: "blue", text: "VNPay" },
            "NAPAS": { color: "purple", text: "NAPAS" },
            "Google_Pay": { color: "orange", text: "Google Pay" },
        };
        const status = statusMap[type] || { color: "default", text: type };
        return <Tag color={status.color}>{status.text}</Tag>;
    };

    const handleViewDetails = (order: IOrderHistory) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleBuyAgain = () => {
        navigate("/");
    };

    const backendUrl = "http://localhost:8080";

    const ensureCoversForOrder = async (order: IOrderHistory) => {
        const missingIds = order.details
            .map((d) => d.id)
            .filter((id) => typeof id === "number" && !bookIdToCover[id as number]) as number[];
        if (missingIds.length === 0) return;
        const updates: Record<number, string> = {};
        await Promise.all(missingIds.map(async (id) => {
            try {
                const res = await getBookByIdAPI(id);
                const cover = res?.data?.coverImage;
                if (cover) updates[id] = cover;
            } catch { /* ignore */ }
        }));
        if (Object.keys(updates).length > 0) {
            setBookIdToCover((prev) => ({ ...prev, ...updates }));
        }
    };

    const OrderCard = ({ order }: { order: IOrderHistory }) => (
        <Card
            style={{ marginBottom: 16, borderRadius: 8 }}
            bodyStyle={{ padding: 16 }}
            onMouseEnter={() => ensureCoversForOrder(order)}
        >
            {/* Header with seller info */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                <Col>
                    <Space>
                        <Tag color="red" icon={<HeartOutlined />}>
                            Yêu thích
                        </Tag>
                        <Text strong>Đơn hàng #{order.id}</Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Button type="text" icon={<MessageOutlined />}>
                            Chat
                        </Button>
                        <Button type="text" icon={<ShopOutlined />}>
                            Xem Shop
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Status */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Space>
                        <Tag color="blue" icon="✓">Giao hàng thành công</Tag>
                        <Tag color="red">HOÀN THÀNH</Tag>
                    </Space>
                </Col>
            </Row>

            {/* Product details */}
            {order.details.map((detail, index) => (
                <div key={index}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={6} md={4}>
                            {bookIdToCover[detail.id] ? (
                                <img
                                    src={`${backendUrl}/api/v1/images/book/${bookIdToCover[detail.id]}`}
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
                    {getStatusTag(order.type)}
                </Col>
            </Row>

            {/* Action buttons */}
            <Row justify="space-between" style={{ marginTop: 16 }}>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(order)}
                        >
                            Xem chi tiết
                        </Button>
                        <Button icon={<MessageOutlined />}>
                            Liên hệ người bán
                        </Button>
                    </Space>
                </Col>
                <Col>
                    <Button
                        type="default"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleBuyAgain}
                    >
                        Mua lại
                    </Button>
                </Col>
            </Row>
        </Card>
    );

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
                            {getStatusTag(selectedOrder.type)}
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
                                    {bookIdToCover[detail.id] ? (
                                        <img
                                            src={`${backendUrl}/api/v1/images/book/${bookIdToCover[detail.id]}`}
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
                    <Tabs defaultActiveKey="all" centered>
                        <TabPane tab="Tất cả" key="all">
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
                        <TabPane tab="Chờ xác nhận" key="pending">
                            <Empty description="Không có đơn hàng chờ xác nhận" />
                        </TabPane>
                        <TabPane tab="Vận chuyển" key="shipping">
                            <Empty description="Không có đơn hàng đang vận chuyển" />
                        </TabPane>
                        <TabPane tab="Chờ giao hàng" key="delivery">
                            <Empty description="Không có đơn hàng chờ giao" />
                        </TabPane>
                        <TabPane tab="Hoàn thành" key="completed">
                            {orders.length === 0 ? (
                                <Empty description="Chưa có đơn hàng hoàn thành" />
                            ) : (
                                orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </TabPane>
                        <TabPane tab="Đã hủy" key="cancelled">
                            <Empty description="Không có đơn hàng đã hủy" />
                        </TabPane>
                        <TabPane tab="Trả hàng/Hoàn tiền" key="refund">
                            <Empty description="Không có đơn hàng trả hàng/hoàn tiền" />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>

            <OrderDetailModal />
        </div>
    );
};
