// Welcome.tsx
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Welcome() {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <>
            {/* ── Sticky Navbar ── */}
            <nav className="store-navbar">
                <div className="container">
                    <div className="nav-inner">
                        <div>
                            <div className="brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                                Hilton's<span>&nbsp;Books</span>
                            </div>
                            <div className="tagline">A curated collection</div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-link text-white text-decoration-none px-2 py-1 me-1"
                            style={{ fontSize: "0.85rem" }}
                            onClick={() => navigate("/adminbooks")}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            className="btn-cart"
                            onClick={() => navigate("/cart")}
                        >
                            <ShoppingCart size={16} />
                            Cart
                            {totalQty > 0 && (
                                <span className="cart-badge">{totalQty}</span>
                            )}
                            {subtotal > 0 && (
                                <span className="price-badge">${subtotal.toFixed(2)}</span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

        </>
    );
}

export default Welcome;