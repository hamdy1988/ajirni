"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Search, PlusCircle, MapPin, ShieldCheck, Wrench, Music,
  Tractor, Camera, Sparkles, CheckCircle2, Clock, Wallet, ArrowLeft
} from "lucide-react";
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

const CATEGORIES = [
  { name: "الكل", icon: Sparkles },
  { name: "معدات بناء وصيانة", icon: Wrench },
  { name: "أفراح ومناسبات", icon: Music },
  { name: "معدات زراعية", icon: Tractor },
  { name: "تصوير وإلكترونيات", icon: Camera },
];

export default function Home() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGov, setSelectedGov] = useState("الكل");
  const [selectedCity, setSelectedCity] = useState("الكل");
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* شريط التنقل العلوي */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl px-4 py-2 rounded-2xl shadow-md shadow-emerald-600/20">
              أجرني
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 leading-none">منصة أجرني</p>
              <p className="text-xs text-slate-500 mt-1">استأجر أي شيء.. في أي وقت</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/add"
              className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-600/20"
            >
              <PlusCircle className="w-5 h-5" />
              <span>اعرض معدتك للإيجار</span>
            </Link>
          </div>
        </div>
      </header>

      {/* قسم الواجهة الرئيسية (Hero Section) */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/30 via-slate-950 to-slate-950" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>المنصة الأولى لتأجير المعدات الموثقة في مصر</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            ليش تشتريها بآلاف..{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-300">
              استأجرها ليوم!
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            استأجر معدات البناء، أنظمة الصوت والأفراح، والكاميرات من جيرانك في شبين القناطر وكل محافظات مصر بأمان وضمان كامل.
          </p>

          {/* صندوق البحث الفاخر */}
          <div className="bg-white p-3 rounded-3xl shadow-2xl shadow-black/40 text-slate-800 mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2.5 border border-slate-100">
            <div className="md:col-span-5 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute right-4" />
              <input
                type="text"
                placeholder="إيش المعدة اللي تدور عليها؟ (هيلتي، سماعة...)"
                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <select
                className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                value={selectedGov}
                onChange={(e) => { setSelectedGov(e.target.value); setSelectedCity("الكل"); }}
              >
                <option value="الكل">📍 كل المحافظات</option>
                <option value="القليوبية">القليوبية</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <select
                className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="الكل">🏘️ كل المدن والمراكز</option>
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
            </div>
          </div>
        </div>
      </section>

      {/* شريط الأقسام التفاعلي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 w-full">
        <div className="bg-white p-3 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* قسم عرض المعدات */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">أحدث المعدات المتاحة</h2>
            <p className="text-slate-500 text-sm mt-1">تم فحص وتوثيق جميع المعلنين بالهوية الشخصية</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-full text-sm">
            {filtered.length} معدة متاحة
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (

              <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/60 shadow-sm max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">لا توجد معدات مطابقة لبحثك حالياً</h3>

