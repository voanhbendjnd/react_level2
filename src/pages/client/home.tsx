import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
    App,
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    InputNumber,
    Pagination,
    Rate,
    Row,
    Tabs,
    type FormProps,
} from "antd";
import ni from "/src/assets/cac-trieu-dai-viet-nam-1066463.jpg";
import "@/styles/homePage.scss";
import { fetchBooksAPI, getAllCategoriesAPI } from "@/services/api";
import { useEffect, useState } from "react";
import type { UploadFile } from "antd/lib";
type TypeField = {
    title: string;
    price: number;
    sold: number;
    coverImage: UploadFile[];
    totalReviews: number;
}

const HomePage = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
    // const { message, notification } = App.useApp();
    const items = [
        { key: "1", label: "Phổ biến", children: <></> },
        { key: "2", label: "Mới nhất", children: <></> },
        { key: "3", label: "Bán chạy", children: <></> },
    ];
    const [listBook, setListBook] = useState<IBooksTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("")
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

    }
    const onFinish: FormProps<TypeField>['onFinish'] = async (values) => {

    }

    const onChange = (key: string) => {

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
                        <ReloadOutlined title="Reset" className="reset-btn" />
                    </div>
                    <Form form={form} layout="vertical">
                        {/* Danh mục */}
                        <Form.Item name="categories" label="Danh mục sản phẩm">
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
                            <Button type="primary" block className="apply-btn">
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

                {/* Content */}
                <Col md={20} xs={24}>
                    <Tabs defaultActiveKey="1" items={items} />
                    <Row gutter={[20, 20]}>
                        {listBook?.map((item, index) => {
                            return (
                                <Col key={index} xs={12} sm={8} md={6}>
                                    <div className="product-card">
                                        <img src={`http://localhost:8080/api/v1/images/book/${item.coverImage}`} alt="product" className="product-image" />
                                        <div className="product-title">Tư duy hay</div>
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
