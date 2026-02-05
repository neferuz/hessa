"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface OrdersSheetContextType {
    isOpen: boolean;
    openOrders: () => void;
    closeOrders: () => void;
    toggleOrders: () => void;
}

const OrdersSheetContext = createContext<OrdersSheetContextType | undefined>(undefined);

export function OrdersSheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openOrders = () => setIsOpen(true);
    const closeOrders = () => setIsOpen(false);
    const toggleOrders = () => setIsOpen((prev) => !prev);

    return (
        <OrdersSheetContext.Provider value={{ isOpen, openOrders, closeOrders, toggleOrders }}>
            {children}
        </OrdersSheetContext.Provider>
    );
}

export function useOrdersSheet() {
    const context = useContext(OrdersSheetContext);
    if (context === undefined) {
        throw new Error("useOrdersSheet must be used within a OrdersSheetProvider");
    }
    return context;
}
