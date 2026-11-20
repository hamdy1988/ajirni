"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Search, PlusCircle, MapPin, ShieldCheck, Wrench, Music,
  Tractor, Camera, Sparkles, ArrowLeft, BadgeCheck, Zap, Headphones,
  Hammer, BatteryCharging, Tent, HeartPulse, Truck, Home as HomeIcon
} from "lucide-react";
import Link from "next/link";
import { EGYPT_LOCATIONS, EQUIPMENT_CATEGORIES } from "@/lib/locations";

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

const CATEGORY_ICONS: Record<string, any> = {
  "الكل": Sparkles,
  "معدات بناء وهدم": Hammer,
  "عدد يدوية وكهربائية": Wrench,
  "أفراح وصوتيات وإضاءة": Music,
  "كاميرات وتصوير ومونتاج": Camera,
  "معدات زراعية وري": Tractor,
  "مولدات كهرباء وضواغط": BatteryCharging,
  "رحلات وتخييم وشواء": Tent,
  "أجهزة طبية ورعاية منزلية": HeartPulse,
  "أدوات تنظيف وصيانة منزلية": HomeIcon,
  "سيارات ومقطورات ونقل": Truck,
};

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

  const citiesList = selectedGov !== "الكل" ? (EGYPT_LOCATIONS[selectedGov] || []) : [];
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{catName}</span>
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
            <Link href="/add" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold transition shadow-lg">
              <PlusCircle className="w-5 h-5" /> <span>أضف أول معدة الآن</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <Link
                href={`/item/${item.id}`}
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/70 hover:border-emerald-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">لا توجد صورة</div>
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
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">{item.description || "معدة بحالة ممتازة وجاهزة للاستلام الفوري."}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 block">سعر الإيجار اليومي</span>
                      <span className="text-2xl font-black text-slate-900">{item.daily_price}</span>
                      <span className="text-xs font-bold text-slate-500"> جنيه / يوم</span>
                    </div>
                    <span className="bg-slate-100 group-hover:bg-emerald-600 text-slate-900 group-hover:text-white px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-1.5 transition-colors">
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
            <span className="text-sm">منصة الاقتصاد التشاركي وتأجير المعدات في كل محافظات مصر.</span>
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
