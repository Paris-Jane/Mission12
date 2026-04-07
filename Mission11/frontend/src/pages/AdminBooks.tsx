import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../types/Book";
import {
    addBook,
    deleteBook,
    fetchAllBooksForAdmin,
    updateBook,
} from "../api/BooksAPI";
import Welcome from "../componenets/Welcome";
import "../App.css";

function emptyBook(): Book {
    return {
        bookId: 0,
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        classification: "",
        category: "",
        pageCount: 0,
        price: 0,
    };
}

function AdminBooks() {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
        null
    );
    const [draft, setDraft] = useState<Book | null>(null);

    const loadBooks = useCallback(async () => {
        setLoading(true);
        setMessage(null);
        try {
            const list = await fetchAllBooksForAdmin();
            setBooks(list);
        } catch {
            setMessage({ type: "err", text: "Could not load books from the server." });
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const openAdd = () => {
        setDraft(emptyBook());
        setMessage(null);
    };

    const openEdit = (b: Book) => {
        setDraft({ ...b });
        setMessage(null);
    };

    const closeForm = () => {
        setDraft(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!draft) return;
        setSaving(true);
        setMessage(null);
        try {
            if (draft.bookId === 0) {
                await addBook(draft);
                setMessage({ type: "ok", text: "Book added." });
            } else {
                await updateBook(draft.bookId, draft);
                setMessage({ type: "ok", text: "Book updated." });
            }
            setDraft(null);
            await loadBooks();
        } catch (err) {
            const text =
                err instanceof Error ? err.message : "Save failed. Check fields and try again.";
            setMessage({ type: "err", text });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (b: Book) => {
        if (!window.confirm(`Delete “${b.title}”? This cannot be undone.`)) return;
        setMessage(null);
        try {
            await deleteBook(b.bookId);
            setMessage({ type: "ok", text: "Book deleted." });
            await loadBooks();
        } catch (err) {
            const text = err instanceof Error ? err.message : "Delete failed.";
            setMessage({ type: "err", text });
        }
    };

    const field = (key: keyof Book, label: string, type: string = "text") => (
        <div className="mb-3">
            <label className="form-label small fw-semibold" htmlFor={`admin-${key}`}>
                {label}
            </label>
            <input
                id={`admin-${key}`}
                className="form-control form-control-sm"
                type={type}
                value={
                    type === "number"
                        ? String(draft?.[key] ?? "")
                        : String(draft?.[key] ?? "")
                }
                onChange={(e) =>
                    setDraft((d) =>
                        d
                            ? {
                                  ...d,
                                  [key]:
                                      type === "number"
                                          ? Number(e.target.value)
                                          : e.target.value,
                              }
                            : null
                    )
                }
                required={key !== "bookId"}
                readOnly={key === "bookId"}
            />
        </div>
    );

    return (
        <div className="page-shell">
            <Welcome />

            <div className="content-area">
                <div className="container py-4" style={{ maxWidth: "960px" }}>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                        <div>
                            <h1 className="h3 mb-1">Admin — Books</h1>
                            <p className="text-muted small mb-0">
                                Add, edit, or remove titles in the database.
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => navigate("/")}
                            >
                                ← Storefront
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={openAdd}
                                disabled={!!draft}
                            >
                                Add book
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`alert alert-${message.type === "ok" ? "success" : "danger"} py-2 small`}
                            role="status"
                        >
                            {message.text}
                        </div>
                    )}

                    {draft && (
                        <div className="card border mb-4 shadow-sm">
                            <div className="card-body">
                                <h2 className="h5 card-title">
                                    {draft.bookId === 0 ? "New book" : `Edit book #${draft.bookId}`}
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    {draft.bookId !== 0 && field("bookId", "Book ID", "number")}
                                    {field("title", "Title")}
                                    {field("author", "Author")}
                                    {field("publisher", "Publisher")}
                                    {field("isbn", "ISBN")}
                                    {field("classification", "Classification")}
                                    {field("category", "Category")}
                                    {field("pageCount", "Page count", "number")}
                                    {field("price", "Price", "number")}
                                    <div className="d-flex gap-2 mt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={saving}
                                        >
                                            {saving ? "Saving…" : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={closeForm}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <p className="text-muted">Loading books…</p>
                    ) : (
                        <div className="table-responsive card border shadow-sm">
                            <table className="table table-sm table-hover mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th className="text-end">Price</th>
                                        <th className="text-end" style={{ width: "140px" }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-muted text-center py-4">
                                                No books found.
                                            </td>
                                        </tr>
                                    ) : (
                                        books.map((b) => (
                                            <tr key={b.bookId}>
                                                <td className="fw-medium">{b.title}</td>
                                                <td>{b.author}</td>
                                                <td>{b.category}</td>
                                                <td className="text-end">${b.price}</td>
                                                <td className="text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary btn-sm me-1"
                                                        onClick={() => openEdit(b)}
                                                        disabled={!!draft}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDelete(b)}
                                                        disabled={!!draft}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <footer className="store-footer">
                <div className="container">
                    © {new Date().getFullYear()}{" "}
                    <span>Hilton&apos;s Books</span> — Admin
                </div>
            </footer>
        </div>
    );
}

export default AdminBooks;
