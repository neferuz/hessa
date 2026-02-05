"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../catalog/Catalog.module.css"; // Reuse catalog styles

const NEW_PRODUCTS = [
    { id: 101, name: "Premium Vitamin D3 Mini", category: "Vitamins", price: 155000, image: "/vitamins-1.png", brand: "HESSA NEW", badge: "New" },
    { id: 102, name: "Zen Stress Relief", category: "Focus", price: 290000, image: "/vitamins-2.png", brand: "HESSA NEW", badge: "New" },
    { id: 103, name: "Bio-Active B-Complex", category: "Vitamins", price: 245000, image: "/vitamins-3.png", brand: "HESSA NEW", badge: "New" },
    { id: 104, name: "Advanced Joint Support", category: "Sports", price: 420000, image: "/vitamins-1.png", brand: "HESSA NEW", badge: "New" },
];

export default function NewArrivalsPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProducts = NEW_PRODUCTS.filter(p =>
        activeCategory === "All" || p.category === activeCategory
    );

    return (
        <main className={styles.shopContainer}>
            <div className={styles.content}>

                {/* Sidebar Filters */}
                <aside className={styles.filtersSidebar}>
                    <div className={styles.filterSection}>
                        <span className={styles.filterTitle}>Новинки по категориям</span>
                        <ul className={styles.filterList}>
                            {["All", "Vitamins", "Sports", "Focus"].map(cat => (
                                <li
                                    key={cat}
                                    className={`${styles.filterItem} ${activeCategory === cat ? styles.activeFilter : ""}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat === "All" ? "Все новинки" : cat}
                                    <span className={styles.count}>{cat === "All" ? NEW_PRODUCTS.length : NEW_PRODUCTS.filter(p => p.category === cat).length}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.filterSection}>
                        <span className={styles.filterTitle}>Поступление</span>
                        <div className={styles.filterList}>
                            <li className={styles.filterItem}>За последнюю неделю</li>
                            <li className={styles.filterItem}>За месяц</li>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <section className={styles.mainContent}>
                    <div className={styles.gridHeader}>
                        <div>
                            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Новинки</h1>
                            <div className={styles.resultsCount}>
                                Найдено <strong>{filteredProducts.length}</strong> новых поступлений
                            </div>
                        </div>
                        <div className={styles.sorting}>
                            <select className={styles.sortSelect}>
                                <option>Сначала самые новые</option>
                                <option>По цене</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.productGrid}>
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Link href={`/product/${product.id}`} className={styles.productCard}>
                                        <div className={styles.imageWrapper}>
                                            {product.badge && <span className={styles.badge}>{product.badge}</span>}
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={300}
                                                height={400}
                                                className={styles.productImg}
                                            />
                                            {/* КНОПКА "ДОБАВИТЬ" УДАЛЕНА КАК ЗАПРОШЕНО */}
                                        </div>

                                        <div className={styles.productInfo}>
                                            <span className={styles.brand}>{product.brand}</span>
                                            <h3 className={styles.productName}>{product.name}</h3>
                                            <span className={styles.price}>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} сум</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

            </div>
        </main>
    );
}
