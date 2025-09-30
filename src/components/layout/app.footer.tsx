import { Divider } from "antd";
import { Link } from "react-router-dom";

const AppFooter = () => {
    return (
        <footer style={{ background: 'rgb(255, 255, 255)', borderTop: '1px solid #e8e8e8' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px', color: 'black' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16 }}>
                    <div
                        style={{
                            borderRight: "1px solid black"
                        }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Dịch vụ</div>

                        <div style={{ color: 'black', fontSize: 12, }}>
                            Cần Thơ, Việt Nam
                            <Divider />
                            <br />
                            Nhà phân sách số 1 Việt Nam
                            <br />
                            Cùng nhau chung sức xây dựng cộng đồng đam mê lành mạnh
                        </div>

                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Dịch vụ</div>
                        <div style={{ color: 'black', fontSize: 12, display: 'grid', gap: 6 }}>
                            <span>Điều khoản sử dụng</span>
                            <span>Chính sách bảo mật</span>
                            <span>Chính sách đổi trả</span>
                            <span>Gửi góp ý</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Hỗ trợ</div>
                        <div style={{ color: 'black', fontSize: 12, display: 'grid', gap: 6 }}>
                            <span>Chính sách vận chuyển</span>
                            <span>Chính sách bảo hành</span>
                            <span>Chính sách khuyến mãi</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Tài khoản của tôi</div>
                        <div style={{ color: 'black', fontSize: 12, display: 'grid', gap: 6 }}>
                            <Link to={"/login"}>Đăng nhập / Tạo tài khoản</Link>
                            <Link to={"/my-account"}>Thay đổi thông tin</Link>
                            <Link to={"/order-history"}>Lịch sử mua hàng</Link>
                        </div>
                    </div>
                </div>
                <div style={{ color: 'black', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
                    © {new Date().getFullYear()} DJ Book Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;


