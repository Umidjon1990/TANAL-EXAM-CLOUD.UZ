/**
 * Faqat ommaviy (NEXT_PUBLIC_*) konfiguratsiya. Bu modul hech qachon
 * maxfiy o'zgaruvchilarni (AUTH_SECRET kabi) tekshirmaydi yoki import qilmaydi,
 * shuning uchun statik marshrutlar (robots.txt, sitemap.xml) va metadata
 * build paytida xavfsiz ishlaydi — maxfiy o'zgaruvchilar bo'lmasa ham.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";
