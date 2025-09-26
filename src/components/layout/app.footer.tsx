const AppFooter = () => {
    return (
        <footer style={{ background: '#f5f5f5', borderTop: '1px solid #e8e8e8' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16 }}>
                    <div>
                        <img src="/logo.png" alt="logo" style={{ height: 32, marginBottom: 8 }} />
                        <div style={{ color: '#666', fontSize: 12 }}>
                            Lầu 5, 387-389 Hai Bà Trưng, Quận 3 TP HCM
                            <br />Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                            <img src="https://via.placeholder.co/80x24" alt="appstore" />
                            <img src="https://via.placeholder.co/80x24" alt="chplay" />
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Dịch vụ</div>
                        <div style={{ color: '#666', fontSize: 12, display: 'grid', gap: 6 }}>
                            <span>Điều khoản sử dụng</span>
                            <span>Chính sách bảo mật</span>
                            <span>Chính sách đổi trả</span>
                            <span>Gửi góp ý</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Hỗ trợ</div>
                        <div style={{ color: '#666', fontSize: 12, display: 'grid', gap: 6 }}>
                            <span>Chính sách vận chuyển</span>
                            <span>Chính sách bảo hành</span>
                            <span>Chính sách khuyến mãi</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Tài khoản của tôi</div>
                        <div style={{ color: '#666', fontSize: 12, display: 'grid', gap: 6 }}>
                            <span>Đăng nhập / Tạo tài khoản</span>
                            <span>Thay đổi thông tin</span>
                            <span>Lịch sử mua hàng</span>
                        </div>
                    </div>
                </div>
                <div style={{ color: '#999', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
                    © {new Date().getFullYear()} HDIT Book Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;


