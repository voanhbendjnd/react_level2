import { logoutAPI } from "@/services/api";
import { AliwangwangOutlined, HistoryOutlined, HomeOutlined, LoginOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import { useCurrentApp } from "components/context/app.context";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Menu, Space, type MenuProps, Badge, Popover, Image, Grid, Row, Col, Dropdown } from "antd";

interface ISearch {
    searchItem: string;
    setSearchItem: (v: string) => void;
}
const AppHeader = (props: ISearch) => {
    const { setSearchItem, searchItem } = props;
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
    const { Search } = Input;
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
                    label: <Link to={"/my-account"}>Tài khoản của tôi</Link>
                },
                {
                    label: <Link to={"/order-history"}>Lịch sử mua hàng</Link>
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

            <Popover placement="bottomRight" title={textOrder} content={content} trigger="click"
                open={open}
                onOpenChange={() => {
                    setOpen(!open);
                }}
            >

                <Badge

                    count={carts?.length ?? 0}
                    size={"small"}
                    showZero>
                    <ShoppingCartOutlined style={{ color: "white" }} />
                </Badge>
            </Popover>
        )
    );

    const items = [
        {
            label: <Link to={"/"}>Trang chủ</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: (
                <Dropdown
                    trigger={["hover"]}
                    dropdownRender={() => (
                        <div style={{ background: '#fff', padding: 12, width: 680, boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Văn học</div>
                                    <div>Tiểu Thuyết</div>
                                    <div>Truyện Ngắn - Tản Văn</div>
                                    <div>Light Novel</div>
                                    <div>Ngôn Tình</div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Kinh tế</div>
                                    <div>Nhân Vật - Bài Học Kinh Doanh</div>
                                    <div>Quản Trị - Lãnh Đạo</div>
                                    <div>Marketing - Bán Hàng</div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Thiếu nhi</div>
                                    <div>Manga - Comic</div>
                                    <div>Kiến Thức Bách Khoa</div>
                                    <div>Tranh Kỹ Năng Sống</div>
                                </div>
                            </div>
                        </div>
                    )}
                >
                    <span>Danh mục sản phẩm</span>
                </Dropdown>
            ),
            key: 'category',
        },
        {
            label: <Space.Compact
                className="hide-on-mobile"
                style={{
                    marginTop: "12px",
                    width: "100vh"
                }}>
                <Search
                    placeholder="Bạn muốn tìm kiếm gì?"
                    allowClear
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    onSearch={(value) => {
                        setSearchItem(value);
                        navigate("/");
                    }}
                />
            </Space.Compact>,
            key: 'search'
        },
        // Ẩn icon cart trong Menu khi là mobile để tránh trùng với header mobile
        ...(!isMobile && user?.id ?
            [{
                key: 'cart',
                icon: cartIcon
            },
            {
                label: <Link to={'/order-history'}>Lịch sử mua hàng</Link>,
                key: 'history',
                icon: <HistoryOutlined />
            }
            ]
            : []),
        ...(!user?.id ? [
            {
                label: <Link to={"/login"}>Đăng nhập</Link>,
                key: 'login',
                icon: <LoginOutlined />,
            },

        ] : [{
            label: `Wellcome, ${user.name}`,
            key: 'SubMenu',
            icon: <AliwangwangOutlined />,
            children: children,
        }]),
    ];

    const handleOnSearch = (values: any) => {
        setSearchItem(values);
    }
    return (
        <>
            <Row>
                <Col xs={24}>
                    {/* Header cho mobile: search + icon */}
                    {isMobile && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 12px',
                            backgroundColor: headerBg
                        }}>
                            <div style={{ flex: 1 }}>
                                <Search
                                    placeholder="Bạn muốn tìm kiếm gì?"
                                    allowClear
                                    style={{
                                        background: '#ffffff',
                                        borderRadius: 20
                                    }}
                                    value={searchItem}
                                    onClick={(values) => {
                                        handleOnSearch(values)
                                    }}
                                    onChange={(e) => setSearchItem(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Link to={"/order"} style={{ display: 'inline-block' }}>
                                    <Badge count={carts?.length ?? 0} size={"small"} showZero>
                                        <ShoppingCartOutlined style={{ fontSize: 20, color: '#fff' }} />
                                    </Badge>
                                </Link>
                                {/* <Link to={user?.id ? (user.role === 'SUPER_ADMIN' ? '/admin' : '/') : '/login'}>
                            <AliwangwangOutlined style={{ fontSize: 20, color: '#fff' }} />
                        </Link> */}
                                <Link to={"/order-history"}>
                                    <HistoryOutlined />
                                </Link>
                            </div>
                        </div>
                    )}

                    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            backgroundColor: headerBg,
                            borderBottom: 'none'
                        }}
                        theme="dark"
                        className="app-menu"
                    />
                </Col>
            </Row>

        </>

    )
}

export default AppHeader;