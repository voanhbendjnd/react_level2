import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    InputNumber,
    Pagination,
    Rate,
    Row,
    Spin,
    Tabs,
    type FormProps,
} from "antd";
import "@/styles/homePage.scss";
import { fetchBooksAPI, getAllCategoriesAPI } from "@/services/api";
import { useEffect, useState } from "react";
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
    const [filter, setFilter] = useState<string>("");
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
        if (filter) {
            query += `&${filter}`;
        }
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
    const handleChangeFilter = (changeValues: any, values: any) => {
        if (changeValues.category) {
            const cate: string[] = values.category;
            if (cate && cate.length > 0) {
                const categoryOrs = cate.map(c => `categories.name~'${c}'`).join(' or ');
                setFilter(`filter=(${categoryOrs})`);
                setCurrent(1);
            }
            else {
                setFilter('');
                setCurrent(1);
            }
        }

    }
    const onFinish: FormProps<TypeField>['onFinish'] = async (values) => {
        const filters: string[] = [];
        const from = values?.range?.from;
        const to = values?.range?.to;
        if (typeof from === 'number' && from >= 0) {
            filters.push(`price>=${from}`);
        }
        if (typeof to === 'number' && to >= 0) {
            filters.push(`price<=${to}`);
        }
        if (values?.category?.length) {
            const categoryOrs = values.category.map((c: string) => `categories.name~'${c}'`).join(' or ');
            filters.push(`(${categoryOrs})`);
        }
        if (filters.length > 0) {
            setFilter(`filter=${filters.join(' and ')}`);
            setCurrent(1);
        } else {
            setFilter('');
            setCurrent(1);
        }
    }


    return (
        <div className="homepage-container">
            <Row gutter={[20, 20]}>

                {/* Sidebar */}
                <Col md={4} sm={24} xs={24} className="homepage-sidebar">
                    <div className="filter-header">
                        <span>
                            <FilterTwoTone /> Bộ lọc tìm kiếm
                        </span>
                        <ReloadOutlined title="Reset" className="reset-btn"
                            onClick={() => {
                                form.resetFields();
                                setFilter('');
                            }} />
                    </div>
                    <Form form={form} layout="vertical"
                        onFinish={onFinish}
                        // cho biết thay đổi thông tin nào trên form
                        onValuesChange={(changedValues, values) => {
                            handleChangeFilter(changedValues, values)
                        }}
                    >
                        {/* Danh mục */}
                        <Form.Item name="category" label="Danh mục sản phẩm">
                            <Checkbox.Group
                                options={categories}
                            >
                                <Row>
                                    {categories?.map((item, index) => {
                                        return (
                                            <Col span={24} key={`index-${index}`}>
                                                <Checkbox value={item.value}>
                                                    {item.label}
                                                </Checkbox>

                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />

                        {/* Khoảng giá */}
                        <Form.Item label="Khoảng giá">
                            <div className="price-range">
                                <Form.Item name={["range", "from"]}>
                                    <InputNumber
                                        min={0}
                                        placeholder="Từ"
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }
                                    />
                                </Form.Item>
                                <span>-</span>
                                <Form.Item name={["range", "to"]}>
                                    <InputNumber
                                        min={0}
                                        placeholder="Đến"
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }
                                    />
                                </Form.Item>
                            </div>
                            <Button type="primary" block className="apply-btn" htmlType="submit">
                                Áp dụng
                            </Button>
                        </Form.Item>
                        <Divider />

                        {/* Đánh giá */}
                        <Form.Item label="Đánh giá">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="rating-filter">
                                    <Rate value={star} disabled />
                                    <span>{star < 5 ? "Trở lên" : ""}</span>
                                </div>
                            ))}
                        </Form.Item>
                    </Form>
                </Col>

                <Spin spinning={isLoading} tip="Loading...">

                </Spin>
                {/* Content */}
                <Col md={20} xs={24}>
                    <Tabs defaultActiveKey="1"

                        items={items}
                        onChange={(value) => {
                            setSortQuery(value)
                        }}
                    />
                    <Row gutter={[20, 20]}>
                        {listBook?.map((item, index) => {
                            return (
                                <Col key={index} xs={12} sm={8} md={6}>
                                    <div className="product-card">
                                        <img src={`http://localhost:8080/api/v1/images/book/${item.coverImage}`} alt="product" className="product-image" />
                                        <div className="product-title">{item.title}</div>
                                        <div className="product-price">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(item.price)}
                                        </div>
                                        <div className="product-footer">
                                            <Rate value={item?.totalPreview ?? 0} disabled />
                                            <span className="sold-count">Đã bán {item?.sold ?? 0}</span>
                                        </div>
                                    </div>
                                </Col>
                            )
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
    );
};

export default HomePage;
