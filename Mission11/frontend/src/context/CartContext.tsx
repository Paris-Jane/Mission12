import { useState, createContext, useContext } from "react";
import type { CartItem } from "../types/CartItem";

interface CartContextType {
    cartItems: CartItem[]; // Array of cart items
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    
    const addToCart = (item: CartItem) => {
        setCartItems((prevCart) => {
            const existing = prevCart.find((i) => i.bookId === item.bookId);
            if (existing) {
                return prevCart.map((i) =>
                    i.bookId === item.bookId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevCart, item];
        });
    };

    const removeFromCart = (bookId: number) => {
        setCartItems((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
    };
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};