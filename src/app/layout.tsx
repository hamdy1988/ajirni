import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة أجرني | استأجر أي معدة في منطقتك بأمان",
  description: "المنصة الأولى لتأجير المعدات بين الأفراد في مصر",
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
      </body>
    </html>
  );
}
