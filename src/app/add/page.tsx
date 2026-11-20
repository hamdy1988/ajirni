"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, CheckCircle2, Camera, BadgeCheck, Sparkles, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    if (!equipmentImage || !idCardImage) return alert("برجاء إرفاق صورة المعدة وصورة البطاقة الشخصية للضمان.");
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
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">تم استلام معدتك بنجاح!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            شكراً لك يا <strong className="text-slate-800">{ownerName}</strong>. سيقوم فريق منصة <strong className="text-emerald-600">أجرني</strong> بمراجعة بياناتك وصورة البطاقة خلال ساعات لتفعيل إعلانك.
          </p>
          <Link href="/" className="block w-full bg-slate-900 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold transition">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-bold text-sm transition">
            <ArrowRight className="w-5 h-5" /> <span>العودة للرئيسية</span>
          </Link>
          <span className="bg-emerald-600 text-white font-black text-lg px-3 py-1 rounded-xl">أجرني</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-10">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4" /> <span>حوّل أدواتك المركونة إلى مصدر دخل شهري</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">اعرض معدتك للإيجار</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            التسجيل مجاني 100% — نربطك بالمستأجرين الجادين في منطقتك بعد التحقق من جدية الحجز.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-6 sm:p-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">1. تفاصيل المعدة</h2>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم المعدة *</label>
              <input required type="text" placeholder="مثال: هيلتي تكسير بوش، سماعة دي جي..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">القسم *</label>
                <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="معدات بناء وصيانة">معدات بناء وصيانة</option>
                  <option value="أفراح ومناسبات">أفراح ومناسبات</option>
                  <option value="معدات زراعية">معدات زراعية</option>
                  <option value="تصوير وإلكترونيات">تصوير وإلكترونيات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">سعر الإيجار اليومي (بالجنيه) *</label>
                <input required type="number" min={10} placeholder="مثال: 250" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">وصف المعدة وحالتها</label>
              <textarea rows={3} placeholder="اذكر حالة المعدة والملحقات المتوفرة معها..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">2. الموقع وبيانات التواصل</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-600" /> المحافظة *</label>
                <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white" value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
                  <option value="القليوبية">القليوبية</option>
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">المدينة / المركز *</label>
                <input required type="text" placeholder="مثال: شبين القناطر" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><User className="w-4 h-4 text-emerald-600" /> اسمك بالكامل *</label>
                <input required type="text" placeholder="الاسم الثلاثي" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><Phone className="w-4 h-4 text-emerald-600" /> رقم الواتساب *</label>
                <input required type="tel" placeholder="010xxxxxxxx" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">3. الصور والتوثيق الأمني</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/70 rounded-2xl p-5 text-center transition">
                <Camera className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <label className="block text-sm font-bold text-slate-800 mb-1">صورة واضحة للمعدة *</label>
                <p className="text-xs text-slate-400 mb-3">تظهر للعملاء في الصفحة الرئيسية</p>
                <input required type="file" accept="image/*" onChange={(e) => setEquipmentImage(e.target.files?.item(0) ?? null)} className="text-xs text-slate-600 w-full" />
              </div>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/70 rounded-2xl p-5 text-center transition">
                <BadgeCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <label className="block text-sm font-bold text-slate-800 mb-1">صورة البطاقة الشخصية *</label>
                <p className="text-xs text-slate-400 mb-3">للتوثيق ومراجعة بياناتك فقط</p>
                <input required type="file" accept="image/*" onChange={(e) => setIdCardImage(e.target.files?.item(0) ?? null)} className="text-xs text-slate-600 w-full" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-2xl font-black transition">
            {loading ? "جارٍ إرسال البيانات..." : "إرسال الإعلان للمراجعة"}
          </button>
        </form>
      </div>
    </div>
  );
}
