import BookDetailHome from "@/components/client/book/book.detail";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getBookByIdAPI } from '@/services/api';
import { BookLoader } from "@/components/client/book/book.loader";

const BookPageHome = () => {
    let { id } = useParams();
    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(false);
    const { notification } = App.useApp();
    const [currentBook, setCurrentBook] = useState<IBooksTable | null>(null);
    useEffect(() => {
        if (id) {
            const fetchBookById = async () => {
                setIsLoadingBook(true);

                const res = await getBookByIdAPI(id);
                if (res && res.data) {
                    setCurrentBook(res.data);
                }
                else {
                    notification.error({
                        message: "Đã xảy ra lỗi",
                        description: res.message
                    })
                }
                setIsLoadingBook(false);
            }
            fetchBookById();
        }
    }, [id])
    return (
        <div>
            {isLoadingBook ?
                <BookLoader />
                :
                <BookDetailHome
                    currentBook={currentBook} />
            }

        </div>
    )
}

export default BookPageHome;