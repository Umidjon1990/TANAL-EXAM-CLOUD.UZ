import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Sana va vaqtni Uzbek formatida ko'rsatish */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Narxni so'mda formatlash */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Belgilanmagan";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

/**
 * Telegram qiymatidan to'liq havola yasaydi.
 * "@user" -> https://t.me/user ; "t.me/user" -> https://t.me/user ;
 * to'liq https havola bo'lsa o'zgartirmaydi.
 */
export function telegramUrl(value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("t.me/")) return `https://${v}`;
  return `https://t.me/${v.replace(/^@/, "")}`;
}

/** Telegramni ko'rsatish uchun chiroyli yorliq (@username) */
export function telegramLabel(value: string): string {
  const v = value.trim();
  const handle = v
    .replace(/^https?:\/\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/^@/, "");
  return handle.includes("/") ? "Telegram" : `@${handle}`;
}

/** Google Maps qidiruv havolasi */
export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

/** Yandex Maps qidiruv havolasi */
export function yandexMapsUrl(query: string): string {
  return `https://yandex.uz/maps/?text=${encodeURIComponent(query)}`;
}

/** Matndan slug yaratish */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
