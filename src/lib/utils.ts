import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(url: string | null | undefined) {
  if (!url) return url;
  if (url.startsWith('/')) {
    const base = import.meta.env.BASE_URL || '/';
    return base.endsWith('/') ? `${base}${url.slice(1)}` : `${base}${url}`;
  }
  return url;
}
