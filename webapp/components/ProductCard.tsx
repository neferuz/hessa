"use client";
import { Star, Heart, Check, Plus, Package, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import clsx from "clsx";

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sale_price: number;
    category?: Category;
    images?: string[];
}

export default function ProductCard({ activeCategory }: { activeCategory: string }) {
    const router = useRouter();
    const { addItem, isInCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                setProducts(data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = activeCategory === "Все товары"
        ? products
        : products.filter(p => p.category?.name === activeCategory);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.sale_price,
            image: product.images?.[0],
        });
    };

    return (
        <div className="px-5 mb-32">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold text-[#1C1C1E] tracking-tight">Популярное</h3>
                <button className="text-[11px] text-blue-600 font-bold hover:opacity-70 transition-opacity">Все</button>
            </div>

            <motion.div layout className="grid grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => {
                        const inCart = isInCart(product.id);
                        return (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => router.push(`/product/${product.id}`)}
                                className="bg-white rounded-[28px] overflow-hidden flex flex-col relative shadow-sm shadow-black/[0.015] border border-gray-100/50 group"
                            >
                                {/* Top Image Section - Full Width */}
                                <div className="w-full aspect-square bg-[#F8F9FB] relative flex items-center justify-center">
                                    {/* Overlays */}
                                    <div className="absolute top-2.5 left-2.5 z-10">
                                        <div className="bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-50 flex items-center justify-center">
                                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-tight">20% OFF</span>
                                        </div>
                                    </div>
                                    <button className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90">
                                        <Heart size={14} />
                                    </button>

                                    <Image
                                        src={product.images && product.images.length > 0 && product.images[0] ? (product.images[0].startsWith('http') || product.images[0].startsWith('/') ? product.images[0] : `${API_BASE_URL}/${product.images[0]}`) : "/product_bottle.png"}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                </div>

                                {/* Content Section - Compact */}
                                <div className="p-3.5 flex flex-col pt-3">
                                    <div className="mb-2">
                                        <h4 className="text-[13px] font-bold text-[#1C1C1E] leading-tight line-clamp-1 mb-0.5">
                                            {product.name}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Medicine</p>
                                    </div>

                                    {/* Bottom - Price & Button */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[15px] font-black text-[#1C1C1E]">
                                            {formatPrice(product.sale_price)} <span className="text-[11px] text-gray-400 font-bold">сум</span>
                                        </span>

                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className={clsx(
                                                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                                                inCart ? "bg-emerald-500 text-white shadow-emerald-500/10" : "bg-blue-600 text-white shadow-blue-600/20"
                                            )}
                                        >
                                            {inCart ? <Check size={16} /> : <ArrowUpRight size={18} />}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {!isLoading && filteredProducts.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Package size={24} className="text-gray-200" />
                    </div>
                    <p className="text-[15px] text-gray-400 font-bold tracking-tight">Ничего не найдено</p>
                </div>
            )}
        </div>
    );
}
