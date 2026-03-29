// Welcome.tsx: 
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Welcome() {
    const navigate = useNavigate();
    return (
        <div className="mb-4">
            <h1 className="fw-bold mb-0">Hilton's Books</h1>
            <button type="button" className="btn btn-primary me-2" onClick={() => navigate("/cart")}>
                <ShoppingCart className="me-1" size={18} aria-hidden />
                Cart
            </button>
            <p>Welcome to Hilton's Books! Here you can find a collection of books that Hilton has read and enjoyed.</p>
        </div>
    )
}

export default Welcome;