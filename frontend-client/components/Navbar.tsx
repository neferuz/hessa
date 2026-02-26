"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState("RU");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);

    // Expose currentLang to window for Hero.tsx to use (simplest way without global context refactor)
    useEffect(() => {
        (window as any).currentLang = currentLang;
        window.dispatchEvent(new Event("langChange"));
    }, [currentLang]);

    // Track scroll with requestAnimationFrame for performance
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMobileMenuOpen]);

    // Simple фронтовая "авторизация" через localStorage
    useEffect(() => {
        const readUser = () => {
            try {
                const raw = localStorage.getItem("hessaUser");
                if (!raw) {
                    setUserEmail(null);
                    return;
                }
                const parsed = JSON.parse(raw);
                setUserEmail(parsed?.email || null);
            } catch {
                setUserEmail(null);
            }
        };

        readUser();

        const handler = () => readUser();
        window.addEventListener("hessaAuthChange", handler as EventListener);
        return () => window.removeEventListener("hessaAuthChange", handler as EventListener);
    }, []);

    const languages = [
        { code: "RU", label: "Русский" },
        { code: "UZ", label: "O'zbek" },
        { code: "EN", label: "English" },
    ];

    const menuItems = [
        { name: "Главная", slug: "/" },
        { name: "Каталог", slug: "/catalog" },
        { name: "О нас", slug: "/about" },
        { name: "Компании", slug: "/companies" },
        { name: "Контакты", slug: "/contacts" },
    ];

    const shortEmail = userEmail ? userEmail.split("@")[0] : "";

    return (
        <>
            <motion.nav
                className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className={styles.container}>
                    {/* MOBILE LEFT: Burger */}
                    <button
                        className={styles.mobileBurger}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Menu"
                    >
                        <Menu size={24} strokeWidth={1.5} />
                    </button>

                    {/* LEFT: Navigation Menu (Desktop Junk) */}
                    <div className={styles.leftSection}>
                        <ul className={styles.desktopMenu}>
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.slug} className={styles.menuLink}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CENTER: Logo */}
                    <div className={styles.logoWrapper}>
                        <Link href="/" className={styles.logo}>
                            HESSA
                        </Link>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className={styles.rightSection}>
                        <div className={styles.actions}>
                            {/* Language Switcher */}
                            <div className={styles.langWrapper} onClick={() => setLangOpen(!langOpen)}>
                                <button className={styles.langBtn}>
                                    <Globe size={18} strokeWidth={1.5} />
                                    <span>{currentLang}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {langOpen && (
                                        <motion.div
                                            className={styles.langDropdown}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    className={styles.langOption}
                                                    onClick={() => setCurrentLang(lang.code)}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Login / Profile */}
                            {userEmail ? (
                                <div className={styles.profileWrapper} onClick={() => setProfileOpen(!profileOpen)}>
                                    <button className={styles.profileBtn} type="button">
                                        <User size={18} />
                                        <span>{shortEmail || "Профиль"}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                className={styles.profileDropdown}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Link href="/profile" className={styles.profileOption} onClick={() => setProfileOpen(false)}>
                                                    <User size={16} />
                                                    <span>Профиль</span>
                                                </Link>
                                                <button
                                                    className={styles.profileOption}
                                                    onClick={() => {
                                                        localStorage.removeItem("hessaUser");
                                                        setUserEmail(null);
                                                        setProfileOpen(false);
                                                        window.dispatchEvent(new Event("hessaAuthChange"));
                                                        window.location.href = "/";
                                                    }}
                                                >
                                                    <LogOut size={16} />
                                                    <span>Выйти</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link href="/login" className={styles.loginBtn}>
                                    <span>Войти</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile User Icon (Visible only on mobile) */}
                        <Link href={userEmail ? "/profile" : "/login"} className={styles.mobileUserIcon}>
                            <User size={24} strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { delay: 0.2 } }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Background Backdrop */}
                        <motion.div
                            className={styles.mobileBackdrop}
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.mobileHeader}>
                                <span className={styles.mobileLogo}>HESSA</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={styles.closeBtn}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className={styles.mobileContent}>
                                <nav className={styles.mobileNav}>
                                    {menuItems.map((item, i) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.1 }}
                                        >
                                            <Link
                                                href={item.slug}
                                                className={styles.mobileLink}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                <div className={styles.mobileFooter}>
                                    {userEmail ? (
                                        <>
                                            <Link href="/profile" className={styles.mobileLoginBtn} onClick={() => setIsMobileMenuOpen(false)}>
                                                <User size={22} />
                                                <span>Профиль</span>
                                            </Link>
                                            <button
                                                className={styles.mobileLoginBtn}
                                                onClick={() => {
                                                    localStorage.removeItem("hessaUser");
                                                    setUserEmail(null);
                                                    setIsMobileMenuOpen(false);
                                                    window.dispatchEvent(new Event("hessaAuthChange"));
                                                    window.location.href = "/";
                                                }}
                                                style={{ border: "none", background: "transparent", padding: 0 }}
                                            >
                                                <LogOut size={22} />
                                                <span>Выйти</span>
                                            </button>
                                        </>
                                    ) : (
                                        <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsMobileMenuOpen(false)}>
                                            Войти в аккаунт
                                        </Link>
                                    )}

                                    <div className={styles.mobileLang}>
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`${styles.mobileLangBtn} ${currentLang === lang.code ? styles.activeLang : ""
                                                    }`}
                                                onClick={() => setCurrentLang(lang.code)}
                                            >
                                                {lang.code}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
