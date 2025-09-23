import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type ModalGalleryProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    currentIndex: number;
    items: Array<string | { src: string } | { original: string }>;
    title?: string;
};

const normalizeSlides = (
    items: ModalGalleryProps["items"],
): { src: string }[] => {
    return items.map((it: any) => {
        if (typeof it === "string") return { src: it };
        if (it?.src) return { src: it.src };
        if (it?.original) return { src: it.original };
        return { src: String(it) };
    });
};

const ModalGallery = ({ isOpen, setIsOpen, currentIndex, items }: ModalGalleryProps) => {
    return (
        <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            index={currentIndex}
            slides={normalizeSlides(items)}
            plugins={[Thumbnails, Zoom]}
        />
    );
};

export default ModalGallery;
