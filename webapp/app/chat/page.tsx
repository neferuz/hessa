"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MoreHorizontal, Bot, Sparkles } from "lucide-react";
import AIChat from "@/components/AIChat";

export default function ChatPage() {
    const router = useRouter();

    return (
        <main className="h-screen bg-white relative max-w-md mx-auto overflow-hidden flex flex-col font-inter">
            {/* Premium Chat Header */}
            <div className="shrink-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 sticky top-0">
                <div className="px-5 py-4 flex items-center gap-1">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all hover:bg-gray-200"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex-1 flex items-center gap-3 pl-2">
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

                    <button className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all hover:bg-gray-200">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            <AIChat />
        </main>
    );
}
