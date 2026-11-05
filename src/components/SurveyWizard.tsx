import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Send, 
  Search, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookmarkCheck,
  UserCheck,
  ShoppingBag,
  ShieldAlert,
  Truck,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Quote
} from 'lucide-react';
import { SURVEY_QUESTIONS, SURVEY_SECTIONS } from '../data/questions';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { Question, SurveyAnswers, Language, SurveyResponse } from '../types/survey';
import { translations } from '../translations';
import { saveSurveyResponse, saveSurveyDraft, loadSurveyDraft, clearSurveyDraft } from '../services/storage';

interface SurveyWizardProps {
  lang: Language;
  onOpenConcept: () => void;
  onOpenDashboard: () => void;
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({
  lang,
  onOpenConcept,
  onOpenDashboard
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Validation error state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Beta waitlist state
  const [contactInfo, setContactInfo] = useState('');
  const [isContactSaved, setIsContactSaved] = useState(false);
  const [showAnswerReview, setShowAnswerReview] = useState(false);

  // Search filter for Wilaya dropdown
  const [wilayaSearch, setWilayaSearch] = useState('');

  // Start timer to measure completion time
  const startTimeRef = useRef<number>(Date.now());

  // Check for saved draft on mount
  useEffect(() => {
    const draft = loadSurveyDraft();
    if (draft && draft.answers && Object.keys(draft.answers).length > 0) {
      setHasSavedDraft(true);
    }
  }, []);

  // Compute active visible questions based on conditional logic
  const visibleQuestions = useMemo(() => {
    return SURVEY_QUESTIONS.filter(q => {
      if (!q.condition) return true;
      const parentVal = answers[q.condition.dependsOnQuestionId];
      if (parentVal === undefined) return false;

      const { operator, value } = q.condition;
      if (operator === 'equals') {
        return parentVal === value;
      }
      if (operator === 'not_equals') {
        return parentVal !== value;
      }
      if (operator === 'includes') {
        if (Array.isArray(value)) {
          return value.includes(parentVal as string);
        }
        return parentVal === value;
      }
      return true;
    });
  }, [answers]);

  const currentQuestion: Question | undefined = visibleQuestions[currentQuestionIndex];
  const currentSection = SURVEY_SECTIONS.find(s => s.id === currentQuestion?.sectionId);

  // Check if current question is the first in its section (to show interstitial quote)
  const isFirstQuestionOfSection = useMemo(() => {
    if (!currentQuestion) return false;
    const firstIndex = visibleQuestions.findIndex(q => q.sectionId === currentQuestion.sectionId);
    return firstIndex === currentQuestionIndex;
  }, [currentQuestion, currentQuestionIndex, visibleQuestions]);

  // Section icons mapping
  const renderSectionIcon = (name?: string) => {
    switch (name) {
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-emerald-800" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-emerald-800" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-emerald-800" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-800" />;
      case 'Truck': return <Truck className="w-5 h-5 text-emerald-800" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-emerald-800" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5 text-emerald-800" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-800" />;
    }
  };

  // Resume draft
  const handleResumeDraft = () => {
    const draft = loadSurveyDraft();
    if (draft) {
      setAnswers(draft.answers || {});
      const safeIndex = Math.min(draft.currentStep || 0, visibleQuestions.length - 1);
      setCurrentQuestionIndex(safeIndex >= 0 ? safeIndex : 0);
      setHasStarted(true);
      startTimeRef.current = Date.now();
    }
  };

  // Start fresh
  const handleStartFresh = () => {
    clearSurveyDraft();
    setAnswers({});
    setCurrentQuestionIndex(0);
    setHasStarted(true);
    setHasSavedDraft(false);
    startTimeRef.current = Date.now();
  };

  // Handle single choice selection
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    setValidationError(null);
    const updated = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(updated);
    saveSurveyDraft(updated, currentQuestionIndex);

    // Auto-advance for single-choice questions for snappy mobile feel
    if (currentQuestion.type === 'single_choice' && currentQuestionIndex < visibleQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 240);
    }
  };

  // Handle multiple choice selection
  const handleToggleMultipleOption = (optionId: string) => {
    if (!currentQuestion) return;
    setValidationError(null);
    const currentList = (answers[currentQuestion.id] as string[]) || [];
    let updatedList: string[];

    if (currentList.includes(optionId)) {
      updatedList = currentList.filter(id => id !== optionId);
    } else {
      if (currentQuestion.maxSelection && currentList.length >= currentQuestion.maxSelection) {
        return; // Exceeded max selection
      }
      updatedList = [...currentList, optionId];
    }

    const updated = { ...answers, [currentQuestion.id]: updatedList };
    setAnswers(updated);
    saveSurveyDraft(updated, currentQuestionIndex);
  };

