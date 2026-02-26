import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string | undefined): string {
    if (!phone) return "—";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 9) {
        return `+998 (${cleaned.slice(0, 2)}) ${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}-${cleaned.slice(7, 9)}`;
    }
    return phone;
}
