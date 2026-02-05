"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import styles from "./Catalog.module.css";

interface Product {
    id: number;
    name: string;
    description_short: string;
    sale_price: number;
    images: string[];
    category_id: number;
    category?: {
        name: string;
    }
}

interface Category {
    id: number;
    name: string;
}

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch('http://localhost:8000/api/products'),
                    fetch('http://localhost:8000/api/categories')
                ]);
                const prodData = await prodRes.json();
                const catData = await catRes.json();
                setProducts(prodData);
                setCategories(catData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = activeCategory
        ? products.filter(p => p.category_id === activeCategory)
        : products;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const getImageUrl = (url: string | undefined) => {
        if (!url) return "/placeholder-product.png";
        if (url.startsWith("http")) return url;
        if (url.startsWith("/static")) return `http://localhost:8000${url}`;
        return url; // Assume it's in public folder if not /static
    };

    return (
        <main className={styles.shopContainer}>
            <Navbar />

            <div className={styles.content}>
                {/* Desktop Sidebar */}
                <aside className={styles.filtersSidebar}>
                    <div className={styles.filterSection}>
                        <span className={styles.filterTitle}>Категории</span>
                        <ul className={styles.filterList}>
                            <li
                                className={`${styles.filterItem} ${activeCategory === null ? styles.activeFilter : ""}`}
                                onClick={() => setActiveCategory(null)}
                            >
                                <span>Все</span>
                                <span className={styles.count}>{products.length}</span>
                            </li>
                            {categories.map(cat => (
                                <li
                                    key={cat.id}
                                    className={`${styles.filterItem} ${activeCategory === cat.id ? styles.activeFilter : ""}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    <span>{cat.name}</span>
                                    <span className={styles.count}>
                                        {products.filter(p => p.category_id === cat.id).length}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <section className={styles.mainContent}>
                    <div className={styles.gridHeader}>
                        <div className={styles.headerItem}>
                            <TextReveal>
                                <h1 className={styles.pageTitle}>Каталог</h1>
                            </TextReveal>
                            <div className={styles.resultsValue}>
                                <strong>{filteredProducts.length}</strong> товаров найдено
                            </div>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            className={styles.mobileFilterBtn}
                            onClick={() => setShowFilters(true)}
                        >
                            <Filter size={18} />
                            <span>Фильтры</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className={styles.loaderWrapper}>
                            <motion.div
                                className={styles.loader}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    ) : (
                        <motion.div
                            className={styles.productGrid}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={activeCategory || 'all'}
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                        layout
                                        className={styles.productCard}
                                    >
                                        <Link href={`/product/${product.id}`} className={styles.imageLink}>
                                            <div className={styles.imageWrapper}>
                                                <Image
                                                    src={getImageUrl(product.images?.[0])}
                                                    alt={product.name}
                                                    fill
                                                    className={styles.productImg}
                                                />
                                            </div>
                                        </Link>

                                        <div className={styles.productInfo}>
                                            <div className={styles.nameRow}>
                                                <h3 className={styles.productName}>{product.name}</h3>
                                                <span className={styles.price}>
                                                    {product.sale_price.toLocaleString()} сум
                                                </span>
                                            </div>
                                            <p className={styles.productCategory}>
                                                {product.category?.name || "Витамины"}
                                            </p>

                                            <button className={styles.addBtn}>
                                                <ShoppingBag size={18} />
                                                <span>Добавить</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {filteredProducts.length === 0 && !loading && (
                        <div className={styles.noResults}>
                            <h3>Товары не найдены</h3>
                            <p>Попробуйте выбрать другую категорию</p>
                            <Button onClick={() => setActiveCategory(null)} variant="outline" className="mt-4">
                                Сбросить фильтры
                            </Button>
                        </div>
                    )}
                </section>
            </div>

            {/* Mobile Filter Sheet */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            className={styles.modalOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                        />
                        <motion.div
                            className={styles.bottomSheet}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <div className={styles.sheetHandle} />
                            <div className={styles.sheetHeader}>
                                <h2 className={styles.sheetTitle}>Категории</h2>
                                <button className={styles.closeBtn} onClick={() => setShowFilters(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={styles.filterSection}>
                                <ul className={styles.filterList}>
                                    <li
                                        className={`${styles.filterItem} ${activeCategory === null ? styles.activeFilter : ""}`}
                                        onClick={() => {
                                            setActiveCategory(null);
                                            setShowFilters(false);
                                        }}
                                    >
                                        <span>Все товары</span>
                                        <span className={styles.count}>{products.length}</span>
                                    </li>
                                    {categories.map(cat => (
                                        <li
                                            key={cat.id}
                                            className={`${styles.filterItem} ${activeCategory === cat.id ? styles.activeFilter : ""}`}
                                            onClick={() => {
                                                setActiveCategory(cat.id);
                                                setShowFilters(false);
                                            }}
                                        >
                                            <span>{cat.name}</span>
                                            <span className={styles.count}>
                                                {products.filter(p => p.category_id === cat.id).length}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
