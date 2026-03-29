// BooksPage.tsx
import "../App.css";
import BookList from "../componenets/BookList";
import BookFilter from "../componenets/BookFilter";
import { useState } from "react";
import Welcome from "../componenets/Welcome";

function BooksPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    return (
        <div className="page-shell">
            <Welcome />

            <div className="content-area">
                <div className="container">
                    <div className="row g-4">
                        {/* ── Sidebar ── */}
                        <div className="col-12 col-md-3 col-lg-3">
                            <BookFilter
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                            />
                        </div>

                        {/* ── Main book list ── */}
                        <div className="col-12 col-md-9 col-lg-9">
                            <BookList selectedCategories={selectedCategories} />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="store-footer">
                <div className="container">
                    © {new Date().getFullYear()} <span>Hilton's Books</span> — All
                    rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default BooksPage;