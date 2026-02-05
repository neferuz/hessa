"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Product.module.css";

const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Daily Balance Multi",
        category: "Vitamins",
        price: 145000,
        images: ["/vitamins-2.png", "/vitamins-3.png", "/vitamins-1.png"],
        brand: "HESSA CORE",
        badge: "Best Seller",
        description: "Комплекс незаменимых витаминов и минералов для ежедневной поддержки вашего организма. Оптимизированная формула для максимального усвоения.",
        details: "60 капсул в упаковке. Принимать по 1 капсуле 2 раза в день во время еды.",
        volumeOptions: ["30 Capsules", "60 Capsules", "120 Capsules"]
    },
    {
        id: 2,
        name: "Pure Whey Isolate",
        category: "Sports",
        price: 420000,
        images: ["/vitamins-3.png", "/vitamins-1.png", "/vitamins-2.png"],
        brand: "HESSA PERFORMANCE",
        badge: "New",
        description: "Максимально очищенный изолят сывороточного белка с минимальным содержанием лактозы, жиров и углеводов.",
        details: "900г в упаковке. Высокое содержание BCAA.",
        volumeOptions: ["500g", "900g", "1.8kg"]
    }
];

const DRAWER_CONTENT = {
    "Детали и применение": (
        <div className={styles.drawerText}>
            <h4>Как использовать</h4>
            <p>Принимайте по одной порции (1 капсула) два раза в день вместе с едой. Для максимального эффекта рекомендуется регулярный прием в течение 30-60 дней.</p>
            <h4>Состав</h4>
            <p>Витамин А, Витамин С, Витамин D3, Витамин Е, Магний, Цинк, Селен и комплекс растительных экстрактов для иммунитета.</p>
            <h4>Меры предосторожности</h4>
            <p>Не превышайте рекомендуемую дозу. Хранить в недоступном для детей месте при температуре не выше 25°C.</p>
        </div>
    ),
    "Доставка и Возврат": (
        <div className={styles.drawerText}>
            <h4>Доставка по Ташкенту</h4>
            <p>Доставка осуществляется в течение 2-4 часов с момента подтверждения заказа. Стоимость доставки — 25 000 сум. При заказе от 500 000 сум — доставка бесплатная.</p>
            <h4>Доставка по Узбекистану</h4>
            <p>Отправка через курьерские службы (BTS, Fargo) в течение 24 часов. Срок доставки 1-3 рабочих дня.</p>
            <h4>Возврат и Обмен</h4>
            <p>Вы можете вернуть или обменять товар в течение 14 дней, если упаковка не была вскрыта и сохранен товарный вид.</p>
        </div>
    )
};

