import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "أجرني - منصة تأجير المعدات والأدوات في مصر",
  description: "استأجر أو أجر معداتك بكل سهولة وأمان في شبين القناطر وكل مصر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
