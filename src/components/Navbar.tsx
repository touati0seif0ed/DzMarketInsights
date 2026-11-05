import React from 'react';
import { Globe, BarChart3, ClipboardList, Sparkles, Shield } from 'lucide-react';
import { Language } from '../types/survey';
import { translations } from '../translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenConcept: () => void;
  onNavigateToSurvey: () => void;
  activeTab: 'survey' | 'dashboard' | 'about';
  setActiveTab: (tab: 'survey' | 'dashboard' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  isAdmin,
  onToggleAdmin,
  onOpenConcept,
  onNavigateToSurvey,
  activeTab,
  setActiveTab
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onNavigateToSurvey}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-85 transition-opacity text-start"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            DZ
          </span>
          <span>{lang === 'ar' ? 'دراسة سوق الأثاث والأجهزة' : 'Algerian Second-Hand Market Study'}</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              setActiveTab('survey');
              onNavigateToSurvey();
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'survey' && !isAdmin
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-slate-900'
            }`}
          >
            {t.navSurvey}
          </button>

          <button
            onClick={onOpenConcept}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.navConcept}</span>
          </button>

          <button
            onClick={onToggleAdmin}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
              isAdmin
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.navDashboard}</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'about' && !isAdmin
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-slate-900'
            }`}
          >
            {t.navAbout}
          </button>
        </nav>

        {/* Zone 3: Actions (Language toggle + Primary View switcher) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Admin / Survey Switch Button */}
          {isAdmin ? (
            <button
              onClick={onToggleAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{t.exitAdmin}</span>
            </button>
          ) : (
            <button
              onClick={onToggleAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-800" />
              <span>{t.adminAccess}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
