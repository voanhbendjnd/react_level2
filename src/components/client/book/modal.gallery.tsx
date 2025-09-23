import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import type ReactImageGallery from "react-image-gallery";
import ImageGallery from "react-image-gallery";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass?: string;
        thumbnailClass?: string;
    }[];
    title: string;
}

const ModalGallery = (props: IProps) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ReactImageGallery>(null);
    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex])
    return (
        <Modal
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            width={1100}
            title={title}
            className="gallery-modal"
            centered
        >
            <ImageGallery
                ref={refGallery}
                items={items}
                startIndex={activeIndex}
                showPlayButton={false}
                showFullscreenButton={false}
                thumbnailPosition="right"
                showNav={true}
            />
        </Modal>
    )
}
export default ModalGallery;