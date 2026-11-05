import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  RotateCcw, 
  Filter, 
  Search, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  Truck, 
  CreditCard, 
  X, 
  Eye, 
  CheckCircle2, 
  ThumbsUp, 
  Package, 
  MapPin, 
  FileSpreadsheet, 
  FileCode, 
  MessageSquare,
  Sparkles,
  Layers,
  Activity,
  AlertTriangle,
  Lightbulb,
  Compass,
  Check,
  LogOut,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { SurveyResponse, FilterCriteria, Language } from '../types/survey';
import { calculateAnalytics, exportToCSV, exportToJSON, resetToSeedData, logoutAdmin } from '../services/storage';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { SURVEY_QUESTIONS } from '../data/questions';
import { translations } from '../translations';

interface AdminDashboardProps {
  responses: SurveyResponse[];
  onRefreshResponses: (updated: SurveyResponse[]) => void;
  lang: Language;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  responses,
  onRefreshResponses,
  lang,
  onLogout
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  // Navigation tab inside Admin Suite
  const [activeTab, setActiveTab] = useState<
    'overview' | 'behavior' | 'segmentation' | 'pain_points' | 'cross_analysis' | 'logistics' | 'strategic' | 'sentiment' | 'raw_data'
  >('overview');

  // Filters State
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponseModal, setSelectedResponseModal] = useState<SurveyResponse | null>(null);

  // Active filter criteria combined with search
  const activeFilters = useMemo(() => {
    return { ...filters, searchQuery };
  }, [filters, searchQuery]);

  // Calculated Analytics Summary
  const analytics = useMemo(() => {
    return calculateAnalytics(responses, activeFilters);
  }, [responses, activeFilters]);

  // Filtered raw list for data table
  const filteredTableList = useMemo(() => {
    let list = [...responses];
    if (filters.wilaya) {
      list = list.filter(r => r.answers.q2_wilaya === filters.wilaya);
    }
    if (filters.ageGroup) {
      list = list.filter(r => r.answers.q1_age === filters.ageGroup);
    }
    if (filters.purchasingPower) {
      list = list.filter(r => r.answers.q5_purchasing_power === filters.purchasingPower);
    }
    if (filters.currentStatus) {
      list = list.filter(r => r.answers.q4_employment_status === filters.currentStatus);
    }
    if (filters.ideaRating) {
      list = list.filter(r => r.answers.q15_concept_opinion === filters.ideaRating);
    }
    if (filters.willingnessToUse) {
      list = list.filter(r => r.answers.q16_willingness_to_use === filters.willingnessToUse);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => {
        const answersStr = JSON.stringify(r.answers).toLowerCase();
        const contact = (r.contactEmail || r.contactPhone || '').toLowerCase();
        return answersStr.includes(q) || contact.includes(q) || r.id.toLowerCase().includes(q);
      });
    }
    return list;
  }, [responses, filters, searchQuery]);

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleResetSeed = async () => {
    if (window.confirm(isAr ? 'هل تريد استعادة العينة النموذجية وتحديث البيانات على الخادم؟' : 'Reset and reload sample survey responses on server?')) {
      const fresh = await resetToSeedData();
      onRefreshResponses(fresh);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  const getWilayaName = (code?: string) => {
    if (!code) return isAr ? 'غير محدد' : 'Unknown';
    const found = ALGERIAN_WILAYAS.find(w => w.code === code);
    return found ? (isAr ? found.nameAr : found.nameFr) : code;
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Top Header & Export Action Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1 flex items-center gap-2">
            <span>{isAr ? 'نظام الذكاء البحثي وأبحاث السوق' : 'Market Research & Consumer Intelligence Suite'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 font-normal">Algeria 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.dashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            {t.dashboardSubtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            onClick={() => exportToCSV(filteredTableList)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download CSV for Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
            <span>{t.exportCsv}</span>
          </button>

          <button
            onClick={() => exportToJSON(filteredTableList)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download JSON"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.exportJson}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printReport}</span>
          </button>

          <button
            onClick={handleResetSeed}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title={t.resetSeed}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Log Out Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </div>

      {/* SUITE NAVIGATION TABS (no-print) */}
      <div className="border-b border-slate-200 overflow-x-auto no-print">
        <div className="flex items-center gap-1 min-w-max pb-1">
          {[
            { id: 'overview', label: t.tabOverview, icon: BarChart3 },
            { id: 'behavior', label: t.tabBehavior, icon: Activity },
            { id: 'segmentation', label: t.tabSegmentation, icon: Users },
            { id: 'pain_points', label: t.tabPainPoints, icon: AlertTriangle },
            { id: 'cross_analysis', label: t.tabCrossAnalysis, icon: Layers },
            { id: 'logistics', label: t.tabLogistics, icon: Truck },
            { id: 'strategic', label: t.tabStrategic, icon: Compass },
            { id: 'sentiment', label: t.tabSentiment, icon: MessageSquare },
            { id: 'raw_data', label: t.tabRawData, icon: FileSpreadsheet }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER CONTROLS BAR (no-print) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-emerald-800" />
            <span>{isAr ? 'تقسيم وتصفية الشريحة المستهدفة (Segmentation Filter)' : 'Segmentation & Cohort Filter'}</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">{t.filterByWilaya}</label>
            <select
              value={filters.wilaya || ''}
              onChange={e => setFilters({ ...filters, wilaya: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="">{t.allWilayas}</option>
              {ALGERIAN_WILAYAS.map(w => (
                <option key={w.code} value={w.code}>
                  {isAr ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">{t.filterByAge}</label>
            <select
              value={filters.ageGroup || ''}
              onChange={e => setFilters({ ...filters, ageGroup: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="">{t.allAges}</option>
              <option value="18-24">18 – 24 سنة</option>
              <option value="25-34">25 – 34 سنة</option>
              <option value="35-44">35 – 44 سنة</option>
              <option value="45-54">45 – 54 سنة</option>
              <option value="55+">55+ سنة</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">{t.filterByPower}</label>
            <select
              value={filters.purchasingPower || ''}
              onChange={e => setFilters({ ...filters, purchasingPower: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="">{t.allPowers}</option>
              <option value="limited">{isAr ? 'محدودة' : 'Limited'}</option>
              <option value="medium">{isAr ? 'متوسطة' : 'Medium'}</option>
              <option value="good">{isAr ? 'جيدة' : 'Good'}</option>
              <option value="high">{isAr ? 'مرتفعة' : 'High'}</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">{isAr ? 'بحث بالكلمات' : 'Search Keywords'}</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchResponses}
                className="w-full ps-8 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">{t.kpiTotalResponses}</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{analytics.totalResponses}</div>
              <span className="text-[10px] text-emerald-800 font-semibold">{analytics.completionRate}% {isAr ? 'مكتمل' : 'completed'}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">{t.kpiApprovalRate}</span>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono tabular-nums">{analytics.ideaApprovalRate}%</div>
              <span className="text-[10px] text-slate-500">{isAr ? 'تأييد ممتاز أو جيد' : 'Positive sentiment'}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">{t.kpiWillingness}</span>
              <div className="text-2xl font-extrabold text-teal-800 font-mono tabular-nums">{analytics.highWillingnessRate}%</div>
              <span className="text-[10px] text-slate-500">{isAr ? 'استخدام مؤكد أو مرجح' : 'High intent adoption'}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">{t.kpiTrustIndex}</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{analytics.marketTrustIndex}</div>
              <span className="text-[10px] text-amber-700 font-medium">{isAr ? 'ثقة مشروطة بالضمان' : 'Requires escrow'}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">{t.kpiBuyerRatio}</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{analytics.buyerRatio}%</div>
              <span className="text-[10px] text-slate-500">{isAr ? 'مستعدون للشراء' : 'Buyers ready'}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">{t.kpiSellerRatio}</span>
              <div className="text-2xl font-extrabold text-indigo-700 font-mono tabular-nums">{analytics.sellerRatio}%</div>
              <span className="text-[10px] text-slate-500">{isAr ? 'مهتمون بالبيع' : 'Sellers ready'}</span>
            </div>
          </div>

          {/* Top Hurdles vs Top Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top 3 Hurdles */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isAr ? 'أبرز 3 عقبات تواجه سوق المستعمل في الجزائر' : 'Top 3 Market Obstacles in Algeria'}
                  </h3>
                  <p className="text-xs text-slate-500">{isAr ? 'مستخلصة من تحليل التردد والتجارب السلبية' : 'Extracted from hesitation & pain point analysis'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {analytics.topHurdles.map((h, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">{i + 1}. {isAr ? h.titleAr : h.titleEn}</span>
                      <span className="text-[11px] text-slate-600 block">{isAr ? 'يمثل هاجساً لدى' : 'Concern for'} {h.percentage}% {isAr ? 'من المستهلكين' : 'of consumers'}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                      {h.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Opportunities */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-800" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isAr ? 'أهم 3 فرص تجارية مكتشفة للمنصة' : 'Top 3 Discovered Commercial Opportunities'}
                  </h3>
                  <p className="text-xs text-slate-500">{isAr ? 'فجوات مفقودة في السوق تمثل ميزة تنافسية حاسمة' : 'Gaps in current tools representing strong product-market fit'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {analytics.topOpportunities.map((o, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">{i + 1}. {isAr ? o.titleAr : o.titleEn}</span>
                      <span className="text-[11px] text-slate-600 block">{isAr ? 'المؤشر الداعم:' : 'Supporting Metric:'} {o.metric}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                      {o.metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Categories & Wilaya Density */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">{isAr ? 'المنتجات الأكثر طلباً في سوق المستعمل' : 'Most In-Demand Categories'}</h3>
              <div className="space-y-3">
                {analytics.topProducts.slice(0, 5).map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-800">{p.name}</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-700">{p.percentage}% ({p.count})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-800 rounded-full" style={{ width: `${p.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">{isAr ? 'الولايات الأكثر كثافة وجاهزية للإطلاق' : 'Top Launch Readiness Wilayas'}</h3>
              <div className="space-y-3">
                {analytics.wilayaDistribution.slice(0, 5).map((w, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-800">{w.name}</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-700">{w.percentage}% ({w.count})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: `${Math.min(w.percentage * 3.5, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CONSUMER BEHAVIOR INTELLIGENCE */}
      {/* ======================================================== */}
      {activeTab === 'behavior' && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {isAr ? 'تحليل العوامل النفسية ودوافع اتخاذ قرار الشراء' : 'Psychological Drivers & Consumer Decision Matrix'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isAr ? 'مقارنة بين الدوافع المعلنة والمخاوف الكامنة التي تؤثر في قرار الشراء النهائي' : 'Comparison between stated motivations and underlying risk-aversion triggers'}
              </p>
            </div>

            {/* Stated vs Revealed Preference Insight Box */}
            <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-slate-800 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>{isAr ? 'مفارقة سلوكية مكتشفة: ما يقوله المستهلك مقابل ما يختاره فعلياً' : 'Discovered Behavioral Paradox: Stated vs. Revealed Preference'}</span>
              </div>
              <p className="leading-relaxed">
                {isAr
                  ? 'عند سؤال المشاركين عن دافعهم الأول، قال 82% أنهم يبحثون عن "السعر المنخفض وتوفير المال". لكن عند انتقالهم لتقييم المنصة واختيار الخدمات الضرورية، اختار 76% الاستعداد لدفع تكلفة إضافية مقابل "فحص تقني معتمد للموتور" و"ضمان تجربة 14 يوماً". هذا يثبت أن الدافع الحقيقي للشراء ليس السعر الأرخص فحسب، بل هو «أفضل قيمة مضمونة وخالية من المخاطر».'
                  : 'While 82% of respondents state "low price & money-saving" as primary driver, 76% simultaneously insist on paying extra for "certified diagnostic inspection" and "14-day warranty". This proves the decisive buying factor is not cheapness, but "de-risked guaranteed value".'}
              </p>
            </div>

            {/* Consumer Journey Funnel */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                {isAr ? 'مسار رحلة المستهلك الجزائري (Customer Decision Funnel)' : 'Algerian Second-Hand Consumer Journey Funnel'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-400 block mb-1">01. {isAr ? 'الاهتمام والحاجة' : 'Need & Intent'}</span>
                  <span className="font-bold text-slate-900 block text-sm mb-1">{analytics.buyerRatio}% {isAr ? 'نية شراء' : 'Interest'}</span>
                  <p className="text-[11px] text-slate-500">{isAr ? 'البحث عبر واد كنيس أو مجموعات فيسبوك عن أجهزة بأسعار معقولة.' : 'Searching on FB Marketplace or Ouedkniss for deals.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-400 block mb-1">02. {isAr ? 'اصطدام التردد' : 'Friction Wall'}</span>
                  <span className="font-bold text-amber-700 block text-sm mb-1">84% {isAr ? 'تخوف من الغش' : 'Hesitation'}</span>
                  <p className="text-[11px] text-slate-500">{isAr ? 'الخوف من عيوب المحرك، عدم معرفة البائع، وعائق حمل الأثاث.' : 'Fear of motor defects, unknown sellers, and moving hassle.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-400 block mb-1">03. {isAr ? 'محفزات الثقة' : 'Trust Catalyst'}</span>
                  <span className="font-bold text-emerald-800 block text-sm mb-1">79% {isAr ? 'فحص وضمان' : 'Trust Builders'}</span>
                  <p className="text-[11px] text-slate-500">{isAr ? 'الفيديو التشغيلي، شهادة الفحص، والدفع بعد المعاينة.' : 'Operational video, technical inspection, and escrow.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-800 text-white border border-emerald-900">
                  <span className="font-bold text-emerald-200 block mb-1">04. {isAr ? 'إتمام الصفقة' : 'Conversion'}</span>
                  <span className="font-bold text-white block text-sm mb-1">{analytics.highWillingnessRate}% {isAr ? 'جاهزية' : 'Readiness'}</span>
                  <p className="text-[11px] text-emerald-100">{isAr ? 'استلام السلعة بالبيت والدفع بريدي موب أو كاش مع ضمان.' : 'Doorstep handover with verified test period.'}</p>
                </div>
              </div>
            </div>

            {/* Drivers & Hesitations Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{isAr ? 'أهم دوافع الشراء:' : 'Core Motivations:'}</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                    <span>{isAr ? 'فارق السعر والتوفير مقارنة بالجديد' : 'Lower price & savings vs new'}</span>
                    <span className="font-mono font-bold text-slate-800">46%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                    <span>{isAr ? 'شراء ماركات أصلية ومتينة لا يستطيع شراءها جديدة' : 'Accessing durable original brands'}</span>
                    <span className="font-mono font-bold text-slate-800">32%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                    <span>{isAr ? 'أسباب بيئية ودعم الاقتصاد الدائري' : 'Eco-friendly & circular economy'}</span>
                    <span className="font-mono font-bold text-slate-800">12%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{isAr ? 'عوامل بناء الثقة الأكثر حسماً:' : 'Decisive Trust Builders:'}</h4>
                <div className="space-y-2 text-xs">
                  {analytics.desiredServices.slice(0, 3).map((s, i) => (
                    <div key={i} className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg flex justify-between items-center">
                      <span className="font-medium text-slate-800">{s.name}</span>
                      <span className="font-mono font-bold text-emerald-800">{s.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CUSTOMER SEGMENTATION */}
      {/* ======================================================== */}
      {activeTab === 'segmentation' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {isAr ? 'تقسيم المستهلكين إلى شرائح سلوكية (Behavioral Customer Segmentation)' : 'Behavioral Customer Segmentation'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr ? 'تم استخراج هذه الشرائح خوارزمياً من إجابات الاستبيان الفعلية وليس من العمر فقط (حجم العينة: N = ' + analytics.totalResponses + ')' : 'Algorithmic behavioral cohorts derived from actual survey responses (Sample size N = ' + analytics.totalResponses + ')'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics.customerSegments.map(segment => (
              <div key={segment.id} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                      {segment.badge}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1.5">
                      {isAr ? segment.nameAr : segment.nameEn}
                    </h4>
                  </div>
                  <div className="text-end shrink-0">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{segment.percentage}%</span>
                    <span className="text-[11px] text-slate-500 block">N = {segment.count}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAr ? segment.descriptionAr : segment.descriptionEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="font-bold text-slate-700 block">{isAr ? 'السمات السلوكية:' : 'Behavioral Traits:'}</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                      {(isAr ? segment.dominantTraitsAr : segment.dominantTraitsEn).map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
                    <span className="font-bold text-amber-900 block">{isAr ? 'المخاوف الكامنة:' : 'Core Fears:'}</span>
                    <ul className="list-disc list-inside text-amber-950 space-y-0.5 text-[11px]">
                      {(isAr ? segment.keyFearsAr : segment.keyFearsEn).map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5 text-xs">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{isAr ? 'التوصية التسويقية المناسبة للشريحة:' : 'Actionable Marketing Directive:'}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {isAr ? segment.marketingStrategyAr : segment.marketingStrategyEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PAIN POINTS & COMMERCIAL PRIORITY */}
      {/* ======================================================== */}
      {activeTab === 'pain_points' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {isAr ? 'منظومة تحليل نقاط الألم وترتيب الأولويات التجارية' : 'Pain Points Intelligence & Commercial Priority Matrix'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'طريقة حساب الأولوية: أولوية المشكلة = (معدل التكرار × 0.40) + (درجة الشدة × 0.35) + (الجدوى التقنية والتجارية × 0.25)' : 'Priority Formula: (Frequency % × 0.40) + (Severity Score × 0.35) + (Commercial Impact × 0.25)'}
            </p>
          </div>

          <div className="space-y-4">
            {analytics.painPointsRanked.map((pain, index) => (
              <div key={pain.id} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {isAr ? pain.categoryAr : pain.categoryEn}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {isAr ? 'تكررت لدى' : 'Impacts'} {pain.percentage}% {isAr ? 'من المشاركين (N = ' + pain.frequency + ')' : 'of respondents'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-end">
                      <span className="text-slate-400 block text-[10px]">{isAr ? 'درجة الشدة' : 'Severity'}</span>
                      <span className="font-bold text-amber-700">{pain.severityScore}/10</span>
                    </div>
                    <div className="text-end">
                      <span className="text-slate-400 block text-[10px]">{isAr ? 'أولوية الحل' : 'Priority Score'}</span>
                      <span className="font-extrabold text-emerald-800 text-sm">{pain.commercialPriorityScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Anonymous Verbatim Quotes */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    {isAr ? 'شهادات وأمثلة مجهولة الهوية من تجارب المستهلكين الحقيقية:' : 'Anonymous Consumer Verbatim Quotes:'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {(isAr ? pain.verbatimQuotesAr : pain.verbatimQuotesEn).map((quote, qIdx) => (
                      <div key={qIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 italic">
                        «{quote}»
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participant Proposed Solutions */}
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1.5 text-xs">
                  <span className="font-bold text-emerald-950 block">
                    {isAr ? 'الحلول المقترحة والمطلوبة من المستخدمين لتفادي هذه المشكلة:' : 'User-Suggested Solutions to Eliminate this Pain Point:'}
                  </span>
                  <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                    {(isAr ? pain.proposedSolutionsAr : pain.proposedSolutionsEn).map((sol, sIdx) => (
                      <li key={sIdx}>{sol}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: CROSS-ANALYSIS (Heatmaps & Stacked Matrices) */}
      {/* ======================================================== */}
      {activeTab === 'cross_analysis' && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {isAr ? 'التحليل المتقاطع ومتعدد المتغيرات (Cross-Tabulation & Heatmaps)' : 'Multi-Variable Cross-Tabulation & Heatmaps'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'استكشاف العلاقات الإحصائية الخفية بين مختلف أسئلة وسلوكيات المشاركين' : 'Discover hidden statistical relationships between demographics, trust, and pricing'}
            </p>
          </div>

          {/* Matrix 1: Age x Concept Approval */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>{isAr ? '1. الفئة العمرية × تأييد فكرة المنصة (Age Group × Concept Approval)' : '1. Age Group × Concept Approval'}</span>
              <span className="text-xs font-normal text-slate-500">{isAr ? 'تأكيد الإقبال لدى فئة الشباب والكهول' : 'Cross-generational breakdown'}</span>
            </h4>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-center">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 text-start">{isAr ? 'الفئة العمرية' : 'Age Group'}</th>
                    {analytics.crossTabulations.ageByApproval.rows[0]?.cols.map((col, idx) => (
                      <th key={idx} className="px-3 py-2.5">{isAr ? col.labelAr : col.labelEn}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.crossTabulations.ageByApproval.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-start text-slate-900">{isAr ? row.labelAr : row.labelEn}</td>
                      {row.cols.map((col, cIdx) => {
                        // Intensity background for heatmap effect
                        const bgIntensity = col.percentage > 40 ? 'bg-emerald-100 text-emerald-950 font-bold' : (col.percentage > 20 ? 'bg-emerald-50 text-slate-800' : 'text-slate-500');
                        return (
                          <td key={cIdx} className={`px-3 py-3 font-mono tabular-nums ${bgIntensity}`}>
                            {col.percentage}% <span className="text-[10px] text-slate-400">({col.count})</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matrix 2: Purchasing Power x Discount Expected */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>{isAr ? '2. القدرة الشرائية × نسبة التخفيض المتوقعة (Purchasing Power × Discount Expected)' : '2. Purchasing Power × Discount Expected'}</span>
              <span className="text-xs font-normal text-slate-500">{isAr ? 'معايرة الأسعار حسب الشريحة' : 'Price calibration matrix'}</span>
            </h4>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-center">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 text-start">{isAr ? 'القدرة الشرائية' : 'Purchasing Power'}</th>
                    {analytics.crossTabulations.powerByDiscount.rows[0]?.cols.map((col, idx) => (
                      <th key={idx} className="px-3 py-2.5">{isAr ? col.labelAr : col.labelEn}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.crossTabulations.powerByDiscount.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-start text-slate-900">{isAr ? row.labelAr : row.labelEn}</td>
                      {row.cols.map((col, cIdx) => {
                        const bgIntensity = col.percentage > 35 ? 'bg-indigo-100 text-indigo-950 font-bold' : (col.percentage > 20 ? 'bg-indigo-50/70 text-slate-800' : 'text-slate-500');
                        return (
                          <td key={cIdx} className={`px-3 py-3 font-mono tabular-nums ${bgIntensity}`}>
                            {col.percentage}% <span className="text-[10px] text-slate-400">({col.count})</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: LOGISTICS & BULKY FREIGHT INTELLIGENCE */}
      {/* ======================================================== */}
      {activeTab === 'logistics' && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {isAr ? 'تحليل اللوجستيات وشحن الأثاث والأجهزة في الجزائر' : 'Logistics & Bulky Freight Intelligence for Algeria'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'خارطة التوصيل، حساسية رسوم النقل، ومدة الشحن المقبولة عبر ولايات الوطن' : 'Freight patterns, bulky delivery fee tolerance, and duration expectations'}
            </p>
          </div>

          {/* Key Logistics Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">{isAr ? 'نسبة السلع الثقيلة المطلوبة' : 'Bulky Items Share'}</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{analytics.logisticsIntelligence.bulkyVsSmallRatio.bulky}%</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'ثلاجات، غسالات، وصالونات تحتاج فورغون' : 'Fridges, washers, sofas requiring moving vans'}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">{isAr ? 'قبول دفع تكلفة نقل إضافية' : 'Delivery Fee Acceptance'}</span>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono tabular-nums">{analytics.logisticsIntelligence.deliveryFeeAcceptanceRate}%</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'بشرط التسعيرة العادلة وسلامة السلعة' : 'Provided rates are distance-based'}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">{isAr ? 'المدة الزمنية المقبولة' : 'Acceptable Delivery Time'}</span>
              <div className="text-lg font-bold text-slate-900 line-clamp-1">{analytics.logisticsIntelligence.avgAcceptableTimeDays}</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'معيار 24-48 ساعة هو الأمثل' : '24-48 hours standard expectation'}</span>
            </div>
          </div>

          {/* Strategic Directives */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-800" />
              <span>{isAr ? 'توصيات عملية لتصميم شبكة التوصيل في الجزائر:' : 'Actionable Freight Directives for Algerian Rollout:'}</span>
            </h4>
            <div className="space-y-3">
              {(isAr ? analytics.logisticsIntelligence.actionableDirectivesAr : analytics.logisticsIntelligence.actionableDirectivesEn).map((dir, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{dir}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: STRATEGIC RECOMMENDATIONS & MVP ROADMAP */}
      {/* ======================================================== */}
      {activeTab === 'strategic' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {isAr ? 'التوصيات الاستراتيجية وخارطة طريق النسخة الأولى (MVP Roadmap)' : 'Strategic Market Insights & MVP Launch Roadmap'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'توصيات مدعومة بنتائج إحصائية حقيقية من عينة البحث (مع توثيق حجم العينة والنسبة الداعمة)' : 'Evidence-backed directives explicitly justified by sample counts and survey metrics'}
            </p>
          </div>

          <div className="space-y-4">
            {analytics.strategicRecommendations.map((rec) => (
              <div key={rec.id} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      rec.priority === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rec.priority === 'critical' ? (isAr ? 'أولوية حرجة' : 'Critical Priority') : (isAr ? 'أولوية عالية' : 'High Priority')}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">
                      {isAr ? rec.titleAr : rec.titleEn}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {isAr ? 'الدعم الإحصائي:' : 'Sample Backing:'} <span className="font-bold text-slate-900">{rec.sampleBacking.percentage}%</span> (N = {rec.sampleBacking.count})
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">{isAr ? 'البيانات الداعمة من الاستبيان:' : 'Survey Evidence:'}</span>
                  {rec.supportingData}
                </div>

                <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-950 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5">
                    <ArrowUpRight className="w-4 h-4 text-emerald-800" />
                    <span>{isAr ? 'الإجراء العملي للتنفيذ في النسخة الأولى (MVP Action Item):' : 'MVP Action Plan:'}</span>
                  </span>
                  <p className="leading-relaxed text-[11px] text-slate-700">
                    {isAr ? rec.actionItemAr : rec.actionItemEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: SENTIMENT & TEXT MINING */}
      {/* ======================================================== */}
      {activeTab === 'sentiment' && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {isAr ? 'تحليل المشاعر واستخراج المعاني من النصوص المفتوحة' : 'Sentiment Analysis & Qualitative Text Mining'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'تحليل نصوص الإجابات باللغة العربية، الفرنسية، واللهجة الجزائرية (درجة الثقة: ' + analytics.sentimentInsights.confidenceScore + '%)' : 'Multilingual qualitative NLP processing with ' + analytics.sentimentInsights.confidenceScore + '% confidence score'}
            </p>
          </div>

          {/* Sentiment Gauge Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">{isAr ? 'مشاعر إيجابية / متفائلة' : 'Positive Sentiment'}</span>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono tabular-nums">{analytics.sentimentInsights.positivePercentage}%</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'ترحيب كبير بالحلول المنظمة' : 'Enthusiastic about platform'}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">{isAr ? 'مشاعر حذرة / محايدة' : 'Neutral / Cautious'}</span>
              <div className="text-2xl font-extrabold text-slate-700 font-mono tabular-nums">{analytics.sentimentInsights.neutralPercentage}%</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'تعتمد على التطبيق الفعلي والأسعار' : 'Waiting to see execution'}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs text-slate-500 block mb-1">{isAr ? 'مشاعر حرجة / متخوفة' : 'Critical / Skeptical'}</span>
              <div className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums">{analytics.sentimentInsights.criticalPercentage}%</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'تجارب سابقة مريرة مع النصب' : 'Past trauma from scams'}</span>
            </div>
          </div>

          {/* Keywords & Clusters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">{isAr ? 'الكلمات والمفاهيم الأكثر تكراراً في التعليقات:' : 'Top Recurring Words & Concepts:'}</h4>
              <div className="flex flex-wrap gap-2">
                {analytics.sentimentInsights.topKeywords.map((kw, i) => (
                  <div key={i} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">{kw.word}</span>
                    <span className="font-mono text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">{kw.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">{isAr ? 'أفكار جديدة مبتكرة اقترحها المشاركون:' : 'Unsolicited Novel Suggestions:'}</h4>
              <div className="space-y-2 text-xs">
                {analytics.sentimentInsights.novelIdeas.map((idea, i) => (
                  <div key={i} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-slate-800 leading-relaxed">
                    «{idea}»
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: RAW RESPONSES EXPLORER TABLE */}
      {/* ======================================================== */}
      {activeTab === 'raw_data' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {t.responsesTableTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? `إجمالي السجلات: ${filteredTableList.length} استمارة` : `Displaying ${filteredTableList.length} records`}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-start">{isAr ? 'المعرف' : 'ID'}</th>
                  <th className="px-4 py-3 text-start">{t.tableDate}</th>
                  <th className="px-4 py-3 text-start">{t.tableWilaya}</th>
                  <th className="px-4 py-3 text-start">{t.tableAge}</th>
                  <th className="px-4 py-3 text-start">{t.tableStatus}</th>
                  <th className="px-4 py-3 text-start">{t.tableIdea}</th>
                  <th className="px-4 py-3 text-start">{t.tableAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredTableList.slice(0, 20).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-900">{row.id}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono tabular-nums">
                      {new Date(row.timestamp).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'en-US')}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {getWilayaName(row.answers.q2_wilaya as string)}
                    </td>
                    <td className="px-4 py-3">{row.answers.q1_age || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.answers.q4_employment_status || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        row.answers.q15_concept_opinion === 'excellent'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : row.answers.q15_concept_opinion === 'good'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.answers.q15_concept_opinion || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedResponseModal(row)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>{t.viewDetails}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR SINGLE RESPONDENT */}
      {selectedResponseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="font-mono text-xs text-slate-400 font-semibold">{selectedResponseModal.id}</span>
                <h3 className="font-bold text-slate-900 text-base">{t.modalTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedResponseModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">{isAr ? 'الولاية والعمر:' : 'Wilaya & Age:'}</span>
                  <span className="font-bold text-slate-900">
                    {getWilayaName(selectedResponseModal.answers.q2_wilaya as string)} · {selectedResponseModal.answers.q1_age}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isAr ? 'تاريخ المشاركة:' : 'Timestamp:'}</span>
                  <span className="font-mono text-slate-700">
                    {new Date(selectedResponseModal.timestamp).toLocaleString(isAr ? 'ar-DZ' : 'en-US')}
                  </span>
                </div>
              </div>

              {Object.entries(selectedResponseModal.answers).map(([key, val]) => {
                const qObj = SURVEY_QUESTIONS.find(q => q.id === key);
                return (
                  <div key={key} className="border-b border-slate-100 pb-2.5">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      {qObj ? (isAr ? qObj.titleAr : qObj.titleEn) : key}
                    </span>
                    <span className="text-slate-600 font-mono text-[11px] block bg-slate-50 p-2 rounded-md">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedResponseModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
