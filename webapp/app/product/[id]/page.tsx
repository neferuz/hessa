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
    if (url.startsWith('/static/') || url.startsWith('static/')) {
        return `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
    }
    return url;
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addItem, items: cartItems } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"description" | "composition" | "usage">("description");
    const [showCartSummary, setShowCartSummary] = useState(false);

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

    const handleAddToCart = () => {
        if (product) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.sale_price,
                image: product.images?.[0],
                quantity: quantity
            });
            setShowCartSummary(true);
        }
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
        <main className="min-h-screen bg-white pb-32 max-w-md mx-auto relative overflow-x-hidden font-sans text-[#1C1C1E]">
            {/* Header Overlaid on Image */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => router.push('/')}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/20 flex items-center justify-center text-[#1C1C1E] pointer-events-auto active:scale-95 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2 pointer-events-auto">
                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/20 flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all">
                        <Heart size={20} className="text-[#1C1C1E]" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/20 flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all">
                        <Share2 size={20} className="text-[#1C1C1E]" />
                    </button>
                </div>
            </header>

            {/* Full Top Image Section */}
            {/* Full Top Image Section */}
            {/* Full Top Image Section */}
            <section className="relative w-full h-[55vh] bg-[#F0F1F5] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = offset.x; // offset distance
                            const images = product.images || ["/product_bottle.png"];
                            if (images.length <= 1) return;

                            if (swipe < -50) {
                                // Swipe left -> Next
                                setCurrentImageIndex((prev) => (prev + 1) % images.length);
                            } else if (swipe > 50) {
                                // Swipe right -> Prev
                                setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                            }
                        }}
                    >
                        <Image
                            src={product.images && product.images.length > 0 ? getApiImageUrl(product.images[currentImageIndex]) : "/product_bottle.png"}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Image Counter Badge */}
                {product.images && product.images.length > 1 && (
                    <div className="absolute top-24 right-5 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[12px] font-medium text-white tracking-wider">
                            {currentImageIndex + 1} / {product.images.length}
                        </span>
                    </div>
                )}
            </section>

            {/* Content Section */}
            <div className="relative z-10 bg-white -mt-12 rounded-t-[40px] px-6 pt-10 pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wide">
                        {product.category?.name || "Premium Health"}
                    </span>
                    <div className="flex items-center gap-1 text-[12px] font-medium text-gray-400">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span>4.9 (128 отзывов)</span>
                    </div>
                </div>

                <h1 className="text-[24px] font-bold tracking-tight text-[#1C1C1E] leading-snug mb-3">
                    {product.name}
                </h1>

                <p className="text-[15px] text-gray-500 font-normal leading-relaxed mb-8">
                    {product.description_short || "Натуральный биоактивный комплекс для поддержания здоровья и жизненного тонуса организма."}
                </p>

                <div className="flex items-center gap-16 mb-10">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-gray-400 mb-1">Объем</span>
                        <span className="text-[16px] font-semibold text-[#1C1C1E]">
                            {product.size_volume || "60 шт"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-gray-400 mb-1">Срок годности</span>
                        <span className="text-[16px] font-semibold text-[#1C1C1E]">24 мес.</span>
                    </div>
                </div>

                {/* Deluxe Tabs */}
                <div className="space-y-6">
                    <div className="flex gap-8 border-b border-gray-100/80">
                        {(["description", "composition", "usage"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "text-[15px] font-medium tracking-tight transition-all pb-3 relative",
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

                    <div className="text-[15px] text-gray-600 leading-relaxed min-h-[120px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "description" && (
                                    <p>{product.description_full || product.details || "Полная информация о продукте временно отсутствует. Обратитесь к специалисту за дополнительными данными."}</p>
                                )}
                                {activeTab === "composition" && (
                                    <div className="space-y-3">
                                        {(compositionData.length > 0 ? compositionData : [
                                            { component: "Витамин C", dosage: "500 мг" },
                                            { component: "Цинк", dosage: "10 мг" }
                                        ]).map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                                                <span className="text-gray-900">{item.component}</span>
                                                <span className="text-gray-500">{item.dosage}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === "usage" && (
                                    <div className="p-5 bg-gray-50 rounded-2xl text-gray-700">
                                        {product.usage || "Принимать по 1 капсуле в день во время еды, запивая водой. Не является лекарственным средством."}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Compact Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 z-50 flex justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    {!showCartSummary ? (
                        <motion.div
                            key="add-bar"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="pointer-events-auto w-full max-w-[380px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-[24px] p-2 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2 px-2">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1C1C1E] active:scale-90 transition-transform hover:bg-gray-100"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="text-[16px] font-bold w-6 text-center text-[#1C1C1E]">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1C1C1E] active:scale-90 transition-transform hover:bg-gray-100"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="h-12 bg-[#1C1C1E] text-white rounded-[20px] px-6 flex items-center gap-3 active:scale-95 transition-all shadow-md shadow-gray-200"
                            >
                                <span className="text-[15px] font-medium whitespace-nowrap">{formatPrice(product.sale_price * quantity)} сум</span>
                                <ShoppingBag size={18} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cart-summary"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={() => router.push('/cart')}
                            className="pointer-events-auto w-full max-w-[380px] bg-white/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-200/50 rounded-[28px] p-2 pr-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[20px] bg-[#1C1C1E] flex items-center justify-center text-white relative">
                                    <CreditCard size={20} />
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Итого</span>
                                    <span className="text-[17px] font-bold text-[#1C1C1E]">{formatPrice(cartTotal)} сум</span>
                                </div>
                            </div>

                            <div className="flex items-center pl-2">
                                {cartItems.slice(-3).reverse().map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="w-10 h-10 rounded-full bg-gray-50 border-2 border-white overflow-hidden relative -ml-4 first:ml-0 shadow-sm"
                                        style={{ zIndex: 3 - idx }}
                                    >
                                        <Image
                                            src={getApiImageUrl(item.image || "")}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                                {cartItems.length > 3 && (
                                    <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 relative -ml-4 shadow-sm" style={{ zIndex: 0 }}>
                                        +{cartItems.length - 3}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
