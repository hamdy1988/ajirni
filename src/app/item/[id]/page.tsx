"use client";

import { FormEvent, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowRight, MapPin, CheckCircle2, CreditCard,
  Calendar, Upload, BadgeCheck, Copy, Check, ChevronRight, ChevronLeft
} from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ItemDetails() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [bookedRanges, setBookedRanges] = useState<{ start_date: string; end_date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [copied, setCopied] = useState(false);

  const WALLET_NUMBER = String(1063686679).padStart(11, "0");

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data: eqData } = await supabase.from("equipment").select("*").eq("id", id).single();
      const { data: bkData } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("equipment_id", id)
        .neq("status", "rejected");

      setItem(eqData);
      if (bkData) setBookedRanges(bkData.filter((b) => b.start_date && b.end_date));
      setLoading(false);
    }
    load();
  }, [id]);

  const todayStr = toDateStr(new Date());

  function isDateBooked(dateStr: string) {
    return bookedRanges.some((r) => dateStr >= r.start_date && dateStr <= r.end_date);
  }

  function handleDayClick(dateStr: string) {
    if (dateStr < todayStr || isDateBooked(dateStr)) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate("");
    } else if (dateStr < startDate) {
      setStartDate(dateStr);
    } else {
      const hasConflict = bookedRanges.some((r) => r.start_date >= startDate && r.start_date <= dateStr);
      if (hasConflict) {
        alert("الفترة المختارة تحتوي على أيام محجوزة بالفعل، اختر فترة متاحة.");
        setStartDate(dateStr);
        setEndDate("");
      } else {
        setEndDate(dateStr);
      }
    }
  }
  let days = 0;
  if (startDate && endDate) {
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    days = Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  } else if (startDate) {
    days = 1;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-slate-500 font-bold">جاري تحميل التقويم والمعدة...</div>;
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 space-y-4">
        <p className="text-xl font-bold text-slate-800">عذراً، هذه المعدة غير متوفرة حالياً.</p>
        <Link href="/" className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold">العودة للرئيسية</Link>
      </div>
    );
  }

  const totalPrice = item.daily_price * (days || 1);
  const commission = days > 0 ? Math.max(30, Math.round(totalPrice * 0.2)) : 0;
  const ownerAmount = totalPrice - commission;

  function copyNumber() {
    navigator.clipboard.writeText(WALLET_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!startDate) return alert("من فضلك اختر تاريخ الإيجار من التقويم أولاً.");
    if (!receiptFile) return alert("من فضلك ارفع صورة إيصال تحويل العربون.");
    setSubmitting(true);
    try {
      const ext = receiptFile.name.split(".").pop();
      const path = `receipts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(path, receiptFile);
      if (upErr) throw upErr;

      const receiptUrl = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
      const finalEnd = endDate || startDate;

      const { error } = await supabase.from("bookings").insert([{
        equipment_id: item.id,
        renter_name: renterName,
        renter_phone: renterPhone,
        days_count: days,
        start_date: startDate,
        end_date: finalEnd,
        total_price: totalPrice,
        commission_amount: commission,
        receipt_url: receiptUrl,
        status: "pending",
      }]);
      if (error) throw error;
      setBooked(true);
    } catch (err: unknown) {
      alert("حدث خطأ: " + (err instanceof Error ? err.message : "خطأ غير متوقع"));
    }
    setSubmitting(false);
  }

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-5">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">تم حجز الموعد بنجاح!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            تم حجز المعدة من <strong>{startDate}</strong> إلى <strong>{endDate || startDate}</strong> ({days} يوم). سنتواصل معك على واتساب فوراً لتأكيد الاستلام.
          </p>
          <Link href="/" className="block w-full bg-slate-900 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = new Date(year, month, 1).getDay();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-bold text-sm">
            <ArrowRight className="w-5 h-5" /> <span>العودة للمعدات</span>
          </Link>
          <span className="bg-emerald-600 text-white font-black text-lg px-3 py-1 rounded-xl">أجرني</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white rounded-3xl overflow-hidden border border-slate-200/70 shadow-sm">
          <div className="h-72 sm:h-80 bg-slate-100 relative">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">لا توجد صورة</div>
            )}
            <span className="absolute top-4 right-4 bg-white/95 text-slate-900 text-xs font-extrabold px-4 py-1.5 rounded-full shadow">{item.category}</span>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600"><MapPin className="w-4 h-4" /> شبين القناطر • {item.city}</span>
              <span className="bg-slate-900 text-white px-4 py-1.5 rounded-2xl text-sm font-black">{item.daily_price} ج / يوم</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{item.title}</h1>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.description || "معدة بحالة ممتازة وجاهزة للاستخدام."}</p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/60 p-4 rounded-2xl flex items-center gap-3">
              <BadgeCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-950">
                <p className="font-extrabold">مؤجر موثق: {item.owner_name}</p>
                <p className="text-emerald-800/80">تم توثيق الحساب بالبطاقة الشخصية لدى منصة أجرني.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleBooking} className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/70 shadow-lg p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-600" /> اختر أيام الحجز المتاحة</h2>
            <p className="text-xs text-slate-500 mt-1">اضغط على يوم البداية ثم يوم النهاية (الأيام الحمراء محجوزة)</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-1.5 bg-white rounded-lg border hover:bg-slate-100"><ChevronRight className="w-4 h-4" /></button>
              <span className="font-extrabold text-sm text-slate-800">{monthNames.at(month)} {year}</span>
              <button type="button" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-1.5 bg-white rounded-lg border hover:bg-slate-100"><ChevronLeft className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
              <span>أحد</span><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {Array.from({ length: firstDayWeekday }).map((_, idx) => <div key={`empty-${idx}`} />)}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const past = dateStr < todayStr;
                const busy = isDateBooked(dateStr);
                const isSelected = dateStr === startDate || dateStr === endDate || (startDate && endDate && dateStr > startDate && dateStr < endDate);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={past || busy}
                    onClick={() => handleDayClick(dateStr)}
                    className={`py-2 rounded-xl text-xs font-extrabold transition ${
                      busy
                        ? "bg-red-100 text-red-500 line-through cursor-not-allowed"
                        : past
                        ? "text-slate-300 cursor-not-allowed"
                        : isSelected
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200/70"
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-bold text-slate-600 border-t border-slate-200/60">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block" /> متاح</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> اختيارك</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> محجوز</span>
            </div>
          </div>

          {startDate && (
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-sm border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>الموعد: <strong>{startDate}</strong> {endDate && endDate !== startDate ? `إلى ${endDate}` : ""} ({days} يوم)</span>
                <strong className="text-slate-900">{totalPrice} ج</strong>
              </div>
              <div className="flex justify-between text-emerald-700 font-extrabold text-base pt-2 border-t border-slate-200/70">
                <span>عربون جدية الحجز (يدفع الآن):</span>
                <span>{commission} جنيه</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>المتبقي للمؤجر عند الاستلام:</span>
                <span className="font-bold">{ownerAmount} جنيه</span>
              </div>
            </div>
          )}

          <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs text-amber-950">
            <div className="font-extrabold flex items-center gap-1.5 text-sm"><CreditCard className="w-4 h-4 text-amber-700" /> الدفع (إنستاباي / فودافون كاش):</div>
            <p>حوّل <strong>{commission || "العربون"} جنيه</strong> على الرقم التالي وارفع الإيصال:</p>
            <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-amber-200">
              <span className="font-black text-base text-slate-900">{WALLET_NUMBER}</span>
              <button type="button" onClick={copyNumber} className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 px-3 py-1.5 rounded-lg">
                {copied ? <><Check className="w-3.5 h-3.5" /> تم النسخ</> : <><Copy className="w-3.5 h-3.5" /> نسخ الرقم</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required type="text" placeholder="اسمك بالكامل" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm" value={renterName} onChange={(e) => setRenterName(e.target.value)} />
            <input required type="tel" placeholder="رقم الواتساب (010xxxxxxxx)" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm" value={renterPhone} onChange={(e) => setRenterPhone(e.target.value)} />
          </div>

          <label className="block border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-2xl p-4 text-center cursor-pointer transition">
            <Upload className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
            <span className="block text-xs font-extrabold text-slate-800">{receiptFile ? `✅ ${receiptFile.name}` : "اضغط لإرفاق صورة إيصال التحويل *"}</span>
            <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.item(0) ?? null)} className="hidden" />
          </label>

          <button disabled={submitting} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl text-base shadow-lg transition disabled:opacity-50">
            {submitting ? "جاري تأكيد الموعد..." : "تأكيد الحجز وإرسال الإيصال"}
          </button>
        </form>
      </div>
    </div>
  );
}
