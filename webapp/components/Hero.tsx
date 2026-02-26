"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
    const [index, setIndex] = useState(0);
    const phrases = [
        "Здоровье и Эстетика",
        "Природа и Наука",
        "Баланс и Энергия",
        "Красота и Сила"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (
        <section className="px-6 pt-4 pb-12 relative overflow-hidden">
            <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 block">
                    Премиальный уход
                </span>
                <div className="h-[80px] mb-4 relative">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={phrases[index]}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-[38px] font-black leading-[1] text-gray-900 tracking-[-0.04em] absolute inset-0"
                        >
                            {phrases[index].split(" ").map((word, i) => (
                                i === 1 ? <br key={i} /> : word + " "
                            ))}
                        </motion.h1>
                    </AnimatePresence>
                </div>
                <p className="text-sm text-gray-400 font-medium max-w-[200px] leading-relaxed mb-8">
                    Инновационные решения для вашего долголетия и красоты
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/quiz" className="group flex items-center gap-3 bg-[#1C1C1E] text-white pl-2 pr-6 py-2 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] active:scale-95 transition-all w-fit border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors relative z-10">
                            <Sparkles size={18} className="text-white" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Персонально</span>
                            <span className="text-sm font-bold tracking-wide leading-none">Подобрать витамины</span>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all ml-2" />
                    </Link>
                </motion.div>
            </div>

            {/* Premium Floating Element */}
            <div className="absolute top-0 right-[-20px] w-56 h-56 z-0 opacity-80 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl rounded-full" />
                <Image
                    src="/removemedicince.png"
                    alt="Health"
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.15)] animate-float-slow"
                />
            </div>
        </section>
    );
}
