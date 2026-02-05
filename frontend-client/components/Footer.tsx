"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Send, Phone, MapPin, Mail, ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    const [footer, setFooter] = useState<any>(null);
    const [lang, setLang] = useState("RU");

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/content');
                const data = await res.json();
                if (data.footer) setFooter(data.footer);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFooter();

        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const getTranslated = (baseField: string) => {
        if (!footer) return "";
        if (lang === 'RU') return footer[baseField];
        return footer[`${baseField}_${lang.toLowerCase()}`] || footer[baseField];
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* 1. SECTION: MAIN NAVIGATION */}
                <div className={styles.mainGrid}>
                    <div className={styles.brandInfo}>
                        <Link href="/" className={styles.logo}>HESSA</Link>
                        <p className={styles.brandSlogan}>
                            {getTranslated('slogan') || "Здоровье — это искусство гармонии с собой и природой каждый день."}
                        </p>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>Коллекции</h4>
                        <div className={styles.linkList}>
                            <Link href="/catalog" className={styles.navLink}>Энергия</Link>
                            <Link href="/catalog" className={styles.navLink}>Иммунитет</Link>
                            <Link href="/catalog" className={styles.navLink}>Спокойствие</Link>
                            <Link href="/catalog" className={styles.navLink}>Красота</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>Сервис</h4>
                        <div className={styles.linkList}>
                            <Link href="/delivery" className={styles.navLink}>Доставка</Link>
                            <Link href="/return" className={styles.navLink}>Возврат</Link>
                            <Link href="/faq" className={styles.navLink}>FAQ</Link>
                            <Link href="/track" className={styles.navLink}>Отследить</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>Бренд</h4>
                        <div className={styles.linkList}>
                            <Link href="/about" className={styles.navLink}>О нас</Link>
                            <Link href="/contacts" className={styles.navLink}>Контакты</Link>
                            <Link href="/blog" className={styles.navLink}>Блог</Link>
                            <Link href="/partnership" className={styles.navLink}>Партнерам</Link>
                        </div>
                    </div>
                </div>

                {/* 2. SECTION: CONTACT & SOCIALS */}
                <div className={styles.contactRow}>
                    <div className={styles.contactGroup}>
                        <span className={styles.contactLabel}>Связаться с нами</span>
                        <a href={`tel:${footer?.phone?.replace(/\D/g, '')}`} className={styles.contactValue}>
                            {footer?.phone || "+998 (90) 123-4567"}
                        </a>
                    </div>

                    <div className={styles.contactGroup}>
                        <span className={styles.contactLabel}>Напишите нам</span>
                        <a href={`mailto:${footer?.email}`} className={styles.contactValue}>
                            {footer?.email || "hello@hessa.uz"}
                        </a>
                    </div>

                    <div className={styles.contactGroup}>
                        <span className={styles.contactLabel}>Мы в соцсетях</span>
                        <div className={styles.socialIcons}>
                            <a href={footer?.instagram || "#"} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href={footer?.telegram || "#"} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="Telegram">
                                <Send size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. SECTION: UTILITY BAR */}
                <div className={styles.bottomBar}>
                    <div className={styles.legalLinks}>
                        <span>{footer?.copyright_text || "© 2024 HESSA Inc."}</span>
                        <Link href="/privacy" className={styles.legalLink}>Политика конфиденциальности</Link>
                        <Link href="/terms" className={styles.legalLink}>Условия использования</Link>
                        <span className={styles.poweredBy}>Powered by Pro AI</span>
                    </div>

                    <div className={styles.contactGroup} style={{ alignItems: 'flex-end' }}>
                        <span className={styles.contactLabel}>Локация</span>
                        <span className={styles.contactValue} style={{ fontSize: '1rem' }}>
                            {getTranslated('location') || "Ташкент, Узбекистан"}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
