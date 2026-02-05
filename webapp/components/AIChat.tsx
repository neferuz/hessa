"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, Loader2, ArrowUp, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import Typewriter from "./Typewriter";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setMessages([
                { role: "assistant", content: "Здравствуйте! Я ваш персональный нутрициолог Hessa. Спросите меня о наших продуктах или расскажите о своем самочувствии, и я подберу лучшее решение." }
            ]);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");

        // Add user message
        const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const history = newMessages.map(m => ({ role: m.role, content: m.content }));

            const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: history })
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Извините, что-то пошло не так. Попробуйте еще раз." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden relative font-inter h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-40 scroll-smooth">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto flex-row"}`}
                    >
                        {/* Avatar */}
                        {/* Avatar */}
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-auto mb-1 bg-[#F5F5F7] text-[#1C1C1E]">
                                <Bot size={16} />
                            </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`py-3.5 px-5 text-[15px] leading-relaxed relative ${msg.role === "user"
                            ? "bg-[#1C1C1E] text-white rounded-[24px] rounded-br-[4px] shadow-lg shadow-gray-200"
                            : "bg-[#F5F5F7] text-[#1C1C1E] rounded-[24px] rounded-bl-[4px]"
                            }`}>
                            {msg.role === "assistant" ? <Typewriter text={msg.content} speed={20} /> : msg.content}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mr-auto max-w-[90%]">
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[#F5F5F7] text-[#1C1C1E] mt-auto mb-1">
                            <Bot size={16} />
                        </div>
                        <div className="bg-[#F5F5F7] py-4 px-6 rounded-[24px] rounded-bl-[4px]">
                            <div className="flex gap-1.5 text-[#1C1C1E]">
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-[#1C1C1E] rounded-full" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#1C1C1E] rounded-full" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#1C1C1E] rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area - Premium Dark Glass Style */}
            <div className="absolute bottom-0 left-0 right-0 z-40 px-6 pb-6 flex justify-center pointer-events-none">
                <div className="pointer-events-auto w-full max-w-sm bg-[#1C1C1E]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 rounded-[32px] p-2 flex items-end gap-2 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Написать сообщение..."
                        className="flex-1 bg-transparent max-h-[120px] min-h-[48px] py-3.5 pl-5 text-[15px] font-medium text-white placeholder:text-gray-500 outline-none resize-none scrollbar-hide"
                        rows={1}
                        style={{ height: "48px" }} // Initial height
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="w-12 h-12 shrink-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-blue-600/20"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={24} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
