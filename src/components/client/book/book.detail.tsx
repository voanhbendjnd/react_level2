import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Rate, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react"
import { BsCartPlus } from "react-icons/bs";
import ReactImageGallery from "react-image-gallery";
import ModalGallery from "./modal.gallery";
import "@/styles/productDetail.scss";
import "react-image-gallery/styles/css/image-gallery.css";
import { useCurrentApp } from "@/components/context/app.context";
interface IProps {
    currentBook: IBooksTable | null;

}

const BookDetailHome = (props: IProps) => {
    const { currentBook } = props;
    const { message } = App.useApp()
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const refGallery = useRef<ReactImageGallery>(null);
    const { setCarts } = useCurrentApp();
    const detailItems = [
        { label: "Mã hàng", value: currentBook?.id ?? "-" },
        { label: "Tên Nhà Cung Cấp", value: currentBook?.publisher || "-" },
        { label: "Tác giả", value: currentBook?.author || "-" },
        { label: "NXB", value: currentBook?.publisher || "-" },
        { label: "Năm XB", value: currentBook?.publicationDate ? dayjs(currentBook.publicationDate).format("YYYY") : "-" },
        { label: "ISBN", value: currentBook?.isbn || "-" },
        { label: "Ngôn ngữ", value: currentBook?.language || "-" },
        { label: "Thể loại", value: currentBook?.categories?.join(", ") || "-" },
        { label: "Số trang", value: typeof currentBook?.numberOfPages === "number" ? currentBook?.numberOfPages : "-" },
        { label: "Tồn kho", value: typeof currentBook?.stockQuantity === "number" ? currentBook?.stockQuantity : "-" },
    ]
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])
    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    }

    // Hàm tăng số lượng
    const handleIncreaseQuantity = () => {
        if (currentBook && quantity < currentBook.stockQuantity) {
            setQuantity(prev => prev + 1);
        }
    }

    // Hàm giảm số lượng
    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }


    // Hàm xử lý thay đổi input số lượng
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && currentBook && value <= currentBook.stockQuantity) {
            setQuantity(value);
        }
    }

    // add to cart
    const handleAddToCart = () => {
        const cartStorage = localStorage.getItem("carts");
        let updatedCarts = [];
        if (cartStorage) {
            // update
            // convert from string to array
            updatedCarts = JSON.parse(cartStorage) as ICart[];
            let exists = updatedCarts.findIndex(c => c.id === currentBook?.id);
            if (exists > -1) {
                updatedCarts[exists].quantity = updatedCarts[exists].quantity + quantity;
            }
            else {
                updatedCarts.push({
                    quantity: quantity,
                    id: currentBook?.id,
                    detail: currentBook
                })
            }
        }
        else {
            updatedCarts.push({
                id: currentBook?.id,
                quantity: quantity,
                detail: currentBook,
            })
        }

        // Luôn cập nhật localStorage
        localStorage.setItem("carts", JSON.stringify(updatedCarts));

        // Luôn cập nhật state toàn cục để các component khác có thể theo dõi
        setCarts(updatedCarts);

        message.success("Thêm vào giỏ hàng thành công");
    }
    useEffect(() => {
        if (currentBook) {
            const images = [];
            if (currentBook.coverImage) {
                images.push(
                    {
                        original: `http://localhost:8080/api/v1/images/book/${currentBook.coverImage}`,
                        thumbnail: `http://localhost:8080/api/v1/images/book/${currentBook.coverImage}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image",
                    }
                )
            }
            if (currentBook.imgs) {
                currentBook.imgs?.map(it => {
                    images.push(
                        {
                            original: `http://localhost:8080/api/v1/images/book/${it}`,
                            thumbnail: `http://localhost:8080/api/v1/images/book/${it}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image",
                        }
                    )
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])

    return (
        <>
            <div className="product-detail">
                <div className="pd-container">
                    <div className="pd-card">
                        <Row gutter={[20, 20]} align="top">
                            {/* laptop pc */}
                            <Col md={10} sm={0} xs={0} className="pd-gallery">
                                <ReactImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>} // thanh chuyển ảnh
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            {/* phone */}
                            <Col md={14} sm={24} className="pd-info"
                            >
                                <Col md={0} sm={24} xs={24} className="pd-gallery--mobile"
                                    style={{
                                        height: "500%"
                                    }}>
                                    <ReactImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        renderLeftNav={() => <></>} // thanh chuyển ảnh
                                        renderRightNav={() => <></>}
                                        slideOnThumbnailOver={true}
                                        showThumbnails={false}

                                    />
                                </Col>
                                <Col span={24}>
                                    <div className="pd-brand">Tác giả: <a href="#">{currentBook?.author}</a></div>
                                    <div className="pd-title">{currentBook?.title}</div>
                                    <div className="pd-meta">
                                        <Rate value={5} disabled />
                                        <span className="pd-sold">
                                            <Divider type="vertical" />
                                            Đã bán {currentBook?.sold ?? 0} cuốn
                                        </span>
                                    </div>
                                    <div className="pd-price">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(currentBook?.price ?? 0)}
                                    </div>
                                    <div className="pd-ship">
                                        <span className="label">Vận chuyển</span>
                                        <span className="value">Miễn phí vận chuyển cho đơn 100k</span>
                                    </div>
                                    <div className="pd-qty">
                                        <span className="label">Số lượng</span>
                                        <span className="qty-controls">
                                            <button
                                                className="btn-qty"
                                                onClick={handleDecreaseQuantity}
                                                disabled={quantity <= 1}
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <input
                                                className="qty-input"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                type="number"
                                                min={1}
                                                max={currentBook?.stockQuantity || 1}
                                            />
                                            <button
                                                className="btn-qty"
                                                onClick={handleIncreaseQuantity}
                                                disabled={currentBook ? quantity >= currentBook.stockQuantity : true}
                                            >
                                                <PlusOutlined />
                                            </button>
                                        </span>
                                    </div>
                                    <div className="pd-actions">
                                        <button className="btn add-cart" onClick={() => handleAddToCart()}>
                                            <BsCartPlus />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button className="btn buy-now">Mua ngay</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <Divider />
                        <div className="pd-extra">
                            <div className="pd-extra__title">Thông tin chi tiết</div>
                            <Divider />

                            <div className="pd-extra__table">
                                {detailItems.map((item, index) => (
                                    <div className="pd-extra__row" key={index}>
                                        <span className="label">{item.label}</span>
                                        <span className="value">{item.value as any}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pd-desc">
                            <div className="pd-desc__title">Mô tả sản phẩm</div>
                            <Divider />
                            <h4>{currentBook?.title}</h4>
                            <div className="pd-desc__content">{currentBook?.description || "Chưa có mô tả"}</div>
                        </div>
                    </div>
                </div>
                <ModalGallery
                    isOpen={isOpenModalGallery}
                    setIsOpen={setIsOpenModalGallery}
                    currentIndex={currentIndex}
                    items={imageGallery}
                    title={currentBook?.title ?? ""}
                />
            </div>

        </>
    )
}
export default BookDetailHome