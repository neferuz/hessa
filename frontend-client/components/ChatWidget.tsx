"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Mail, Phone } from "lucide-react";
import styles from "./ChatWidget.module.css";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        telegram: "",
    });
    const [currentMessage, setCurrentMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // Блокируем прокрутку страницы когда чат открыт
    useEffect(() => {
        if (isOpen) {
            // Сохраняем текущую позицию скролла
            const scrollY = window.scrollY;
            // Блокируем прокрутку страницы
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Восстанавливаем прокрутку страницы
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }, [isOpen]);

    // Обработчик скролла внутри контейнера сообщений
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container || !isOpen || showForm) return;

        const handleWheel = (e: WheelEvent) => {
            const target = e.target as HTMLElement;
            // Проверяем, что событие происходит внутри контейнера сообщений
            if (!container.contains(target) && container !== target) return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtTop = scrollTop <= 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

            // Если мы не на границах, позволяем скролл внутри контейнера
            if (!isAtTop && !isAtBottom) {
                // Разрешаем скролл внутри контейнера
                return;
            }

            // Если на границах, блокируем дальнейшую прокрутку
            if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [isOpen, showForm]);


    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && (formData.email || formData.phone || formData.telegram)) {
            setShowForm(false);
            // Добавляем приветственное сообщение
            setMessages([
                {
                    id: Date.now(),
                    text: `Здравствуйте, ${formData.name}! Чем могу помочь?`,
                    isBot: true,
                    timestamp: new Date(),
                },
            ]);
        }
    };

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: currentMessage,
            isBot: false,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setCurrentMessage("");

        // Имитация ответа бота
        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                text: "Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.",
                isBot: true,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <motion.button
                    className={styles.chatButton}
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <MessageCircle size={24} />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.chatWindow}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderInfo}>
                                <MessageCircle size={20} />
                                <span>Поддержка HESSA</span>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowForm(true);
                                    setMessages([]);
                                    setCurrentMessage("");
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form or Messages */}
                        {showForm ? (
                            <div className={styles.chatForm}>
                                <h3 className={styles.formTitle}>Оставьте свои данные</h3>
                                <form onSubmit={handleFormSubmit} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <User size={16} className={styles.formIcon} />
                                        <input
                                            type="text"
                                            placeholder="Ваше имя *"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <Mail size={16} className={styles.formIcon} />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <Phone size={16} className={styles.formIcon} />
                                        <input
                                            type="tel"
                                            placeholder="Телефон +998"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, "");
                                                if (value.length > 9) value = value.substring(0, 9);
                                                setFormData({ ...formData, phone: value });
                                            }}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <MessageCircle size={16} className={styles.formIcon} />
                                        <input
                                            type="text"
                                            placeholder="Telegram username (без @)"
                                            value={formData.telegram}
                                            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={!formData.name || (!formData.email && !formData.phone && !formData.telegram)}
                                    >
                                        Начать общение
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div ref={messagesContainerRef} className={styles.messagesContainer}>
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className={styles.messageContent}>
                                                <p>{message.text}</p>
                                                <span className={styles.messageTime}>
                                                    {message.timestamp.toLocaleTimeString("ru-RU", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className={styles.inputContainer}>
                                    <input
                                        type="text"
                                        placeholder="Напишите сообщение..."
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className={styles.messageInput}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className={styles.sendButton}
                                        disabled={!currentMessage.trim()}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
