import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE_URL } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | null | undefined) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const backendBase = API_BASE_URL;
  // Handle paths that might or might not have leading slash
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${normalizedPath}`;
}
