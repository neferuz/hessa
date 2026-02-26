"use client";
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    name: string;
    sale_price: number;
    images?: string[];
}

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                const data = await res.json();
                setProducts(data || []);
            } catch (err) {
                console.error("Search fetch error:", err);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredProducts([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery)
        ).slice(0, 5); // Limit to top 5 for cleanliness
        setFilteredProducts(filtered);
    }, [query, products]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price / 12000);
    };

    return (
        <div className="px-6 mb-10 relative z-[60]" ref={dropdownRef}>
            <div className="flex items-center gap-3">
                {/* Search Input Pill */}
                <div className={clsx(
                    "flex-1 h-13 bg-white rounded-full flex items-center px-5 transition-all duration-300 border",
                    isFocused ? "border-blue-600 shadow-[0_8px_30px_rgba(37,99,235,0.08)]" : "border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                )}>
                    <Search size={20} className={isFocused ? "text-blue-600" : "text-[#8E8E93]"} strokeWidth={1.5} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Поиск витаминов..."
                        className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder:text-[#8E8E93] focus:outline-none font-medium ml-3"
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="text-gray-300 hover:text-gray-900">
                            <X size={18} />
                        </button>
                    )}
                </div>


            </div>

            {/* Live Search Dropdown */}
            <AnimatePresence>
                {isFocused && (query.trim() || filteredProducts.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 15, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute left-6 right-6 bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden"
                    >
                        <div className="p-4">
                            <h4 className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Результаты поиска</h4>
                            <div className="space-y-1">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                router.push(`/product/${product.id}`);
                                                setIsFocused(false);
                                            }}
                                            className="w-full flex items-center justify-between p-4 rounded-[24px] hover:bg-gray-50 transition-all group"
                                        >
                                            <div className="flex-1 text-left">
                                                <p className="text-[15px] font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{product.name}</p>
                                                <p className="text-[13px] font-medium text-gray-400 mt-1">{formatPrice(product.sale_price)}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <ChevronRight size={18} strokeWidth={2.5} />
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-gray-400 font-medium">Ничего не найдено</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

import clsx from "clsx";
