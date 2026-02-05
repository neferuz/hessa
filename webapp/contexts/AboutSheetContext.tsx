"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AboutSheetContextType {
    isOpen: boolean;
    openAbout: () => void;
    closeAbout: () => void;
    toggleAbout: () => void;
}

const AboutSheetContext = createContext<AboutSheetContextType | undefined>(undefined);

export function AboutSheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openAbout = () => setIsOpen(true);
    const closeAbout = () => setIsOpen(false);
    const toggleAbout = () => setIsOpen((prev) => !prev);

    return (
        <AboutSheetContext.Provider value={{ isOpen, openAbout, closeAbout, toggleAbout }}>
            {children}
        </AboutSheetContext.Provider>
    );
}

export function useAboutSheet() {
    const context = useContext(AboutSheetContext);
    if (context === undefined) {
        throw new Error("useAboutSheet must be used within a AboutSheetProvider");
    }
    return context;
}
