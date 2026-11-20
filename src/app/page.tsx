"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Search, PlusCircle, MapPin, ShieldCheck, Wrench, Music,
  Tractor, Camera, Sparkles, ArrowLeft, BadgeCheck, Zap, Headphones
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
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl px-4 py-2 rounded-2xl shadow-md shadow-emerald-600/20">
              أجرني
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-slate-900 leading-none">منصة أجرني</p>
              <p className="text-xs text-slate-500 mt-1">استأجر أي معدة في منطقتك بأمان</p>
            </div>
          </Link>

          <Link
            href="/add"
            className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-600/20"
          >
            <PlusCircle className="w-5 h-5" />
            <span>اعرض معدتك واكسب</span>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/35 via-slate-950 to-slate-950" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold">
            <BadgeCheck className="w-4 h-4" />
            <span>المنصة الموثوقة لتأجير المعدات بين الأفراد في مصر</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            ليش تشتريها بآلاف..{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-300">
              استأجرها ليوم!
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            استأجر معدات البناء، أنظمة الصوت والأفراح، والكاميرات من جيرانك في شبين القناطر وكل المحافظات بأقل تكلفة وضمان كامل.
          </p>

          <div className="bg-white p-3 rounded-3xl shadow-2xl shadow-black/40 text-slate-800 mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2.5 border border-slate-100">
            <div className="md:col-span-5 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute right-4" />
              <input
                type="text"
                placeholder="ابحث عن دريل، هيلتي، سماعة، سلم..."
                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <select
                className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
                className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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

          <div className="pt-6 flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> حسابات موثقة بالبطاقة الشخصية</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-400" /> حجز فوري واستلام يداً بيد</span>
            <span className="flex items-center gap-1.5"><Headphones className="w-4 h-4 text-emerald-400" /> دعم مباشر عبر واتساب</span>
          </div>
        </div>
      </section>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 w-full">
        <div className="bg-white p-3 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100 flex items-center gap-2 overflow-x-auto">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex-grow w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">أحدث المعدات المتاحة للإيجار</h2>
            <p className="text-slate-500 text-sm mt-1">تصفح المعدات الموثقة في منطقتك واحجزها في ثوانٍ</p>
          </div>
          <span className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-extrabold px-4 py-1.5 rounded-full text-sm">
            {filtered.length} معدة متاحة الآن
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold text-lg">جاري تحميل المعدات المتاحة...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-slate-200/60 shadow-sm max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">لا توجد معدات مطابقة لبحثك حالياً</h3>
            <p className="text-slate-500 text-sm">جرّب اختيار "كل المحافظات" أو كن أول من يعرض معدته في هذه المنطقة!</p>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold transition shadow-lg shadow-emerald-600/20"
            >
              <PlusCircle className="w-5 h-5" />
              <span>أضف أول معدة الآن</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <Link
                href={`/item/${item.id}`}
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/70 hover:border-emerald-500/40 shadow-sm hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 flex flex-col"
              >
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                      لا توجد صورة
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm">
                    {item.category}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3.5 h-3.5" /> موثق
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center text-xs font-bold text-emerald-600 gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.governorate} • {item.city}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description || "معدة بحالة ممتازة وجاهزة للاستلام الفوري."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 block">سعر الإيجار اليومي</span>
                      <span className="text-2xl font-black text-slate-900">{item.daily_price}</span>
                      <span className="text-xs font-bold text-slate-500"> جنيه / يوم</span>
                    </div>

                    <span className="bg-slate-100 group-hover:bg-emerald-600 text-slate-900 group-hover:text-white px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-1.5 transition-colors">
                      <span>احجز الآن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <section className="bg-white border-t border-slate-200/70 py-16 px-4 sm:px-6 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900">كيف تستأجر من أجرني؟</h2>
            <p className="text-slate-500 mt-2">خطوات بسيطة وآمنة تضمن حق المستأجر وصاحب المعدة</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl">1</div>
              <h3 className="text-xl font-bold text-slate-900">اختر المعدة والمدة</h3>
              <p className="text-slate-500 text-sm leading-relaxed">تصفح المعدات المتاحة في مدينتك وحدد عدد أيام الإيجار المناسبة لشغلك.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl">2</div>
              <h3 className="text-xl font-bold text-slate-900">أكّد حجزك بالعربون</h3>
              <p className="text-slate-500 text-sm leading-relaxed">ادفع عربون جدية الحجز (20%) عبر إنستاباي أو فودافون كاش ليصلك رقم وعنوان المؤجر فوراً.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl">3</div>
              <h3 className="text-xl font-bold text-slate-900">استلم وادفع الباقي</h3>
              <p className="text-slate-500 text-sm leading-relaxed">افحص المعدة واستلمها يداً بيد، وادفع باقي المبلغ لصاحب المعدة بكل أمان.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white font-black text-xl px-3 py-1 rounded-xl">أجرني</span>
            <span className="text-sm">منصة الاقتصاد التشاركي وتأجير المعدات في مصر.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/add" className="hover:text-white transition">اعرض معدتك</Link>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> جميع الحسابات موثقة بالبطاقة
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}