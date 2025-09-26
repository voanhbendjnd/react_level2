import { useCurrentApp } from "@/components/context/app.context";
import { Button, Col, Divider, Radio, Row, Form, Input, App, type FormProps } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { orderAPI } from "@/services/api";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

type FieldType = {
    addressMode: "manual" | "account";
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress?: string;
    paymentMethod: "vnpay" | "napas" | "gpay" | "cod";
    items: ICheckoutItemPayload[];
    subtotal: number;
    shippingFee: number;
    total: number;
}
type ICheckoutItemPayload = {
    productId: number;
    quantity: number;
    price: number; // unit price at checkout time
}

export const CheckoutPage = () => {
    const { carts, user, setCarts } = useCurrentApp() as any;
    const [method, setMethod] = useState<"VNPay" | "NAPAS" | "Google_Play" | "CASH_ON_DELIVERY">("CASH_ON_DELIVERY");
    const [addrMode, setAddrMode] = useState<"manual" | "account">("manual");
    const [form] = Form.useForm<ICheckoutPayload>();
    const accountAddress: string | undefined = user?.address || undefined;
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const selectedIds = useMemo<number[]>(() => {
        try {
            const raw = localStorage.getItem('checkout_selected_ids');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }, []);

    const selectedItems = useMemo<ICart[]>(() => carts.filter((c: ICart) => selectedIds.includes(c.id!)), [carts, selectedIds]);

    const subtotal = useMemo<number>(() => selectedItems.reduce((s: number, c: ICart) => s + (c.detail?.price ?? 0) * c.quantity, 0), [selectedItems]);
    const shippingFee = subtotal > 0 ? 10000 : 0;
    const total = subtotal + shippingFee;
    const onFinish: FormProps<FieldType>['onFinish'] = async () => {
        setLoading(true);
        const formValues = form.getFieldsValue(true) as any;
        const payload: IRequestOrder = {
            name: formValues.receiverName,
            address: addrMode === "manual" ? formValues.receiverAddress : (user?.address || ""),
            phone: formValues.receiverPhone,
            totalAmount: total,
            type: method.toUpperCase?.() || method,
            details: selectedItems.map((c) => ({
                bookId: c.detail?.id as number,
                quantity: c.quantity,
                bookName: c.detail?.title || "",
            })),
        };
        try {
            const res = await orderAPI(payload);
            if (res?.data) {
                message.success("Đặt hàng thành công");
                // clear only selected items from carts
                const remaining = carts.filter((c: ICart) => !selectedIds.includes(c.id!));
                setCarts(remaining);
                localStorage.setItem('carts', JSON.stringify(remaining));
                localStorage.removeItem('checkout_selected_ids');
                navigate('/thanks');
            }
        } catch (e) {
            message.error("Đặt hàng thất bại. Vui lòng thử lại");
        }
        setLoading(false);
    }

    // Prefill and keep form values in sync with user and selection
    useEffect(() => {
        form.setFieldsValue({
            receiverName: user?.name,
            receiverPhone: (user as any)?.phone,
            receiverAddress: addrMode === 'account' ? accountAddress : form.getFieldValue('receiverAddress'),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.name, (user as any)?.phone, accountAddress, addrMode]);

    return (
        <div className="checkout-page" style={{ background: "#fff" }}>
            <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
                    Trở lại
                </Button>
                <div style={{ fontWeight: 700 }}>Thanh Toán</div>
            </div>

            <Form
                style={{
                    padding: "16px"
                }}
                form={form}
                layout="vertical"
                initialValues={{
                    addressMode: addrMode,
                    receiverName: user?.name,
                    receiverPhone: (user as any)?.phone,
                    receiverAddress: addrMode === "account" ? accountAddress : undefined,
                }}
                onFinish={onFinish}
            >
                {/* form fields prefilled via useEffect above */}
                {/* Address */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Địa chỉ Nhận Hàng</div>
                    <Radio.Group
                        value={addrMode}
                        onChange={(e) => setAddrMode(e.target.value)}
                        style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}
                    >
                        <Radio.Button value="manual">Nhập địa chỉ trực tiếp</Radio.Button>
                        <Radio.Button value="account" disabled={!accountAddress}>Chọn địa chỉ từ tài khoản</Radio.Button>
                    </Radio.Group>

                    {addrMode === "manual" ? (
                        <Row gutter={[12, 12]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="receiverName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                                    <Input placeholder="Nguyễn Văn A" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="receiverPhone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                                    <Input placeholder="09xxxxxxxx" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="receiverAddress" label="Địa chỉ nhận hàng" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                                    <Input.TextArea rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : (
                        <div style={{ padding: 12, border: "1px dashed #e5e7eb", borderRadius: 6, background: "#fafafa" }}>
                            {accountAddress ? (
                                <>
                                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Địa chỉ tài khoản</div>
                                    <div style={{ whiteSpace: "pre-wrap" }}>{accountAddress}</div>
                                </>
                            ) : (
                                <div style={{ color: "#999" }}>Chưa có địa chỉ trong tài khoản. Vui lòng chọn "Nhập địa chỉ trực tiếp".</div>
                            )}
                        </div>
                    )}
                </div>

                <Row gutter={[20, 20]}>
                    {/* Left: items and shipping */}
                    <Col xs={24} md={16}>
                        <div style={{ border: "1px solid #f0f0f0", borderRadius: 6 }}>
                            <div style={{ padding: 12, borderBottom: "1px solid #f5f5f5", fontWeight: 600 }}>Sản phẩm</div>
                            <div>
                                {selectedItems.map((item: ICart) => {
                                    const price = item.detail?.price ?? 0;
                                    const line = price * item.quantity;
                                    return (
                                        <div key={item.id} style={{ padding: 12, borderBottom: "1px solid #fafafa" }}>
                                            <Row gutter={[12, 12]} align="middle">
                                                <Col xs={6} md={4}>
                                                    <img
                                                        src={`http://localhost:8080/api/v1/images/book/${item.detail?.coverImage}`}
                                                        alt={item.detail?.title}
                                                        style={{ width: "100%", height: 72, objectFit: "contain", borderRadius: 6 }}
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
                                    <Radio.Button value="VNPay">VNPay</Radio.Button>
                                    <Radio.Button value="NAPAS">Thẻ nội địa NAPAS</Radio.Button>
                                    <Radio.Button value="Google_Pay">Google Pay</Radio.Button>
                                    <Radio.Button value="CASH_ON_DELIVERY">Thanh toán khi nhận hàng</Radio.Button>
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
                                <Button htmlType="submit" loading={loading} type="primary" block size="large" disabled={selectedItems.length === 0}>Đặt hàng</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {selectedItems.length === 0 && (
                    <div style={{ textAlign: "center", color: "#999", marginTop: 16 }}>Không có sản phẩm nào được chọn.</div>
                )}
            </Form>
        </div>
    );
}

export default CheckoutPage;