export default function ProductContent({ id }: { id: string }) {
    const product = PRODUCTS_DATA.find(p => p.id === Number(id)) || PRODUCTS_DATA[0];

    const [selectedVolume, setSelectedVolume] = useState(product.volumeOptions[1]);
    const [activeImage, setActiveImage] = useState(0);
    const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

    const priceFormatted = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <main className={styles.productContainer}>
            <div className={styles.content}>

                {/* Left Side: Gallery */}
                <div className={styles.gallery}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            className={styles.mainImage}
                            key={activeImage}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={product.images[activeImage]}
                                alt={product.name}
                                width={800}
                                height={1000}
                                className={styles.displayImg}
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className={styles.imageGrid}>
                        {product.images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                className={`${styles.subImage} ${activeImage === idx ? styles.activeImageThumb : ""}`}
                                onClick={() => setActiveImage(idx)}
                                whileHover={{ opacity: 0.8 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ cursor: 'pointer' }}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} view ${idx}`}
                                    width={400}
                                    height={400}
                                    className={styles.displayImg}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Details */}
                <motion.div
                    className={styles.productInfo}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div className={styles.categoryLabel} variants={itemVariants}>
                        {product.category} — {product.brand}
                    </motion.div>

                    <motion.h1 className={styles.productName} variants={itemVariants}>
                        {product.name}
                    </motion.h1>

                    <motion.div className={styles.metaRow} variants={itemVariants}>
                        <span className={styles.priceLabel}>Стоимость</span>
                        <div className={styles.price}>{priceFormatted} сум</div>
                    </motion.div>

                    <motion.div className={styles.description} variants={itemVariants}>
                        {product.description}
                    </motion.div>

                    {/* Volume selection */}
                    <motion.div className={styles.optionSection} variants={itemVariants}>
                        <div className={styles.optionHeader}>
                            <span className={styles.optionTitle}>Размер / Объём</span>
                            <span className={styles.sizeGuide}>Таблица размеров</span>
                        </div>
                        <div className={styles.optionsGrid}>
                            {product.volumeOptions.map(opt => (
                                <motion.div
                                    key={opt}
                                    className={`${styles.optionItem} ${selectedVolume === opt ? styles.activeOption : ""}`}
                                    onClick={() => setSelectedVolume(opt)}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {opt}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Accordions */}
                    <div className={styles.accordion}>
                        {["Детали и применение", "Доставка и Возврат"].map((item, i) => (
                            <motion.div
                                key={i}
                                className={styles.accordionItem}
                                variants={itemVariants}
                                whileHover={{ x: 3, color: "#000" }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setActiveDrawer(item)}
                            >
                                <div className={styles.accordionHeader}>
                                    <span className={styles.accordionTitle}>{item}</span>
                                    <Plus size={10} opacity={0.4} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Actions */}
                    <motion.div className={styles.actions} variants={itemVariants}>
                        <motion.button
                            className={styles.primaryBtn}
                            whileHover={{ backgroundColor: "#19482E" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Добавить в корзину
                        </motion.button>
                        <motion.button
                            className={styles.secondaryBtn}
                            whileHover={{ backgroundColor: "#000", color: "#fff" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Heart size={16} />
                        </motion.button>
                        <motion.button
                            className={styles.secondaryBtn}
                            whileHover={{ backgroundColor: "#000", color: "#fff" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Share2 size={16} />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Recommendations Section */}
            <motion.section
                className={styles.recommendations}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className={styles.recHeader}>
                    <span className={styles.recLabel}>Вам может понравиться</span>
                    <h2 className={styles.recTitle}>Рекомендуемые товары</h2>
                </div>

                <div className={styles.recGrid}>
                    {/* Showing all available products + placeholders to make it 4 */}
                    {PRODUCTS_DATA.map((rec) => (
                        <Link
                            key={rec.id}
                            href={`/product/${rec.id}`}
                            className={styles.recCard}
                        >
                            <div className={styles.recImageWrapper}>
                                {rec.badge && <span className={styles.recBadge}>{rec.badge}</span>}
                                <button className={styles.recLikeBtn} onClick={(e) => e.preventDefault()}>
                                    <Heart size={16} />
                                </button>
                                <Image
                                    src={rec.images[0]}
                                    alt={rec.name}
                                    width={300}
                                    height={300}
                                    className={styles.recImg}
                                />
                            </div>
                            <div className={styles.recInfo}>
                                <div className={styles.recNameRow}>
                                    <span className={styles.recName}>{rec.name}</span>
                                    <span className={styles.recPrice}>{rec.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} сум</span>
                                </div>
                                <span className={styles.recCategory}>{rec.category}</span>
                            </div>
                        </Link>
                    ))}

                    {/* Additional placeholders to reach 4 items if needed */}
                    {[1, 2].map((i) => (
                        <div key={`placeholder-${i}`} className={styles.recCard} style={{ opacity: 0.6 }}>
                            <div className={styles.recImageWrapper}>
                                <Image
                                    src={i === 1 ? "/vitamins-2.png" : "/vitamins-3.png"}
                                    alt="Product"
                                    width={300}
                                    height={300}
                                    className={styles.recImg}
                                />
                            </div>
                            <div className={styles.recInfo}>
                                <div className={styles.recNameRow}>
                                    <span className={styles.recName}>Premium Formula</span>
                                    <span className={styles.recPrice}>Soon сум</span>
                                </div>
                                <span className={styles.recCategory}>Hessa Core</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Bottom Sheet Drawer */}
            <AnimatePresence>
                {activeDrawer && (
                    <>
                        <motion.div
                            className={styles.drawerOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveDrawer(null)}
                        />
                        <motion.div
                            className={styles.drawer}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        >
                            <div className={styles.drawerHandle} />
                            <div className={styles.drawerHeader}>
                                <span className={styles.drawerTitle}>{activeDrawer}</span>
                                <button className={styles.drawerClose} onClick={() => setActiveDrawer(null)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div className={styles.drawerBody}>
                                {DRAWER_CONTENT[activeDrawer as keyof typeof DRAWER_CONTENT]}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}
