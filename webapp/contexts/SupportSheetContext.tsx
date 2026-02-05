"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SupportSheetContextType {
    isOpen: boolean;
    openSupport: () => void;
    closeSupport: () => void;
    toggleSupport: () => void;
}

const SupportSheetContext = createContext<SupportSheetContextType | undefined>(undefined);

export function SupportSheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openSupport = () => setIsOpen(true);
    const closeSupport = () => setIsOpen(false);
    const toggleSupport = () => setIsOpen((prev) => !prev);

    return (
        <SupportSheetContext.Provider value={{ isOpen, openSupport, closeSupport, toggleSupport }}>
            {children}
        </SupportSheetContext.Provider>
    );
}

export function useSupportSheet() {
    const context = useContext(SupportSheetContext);
    if (context === undefined) {
        throw new Error("useSupportSheet must be used within a SupportSheetProvider");
    }
    return context;
}
