"use client";

import styles from "./Catalog.module.css";
import Link from "next/link";

export default function CollectionsPage() {
    return (
        <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '80vh' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '1rem' }}>Наши коллекции</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Эта страница находится в разработке.</p>
            <Link href="/catalog" style={{ textDecoration: 'underline', color: '#19482E', fontWeight: 600 }}>
                Перейти в каталог
            </Link>
        </div>
    );
}
