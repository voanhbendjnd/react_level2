import { Col, Row, Skeleton } from "antd";

export const HomeLoader = () => {
    const productPlaceholders = Array.from({ length: 8 });

    return (
        <div className="homepage-container" role="status" aria-live="polite">
            <Row gutter={[20, 20]}>
                {/* Sidebar (desktop/tablet) */}
                <Col md={4} sm={0} xs={0} className="homepage-sidebar">
                    <div className="filter-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Skeleton.Input active style={{ width: 140, height: 16 }} />
                        <Skeleton.Button active style={{ width: 28, height: 28, borderRadius: 6 }} />
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Skeleton.Input active style={{ width: 120, height: 14, marginBottom: 12 }} />
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <Skeleton.Button active style={{ width: 18, height: 18, borderRadius: 4 }} />
                                <Skeleton.Input active style={{ width: "70%", height: 14 }} />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Skeleton.Input active style={{ width: 120, height: 14, marginBottom: 12 }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <Skeleton.Input active style={{ width: 90, height: 32, borderRadius: 6 }} />
                            <Skeleton.Input active style={{ width: 12, height: 14 }} />
                            <Skeleton.Input active style={{ width: 90, height: 32, borderRadius: 6 }} />
                        </div>
                        <Skeleton.Button active style={{ height: 36, borderRadius: 8, width: 120 }} />
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Skeleton.Input active style={{ width: 120, height: 14, marginBottom: 12 }} />
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <Skeleton.Avatar active shape="square" size={16} />
                                <Skeleton.Input active style={{ width: 120, height: 14 }} />
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Content */}
                <Col md={20} xs={24}>
                    {/* Tabs skeleton */}
                    <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
                        <Skeleton.Button active style={{ width: 100, height: 36, borderRadius: 999 }} />
                        <Skeleton.Button active style={{ width: 100, height: 36, borderRadius: 999 }} />
                        <Skeleton.Button active style={{ width: 140, height: 36, borderRadius: 999 }} />
                        <Skeleton.Button active style={{ width: 140, height: 36, borderRadius: 999 }} />
                    </div>

                    {/* Mobile filter trigger skeleton */}
                    <Col xs={24} md={0} style={{ marginBottom: 12 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <Skeleton.Avatar active shape="circle" size={20} />
                            <Skeleton.Input active style={{ width: 60, height: 16 }} />
                        </div>
                    </Col>

                    {/* Product grid skeleton */}
                    <Row gutter={[20, 20]}>
                        {productPlaceholders.map((_, idx) => (
                            <Col key={idx} xs={12} sm={8} md={6}>
                                <div className="product-card">
                                    <Skeleton.Image style={{ width: "100%", height: 180, borderRadius: 10 }} active />
                                    <div style={{ marginTop: 10 }}>
                                        <Skeleton.Input active block style={{ height: 16 }} />
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        <Skeleton.Input active style={{ width: "60%", height: 16 }} />
                                    </div>
                                    <div className="product-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                                        <Skeleton.Input active style={{ width: 80, height: 16 }} />
                                        <Skeleton.Input active style={{ width: 90, height: 16 }} />
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <span style={{ position: "absolute", left: -9999 }}>Đang tải danh sách sản phẩm</span>
        </div>
    );
}

export default HomeLoader;