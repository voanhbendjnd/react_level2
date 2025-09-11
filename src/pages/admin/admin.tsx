import { useState } from 'react';
import {
    BookOutlined,
    IdcardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ShopOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Result, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';
import { ClimbingBoxLoader } from 'react-spinners';

const { Header, Sider } = Layout;
const AdminPage = () => {
    const { isAppLoading, isAuthenticated, user } = useCurrentApp();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    if (!isAppLoading) {
        if (!isAuthenticated || user?.role !== "SUPER_ADMIN") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập"
                    extra={<Button type="primary">
                        <Link to={"/"}>
                            Quay lại trang chủ
                        </Link>
                    </Button>}
                />
            )
        }
    }
    else {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}
            >
                <ClimbingBoxLoader
                    size={15}
                    color='#ccc' />
            </div>
        )
    }


    return (

        <div>
            <Layout style={{
                minHeight: '100vh',
            }}>
                <Sider trigger={null} collapsible collapsed={collapsed}
                    theme='light'
                    width={250} // Thêm thuộc tính width vào đây
                // collapsedWidth={1} // Bạn có thể tùy chỉnh chiều rộng khi thu gọn
                >
                    <div className="demo-logo-vertical"
                    />
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[
                            {
                                icon: <UserOutlined />,

                                key: 'admin',
                                label: 'Admin',
                            },
                            {
                                icon: <IdcardOutlined />,
                                key: 'dashboard',
                                label: 'Dashboard',
                            },
                            {
                                key: 'user',
                                icon: <VideoCameraOutlined />,
                                label: "Quản lý người dùng",
                                children: [
                                    {
                                        key: "user-crud",
                                        label: "CRUD",
                                        icon: <UserOutlined />,
                                    }
                                ]
                            },
                            {
                                key: 'book',
                                icon: <BookOutlined />,
                                label: "Quản lý sách"
                            },
                            {
                                key: 'order',
                                icon: <ShopOutlined />,
                                label: "Quản lý đơn hàng"
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <Outlet />
                </Layout>
            </Layout>
        </div>


    );
}

export default AdminPage;