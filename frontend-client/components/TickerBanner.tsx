"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import styles from "./TickerBanner.module.css";

export default function TickerBanner() {
    const [items, setItems] = useState<any[]>([]);
    const [lang, setLang] = useState("RU");

    useEffect(() => {
        // Fetch Content
        const fetchContent = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/content');
                const data = await res.json();
                if (data.ticker) setItems(data.ticker);
            } catch (err) {
                console.error(err);
            }
        };
        fetchContent();

        // Lang Listener
        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const getText = (item: any) => {
        if (lang === 'RU') return item.text;
        return item[`text_${lang.toLowerCase()}`] || item.text;
    };

    if (items.length === 0) return null;

    return (
        <div className={styles.tickerContainer}>
            <div className={styles.tickerTrack}>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className={styles.tickerGroup}>
                        {items.map((item, idx) => (
                            <div key={idx} className={styles.tickerItem} style={{ fontFamily: 'var(--font-montserrat)' }}>
                                {getText(item)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
