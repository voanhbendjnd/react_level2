import React from 'react';
import { Col, Divider, Row } from "antd";
import { Link } from "react-router-dom";
// Ghi chú: Component này giả định đang chạy trong môi trường React Router
// và Ant Design được tải.

const AppFooter = () => {
    // Chiều rộng tối đa của nội dung
    const MAX_WIDTH = 1800;

    return (
        <footer
            style={{
                background: 'rgb(255, 255, 255)',
                borderTop: '1px solid #e8e8e8'
            }}
            className="p-4 md:p-6" // Padding dọc cho Footer
        >
            <Row
                // Sử dụng Antd Row/Col cho bố cục responsive
                style={{
                    maxWidth: MAX_WIDTH,
                    margin: '0 auto',
                    padding: '16px 0',
                    color: 'black',
                    display: "flex",
                    justifyContent: "center"
                }}
                gutter={[16, 24]} // Khoảng cách giữa các cột (ngang và dọc)
                className="px-4" // *** THÊM PADDING NGANG CHO MOBILE TẠI ĐÂY ***
            >

                {/* 1. Nơi thành lập (Cột rộng 2 phần) */}
                <Col
                    xs={24} // Mobile: chiếm toàn bộ (xếp dọc)
                    md={12} // Tablet/Desktop: chiếm 1 nửa (12/24)
                    lg={8} // Lớn hơn: chiếm 1/3 (8/24)
                    // Thêm margin-bottom chỉ trên mobile để tách mục 1 với mục 2
                    className="md:border-r md:border-gray-200 md:pr-4 mb-6 md:mb-0"
                >
                    <div className="md:pr-4">
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Trụ sở</div>

                        <div style={{ color: 'black', fontSize: 12 }}>
                            Cần Thơ, Việt Nam
                            <Divider style={{ margin: '8px 0' }} />

                            Nhà phân sách số 1 Châu Á
                            <br />
                            Djnd.com.hangni nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống trên toàn quốc.
                        </div>
                    </div>
                </Col>

                {/* 2. Dịch vụ (Cột 1 phần) */}
                <Col
                    xs={24} // Mobile: chiếm toàn bộ (xếp dọc)
                    md={4} // Tablet/Desktop: chiếm 4/24
                    lg={4}
                    // Thêm margin-bottom chỉ trên mobile để tách mục 2 với mục 3
                    className="mb-6 md:mb-0"
                >
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Dịch vụ</div>
                        <div style={{ color: 'black', fontSize: 12, display: 'grid', gap: 6 }}>
                            <span className="hover:text-blue-500 cursor-pointer">Điều khoản sử dụng</span>
                            <span className="hover:text-blue-500 cursor-pointer">Chính sách bảo mật</span>
                            <span className="hover:text-blue-500 cursor-pointer">Chính sách đổi trả</span>
                            <span className="hover:text-blue-500 cursor-pointer">Gửi góp ý</span>
                        </div>
                    </div>
                </Col>

                {/* 3. Hỗ trợ (Cột 1 phần) */}
                <Col
                    xs={24} // Mobile: chiếm toàn bộ (xếp dọc)
                    md={4} // Tablet/Desktop: chiếm 4/24
                    lg={4}
                    // Thêm margin-bottom chỉ trên mobile để tách mục 3 với mục 4
                    className="mb-6 md:mb-0"
                >
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Hỗ trợ</div>
                        <div style={{ color: 'black', fontSize: 12, display: 'grid', gap: 6 }}>
                            <span className="hover:text-blue-500 cursor-pointer">Chính sách vận chuyển</span>
                            <span className="hover:text-blue-500 cursor-pointer">Chính sách bảo hành</span>
                            <span className="hover:text-blue-500 cursor-pointer">Chính sách khuyến mãi</span>
                        </div>
                    </div>
                </Col>

                {/* 4. Tài khoản của tôi (Cột 1 phần) */}
                <Col
                    xs={24} // Mobile: chiếm toàn bộ (xếp dọc)
                    md={4} // Tablet/Desktop: chiếm 4/24
                    lg={4}
                    // Thêm margin-bottom chỉ trên mobile để tách mục 4 với mục Bản quyền
                    className="mb-6 md:mb-0"
                >
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Tài khoản của tôi</div>
                        <div style={{ color: 'black', fontSize: 12, display: 'grid', gap: 6 }}>
                            <Link to={"/login"} className="hover:text-blue-500">Đăng nhập / Tạo tài khoản</Link>
                            <Link to={"/my-account"} className="hover:text-blue-500">Thay đổi thông tin</Link>
                            <Link to={"/order-history"} className="hover:text-blue-500">Lịch sử mua hàng</Link>
                        </div>
                    </div>
                </Col>

                {/* Bản quyền (Luôn chiếm toàn bộ chiều ngang) */}
                <Col xs={24} className="mt-4 pt-4 border-t border-gray-200">
                    <div style={{ color: 'black', fontSize: 12, textAlign: 'center' }}>
                        © {new Date().getFullYear()} DJ Book Store. All rights reserved.
                    </div>
                </Col>

            </Row>
        </footer>
    );
}

export default AppFooter;
