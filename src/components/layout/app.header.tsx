import { logoutAPI } from "@/services/api";
import { AliwangwangOutlined, HistoryOutlined, HomeOutlined, LoginOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import { useCurrentApp } from "components/context/app.context";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, type MenuProps, Badge, Popover, Image, Grid, Row, Col } from "antd";
import SearchComponent from "./search.component";

const AppHeader = () => {
    const navigate = useNavigate();
    const { user, setUser, setIsAuthenticated, carts } = useCurrentApp();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens?.md;
    const headerBg = "#d32f2f"; // navy-like background similar to screenshot
    const [open, setOpen] = useState<boolean>(false);
    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem("access_token");
            navigate("/");
        }
    }
    // Style cho các item trong SubMenu (Dropdown)
    // const dropdownTextStyle = {
    //     color: '#ffff', // Màu xám đậm cho chữ dễ đọc trên nền trắng
    // };
    const backendUrl = "http://localhost:8080";
    const textOrder = <div style={{
        display: 'flex',
        justifyContent: "space-between",
        // flexDirection: 'row',
    }}>
        <div>
            Sản phẩm trong giỏ hàng
        </div>
        <div>
            <Link to={"/order"}><ShoppingCartOutlined onClick={() => {
                setOpen(false);
            }} /></Link>

        </div>
    </div>;
    const content = (
        <div style={{ maxWidth: '320px' }}>
            {carts && carts.length > 0 ? (
                <div>
                    {carts.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px solid #f0f0f0',
                            gap: '12px'
                        }}>
                            <Image
                                width={50}
                                height={60}

                                src={`${backendUrl}/api/v1/images/book/${item.detail?.coverImage}`}
                                alt={item.detail?.title}
                                style={{ objectFit: 'cover', borderRadius: '4px' }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                            />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', lineHeight: '1.2' }}>
                                    {item.detail?.title}
                                </p>
                                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>
                                    Số lượng: {item.quantity}
                                </p>
                                <p style={{ margin: '4px 0 0 0', color: '#1890ff', fontWeight: 'bold', fontSize: '13px' }}>
                                    {item.detail?.price?.toLocaleString()} VND
                                </p>
                            </div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                        <span style={{ color: '#999', fontSize: 12 }}>{carts.length} Sản phẩm trong giỏ hàng</span>
                        <Link to={'/order'} onClick={() => setOpen(false)} style={{ background: '#ff4d4f', color: '#fff', padding: '6px 12px', borderRadius: 4 }}>Xem Giỏ Hàng</Link>
                    </div>
                </div>
            ) : (
                <p style={{ margin: 0, textAlign: 'center', color: '#999' }}>Giỏ hàng trống</p>
            )}
        </div>
    );
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
                    label: <Link to={"/my-account"} style={{ color: '#fff' }}>Tài khoản của tôi</Link>
                },
                {
                    label: <Link to={"/order-history"} style={{ color: '#fff' }}>Lịch sử mua hàng</Link>
                },
                // Admin link only for SUPER_ADMIN
                ...(user?.role === "SUPER_ADMIN" ? [{
                    label: <Link to={"/admin"} style={{ color: '#fff' }}>Quản trị viên</Link>
                }] : []),
                {
                    label: <span onClick={() => handleLogout()} style={{ color: '#fff' }}>Đăng xuất</span>

                }
            ]
        }
    ]
    const cartIcon = (
        isMobile ? (
            <Link to={"/books"} style={{ display: 'inline-block', padding: '4px 8px' }}>
                <Badge
                    count={carts?.length ?? 0}
                    size={"small"}
                    showZero>
                    <ShoppingCartOutlined />
                </Badge>
            </Link>
        ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '14px' }}>
                <Popover placement="bottomRight" title={textOrder} content={content} trigger="hover"
                    open={open}
                    onOpenChange={() => {
                        setOpen(!open);
                    }}
                >
                    <Badge
                        count={carts?.length ?? 0}
                        size={"small"}
                        showZero>
                        <ShoppingCartOutlined style={{ color: "white", fontSize: '16px' }} />
                    </Badge>
                </Popover>
                <span>Giỏ hàng</span>
            </div>
        )
    );

    const items = [
        {
            label: <Link to={"/"} style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <HomeOutlined style={{ color: '#fff', fontSize: '16px' }} />
                Trang chủ
            </Link>,
            key: 'home',
        },
        ...(!isMobile && user?.id ?
            [{
                key: 'cart',
                icon: cartIcon
            },
            {
                label: <Link to={'/order-history'} style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                    <HistoryOutlined style={{ color: '#fff', fontSize: '16px' }} />
                    Lịch sử mua hàng
                </Link>,
                key: 'history',
            }
            ]
            : []),
        ...(!user?.id ? [
            {
                label: <Link to={"/login"} style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                    <LoginOutlined style={{ color: '#fff', fontSize: '16px' }} />
                    Đăng nhập
                </Link>,
                key: 'login',
            },

        ] : [{
            label: <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <AliwangwangOutlined style={{ color: '#fff', fontSize: '16px' }} />
                Wellcome, {user.name}
            </span>,
            key: 'SubMenu',
            children: children,
        }]),
        // {
        //     label: (
        //         <Dropdown
        //             trigger={["hover"]}
        //             dropdownRender={() => (
        //                 <div style={{ background: '#fff', padding: 12, width: 680, boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
        //                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        //                         <div>
        //                             <div style={{ fontWeight: 600, marginBottom: 8 }}>Văn học</div>
        //                             <div>Tiểu Thuyết</div>
        //                             <div>Truyện Ngắn - Tản Văn</div>
        //                             <div>Light Novel</div>
        //                             <div>Ngôn Tình</div>
        //                         </div>
        //                         <div>
        //                             <div style={{ fontWeight: 600, marginBottom: 8 }}>Kinh tế</div>
        //                             <div>Nhân Vật - Bài Học Kinh Doanh</div>
        //                             <div>Quản Trị - Lãnh Đạo</div>
        //                             <div>Marketing - Bán Hàng</div>
        //                         </div>
        //                         <div>
        //                             <div style={{ fontWeight: 600, marginBottom: 8 }}>Thiếu nhi</div>
        //                             <div>Manga - Comic</div>
        //                             <div>Kiến Thức Bách Khoa</div>
        //                             <div>Tranh Kỹ Năng Sống</div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             )}
        //         >
        //             <span>Danh mục sản phẩm</span>
        //         </Dropdown>
        //     ),
        //     key: 'category',
        // },
        {
            label: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <SearchComponent
                    placeholder="Bạn muốn tìm kiếm gì?"
                    style={{
                        width: '600px'
                    }}
                />
            </div>,
            key: 'search'
        },
        // Ẩn icon cart trong Menu khi là mobile để tránh trùng với header mobile

    ];

    return (
        <>
            <Row>
                <Col xs={24}>
                    {/* Header cho mobile: chỉ hiển thị search bar */}
                    {isMobile && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: headerBg
                        }}>
                            <div style={{ flex: 1 }}>
                                <SearchComponent
                                    placeholder="Bạn muốn tìm kiếm gì?"
                                    style={{
                                        background: '#ffffff',
                                        borderRadius: 20
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Menu chỉ hiển thị trên desktop */}
                    {!isMobile && (
                        <>
                            <style>
                                {`
                                    .app-menu {
                                        background-color: ${headerBg} !important;
                                        display: flex !important;
                                        justify-content: space-between !important;
                                        align-items: center !important;
                                    }
                                    .app-menu .ant-menu-item {
                                        color: #fff !important;
                                        background-color: ${headerBg} !important;
                                        display: flex !important;
                                        align-items: center !important;
                                        justify-content: center !important;
                                        padding: 0 12px !important;
                                        height: 60px !important;
                                        line-height: 60px !important;
                                        margin: 0 !important;
                                        border: none !important;
                                        flex: 0 0 auto !important;
                                    }
                                    .app-menu .ant-menu-item:hover {
                                        color: #fff !important;
                                        background-color: rgba(255, 255, 255, 0.1) !important;
                                    }
                                    .app-menu .ant-menu-item a {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-item a:hover {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-item span {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-item span:hover {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-submenu {
                                        background-color: ${headerBg} !important;
                                        display: flex !important;
                                        align-items: center !important;
                                        justify-content: center !important;
                                        padding: 0 12px !important;
                                        height: 60px !important;
                                        line-height: 60px !important;
                                        margin: 0 !important;
                                        border: none !important;
                                        flex: 0 0 auto !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup {
                                        background-color: ${headerBg} !important;
                                        border: none !important;
                                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu {
                                        background-color: ${headerBg} !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu-item {
                                        background-color: ${headerBg} !important;
                                        color: #fff !important;
                                        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu-item:hover {
                                        background-color: rgba(255, 255, 255, 0.1) !important;
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu-item a {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu-item a:hover {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu-item span {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu-item span:hover {
                                        color: #fff !important;
                                    }
                                    .app-menu .ant-menu-submenu-popup .ant-menu-item:last-child {
                                        border-bottom: none !important;
                                    }
                                    .app-menu .ant-menu-item[data-menu-id*="search"] {
                                        flex: 2 !important;
                                        justify-content: center !important;
                                        max-width: 800px !important;
                                    }
                                    .app-menu .ant-menu-item[data-menu-id*="home"] {
                                        flex: 0 0 auto !important;
                                        justify-content: flex-start !important;
                                    }
                                    .app-menu .ant-menu-item[data-menu-id*="cart"],
                                    .app-menu .ant-menu-item[data-menu-id*="history"],
                                    .app-menu .ant-menu-item[data-menu-id*="login"],
                                    .app-menu .ant-menu-submenu[data-menu-id*="SubMenu"] {
                                        flex: 0 0 auto !important;
                                        justify-content: flex-end !important;
                                    }
                                `}
                            </style>
                            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    backgroundColor: headerBg,
                                    borderBottom: 'none',
                                    height: '60px',
                                    lineHeight: '60px',
                                    padding: '0 20px',
                                    width: '100%'
                                }}
                                theme="dark"
                                className="app-menu"
                            />
                        </>
                    )}
                </Col>
            </Row>

        </>

    )
}

export default AppHeader;