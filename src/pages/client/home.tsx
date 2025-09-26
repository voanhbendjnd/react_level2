import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Divider,
    Form,
    InputNumber,
    Pagination,
    Row,
    Tabs,
    type FormProps,
    Select,
} from "antd";
import "@/styles/homePage.scss";
import HomeLoader from "./home.loader";
import { fetchBooksAPI, getAllCategoriesAPI } from "@/services/api";
import { useEffect, useMemo, useState } from "react";
import { Carousel, Card } from "antd";
import bannerHome from "/src/assets/banner-home.png";
import bannerSliderFirst from "/src/assets/bannerSlider.png";
import bannerSliderSecond from "/src/assets/bannerSliderSecond.png";

import { useNavigate } from "react-router-dom";
import { ModalFilter } from "@/components/client/book/book.filter";
type TypeField = {
    range: {
        from: number;
        to: number;
    }
    category: string[]
}

const HomePage = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
    // const { message, notification } = App.useApp();
    const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const items = [
        { key: "sort=sold,desc", label: "Phổ biến", children: <></> },
        { key: "sort=updatedAt,desc", label: "Mới nhất", children: <></> },
        { key: "sort=price,asc", label: "Giá thấp tới cao", children: <></> },
        { key: "sort=price,desc", label: "Giá cao tới thấp", children: <></> },

    ];
    const [listBook, setListBook] = useState<IBooksTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rating, setRating] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>("");
    const navigate = useNavigate();
    const [sortQuery, setSortQuery] = useState<string>("sort=stockQuantity,desc")
    useEffect(() => {
        const getCategories = async () => {
            const res = await getAllCategoriesAPI();
            if (res && res.data) {
                const cate = res.data.map(x => ({
                    label: x,
                    value: x
                }));
                setCategories(cate);
            }
        }
        getCategories();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery])
    const fetchBook = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}`
        // if (filter) {
        query += `&filter=${filter}`;
        query += `&filter=active:true`;

        // }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await fetchBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }
    const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }
    const buildAndSetFilter = (values: any, selectedRating: number | null) => {
        const filters: string[] = [];
        const from = values?.range?.from;
        const to = values?.range?.to;
        filters.push(`active:true`)
        const cate: string[] = values?.category ?? [];
        if (Array.isArray(cate) && cate.length > 0) {
            const categoryOrs = cate.map(c => `categories.name~'${c}'`).join(' or ');
            filters.push(`(${categoryOrs})`);
        }
        if (typeof from === 'number' && from >= 0) {
            filters.push(`price>=${from}`);
        }
        if (typeof to === 'number' && to >= 0) {
            filters.push(`price<=${to}`);
        }
        if (typeof selectedRating === 'number' && selectedRating > 0) {
            filters.push(`totalReviews>=${selectedRating}`);
        }
        if (filters.length > 0) {
            setFilter(`${filters.join(' and ')}`);
        } else {
            setFilter('');
        }
        setCurrent(1);
    }

    const handleChangeFilter = (changeValues: any, values: any) => {
        if (changeValues.category || changeValues.range) {
            buildAndSetFilter(values, rating);
        }
    }
    const onFinish: FormProps<TypeField>['onFinish'] = async (values) => {
        buildAndSetFilter(values, rating);
    }


    return (
        <>    <div className="homepage-container">
            {isLoading && <HomeLoader />}
            <Row gutter={[20, 20]}>

                {/* Sidebar hidden by default; use filter modal instead */}
                <Col md={0} sm={0} xs={0} className="homepage-sidebar" />

                {/* Content */}
                <Col md={24} xs={24}>
                    {/* Banner carousel */}
                    <div style={{ marginBottom: 16 }}>
                        <Carousel autoplay autoplaySpeed={3000} dots>
                            <div>
                                <img src={bannerSliderFirst} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
                            </div>
                            <div>
                                <img src={bannerSliderSecond} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
                            </div>
                        </Carousel>
                    </div>

                    {/* Utilities grid */}
                    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                        {[
                            { label: 'Deal Từ 1.000đ' },
                            { label: 'Shopee Xử Lý' },
                            { label: 'Deal Hot Giờ Vàng' },
                            { label: 'Voucher 30%' },
                            { label: 'Mã Giảm Giá' },
                            { label: 'Khách Hàng Thân Thiết' },
                        ].map((u, idx) => (
                            <Col xs={8} md={4} key={idx}>
                                <Card hoverable style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 32 }}>🛍️</div>
                                    <div style={{ marginTop: 8 }}>{u.label}</div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Promotional Banner Section */}
                    <div style={{ marginBottom: 24 }}>
                        {/* Banner Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                            borderRadius: '8px 8px 0 0',
                            padding: '20px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\' fill=\'white\' opacity=\'0.3\'/%3E%3Ccircle cx=\'80\' cy=\'40\' r=\'1\' fill=\'white\' opacity=\'0.3\'/%3E%3Ccircle cx=\'40\' cy=\'80\' r=\'1\' fill=\'white\' opacity=\'0.3\'/%3E%3C/svg%3E")',
                                backgroundSize: '50px 50px'
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                                <div>
                                    <h2 style={{
                                        color: 'white',
                                        margin: 0,
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        Vui Hội Trăng Rằm
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0', fontSize: '14px' }}>
                                        Đèn lồng trung thu đặc sắc
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ fontSize: '48px' }}>🦉</div>
                                    <div style={{ fontSize: '48px' }}>🌕</div>
                                </div>
                            </div>
                        </div>

                        {/* Product Cards Row */}
                        <div style={{
                            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                            borderRadius: '0 0 8px 8px',
                            padding: '20px',
                            border: '1px solid #e2e8f0',
                            borderTop: 'none'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                overflowX: 'auto',
                                paddingBottom: '8px',
                                scrollbarWidth: 'thin'
                            }}>
                                {listBook?.slice(0, 5).map((item, idx) => {
                                    // Generate a color based on the book's ID for consistent coloring
                                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                                    const cardColor = colors[idx % colors.length];

                                    return (
                                        <div key={idx} style={{
                                            minWidth: '200px',
                                            background: 'white',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            border: '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            onClick={() => navigate(`/books/${item.id}`)}
                                        >
                                            {/* Gift Badge */}
                                            {idx < 2 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '8px',
                                                    background: '#dc2626',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    zIndex: 1
                                                }}>
                                                    TẶNG 03 PIN CÚC
                                                </div>
                                            )}

                                            {/* Product Image */}
                                            <div style={{
                                                height: '120px',
                                                background: '#f8fafc',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '12px',
                                                overflow: 'hidden'
                                            }}>
                                                <img
                                                    src={`http://localhost:8080/api/v1/images/book/${item.coverImage}`}
                                                    alt={item.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        borderRadius: '6px'
                                                    }}
                                                />
                                            </div>

                                            {/* Color Gradient Bar */}
                                            <div style={{
                                                height: '4px',
                                                background: `linear-gradient(90deg, ${cardColor} 0%, ${cardColor}80 50%, ${cardColor}40 100%)`,
                                                borderRadius: '2px',
                                                marginBottom: '12px'
                                            }} />

                                            {/* Product Info */}
                                            <div style={{ fontSize: '12px', lineHeight: '1.4', marginBottom: '8px', color: '#374151' }}>
                                                {item.title}
                                            </div>

                                            {/* Price */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '16px' }}>
                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                                                </span>
                                                <span style={{
                                                    background: '#dc2626',
                                                    color: 'white',
                                                    padding: '1px 4px',
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    -{Math.floor(Math.random() * 50 + 10)}%
                                                </span>
                                            </div>

                                            {/* Original Price */}
                                            <div style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'line-through', marginBottom: '8px' }}>
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * 1.3)}
                                            </div>

                                            {/* Sales Count */}
                                            <div style={{ color: '#6b7280', fontSize: '11px' }}>
                                                Đã bán {item?.sold ?? 0}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* View More Button */}
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Button
                                    style={{
                                        border: '1px solid #dc2626',
                                        color: '#dc2626',
                                        background: 'white',
                                        borderRadius: '6px',
                                        padding: '8px 24px',
                                        fontWeight: '500'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#dc2626';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = '#dc2626';
                                    }}
                                >
                                    Xem Thêm
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                        <Button onClick={() => setShowFilter(v => !v)} icon={<FilterTwoTone />}>
                            {showFilter ? 'Ẩn bộ lọc' : 'Lọc'}
                        </Button>
                    </div>
                    {/* Horizontal Filter Row */}
                    {showFilter && (
                        <div style={{
                            background: '#fff',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} sm={12} md={6}>
                                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Danh mục</div>
                                    <Select
                                        placeholder="Chọn danh mục"
                                        style={{ width: '100%' }}
                                        allowClear
                                        onChange={(value) => {
                                            const currentValues = form.getFieldsValue(true);
                                            const newValues = { ...currentValues, category: value ? [value] : [] };
                                            buildAndSetFilter(newValues, rating);
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <Select.Option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Khoảng giá</div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <InputNumber
                                            min={0}
                                            step={10000}
                                            placeholder="Từ"
                                            style={{ width: '100%' }}
                                            onChange={(val) => {
                                                const currentValues = form.getFieldsValue(true);
                                                const newValues = {
                                                    ...currentValues,
                                                    range: { from: Number(val) || 0, to: currentValues?.range?.to || 0 }
                                                };
                                                buildAndSetFilter(newValues, rating);
                                            }}
                                        />
                                        <span>-</span>
                                        <InputNumber
                                            min={0}
                                            step={10000}
                                            placeholder="Đến"
                                            style={{ width: '100%' }}
                                            onChange={(val) => {
                                                const currentValues = form.getFieldsValue(true);
                                                const newValues = {
                                                    ...currentValues,
                                                    range: { from: currentValues?.range?.from || 0, to: Number(val) || 0 }
                                                };
                                                buildAndSetFilter(newValues, rating);
                                            }}
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Đánh giá</div>
                                    <Select
                                        placeholder="Chọn đánh giá"
                                        style={{ width: '100%' }}
                                        allowClear
                                        onChange={(value) => {
                                            setRating(value);
                                            const currentValues = form.getFieldsValue(true);
                                            buildAndSetFilter(currentValues, value);
                                        }}
                                    >
                                        <Select.Option value={5}>5 sao</Select.Option>
                                        <Select.Option value={4}>4 sao trở lên</Select.Option>
                                        <Select.Option value={3}>3 sao trở lên</Select.Option>
                                        <Select.Option value={2}>2 sao trở lên</Select.Option>
                                        <Select.Option value={1}>1 sao trở lên</Select.Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Button
                                        type="default"
                                        icon={<ReloadOutlined />}
                                        onClick={() => {
                                            form.resetFields();
                                            setFilter('');
                                            setRating(null);
                                        }}
                                        style={{ marginTop: 20 }}
                                    >
                                        Reset
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )}
                    <Tabs defaultActiveKey="1"

                        items={items}
                        onChange={(value) => {
                            setSortQuery(value)
                        }}
                    />
                    <Col xs={24} md={0}>
                        <div>
                            <span onClick={() => setIsOpenFilterModal(true)}>
                                <FilterTwoTone />
                                <span>
                                    Lọc
                                </span>
                            </span>
                        </div>
                    </Col>
                    {/* Ensure rows filled to 6 items */}
                    <Row gutter={[12, 16]}>
                        {useMemo(() => {
                            const data = [...listBook];
                            while (data.length % 6 !== 0 && data.length > 0) {
                                data.push({} as any);
                            }
                            return data;
                        }, [listBook]).map((item: any, index: number) => {
                            const isPlaceholder = !item || !item.id;
                            const card = (
                                <Col key={`card-${index}`} xs={12} sm={8} md={4} lg={4} xl={4} xxl={4}>
                                    <div
                                        style={{
                                            background: '#fff',
                                            borderRadius: '6px',
                                            border: '1px solid #e8e8e8',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative'
                                        }}
                                        onClick={() => { if (!isPlaceholder) navigate(`/books/${item.id}`) }}
                                        onMouseEnter={(e) => {
                                            if (isPlaceholder) return;
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                            e.currentTarget.style.borderColor = '#d32f2f';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = '#e8e8e8';
                                        }}
                                    >
                                        {/* Discount Badge */}
                                        {!isPlaceholder && (<div style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: '#d32f2f',
                                            color: '#fff',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            zIndex: 1
                                        }}>
                                            -{Math.floor(Math.random() * 50 + 10)}%
                                        </div>)}

                                        {/* Image Container */}
                                        <div style={{
                                            width: '100%',
                                            height: '160px',
                                            background: '#fafafa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '12px',
                                            borderBottom: '1px solid #f0f0f0'
                                        }}>
                                            {!isPlaceholder ? (<img
                                                src={`http://localhost:8080/api/v1/images/book/${item.coverImage}`}
                                                alt="product"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: '3px'
                                                }}
                                            />) : (
                                                <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                marginBottom: '8px',
                                                lineHeight: '1.3',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                color: '#333',
                                                minHeight: '34px'
                                            }}>
                                                {!isPlaceholder ? item.title : ''}
                                            </div>

                                            <div style={{ marginBottom: '6px' }}>
                                                <span style={{
                                                    color: '#d32f2f',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px'
                                                }}>
                                                    {!isPlaceholder ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price) : ''}
                                                </span>
                                            </div>

                                            <div style={{
                                                color: '#999',
                                                fontSize: '11px',
                                                textDecoration: 'line-through',
                                                marginBottom: '8px'
                                            }}>
                                                {!isPlaceholder ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * 1.3) : ''}
                                            </div>

                                            {/* Sales Progress */}
                                            <div style={{ marginTop: 'auto' }}>
                                                <div style={{
                                                    fontSize: '11px',
                                                    color: '#666',
                                                    marginBottom: '3px'
                                                }}>
                                                    {!isPlaceholder ? <>Đã bán {item?.sold ?? 0}</> : ''}
                                                </div>
                                                <div style={{
                                                    width: '100%',
                                                    height: '3px',
                                                    background: !isPlaceholder && (item?.sold ?? 0) > 0 ? '#d32f2f' : '#e0e0e0',
                                                    borderRadius: '2px'
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            );
                            const elements: any[] = [card];
                            if ((index + 1) % 6 === 0) {
                                elements.push(
                                    <Col span={24} key={`banner-${index}`}>
                                        <img src={bannerHome} alt="banner" style={{ width: '100%', borderRadius: 6, marginTop: '8px' }} />
                                    </Col>
                                );
                            }
                            return elements;
                        })}
                    </Row>
                    <Divider />
                    <Row justify="center">
                        <Pagination
                            current={current}
                            total={total}
                            pageSize={pageSize}

                            responsive
                            onChange={(p, s) => handleOnChangePage({ current: p, pageSize: s })}
                        />
                    </Row>
                </Col>
            </Row>
        </div>
            <ModalFilter
                isOpen={isOpenFilterModal}
                setIsOpen={setIsOpenFilterModal}
                handleChangeFilter={handleChangeFilter}
                categories={categories}
                onFinish={onFinish}
                rating={rating}
                setRating={setRating}
                buildAndSetFilter={buildAndSetFilter}
            />
        </>


    );
};

export default HomePage;