  // Handle text input
  const handleTextChange = (value: string) => {
    if (!currentQuestion) return;
    setValidationError(null);
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);
    saveSurveyDraft(updated, currentQuestionIndex);
  };

  // Validate current question before proceeding
  const validateCurrent = (): boolean => {
    if (!currentQuestion) return true;
    if (!currentQuestion.required) return true;

    const val = answers[currentQuestion.id];
    if (val === undefined || val === '') {
      setValidationError(t.requiredAlert);
      return false;
    }
    if (Array.isArray(val) && val.length === 0) {
      setValidationError(t.minSelectAlert);
      return false;
    }
    return true;
  };

  // Advance
  const handleNext = () => {
    if (!validateCurrent()) return;
    setValidationError(null);
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitSurvey();
    }
  };

  // Go back
  const handlePrevious = () => {
    setValidationError(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit survey
  const handleSubmitSurvey = async () => {
    if (!validateCurrent()) return;
    setIsSubmitting(true);

    const completionSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const responseId = `resp-user-${Date.now().toString(36)}`;

    const newResponse: SurveyResponse = {
      id: responseId,
      timestamp: new Date().toISOString(),
      language: lang,
      completionTimeSeconds: completionSeconds > 10 ? completionSeconds : 240,
      answers,
      wantsBetaAccess: false
    };

    await saveSurveyResponse(newResponse);
    setIsSubmitting(false);
    setIsCompleted(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Save beta contact
  const handleSaveContact = () => {
    if (!contactInfo.trim()) return;
    setIsContactSaved(true);
  };

  // Filtered Wilayas for selector
  const filteredWilayas = useMemo(() => {
    if (!wilayaSearch.trim()) return ALGERIAN_WILAYAS;
    const q = wilayaSearch.toLowerCase();
    return ALGERIAN_WILAYAS.filter(w => 
      w.nameAr.toLowerCase().includes(q) || 
      w.nameFr.toLowerCase().includes(q) || 
      w.code.includes(q)
    );
  }, [wilayaSearch]);

  // Overall progress percentage
  const progressPercent = Math.round(((currentQuestionIndex + 1) / visibleQuestions.length) * 100);

  // ==========================================
  // RENDER: Completion Screen
  // ==========================================
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            {t.thankYouTitle}
          </h2>

          <div className="p-4 my-6 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-sm sm:text-base leading-relaxed italic">
            {t.thankYouQuote}
          </div>

          <p className="text-sm text-slate-600 mb-8 max-w-lg mx-auto">
            {isAr
              ? 'تم تسجيل إجاباتك بنجاح وتحديث قاعدة بيانات دراسة الجدوى. مساهمتك ستشكل نواة إطلاق منصة جزائرية موثوقة تلبي احتياجات المستهلك الحقيقية.'
              : 'Your responses have been successfully recorded in the research database. Your input directly influences our launch roadmap.'}
          </p>

          {/* Early Access / Beta Card */}
          <div className="p-6 mb-8 text-start rounded-xl border border-emerald-100 bg-emerald-50/50">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800" />
              {t.betaSignupTitle}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              {t.betaSignupSubtitle}
            </p>

            {isContactSaved ? (
              <div className="p-3 bg-emerald-100/80 text-emerald-950 rounded-lg text-xs font-semibold flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-800" />
                {t.contactSaved}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  placeholder={isAr ? 'بريدك الإلكتروني أو رقم الهاتف (05/06/07...)' : 'Email or phone number (+213...)'}
                  className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                  onClick={handleSaveContact}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  {t.saveContact}
                </button>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{t.seeResults}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowAnswerReview(!showAnswerReview)}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {t.reviewAnswers}
            </button>
          </div>

          {/* Answers Review Drawer */}
          {showAnswerReview && (
            <div className="mt-8 pt-6 border-t border-slate-200 text-start space-y-3 animate-fade-in">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                {isAr ? 'ملخص الإجابات المسجلة:' : 'Summary of Your Recorded Answers:'}
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 max-h-72 overflow-y-auto text-xs">
                {Object.entries(answers).map(([key, value]) => {
                  const qObj = SURVEY_QUESTIONS.find(q => q.id === key);
                  if (!qObj) return null;
                  const displayVal = Array.isArray(value) ? value.join(', ') : String(value);
                  return (
                    <div key={key} className="border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                      <span className="font-semibold text-slate-800 block">
                        {isAr ? qObj.titleAr : qObj.titleEn}
                      </span>
                      <span className="text-slate-600 font-mono text-[11px] mt-0.5 block">
                        {displayVal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleStartFresh}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              {t.submitAnother}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Welcome / Intro Screen
  // ==========================================
  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800" />

          {/* Research Tag */}
          <div className="text-xs font-semibold text-emerald-800 tracking-wide mb-3 flex items-center gap-2">
            <span>{t.heroTag}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">{isAr ? 'دراسة سلوك المستهلك وتصميم الخدمة' : 'Consumer Psychology & Market Research'}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 text-balance">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
            {t.heroSubtitle}
          </p>

          {/* Visual Showcase Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 group h-28 bg-slate-100">
              <img
                src="/src/assets/images/fridge_appliance_clean_1793885099602.jpg"
                alt="Refrigerators inspection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2.5">
                <span className="text-white text-[11px] font-semibold">{isAr ? 'الأجهزة الكهرومنزلية' : 'Appliances'}</span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 group h-28 bg-slate-100">
              <img
                src="/src/assets/images/modern_sofa_living_1793885100256.jpg"
                alt="Living room furniture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2.5">
                <span className="text-white text-[11px] font-semibold">{isAr ? 'الصالونات والأثاث' : 'Furniture & Sofas'}</span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 group h-28 bg-slate-100">
              <img
                src="/src/assets/images/delivery_van_moving_1793885101017.jpg"
                alt="Bulky delivery van"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2.5">
                <span className="text-white text-[11px] font-semibold">{isAr ? 'الشحن والتنزيل' : 'Bulky Freight'}</span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 group h-28 bg-slate-100">
              <img
                src="/src/assets/images/technical_inspection_tool_1793885101904.jpg"
                alt="Technical Diagnostic Check"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2.5">
                <span className="text-white text-[11px] font-semibold">{isAr ? 'الفحص والضمان' : 'Inspection & Escrow'}</span>
              </div>
            </div>
          </div>

          {/* Reassurance Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{isAr ? 'وقت الإجابة' : 'Duration'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{t.timeEstimate}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{isAr ? 'خصوصية كاملة' : '100% Confidential'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{isAr ? 'دون جمع أي بيانات شخصية إلزامية' : 'No personal data required'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{isAr ? 'أثر مباشر' : 'Direct Impact'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{isAr ? 'صياغة خدمات المنصة الجزائرية' : 'Shapes product launch roadmap'}</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {hasSavedDraft ? (
              <>
                <button
                  onClick={handleResumeDraft}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.resumeSurvey}</span>
                  {isAr ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
                <button
                  onClick={handleStartFresh}
                  className="px-5 py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-center"
                >
                  {isAr ? 'بدء من جديد' : 'Start Fresh'}
                </button>
              </>
            ) : (
              <button
                onClick={handleStartFresh}
                className="px-8 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group"
              >
                <span>{t.startSurvey}</span>
                {isAr ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            )}

            <button
              onClick={onOpenConcept}
              className="px-5 py-3.5 text-sm font-medium text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-800" />
              <span>{t.exploreConcept}</span>
            </button>
          </div>

          {/* Bottom Confidentiality Disclaimer */}
          <p className="mt-8 text-xs text-slate-400">
            {t.confidentialNotice}
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Active Questionnaire Step
  // ==========================================
  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Top Header Strip */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-800">
              {isAr ? currentSection?.titleAr : currentSection?.titleEn}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t.autoSaved}</span>
          </div>
          <span className="font-mono tabular-nums font-semibold text-slate-700">
            {t.question} {currentQuestionIndex + 1} {t.of} {visibleQuestions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-800 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-9 relative">
        {/* Section Pill Marker */}
        <div className="flex items-center gap-2.5 mb-4 text-xs font-semibold text-slate-600">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
            {renderSectionIcon(currentSection?.iconName)}
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">
              {isAr ? `القسم ${currentSection?.id}:` : `Section ${currentSection?.id}:`}
            </span>
            <span className="text-slate-800 font-medium">
              {isAr ? currentSection?.titleAr : currentSection?.titleEn}
            </span>
          </div>
        </div>

        {/* Section Interstitial Quote (Personalized touch between sections) */}
        {isFirstQuestionOfSection && currentSection?.interstitialQuoteAr && (
          <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
            <Quote className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <p className="italic leading-relaxed">
              {isAr ? currentSection.interstitialQuoteAr : currentSection.interstitialQuoteEn}
            </p>
          </div>
        )}

        {/* Concept Card Banner for Section 4 (Platform Concept) */}
        {currentQuestion?.sectionId === 4 && currentQuestionIndex === visibleQuestions.findIndex(q => q.sectionId === 4) && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{t.conceptBadge}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {t.conceptDescription}
            </p>
          </div>
        )}

        {/* Question Title */}
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight text-balance">
          {isAr ? currentQuestion?.titleAr : currentQuestion?.titleEn}
          {currentQuestion?.required && <span className="text-rose-500 mr-1">*</span>}
        </h2>

        {/* Subtitle / Helper */}
        {(currentQuestion?.subtitleAr || currentQuestion?.subtitleEn) && (
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {isAr ? currentQuestion?.subtitleAr : currentQuestion?.subtitleEn}
          </p>
        )}

        {/* Options / Input Body */}
        <div className="space-y-2.5 my-6">
          {/* SINGLE CHOICE OPTIONS */}
          {currentQuestion?.type === 'single_choice' && currentQuestion.options && (
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-xl text-start transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-800 text-white'
                          : 'border-slate-300 text-slate-400'
                      }`}>
                        {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium">
                        {isAr ? option.labelAr : option.labelEn}
                      </span>
                    </div>

                    {option.image && (
                      <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <img src={option.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* MULTIPLE CHOICE OPTIONS (Visual Cards Grid when images available) */}
          {currentQuestion?.type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-2.5">
              <div className="text-xs text-slate-400 mb-2">
                {t.selectMultiple} {currentQuestion.maxSelection && `(${isAr ? `حد أقصى ${currentQuestion.maxSelection}` : `max ${currentQuestion.maxSelection}`})`}
              </div>

              {/* Check if options have images for card grid */}
              {currentQuestion.options.some(o => o.image) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentQuestion.options.map((option) => {
                    const currentSelection = (answers[currentQuestion.id] as string[]) || [];
                    const isSelected = currentSelection.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleToggleMultipleOption(option.id)}
                        className={`rounded-xl text-start transition-all overflow-hidden border flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-700/20'
                            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {option.image && (
                          <div className="w-full h-28 overflow-hidden bg-slate-100 relative">
                            <img src={option.image} alt={option.labelEn} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-2 end-2 w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-3">
                          <span className="text-xs font-semibold text-slate-900 block leading-snug">
                            {isAr ? option.labelAr : option.labelEn}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option) => {
                    const currentSelection = (answers[currentQuestion.id] as string[]) || [];
                    const isSelected = currentSelection.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleToggleMultipleOption(option.id)}
                        className={`w-full p-3.5 sm:p-4 rounded-xl text-start transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 shadow-2xs'
                            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-emerald-700 bg-emerald-800 text-white'
                              : 'border-slate-300 text-transparent'
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="text-sm font-medium">
                            {isAr ? option.labelAr : option.labelEn}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* WILAYA SELECT DROPDOWN */}
          {currentQuestion?.type === 'wilaya_select' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                <input
                  type="text"
                  value={wilayaSearch}
                  onChange={e => setWilayaSearch(e.target.value)}
                  placeholder={t.selectWilaya}
                  className="w-full ps-9 pe-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                {filteredWilayas.map(wilaya => {
                  const isSelected = answers[currentQuestion.id] === wilaya.code;
                  return (
                    <button
                      key={wilaya.code}
                      type="button"
                      onClick={() => handleSelectOption(wilaya.code)}
                      className={`w-full px-3.5 py-2.5 text-start rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-100'
                      }`}
                    >
                      <span>{isAr ? wilaya.nameAr : wilaya.nameFr}</span>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TEXTAREA INPUT */}
          {currentQuestion?.type === 'textarea' && (
            <div>
              <textarea
                rows={4}
                value={(answers[currentQuestion.id] as string) || ''}
                onChange={e => handleTextChange(e.target.value)}
                placeholder={isAr ? currentQuestion.placeholderAr : currentQuestion.placeholderEn}
                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-slate-900 leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>{isAr ? 'يمكنك التعبير بحرية وباللهجة الجزائرية أو العربية أو الفرنسية' : 'You can express freely in Arabic, French, or English'}</span>
                <span>{((answers[currentQuestion.id] as string) || '').length} {isAr ? 'حرف' : 'chars'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Validation Warning */}
        {validationError && (
          <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${
              currentQuestionIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{t.previous}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>{t.submitting}</span>
            ) : currentQuestionIndex === visibleQuestions.length - 1 ? (
              <>
                <span>{t.submit}</span>
                <Send className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>{t.next}</span>
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
