"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSupportSheet } from "@/contexts/SupportSheetContext";
import { X, Phone, Mail, Send, ExternalLink, MessageCircle, HelpCircle } from "lucide-react";
import { useEffect } from "react";

export default function SupportSheet() {
    const { isOpen, closeSupport } = useSupportSheet();

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

    const contactOptions = [
        {
            icon: Phone,
            title: "Позвонить нам",
            subtitle: "+998 71 200 00 00",
            action: "tel:+998712000000",
            color: "bg-green-50 text-green-600",
            btnColor: "bg-green-600",
            btnText: "Позвонить"
        },
        {
            icon: Send,
            title: "Telegram Bot",
            subtitle: "@hessa_support_bot",
            action: "https://t.me/hessa_support_bot",
            color: "bg-blue-50 text-blue-500",
            btnColor: "bg-blue-500",
            btnText: "Написать"
        },
        {
            icon: MessageCircle,
            title: "Telegram Канал",
            subtitle: "Новости и акции",
            action: "https://t.me/hessa_uz",
            color: "bg-sky-50 text-sky-500",
            btnColor: "bg-sky-500",
            btnText: "Перейти"
        },
        {
            icon: Mail,
            title: "Написать на почту",
            subtitle: "support@hessa.uz",
            action: "mailto:support@hessa.uz",
            color: "bg-orange-50 text-orange-500",
            btnColor: "bg-orange-500",
            btnText: "Написать"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSupport}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 h-[60vh] bg-white rounded-t-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col font-inter"
                    >
                        {/* Header */}
                        <div className="shrink-0 px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl absolute top-0 left-0 right-0 z-50 rounded-t-[32px]">
                            <h1 className="text-lg font-bold text-gray-900">Помощь и поддержка</h1>
                            <button
                                onClick={closeSupport}
                                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-24 overflow-y-auto bg-white px-6 pb-10">

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <HelpCircle size={32} className="text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Чем мы можем помочь?</h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                                    Наша служба поддержки работает ежедневно с 09:00 до 21:00
                                </p>
                            </div>

                            <div className="space-y-3">
                                {contactOptions.map((option, index) => (
                                    <a
                                        key={index}
                                        href={option.action}
                                        target={option.action.startsWith("http") ? "_blank" : undefined}
                                        rel={option.action.startsWith("http") ? "noopener noreferrer" : undefined}
                                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[24px] active:scale-[0.98] transition-all group hover:border-gray-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 ${option.color}`}>
                                                <option.icon size={22} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-bold text-gray-900 mb-0.5">{option.title}</span>
                                                <span className="text-[13px] text-gray-500 font-medium">{option.subtitle}</span>
                                            </div>
                                        </div>

                                        <div className={`w-9 h-9 rounded-full ${option.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                                            <ExternalLink size={16} />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[11px] text-gray-400">
                                    Версия приложения 1.0.5 (Build 240)
                                </p>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
