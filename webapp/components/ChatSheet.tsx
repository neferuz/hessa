"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/contexts/ChatContext";
import AIChat from "./AIChat";
import { X, Bot, Sparkles } from "lucide-react";

export default function ChatSheet() {
    const { isOpen, closeChat } = useChat();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeChat}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="shrink-0 px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl absolute top-0 left-0 right-0 z-50 rounded-t-[32px]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white relative shadow-sm ring-2 ring-gray-100/50">
                                    <Bot size={20} strokeWidth={1.5} />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-[#34C759] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center gap-0.5">
                                    <h1 className="text-[15px] font-extrabold text-[#1C1C1E] leading-none flex items-center gap-1.5">
                                        Hessa AI
                                    </h1>
                                    <span className="text-[11px] font-semibold text-gray-400/90 leading-none tracking-wide">
                                        Персональный нутрициолог
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={closeChat}
                                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 pt-20 flex flex-col min-h-0 bg-white">
                            <AIChat />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
