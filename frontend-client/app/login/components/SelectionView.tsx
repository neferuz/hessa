import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight } from "lucide-react";
import styles from "../page.module.css";
import { ViewState } from "../types";

interface SelectionViewProps {
    setView: (view: ViewState) => void;
}

export default function SelectionView({ setView }: SelectionViewProps) {
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
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
            transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.1 }}
            className={styles.selectionWrapper}
        >
            <motion.div variants={itemVariants}>
                <h1 className={styles.mainTitle}>HESSA</h1>
            </motion.div>

            <motion.p variants={itemVariants} className={styles.subtitle}>
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
                    <Sparkles size={20} style={{ position: 'absolute', left: '1.2rem' }} />
                    <span style={{ flex: 1, textAlign: 'center' }}>Подобрать программу</span>
                    <ArrowRight size={18} style={{ position: 'absolute', right: '1.2rem', opacity: 0.5 }} />
                </motion.button>

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.secondaryBtn}
                    onClick={() => setView('login')}
                >
                    <Mail size={20} />
                    <span>Войти через Email</span>
                </motion.button>
            </div>

            <motion.p
                variants={itemVariants}
                style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#999', cursor: 'default' }}
            >
                Уже более 10,000 человек нашли свою формулу здоровья
            </motion.p>
        </motion.div>
    );
}
