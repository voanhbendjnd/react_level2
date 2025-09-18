import { Children, useState } from 'react';
import {
    BookOutlined,
    IdcardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    ShopOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { App, Avatar, Button, Dropdown, Layout, Menu, Result, theme } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';
import { ClimbingBoxLoader } from 'react-spinners';
import { logoutAPI } from '@/services/api';

const { Header, Sider } = Layout;
const AdminPage = () => {
    const { message } = App.useApp();
    const { isAppLoading, isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();
    const [collapsed, setCollapsed] = useState(false);
    const avatarURL = `http://localhost:8080/api/v1/images/user/${user?.avatar}`
    const navigate = useNavigate();
    const logout = async () => {
        const res = await logoutAPI();
        if (res) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem("access_token")
            message.success("Đăng xuất thành công")
            navigate('/')
        }
    }
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
                                        label: <Link to={"/admin/user"}>CRUD</Link>,
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
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                            <div>
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
                            </div>
                            <Dropdown menu={{
                                items: [{
                                    icon: <SettingOutlined />,

                                    key: '',
                                    label: 'Cài đặt',
                                }, {
                                    key: 'logout',
                                    label: (
                                        <div
                                            onClick={logout}
                                        >
                                            <LogoutOutlined

                                            />,
                                            Đăng xuất
                                        </div>
                                    )
                                }
                                ]
                            }} trigger={['click']}>
                                <div
                                    style={{
                                        alignItems: "center",
                                        marginRight: "20px",
                                        cursor: 'pointer' // Thêm cursor để người dùng biết có thể click
                                    }}>
                                    <Avatar size={40}
                                        src={avatarURL}
                                        style={{ marginRight: "10px" }}
                                    >USER</Avatar>
                                    {user?.name}
                                </div>
                            </Dropdown>

                        </div>


                    </Header>
                    <Outlet />
                </Layout>
            </Layout>
        </div>


    );
}

export default AdminPage;