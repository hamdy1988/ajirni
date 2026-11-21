"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Search, PlusCircle, MapPin, ShieldCheck, ArrowLeft, BadgeCheck, LayoutGrid } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Equipment {
  id: string;
  title: string;
  category: string;
  description: string;
  daily_price: number;
  governorate: string;
  city: string;
  image_url: string;
}

const SHIBIN_VILLAGES = [
  "مدينة شبين القناطر", "كفر شبين", "طحانوب", "نوى", "الأحراز", "الجعافرة",
  "منية شبين", "تل بني تميم", "القشيش", "الزهويين", "كفر طحا", "كفر الشوبك",
  "طحوريا", "كفر الدير", "كفر سندوة", "كفر الصهبي", "كفر سليمان الور", "كفر حمزة",
  "كفر سعد بحيري", "كفر الشيخة سالمة", "كفر الترامسة", "كفر الحصافة", "الحصافة",
  "الحزانية", "السلمانية", "العطارة", "الغريري", "المريج", "القلزم", "عرب جهينة",
  "عرب الصوالحة", "عرب العليقات", "عرب الشعارة", "عرب الرمل", "كوم السمن",
  "منشأة الكرام", "نزلة عرب جهينة", "عزبة الوكيل", "عزبة الجندي", "عزبة الإصلاح",
  "قرية أو عزبة أخرى بالمركز"
];

