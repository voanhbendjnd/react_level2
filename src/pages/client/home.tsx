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
    Tabs,
} from "antd";
import ni from "/src/assets/cac-trieu-dai-viet-nam-1066463.jpg";
import "@/styles/homePage.scss";

const HomePage = () => {
    const [form] = Form.useForm();
    const items = [
        { key: "1", label: "Phổ biến", children: <></> },
        { key: "2", label: "Mới nhất", children: <></> },
        { key: "3", label: "Bán chạy", children: <></> },
    ];

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
                            <Checkbox.Group>
                                <Row>
                                    <Col span={24}>
                                        <Checkbox value="A">A</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="B">B</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="C">C</Checkbox>
                                    </Col>
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
                        {Array.from({ length: 12 }).map((_, index) => (
                            <Col key={index} xs={12} sm={8} md={6}>
                                <div className="product-card">
                                    <img src={ni} alt="product" className="product-image" />
                                    <div className="product-title">Tư duy hay</div>
                                    <div className="product-price">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(90343)}
                                    </div>
                                    <div className="product-footer">
                                        <Rate value={5} disabled />
                                        <span className="sold-count">Đã bán 9k</span>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <Divider />
                    <Row justify="center">
                        <Pagination defaultCurrent={1} total={100} responsive />
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default HomePage;
