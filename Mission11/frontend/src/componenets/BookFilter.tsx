// BookFilter.tsx
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

function BookFilter({
    selectedCategories,
    setSelectedCategories,
}: {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}) {
    const [filters, setFilters] = useState<string[]>([]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch(`https://mission13backend2-hnhpf9bmdvf7c0hf.mexicocentral-01.azurewebsites.net/api/Book/FilterBooks`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setFilters(data);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };
        fetchTypes();
    }, []);

    function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
        const updated = selectedCategories.includes(target.value)
            ? selectedCategories.filter((c) => c !== target.value)
            : [...selectedCategories, target.value];
        setSelectedCategories(updated);
    }

    return (
        <div className="filter-card">
            {/* Heading */}
            <div className="d-flex align-items-center justify-content-between filter-heading">
                <span className="d-flex align-items-center gap-2">
                    <SlidersHorizontal size={14} />
                    Filter by Genre
                </span>
                {selectedCategories.length > 0 && (
                    <button
                        className="btn-clear-filter"
                        onClick={() => setSelectedCategories([])}
                    >
                        <X size={12} style={{ marginRight: 2 }} />
                        Clear
                    </button>
                )}
            </div>

            {/* Category checkboxes */}
            <div className="filter-divider">Categories</div>
            <div>
                {filters.map((c) => (
                    <div key={c} className="filter-check">
                        <input
                            id={`filter-${c}`}
                            type="checkbox"
                            value={c}
                            checked={selectedCategories.includes(c)}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor={`filter-${c}`}>{c}</label>
                        {selectedCategories.includes(c) && (
                            <span
                                style={{
                                    marginLeft: "auto",
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "var(--amber)",
                                    display: "inline-block",
                                    flexShrink: 0,
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Active filter pills */}
            {selectedCategories.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                    <div className="filter-divider" style={{ marginTop: 0 }}>Active filters</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                        {selectedCategories.map((c) => (
                            <button
                                key={c}
                                onClick={() =>
                                    setSelectedCategories(
                                        selectedCategories.filter((x) => x !== c)
                                    )
                                }
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    fontSize: ".72rem",
                                    fontWeight: 600,
                                    padding: "3px 8px",
                                    borderRadius: 99,
                                    border: "1px solid rgba(200,135,58,.35)",
                                    background: "var(--amber-light)",
                                    color: "var(--amber-dark)",
                                    cursor: "pointer",
                                }}
                            >
                                {c}
                                <X size={10} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookFilter;