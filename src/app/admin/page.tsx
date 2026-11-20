"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, Lock, ExternalLink, Trash2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [equipments, setEquipments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState<"equipments" | "bookings">("equipments");

  useEffect(() => {
    if (authorized) fetchAll();
  }, [authorized]);

  async function fetchAll() {
    const { data: eqData } = await supabase.from("equipment").select("*").order("created_at", { ascending: false });
    const { data: bkData } = await supabase.from("bookings").select("*, equipment(title, owner_name, owner_phone)").order("created_at", { ascending: false });
    if (eqData) setEquipments(eqData);
    if (bkData) setBookings(bkData);
  }

  async function updateEquipmentStatus(id: string, status: string) {
    await supabase.from("equipment").update({ status }).eq("id", id);
    fetchAll();
  }

  async function deleteEquipment(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه المعدة نهائياً؟")) return;
    await supabase.from("equipment").delete().eq("id", id);
    fetchAll();
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === "ajirni2026") setAuthorized(true);
            else alert("كلمة المرور غير صحيحة!");
          }}
          className="bg-white p-8 rounded-2xl shadow-md max-w-sm w-full space-y-4 text-center"
        >
          <Lock className="w-12 h-12 text-emerald-600 mx-auto" />
          <h1 className="text-xl font-bold">لوحة تحكم إدارة أجرني</h1>
          <input
            type="password"
            placeholder="أدخل كلمة المرور السرية"
            className="w-full p-3 border rounded-xl text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900">لوحة تحكم منصة أجرني</h1>
          <div className="flex gap-2">
            <button onClick={() => setTab("equipments")} className={`px-4 py-2 rounded-xl font-bold ${tab === "equipments" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>
              المعدات ({equipments.length})
            </button>
            <button onClick={() => setTab("bookings")} className={`px-4 py-2 rounded-xl font-bold ${tab === "bookings" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>
              الحجوزات والعمولات ({bookings.length})
            </button>
          </div>
        </div>

        {tab === "equipments" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipments.map((eq) => (
              <div key={eq.id} className="bg-white p-5 rounded-2xl shadow-sm border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${eq.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {eq.status === "approved" ? "منشور" : "قيد المراجعة"}
                    </span>
                    <h3 className="text-lg font-bold mt-2">{eq.title} ({eq.daily_price} ج/يوم)</h3>
                    <p className="text-sm text-gray-500">{eq.governorate} - {eq.city} | المالك: {eq.owner_name} ({eq.owner_phone})</p>
                  </div>
                  <img src={eq.image_url} alt="" className="w-20 h-20 object-cover rounded-xl bg-gray-100" />
                </div>

                <div className="flex items-center gap-4 text-sm pt-2 border-t">
                  <a href={eq.id_card_url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                    <ExternalLink className="w-4 h-4" /> عرض صورة البطاقة الشخصية
                  </a>
                </div>

                <div className="flex gap-2 pt-2">
                  {eq.status !== "approved" && (
                    <button onClick={() => updateEquipmentStatus(eq.id, "approved")} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> موافقة ونشر
                    </button>
                  )}
                  <button onClick={() => deleteEquipment(eq.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((bk) => (
              <div key={bk.id} className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-emerald-800">طلب حجز: {bk.equipment?.title}</h3>
                  <p className="text-sm"><strong>المستأجر:</strong> {bk.renter_name} ({bk.renter_phone}) — لمدة {bk.days_count} أيام</p>
                  <p className="text-sm"><strong>المالك:</strong> {bk.equipment?.owner_name} ({bk.equipment?.owner_phone})</p>
                  <p className="text-sm font-bold text-gray-800">الإجمالي: {bk.total_price} ج | عمولتك المحولة: <span className="text-emerald-600">{bk.commission_amount} ج</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <a href={bk.receipt_url} target="_blank" className="bg-amber-100 text-amber-900 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" /> مراجعة إيصال التحويل
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
