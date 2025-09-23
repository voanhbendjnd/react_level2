import BookDetailHome from "@/components/client/book/book.detail";
import { useEffect } from "react";
import { useParams } from "react-router-dom"

const BookPage = () => {
    let { id } = useParams();
    useEffect(() => {
        if (id) {

        }
    }, [id])
    return (
        <div>
            <BookDetailHome />
        </div>
    )
}

export default BookPage;