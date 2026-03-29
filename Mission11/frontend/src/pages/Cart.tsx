// Cart.tsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Trash2, ArrowLeft, BookOpen } from "lucide-react";
import Welcome from "../componenets/Welcome";

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart } = useCart();

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const total = subtotal;

    return (
        <div className="page-shell">
            <Welcome />

            <div className="content-area">
                <div className="container">
                    <div className="cart-page">
                        {/* Heading */}
                        <div className="d-flex align-items-center gap-3 mb-1">
                            <ShoppingCart size={24} color="var(--amber)" />
                            <h1 className="cart-heading mb-0">Your Cart</h1>
                        </div>
                        <p className="cart-subhead">
                            {cartItems.length === 0
                                ? "Nothing here yet — go find something great."
                                : `${cartItems.length} title${cartItems.length !== 1 ? "s" : ""} in your cart`}
                        </p>

                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <div className="icon-wrap">
                                    <BookOpen size={32} />
                                </div>
                                <h5
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        marginBottom: 8,
                                    }}
                                >
                                    Your cart is empty
                                </h5>
                                <p
                                    style={{
                                        color: "var(--ink-muted)",
                                        fontSize: ".9rem",
                                        marginBottom: 24,
                                    }}
                                >
                                    Browse the collection and add something you'll love.
                                </p>
                                <button
                                    className="btn-primary-store"
                                    style={{ fontSize: ".9rem", padding: "10px 20px" }}
                                    onClick={() => navigate("/")}
                                >
                                    Browse Books
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Cart items */}
                                <div>
                                    {cartItems.map((item, idx) => (
                                        <div key={item.bookId} className="cart-item">
                                            <div
                                                className="cart-item-spine"
                                                style={{
                                                    background: [
                                                        "var(--amber)",
                                                        "var(--rust)",
                                                        "var(--sage)",
                                                        "#7b6ea0",
                                                        "#3d7a8a",
                                                    ][idx % 5],
                                                }}
                                            />
                                            <div className="cart-item-info">
                                                <div className="cart-item-title">
                                                    {item.title}
                                                </div>
                                                <div className="cart-item-qty">
                                                    Qty: {item.quantity} ×&nbsp;$
                                                    {item.price.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="cart-item-price">
                                                $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </div>
                                            <button
                                                className="btn-danger-store"
                                                onClick={() =>
                                                    removeFromCart(item.bookId)
                                                }
                                                title="Remove"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="cart-summary">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-total">
                                        <span className="total-label">Total</span>
                                        <span className="total-amount">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                    <button
                                        className="btn-primary-store w-100 mt-3 justify-content-center"
                                        style={{
                                            fontSize: ".92rem",
                                            padding: "12px",
                                        }}
                                    >
                                        Checkout
                                    </button>
                                </div>

                                <div className="mt-3">
                                    <button
                                        className="btn-secondary-store"
                                        onClick={() => navigate("/")}
                                    >
                                        <ArrowLeft size={14} />
                                        Continue Shopping
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <footer className="store-footer">
                <div className="container">
                    © {new Date().getFullYear()} <span>Hilton's Books</span>
                </div>
            </footer>
        </div>
    );
}

export default Cart;