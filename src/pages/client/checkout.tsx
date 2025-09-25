import { useCurrentApp } from "@/components/context/app.context";
import { Button, Col, Divider, Radio, Row } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export const CheckoutPage = () => {
    const { carts } = useCurrentApp();
    const [method, setMethod] = useState<string>("cod");
    const navigate = useNavigate();

    const selectedIds = useMemo<number[]>(() => {
        try {
            const raw = localStorage.getItem('checkout_selected_ids');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }, []);

    const selectedItems = useMemo(() => carts.filter(c => selectedIds.includes(c.id!)), [carts, selectedIds]);

    const subtotal = useMemo(() => selectedItems.reduce((s, c) => s + (c.detail?.price ?? 0) * c.quantity, 0), [selectedItems]);
    const shippingFee = subtotal > 0 ? 10000 : 0;
    const total = subtotal + shippingFee;

    return (
        <div className="checkout-page" style={{ background: "#fff" }}>
            <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
                    Trở lại
                </Button>
                <div style={{ fontWeight: 700 }}>Thanh Toán</div>
            </div>

            <div style={{ padding: 16 }}>
                {/* Address */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Địa chỉ Nhận Hàng</div>
                    <div style={{ color: "#555" }}>Vui lòng cập nhật địa chỉ giao hàng trong hồ sơ tài khoản.</div>
                </div>

                <Row gutter={[20, 20]}>
                    {/* Left: items and shipping */}
                    <Col xs={24} md={16}>
                        <div style={{ border: "1px solid #f0f0f0", borderRadius: 6 }}>
                            <div style={{ padding: 12, borderBottom: "1px solid #f5f5f5", fontWeight: 600 }}>Sản phẩm</div>
                            <div>
                                {selectedItems.map((item) => {
                                    const price = item.detail?.price ?? 0;
                                    const line = price * item.quantity;
                                    return (
                                        <div key={item.id} style={{ padding: 12, borderBottom: "1px solid #fafafa" }}>
                                            <Row gutter={[12, 12]} align="middle">
                                                <Col xs={6} md={4}>
                                                    <img
                                                        src={`http://localhost:8080/api/v1/images/book/${item.detail?.coverImage}`}
                                                        alt={item.detail?.title}
                                                        style={{ width: "100%", height: 72, objectFit: "cover", borderRadius: 6 }}
                                                    />
                                                </Col>
                                                <Col xs={18} md={12}>
                                                    <div style={{ fontWeight: 500 }}>{item.detail?.title}</div>
                                                    <div style={{ color: "#8c8c8c", fontSize: 12 }}>Phân loại: Mặc định</div>
                                                </Col>
                                                <Col xs={12} md={3} style={{ textAlign: "right" }}>{currency.format(price)}</Col>
                                                <Col xs={6} md={3} style={{ textAlign: "center" }}>{item.quantity}</Col>
                                                <Col xs={6} md={2} style={{ textAlign: "right", color: "#ee4d2d", fontWeight: 600 }}>{currency.format(line)}</Col>
                                            </Row>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ marginTop: 16, border: "1px solid #f0f0f0", borderRadius: 6 }}>
                            <div style={{ padding: 12, borderBottom: "1px solid #f5f5f5", fontWeight: 600 }}>Phương thức vận chuyển</div>
                            <div style={{ padding: 12, color: "#555" }}>Nhanh - Dự kiến giao trong 2-4 ngày. Phí: {currency.format(shippingFee)}</div>
                        </div>

                        <div style={{ marginTop: 16, border: "1px solid #f0f0f0", borderRadius: 6 }}>
                            <div style={{ padding: 12, borderBottom: "1px solid #f5f5f5", fontWeight: 600 }}>Shopee Voucher</div>
                            <div style={{ padding: 12, color: "#999" }}>Không có voucher áp dụng</div>
                        </div>
                    </Col>

                    {/* Right: Payment and place order */}
                    <Col xs={24} md={8}>
                        <div style={{ border: "1px solid #f0f0f0", borderRadius: 6 }}>
                            <div style={{ padding: 12, borderBottom: "1px solid #f5f5f5", fontWeight: 600 }}>Phương thức thanh toán</div>
                            <div style={{ padding: 12 }}>
                                <Radio.Group value={method} onChange={(e) => setMethod(e.target.value)} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <Radio.Button value="vnpay">VNPay</Radio.Button>
                                    <Radio.Button value="napas">Thẻ nội địa NAPAS</Radio.Button>
                                    <Radio.Button value="gpay">Google Pay</Radio.Button>
                                    <Radio.Button value="cod">Thanh toán khi nhận hàng</Radio.Button>
                                </Radio.Group>
                            </div>

                            <Divider style={{ margin: 0 }} />

                            <div style={{ padding: 12, display: "grid", gap: 8 }}>
                                <Row>
                                    <Col flex="auto">Tổng tiền hàng</Col>
                                    <Col>{currency.format(subtotal)}</Col>
                                </Row>
                                <Row>
                                    <Col flex="auto">Tổng tiền phí vận chuyển</Col>
                                    <Col>{currency.format(shippingFee)}</Col>
                                </Row>
                                <Row style={{ fontWeight: 700 }}>
                                    <Col flex="auto">Tổng thanh toán</Col>
                                    <Col style={{ color: "#ee4d2d" }}>{currency.format(total)}</Col>
                                </Row>
                            </div>

                            <div style={{ padding: 12 }}>
                                <Button type="primary" block size="large" disabled={selectedItems.length === 0}>Đặt hàng</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {selectedItems.length === 0 && (
                    <div style={{ textAlign: "center", color: "#999", marginTop: 16 }}>Không có sản phẩm nào được chọn.</div>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;