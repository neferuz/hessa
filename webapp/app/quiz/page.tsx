"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Star, Sparkles, CreditCard, Calendar, X, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { API_BASE_URL } from "@/lib/config";

interface QuizOption {
    id: string;
    text: string;
}

interface QuizQuestion {
    id: string;
    section: string;
    label: string;
    type: "input" | "options";
    placeholder?: string;
    options: QuizOption[];
    multiple?: boolean;
    gender?: string;
}

interface RecommendedProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    details?: string;
    composition_data?: Array<{ component: string; dosage: string; daily_value: string }>;
}

const getApiImageUrl = (url: string) => {
    if (!url || url === "/product_bottle.png") return "/product_bottle.png";
    if (url.startsWith('http')) return url;
    // Only prepend backend URL if it's a known backend static path
    if (url.startsWith('/static/') || url.startsWith('static/')) {
        const baseUrl = "https://assembly-nasa-carried-hope.trycloudflare.com";
        return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
    }
    return url;
};

interface SubscriptionPlan {
    months: number;
    price: number;
    discount: number;
    title?: string;
    items?: string;
}

interface RecommendationResult {
    title: string;
    description: string;
    image: string;
    products: RecommendedProduct[];
    subscription_plans: SubscriptionPlan[];
}

export default function QuizPage() {
    const [selectedProductForModal, setSelectedProductForModal] = useState<RecommendedProduct | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<number>(0);
    const [analyzingText, setAnalyzingText] = useState("Инициализация анализа...");
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('click');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = async () => {
        setIsSubmitting(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2500));
            setIsSuccess(true);
        } catch (error) {
            console.error("Payment failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (analyzing) {
            const texts = [
                "Инициализация анализа...",
                "Изучаем ваши биоритмы...",
                "Подбираем микронутриенты...",
                "Оптимизируем дозировки...",
                "Формируем персональный план..."
            ];
            let i = 0;
            const interval = setInterval(() => {
                i++;
                if (i < texts.length) setAnalyzingText(texts[i]);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [analyzing]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/quiz`);
                const data = await res.json();
                setQuestions(data.questions);
            } catch (err) {
                console.error("Failed to fetch quiz", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    const handleOptionSelect = (questionId: string, optionId: string) => {
        const question = filteredQuestions.find(q => q.id === questionId);
        if (question?.multiple) {
            setAnswers(prev => {
                const current = prev[questionId] ? prev[questionId].split(',') : [];
                const updated = current.includes(optionId)
                    ? current.filter(id => id !== optionId)
                    : [...current, optionId];
                return { ...prev, [questionId]: updated.join(',') };
            });
        } else {
            setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        }
    };

    const handleInputChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextStep = () => {
        if (currentStep < filteredQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Фильтруем вопросы по полу
    const selectedGender = answers['gender'];
    const filteredQuestions = questions.filter(q =>
        !q.gender || q.gender === 'both' || q.gender === selectedGender
    );

    const finishQuiz = async () => {
        setAnalyzing(true);
        try {
            console.log("Submitting quiz answers...", answers);
            const res = await fetch(`${API_BASE_URL}/api/quiz/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(answers)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
            }

            const data = await res.json();
            console.log("Recommendation received:", data);
            setRecommendation(data);
            setIsFinished(true);
        } catch (err) {
            console.error("Failed to get recommendation:", err);
            // Fallback for demo purposes if backend fails
            setRecommendation({
                title: "Универсальный набор Hessa",
                description: "К сожалению, сервис временно недоступен. Мы подобрали для вас универсальный набор, который подходит большинству наших клиентов для поддержания общего тонуса и здоровья.",
                image: "https://i.pinimg.com/736x/4c/d1/59/4cd1593a97579fb2163701e3d701fa95.jpg",
                products: [
                    {
                        id: 1,
                        name: "Hessa Balance",
                        price: 4990,
                        image: "/product_bottle.png",
                        category: "Комплекс"
                    }
                ],
                subscription_plans: [
                    { months: 1, price: 4990, discount: 0, title: "Пробный старт", items: "1 набор" },
                    { months: 3, price: 13470, discount: 10, title: "Курс на результат", items: "3 набора" },
                    { months: 6, price: 25450, discount: 15, title: "Полная трансформация", items: "6 наборов" }
                ]
            });
            setIsFinished(true);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (analyzing) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center">
                {/* Advanced AI Loading Animation */}
                <div className="relative w-32 h-32 mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-dashed border-gray-100"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border-2 border-dotted border-gray-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 bg-[#1a1a1a] rounded-full blur-2xl"
                        />
                        <Sparkles className="w-8 h-8 text-[#1a1a1a] relative z-10" />
                    </div>
                </div>

                <div className="h-20 flex flex-col items-center justify-start">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={analyzingText}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xl font-bold font-unbounded text-[#1a1a1a] mb-3 tracking-tight"
                        >
                            {analyzingText}
                        </motion.h2>
                    </AnimatePresence>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400 text-[13px] font-medium max-w-[260px] leading-relaxed"
                    >
                        Искусственный интеллект анализирует ваш профиль и подбирает компоненты
                    </motion.p>
                </div>

                {/* Progress bar */}
                <div className="mt-16 w-48 h-1 bg-gray-50 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "easeInOut" }}
                        className="absolute top-0 left-0 h-full bg-[#1a1a1a]"
                    />
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-inter">
                {/* Ambient Background Elements */}
                <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-24 h-24 bg-[#1a1a1a] rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-black/10 relative z-10"
                >
                    <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[28px] font-black font-unbounded text-[#1a1a1a] mb-4 relative z-10 leading-tight"
                >
                    Заказ оформлен!
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 max-w-[280px] leading-relaxed mb-12 relative z-10 font-medium"
                >
                    Ваша персональная программа готова. Мы уже начали подготовку вашего набора.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-[320px] space-y-3 relative z-10"
                >
                    <Link
                        href="/profile?open=orders"
                        className="w-full h-16 bg-[#1a1a1a] text-white rounded-[24px] flex items-center justify-center font-bold text-lg shadow-xl shadow-black/10 active:scale-95 transition-all"
                    >
                        Мои заказы
                    </Link>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full h-16 bg-white border border-gray-100 text-[#1a1a1a] rounded-[24px] flex items-center justify-center font-bold text-lg shadow-sm active:scale-95 transition-all"
                    >
                        На главную
                    </button>
                </motion.div>
            </div>
        );
    }

    if (showCheckout && recommendation) {
        const plan = recommendation.subscription_plans[selectedPlan];

        return (
            <div className="min-h-screen bg-[#F5F5F7] font-inter text-[#1a1a1a] pb-32">
                {/* Header with Back Button */}
                <div className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-[#F5F5F7]/80 backdrop-blur-xl flex items-center justify-between">
                    <button
                        onClick={() => setShowCheckout(false)}
                        className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center active:scale-95 transition-all text-[#1a1a1a]"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <h1 className="text-sm font-bold font-unbounded uppercase tracking-wider text-[#1a1a1a]">Оформление</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                <div className="px-5 pt-28 space-y-8">
                    {/* Selected Plan Card - Premium Style */}
                    <section>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 pl-2">Ваш тариф</h3>
                        <div className="bg-white p-6 rounded-[32px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] border border-white relative overflow-hidden group">
                            {/* Decorative Blur */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-100/50 rounded-full blur-3xl pointer-events-none group-hover:bg-gray-200/50 transition-colors" />

                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#F5F5F7] text-[#1a1a1a] text-[10px] font-black uppercase tracking-wider mb-4">
                                    {plan.title || "Персональный план"}
                                </span>

                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-black font-unbounded text-[#1a1a1a] tracking-tight">
                                        {Math.round(plan.price).toLocaleString()}
                                    </span>
                                    <span className="text-lg font-medium text-gray-400">сум</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[#1a1a1a]" />
                                        <span>{plan.months} {plan.months === 1 ? 'месяц' : 'месяца'}</span>
                                    </div>
                                    {plan.discount > 0 && (
                                        <>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="text-emerald-600 font-bold">Выгода {plan.discount}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment Methods - Quiz Option Style */}
                    <section>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 pl-2">Способ оплаты</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'click', name: 'Click Up', icon: '⚡️' },
                                { id: 'payme', name: 'Payme', icon: '🔹' },
                                { id: 'uzum', name: 'Uzum Bank', icon: '🍇' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`w-full p-4 pl-5 rounded-[24px] border text-left transition-all duration-300 active:scale-[0.98] flex items-center justify-between group relative overflow-hidden ${paymentMethod === method.id
                                        ? "bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)]"
                                        : "bg-white border-transparent hover:border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-[#1a1a1a]"
                                        }`}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm transition-colors ${paymentMethod === method.id ? "bg-white/10 text-white" : "bg-[#F5F5F7] text-gray-900"
                                            }`}>
                                            {method.icon}
                                        </div>
                                        <div>
                                            <div className={`text-[15px] font-bold leading-none mb-1 ${paymentMethod === method.id ? "text-white" : "text-[#1a1a1a]"
                                                }`}>
                                                {method.name}
                                            </div>
                                            <div className={`text-[10px] font-bold uppercase tracking-wider ${paymentMethod === method.id ? "text-white/40" : "text-gray-400"
                                                }`}>
                                                Комиссия 0%
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`relative z-10 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 mr-1 ${paymentMethod === method.id
                                        ? "border-white bg-white"
                                        : "border-gray-200 bg-transparent"
                                        }`}>
                                        <div className={`w-2.5 h-2.5 rounded-full bg-[#1a1a1a] transition-all duration-200 ${paymentMethod === method.id ? "scale-100" : "scale-0"
                                            }`} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Bottom Action Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7] to-transparent">
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <div className="flex items-center justify-between px-5 mb-5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Итого к оплате</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-[28px] font-black font-unbounded text-[#1a1a1a] tracking-tight">
                                    {Math.round(plan.price).toLocaleString('ru-RU')}
                                </span>
                                <span className="text-[14px] font-bold text-gray-400">сум</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isSubmitting}
                            className="w-full h-16 bg-[#1a1a1a] text-white rounded-[24px] flex items-center justify-center gap-3 font-bold text-lg shadow-2xl shadow-black/20 active:scale-95 transition-all group disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <Loader2 size={24} className="animate-spin text-white/50" />
                            ) : (
                                <>
                                    <span>Оплатить заказ</span>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <ChevronRight size={18} />
                                    </div>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isFinished && recommendation) {
        return (
            <div className="min-h-screen bg-[#f5f5f7] pb-32 max-w-md mx-auto relative overflow-hidden font-inter">
                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }} />

                <Header />

                <div className="px-6 pt-4">
                    {/* Boutique Elegance Recommendation Section */}
                    <div className="relative mb-16">
                        {/* Main Product Hero Block */}
                        <div className="relative z-10 bg-white rounded-[40px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] overflow-hidden">

                            {/* Full Width Hero Image */}
                            <div className="relative h-[420px] w-full bg-gray-100">
                                <Image
                                    src={getApiImageUrl(recommendation.image)}
                                    alt="Hero"
                                    fill
                                    priority
                                    unoptimized
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-60" />

                                {/* Minimal Branded Badge */}
                                <div className="absolute top-6 right-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg"
                                    >
                                        <span className="text-[10px] font-black text-gray-900 tracking-[0.2em] uppercase">Идеальный выбор</span>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 -mt-12 relative z-10">
                                {/* Minimalist Title & Description */}
                                <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] border border-white/60 shadow-lg mb-6 text-center">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-gray-900 text-xl font-bold font-unbounded leading-tight mb-3 tracking-tight"
                                    >
                                        {recommendation.title}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-gray-500 text-[13px] leading-[1.5] font-medium opacity-90"
                                    >
                                        {recommendation.description}
                                    </motion.p>
                                </div>

                                {/* Boutique Ingredient Grid */}
                                <div className="space-y-4 px-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">В наборе</span>
                                        <div className="h-px flex-1 bg-gray-100" />
                                    </div>

                                    <div className="space-y-2">
                                        <AnimatePresence mode="popLayout">
                                            {recommendation.products.map((product, pIdx) => {
                                                const isDuplicateDetail = product.details?.trim().toLowerCase() === product.name.trim().toLowerCase();
                                                const cleanCategory = product.category === "В наборе" ? "Активный компонент" : product.category;

                                                return (
                                                    <motion.button
                                                        key={product.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 + pIdx * 0.1 }}
                                                        onClick={() => setSelectedProductForModal(product)}
                                                        className="w-full text-left group flex items-start gap-3 p-3 rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        <div className="w-14 h-14 rounded-[14px] bg-[#f8f8fa] flex items-center justify-center shrink-0 border border-gray-100/50 overflow-hidden relative p-1.5 mt-0.5">
                                                            <Image
                                                                src={getApiImageUrl(product.image)}
                                                                alt={product.name}
                                                                fill
                                                                unoptimized
                                                                className="object-contain mix-blend-multiply"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                    {cleanCategory}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-[14px] font-bold text-gray-900 leading-tight mb-0.5">{product.name}</h4>
                                                            {!isDuplicateDetail && product.details && (
                                                                <p className="text-[11px] text-gray-500 leading-snug font-medium opacity-80 line-clamp-2">{product.details}</p>
                                                            )}
                                                        </div>
                                                        <div className="w-6 h-6 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#1a1a1a] transition-all self-center shrink-0">
                                                            <Info size={12} className="text-gray-400 group-hover:text-white" />
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedProductForModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
                            onClick={() => setSelectedProductForModal(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
                            >
                                {/* Modal Header Image */}
                                <div className="relative h-48 bg-gray-50 shrink-0">
                                    <Image
                                        src={getApiImageUrl(selectedProductForModal.image)}
                                        alt={selectedProductForModal.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => setSelectedProductForModal(null)}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm text-gray-900 hover:bg-white active:scale-95 transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 pt-2 pb-8 overflow-y-auto">
                                    <div className="text-center mb-6">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 mb-2 block">{selectedProductForModal.category}</span>
                                        <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{selectedProductForModal.name}</h3>
                                        <p className="text-xs text-gray-500 max-w-[80%] mx-auto leading-relaxed">
                                            {selectedProductForModal.details || "Премиальный компонент для вашей персональной программы."}
                                        </p>
                                    </div>

                                    {selectedProductForModal.composition_data && selectedProductForModal.composition_data.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
                                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Активный компонент</span>
                                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Дозировка</span>
                                            </div>
                                            {selectedProductForModal.composition_data.map((item, idx) => (
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
                                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                                            <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                            <p className="text-xs text-gray-400 font-medium">Детальный состав скоро появится</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 pt-0 mt-auto bg-white">
                                    <button
                                        onClick={() => setSelectedProductForModal(null)}
                                        className="w-full h-12 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-gray-200 active:scale-95 transition-all"
                                    >
                                        Понятно
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="p-8 -mt-6 relative z-10">
                    <div className="flex items-center justify-between mb-4 px-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Выберите тариф</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 px-2">
                        {recommendation.subscription_plans.map((plan, idx) => (
                            <motion.button
                                key={idx}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedPlan(idx)}
                                className={`w-full p-5 rounded-3xl transition-all duration-300 flex items-center justify-between group border ${selectedPlan === idx
                                    ? "bg-white border-gray-900 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)]"
                                    : "bg-white/50 border-gray-100 hover:border-gray-200"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedPlan === idx ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400"}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[13px] font-bold tracking-tight text-gray-900">
                                            {plan.title || `${plan.months} ${plan.months === 1 ? 'месяц' : 'месяца'}`}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {plan.discount > 0 ? (
                                                <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                                                    Выгода {plan.discount}%
                                                </span>
                                            ) : (
                                                <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.1em]">Базовый тариф</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-[15px] font-black text-gray-900">
                                            {Math.round(plan.price).toLocaleString()} <span className="text-[10px] lowercase font-medium opacity-50">сум</span>
                                        </div>
                                        <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                            {(Math.round(plan.price / plan.months)).toLocaleString()} / мес
                                        </div>
                                    </div>
                                    {selectedPlan === idx && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center"
                                        >
                                            <CheckCircle2 size={12} className="text-white" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-8 z-40 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7] to-transparent">
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full h-16 bg-[#1a1a1a] text-white rounded-[24px] flex items-center justify-center gap-3 font-bold text-lg shadow-2xl shadow-black/20 active:scale-95 transition-all"
                        >
                            <CreditCard size={22} strokeWidth={2} />
                            Заказать программу
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = filteredQuestions[currentStep];

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
                <p className="text-gray-500">Загрузка вопросов...</p>
            </div>
        );
    }

    const progress = ((currentStep + 1) / filteredQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto relative overflow-hidden font-inter text-[#1a1a1a]">
            <Header />

            {/* Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

            {/* Progress Bar - Minimal & Clean */}
            <div className="px-8 mb-6 mt-6 relative z-10 w-full max-w-[360px] mx-auto">
                <div className="flex justify-center items-center mb-4">
                    <span className="text-sm font-medium font-inter text-gray-400 tracking-wide">
                        <span className="text-[#1a1a1a] font-bold text-base">{currentStep + 1}</span>
                        <span className="mx-1.5 opacity-30">/</span>
                        {filteredQuestions.length}
                    </span>
                </div>
                <div className="h-1 w-full bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="h-full bg-[#1a1a1a] rounded-full"
                    />
                </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 px-5 pb-32 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col h-full"
                    >
                        <div className="mb-10 px-1 text-center font-inter">
                            <h2 className="text-[22px] font-bold text-[#1a1a1a] leading-tight tracking-tight">
                                {currentQuestion.label}
                            </h2>
                        </div>

                        {currentQuestion.type === "input" ? (
                            <div className="relative group px-1">
                                <input
                                    type="text"
                                    autoFocus
                                    value={answers[currentQuestion.id] || ""}
                                    onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                    placeholder={currentQuestion.placeholder}
                                    className="w-full h-[72px] bg-white rounded-[20px] px-6 text-lg font-medium text-[#1a1a1a] placeholder:text-gray-400 outline-none border border-transparent focus:border-gray-200 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1a1a1a] transition-colors duration-300 pointer-events-none">
                                    <CheckCircle2 size={24} strokeWidth={2} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 px-1">
                                {currentQuestion.options.map((opt, idx) => (
                                    <motion.button
                                        key={opt.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                                        className={`w-full p-4 pl-6 rounded-[20px] border text-left transition-all duration-200 active:scale-[0.98] flex items-center justify-between group relative overflow-hidden ${(currentQuestion.multiple
                                            ? (answers[currentQuestion.id] || "").split(',').includes(opt.id)
                                            : answers[currentQuestion.id] === opt.id)
                                            ? "bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
                                            : "bg-white border-white hover:border-gray-100 hover:bg-gray-50/50 text-[#1a1a1a] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
                                            }`}
                                    >
                                        <span className={`text-[16px] relative z-10 leading-snug pr-4 font-inter ${(currentQuestion.multiple
                                            ? (answers[currentQuestion.id] || "").split(',').includes(opt.id)
                                            : answers[currentQuestion.id] === opt.id)
                                            ? "font-medium" : "font-normal text-gray-700"}`}>
                                            {opt.text}
                                        </span>

                                        <div className={`relative z-10 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${(currentQuestion.multiple
                                            ? (answers[currentQuestion.id] || "").split(',').includes(opt.id)
                                            : answers[currentQuestion.id] === opt.id)
                                            ? "border-white bg-white"
                                            : "border-gray-200 bg-transparent"
                                            }`}>
                                            <div className={`w-2.5 h-2.5 rounded-full bg-[#1a1a1a] transition-all duration-200 ${(currentQuestion.multiple
                                                ? (answers[currentQuestion.id] || "").split(',').includes(opt.id)
                                                : answers[currentQuestion.id] === opt.id)
                                                ? "scale-100" : "scale-0"}`} />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Footer Navigation */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[340px] z-50">
                <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#1a1a1a]/95 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-lg border border-white/10">
                    {currentStep > 0 && (
                        <button
                            onClick={prevStep}
                            className="w-12 h-12 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                        >
                            <ChevronLeft size={22} strokeWidth={2.5} />
                        </button>
                    )}
                    <button
                        onClick={nextStep}
                        disabled={!answers[currentQuestion.id]}
                        className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide transition-all duration-300 active:scale-[0.97] ${answers[currentQuestion.id]
                            ? "bg-white text-[#1a1a1a]"
                            : "bg-transparent text-white/20 cursor-not-allowed"
                            }`}
                    >
                        {currentStep === questions.length - 1 ? "Завершить" : "Далее"}
                        {!answers[currentQuestion.id] && <ChevronRight size={16} className="opacity-0" />}
                        {answers[currentQuestion.id] && <ChevronRight size={16} strokeWidth={3} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
