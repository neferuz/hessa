"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AnalysisSheetContextType {
    isOpen: boolean;
    openAnalysis: () => void;
    closeAnalysis: () => void;
    toggleAnalysis: () => void;
}

const AnalysisSheetContext = createContext<AnalysisSheetContextType | undefined>(undefined);

export function AnalysisSheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openAnalysis = () => setIsOpen(true);
    const closeAnalysis = () => setIsOpen(false);
    const toggleAnalysis = () => setIsOpen((prev) => !prev);

    return (
        <AnalysisSheetContext.Provider value={{ isOpen, openAnalysis, closeAnalysis, toggleAnalysis }}>
            {children}
        </AnalysisSheetContext.Provider>
    );
}

export function useAnalysisSheet() {
    const context = useContext(AnalysisSheetContext);
    if (context === undefined) {
        throw new Error("useAnalysisSheet must be used within an AnalysisSheetProvider");
    }
    return context;
}
