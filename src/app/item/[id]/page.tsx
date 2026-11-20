"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, MapPin, ShieldCheck, CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ItemDetails() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("equipment").select("*").eq("id", id).single().then(({ data }) => {
      setItem(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-20 text-center text-gray-500">جاري التحميل...</div>;
  if (!item) return <div className="p-20 text-center text-red-500">المعدة غير موجودة!</div>;

  const totalPrice = item.daily_price * days;
  const commission = Math.round(totalPrice * 0.2); // عمولتك 20%
  const ownerAmount = totalPrice - commission; // الباقي لصاحب المعدة عند الاستلام

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!receiptFile) return alert("برجاء إرفاق صورة إيصال تحويل العربون (العمولة)");
    setSubmitting(true);
    try {
      const ext = receiptFile.name.split(".").pop();
      const path = `receipts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(path, receiptFile);
      if (upErr) throw upErr;

      const receiptUrl = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;

      const { error } = await supabase.from("bookings").insert([{
        equipment_id: item.id,
        renter_name: renterName,
        renter_phone: renterPhone,
        days_count: days,
        total_price: totalPrice,
        commission_amount: commission,
        receipt_url: receiptUrl,
        status: "pending",
      }]);
      if (error) throw error;
      setBooked(true);
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    }
    setSubmitting(false);
  }

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold">تم إرسال طلب الحجز بنجاح!</h2>
          <p className="text-gray-600">
            تم استلام إيصال تحويل العربون ({commission} جنيه). سيتواصل معك فريق <strong>أجرني</strong> على واتساب خلال دقائق لتزويدك برقم وعنوان صاحب المعدة للاستلام.
          </p>
          <Link href="/" className="block w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 font-bold mb-6">
          <ArrowRight className="w-5 h-5" /> <span>العودة للمعدات</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-4">
            <img src={item.image_url} alt={item.title} className="w-full h-64 object-cover rounded-xl bg-gray-100" />
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">{item.category}</span>
            <h1 className="text-2xl font-extrabold text-gray-900">{item.title}</h1>
            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            <div className="flex items-center gap-2 text-gray-700 font-semibold pt-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>{item.governorate} - {item.city}</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>صاحب المعدة ({item.owner_name}) موثق بالبطاقة الشخصية لدى منصة أجرني.</span>
            </div>
          </div>

          <form onSubmit={handleBooking} className="space-y-4 border-t md:border-t-0 md:border-r pt-4 md:pt-0 md:pr-6">
            <h2 className="text-xl font-bold text-gray-900">احجز المعدة الآن</h2>
            <div>
              <label className="block text-sm font-bold mb-1">عدد أيام الإيجار</label>
              <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value)))} className="w-full p-3 border rounded-xl font-bold" />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between"><span>إجمالي الإيجار ({days} يوم):</span> <strong>{totalPrice} جنيه</strong></div>
              <div className="flex justify-between text-emerald-700 font-bold"><span>عربون جدية الحجز (يدفع الآن للمنصة):</span> <span>{commission} جنيه</span></div>
              <div className="flex justify-between text-gray-500"><span>المتبقي (يدفع لصاحب المعدة عند الاستلام):</span> <span>{ownerAmount} جنيه</span></div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1 text-amber-900">
              <div className="font-bold flex items-center gap-1"><CreditCard className="w-4 h-4" /> خطوة الدفع لتأكيد الحجز:</div>
              <p>حوّل مبلغ <strong>{commission} جنيه</strong> عبر <strong>فودافون كاش أو إنستاباي</strong> على الرقم: <strong className="text-sm select-all">01063686679</strong> ثم ارفع صورة الإيصال بالأسفل.</p>
            </div>

            <input required type="text" placeholder="اسمك بالكامل" className="w-full p-3 border rounded-xl" value={renterName} onChange={(e) => setRenterName(e.target.value)} />
            <input required type="tel" placeholder="رقم الواتساب الخاص بك" className="w-full p-3 border rounded-xl" value={renterPhone} onChange={(e) => setRenterPhone(e.target.value)} />

            <div>
              <label className="block text-xs font-bold mb-1">صورة إيصال التحويل (سكرين شوت) *</label>
              <input required type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="text-xs w-full border p-2 rounded-xl" />
            </div>

            <button disabled={submitting} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl">
              {submitting ? "جاري تأكيد الحجز..." : "تأكيد الحجز وإرسال الإيصال"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
