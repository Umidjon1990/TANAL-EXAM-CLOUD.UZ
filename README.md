# TANAL Imtihon Platformasi

O'zbekiston bo'ylab **TANAL arab tili sertifikat imtihonlari** rasmiy
sanalarini yagona, ishonchli platformada to'plovchi tizim. Test markazlari
imtihon sanalarini taklif qiladi, bosh administrator ularni tasdiqlaydi va
faqat tasdiqlangan sanalar ommaga ko'rinadi.

## Asosiy imkoniyatlar

- 🌐 **Ommaviy ko'rinish** — ro'yxatdan o'tmasdan tasdiqlangan imtihon
  sanalarini ko'rish, viloyat va markaz bo'yicha saralash.
- 🔐 **Yopiq autentifikatsiya** — ommaviy ro'yxatdan o'tish yo'q. Faqat bosh
  administrator foydalanuvchi yaratadi.
- ✅ **Tasdiqlash oqimi** — sanalar hech qachon avtomatik nashr etilmaydi.
- 🏢 **Test markazlari boshqaruvi** — markazlar va ularning adminlarini boshqarish.
- 📣 **Telegram integratsiyasi** — tasdiqlangan sanalar kanalga avtomatik e'lon qilinadi.
- 📊 **Audit log** — barcha muhim amallar qayd etiladi.

## Rollar

| Rol | Tavsif |
| --- | --- |
| `SUPER_ADMIN` | Bosh administrator — foydalanuvchi/markaz yaratadi, sanalarni tasdiqlaydi |
| `TEST_CENTER_ADMIN` | Test markaz administratori — imtihon sanalarini taklif qiladi |
| Ommaviy mehmon | Hisobsiz tasdiqlangan sanalarni ko'radi |

## Statuslar

`PENDING` (Tasdiqlash kutilmoqda) · `APPROVED` (Tasdiqlandi) · `REJECTED`
(Rad etildi) · `CANCELLED` (Bekor qilindi) · `EXPIRED` (Muddati o'tgan)

## Texnologiyalar

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · shadcn/ui ·
Motion · Prisma · PostgreSQL · Telegram Bot API · Railway

## Lokal ishga tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Muhit o'zgaruvchilarini sozlash
cp .env.example .env
#    -> DATABASE_URL, AUTH_SECRET va boshqalarni to'ldiring

# 3. Ma'lumotlar bazasi sxemasini qo'llash
npm run prisma:migrate

# 4. Boshlang'ich super adminni yaratish
npm run db:seed

# 5. Dev serverni ishga tushirish
npm run dev
```

Sayt `http://localhost:3000` manzilida ochiladi.

## Marshrutlar

| Yo'l | Tavsif | Kirish |
| --- | --- | --- |
| `/` | Bosh sahifa | Ommaviy |
| `/imtihonlar` | Imtihon sanalari ro'yxati (filtr bilan) | Ommaviy |
| `/kirish` | Tizimga kirish | Ommaviy |
| `/admin` | Bosh admin paneli | `SUPER_ADMIN` |
| `/admin/markazlar` | Test markazlari | `SUPER_ADMIN` |
| `/admin/foydalanuvchilar` | Foydalanuvchilar | `SUPER_ADMIN` |
| `/panel` | Markaz paneli | `TEST_CENTER_ADMIN` |
| `/panel/yangi` | Yangi sana taklif qilish | `TEST_CENTER_ADMIN` |

## Xavfsizlik

- Parollar `bcrypt` (12 rounds) bilan xeshlanadi.
- Sessiyalar `jose` JWT (HS256) + `httpOnly`, `secure`, `sameSite=lax` cookie.
- Marshrut himoyasi `middleware.ts` (Edge) va server-tomon `guards` orqali.
- Barcha kirish ma'lumotlari `zod` bilan tekshiriladi.
- Imtihon sanalari faqat server tomonida nashr etiladi — standart bo'yicha
  hech qachon ommaga ko'rinmaydi.

## Railway deploy

1. Railway loyihasiga PostgreSQL plagin qo'shing (`DATABASE_URL` avtomatik).
2. Muhit o'zgaruvchilarini sozlang: `AUTH_SECRET`, `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_CHANNEL_ID`, `SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD`,
   `NEXT_PUBLIC_APP_URL`.
3. `railway.json` build/migrate/start buyruqlarini avtomatik bajaradi.
4. Birinchi deploydan keyin super adminni yaratish uchun: `npm run db:seed`.

### Muddati o'tgan sanalarni avtomatlashtirish (cron)

Railway cron orqali har kuni quyidagi endpointni chaqiring:

```
POST /api/cron/expire
Authorization: Bearer <AUTH_SECRET>
```

## Litsenziya

Ushbu loyiha O'zbekistondagi TANAL imtihon ekotizimi uchun ishlab chiqilgan.
