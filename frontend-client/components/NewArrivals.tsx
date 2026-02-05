"use client";


import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./NewArrivals.module.css";
import TextReveal from "./ui/TextReveal";

const products = [
    {
        id: 1,
        name: "Мультивитамины",
        category: "Иммунитет и энергия",
        price: "145 000 сум",
        image: "/vitamins-1.png",
        isNew: true
    },
    {
        id: 2,
        name: "Железо + C",
        category: "Здоровье крови",
        price: "95 000 сум",
        image: "/vitamins-2.png",
        isNew: false
    },
    {
        id: 3,
        name: "Магний B6",
        category: "Нервная система",
        price: "115 000 сум",
        image: "/vitamins-3.png",
        isNew: true
    },
    {
        id: 4,
        name: "Омега-3",
        category: "Сердце и мозг",
        price: "245 000 сум",
        image: "/vitamins-1.png",
        isNew: false
    }
];

export default function NewArrivals() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <TextReveal>
                        <h2 className={styles.title}>Новинки</h2>
                    </TextReveal>
                    <Link href="/catalog" className={styles.linkBtn}>
                        Посмотреть все
                    </Link>
                </div>

                <div className={styles.grid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {product.isNew && <span className={styles.badge}>Новинка</span>}
                                <button className={styles.likeBtn} aria-label="Добавить в избранное">
                                    <Heart size={18} />
                                </button>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className={styles.productImage}
                                />
                            </div>

                            <div className={styles.info}>
                                <div className={styles.nameRow}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <span className={styles.price}>{product.price}</span>
                                </div>
                                <p className={styles.category}>{product.category}</p>
                            </div>

                            <button className={styles.addBtn}>
                                <ShoppingBag size={18} />
                                Добавить
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
