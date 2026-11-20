import type { Metadata } from "next";
import "./globals.css";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "منصة أجرني | استأجر أي معدة في منطقتك بأمان",
  description: "المنصة الأولى لتأجير المعدات والأدوات بين الأفراد في مصر",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const WHATSAPP_NUMBER = "201063686679"; // اكتب 2 ثم رقمك المكون من 11 رقماً (مثال: 201012345678)
  const MESSAGE = encodeURIComponent("السلام عليكم، عندي استفسار بخصوص منصة أجرني");

  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-[#F8FAFC] text-slate-900">
        {children}

        <a
          href={`https://whatsapp.com{WHATSAPP_NUMBER}&text=${MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معنا عبر واتساب"
          className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3.5 rounded-full shadow-xl shadow-emerald-900/20 flex items-center gap-2 font-bold text-sm transition-transform hover:scale-105"
        >
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
          <span className="hidden sm:inline">تواصل معنا</span>
        </a>
      </body>
    </html>
  );
}
