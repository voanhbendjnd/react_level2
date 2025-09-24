import { logoutAPI } from "@/services/api";
import { AliwangwangOutlined, HomeOutlined, LoginOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import { useCurrentApp } from "components/context/app.context";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Menu, Space, type MenuProps } from "antd";


const AppHeader = () => {
    const navigate = useNavigate();
    const { user, setUser, setIsAuthenticated } = useCurrentApp();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem("access_token");
            navigate("/");
        }
    }
    const { Search } = Input;

    const [current, setCurrent] = useState("");
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    }
    const location = useLocation();// hiển thị trang đang đứng khi F5
    // render lại trang và đồng thời hiện trạng thái đang ở trang nào
    useEffect(() => {
        if (location && location.pathname) {
            const allRoutes = ["users", "books"];
            const currentRoute = allRoutes.find(item => `/${item}` === location.pathname);
            if (currentRoute) {
                setCurrent(currentRoute);
            }
            else {
                setCurrent("home")
            }
        }

    }, [location]);
    const children = [
        {
            type: 'group',
            children: [
                {
                    label: <span>Quản lý tài khoản</span>
                },
                {
                    label: <span>Lịch sử mua hàng</span>
                },
                // Admin link only for SUPER_ADMIN
                ...(user?.role === "SUPER_ADMIN" ? [{
                    label: <Link to={"/admin"}>Quản trị viên</Link>
                }] : []),
                {
                    label: <span onClick={() => handleLogout()}>Đăng xuất</span>

                }
            ]
        }
    ]
    const items = [
        {
            label: <Link to={"/"}>Home</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: <Space.Compact
                className="hide-on-mobile"
                style={{
                    marginTop: "12px",
                    width: "100vh"
                }}>
                <Search placeholder="Bạn muốn tìm kiếm gì?" allowClear />
            </Space.Compact>,
            key: 'search'
        },
        ...(user?.id ?
            [{
                label: <Link to={"/books"}>Cart</Link>,
                key: 'cart',
                icon: <ShoppingCartOutlined />
            }]
            : []),
        ...(!user?.id ? [
            {
                label: <Link to={"/login"}>Đăng nhập</Link>,
                key: 'login',
                icon: <LoginOutlined />,
            }] : [{
                label: `Wellcome, ${user.name}`,
                key: 'SubMenu',
                icon: <AliwangwangOutlined />,
                children: children,
            }]),
    ];

    return (
        <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}
                style={{
                    display: "flex", justifyContent: "center"
                }}
            />
            {/* Mobile search below header */}
            <div className="header-search-mobile">
                <Search placeholder="Bạn muốn tìm kiếm gì?" allowClear enterButton />
            </div>
        </>

    )
}

export default AppHeader;