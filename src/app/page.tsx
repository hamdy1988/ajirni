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

const EGYPT_LOCATIONS: Record<string, string[]> = {
  "القليوبية": ["شبين القناطر", "بنها", "الخانكة", "القناطر الخيرية", "طوخ", "قليوب", "شبرا الخيمة", "العبور", "كفر شكر", "قها"],
  "القاهرة": ["مدينة نصر", "التجمع الخامس", "مصر الجديدة", "المعادي", "حلوان", "شبرا", "عين شمس", "المقطم", "الرحاب", "الشروق", "مدينتي", "المرج"],
  "الجيزة": ["6 أكتوبر", "الشيخ زايد", "الهرم", "فيصل", "الدقي", "المهندسين", "إمبابة", "البدرشين", "الحوامدية", "أوسيم", "كرداسة"],
  "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "منيا القمح", "فاقوس", "أبو حماد", "ههيا", "ديرب نجم"],
  "الدقهلية": ["المنصورة", "طلخا", "ميت غمر", "السنبلاوين", "دكرنس", "بلقاس", "شربين"],
  "الغربية": ["طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "السنطة", "بسيون", "سمنود"],
  "المنوفية": ["شبين الكوم", "السادات", "منوف", "أشمون", "الباجور", "قويسنا", "تلا"],
  "الإسكندرية": ["سموحة", "سيدي جابر", "المنتزه", "العجمي", "برج العرب", "محرم بك", "العامرية"],
  "البحيرة": ["دمنهور", "كفر الدوار", "إيتاي البارود", "كوم حمادة", "أبو المطامير", "رشيد", "وادي النطرون"],
  "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "بلطيم", "الحامول", "بيلا"],
  "دمياط": ["دمياط", "دمياط الجديدة", "رأس البر", "فارسكور", "الزرقا", "كفر سعد"],
  "بورسعيد": ["حي الشرق", "حي العرب", "حي الضواحي", "حي الزهور", "بورفؤاد"],
  "الإسماعيلية": ["الإسماعيلية", "فايد", "القنطرة شرق", "القنطرة غرب", "التل الكبير"],
  "السويس": ["حي السويس", "حي الأربعين", "حي عتاقة", "حي فيصل", "العين السخنة"],
  "الفيوم": ["الفيوم", "سنورس", "إطسا", "طامية", "أبشواي"],
  "بني سويف": ["بني سويف", "الواسطى", "ناصر", "ببا", "الفشن"],
  "المنيا": ["المنيا", "ملوي", "سمالوط", "بني مزار", "مغاغة", "أبو قرقاص"],
  "أسيوط": ["أسيوط", "ديروط", "منفلوط", "القوصية", "أبو تيج"],
  "سوهاج": ["سوهاج", "جرجا", "طما", "طهطا", "أخميم"],
  "قنا": ["قنا", "نجع حمادي", "دشنا", "قوص", "أبو تشت"],
  "الأقصر": ["الأقصر", "إسنا", "أرمنت", "البياضية"],
  "أسوان": ["أسوان", "كوم أمبو", "إدفو", "دراو"],
  "البحر الأحمر": ["الغردقة", "رأس غارب", "سفاجا", "القصير", "مرسى علم"],
  "مطروح": ["مرسى مطروح", "العلمين", "الحمام", "سيوة"],
  "شمال سيناء": ["العريش", "الشيخ زويد", "بئر العبد"],
  "جنوب سيناء": ["شرم الشيخ", "دهب", "نويبع", "الطور"],
  "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة"]
};

const CATEGORIES = [
  "الكل",
  "معدات بناء وصيانة",
  "عدد يدوية وكهربائية",
  "أفراح وصوتيات وإضاءة",
  "كاميرات وتصوير ومونتاج",
  "معدات زراعية وري",
  "مولدات كهرباء وضواغط",
  "رحلات وتخييم وشواء",
  "أجهزة طبية ورعاية منزلية",
  "أدوات تنظيف وصيانة منزلية",
  "سيارات ومقطورات ونقل"
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

  const citiesList = selectedGov !== "الكل" ? (EGYPT_LOCATIONS[selectedGov] || []) : [];
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl px-4 py-2 rounded-2xl shadow-md">
              أجرني
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-slate-900 leading-none">منصة أجرني</p>
              <p className="text-xs text-slate-500 mt-1">استأجر أي معدة في كل محافظات مصر</p>
            </div>
          </Link>

          <Link href="/add" className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition shadow-sm">
            <PlusCircle className="w-5 h-5" />
            <span>اعرض معدتك واكسب</span>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-28 px-4">
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold">
            <BadgeCheck className="w-4 h-4" />
            <span>أكبر منصة لتأجير المعدات والأدوات في 27 محافظة</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
            ليش تشتريها بآلاف.. <span className="text-emerald-400">استأجرها ليوم!</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto">
            استأجر معدات البناء، أنظمة الصوت والأفراح، الكاميرات، والمولدات من جيرانك في أي محافظة بأقل تكلفة وضمان كامل.
          </p>

          <div className="bg-white p-3 rounded-3xl shadow-2xl text-slate-800 mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-5 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute right-4" />
              <input
                type="text"
                placeholder="ابحث عن دريل، هيلتي، سماعة، مولد..."
                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <select
                className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700"
                value={selectedGov}
                onChange={(e) => { setSelectedGov(e.target.value); setSelectedCity("الكل"); }}
              >
                <option value="الكل">📍 كل المحافظات (27)</option>
                {Object.keys(EGYPT_LOCATIONS).map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <select
                className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="الكل">🏘️ كل المدن والمراكز</option>
                {citiesList.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 w-full">
        <div className="bg-white p-3 rounded-3xl shadow-lg border border-slate-100 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((catName) => (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition ${
                selectedCategory === catName
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {catName}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex-grow w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">أحدث المعدات المتاحة</h2>
          <span className="bg-emerald-50 text-emerald-700 font-extrabold px-4 py-1.5 rounded-full text-sm">
            {filtered.length} معدة متاحة
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold">جاري تحميل المعدات...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-slate-200 max-w-xl mx-auto space-y-4">
            <h3 className="text-xl font-black text-slate-900">لا توجد معدات مطابقة لبحثك حالياً</h3>
            <p className="text-slate-500 text-sm">جرّب اختيار "كل المحافظات" أو أضف أول معدة الآن!</p>
            <Link href="/add" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold">
              <PlusCircle className="w-5 h-5" /> <span>أضف معدة الآن</span>
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
                      <MapPin className="w-3.5 h-3.5" /> <span>{item.governorate} • {item.city}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description || "جاهزة للاستلام الفوري."}</p>
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

      <footer className="bg-slate-950 text-slate-400 py-10 px-4 text-center text-sm">
        <p>© 2026 منصة أجرني — تأجير المعدات والأدوات في كل محافظات مصر.</p>
      </footer>
    </div>
  );
}
