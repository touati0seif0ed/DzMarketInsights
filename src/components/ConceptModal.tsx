import React from 'react';
import { ShieldCheck, Truck, Video, RotateCcw, CheckCircle2, X, Star, MapPin } from 'lucide-react';
import { Language } from '../types/survey';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">
              {isAr ? 'الرؤية المقترحة للمشروع' : 'Proposed Platform Vision'}
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {isAr ? 'كيف ستعمل أول منصة جزائرية متخصصة ومحمية للأثاث والأجهزة؟' : 'How will the first verified Algerian used marketplace work?'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Mission Quote */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100/80 text-emerald-950">
            <p className="leading-relaxed font-medium">
              {isAr
                ? '«تخيل منصة جزائرية تجمع البائعين والمشترين للأثاث والأجهزة المنزلية المستعملة، تتيح لك تصفح المنتجات المفحوصة، مشاهدة مقاطع فيديو حقيقية أثناء التشغيل، معرفة الحالة التقنية بدقة، حجز الدفع بأمان، وتوصيل الأثاث الثقيل حتى باب بيتك مع ضمان حقيقي.»'
                : '“Imagine a specialized Algerian platform connecting sellers and buyers of used furniture and appliances, allowing you to browse verified items, inspect operational video recordings, pay safely with buyer escrow, and receive bulky items at your doorstep with real warranty.”'}
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {isAr ? '1. فحص تقني وتصوير حقيقي إلزامي' : '1. Mandatory Diagnostic & Video'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAr
                  ? 'لا مزيد من الصور المضللة على فيسبوك. كل إعلان يتضمن فيديو 360° واضح وتقرير فحص تقني للموتور وسلامة أجهزة التبريد والكهرباء.'
                  : 'No more misleading photos. Every listing includes verified 360° video and technical diagnostic reports for motor and refrigeration health.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {isAr ? '2. حساب الضمان وحماية المشتري' : '2. Secure Buyer Escrow'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAr
                  ? 'المبلغ يبقى محفوظاً ومجمداً لدى المنصة (عبر بريدي موب أو كاش) ولا يُسلَّم للبائع إلا بعد فحص المشتري للسلعة وتأكيد سلامتها.'
                  : 'Funds are held securely by the platform (BaridiMob or Cash on Delivery) and only released after the buyer inspects and approves the item.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {isAr ? '3. شبكة نقل متخصصة في الأثاث' : '3. Specialized Bulky Logistics'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAr
                  ? 'شاحنات وفورغونات مجهزة بأفرشة حماية وعمال تنزيل وصعود في العمارات، لنقل الصالونات والغسالات دون أي عناء أو خدوش.'
                  : 'Dedicated padded moving vans with trained handlers for lifting sofas and appliances into apartment floors without scratches.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-3">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {isAr ? '4. ضمان تجربة وإمكانية الإرجاع' : '4. Trial Warranty & Easy Return'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAr
                  ? 'فترة تجربة تشغيل لمدة 7 إلى 14 يوماً مع حق الإرجاع واسترداد كامل المبلغ في حال ثبوت وجود عيب تقني مخفي.'
                  : '7 to 14 days operational trial warranty with full refund policy if undisclosed hidden defects appear.'}
              </p>
            </div>
          </div>

          {/* Interactive Mock Item Card Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              {isAr ? 'نموذج محاكاة لإعلان سلعة مفحوصة داخل المنصة مستقبلاً:' : 'Interactive preview of an inspected listing on the future platform:'}
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-28 h-24 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400">
                <Video className="w-8 h-8 text-slate-400" />
              </div>
              <div className="flex-1 w-full text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">
                    {isAr ? 'ثلاجة سامسونغ No-Frost أصلية 420L' : 'Samsung No-Frost Refrigerator 420L'}
                  </span>
                  <span className="font-bold text-emerald-700 text-sm">42,000 دج</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isAr ? 'مفحوصة تقنياً (100% شغالة)' : 'Technically Inspected'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {isAr ? 'الجزائر (بئر مراد رايس)' : 'Algiers (BMR)'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                    <Star className="w-3 h-3 fill-amber-500" /> 4.9 (18 {isAr ? 'تقييم' : 'reviews'})
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-1">
                  {isAr ? 'استعمال عائلي خفيف، ضاغط أصلي لم يُفتح، فيديو الاختبار متاح، ضمان المنصة 14 يوماً.' : 'Light family use, original compressor, test video available, 14-day warranty.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isAr ? 'فهمت الفكرة، العودة للاستبيان' : 'Understood, Back to Survey'}
          </button>
        </div>
      </div>
    </div>
  );
};
