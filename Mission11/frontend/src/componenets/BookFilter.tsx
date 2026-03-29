// BookFilter.tsx: 
import { useState, useEffect } from "react";


function BookFilter({
    // Properties passed into
    selectedCategories,
    setSelectedCategories,
    }: {
        selectedCategories: string[],
        setSelectedCategories: (categories: string[]) => void;
    }) {
    
    
    const [filters, setFilters] = useState<string[]>([]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch(
                    `http://localhost:4040/api/Book/FilterBooks`
                );
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                setFilters(data);
            } catch (error) {
                console.error('Error Fetching Titles:', error);
            }
            
        }
        fetchTypes();
    }, []);

    // Function to handle checkbox changes
    function handleChexboxChange({target}: {target: HTMLInputElement}) {
        const updatedCategories = selectedCategories.includes(target.value) // See if list already has target value selected
            ? selectedCategories.filter((c) => c !== target.value) // what to do if it is true: filter out target value
            : [...selectedCategories, target.value]; // What to do if it is false: add target value to list

            setSelectedCategories(updatedCategories); // Update the list of selected categories
    }

    return (
        <div>
            <h5 className="form-label small fw-semibold mb-1 d-block">Book Categories</h5>
            <div>
                {filters.map((c) => (
                    <div key={c}>
                        <input 
                            id={c} 
                            type="checkbox" 
                            value={c} 
                            onChange={handleChexboxChange}/>
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BookFilter;