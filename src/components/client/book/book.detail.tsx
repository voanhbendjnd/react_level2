import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Divider, Rate, Row } from "antd";
import { useRef, useState } from "react"
import { BsCartPlus } from "react-icons/bs";
import ReactImageGallery from "react-image-gallery";
import ModalGallery from "./modal.gallery";
import "@/styles/productDetail.scss";
import "react-image-gallery/styles/css/image-gallery.css";


const BookDetailHome = () => {
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef<ReactImageGallery>(null);

    const images = [
        {
            original: "https://picsum.photos/id/1018/1000/600/",
            thumbnail: "https://picsum.photos/id/1018/250/150/",
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
            thumbnail: "https://picsum.photos/id/1015/250/150/",
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
        },
    ];
    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    }
    return (
        <div className="product-detail">
            <div className="pd-container">
                <div className="pd-card">
                    <Row gutter={[20, 20]} align="top">
                        {/* laptop pc */}
                        <Col md={10} sm={10} xs={24} className="pd-gallery">
                            <ReactImageGallery
                                ref={refGallery}
                                items={images}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                renderLeftNav={() => <></>} // thanh chuyển ảnh
                                renderRightNav={() => <></>}
                                slideOnThumbnailOver={true}
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        {/* phone */}
                        <Col md={14} sm={24} className="pd-info">
                            <Col md={0} sm={24} xs={24} className="pd-gallery--mobile">
                                <ReactImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>} // thanh chuyển ảnh
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className="pd-brand">Tác giả: <a href="#">Sukuna</a></div>
                                <div className="pd-title">Luna and sunny summer</div>
                                <div className="pd-meta">
                                    <Rate value={5} disabled />
                                    <span className="pd-sold">
                                        <Divider type="vertical" />
                                        Đã bán 1107 cuốn
                                    </span>
                                </div>
                                <div className="pd-price">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(11072005)}
                                </div>
                                <div className="pd-ship">
                                    <span className="label">Vận chuyển</span>
                                    <span className="value">Miễn phí vận chuyển cho đơn 100k</span>
                                </div>
                                <div className="pd-qty">
                                    <span className="label">Số lượng</span>
                                    <span className="qty-controls">
                                        <button className="btn-qty"><MinusOutlined /></button>
                                        <input className="qty-input" defaultValue={1} />
                                        <button className="btn-qty"><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className="pd-actions">
                                    <button className="btn add-cart">
                                        <BsCartPlus />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className="btn buy-now">Mua ngay</button>
                                </div>
                            </Col>
                        </Col>

                    </Row>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={"hardcode"}
            />
        </div>
    )
}
export default BookDetailHome