const VISUAL_CATEGORIES = [
  {
    name: "فساتين زفاف وسواريه",
    short: "فساتين زفاف",
    img: "https://pexels.com"
  },
  {
    name: "العدد والأدوات ومعدات البناء",
    short: "معدات بناء",
    img: "https://pexels.com"
  },
  {
    name: "الحفلات والأفراح والصوتيات",
    short: "حفلات وصوتيات",
    img: "https://pexels.com"
  },
  {
    name: "التصوير والكاميرات والإضاءة",
    short: "كاميرات وتصوير",
    img: "https://pexels.com"
  },
  {
    name: "الإلكترونيات والألعاب والبروجكتر",
    short: "إلكترونيات وألعاب",
    img: "https://pexels.com"
  },
  {
    name: "الرحلات والتخييم والشواء",
    short: "رحلات وتخييم",
    img: "https://pexels.com"
  },
  {
    name: "السيارات والدراجات والنقل",
    short: "سيارات ونقل",
    img: "https://pexels.com"
  },
  {
    name: "المستلزمات الطبية والرعاية",
    short: "مستلزمات طبية",
    img: "https://pexels.com"
  },
  {
    name: "المنزل والحديقة والتنظيف",
    short: "أدوات منزلية",
    img: "https://pexels.com"
  },
  {
    name: "المعدات الزراعية والمولدات",
    short: "زراعة ومولدات",
    img: "https://pexels.com"
  },
  {
    name: "مستلزمات الأطفال والألعاب",
    short: "مستلزمات أطفال",
    img: "https://pexels.com"
  }
];
export default function Home() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("الكل");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await supabase
        .from("equipment")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (data) setEquipments(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = equipments.filter((item) => {
    const matchText = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVillage = selectedVillage === "الكل" || item.city === selectedVillage;
    const matchCat = selectedCategory === "الكل" || item.category === selectedCategory;
    return matchText && matchVillage && matchCat;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl px-4 py-2 rounded-2xl shadow-md">
              أجرني
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-slate-900 leading-none">أجرني • شبين القناطر</p>
              <p className="text-xs text-slate-500 mt-1">أول منصة لتأجير المنتجات والمعدات لأهالي شبين القناطر</p>
            </div>
          </Link>

          <Link href="/add" className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition shadow-sm">
            <PlusCircle className="w-5 h-5" />
            <span>اعرض حاجتك واكسب</span>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-24 px-4">
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold">
            <BadgeCheck className="w-4 h-4" />
            <span>منصة تأجير المعدات والمنتجات لأهالي شبين القناطر</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
            بدل ما تشتريها بآلاف.. <span className="text-emerald-400">استأجرها ليومين!</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto">
            محتاج فستان زفاف، هيلتي، سماعة أفراح، كاميرا، بلايستيشن، أو مولد كهرباء؟ استأجرها من جيرانك في شبين القناطر بأقل سعر وأمان تام.
          </p>

          <div className="bg-white p-3 rounded-3xl shadow-2xl text-slate-800 mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-7 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute right-4" />
              <input
                type="text"
                placeholder="بتدور على إيه؟ (فستان زفاف، هيلتي، سماعة، كاميرا...)"
                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:col-span-5">
              <select
                className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 cursor-pointer"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
              >
                <option value="الكل">📍 كل مناطق شبين القناطر</option>
                {SHIBIN_VILLAGES.map((village) => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">تصفح حسب القسم</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">اختر القسم لعرض المنتجات المتاحة للإيجار</p>
          </div>
          {selectedCategory !== "الكل" && (
            <button
              onClick={() => setSelectedCategory("الكل")}
              className="text-xs font-bold bg-slate-200/80 hover:bg-slate-300 text-slate-800 px-3.5 py-2 rounded-xl transition"
            >
              عرض الكل ×
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory("الكل")}
            className={`group rounded-2xl p-3 border text-center transition-all flex flex-col items-center justify-center gap-2.5 bg-white ${
              selectedCategory === "الكل"
                ? "border-emerald-600 ring-2 ring-emerald-500/30 shadow-md"
                : "border-slate-200/80 hover:border-emerald-400 shadow-sm"
            }`}
          >
            <div className="w-full h-24 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <LayoutGrid className="w-10 h-10" />
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-800">جميع الأقسام</span>
          </button>

          {VISUAL_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`group rounded-2xl p-3 border text-center transition-all flex flex-col items-center gap-2.5 bg-white ${
                  active
                    ? "border-emerald-600 ring-2 ring-emerald-500/30 shadow-md"
                    : "border-slate-200/80 hover:border-emerald-400 shadow-sm"
                }`}
              >
                <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={cat.img}
                    alt={cat.short}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className={`font-extrabold text-xs sm:text-sm line-clamp-1 ${active ? "text-emerald-700" : "text-slate-800"}`}>
                  {cat.short}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {selectedCategory === "الكل" ? "المعروض للإيجار في شبين القناطر" : selectedCategory}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">منتجات ومعدات موثقة لأهالي شبين القناطر</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 font-extrabold px-4 py-1.5 rounded-full text-sm">
            {filtered.length} منتج متاح
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-slate-200 max-w-xl mx-auto space-y-4">
            <h3 className="text-xl font-black text-slate-900">لا توجد منتجات في هذا القسم حالياً</h3>
            <p className="text-slate-500 text-sm">اختر "جميع الأقسام" أو كن أول من يعرض منتجه في هذا القسم!</p>
            <Link href="/add" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold">
              <PlusCircle className="w-5 h-5" /> <span>أضف أول منتج الآن</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <Link href={`/item/${item.id}`} key={item.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition flex flex-col">
                <div className="h-56 bg-slate-100 relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">لا توجد صورة</div>
                  )}
                  <span className="absolute top-4 right-4 bg-white/95 text-slate-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center text-xs font-bold text-emerald-600 gap-1 mb-1.5">
                      <MapPin className="w-3.5 h-3.5" /> <span>شبين القناطر • {item.city}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description || "جاهز للاستلام الفوري."}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-black text-slate-900">{item.daily_price}</span>
                      <span className="text-xs font-bold text-slate-500"> جنيه / يوم</span>
                    </div>
                    <span className="bg-slate-100 group-hover:bg-emerald-600 text-slate-900 group-hover:text-white px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-1 transition">
                      <span>احجز الآن</span> <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white font-black text-xl px-3 py-1 rounded-xl">أجرني</span>
            <span className="text-sm">منصة تأجير المنتجات والمعدات لأهالي شبين القناطر.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/add" className="hover:text-white transition">اعرض حاجتك</Link>
            <Link href="/terms" className="hover:text-white transition">الشروط والأحكام</Link>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> حسابات موثقة
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
