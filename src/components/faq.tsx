import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Platformadan foydalanish uchun ro'yxatdan o'tish kerakmi?",
    a: "Yo'q. Talabalar uchun ro'yxatdan o'tish shart emas — imtihon sanalarini bemalol ko'rishingiz mumkin.",
  },
  {
    q: "Imtihon sanalari qanchalik ishonchli?",
    a: "Har bir sana faqat vakolatli test markazi tomonidan taklif qilinadi va bosh administrator tasdiqlagandan so'nggina ommaga chiqadi.",
  },
  {
    q: "Imtihonga qanday yoziladi?",
    a: "Sizni qiziqtirgan sana kartasidagi test markazi telefon raqamiga bog'laning. Ro'yxatga olish bevosita markaz orqali amalga oshiriladi.",
  },
  {
    q: "Test markazi sifatida qanday qo'shilaman?",
    a: "Aloqa sahifasidagi pochta orqali markaz ma'lumotlaringizni yuboring — administrator siz uchun hisob yaratadi.",
  },
];

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border bg-card px-5 shadow-sm transition-colors open:border-primary/30 hover:border-primary/30 [&_summary]:list-none"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-3 py-4 font-medium">
            {item.q}
            <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
