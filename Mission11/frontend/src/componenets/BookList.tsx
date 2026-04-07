import { useEffect, useState } from "react";
import type { Book } from "../types/Book.ts";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { BOOK_API_BASE_URL } from "../api/BooksAPI";

const API_URL = BOOK_API_BASE_URL;

const SPINE_COLORS = [
    "var(--amber)",
    "var(--rust)",
    "var(--sage)",
    "#7b6ea0",
    "#3d7a8a",
];

function spineColor(index: number) {
    return SPINE_COLORS[index % SPINE_COLORS.length];
}

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortTitleAsc, setSortTitleAsc] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const categoryParams = selectedCategories
                    .map((cat) => `categoryTypes=${encodeURIComponent(cat)}`)
                    .join("&");

                const response = await fetch(
                    `${API_URL}/AllBooks?pageHowMany=${pageSize}&pageNum=${pageNum}&sortTitleAsc=${sortTitleAsc}${
                        selectedCategories.length ? `&${categoryParams}` : ""
                    }`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }

                const data = await response.json();
                setBooks(data.books);
                setTotalItems(data.totalNumBooks);
                setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            } catch (error) {
                console.error("Error fetching books:", error);
                setBooks([]);
                setTotalItems(0);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [pageSize, pageNum, sortTitleAsc, selectedCategories]);

    const pageNumbers = () => {
        const pages: (number | "…")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (pageNum > 3) pages.push("…");
            for (
                let i = Math.max(2, pageNum - 1);
                i <= Math.min(totalPages - 1, pageNum + 1);
                i++
            )
                pages.push(i);
            if (pageNum < totalPages - 2) pages.push("…");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div>
            <div className="books-toolbar">
                <div className="result-count">
                    Showing{" "}
                    <strong>
                        {totalItems} title{totalItems !== 1 ? "s" : ""}
                    </strong>
                    {selectedCategories.length > 0 && (
                        <span>
                            {" "}
                            in{" "}
                            <strong>
                                {selectedCategories.length} categor
                                {selectedCategories.length === 1 ? "y" : "ies"}
                            </strong>
                        </span>
                    )}
                </div>

                <div className="toolbar-controls">
                    <span className="toolbar-label">Sort</span>
                    <select
                        className="toolbar-select"
                        value={sortTitleAsc ? "asc" : "desc"}
                        onChange={(e) => {
                            setSortTitleAsc(e.target.value === "asc");
                            setPageNum(1);
                        }}
                    >
                        <option value="asc">Title A → Z</option>
                        <option value="desc">Title Z → A</option>
                    </select>

                    <span className="toolbar-label" style={{ marginLeft: 8 }}>
                        Show
                    </span>
                    <select
                        className="toolbar-select"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageNum(1);
                        }}
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="state-box">
                    <div className="spinner" />
                    <p>Loading books…</p>
                </div>
            ) : books.length === 0 ? (
                <div className="state-box">
                    <p style={{ fontSize: "1.1rem" }}>No books found.</p>
                    <p style={{ fontSize: ".85rem" }}>Try adjusting your filters.</p>
                </div>
            ) : (
                <div>
                    {books.map((b, idx) => (
                        <div key={b.bookId} className="book-card">
                            <div
                                className="book-spine"
                                style={{ background: spineColor(idx) }}
                            />

                            <div className="book-info">
                                <div className="book-title">{b.title}</div>
                                <div className="book-meta">
                                    <span>{b.author}</span>
                                    <span>{b.publisher}</span>
                                </div>
                                <div className="book-tags">
                                    <span className="tag tag-category">
                                        {b.category}
                                    </span>
                                    <span className="tag tag-detail">
                                        {b.classification}
                                    </span>
                                    <span className="tag tag-detail">
                                        {b.pageCount} pp
                                    </span>
                                    <span className="tag tag-detail">
                                        ISBN {b.isbn}
                                    </span>
                                </div>
                            </div>

                            <div className="book-right">
                                <div className="book-price">${b.price.toFixed(2)}</div>
                                <div className="book-actions">
                                    <button
                                        className="btn-secondary-store"
                                        onClick={() =>
                                            navigate(`/bookDetails/${b.bookId}`)
                                        }
                                        title="View details"
                                    >
                                        <Eye size={14} />
                                        Details
                                    </button>
                                    <button
                                        className="btn-primary-store"
                                        onClick={() => {
                                            addToCart({
                                                bookId: b.bookId,
                                                title: b.title,
                                                price: b.price,
                                                quantity: 1,
                                            });
                                        }}
                                        title="Add to cart"
                                    >
                                        <ShoppingCart size={14} />
                                        Quick Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination-area">
                    <span className="page-info">
                        Page {pageNum} of {totalPages}
                    </span>
                    <div className="page-btns">
                        <button
                            className="page-btn page-btn-wide"
                            disabled={pageNum === 1}
                            onClick={() => setPageNum(pageNum - 1)}
                        >
                            <ChevronLeft size={14} />
                        </button>

                        {pageNumbers().map((p, i) =>
                            p === "…" ? (
                                <span
                                    key={`ellipsis-${i}`}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        padding: "0 4px",
                                        color: "var(--ink-muted)",
                                        fontSize: ".82rem",
                                    }}
                                >
                                    …
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    className={`page-btn ${pageNum === p ? "active" : ""}`}
                                    onClick={() => setPageNum(p as number)}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            className="page-btn page-btn-wide"
                            disabled={pageNum === totalPages || totalPages === 0}
                            onClick={() => setPageNum(pageNum + 1)}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookList;