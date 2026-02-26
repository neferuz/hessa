"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Share2, Star, ShieldCheck, Leaf, Minus, Plus, ShoppingBag, Activity, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import { useCart } from "@/contexts/CartContext";
import clsx from "clsx";

interface Product {
    id: number;
    name: string;
    sale_price: number;
    category?: { id: number; name: string };
    images?: string[];
    description_short?: string;
    description_full?: string;
    details?: string;
    composition?: any;
    size_volume?: string;
    usage?: string;
}

const getApiImageUrl = (url: string) => {
    if (!url || url === "/product_bottle.png") return "/product_bottle.png";
    if (url.startsWith('http')) return url;
    // Handle local paths missing the prefix
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    if (cleanUrl.startsWith('static/') || cleanUrl.startsWith('uploads/')) {
        return `${API_BASE_URL}/${cleanUrl.startsWith('static/') ? cleanUrl : 'static/' + cleanUrl}`;
    }
    // Default to static mount
    return `${API_BASE_URL}/static/${cleanUrl}`;
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addItem, items: cartItems } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<"description" | "composition" | "usage">("description");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-lg font-bold text-[#1C1C1E] mb-2">Товар не найден</h2>
                <button onClick={() => router.push('/')} className="text-blue-600 font-medium">К покупкам</button>
            </div>
        );
    }

    const compositionData = Array.isArray(product.composition) ? product.composition : [];

    return (
        <main className="min-h-screen bg-white pb-20 max-w-md mx-auto relative overflow-x-hidden font-sans text-[#1C1C1E]">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
                <button
                    onClick={() => router.push('/')}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
            </header>

            {/* Image Section */}
            <section className="relative w-full h-[50vh] bg-[#F8F9FB] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full p-12"
                    >
                        <Image
                            src={product.images && product.images.length > 0 ? getApiImageUrl(product.images[currentImageIndex]) : "/product_bottle.png"}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-10 z-20 flex gap-2">
                        {product.images.map((_, i) => (
                            <div key={i} className={clsx("w-1.5 h-1.5 rounded-full transition-all", i === currentImageIndex ? "bg-[#1C1C1E] w-4" : "bg-gray-300")} />
                        ))}
                    </div>
                )}
            </section>

            {/* Content Section */}
            <div className="relative z-10 bg-white -mt-10 rounded-t-[40px] px-6 pt-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wide uppercase">
                        {product.category?.name || "Premium Health"}
                    </span>
                    <div className="flex items-center gap-1 text-[12px] font-medium text-gray-400">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span>4.9 (128 отзывов)</span>
                    </div>
                </div>

                <h1 className="text-[26px] font-bold tracking-tight text-[#1C1C1E] leading-tight mb-3">
                    {product.name}
                </h1>

                <p className="text-[15px] text-gray-500 font-normal leading-relaxed mb-8">
                    {product.description_short || "Натуральный биоактивный комплекс для поддержания здоровья и жизненного тонуса организма."}
                </p>

                <div className="flex items-center gap-16 mb-10">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-gray-400 mb-1">Объем</span>
                        <span className="text-[16px] font-bold text-[#1C1C1E]">
                            {product.size_volume || "60 шт"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-gray-400 mb-1">Цена</span>
                        <span className="text-[16px] font-bold text-[#1C1C1E]">
                            {formatPrice(product.sale_price)} сум
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="space-y-6 mb-12">
                    <div className="flex gap-8 border-b border-gray-100">
                        {(["description", "composition", "usage"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "text-[15px] font-bold tracking-tight transition-all pb-3 relative",
                                    activeTab === tab ? "text-[#1C1C1E]" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {tab === "description" ? "О товаре" : tab === "composition" ? "Состав" : "Прием"}
                                {activeTab === tab && (
                                    <motion.div layoutId="tabLine" className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#1C1C1E] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="text-[15px] text-gray-600 leading-relaxed min-h-[100px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "description" && (
                                    <p>{product.description_full || product.details || "Полная информация о продукте временно отсутствует."}</p>
                                )}
                                {activeTab === "composition" && (
                                    <div className="space-y-3">
                                        {(compositionData.length > 0 ? compositionData : [
                                            { component: "Витамин C", dosage: "500 мг" },
                                            { component: "Цинк", dosage: "10 мг" }
                                        ]).map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                                                <span className="text-gray-900 font-medium">{item.component}</span>
                                                <span className="text-gray-500">{item.dosage}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === "usage" && (
                                    <div className="p-5 bg-[#F8F9FB] rounded-2xl text-gray-700 border border-gray-100">
                                        {product.usage || "Принимать по 1 капсуле в день во время еды."}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="pb-10">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[18px] font-bold text-[#1C1C1E] tracking-tight">Рекомендуем</h3>
                    </div>
                    <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
                        <RecommendationsList currentProductId={id} />
                    </div>
                </div>
            </div>

            {/* Quiz Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 z-50 flex justify-center pointer-events-none">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="pointer-events-auto w-full max-w-[380px]"
                >
                    <button
                        onClick={() => router.push('/quiz')}
                        className="w-full h-14 bg-[#1C1C1E] text-white rounded-[24px] px-6 flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-gray-200"
                    >
                        <Activity size={20} className="text-[#FFD700]" />
                        <span className="text-[16px] font-bold">Подобрать витамины</span>
                    </button>
                </motion.div>
            </div>
        </main>
    );
}

function RecommendationsList({ currentProductId }: { currentProductId: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then((data: Product[]) => {
                const others = data.filter(p => p.id.toString() !== currentProductId).slice(0, 5);
                setProducts(others);
            })
            .catch(err => console.error(err));
    }, [currentProductId]);

    if (!products.length) return null;

    return (
        <div className="flex gap-3 pb-4">
            {products.map(product => (
                <div
                    key={product.id}
                    className="min-w-[160px] max-w-[160px] bg-white rounded-[28px] overflow-hidden flex flex-col relative shadow-sm border border-gray-100/50 cursor-pointer active:scale-95 transition-all group"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        router.push(`/product/${product.id}`);
                    }}
                >
                    <div className="w-full aspect-square bg-[#F8F9FB] relative flex items-center justify-center">
                        <div className="absolute top-2 left-2 z-10">
                            <div className="bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-50 flex items-center justify-center">
                                <span className="text-[8px] font-black text-gray-900 uppercase tracking-tight">Coming Soon</span>
                            </div>
                        </div>
                        <Image
                            src={product.images?.[0] ? getApiImageUrl(product.images[0]) : "/product_bottle.png"}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="p-3 flex flex-col pt-2.5">
                        <div className="mb-1.5">
                            <h4 className="text-[12px] font-bold text-[#1C1C1E] leading-tight line-clamp-1">
                                {product.name}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">Medicine</p>
                        </div>
                        <span className="text-[14px] font-black text-[#1C1C1E]">
                            {new Intl.NumberFormat('ru-RU').format(product.sale_price)} <span className="text-[10px] text-gray-400 font-bold uppercase">сум</span>
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
