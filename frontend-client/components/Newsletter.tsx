"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Gift } from "lucide-react";
import styles from "./Newsletter.module.css";
import TextReveal from "./ui/TextReveal";

export default function Newsletter() {
    const [phone, setPhone] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and limit length
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 9) {
            setPhone(value);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className={styles.textContent}>
                        <div className={styles.iconTag}>
                            <Gift size={20} />
                            <span>Ваш подарок</span>
                        </div>
                        <TextReveal>
                            <h2 className={styles.title}>Эксклюзивная скидка 15%</h2>
                        </TextReveal>
                        <p className={styles.desc}>
                            Подпишитесь на нашу рассылку и получите скидку на первый заказ прямо сейчас.
                        </p>
                    </div>

                    <div className={styles.formContainer}>
                        <div className={styles.form}>
                            <div className={styles.inputWrapper}>
                                <span className={styles.phonePrefix}>+998</span>
                                <input
                                    type="tel"
                                    className={styles.input}
                                    placeholder="00 000 00 00"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                />
                            </div>
                            <button className={styles.button}>
                                Получить
                            </button>
                        </div>
                        <p className={styles.agreement}>
                            Нажимая кнопку, вы соглашаетесь с условиями
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
