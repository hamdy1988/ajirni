"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, Lock, ExternalLink, Trash2, RefreshCw } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [equipments, setEquipments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"equipments" | "bookings">("equipments");

  useEffect(() => {
    if (authorized) fetchAll();
  }, [authorized]);

  async function fetchAll() {
    setLoading(true);
    const { data: eqData, error: eqErr } = await supabase
      .from("equipment")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: bkData } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (eqErr) alert("خطأ في جلب البيانات: " + eqErr.message);
    if (eqData) setEquipments(eqData);
    if (bkData) setBookings(bkData);
    setLoading(false);
  }

  async function updateEquipmentStatus(id: string, status: string) {
    const { error } = await supabase.from("equipment").update({ status }).eq("id", id);
    if (error) alert("خطأ: " + error.message);
    else fetchAll();
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
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900">لوحة تحكم منصة أجرني</h1>
            <button onClick={fetchAll} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" title="تحديث">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("equipments")}
              className={`px-4 py-2 rounded-xl font-bold ${tab === "equipments" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}
            >
              المعدات ({equipments.length})
            </button>
            <button
              onClick={() => setTab("bookings")}
              className={`px-4 py-2 rounded-xl font-bold ${tab === "bookings" ? "bg-emerald-600 text-white" : "bg-gray-100"}`}
            >
              الحجوزات ({bookings.length})
            </button>
          </div>
        </div>

        {tab === "equipments" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipments.length === 0 && (
              <div className="col-span-2 bg-white p-8 rounded-2xl text-center text-gray-500">
                لا توجد معدات مسجلة حالياً في قاعدة البيانات.
              </div>
            )}
            {equipments.map((eq) => (
              <div key={eq.id} className="bg-white p-5 rounded-2xl shadow-sm border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        eq.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {eq.status === "approved" ? "منشور" : "قيد المراجعة"}
                    </span>
                    <h3 className="text-lg font-bold mt-2">
                      {eq.title} ({eq.daily_price} ج/يوم)
                    </h3>
                    <p className="text-sm text-gray-500">
                      {eq.governorate} - {eq.city} | المالك: {eq.owner_name} ({eq.owner_phone})
                    </p>
                  </div>
                  {eq.image_url && <img src={eq.image_url} alt="" className="w-20 h-20 object-cover rounded-xl bg-gray-100" />}
                </div>

                {eq.id_card_url && (
                  <div className="flex items-center gap-4 text-sm pt-2 border-t">
                    <a href={eq.id_card_url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                      <ExternalLink className="w-4 h-4" /> عرض صورة البطاقة الشخصية
                    </a>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {eq.status !== "approved" && (
                    <button
                      onClick={() => updateEquipmentStatus(eq.id, "approved")}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> موافقة ونشر
                    </button>
                  )}
                  <button
                    onClick={() => deleteEquipment(eq.id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-1"
                  >
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
                  <h3 className="font-bold text-lg text-emerald-800">طلب حجز رقم: {bk.id.slice(0, 8)}</h3>
                  <p className="text-sm">
                    <strong>المستأجر:</strong> {bk.renter_name} ({bk.renter_phone}) — لمدة {bk.days_count} أيام
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    الإجمالي: {bk.total_price} ج | عمولتك المحولة: <span className="text-emerald-600">{bk.commission_amount} ج</span>
                  </p>
                </div>
                {bk.receipt_url && (
                  <div className="flex items-center gap-3">
                    <a href={bk.receipt_url} target="_blank" className="bg-amber-100 text-amber-900 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> مراجعة إيصال التحويل
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
