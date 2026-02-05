"use client";
import { Home, ShoppingCart, MessageCircle, User, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useChat } from "@/contexts/ChatContext";
import { useCartSheet } from "@/contexts/CartSheetContext";
import clsx from "clsx";

export default function BottomNav() {
    const pathname = usePathname();
    const { getTotalItems } = useCart();
    const { isOpen: isChatOpen, toggleChat } = useChat();
    const { isOpen: isCartOpen, toggleCart } = useCartSheet();
    const totalItems = getTotalItems();

    const navItems = [
        { id: "home", icon: Home, href: "/", label: "Главная" },
        { id: "quiz", icon: Brain, href: "/quiz", label: "Викторина" },
        { id: "chat", icon: MessageCircle, href: "/chat", label: "Чат" },
        { id: "cart", icon: ShoppingCart, href: "/cart", label: "Корзина" },
        { id: "profile", icon: User, href: "/profile", label: "Профиль" },
    ];

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
            <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl rounded-[32px] px-2 py-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
                {navItems.map((item) => {
                    const isChat = item.id === "chat";
                    const isCart = item.id === "cart";

                    const isActive = isChat
                        ? isChatOpen
                        : isCart
                            ? isCartOpen
                            : pathname === item.href;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={(e) => {
                                if (isChat) {
                                    e.preventDefault();
                                    toggleChat();
                                } else if (isCart) {
                                    e.preventDefault();
                                    toggleCart();
                                }
                            }}
                            className={clsx(
                                "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                isActive ? "bg-blue-600 shadow-lg shadow-blue-600/40 translate-y-[-2px]" : "hover:bg-white/5"
                            )}
                        >
                            <item.icon
                                size={22}
                                strokeWidth={1.5}
                                className={isActive ? "text-white" : "text-gray-500"}
                            />
                            {isCart && totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#FF3B30] rounded-full flex items-center justify-center border-2 border-[#1C1C1E] px-1">
                                    <span className="text-[9px] font-black text-white leading-none">
                                        {totalItems}
                                    </span>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
