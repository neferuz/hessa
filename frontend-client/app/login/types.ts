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
};

export type ViewState = 'selection' | 'login' | 'quiz' | 'analyzing' | 'quiz_auth' | 'recommendation' | 'checkout';
export type LoginStep = 'email' | 'otp';
export type PaymentMethod = 'payme' | 'click';

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
