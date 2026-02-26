"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAnalysisSheet } from "@/contexts/AnalysisSheetContext";
import { X, Clock, CheckCircle2, ChevronRight, MapPin, Pill, Activity, Stethoscope, Download, FileText, User } from "lucide-react";
import { useState, useEffect } from "react";

// Mock Data for Analysis Requests
const analysisRequests = [
    {
        id: "REQ-8932",
        date: "28 Фев 2024",
        isoDate: "2024-02-28",
        status: "completed", // pending, scheduled, completed, canceled
        address: "ул. Амира Темура, 12, кв 45",
        resultFileUrl: "https://example.com/result.pdf",
    },
    {
        id: "REQ-8901",
        date: "25 Фев 2024",
        isoDate: "2024-02-25",
        status: "scheduled",
        address: "ул. Амира Темура, 12, кв 45",
        resultFileUrl: null,
    },
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case "completed":
            return { label: "Завершено", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 };
        case "scheduled":
            return { label: "Запланировано", color: "text-blue-600", bg: "bg-blue-50", icon: Clock };
        case "canceled":
            return { label: "Отменено", color: "text-red-600", bg: "bg-red-50", icon: X };
        default:
            return { label: "Ожидание", color: "text-gray-600", bg: "bg-gray-50", icon: Clock };
    }
};

function AnalysisCard({ req }: { req: any }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const status = getStatusConfig(req.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ borderRadius: 24 }}
            className={`bg-white border rounded-[24px] overflow-hidden transition-all duration-300 ${isExpanded ? "border-gray-200" : "border-gray-100"}`}
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 cursor-pointer bg-white active:bg-gray-50 transition-colors flex flex-col gap-4"
            >
                <div className="flex items-center justify-between">
                    <div className={`px-2.5 py-1 rounded-lg ${status.bg} flex items-center gap-1.5`}>
                        <status.icon size={12} className={status.color} />
                        <span className={`text-[11px] font-bold uppercase tracking-wide ${status.color}`}>
                            {status.label}
                        </span>
                    </div>
                    <span className="text-[12px] font-medium text-gray-400">
                        {req.date}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-gray-900 mb-0.5">Заявка #{req.id}</span>
                        {req.status === 'completed' ? (
                            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                                <FileText size={12} /> Результаты готовы
                            </span>
                        ) : (
                            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                                <Clock size={12} /> Ожидание специалиста
                            </span>
                        )}
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>
                        <ChevronRight size={18} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#F9F9FA] border-t border-gray-100"
                    >
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-[16px] border border-gray-100">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F5F5F7] shrink-0 flex items-center justify-center text-gray-400">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Адрес выезда</p>
                                    <h4 className="text-[13px] font-bold text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap">{req.address}</h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3 rounded-[16px] border border-gray-100">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F5F5F7] shrink-0 flex items-center justify-center text-gray-400">
                                    <User size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Пациент</p>
                                    <h4 className="text-[13px] font-bold text-gray-900">Александр Иванов</h4>
                                </div>
                            </div>

                            {req.status === 'completed' && req.resultFileUrl && (
                                <a
                                    href={req.resultFileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full mt-2 h-[44px] bg-[#1C1C1E] text-white rounded-[16px] flex items-center justify-center gap-2 font-bold text-[13px] active:scale-[0.98] transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download size={16} />
                                    Скачать результат
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function AnalysisSheet() {
    const { isOpen, closeAnalysis } = useAnalysisSheet();
    const [requests, setRequests] = useState(analysisRequests);
    const [isRequesting, setIsRequesting] = useState(false);

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

    const handleNewRequest = () => {
        setIsRequesting(true);
        setTimeout(() => {
            const newReq = {
                id: `REQ-${Math.floor(Math.random() * 10000)}`,
                date: new Date().toLocaleDateString("ru-RU", { day: 'numeric', month: 'short', year: 'numeric' }),
                isoDate: new Date().toISOString(),
                status: "pending",
                address: "ул. Примерная, 10",
                resultFileUrl: null,
            };
            setRequests([newReq, ...requests]);
            setIsRequesting(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAnalysis}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col font-inter"
                    >
                        <div className="shrink-0 px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl absolute top-0 left-0 right-0 z-50 rounded-t-[32px]">
                            <h1 className="text-lg font-bold text-gray-900">Анализы на дому</h1>
                            <button
                                onClick={closeAnalysis}
                                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 pt-20 overflow-y-auto bg-white flex flex-col min-h-0 relative px-6 pb-24">
                            {/* Premium Call to Action */}
                            <div className="mb-6 bg-[#1C1C1E] rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl shadow-gray-200">
                                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-blue-600/30 blur-[50px] rounded-full pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-[16px] flex items-center justify-center mb-4">
                                        <Stethoscope size={24} className="text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Вызвать специалиста</h3>
                                    <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                                        Наши специалисты приедут к вам в удобное время, возьмут все необходимые анализы, и результаты появятся здесь.
                                    </p>
                                    <button
                                        onClick={handleNewRequest}
                                        disabled={isRequesting}
                                        className="w-full h-12 bg-white text-[#1C1C1E] rounded-[20px] font-bold text-[15px] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isRequesting ? (
                                            <div className="w-5 h-5 border-2 border-[#1C1C1E] border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <MapPin size={18} />
                                                Оставить заявку
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4 mt-2">
                                <h3 className="text-[15px] font-bold text-gray-900">Ваши заявки</h3>
                                <div className="px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] font-bold text-gray-500">
                                    {requests.length}
                                </div>
                            </div>

                            {requests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 py-10">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Activity size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">Заявок пока нет</h3>
                                    <p className="text-sm text-gray-400 text-center max-w-[200px]">
                                        Вы еще не вызывали специалиста на дом
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {requests.map((req) => (
                                            <AnalysisCard key={req.id} req={req} />
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
