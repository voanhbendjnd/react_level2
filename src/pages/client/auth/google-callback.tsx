import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { App } from "antd";

const GoogleCallbackPage = () => {
    const { setIsAuthenticated, setUser } = useCurrentApp();
    const { message } = App.useApp();
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra URL parameters để xác định kết quả đăng nhập
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const error = urlParams.get('error');
        const token = urlParams.get('token');
        const userInfo = urlParams.get('user');

        console.log('Google callback params:', { success, error, token, userInfo });

        if (success === 'true' && token && userInfo) {
            try {
                // Parse user info từ URL parameter
                const user = JSON.parse(decodeURIComponent(userInfo));

                // Cập nhật state
                setIsAuthenticated(true);
                setUser(user);
                localStorage.setItem('access_token', token);

                message.success("Đăng nhập Google thành công!");
                navigate("/");
            } catch (error) {
                console.error('Error parsing user info:', error);
                message.error("Có lỗi xảy ra khi xử lý thông tin người dùng");
                navigate("/login");
            }
        } else if (error) {
            message.error(`Đăng nhập Google thất bại: ${error}`);
            navigate("/login");
        } else {
            // Nếu không có thông tin rõ ràng, có thể Spring Security đã xử lý
            // Thử gọi API để lấy thông tin user hiện tại
            const checkAuth = async () => {
                try {
                    const response = await fetch('http://localhost:8080/api/v1/auth/account', {
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.data) {
                            setIsAuthenticated(true);
                            setUser(data.data);
                            message.success("Đăng nhập Google thành công!");
                            navigate("/");
                            return;
                        }
                    }
                } catch (err) {
                    console.error('Failed to check auth status:', err);
                }

                // Nếu không thể xác thực, chuyển về login
                message.error("Không thể xác thực tài khoản Google");
                navigate("/login");
            };

            checkAuth();
        }
    }, [setIsAuthenticated, setUser, message, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '18px'
        }}>
            Đang xử lý đăng nhập Google...
        </div>
    );
};

export default GoogleCallbackPage;
