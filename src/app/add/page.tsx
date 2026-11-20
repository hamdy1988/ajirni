"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, CheckCircle2, Camera, BadgeCheck, Sparkles, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function AddEquipment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("معدات بناء وصيانة");
  const [description, setDescription] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [governorate, setGovernorate] = useState("القليوبية");
  const [city, setCity] = useState("شبين القناطر");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [equipmentImage, setEquipmentImage] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);

  async function uploadFile(file: File, folder: string) {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!equipmentImage || !idCardImage) return alert("برجاء إرفاق صورة المعدة وصورة البطاقة الشخصية.");
    setLoading(true);
    try {
      const imageUrl = await uploadFile(equipmentImage, "equipments");
      const idCardUrl = await uploadFile(idCardImage, "id_cards");
      const { error } = await supabase.from("equipment").insert([{
        title, category, description, daily_price: Number(dailyPrice),
        governorate, city, owner_name: ownerName, owner_phone: ownerPhone,
        image_url: imageUrl, id_card_url: idCardUrl, status: "pending",
      }]);
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      alert("خطأ: " + (err instanceof Error ? err.message : "حدث خطأ غير متوقع"));
    }
    setLoading(false);
  }
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-5">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">تم استلام معدتك بنجاح!</h2>
          <p className="text-slate-500 text-sm">شكراً لك يا <strong>{ownerName}</strong>. سنراجع بياناتك لتفعيل الإعلان قريباً.</p>
          <Link href="/" className="block w-full bg-slate-900 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  const citiesList = EGYPT_LOCATIONS[governorate] || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-bold text-sm">
            <ArrowRight className="w-5 h-5" /> <span>العودة للرئيسية</span>
          </Link>
          <span className="bg-emerald-600 text-white font-black text-lg px-3 py-1 rounded-xl">أجرني</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4" /> <span>حوّل أدواتك المركونة إلى مصدر دخل شهري</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">اعرض معدتك للإيجار</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-6 sm:p-10 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم المعدة *</label>
            <input required type="text" placeholder="مثال: هيلتي تكسير بوش، سماعة دي جي..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">القسم *</label>
              <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">سعر الإيجار اليومي (جنيه) *</label>
              <input required type="number" min={10} placeholder="250" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">وصف المعدة وحالتها</label>
            <textarea rows={2} placeholder="حالة المعدة والملحقات..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-600" /> المحافظة *</label>
              <select
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl"
                value={governorate}
                onChange={(e) => {
                  const newGov = e.target.value;
                  setGovernorate(newGov);
                  const nextCities = EGYPT_LOCATIONS[newGov] || [];
                  setCity(nextCities.at(0) || "");
                }}
              >
                {Object.keys(EGYPT_LOCATIONS).map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">المدينة / المركز *</label>
              <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={city} onChange={(e) => setCity(e.target.value)}>
                {citiesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><User className="w-4 h-4 text-emerald-600" /> اسمك بالكامل *</label>
              <input required type="text" placeholder="الاسم الثلاثي" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><Phone className="w-4 h-4 text-emerald-600" /> رقم الواتساب *</label>
              <input required type="tel" placeholder="010xxxxxxxx" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 rounded-2xl p-5 text-center cursor-pointer transition">
              <Camera className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
              <span className="block text-sm font-extrabold text-slate-800">{equipmentImage ? `✅ ${equipmentImage.name}` : "اضغط لاختيار صورة المعدة *"}</span>
              <input type="file" accept="image/*" onChange={(e) => setEquipmentImage(e.target.files?.item(0) ?? null)} className="hidden" />
            </label>

            <label className="block border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 rounded-2xl p-5 text-center cursor-pointer transition">
              <BadgeCheck className="w-8 h-8 text-emerald-700 mx-auto mb-1.5" />
              <span className="block text-sm font-extrabold text-slate-900">{idCardImage ? `✅ ${idCardImage.name}` : "اضغط لرفع صورة البطاقة *"}</span>
              <input type="file" accept="image/*" onChange={(e) => setIdCardImage(e.target.files?.item(0) ?? null)} className="hidden" />
            </label>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl text-lg shadow-lg transition disabled:opacity-50">
            {loading ? "جاري الرفع..." : "إرسال المعدة للمراجعة والنشر"}
          </button>
        </form>
      </div>
    </div>
  );
}
