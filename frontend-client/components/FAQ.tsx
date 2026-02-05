"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "./FAQ.module.css";

import TextReveal from "./ui/TextReveal";

const faqData = [
    {
        question: "Как правильно принимать витамины Hessa?",
        answer: "Мы рекомендуем принимать одну капсулу в день во время или сразу после завтрака, запивая стаканом воды. Это обеспечит оптимальное усваивание активных компонентов в течение дня."
    },
    {
        question: "Через какое время я почувствую эффект?",
        answer: "Витамины имеют накопительный эффект. Большинство наших клиентов замечают первые изменения в уровне энергии и качестве сна через 14-20 дней регулярного приема. Полный курс обычно рассчитан на 30-60 дней."
    },
    {
        question: "Вся ли продукция сертифицирована?",
        answer: "Да, абсолютно вся продукция Hessa проходит строгий лабораторный контроль и имеет государственные сертификаты соответствия. Мы используем только проверенное сырье из Европы и США на собственном производстве в Москве."
    },
    {
        question: "Есть ли противопоказания?",
        answer: "Наши комплексы безопасны для большинства людей, однако мы всегда рекомендуем проконсультироваться с врачом перед началом приема, особенно во время беременности, кормления грудью или при наличии хронических заболеваний."
    },
    {
        question: "Как осуществляется доставка по Узбекистану?",
        answer: "Мы доставляем заказы по всему Узбекистану через курьерские службы. По Ташкенту доставка занимает от 2 до 6 часов, в другие регионы — от 1 до 3 рабочих дней."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <TextReveal>
                        <h2 className={styles.title}>Частые вопросы</h2>
                    </TextReveal>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Всё, что вы хотели знать о нашей продукции и сервисе
                    </motion.p>
                </div>

                <div className={styles.accordion}>
                    {faqData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <button
                                className={styles.questionButton}
                                onClick={() => toggleItem(index)}
                                aria-expanded={activeIndex === index}
                            >
                                <div className={styles.questionHeader}>
                                    <span className={styles.number}>0{index + 1}</span>
                                    <span className={styles.questionText}>{item.question}</span>
                                </div>
                                <div className={`${styles.iconCircle} ${activeIndex === index ? styles.active : ""}`}>
                                    <ChevronDown size={20} strokeWidth={2} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        className={styles.answerWrapper}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                    >
                                        <div className={styles.answerContent}>
                                            <div className={styles.answerInner}>
                                                {item.answer}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
