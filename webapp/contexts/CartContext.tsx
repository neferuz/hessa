"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    isInCart: (id: number) => boolean;
    getTotalItems: () => number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            const qtyToAdd = item.quantity || 1;

            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
                );
            }
            return [...prev, { ...item, quantity: qtyToAdd }];
        });
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    const isInCart = (id: number) => {
        return items.some((i) => i.id === id);
    };

    const getTotalItems = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                isInCart,
                getTotalItems,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
