// BookDetails.tsx: 
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Book } from "../types/Book";
import { useCart } from "../context/CartContext";

function BookDetails() {
    const navigate = useNavigate();
    const { bookId } = useParams();
    const { addToCart } = useCart();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(
                    `http://localhost:4040/api/Book/BookDetails/${bookId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch book");
                }

                const data = await response.json();
                setBook(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchBook();
        }
    }, [bookId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!book) return <p>No book found.</p>;

    const handleAddToCart = () => {
        const qty = Math.max(1, quantity);
        addToCart({
            bookId: book.bookId,
            title: book.title,
            price: book.price,
            quantity: qty,
        });
        navigate("/cart");
    };

    return (
        <div>
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Publisher: {book.publisher}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Classification: {book.classification}</p>
            <p>Category: {book.category}</p>
            <p>Page Count: {book.pageCount}</p>
            <p>Price: {book.price}</p>
            <label className="d-block mb-2">
                Quantity:{" "}
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </label>
            <button
                type="button"
                className="btn btn-primary me-2"
                onClick={() => navigate("/")}
            >
                Back to Books
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
}

export default BookDetails;
