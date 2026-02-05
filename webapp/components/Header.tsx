import { Bell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 pt-5 pb-2 bg-transparent shrink-0 z-50">
            {/* Left Section: Avatar and Greeting */}
            <div className="flex items-center gap-2.5">
                <Link href="/profile" className="relative active:scale-95 transition-transform">
                    <div className="w-10 h-10 rounded-full border border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
                        <User size={20} className="text-gray-400" />
                    </div>
                </Link>
                <div className="flex flex-col justify-center">
                    <span className="text-[12px] text-[#8E8E93] font-medium leading-none mb-1">
                        Доброе утро
                    </span>
                    <span className="text-[16px] font-bold text-[#1C1C1E] leading-none">
                        Feruz Kou
                    </span>
                </div>
            </div>

            {/* Right Section: Circular Notification */}
            <div className="flex items-center">
                <button className="relative w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.04)] active:scale-95 transition-all text-[#1C1C1E]">
                    <Bell size={18} strokeWidth={1.5} />
                    <span className="absolute top-[10px] right-[10px] w-1.5 h-1.5 bg-[#FF3B30] rounded-full ring-2 ring-white" />
                </button>
            </div>
        </header>
    );
}
