"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    HelpCircle,
    Info,
    Calendar,
    Crown,
    Stethoscope,
    Package,
    ChevronRight,
    Settings,
    User
} from "lucide-react";
import { useOrdersSheet } from "@/contexts/OrdersSheetContext";
import { useSupportSheet } from "@/contexts/SupportSheetContext";
import { useAboutSheet } from "@/contexts/AboutSheetContext";
import { useAnalysisSheet } from "@/contexts/AnalysisSheetContext";
import BottomNav from "@/components/BottomNav";

import { Suspense } from "react";

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { openOrders } = useOrdersSheet();
    const { openSupport } = useSupportSheet();
    const { openAbout } = useAboutSheet();
    const { openAnalysis } = useAnalysisSheet();
    const [user] = useState({
        name: "Александр Иванов",
        phone: "+998 90 123 45 67",
        plan: "Hessa Premium", // Can be null or string
        daysLeft: 24,
        purchaseDate: "10.01.2024"
    });

    useEffect(() => {
        const open = searchParams.get("open");
        if (open === "orders") {
            openOrders();
        }
    }, [searchParams, openOrders]);

    const menuItems = [
        { id: "orders", icon: Package, label: "Мои заказы", href: "#" },
        { id: "analysis", icon: Stethoscope, label: "Анализы на дому", href: "#" },
        { id: "support", icon: HelpCircle, label: "Помощь и поддержка", href: "#" },
        { id: "settings", icon: Settings, label: "Настройки", href: "#" },
        { id: "about", icon: Info, label: "О Hessa", href: "#" },
    ];

    return (
        <main className="h-screen bg-white max-w-md mx-auto relative overflow-hidden flex flex-col font-inter">
            {/* Header */}
            <div className="shrink-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="px-6 py-4 flex items-center justify-center">
                    <h1 className="text-[15px] font-bold text-gray-900">Профиль</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-40">

                {/* User Info */}
                <div className="flex flex-col items-center pt-8 mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center relative overflow-hidden ring-4 ring-white shadow-sm mb-4">
                        <User size={48} className="text-gray-300" />
                    </div>
                    <h2 className="text-[22px] font-bold text-gray-900 mb-1">{user.name}</h2>
                    <p className="text-sm text-gray-500 font-medium">{user.phone}</p>
                </div>

                {/* Plan Card */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ваш план</h3>
                    {user.plan ? (
                        <div className="bg-[#1C1C1E] rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl shadow-gray-200">
                            {/* Decorative gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex items-start justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Crown size={20} className="text-blue-400" fill="currentColor" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold leading-none mb-1">{user.plan}</h4>
                                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Активный</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase mb-1">Осталось дней</p>
                                    <div className="text-2xl font-bold">{user.daysLeft}</div>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase mb-1">Дата покупки</p>
                                    <div className="text-lg font-bold text-gray-300 flex items-center gap-1.5 mt-0.5">
                                        <Calendar size={14} />
                                        {user.purchaseDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] p-6 border border-gray-100 flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Crown size={28} className="text-blue-600" fill="currentColor" />
                            </div>
                            <h4 className="text-[18px] font-bold text-gray-900 mb-2">Hessa Premium</h4>
                            <p className="text-[14px] text-gray-500 mb-6 leading-relaxed max-w-[240px]">
                                Персональные рекомендации и доступ к эксклюзивным товарам.
                            </p>
                            <button className="w-full h-12 bg-[#1C1C1E] text-white rounded-[20px] font-bold text-[15px] active:scale-95 transition-all shadow-lg shadow-gray-200">
                                Посмотреть тарифы
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (item.id === "orders") {
                                    openOrders();
                                } else if (item.id === "analysis") {
                                    openAnalysis();
                                } else if (item.id === "support") {
                                    openSupport();
                                } else if (item.id === "about") {
                                    openAbout();
                                }
                            }}
                            className="w-full h-[76px] bg-white border border-gray-100 rounded-[28px] px-5 flex items-center justify-between active:scale-[0.98] transition-all group hover:border-gray-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1C1C1E] group-hover:bg-[#1C1C1E] group-hover:text-white transition-all duration-300">
                                    <item.icon size={22} strokeWidth={2} />
                                </div>
                                <span className="font-bold text-[#1C1C1E] text-[16px] tracking-tight">{item.label}</span>
                            </div>
                            <div className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#1C1C1E] group-hover:border-[#1C1C1E] transition-all">
                                <ChevronRight size={18} strokeWidth={2.5} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <BottomNav />
        </main>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="h-screen bg-white flex items-center justify-center">Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
