// BookDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Book } from "../types/Book";
import { useCart } from "../context/CartContext";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import Welcome from "../componenets/Welcome";
import { BOOK_API_BASE_URL } from "../api/BooksAPI";

function BookDetails() {
    const navigate = useNavigate();
    const { bookId } = useParams();
    const { addToCart } = useCart();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(
                    `${BOOK_API_BASE_URL}/BookDetails/${bookId}`
                );
                if (!response.ok) throw new Error("Failed to fetch book");
                const data = await response.json();
                setBook(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        if (bookId) fetchBook();
    }, [bookId]);

    const handleAddToCart = () => {
        if (!book) return;
        addToCart({
            bookId: book.bookId,
            title: book.title,
            price: book.price,
            quantity: Math.max(1, quantity),
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="page-shell">
            <Welcome />

            <div className="content-area">
                <div className="container">
                    {loading && (
                        <div className="state-box">
                            <div className="spinner" />
                            <p>Loading book details…</p>
                        </div>
                    )}

                    {error && (
                        <div className="state-box">
                            <p style={{ color: "var(--rust)", marginBottom: 16 }}>
                                {error}
                            </p>
                            <button
                                className="btn-secondary-store"
                                onClick={() => navigate("/")}
                            >
                                <ArrowLeft size={14} /> Back to Books
                            </button>
                        </div>
                    )}

                    {!loading && !error && book && (
                        <div className="details-page">
                            {/* Breadcrumb */}
                            <nav style={{ fontSize: ".8rem", color: "var(--ink-muted)", marginBottom: 20 }}>
                                <button
                                    onClick={() => navigate("/")}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--amber-dark)", padding: 0, fontSize: "inherit" }}
                                >
                                    Books
                                </button>
                                <span style={{ margin: "0 6px" }}>›</span>
                                <span>{book.category}</span>
                                <span style={{ margin: "0 6px" }}>›</span>
                                <span style={{ color: "var(--ink)" }}>{book.title}</span>
                            </nav>

                            <div className="details-card">
                                {/* Header */}
                                <div className="details-header">
                                    <div className="book-title-lg">{book.title}</div>
                                    <div className="book-author-lg">by {book.author}</div>
                                    <div className="book-tags">
                                        <span className="tag tag-category">{book.category}</span>
                                        <span
                                            className="tag"
                                            style={{
                                                background: "rgba(255,255,255,.1)",
                                                color: "#d0c8bf",
                                                border: "1px solid rgba(255,255,255,.15)",
                                            }}
                                        >
                                            {book.classification}
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="details-body">
                                    {/* Metadata grid */}
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <label>Publisher</label>
                                            <div className="detail-val">{book.publisher}</div>
                                        </div>
                                        <div className="detail-item">
                                            <label>ISBN</label>
                                            <div className="detail-val">{book.isbn}</div>
                                        </div>
                                        <div className="detail-item">
                                            <label>Classification</label>
                                            <div className="detail-val">{book.classification}</div>
                                        </div>
                                        <div className="detail-item">
                                            <label>Pages</label>
                                            <div className="detail-val">{book.pageCount}</div>
                                        </div>
                                    </div>

                                    {/* Price + quantity + CTA */}
                                    <div className="price-block">
                                        <div className="price-lg">${book.price.toFixed(2)}</div>

                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                            {/* Quantity stepper */}
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: ".72rem",
                                                        fontWeight: 600,
                                                        letterSpacing: ".08em",
                                                        textTransform: "uppercase",
                                                        color: "var(--ink-muted)",
                                                        marginBottom: 6,
                                                    }}
                                                >
                                                    Quantity
                                                </div>
                                                <div className="qty-control">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="qty-input"
                                                        min={1}
                                                        value={quantity}
                                                        onChange={(e) =>
                                                            setQuantity(Math.max(1, Number(e.target.value)))
                                                        }
                                                    />
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => setQuantity(quantity + 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                className="btn-primary-store"
                                                style={{ fontSize: ".92rem", padding: "11px 22px" }}
                                                onClick={handleAddToCart}
                                            >
                                                <ShoppingCart size={16} />
                                                {added ? "Added!" : "Add to Cart"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Back link */}
                                    <button
                                        className="btn-secondary-store"
                                        onClick={() => navigate("/")}
                                    >
                                        <ArrowLeft size={14} />
                                        Back to Books
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="store-footer">
                <div className="container">
                    © {new Date().getFullYear()} <span>Hilton's Books</span>
                </div>
            </footer>
        </div>
    );
}

export default BookDetails;