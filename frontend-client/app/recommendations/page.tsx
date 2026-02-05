"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Image from "next/image";
import styles from "../login/page.module.css";
import { recommendedProducts, durations, regions, trustBlocks } from "../login/data";
import Footer from "@/components/Footer";

export default function RecommendationsPage() {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [duration, setDuration] = useState(1);
    
    // Checkout Form State
    const [checkoutForm, setCheckoutForm] = useState({
        name: '',
        email: '',
        phone: '',
        region: 'Ташкент',
        address: '',
        comment: ''
    });
    const [paymentMethod, setPaymentMethod] = useState<'payme' | 'click'>('payme');

    // Загружаем ответы из localStorage при монтировании
    useEffect(() => {
        const savedAnswers = localStorage.getItem('quizAnswers');
        if (savedAnswers) {
            try {
                const parsed = JSON.parse(savedAnswers);
                setAnswers(parsed);
                // Заполняем имя из ответов викторины
                if (parsed['name']) {
                    setCheckoutForm(prev => ({ ...prev, name: parsed['name'] }));
                }
            } catch (e) {
                console.error("Failed to parse saved answers", e);
            }
        } else {
            router.push('/quiz');
        }
    }, [router]);

    // Расчеты
    const productsSum = recommendedProducts.reduce((sum, prod) => sum + parseInt(prod.price.replace(/\D/g, '')), 0);
    const discount = durations.find(d => d.id === duration)?.discount || 0;
    const totalMultiplied = productsSum * duration;
    const finalPrice = totalMultiplied - (totalMultiplied * discount);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('998')) {
            value = value.substring(3);
        }
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        setCheckoutForm(prev => ({ ...prev, phone: value }));
    };

    const handleSubmit = () => {
        // Валидация
        if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
            alert("Пожалуйста, заполните все обязательные поля");
            return;
        }
        if (checkoutForm.phone.length !== 9) {
            alert("Пожалуйста, введите корректный номер телефона");
            return;
        }
        
        // Сохраняем данные заказа в localStorage для профиля
        const checkoutData = {
            duration,
            address: checkoutForm.address,
            region: checkoutForm.region,
            name: checkoutForm.name,
            email: checkoutForm.email,
            phone: checkoutForm.phone,
            purchaseDate: new Date().toISOString(),
        };
        localStorage.setItem("hessaCheckout", JSON.stringify(checkoutData));
        
        alert("Заказ успешно оформлен!");
    };

    return (
        <div className={styles.pageWrapper} style={{ background: '#ffffff' }}>
            <div className={styles.recommendationsLayout}>
                {/* Левая часть - Продукты */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className={styles.recsWrapper}
                >
                    <div className={styles.recsHeader}>
                        <h2 className={styles.title}>Ваша программа готова</h2>
                        <p className={styles.subtitle}>Оптимальный курс для ваших целей.</p>
                    </div>

                    {/* Product Grid */}
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
                                        <Image src={prod.image} alt={prod.name} width={80} height={80} objectFit="contain" />
                                    </div>
                                    <div className={styles.recImageInfo}>
                                        <h3 className={styles.recName}>{prod.name}</h3>
                                        <p className={styles.recDesc}>{prod.desc}</p>
                                        <p className={styles.recPrice}>{prod.price} <span style={{ fontSize: '0.8em', color: '#999' }}>/ мес</span></p>
                                    </div>
                                    <div className={styles.checkCircle} style={{ background: '#1a1a1a', borderColor: '#1a1a1a' }}>
                                        <Check size={14} color="white" />
                                    </div>
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

                {/* Правая часть - Форма оформления */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.checkoutSidebar}
                >
                    <div className={styles.checkoutSidebarContent}>
                        <h3 className={styles.checkoutSidebarTitle}>Оформление заказа</h3>

                        {/* Выбор тарифа */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Период курса</label>
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
                        </div>

                        {/* Имя */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Получатель *</label>
                            <input
                                className={styles.inputField}
                                placeholder="ФИО"
                                value={checkoutForm.name}
                                onChange={e => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        {/* Email */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email *</label>
                            <input
                                type="email"
                                className={styles.inputField}
                                placeholder="name@example.com"
                                value={checkoutForm.email}
                                onChange={e => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>

                        {/* Телефон */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Телефон (Telegram) *</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ 
                                    padding: '0.75rem 1rem', 
                                    background: '#f5f5f5', 
                                    borderRadius: '12px',
                                    fontFamily: 'var(--font-manrope), sans-serif',
                                    fontSize: '0.95rem',
                                    color: '#666'
                                }}>+998</span>
                                <input
                                    type="tel"
                                    className={styles.inputField}
                                    placeholder="901234567"
                                    value={checkoutForm.phone}
                                    onChange={handlePhoneChange}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>

                        {/* Регион */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Регион *</label>
                            <select
                                className={styles.inputField}
                                value={checkoutForm.region}
                                onChange={e => setCheckoutForm(prev => ({ ...prev, region: e.target.value }))}
                            >
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        {/* Адрес */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Адрес доставки *</label>
                            <input
                                className={styles.inputField}
                                placeholder="Улица, дом, квартира"
                                value={checkoutForm.address}
                                onChange={e => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                            />
                        </div>

                        {/* Комментарий */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Комментарий</label>
                            <textarea
                                className={styles.inputField}
                                placeholder="Дополнительная информация"
                                rows={3}
                                value={checkoutForm.comment}
                                onChange={e => setCheckoutForm(prev => ({ ...prev, comment: e.target.value }))}
                                style={{ resize: 'vertical', minHeight: '80px' }}
                            />
                        </div>

                        {/* Способ оплаты */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Способ оплаты *</label>
                            <div className={styles.paymentMethods}>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'payme' ? styles.methodActive : ''}`}
                                    onClick={() => setPaymentMethod('payme')}
                                >
                                    <span>Payme</span>
                                </div>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'click' ? styles.methodActive : ''}`}
                                    onClick={() => setPaymentMethod('click')}
                                >
                                    <span>Click</span>
                                </div>
                            </div>
                        </div>

                        {/* Итого */}
                        <div className={styles.checkoutSidebarTotal}>
                            <div className={styles.totalRow}>
                                <span>Итого ({duration} мес):</span>
                                <span className={styles.totalPriceBig}>{finalPrice.toLocaleString('ru-RU')} сум</span>
                            </div>
                        </div>

                        {/* Кнопка оплаты */}
                        <button className={styles.primaryActionBtn} onClick={handleSubmit}>
                            Оплатить {finalPrice.toLocaleString('ru-RU')} сум
                        </button>
                    </div>
                </motion.div>
            </div>
            
            {/* Footer */}
            <div style={{ width: '100%', marginTop: '3rem' }}>
                <Footer />
            </div>
        </div>
    );
}
