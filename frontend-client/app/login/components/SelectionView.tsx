import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight, Bot } from "lucide-react";
import Image from "next/image";
import styles from "../page.module.css";
import { ViewState } from "../types";

interface SelectionViewProps {
    setView: (view: ViewState) => void;
}

export default function SelectionView({ setView }: SelectionViewProps) {
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { opacity: 1, scale: 1 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }}
            className={styles.splitWrapper}
        >
            {/* Left Panel: Primary Actions */}
            <div className={styles.leftPanel}>
                <motion.div variants={itemVariants}>
                    <h1 className={styles.mainTitle} style={{ textAlign: 'inherit' }}>HESSA</h1>
                </motion.div>

                <motion.p variants={itemVariants} className={styles.subtitle} style={{ textAlign: 'inherit' }}>
                    Персональный подбор витаминов и нутрицевтиков на основе ваших биоритмов
                </motion.p>

                <div className={styles.selectionButtons}>
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={styles.primaryBtn}
                        onClick={() => setView('quiz')}
                    >
                        <Sparkles size={20} style={{ position: 'absolute', left: '1.5rem' }} />
                        <span style={{ flex: 1, textAlign: 'center' }}>Подобрать программу</span>
                        <ArrowRight size={18} style={{ position: 'absolute', right: '1.5rem', opacity: 0.5 }} />
                    </motion.button>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={styles.secondaryBtn}
                        onClick={() => setView('login')}
                    >
                        <Mail size={20} />
                        <span>Войти в аккаунт</span>
                    </motion.button>
                </div>

                <motion.p
                    variants={itemVariants}
                    style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#999', cursor: 'default' }}
                >
                    Уже более 10,000 человек нашли свою формулу здоровья
                </motion.p>
            </div>

            {/* Right Panel: Telegram Bot Promo */}
            <motion.div
                className={styles.rightPanel}
                variants={itemVariants}
            >
                <div className={styles.botTag}>Telegram Bot</div>

                <div className={styles.qrImageWrapper}>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image
                            src="/qr-code.jpeg"
                            alt="Hessa Telegram Bot QR Code"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>
                </div>

                <h3 className={styles.botTitle}>Hessa Bot</h3>
                <p className={styles.botDesc}>
                    Сканируйте QR-код, чтобы перейти в наш Telegram-бот и получить доступ к эксклюзивным материалам.
                </p>

                <button
                    className={styles.secondaryBtn}
                    style={{ background: 'transparent', border: '1px solid #eee', marginTop: '1.5rem', width: 'auto', padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}
                    onClick={() => window.open('https://t.me/hessa_bot', '_blank')}
                >
                    <Bot size={18} style={{ marginRight: '0.5rem' }} />
                    <span>Открыть в Telegram</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
