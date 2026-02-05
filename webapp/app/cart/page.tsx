"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MoreHorizontal, Trash2, Minus, Plus, ShoppingBag, X, CreditCard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { API_BASE_URL } from "@/lib/config";


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

export default function CartPage() {
    const router = useRouter();
    const { items, updateQuantity, removeItem, getTotalItems } = useCart();
    const [showVoucher, setShowVoucher] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 15000;
    const total = subtotal + shipping;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-white pb-32 max-w-md mx-auto relative overflow-hidden font-inter">
                {/* Clean Header */}
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="px-6 py-5 flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft size={24} className="text-gray-900" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Корзина</h1>
                        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <MoreHorizontal size={24} className="text-gray-900" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
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
                        onClick={() => router.push("/")}
                        className="h-14 bg-[#1C1C1E] text-white rounded-[24px] px-10 flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-gray-200"
                    >
                        <span className="text-[16px] font-bold">Перейти к покупкам</span>
                        <ArrowRight size={20} />
                    </button>
                </div>

            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white max-w-md mx-auto relative overflow-hidden font-inter flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="px-6 py-5 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Корзина</h1>
                    <div className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-400">
                        {getTotalItems()}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col pt-4 px-6 pb-40">
                <div className="flex-1">
                    <div className="space-y-8">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex gap-5 items-start"
                                >
                                    {/* Product Image */}
                                    <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center shrink-0 relative overflow-hidden ring-1 ring-gray-100">
                                        <Image
                                            src={getApiImageUrl(item.image)}
                                            alt={item.name}
                                            fill
                                            unoptimized
                                            className="object-contain p-3"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[96px] py-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="space-y-1">
                                                <h3 className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                                                    120 шт • 250 мл
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div className="text-[17px] font-bold text-gray-900">
                                                {formatPrice(item.price)} <span className="text-[12px] font-normal text-gray-400">cум</span>
                                            </div>

                                            {/* Quantity Selector */}
                                            <div className="flex items-center bg-gray-50 rounded-xl p-0.5 border border-gray-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                                >
                                                    <Minus size={14} strokeWidth={2.5} />
                                                </button>
                                                <span className="w-6 text-center text-sm font-bold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                                >
                                                    <Plus size={14} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Add More Button */}
                    <div className="mt-8">
                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <Plus size={16} strokeWidth={3} />
                            Добавить ещё товаров
                        </button>
                    </div>
                </div>

                <div className="mt-auto pt-10">
                    {/* Promo Code Input */}
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

            {/* Bottom Payment Block - Premium Dark Style (BottomNav) */}
            <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-6">
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

        </main>
    );
}
