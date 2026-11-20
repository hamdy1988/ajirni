"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Search, PlusCircle, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function Home() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGov, setSelectedGov] = useState("القليوبية");
  const [selectedCity, setSelectedCity] = useState("شبين القناطر");
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
    const matchGov = selectedGov === "الكل" || item.governorate === selectedGov;
    const matchCity = selectedCity === "الكل" || item.city === selectedCity;
    const matchCat = selectedCategory === "الكل" || item.category === selectedCategory;
    return matchText && matchGov && matchCity && matchCat;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-bold text-2xl px-3 py-1 rounded-lg">أجرني</span>
            <span className="text-sm text-gray-500 hidden sm:inline">منصة تأجير المعدات بين الأفراد</span>
          </div>
          <Link href="/add" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            <span>أجّر معدتك واكسب</span>
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-b from-emerald-800 to-emerald-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">بدل ما تشتريها بآلاف.. استأجر أي معدة في منطقتك بأقل سعر!</h1>
          <p className="text-emerald-100 text-lg">منصة موثوقة تربط أصحاب المعدات بالمستأجرين في شبين القناطر وكل مصر</p>

          <div className="bg-white p-4 rounded-2xl shadow-lg text-gray-800 mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="ابحث عن دريل، سلم، سماعة..."
                className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white"
              value={selectedGov}
              onChange={(e) => { setSelectedGov(e.target.value); setSelectedCity("الكل"); }}
            >
              <option value="الكل">كل المحافظات</option>
              <option value="القليوبية">القليوبية</option>
              <option value="القاهرة">القاهرة</option>
              <option value="الجيزة">الجيزة</option>
            </select>

            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="الكل">كل المدن / المراكز</option>
              {selectedGov === "القليوبية" && (
                <>
                  <option value="شبين القناطر">شبين القناطر</option>
                  <option value="بنها">بنها</option>
                  <option value="الخانكة">الخانكة</option>
                  <option value="القناطر الخيرية">القناطر الخيرية</option>
                  <option value="طوخ">طوخ</option>
                </>
              )}
              {selectedGov === "القاهرة" && (
                <>
                  <option value="مدينة نصر">مدينة نصر</option>
                  <option value="التجمع الخامس">التجمع الخامس</option>
                </>
              )}
              {selectedGov === "الجيزة" && (
                <>
                  <option value="الشيخ زايد">الشيخ زايد</option>
                  <option value="6 أكتوبر">6 أكتوبر</option>
                </>
              )}
            </select>

            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="الكل">كل الأقسام</option>
              <option value="معدات بناء وصيانة">معدات بناء وصيانة</option>
              <option value="أفراح ومناسبات">أفراح ومناسبات</option>
              <option value="معدات زراعية">معدات زراعية</option>
              <option value="تصوير وإلكترونيات">تصوير وإلكترونيات</option>
            </select>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">المعدات المتاحة للإيجار ({filtered.length})</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500">جاري تحميل المعدات...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4">
            <p className="text-xl text-gray-600 font-semibold">لا توجد معدات معروضة في هذا النطاق حالياً!</p>
            <Link href="/add" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
              <PlusCircle className="w-5 h-5" />
              <span>أضف أول معدة الآن</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">لا توجد صورة</div>
                  )}
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">{item.category}</span>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600 gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>{item.governorate} - {item.city}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-2xl font-extrabold text-emerald-700">{item.daily_price}</span>
                        <span className="text-sm text-gray-500"> جنيه / اليوم</span>
                      </div>
                      <Link href={`/item/${item.id}`} className="bg-gray-900 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                        احجز الآن
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div><span className="text-white font-bold text-lg">منصة أجرني (Ajirni)</span> — الوسيط الآمن لتأجير المعدات.</div>
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <span>جميع المعلنين موثقون بالبطاقة الشخصية</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
