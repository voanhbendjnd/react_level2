import { Col, Row, Skeleton } from 'antd';

export const BookLoader = () => {
    return (
        <div className="product-detail" role="status" aria-live="polite">
            <div className="pd-container">
                <div className="pd-card">
                    <Row gutter={[20, 20]} align="top">
                        {/* Left: Gallery (desktop/tablet) */}
                        <Col md={10} sm={10} xs={24} className="pd-gallery">
                            {/* Main image */}
                            <Skeleton.Input
                                active
                                block
                                aria-label="Đang tải hình ảnh sản phẩm"
                                style={{ width: '100%', height: 420, borderRadius: 10 }}
                            />
                            {/* Thumbnails */}
                            <Row gutter={[12, 12]} style={{ marginTop: 10 }}>
                                <Col span={8}>
                                    <Skeleton.Image style={{ width: '100%', height: 72, borderRadius: 8 }} active />
                                </Col>
                                <Col span={8}>
                                    <Skeleton.Image style={{ width: '100%', height: 72, borderRadius: 8 }} active />
                                </Col>
                                <Col span={8}>
                                    <Skeleton.Image style={{ width: '100%', height: 72, borderRadius: 8 }} active />
                                </Col>
                            </Row>
                        </Col>

                        {/* Right: Info */}
                        <Col md={14} sm={14} xs={24} className="pd-info">
                            {/* Mobile-only gallery (no thumbnails) */}
                            <Col md={0} sm={24} xs={24} className="pd-gallery--mobile">
                                <Skeleton.Input
                                    active
                                    block
                                    aria-label="Đang tải hình ảnh sản phẩm"
                                    style={{ width: '100%', height: 300, borderRadius: 10 }}
                                />
                            </Col>

                            <Col span={24}>
                                {/* Brand/author */}
                                <div className="pd-brand">
                                    <Skeleton.Input active style={{ width: 140, height: 12 }} />
                                </div>

                                {/* Title */}
                                <div className="pd-title">
                                    <Skeleton.Input active block style={{ height: 22 }} />
                                </div>

                                {/* Meta: rating + sold */}
                                <div className="pd-meta">
                                    <Skeleton.Input active style={{ width: 120, height: 16 }} />
                                    <span className="pd-sold" style={{ marginLeft: 8 }}>
                                        <Skeleton.Input active style={{ width: 120, height: 16 }} />
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="pd-price" style={{ display: 'inline-block', width: '100%' }}>
                                    <Skeleton.Input active block style={{ height: 28 }} />
                                </div>

                                {/* Shipping */}
                                <div className="pd-ship">
                                    <span className="label">
                                        <Skeleton.Input active style={{ width: 80, height: 14 }} />
                                    </span>
                                    <span className="value" style={{ flex: 1 }}>
                                        <Skeleton.Input active block style={{ height: 14 }} />
                                    </span>
                                </div>

                                {/* Quantity */}
                                <div className="pd-qty">
                                    <span className="label">
                                        <Skeleton.Input active style={{ width: 80, height: 14 }} />
                                    </span>
                                    <span className="qty-controls" style={{ display: 'inline-flex', gap: 8 }}>
                                        <Skeleton.Button active style={{ width: 36, height: 36, borderRadius: 6 }} />
                                        <Skeleton.Input active style={{ width: 56, height: 36, borderRadius: 6 }} />
                                        <Skeleton.Button active style={{ width: 36, height: 36, borderRadius: 6 }} />
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="pd-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    <Skeleton.Button active style={{ width: 180, height: 44, borderRadius: 8 }} />
                                    <Skeleton.Button active style={{ width: 120, height: 44, borderRadius: 8 }} />
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <span style={{ position: 'absolute', left: -9999 }}>
                Đang tải chi tiết sản phẩm
            </span>
        </div>
    )
}