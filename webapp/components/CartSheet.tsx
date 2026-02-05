"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartSheet } from "@/contexts/CartSheetContext";
import { useCart } from "@/contexts/CartContext";
import { X, ShoppingBag, Plus, Minus, ArrowRight, MoreHorizontal, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react"; // Import necessary icons
import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Reuse the helper
const getApiImageUrl = (url?: string) => {
    if (!url) return "/product_bottle.png";
    if (url === "/product_bottle.png") return "/product_bottle.png";
    if (url.startsWith('http')) return url;
    if (url.startsWith('/static/') || url.startsWith('static/')) {
        const cleanUrl = url.startsWith('/') ? url : '/' + url;
        return `${API_BASE_URL}${cleanUrl}`;
    }
    return "/product_bottle.png";
};

export default function CartSheet() {
    const { isOpen, closeCart } = useCartSheet();
    const router = useRouter(); // Although we are inside a sheet, buttons might navigate elsewhere
    const { items, updateQuantity, removeItem, getTotalItems } = useCart();
    const [showVoucher, setShowVoucher] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 15000;
    const total = subtotal + shipping;

    const visibleItems = isExpanded ? items : items.slice(0, 3);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col font-inter"
                    >
                        {/* Header */}
                        <div className="shrink-0 px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl absolute top-0 left-0 right-0 z-50 rounded-t-[32px]">
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-bold text-gray-900">Корзина</h1>
                                <div className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white text-xs font-bold">
                                    {getTotalItems()}
                                </div>
                            </div>

                            <button
                                onClick={closeCart}
                                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content Area with Scroll */}
                        <div className="flex-1 pt-20 overflow-y-auto bg-white flex flex-col min-h-0 relative">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 px-6 min-h-[50vh]">
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 bg-[#F5F5F7] rounded-[32px] flex items-center justify-center text-gray-900 rotate-[-6deg] shadow-sm">
                                            <ShoppingBag size={42} strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white border-4 border-white rotate-[6deg]">
                                            <span className="text-lg font-bold">0</span>
                                        </div>
                                    </div>

                                    <h2 className="text-[22px] font-bold text-[#1C1C1E] mb-3 text-center tracking-tight">
                                        Ваша корзина пуста
                                    </h2>
                                    <p className="text-gray-400 text-center mb-10 max-w-[260px] text-[15px] leading-relaxed">
                                        Похоже, вы еще ничего не выбрали. Самое время начать шопинг!
                                    </p>

                                    <button
                                        onClick={closeCart}
                                        className="h-14 bg-[#1C1C1E] text-white rounded-[24px] px-10 flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-gray-200"
                                    >
                                        <span className="text-[16px] font-bold">Перейти к покупкам</span>
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col px-6 pb-40">
                                    {/* Items List */}
                                    <div className="space-y-6 mb-4">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            {visibleItems.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex gap-4 items-start"
                                                >
                                                    {/* Product Image */}
                                                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 relative overflow-hidden ring-1 ring-gray-100">
                                                        <Image
                                                            src={getApiImageUrl(item.image)}
                                                            alt={item.name}
                                                            fill
                                                            unoptimized
                                                            className="object-contain p-2"
                                                        />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 min-h-[80px]">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div className="space-y-0.5">
                                                                <h3 className="text-[14px] font-bold text-gray-900 leading-tight line-clamp-2">
                                                                    {item.name}
                                                                </h3>
                                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                                                    120 шт • 250 мл
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-end justify-between mt-2">
                                                            <div className="text-[15px] font-bold text-gray-900">
                                                                {formatPrice(item.price)} <span className="text-[11px] font-normal text-gray-400">cум</span>
                                                            </div>

                                                            {/* Quantity Selector */}
                                                            <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                                                >
                                                                    <Minus size={12} strokeWidth={2.5} />
                                                                </button>
                                                                <span className="w-5 text-center text-xs font-bold text-gray-900">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                                                >
                                                                    <Plus size={12} strokeWidth={2.5} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Expand/Collapse Button */}
                                    {items.length > 3 && (
                                        <div className="flex justify-center mb-6">
                                            <button
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-[13px] font-bold text-gray-600 transition-all active:scale-95"
                                            >
                                                <span>{isExpanded ? "Свернуть" : `Показать еще (${items.length - 3})`}</span>
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </div>
                                    )}

                                    {/* Add More Button */}
                                    <div className="mb-6">
                                        <button
                                            onClick={closeCart}
                                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Plus size={16} strokeWidth={3} />
                                            Добавить ещё товаров
                                        </button>
                                    </div>

                                    <div className="mt-auto">
                                        {/* Promo Code Input */}
                                        <div className="mb-6">
                                            <button
                                                onClick={() => setShowVoucher(!showVoucher)}
                                                className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-[#1C1C1E] active:bg-gray-50 transition-colors rounded-xl px-2 -mx-2"
                                            >
                                                <span className="font-bold text-[15px]">Есть промокод?</span>
                                                <div className={`w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center transition-transform duration-300 ${showVoucher ? "rotate-45" : ""}`}>
                                                    <Plus size={16} className="text-[#1C1C1E]" />
                                                </div>
                                            </button>
                                            <AnimatePresence>
                                                {showVoucher && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="relative flex items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Введите промокод"
                                                                className="w-full h-14 bg-[#F5F5F7] rounded-[22px] pl-5 pr-14 text-[16px] font-bold text-[#1C1C1E] placeholder-gray-400/80 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1C1C1E]/5 transition-all border border-transparent focus:border-gray-200"
                                                            />
                                                            <button className="absolute right-2 w-10 h-10 bg-[#1C1C1E] text-white rounded-full flex items-center justify-center active:scale-90 transition-all shadow-lg hover:bg-gray-800">
                                                                <ArrowRight size={20} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Pricing Summary Breakdown */}
                                        <div className="bg-[#F5F5F7] rounded-[24px] p-5 space-y-3 mb-6">
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-[14px] font-semibold text-gray-400">Сумма заказа</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-[16px] font-bold text-[#1C1C1E]">{formatPrice(subtotal)}</span>
                                                    <span className="text-[12px] font-medium text-gray-400">сум</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-[14px] font-semibold text-gray-400">Доставка</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-[16px] font-bold text-[#1C1C1E]">{formatPrice(shipping)}</span>
                                                    <span className="text-[12px] font-medium text-gray-400">сум</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Payment Bar */}
                        {items.length > 0 && (
                            <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-6">
                                <div className="pointer-events-auto w-full max-w-sm bg-[#1C1C1E]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 rounded-[32px] p-2 pl-6 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">К оплате</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-[20px] font-bold text-white tracking-tight">{formatPrice(total)}</span>
                                            <span className="text-[14px] font-medium text-gray-400">сум</span>
                                        </div>
                                    </div>
                                    <button className="h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] px-7 flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/30 group">
                                        <span className="text-[15px] font-bold whitespace-nowrap">Оформить</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
