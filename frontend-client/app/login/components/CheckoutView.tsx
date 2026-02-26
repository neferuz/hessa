import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import styles from "../page.module.css";
import { ViewState, PaymentMethod, Product } from "../types";
import { regions, durations } from "../data";

interface CheckoutViewProps {
    setView: (view: ViewState) => void;
    recommendedProducts: Product[];
    duration: number;
    checkoutForm: {
        name: string;
        region: string;
        address: string;
        comment: string;
    };
    setCheckoutForm: (form: any) => void;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    answers: Record<string, string>;
}

export default function CheckoutView({
    setView,
    recommendedProducts,
    duration,
    checkoutForm,
    setCheckoutForm,
    paymentMethod,
    setPaymentMethod,
    answers
}: CheckoutViewProps) {
    const productsSum = recommendedProducts.reduce((sum, prod) => sum + parseInt(String(prod.price).replace(/\D/g, '')), 0);
    const discount = durations.find(d => d.id === duration)?.discount || 0;
    const totalMultiplied = productsSum * duration;
    const finalPrice = totalMultiplied - (totalMultiplied * discount);

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className={styles.checkoutWrapper}>
            <button className={styles.backLink} onClick={() => setView('recommendation')} style={{ alignSelf: 'center', marginBottom: '1rem' }}>
                <ChevronLeft size={16} /> Назад к программе
            </button>
            <h2 className={styles.cardTitle}>Оформление</h2>

            <div className={styles.formGroup}>
                <label className={styles.label}>Получатель</label>
                <input
                    className={styles.inputField}
                    placeholder="ФИО"
                    value={checkoutForm.name || answers['name'] || ''}
                    onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Регион</label>
                <select
                    className={styles.inputField}
                    value={checkoutForm.region}
                    onChange={e => setCheckoutForm({ ...checkoutForm, region: e.target.value })}
                >
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Адрес доставки</label>
                <input
                    className={styles.inputField}
                    placeholder="Улица, дом, квартира"
                    value={checkoutForm.address}
                    onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Способ оплаты</label>
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

            <button className={styles.actionBtn} onClick={() => alert("Заказ успешно оформлен!")}>
                Оплатить {finalPrice.toLocaleString('ru-RU')} сум
            </button>
        </motion.div>
    );
}
