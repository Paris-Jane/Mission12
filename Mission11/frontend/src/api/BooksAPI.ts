import type { Book } from "../types/Book";

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

/**
 * Base URL for the Book API, **including** `/api/Book` (no trailing slash).
 * Override in `.env.local`: `VITE_BOOK_API_URL=https://your-app.azurewebsites.net/api/Book`
 */
export const BOOK_API_BASE_URL = (
    import.meta.env.VITE_BOOK_API_URL ??
    "https://mission13backend2-hnhpf9bmdvf7c0hf.mexicocentral-01.azurewebsites.net/api/Book"
).replace(/\/$/, "");

const API_URL = BOOK_API_BASE_URL;

async function readErrorDetail(response: Response): Promise<string> {
    try {
        const text = await response.text();
        if (!text) return response.statusText || String(response.status);
        try {
            const json = JSON.parse(text) as { title?: string; detail?: string; message?: string };
            return json.detail ?? json.title ?? json.message ?? text.slice(0, 200);
        } catch {
            return text.slice(0, 200);
        }
    } catch {
        return response.statusText || String(response.status);
    }
}

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
        const detail = await readErrorDetail(response);
        throw new Error(`Failed to fetch books (${response.status}): ${detail}`);
    }

    return await response.json();
};

/** Loads a large page for the admin table (server still paginates; 5000 is plenty for coursework). */
export const fetchAllBooksForAdmin = async (): Promise<Book[]> => {
    const data = await fetchBooks(5000, 1, true, []);
    return data.books;
};

/** POST .../api/Book (REST) — also supported: .../api/Book/AddBook */
export const addBook = async (newBook: Book): Promise<Book> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
    });

    if (!response.ok) {
        const detail = await readErrorDetail(response);
        throw new Error(`Failed to add book (${response.status}): ${detail}`);
    }

    return await response.json();
};

/** PUT .../api/Book/{id} (REST) — also supported: .../api/Book/UpdateBook/{id} */
export const updateBook = async (
    bookId: number,
    updatedBook: Book
): Promise<Book> => {
    const response = await fetch(`${API_URL}/${bookId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
        const detail = await readErrorDetail(response);
        throw new Error(`Failed to update book (${response.status}): ${detail}`);
    }

    return await response.json();
};

/** DELETE .../api/Book/{id} (REST) — also supported: .../api/Book/DeleteBook/{id} */
export const deleteBook = async (bookId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${bookId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const detail = await readErrorDetail(response);
        throw new Error(`Failed to delete book (${response.status}): ${detail}`);
    }
};
