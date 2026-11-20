import Link from "next/link";
import { ArrowRight, ShieldCheck, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
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

      <div className="max-w-3xl mx-auto px-4 pt-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold">
            <Scale className="w-4 h-4" /> <span>السياسة القانونية وضمان الحقوق</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">الشروط والأحكام وإخلاء المسؤولية</h1>
          <p className="text-slate-500 text-sm">باستخدامك لمنصة أجرني، فإنك توافق على القواعد المنظمة التالية:</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/70 space-y-6 text-sm sm:text-base leading-relaxed text-slate-700">
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. طبيعة عمل المنصة (دور الوسيط)
            </h2>
            <p>
              منصة <strong>أجرني</strong> هي منصة إلكترونية وسيطة للربط بين أصحاب المعدات والأدوات (المؤجرين) وبين الراغبين في استئجارها (المستأجرين). المنصة لا تمتلك المعدات المعروضة ولا تتدخل في فحصها الفني المباشر.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 2. التزامات المؤجر والمستأجر عند التسليم
            </h2>
            <ul className="list-disc pr-5 space-y-1.5">
              <li>يلتزم الطرفان بمعاينة المعدة وتشغيلها وتجربتها جيداً قبل الاستلام والتسليم.</li>
              <li>يحق للمؤجر طلب الاطلاع على أصل بطاقة الرقم القومي للمستأجر أو أخذ ضمان مالي مناسب لقيمة المعدة وقت الاستلام.</li>
              <li>يلتزم المستأجر بإعادة المعدة في الموعد المحدد وبنفس الحالة التي استلمها عليها، ويتحمل تكلفة أي تلف ناتج عن سوء الاستخدام.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> 3. سياسة العربون وإخلاء المسؤولية
            </h2>
            <p>
              عربون جدية الحجز المدفوع للمنصة (20%) هو مقابل خدمة الربط والتوثيق وتأكيد الحجز، ويُسترد بالكامل فقط في حال إلغاء المؤجر للطلب أو عدم مطابقة المعدة للوصف المعلن. تخلي المنصة مسؤوليتها القانونية عن أي نزاع ينشأ بعد إتمام التسليم يداً بيد بين الطرفين.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
