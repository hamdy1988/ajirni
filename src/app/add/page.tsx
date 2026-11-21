"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, CheckCircle2, Camera, BadgeCheck, Sparkles, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

const CATEGORIES = [
  "فساتين زفاف وسواريه",
  "العدد والأدوات ومعدات البناء",
  "الحفلات والأفراح والصوتيات",
  "التصوير والكاميرات والإضاءة",
  "الإلكترونيات والألعاب والبروجكتر",
  "الرحلات والتخييم والشواء",
  "السيارات والدراجات والنقل",
  "المستلزمات الطبية والرعاية",
  "المنزل والحديقة والتنظيف",
  "المعدات الزراعية والمولدات",
  "مستلزمات الأطفال والألعاب"
];

export default function AddEquipment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("فساتين زفاف وسواريه");
  const [description, setDescription] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [village, setVillage] = useState("مدينة شبين القناطر");
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
    if (!equipmentImage || !idCardImage) return alert("من فضلك ارفع صورة المنتج وصورة البطاقة الشخصية للضمان.");
    setLoading(true);
    try {
      const imageUrl = await uploadFile(equipmentImage, "equipments");
      const idCardUrl = await uploadFile(idCardImage, "id_cards");
      const { error } = await supabase.from("equipment").insert([{
        title, category, description, daily_price: Number(dailyPrice),
        governorate: "القليوبية - شبين القناطر", city: village,
        owner_name: ownerName, owner_phone: ownerPhone,
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
          <h2 className="text-2xl font-black text-slate-900">تم استلام إعلانك بنجاح!</h2>
          <p className="text-slate-500 text-sm">تسلم يا <strong>{ownerName}</strong>. هنراجع بياناتك وننشر إعلانك لأهالي شبين القناطر خلال ساعات.</p>
          <Link href="/" className="block w-full bg-slate-900 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }
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
            <Sparkles className="w-4 h-4" /> <span>لأهالي شبين القناطر</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">اعرض حاجتك للإيجار واكسب</h1>
          <p className="text-slate-500 text-sm">عندك فستان زفاف، عدة، كاميرا، أو معدة مركونة؟ أجّرها لجيرانك وحقق دخل إضافي</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-6 sm:p-10 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم المنتج أو المعدة *</label>
            <input required type="text" placeholder="مثال: فستان زفاف ملكي، هيلتي تكسير، سماعة دي جي..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={title} onChange={(e) => setTitle(e.target.value)} />
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
              <label className="block text-sm font-bold text-slate-700 mb-1.5">سعر الإيجار في اليوم (بالجنيه) *</label>
              <input required type="number" min={10} placeholder="مثال: 250" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">وصف المنتج وحالته</label>
            <textarea rows={2} placeholder="اكتب المقاس أو الحالة والملحقات اللي معاه..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-600" /> مكان التسليم في شبين القناطر *</label>
            <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={village} onChange={(e) => setVillage(e.target.value)}>
              {SHIBIN_VILLAGES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
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
              <span className="block text-sm font-extrabold text-slate-800">{equipmentImage ? `✅ ${equipmentImage.name}` : "اضغط لاختيار صورة المنتج *"}</span>
              <input type="file" accept="image/*" onChange={(e) => setEquipmentImage(e.target.files?.item(0) ?? null)} className="hidden" />
            </label>

            <label className="block border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 rounded-2xl p-5 text-center cursor-pointer transition">
              <BadgeCheck className="w-8 h-8 text-emerald-700 mx-auto mb-1.5" />
              <span className="block text-sm font-extrabold text-slate-900">{idCardImage ? `✅ ${idCardImage.name}` : "اضغط لرفع صورة البطاقة *"}</span>
              <input type="file" accept="image/*" onChange={(e) => setIdCardImage(e.target.files?.item(0) ?? null)} className="hidden" />
            </label>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl text-lg shadow-lg transition disabled:opacity-50">
            {loading ? "جاري الرفع..." : "ابعت الإعلان للمراجعة والنشر"}
          </button>
        </form>
      </div>
    </div>
  );
}
