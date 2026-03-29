// App.tsx: 
import './App.css'
import BooksPage from './pages/BooksPage'
import Cart from './pages/Cart';
import BookDetails from './pages/BookDetails';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>
            <Routes> 
            {/* Route with no path (home page) */}
              <Route path="/" element={<BooksPage />} /> 

              <Route path="/cart" element={<Cart />} />

              {/* Route to the book details page */}
              <Route path="/bookDetails/:bookId" element={<BookDetails />} />
            </Routes>
          </BrowserRouter>
      </CartProvider>
    </>
  )
}

export default App
