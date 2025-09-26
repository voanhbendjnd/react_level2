import { CheckCircleTwoTone, HomeOutlined, ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ThanksPage = () => {
    const navigate = useNavigate();
    return (
        <div style={{ background: "#fff", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Result
                icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                status="success"
                title="Cảm ơn bạn đã mua hàng!"
                subTitle="Đơn hàng của bạn đã được tạo thành công. Chúng tôi sẽ sớm xử lý và giao đến bạn."
                extra={[
                    <Button key="home" type="primary" icon={<HomeOutlined />} onClick={() => navigate("/")}>Về trang chủ</Button>,
                    <Button key="cart" icon={<ShoppingCartOutlined />} onClick={() => navigate("/order")}>Xem giỏ hàng</Button>,
                    <Button key="shop" icon={<ShopOutlined />} onClick={() => navigate("/")}>Tiếp tục mua sắm</Button>,
                ]}
            />
        </div>
    );
};

export default ThanksPage;

