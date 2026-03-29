// Cart.tsx: 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart } = useCart();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <p>You have {cartItems.length} line(s) in your cart</p>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.bookId}>
                                {item.title} — qty {item.quantity} — $
                                {(item.price * item.quantity).toFixed(2)}
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.bookId)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ${total.toFixed(2)}</h3>
                </>
            )}
            <button type="button" className="btn btn-primary mt-2" onClick={() => navigate("/")}>
                Back to Books
            </button>
        </div>
    );
}

export default Cart;
