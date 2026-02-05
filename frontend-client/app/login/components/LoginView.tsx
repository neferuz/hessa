import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Mail, Lock, AlertCircle } from "lucide-react";
import styles from "../page.module.css";
import { ViewState, LoginStep } from "../types";

interface LoginViewProps {
    setView: (view: ViewState) => void;
    authStep: LoginStep;
    setAuthStep: (step: LoginStep) => void;
    email: string;
    setEmail: (email: string) => void;
    otp: string[];
    setOtp: (otp: string[]) => void;
}

export default function LoginView({
    setView,
    authStep,
    setAuthStep,
    email,
    setEmail,
    otp,
    setOtp
}: LoginViewProps) {
    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequestCode = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            const res = await fetch("http://localhost:8000/api/auth/request-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, context: "login" }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.detail || "Не удалось отправить код");
                return;
            }
            // Код отправлен на email
            setAuthStep("otp");
        } catch (e) {
            console.error(e);
            setError("Ошибка сети при отправке кода");
        } finally {
            setIsSubmitting(false);
        }
    };

    const completeEmailLogin = async () => {
        setError(null);
        setIsSubmitting(true);
        const code = otp.join("");
        try {
            const res = await fetch("http://localhost:8000/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, context: "login" }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.detail || "Неверный код");
                return;
            }

            try {
                localStorage.setItem("hessaUser", JSON.stringify(data));
            } catch (e) {
                console.error("Failed to persist login user", e);
            }

            try {
                window.dispatchEvent(new Event("hessaAuthChange"));
            } catch {
                // no-op
            }

            window.location.href = "/";
        } catch (e) {
            console.error(e);
            setError("Ошибка сети при проверке кода");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className={styles.loginWrapper}
        >
            <button
                className={styles.backLink}
                onClick={() => {
                    if (authStep === 'otp') setAuthStep('email');
                    else setView('selection');
                }}
            >
                <ChevronLeft size={16} /> Назад
            </button>

            <div className={styles.loginCard}>
                <AnimatePresence mode="wait">
                    {authStep === 'email' ? (
                        <motion.div
                            key="email-step"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className={styles.iconWrapper} style={{ margin: '0 auto 1.5rem' }}>
                                <Mail size={24} color="#1a1a1a" />
                            </div>
                            <h2 className={styles.cardTitle}>Войти в аккаунт</h2>
                            <p className={styles.cardDesc}>Введите ваш почтовый адрес для получения кода</p>

                            <div className={styles.formGroup}>
                                <input
                                    type="email"
                                    className={styles.inputField}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            {error && authStep === "email" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={styles.errorNotification}
                                >
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                            <button
                                className={styles.actionBtn}
                                disabled={!email.includes('@') || isSubmitting}
                                onClick={handleRequestCode}
                            >
                                {isSubmitting ? "Отправка..." : "Отправить код"}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-step"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className={styles.iconWrapper} style={{ margin: '0 auto 1.5rem' }}>
                                <Lock size={24} color="#1a1a1a" />
                            </div>
                            <h2 className={styles.cardTitle}>Введите код</h2>
                            <p className={styles.cardDesc}>Мы отправили 4-значный код на <strong>{email}</strong></p>

                            <div className={styles.otpGrid}>
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength={1}
                                        className={styles.otpInput}
                                        value={d}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, '');
                                            const n = [...otp];
                                            n[i] = v;
                                            setOtp(n);
                                            if (v && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
                                        }}
                                    />
                                ))}
                            </div>
                            {error && authStep === "otp" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={styles.errorNotification}
                                >
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <button
                                className={styles.actionBtn}
                                disabled={otp.join("").length < 4 || isSubmitting}
                                onClick={completeEmailLogin}
                            >
                                {isSubmitting ? "Проверяем..." : "Продолжить"}
                            </button>

                            <button
                                className={styles.textLink}
                                onClick={() => setAuthStep('email')}
                            >
                                Изменить email
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
