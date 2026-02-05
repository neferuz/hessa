"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAboutSheet } from "@/contexts/AboutSheetContext";
import { X, Leaf, ShieldCheck, Microscope, Award } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function AboutSheet() {
    const { isOpen, closeAbout } = useAboutSheet();

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

    const features = [
        {
            icon: Leaf,
            title: "Натуральность",
            desc: "Используем только органические и проверенные ингредиенты",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            icon: Microscope,
            title: "Научный подход",
            desc: "Разработано совместно с ведущими нутрициологами",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: ShieldCheck,
            title: "Качество",
            desc: "Тройной контроль качества на всех этапах производства",
            color: "text-violet-600",
            bg: "bg-violet-50"
        },
        {
            icon: Award,
            title: "Эффективность",
            desc: "Доказанная эффективность формул и компонентов",
            color: "text-orange-600",
            bg: "bg-orange-50"
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
                        onClick={closeAbout}
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
                        <div className="shrink-0 px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl absolute top-0 left-0 right-0 z-50 rounded-t-[32px]">
                            <h1 className="text-lg font-bold text-gray-900">О компании Hessa</h1>
                            <button
                                onClick={closeAbout}
                                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-24 overflow-y-auto bg-white px-6 pb-10">

                            {/* Hero Image */}
                            <div className="relative w-full h-48 rounded-[24px] overflow-hidden mb-8 shadow-sm">
                                <Image
                                    src="/energy_capsules.png"
                                    alt="Hessa Lab"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <h2 className="text-white font-bold text-xl leading-snug">
                                        Создаем будущее здоровья вместе с вами
                                    </h2>
                                </div>
                            </div>

                            {/* ... (text content skipped in replacement for brevity, targeting specific lines via context if possible, but safer to replace block or use multiple chunks) ... */}
                            {/* Wait, I'll validly use multiple chunks to be precise */}

                            {/* About Text */}
                            <div className="mb-10 space-y-4">
                                <h3 className="text-[20px] font-bold text-gray-900">Hessa — это больше, чем витамины</h3>
                                <p className="text-[15px] text-gray-500 leading-relaxed">
                                    Мы — технологическая компания, которая меняет подход к заботе о здоровье. Используя передовые научные данные и искусственный интеллект, мы создаем персонализированные комплексы витаминов и добавок.
                                </p>
                                <p className="text-[15px] text-gray-500 leading-relaxed">
                                    Наша миссия — сделать профессиональную нутрициологию доступной каждому. Мы верим, что забота о себе должна быть простой, понятной и эффективной.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 gap-4 mb-10">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-[20px] border border-gray-100 bg-white">
                                        <div className={`w-12 h-12 rounded-[16px] ${feature.bg} flex items-center justify-center shrink-0`}>
                                            <feature.icon size={24} className={feature.color} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                                            <p className="text-[13px] text-gray-500 leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Photo Gallery (Grid) */}
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Наше производство</h3>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="aspect-square relative rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100">
                                    <Image src="/product_bottle.png" alt="Lab 1" fill className="object-contain p-4" />
                                </div>
                                <div className="aspect-square relative rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100">
                                    <Image src="/header_pill.png" alt="Lab 2" fill className="object-contain p-2" />
                                </div>
                                <div className="aspect-[2/1] col-span-2 relative rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100">
                                    <Image src="/weight_set.png" alt="Office" fill className="object-contain p-2" />
                                </div>
                            </div>

                            {/* Footer Logo */}
                            <div className="flex flex-col items-center justify-center py-6 border-t border-gray-50">
                                <span className="text-xl font-bold tracking-tight text-gray-900 mb-1">hessa</span>
                                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">Premium Wellness</span>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
