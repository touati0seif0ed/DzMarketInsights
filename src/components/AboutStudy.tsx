import React from 'react';
import { Target, Users2, ShieldCheck, BarChart, HeartHandshake, CheckCircle } from 'lucide-react';
import { Language } from '../types/survey';

interface AboutStudyProps {
  lang: Language;
  onStartSurvey: () => void;
}

export const AboutStudy: React.FC<AboutStudyProps> = ({ lang, onStartSurvey }) => {
  const isAr = lang === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
          {isAr ? 'منهجية وأهداف البحث' : 'Research Methodology & Objectives'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
          {isAr ? 'دراسة الجدوى وسلوك المستهلك الجزائري في سوق المستعمل' : 'Market Feasibility & Consumer Psychology Study in Algeria'}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'مبادرة بحثية تهدف إلى سد الفجوة المعرفية في قطاع التجارة الدائرية للأثاث والأجهزة الكهرومنزلية في الجزائر، وتحويل التحديات اليومية للمواطن إلى حلول تكنولوجية موثوقة.'
            : 'A comprehensive market research initiative to bridge knowledge gaps in Algeria\'s circular economy for furniture and home appliances, transforming consumer hurdles into trusted tech solutions.'}
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {isAr ? '1. فهم نقاط الألم (Pain Points)' : '1. Discovering Pain Points'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isAr
              ? 'تشخيص أسباب التردد الشائعة: العيوب المخفية في محركات الثلاجات والغسالات، النصب في فيسبوك، وغياب الضمان وحق التجربة.'
              : 'Uncovering root friction: concealed motor defects in refrigerators/washers, fraud on social media, and zero warranty.'}
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {isAr ? '2. علم نفس المستهلك الجزائري' : '2. Algerian Consumer Psychology'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isAr
              ? 'معرفة محفزات الثقة: أثر توثيق هوية البائعين، الفيديو التشغيلي الإلزامي، ومفهوم حجز الدفع (Escrow) عبر بريدي موب.'
              : 'Identifying trust triggers: verified seller IDs, mandatory video inspections, and escrow payment protection.'}
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
            <BarChart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {isAr ? '3. الجدوى اللوجستية والمالية' : '3. Logistics & Financial Viability'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isAr
              ? 'دراسة استعداد المستهلك لدفع تكاليف الشحن المخصص للأثاث الثقيل مع عمال تنزيل، وتحديد نسبة التخفيض المتوقعة.'
              : 'Assessing willingness to pay for specialized bulky item transport with offloading handlers and fair pricing models.'}
          </p>
        </div>
      </div>

      {/* Research Methodology Card */}
      <div className="p-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-800" />
          <span>{isAr ? 'معايير النزاهة وحماية الخصوصية' : 'Privacy & Research Integrity Standards'}</span>
        </h3>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'الاستبيان لا يجمع أي معلومات شخصية حساسة مثل الأسماء الكاملة أو العناوين الدقيقة أو أرقام الهوية.'
                : 'The survey never collects sensitive personal identifiers such as full names, exact addresses, or government IDs.'}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'يتم تخزين الإجابات محلياً بشكل فوري لحماية تقدم المشارك في حال انقطاع الاتصال بشبكة الإنترنت.'
                : 'Progress is saved client-side immediately in case of connection dropouts.'}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'البيانات التحليلية متاحة لصاحب المشروع لدراسة الجدوى وللمشاركين للاطلاع على النتائج التراكمية بكل شفافية.'
                : 'Analytics are openly visualized for transparency, helping validate genuine product-market fit.'}
            </span>
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isAr ? 'عينة الدراسة تستهدف 58 ولاية جزائرية' : 'Targeting 58 Algerian wilayas nationwide'}
          </div>
          <button
            onClick={onStartSurvey}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isAr ? 'المشاركة في الاستبيان الآن' : 'Participate in Survey'}
          </button>
        </div>
      </div>
    </div>
  );
};
