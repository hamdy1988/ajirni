"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Upload, ShieldCheck, CheckCircle2 } from "lucide-react";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!equipmentImage || !idCardImage) return alert("برجاء إرفاق صورة المعدة وصورة البطاقة");
    setLoading(true);
    try {
      const imageUrl = await uploadFile(equipmentImage, "equipments");
      const idCardUrl = await uploadFile(idCardImage, "id_cards");
      const { error } = await supabase.from("equipment").insert([{
        title, category, description,
        daily_price: Number(dailyPrice),
        governorate, city,
        owner_name: ownerName,
        owner_phone: ownerPhone,
        image_url: imageUrl,
        id_card_url: idCardUrl,
        status: "pending",
      }]);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      alert("خطأ: " + err.message);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold">تم استلام معدتك بنجاح!</h2>
          <p className="text-gray-600">سيتم مراجعة البيانات وصورة البطاقة خلال ساعات لتفعيل إعلانك.</p>
          <Link href="/" className="block w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 font-bold mb-6">
          <ArrowRight className="w-5 h-5" /> <span>العودة للرئيسية</span>
        </Link>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-2xl font-extrabold mb-4">أضف معدتك للإيجار واكسب منها</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="text" placeholder="اسم المعدة (مثال: هيلتي بوش، سماعة دي جي...)" className="w-full p-3 border rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="w-full p-3 border rounded-xl bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="معدات بناء وصيانة">معدات بناء وصيانة</option>
                <option value="أفراح ومناسبات">أفراح ومناسبات</option>
                <option value="معدات زراعية">معدات زراعية</option>
                <option value="تصوير وإلكترونيات">تصوير وإلكترونيات</option>
              </select>
              <input required type="number" placeholder="سعر الإيجار اليومي (بالجنيه)" className="w-full p-3 border rounded-xl" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} />
            </div>
            <textarea rows={2} placeholder="وصف المعدة وحالتها..." className="w-full p-3 border rounded-xl" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="w-full p-3 border rounded-xl bg-white" value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
                <option value="القليوبية">القليوبية</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
              </select>
              <input required type="text" placeholder="المدينة / المركز (مثال: شبين القناطر)" className="w-full p-3 border rounded-xl" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="اسمك بالكامل" className="w-full p-3 border rounded-xl" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              <input required type="tel" placeholder="رقم الواتساب (010xxxxxxxx)" className="w-full p-3 border rounded-xl" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed rounded-xl p-3 text-center">
                <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <label className="block text-sm font-bold mb-1">صورة المعدة *</label>
                <input required type="file" accept="image/*" onChange={(e) => setEquipmentImage(e.target.files?.[0] ?? null)} className="text-xs w-full" />
              </div>
              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-xl p-3 text-center">
                <ShieldCheck className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                <label className="block text-sm font-bold mb-1">صورة البطاقة (سرية للأمان) *</label>
                <input required type="file" accept="image/*" onChange={(e) => setIdCardImage(e.target.files?.[0] ?? null)} className="text-xs w-full" />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-lg">
              {loading ? "جاري الرفع..." : "إرسال المعدة للمراجعة"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
