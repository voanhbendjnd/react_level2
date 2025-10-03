import { useCurrentApp } from "@/components/context/app.context";
import { LeftOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Grid, InputNumber, Popconfirm, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "@/styles/productDetail.scss";
const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export const OrderPage = () => {
    const { carts, setCarts } = useCurrentApp();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const isAllSelected = useMemo(() => carts.length > 0 && selectedIds.length === carts.length, [carts, selectedIds]);

    const handleUpdateQty = (id: number | undefined, qty: number | null) => {
        if (!id || qty === null) return;
        const current = carts.find((c) => c.id === id);
        if (!current) return;
        const max = current.detail?.stockQuantity ?? 1;
        const normalized = Math.max(1, Math.min(qty, max));
        if (qty > max) {
            message.warning(`Chỉ còn ${max} sản phẩm trong kho`);
        }
        const next = carts.map((c) => (c.id === id ? { ...c, quantity: normalized } : c));
        setCarts(next);
        localStorage.setItem("carts", JSON.stringify(next));
    };

    const handleRemove = (id: number | undefined) => {
        const next = carts.filter((c) => c.id !== id);
        setCarts(next);
        localStorage.setItem("carts", JSON.stringify(next));
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleToggleOne = (checked: boolean, id: number | undefined) => {
        if (!id) return;
        setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
    };

    const handleToggleAll = (checked: boolean) => {
        if (checked) setSelectedIds(carts.map((c) => c.id!).filter(Boolean));
        else setSelectedIds([]);
    };

    const selectedTotal = useMemo(() => {
        return carts
            .filter((c) => selectedIds.includes(c.id!))
            .reduce((sum, c) => sum + (c.detail?.price ?? 0) * c.quantity, 0);
    }, [carts, selectedIds]);

    return (
        <div className="order-page" style={{ background: "#fff" }}>
            <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
                </Button>
                <div style={{ fontWeight: 700 }}>Giỏ hàng</div>
            </div>
            {!isMobile && (
                <div className="order-header" style={{ padding: 16, borderBottom: "1px solid #f0f0f0", fontWeight: 600 }}>
                    <Row align="middle">
                        <Col xs={10} md={13}>Sản Phẩm</Col>
                        <Col xs={4} md={3} style={{ textAlign: "center" }}>Đơn Giá</Col>
                        <Col xs={4} md={2} style={{ textAlign: "center" }}>Số Lượng</Col>
                        <Col xs={4} md={3} style={{ textAlign: "right" }}>Số Tiền</Col>
                        <Col xs={2} md={3} style={{ textAlign: "center" }}>Thao Tác</Col>
                    </Row>
                </div>
            )}

            <div className="order-body">
                {carts.map((item) => {
                    const price = item.detail?.price ?? 0;
                    const lineTotal = price * item.quantity;
                    return (
                        <div key={item.id} style={{ padding: 16, borderBottom: "1px solid #f5f5f5" }}>
                            <Row gutter={[12, 12]} align="middle">
                                <Col xs={24} md={12}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <Checkbox
                                            checked={selectedIds.includes(item.id!)}
                                            onChange={(e) => handleToggleOne(e.target.checked, item.id)}
                                            style={{ marginRight: 8 }}
                                        />
                                        <img
                                            src={`http://localhost:8080/api/v1/images/book/${item.detail?.coverImage}`}
                                            alt={item.detail?.title}
                                            style={{ width: isMobile ? 64 : 72, height: isMobile ? 64 : 72, objectFit: "contain", borderRadius: 6 }}

                                            onClick={() => {
                                                navigate(`/books/${item.id}`)
                                            }}
                                        />
                                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                            <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 420 }}>
                                                {item.detail?.title}
                                            </div>
                                            <div style={{ color: "#8c8c8c", fontSize: 12 }}>Phân Loại Hàng: Mặc định</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={8} md={3} style={{ textAlign: "right" }}>
                                    {currency.format(price)}
                                </Col>
                                <Col xs={12} md={4} style={{ textAlign: "center" }}>
                                    <button
                                        style={{
                                            border: " 1px solid #e5e7eb",
                                            background: " #fafafa",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <MinusOutlined
                                            style={{
                                                padding: "7px",
                                            }}
                                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}

                                        />
                                    </button>
                                    <InputNumber
                                        min={1}
                                        max={item.detail?.stockQuantity}
                                        value={item.quantity}
                                        onChange={(v) => handleUpdateQty(item.id, v)}
                                    />
                                    <button
                                        style={{
                                            // width: "30px",
                                            // height: " 31px",
                                            border: " 1px solid #e5e7eb",
                                            background: " #fafafa",
                                            cursor: "pointer",
                                            // border: "none",

                                            // transition: "all 0.15s ease",
                                        }}
                                    >
                                        <PlusOutlined
                                            style={{
                                                padding: "7px",
                                            }}
                                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                                        />
                                    </button>

                                </Col>
                                <Col xs={8} md={2} style={{ textAlign: "right", color: "#ee4d2d", fontWeight: 600 }}>
                                    {currency.format(lineTotal)}
                                </Col>
                                <Col xs={24} md={3} style={{ textAlign: "center" }}>
                                    <Popconfirm title="Xoá sản phẩm khỏi giỏ?" onConfirm={() => handleRemove(item.id)}>
                                        <Button type="link" danger>Xoá</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                        </div>
                    );
                })}
            </div>

            <Divider style={{ margin: 0 }} />

            <div className="order-summary" style={{ padding: 16, position: "sticky", bottom: 0, background: "#fff", zIndex: 1, boxShadow: "0 -2px 8px rgba(0,0,0,0.04)" }}>
                <Row align="middle" gutter={[12, 12]}>
                    <Col xs={24} md={12} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Checkbox checked={isAllSelected} onChange={(e) => handleToggleAll(e.target.checked)}>
                            Chọn Tất Cả ({carts.length})
                        </Checkbox>
                        {selectedIds.length > 0 && (
                            <Popconfirm title="Xoá các sản phẩm đã chọn?" onConfirm={() => selectedIds.forEach((id) => handleRemove(id))}>
                                <Button type="link" danger>Xoá</Button>
                            </Popconfirm>
                        )}
                    </Col>
                    <Col xs={24} md={12} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16 }}>
                        <div style={{ fontSize: 14 }}>
                            Tổng cộng ({selectedIds.length} Sản phẩm):
                            <span style={{ color: "#ee4d2d", fontWeight: 700, marginLeft: 8 }}>{currency.format(selectedTotal)}</span>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            disabled={selectedIds.length === 0}
                            onClick={() => {
                                localStorage.setItem('checkout_selected_ids', JSON.stringify(selectedIds));
                                navigate('/checkout');
                            }}
                        >
                            Mua Hàng
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default OrderPage;