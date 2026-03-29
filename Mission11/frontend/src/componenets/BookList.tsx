// BookList.tsx: 
import { useEffect, useState } from "react";
import type { Book } from "../types/Book.ts";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortTitleAsc, setSortTitleAsc] = useState<boolean>(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchBooks = async () => {
            const categoryParams = selectedCategories
                .map((cat) => `categoryTypes=${encodeURIComponent(cat)}`)
                .join('&');
        
            const response = await fetch(
                `http://localhost:4040/api/Book/AllBooks?pageHowMany=${pageSize}&pageNum=${pageNum}&sortTitleAsc=${sortTitleAsc}${selectedCategories.length ? `&${categoryParams}` : ''}` 
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };
        fetchBooks();
    }, [pageSize, pageNum, sortTitleAsc, selectedCategories]);

    return (
        <div className="container py-5" style={{ maxWidth: "700px" }}>

            <p className="text-muted small mb-3 mb-md-4">
                {totalItems} titles in the collection
            </p>

            {/* Toolbar */}
            <div className="d-flex gap-3 align-items-end mb-4 pb-3 border-bottom">
                <div>
                    <label className="form-label small fw-semibold mb-1 d-block">Sort</label>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: "auto" }}
                        value={sortTitleAsc ? "asc" : "desc"}
                        onChange={(e) => { setSortTitleAsc(e.target.value === "asc"); setPageNum(1); }}
                    >
                        <option value="asc">Title: A → Z</option>
                        <option value="desc">Title: Z → A</option>
                    </select>
                </div>
                <div>
                    <label className="form-label small fw-semibold mb-1 d-block">Show</label>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: "auto" }}
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPageNum(1); }}
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                    </select>
                </div>
            </div>

            {/* Book rows */}
            <div>
                {books.map((b) => (
                    <div key={b.bookId} className="d-flex justify-content-between align-items-start py-3 border-bottom gap-4">
                        {/* Left: all book info */}
                        <div>
                            <div className="fw-bold mb-1" style={{ fontSize: "1rem" }}>{b.title}</div>
                            <div className="text-muted mb-2" style={{ fontSize: "0.875rem" }}>
                                {b.author} &nbsp;·&nbsp; {b.publisher}
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                                <span className="badge text-bg-secondary fw-normal">{b.classification}</span>
                                <span className="badge text-bg-secondary fw-normal">{b.category}</span>
                                <span className="badge text-bg-light border fw-normal text-muted">{b.pageCount} pages</span>
                                <span className="badge text-bg-light border fw-normal text-muted">ISBN {b.isbn}</span>
                            </div>
                        </div>

                        {/* Right: price */}
                        <div className="fw-bold text-nowrap" style={{ fontSize: "1rem" }}>
                            ${b.price}
                        </div>

                        {/* Buttons  */}
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                addToCart({
                                    bookId: b.bookId,
                                    title: b.title,
                                    price: b.price,
                                    quantity: 1,
                                });
                                navigate("/");
                            }}
                        >
                            Quick Add
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate(`/bookDetails/${b.bookId}`)}>View Details</button>

                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="text-muted small">Page {pageNum} of {totalPages}</span>
                <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${pageNum === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>← Prev</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i + 1} className={`page-item ${pageNum === i + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setPageNum(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${pageNum === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>Next →</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default BookList;