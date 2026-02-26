"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X, Calendar as CalendarIcon, Info, Bell, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import clsx from "clsx";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [stats, setStats] = useState({ streak: 0, monthTotal: 0, percentage: 0, missed: 0 });
    const [takenDays, setTakenDays] = useState<Record<string, boolean>>({});
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState("09:00");

    // Load data from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("vitamin_tracker");
        if (saved) setTakenDays(JSON.parse(saved));

        const savedReminder = localStorage.getItem("vitamin_reminders");
        if (savedReminder) {
            const { enabled, time } = JSON.parse(savedReminder);
            setReminderEnabled(enabled);
            setReminderTime(time);
        }
    }, []);

    // Save data to localStorage and recalculate stats
    useEffect(() => {
        localStorage.setItem("vitamin_tracker", JSON.stringify(takenDays));
        calculateStats();
    }, [takenDays]);

    // Save reminders to localStorage
    useEffect(() => {
        localStorage.setItem("vitamin_reminders", JSON.stringify({
            enabled: reminderEnabled,
            time: reminderTime
        }));
    }, [reminderEnabled, reminderTime]);

    const calculateStats = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const dayOfMonth = today.getDate();
        const monthStr = `${year}-${month}`;

        // Month total
        const monthTotal = Object.keys(takenDays).filter(d => d.startsWith(monthStr) && takenDays[d]).length;

        // Progress towards the 30-day goal (100% = 30 days)
        const percentage = Math.round((monthTotal / 30) * 100);
        const missed = dayOfMonth - monthTotal;

        // Streak calculation
        let streak = 0;
        let d = new Date();
        while (true) {
            const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (takenDays[dStr]) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                if (streak === 0) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
                    if (takenDays[yStr]) {
                        d = yesterday;
                        continue;
                    }
                }
                break;
            }
        }

        setStats({ streak, monthTotal, percentage, missed });
    };

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const toggleDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
        setTakenDays(prev => ({
            ...prev,
            [dateStr]: !prev[dateStr]
        }));
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    // Adjust first day to start with Monday (1) instead of Sunday (0)
    let firstDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) days.push(i);

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
    };

    const isTaken = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
        return takenDays[dateStr];
    };

    return (
        <main className="min-h-screen pb-24 bg-[#FAFAFB] relative max-w-md mx-auto overflow-x-hidden pt-8 px-6 font-sans text-[#1C1C1E]">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[22px] font-black tracking-tighter text-[#1C1C1E] uppercase">Трекер</h1>
                    <p className="text-gray-400 text-[12px] font-bold uppercase tracking-wider">Прием витаминов</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center border border-gray-100">
                    <CalendarIcon className="text-blue-600" size={20} />
                </div>
            </header>

            {/* Compliance Progress Section - Flat Premium */}
            <div className="bg-[#1C1C1E] rounded-[32px] p-6 text-white mb-6 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between mb-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1 block">Дисциплина</span>
                        <h2 className="text-3xl font-black leading-none">{stats.percentage}%</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1 block">Пропуски</span>
                        <h2 className="text-xl font-black leading-none text-red-500/90">{stats.missed} <span className="text-[10px] font-bold text-gray-600">дн.</span></h2>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.percentage}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="absolute h-full left-0 top-0 bg-blue-600"
                    />
                </div>
                <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest text-center opacity-70">
                    {stats.percentage >= 80 ? "Идеальный ритм" : "Нужно больше фокуса"}
                </p>
            </div>

            {/* Stats Cards - Integrated */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white p-4 rounded-3xl border border-gray-100">
                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest block mb-1.5">Серия</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-[#1C1C1E]">{stats.streak}</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase">дней</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-gray-100">
                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest block mb-1.5">Месяц</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-[#1C1C1E]">{stats.monthTotal}</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase">раз</span>
                    </div>
                </div>
            </div>

            {/* Calendar Container - Clean Flat */}
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="text-[15px] font-black text-[#1C1C1E] uppercase tracking-wider">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-[9px] font-black text-gray-300 uppercase tracking-widest py-1">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, idx) => (
                        <div key={idx} className="aspect-square flex items-center justify-center relative">
                            {day ? (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleDay(day)}
                                    className={clsx(
                                        "w-full h-full rounded-xl text-[13px] font-bold transition-all flex items-center justify-center relative",
                                        isTaken(day)
                                            ? "bg-blue-600 text-white"
                                            : isToday(day)
                                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                                : "text-[#1C1C1E] hover:bg-gray-50"
                                    )}
                                >
                                    {day}
                                    {isTaken(day) && (
                                        <div className="absolute top-1 right-1">
                                            <div className="w-1 h-1 rounded-full bg-white/50" />
                                        </div>
                                    )}
                                </motion.button>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            {/* Reminder & Info - Compact */}
            <div className="flex flex-col gap-3">
                <div className="bg-white rounded-[28px] p-4 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={clsx(
                            "w-9 h-9 rounded-xl flex items-center justify-center",
                            reminderEnabled ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                        )}>
                            <Bell size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1C1C1E] text-[13px]">Напоминания</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{reminderTime}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setReminderEnabled(!reminderEnabled)}
                        className={clsx(
                            "w-11 h-6 rounded-full relative transition-colors duration-300",
                            reminderEnabled ? "bg-blue-600" : "bg-gray-100"
                        )}
                    >
                        <motion.div
                            animate={{ x: reminderEnabled ? 22 : 2 }}
                            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full"
                        />
                    </button>
                </div>

                <div className="bg-blue-600 rounded-[28px] p-5 text-white flex items-start gap-4">
                    <div className="bg-white/10 p-2 rounded-xl">
                        <Info size={18} />
                    </div>
                    <div>
                        <h4 className="font-black text-[11px] uppercase tracking-widest mb-1 opacity-70">Совет</h4>
                        <p className="text-[13px] font-medium leading-snug opacity-90">
                            Пейте витамины во время завтрака для лучшего усвоения в течение дня.
                        </p>
                    </div>
                </div>
            </div>

            <BottomNav />
        </main>
    );
}
