"use client";

import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";

interface ProductDetailsModalProps {
    product: any; // We'll type this loosely or import the interface
    onClose: () => void;
}

const getApiImageUrl = (url: string) => {
    if (!url || url === "/product_bottle.png") return "/product_bottle.png";
    if (url.startsWith('http')) return url;
    if (url.startsWith('/static/') || url.startsWith('static/')) {
        return `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
    }
    return url;
};

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
    if (!product) return null;

    // Parse composition if it's a string, though usually it's JSON from API
    // backend sends it as dict or list of dicts if structured. 
    // Let's assume it might be array of {component, dosage, daily_value} based on quiz page
    const compositionData = Array.isArray(product.composition) ? product.composition : [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
            >
                {/* Modal Header Image */}
                <div className="relative h-64 bg-gray-50 shrink-0">
                    <Image
                        src={product.images && product.images.length > 0 ? getApiImageUrl(product.images[0]) : "/product_bottle.png"}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm text-gray-900 hover:bg-white active:scale-95 transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent" />
                </div>

                {/* Modal Content */}
                <div className="p-6 pt-0 overflow-y-auto -mt-6 relative z-10">
                    <div className="text-center mb-6">
                        {product.category && (
                            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 mb-2 block">
                                {product.category.name}
                            </span>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-3 font-unbounded">{product.name}</h3>
                        <p className="text-sm text-gray-500 max-w-[90%] mx-auto leading-relaxed font-medium">
                            {product.description_short || product.details || "Премиальный продукт для вашего здоровья."}
                        </p>
                    </div>


                    {product.description_full && (
                        <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                            <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Описание</h4>
                            <p className="text-xs text-gray-600 leading-relaxed text-justify">
                                {product.description_full}
                            </p>
                        </div>
                    )}


                    {compositionData.length > 0 ? (
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Активный компонент</span>
                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Дозировка</span>
                            </div>
                            {compositionData.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <span className="text-xs font-bold text-gray-700">{item.component}</span>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-900">{item.dosage}</div>
                                        {item.daily_value && (
                                            <div className="text-[9px] text-emerald-600 font-medium">{item.daily_value} от нормы</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-100 mb-6">
                            <Sparkles className="w-5 h-5 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-400 font-medium">Детальный состав скоро появится</p>
                        </div>
                    )}

                    {/* Price Block */}
                    <div className="flex items-center justify-between bg-[#f9f9fa] p-4 rounded-2xl mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Стоимость</span>
                        <span className="text-xl font-black text-gray-900">
                            {new Intl.NumberFormat('ru-RU').format(product.sale_price)} <span className="text-xs font-medium text-gray-400">сум</span>
                        </span>
                    </div>

                </div>

                <div className="p-6 pt-2 mt-auto bg-white border-t border-gray-50">
                    <button
                        className="w-full h-14 bg-[#1a1a1a] text-white rounded-[20px] font-bold text-sm tracking-wide shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Добавить в корзину
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
