import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Image from "next/image";
import styles from "../page.module.css";
import { ViewState, Product } from "../types";
import { durations, trustBlocks } from "../data";
import Footer from "@/components/Footer";

interface RecommendationViewProps {
    setView: (view: ViewState) => void;
    recommendedProducts: Product[];
    duration: number;
    setDuration: (duration: number) => void;
}

export default function RecommendationView({ setView, recommendedProducts, duration, setDuration }: RecommendationViewProps) {
    const productsSum = recommendedProducts.reduce((sum, prod) => sum + parseInt(String(prod.price).replace(/\D/g, '')), 0);
    const discount = durations.find(d => d.id === duration)?.discount || 0;
    const totalMultiplied = productsSum * duration;
    const finalPrice = totalMultiplied - (totalMultiplied * discount);

    return (
        <div className={styles.recommendationsLayout}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.recsWrapper}>
                <div className={styles.recsHeader}>
                    <h2 className={styles.title}>Ваша программа готова</h2>
                    <p className={styles.subtitle}>Оптимальный курс для ваших целей.</p>
                </div>

                {/* Duration Selector */}
                <div className={styles.durationGrid}>
                    {durations.map(d => (
                        <div
                            key={d.id}
                            className={`${styles.durationCard} ${duration === d.id ? styles.durationActive : ''}`}
                            onClick={() => setDuration(d.id)}
                        >
                            <span className={styles.durationLabel}>{d.label}</span>
                            {d.discount > 0 && <span className={styles.discountBadge}>-{d.discount * 100}%</span>}
                        </div>
                    ))}
                </div>

                {/* Product Grid with Animation */}
                <div className={styles.recsGrid}>
                    <AnimatePresence>
                        {recommendedProducts.map((prod, idx) => (
                            <motion.div
                                key={prod.id}
                                className={styles.recCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className={styles.recImageWrapper}>
                                    <Image src={prod.image || '/assets/default-product.png'} alt={prod.name} fill style={{ objectFit: 'contain' }} />
                                </div>
                                <div className={styles.recImageInfo}>
                                    <h3 className={styles.recName}>{prod.name}</h3>
                                    <p className={styles.productDesc}>{prod.desc}</p>
                                    <p className={styles.recPrice}>{prod.price} <span style={{ fontSize: '0.8em', color: '#999' }}>/ мес</span></p>
                                </div>
                                <div className={styles.checkCircle} style={{ background: '#1a1a1a', borderColor: '#1a1a1a' }}><Check size={14} color="white" /></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Reviews & Trust */}
                <div className={styles.trustSection}>
                    <div className={styles.reviewsHeader}>
                        <div className={styles.ratingBadge}>
                            <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>4.9</span>
                            <Sparkles size={16} fill="#FFD700" color="#FFD700" />
                        </div>
                        <p className={styles.reviewsSub}>95% оценили эффект от курса</p>
                        <p className={styles.reviewsLink}>1083 отзывов</p>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statVal}>96%</span>
                            <span className={styles.statLabel}>Грамотный подбор</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statVal}>93%</span>
                            <span className={styles.statLabel}>Удобно принимать</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statVal}>95%</span>
                            <span className={styles.statLabel}>Улучшилось самочувствие</span>
                        </div>
                    </div>

                    <h3 className={styles.trustTitle}>Почему доверяют HESSA</h3>
                    <div className={styles.trustGrid}>
                        {trustBlocks.map((tb, idx) => (
                            <div key={idx} className={styles.trustCard} style={{ background: tb.color }}>
                                <h4 className={styles.trustCardTitle} style={{ color: tb.textColor }}>{tb.title}</h4>
                                <p className={styles.trustCardDesc} style={{ color: tb.textColor, opacity: 0.8 }}>{tb.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Checkout Sidebar - Right Side */}
            <motion.div
                className={styles.checkoutSidebar}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
            >
                <div className={styles.checkoutSidebarContent}>
                    <h3 className={styles.checkoutSidebarTitle}>Ваш заказ</h3>
                    <div className={styles.checkoutSidebarTotal}>
                        <div className={styles.totalRow}>
                            <span>Итого ({duration} мес):</span>
                            <span className={styles.totalPriceBig}>{finalPrice.toLocaleString('ru-RU')} сум</span>
                        </div>
                    </div>
                    <button className={styles.primaryActionBtn} onClick={() => setView('checkout')}>
                        Оформить заказ
                    </button>
                </div>
            </motion.div>

            <div style={{ width: '100%', marginTop: '3rem', gridColumn: '1 / -1' }}>
                <Footer />
            </div>
        </div>
    );
}
