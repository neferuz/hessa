export type Option = {
    id: string;
    text: string;
};

export type QuestionStep = {
    id: string;
    section: string;
    label: string;
    type: "options" | "input";
    placeholder?: string;
    options?: Option[];
    multiple?: boolean;
    gender?: string;
};

export type ViewState = 'selection' | 'login' | 'quiz' | 'analyzing' | 'quiz_auth' | 'recommendation' | 'checkout';
export type LoginStep = 'email' | 'otp';
export type PaymentMethod = 'payme' | 'click';

export type RecommendationProduct = {
    id: number;
    name: string;
    price: number;
    image?: string;
    category: string;
    details?: string;
    composition_data?: any[];
};

export type SubscriptionPlan = {
    months: number;
    price: number;
    discount: number;
    title: string;
    items?: string;
};

export type RecommendationStats = {
    rating: number;
    reviews_count: number;
    effectiveness: number;
    stat1_label: string;
    stat1_value: number;
    stat2_label: string;
    stat2_value: number;
    stat3_label: string;
    stat3_value: number;
    trust_blocks?: {
        title: string;
        description: string;
    }[];
};

export type RecommendationResult = {
    title: string;
    description: string;
    image?: string;
    products: RecommendationProduct[];
    subscription_plans: SubscriptionPlan[];
    stats?: RecommendationStats;
};

export type Product = {
    id: string;
    name: string;
    desc: string;
    price: string;
    image: string;
};

export type Duration = {
    id: number;
    label: string;
    discount: number;
};
