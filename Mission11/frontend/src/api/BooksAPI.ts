import type { Book } from "../types/Book";

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

/** Base URL for Book API (override locally with VITE_BOOK_API_URL in `.env.local`). */
export const BOOK_API_BASE_URL =
    import.meta.env.VITE_BOOK_API_URL ??
    "https://mission13backend2-hnhpf9bmdvf7c0hf.mexicocentral-01.azurewebsites.net/api/Book";

const API_URL = BOOK_API_BASE_URL;

export const fetchBooks = async (
    pageSize: number,
    pageNum: number,
    sortTitleAsc: boolean,
    selectedCategories: string[]
): Promise<FetchBooksResponse> => {
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

    return await response.json();
};

/** Loads a large page for the admin table (server still paginates; 5000 is plenty for coursework). */
export const fetchAllBooksForAdmin = async (): Promise<Book[]> => {
    const data = await fetchBooks(5000, 1, true, []);
    return data.books;
};

export const addBook = async (newBook: Book): Promise<Book> => {
    const response = await fetch(`${API_URL}/AddBook`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
    });

    if (!response.ok) {
        throw new Error("Failed to add book");
    }

    return await response.json();
};

export const updateBook = async (
    bookId: number,
    updatedBook: Book
): Promise<Book> => {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
        throw new Error("Failed to update book");
    }

    return await response.json();
};

export const deleteBook = async (bookId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete book");
    }
};
