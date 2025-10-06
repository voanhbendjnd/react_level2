import { useLocation } from 'react-router-dom';
import { HomeOutlined, HistoryOutlined, UserOutlined, LoginOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Badge } from 'antd';

const AppBottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser, setIsAuthenticated, carts, isAuthenticated } = useCurrentApp();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            navigate("/");
        }
    };

    const navItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
            path: '/'
        },
        ...(isAuthenticated ? [
            {
                key: 'order',
                icon: (
                    <Badge count={carts?.length ?? 0} size="small" showZero>
                        <ShoppingCartOutlined />
                    </Badge>
                ),
                label: 'Giỏ hàng',
                path: '/order'
            }] : []),
        ...(isAuthenticated ? [
            {
                key: 'order-history',
                icon: <HistoryOutlined />,
                label: 'Lịch sử',
                path: '/order-history'
            }
        ] : [
        ]),
        ... (isAuthenticated ? [
            {
                key: 'my-account',
                icon: <UserOutlined />,
                label: 'Tài khoản',
                path: '/my-account'
            }
        ] : []),
        ...(user?.id ? [
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
                action: handleLogout
            }
        ] : [
            {
                key: 'login',
                icon: <LoginOutlined />,
                label: 'Đăng nhập',
                path: '/login'
            }
        ])
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderTop: '1px solid #f0f0f0',
            padding: '8px 0',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
        }}>
            {navItems.map((item) => {
                const active = isActive(item.path || '');
                const color = active ? '#ff4d4f' : '#8c8c8c';

                return (
                    <div
                        key={item.key}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            minWidth: '60px',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                            if (item.action) {
                                item.action();
                            } else if (item.path) {
                                navigate(item.path);
                            }
                        }}
                    >
                        <div style={{
                            fontSize: '20px',
                            color: color,
                            marginBottom: '2px',
                            transition: 'color 0.2s ease'
                        }}>
                            {item.icon}
                        </div>
                        <div style={{
                            fontSize: '10px',
                            color: color,
                            fontWeight: active ? 'bold' : 'normal',
                            textAlign: 'center',
                            lineHeight: '1.2',
                            transition: 'color 0.2s ease'
                        }}>
                            {item.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AppBottomNav;
