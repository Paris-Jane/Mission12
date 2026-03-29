// BooksPage.tsx: 
import '../App.css'
import BookList from '../componenets/BookList'
import BookFilter from '../componenets/BookFilter'
import { useState } from 'react'
import Welcome from '../componenets/Welcome'

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // List that contains the categories that are selected (needed for filtering category)

    return (
        <>
        <Welcome />
        <BookFilter 
            selectedCategories={selectedCategories} 
            setSelectedCategories={setSelectedCategories}/>

        <BookList selectedCategories={selectedCategories} />
        </>
    )
}

export default BooksPage;
