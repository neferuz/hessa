import { motion } from "framer-motion";
import styles from "../page.module.css";
import { Sparkles } from "lucide-react";

interface AnalyzingViewProps {
    analyzingText: string;
}

export default function AnalyzingView({ analyzingText }: AnalyzingViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.analyzingWrapper}
            style={{ textAlign: 'center' }}
        >
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 3rem' }}>
                {/* Background pulse */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
                        borderRadius: '50%'
                    }}
                />

                {/* Rotating ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    style={{
                        position: 'absolute', top: 10, left: 10, right: 10, bottom: 10,
                        border: '2px dashed #FFD700',
                        borderRadius: '50%',
                        opacity: 0.3
                    }}
                />

                {/* Main Icon */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        marginLeft: -30,
                        marginTop: -30,
                        width: 60, height: 60,
                        background: '#1a1a1a',
                        borderRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                >
                    <Sparkles color="#FFD700" size={30} />
                </motion.div>
            </div>

            <h2 className={styles.cardTitle} style={{ fontSize: '1.8rem' }}>{analyzingText}</h2>
            <p className={styles.cardDesc}>Алгоритм HESSA подбирает идеальное сочетание на основе ваших данных</p>

            <motion.div
                className={styles.loadingBar}
                style={{
                    width: '100%',
                    maxWidth: 300,
                    height: 6,
                    background: '#f0f0f0',
                    borderRadius: 3,
                    overflow: 'hidden',
                    margin: '0 auto'
                }}
            >
                <motion.div
                    style={{ height: '100%', background: '#1a1a1a' }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4.5, ease: "easeInOut" }}
                />
            </motion.div>
        </motion.div>
    );
}
