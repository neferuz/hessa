"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./Hero.module.css";
import TextReveal from "./ui/TextReveal";

export default function Hero() {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Fetch Slides
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/hero', { cache: 'no-store' });
                const data = await res.json();
                console.log("Hero Data Fetched:", data); // Debug log
                if (data.slides && data.slides.length > 0) {
                    setSlides(data.slides);
                }
            } catch (err) {
                console.error("Failed to fetch hero slides:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    const nextSlide = () => {
        if (slides.length === 0) return;
        setDirection(1);
        setIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        if (slides.length === 0) return;
        setDirection(-1);
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const [lang, setLang] = useState("RU");

    useEffect(() => {
        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        // Initial check
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const current = slides.length > 0 ? slides[index] : null;

    const getText = (base: string, l: string) => {
        if (!current) return "";
        if (l === 'RU') return current[base];
        return current[`${base}_${l.toLowerCase()}`] || current[base];
    };

    // Auto-play
    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [index, slides.length]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-transparent">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
    );

    if (!current) return null;

    // Animation Variants
    const slideVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" },
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
        }),
    };

    const textReveal = {
        hidden: { y: "100%" },
        visible: (delay: number) => ({
            y: "0%",
            transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        })
    };

    return (
        <div className={styles.heroWrapper}>

            {/* 1. TOP HEADLINE (Masked Reveal) */}
            <div className="relative w-full z-10 mb-8 px-4 flex justify-center">
                {/* Key forces remount on slide change to re-trigger GSAP animation */}
                <TextReveal key={current.id} delay={0.1} className="overflow-hidden">
                    <h1 className={styles.bigHeading}>
                        {getText('headline', lang)}
                    </h1>
                </TextReveal>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className={styles.contentGrid}>

                {/* LEFT COLUMN */}
                <div className={styles.leftCol}>
                    <div className="overflow-hidden">
                        <TextReveal key={current.id} delay={0.2}>
                            <p className={styles.descText}>
                                {getText('descriptionLeft', lang)}
                            </p>
                        </TextReveal>
                    </div>

                    <motion.div
                        className={styles.leftActions}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <a href="#" className={styles.linkUnderline}>Learn more</a>
                        <button className={styles.blackPillBtn}>
                            Shop now <div className={styles.arrowCircle}><ArrowRight size={14} /></div>
                        </button>
                    </motion.div>
                </div>

                {/* CENTER COLUMN (PRODUCT + TAGS) */}
                <div className={styles.centerCol}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current.id}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className={styles.productContainer}
                        >
                            {/* Floating Animation Wrapper */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-full h-full flex justify-center items-end"
                            >
                                <Image
                                    src={current.image}
                                    alt="Product"
                                    width={600}
                                    height={800}
                                    className={styles.productImg}
                                    priority
                                />
                            </motion.div>

                            {/* Tags Pop In */}
                            <div className={styles.tagsWrapper}>
                                {current.tags.map((tag: any, i: number) => (
                                    <motion.div
                                        key={`${current.id}-tag-${i}`}
                                        className={styles.floatingTag}
                                        style={{
                                            top: `${tag.y}%`,
                                            left: tag.x < 0 ? 'auto' : `${50 + tag.x / 2}%`,
                                            right: tag.x < 0 ? `${50 + Math.abs(tag.x) / 2}%` : 'auto',
                                        }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                            delay: 0.5 + i * 0.15
                                        }}
                                        whileHover={{ scale: 1.1, cursor: "pointer" }}
                                    >
                                        <div className={styles.tagDot}>{tag.x > 0 ? '+' : '-'}</div>
                                        <span className={styles.tagLabel}>{tag.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN */}
                <div className={styles.rightCol}>
                    <div className="overflow-hidden">
                        <TextReveal key={current.id} delay={0.3}>
                            <p className={styles.descText}>
                                {getText('descriptionRight', lang)}
                            </p>
                        </TextReveal>
                    </div>
                </div>

            </div>

            {/* Navigation Controls & Progress */}
            <div className={styles.controls}>
                <button onClick={prevSlide} className={styles.navBtn}><ArrowLeft /></button>
                {/* Progress Indicators */}
                <div className="flex gap-2 items-center px-4">
                    {slides.map((_, i) => (
                        <div key={i} className="h-1 bg-black/10 w-12 rounded-full overflow-hidden">
                            {i === index && (
                                <motion.div
                                    className="h-full bg-black/80"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 6, ease: "linear" }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={nextSlide} className={styles.navBtn}><ArrowRight /></button>
            </div>
        </div>
    );
}
