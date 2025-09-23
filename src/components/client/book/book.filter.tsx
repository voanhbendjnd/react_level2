import {
    Button,
    Checkbox,
    Col,
    Divider,
    Drawer,
    Form,
    InputNumber,
    Rate,
    Row,
} from "antd";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    categories: { label: string; value: string }[];
    onFinish: any;
    handleChangeFilter: any;
    rating: any;
    setRating: (v: any) => void;
    buildAndSetFilter: (v: any, r: number | null) => void;
}
export const ModalFilter = (props: IProps) => {
    const [form] = Form.useForm();
    const { isOpen, setIsOpen, categories, onFinish, handleChangeFilter, rating, setRating, buildAndSetFilter } = props
    return (
        <Drawer
            title="Filter"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={() => setIsOpen(false)}
            open={isOpen}
            width={"60vw"}
        >
            <Form>
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
                            <span
                                style={{
                                    marginBottom: "25px"
                                }}
                            >-</span>
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
                        <Button type="primary" block className="apply-btn" htmlType="submit"
                            style={{
                                width: "40%"
                            }}>
                            Áp dụng
                        </Button>
                    </Form.Item>
                    <Divider />

                    {/* Đánh giá */}
                    <Form.Item label="Đánh giá">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div
                                key={star}
                                className="rating-filter"
                                onClick={() => {
                                    const newRating = rating === star ? null : star;
                                    setRating(newRating);
                                    const currentValues = form.getFieldsValue(true);
                                    buildAndSetFilter(currentValues, newRating);
                                }}
                                style={{ cursor: 'pointer', fontWeight: rating === star ? 600 : 400 }}
                            >
                                <Rate value={star} disabled />
                                <span>{star < 5 ? "Trở lên" : ""}</span>
                            </div>
                        ))}
                    </Form.Item>
                </Form>

            </Form>

        </Drawer>
    )
}