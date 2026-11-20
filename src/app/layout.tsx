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
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-[#F8FAFC] text-slate-900">
        {children}

        <a
          href="https://201063686679"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3.5 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm"
        >
          <MessageCircle className="w-6 h-6" />
          <span>تواصل معنا</span>
        </a>
      </body>
    </html>
  );
}
