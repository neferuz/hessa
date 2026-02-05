"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOrdersSheet } from "@/contexts/OrdersSheetContext";
import { X, Package, Clock, CheckCircle2, CreditCard, Banknote, ChevronRight, Calendar, ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Mock Data
const orders = [
    {
        id: "ORD-8932",
        date: "28 Янв 2024",
        isoDate: "2024-01-28",
        status: "delivered", // processing, delivered, cancelled
        total: 450000,
        payment: "click", // click, payme, cash
        items: [
            { id: 1, image: "/product_bottle.png", name: "Omega-3 Premium", quantity: 1, price: 200000 },
            { id: 2, image: "/product_bottle.png", name: "Vitamin C 1000mg", quantity: 1, price: 250000 },
        ]
    },
    {
        id: "ORD-8901",
        date: "15 Янв 2024",
        isoDate: "2024-01-15",
        status: "processing",
        total: 125000,
        payment: "cash",
        items: [
            { id: 3, image: "/product_bottle.png", name: "Magnesium B6", quantity: 1, price: 125000 },
        ]
    },
    {
        id: "ORD-8111",
        date: "10 Дек 2023",
        isoDate: "2023-12-10",
        status: "cancelled",
        total: 890000,
        payment: "payme",
        items: [
            { id: 4, image: "/product_bottle.png", name: "MultiVitamin Complex", quantity: 1, price: 400000 },
            { id: 5, image: "/product_bottle.png", name: "Zinc Picolinate", quantity: 1, price: 250000 },
            { id: 6, image: "/product_bottle.png", name: "Iron Gentle", quantity: 2, price: 120000 },
        ]
    }
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case "delivered":
            return { label: "Доставлен", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 };
        case "processing":
            return { label: "В пути", color: "text-blue-600", bg: "bg-blue-50", icon: Clock };
        case "cancelled":
            return { label: "Отменен", color: "text-red-600", bg: "bg-red-50", icon: X };
        default:
            return { label: "Обработка", color: "text-gray-600", bg: "bg-gray-50", icon: Clock };
    }
};

const getPaymentLabel = (method: string) => {
    switch (method) {
        case "click": return "Click";
        case "payme": return "Payme";
        case "cash": return "Наличные";
        default: return "Карта";
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};

// Extracted Order Card
function OrderCard({ order }: { order: any }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const status = getStatusConfig(order.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ borderRadius: 24 }}
            className={`bg-white border rounded-[24px] overflow-hidden transition-all duration-300 ${isExpanded ? "border-gray-200" : "border-gray-100"}`}
        >
            {/* Header (Always Visible) */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 cursor-pointer bg-white active:bg-gray-50 transition-colors"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-lg ${status.bg} flex items-center gap-1.5`}>
                            <status.icon size={12} className={status.color} />
                            <span className={`text-[11px] font-bold uppercase tracking-wide ${status.color}`}>
                                {status.label}
                            </span>
                        </div>
                    </div>
                    <span className="text-[12px] font-medium text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {order.date}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Сумма заказа</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[15px] font-bold text-gray-900">{formatPrice(order.total)}</span>
                            <span className="text-[10px] font-medium text-gray-400">сум</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Оплата</span>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                                {order.payment === "cash" ? <Banknote size={12} className="text-gray-500" /> : <CreditCard size={12} className="text-gray-500" />}
                                <span className="text-[11px] font-bold text-gray-600">{getPaymentLabel(order.payment)}</span>
                            </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Content (Items) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#F9F9FA] border-t border-gray-100"
                    >
                        <div className="p-4 space-y-3">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-[16px] border border-gray-100">
                                    <div className="w-12 h-12 rounded-[12px] bg-[#F5F5F7] shrink-0 flex items-center justify-center p-1">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[13px] font-bold text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap">{item.name}</h4>
                                        <p className="text-[11px] text-gray-500">{item.quantity} шт • {formatPrice(item.price)} сум</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function OrdersSheet() {
    const { isOpen, closeOrders } = useOrdersSheet();
    const [activeStatus, setActiveStatus] = useState("all");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

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

    const statusTabs = [
        { id: "all", label: "Все" },
        { id: "processing", label: "В пути" },
        { id: "delivered", label: "Доставлены" },
        { id: "cancelled", label: "Отменены" },
    ];

    const filteredOrders = orders
        .filter(order => activeStatus === "all" || order.status === activeStatus)
        .sort((a, b) => {
            const dateA = new Date(a.isoDate).getTime();
            const dateB = new Date(b.isoDate).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeOrders}
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
                            <h1 className="text-lg font-bold text-gray-900">Мои заказы</h1>
                            <button
                                onClick={closeOrders}
                                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-20 overflow-y-auto bg-white flex flex-col min-h-0 relative px-6 pb-10">

                            {/* Filters & Sort */}
                            <div className="flex items-center justify-between gap-2 mb-6 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 -mx-2 px-2">
                                <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden flex-1">
                                    {statusTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveStatus(tab.id)}
                                            className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${activeStatus === tab.id
                                                ? "bg-[#1C1C1E] text-white shadow-lg shadow-gray-200"
                                                : "bg-[#F5F5F7] text-gray-500 hover:bg-gray-200"
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                                    className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0 hover:bg-gray-200 text-gray-900"
                                >
                                    <ArrowUpDown size={18} className={sortOrder === "asc" ? "rotate-180" : ""} />
                                </button>
                            </div>

                            {filteredOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 py-10">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Package size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">Ничего не найдено</h3>
                                    <p className="text-sm text-gray-400 text-center max-w-[200px]">
                                        Нет заказов с выбранными параметрами
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {filteredOrders.map((order) => (
                                            <OrderCard key={order.id} order={order} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
