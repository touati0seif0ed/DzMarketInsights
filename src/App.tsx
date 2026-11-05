import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyWizard } from './components/SurveyWizard';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutStudy } from './components/AboutStudy';
import { ConceptModal } from './components/ConceptModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Language, SurveyResponse } from './types/survey';
import { getStoredResponses, fetchServerResponses, checkAdminSession, logoutAdmin } from './services/storage';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'about'>('survey');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  // Inactivity timeout: 30 minutes
  const lastActivityRef = useRef<number>(Date.now());

  // Check initial admin session and load responses
  useEffect(() => {
    async function init() {
      const isAuth = await checkAdminSession();
      setIsAdminAuthenticated(isAuth);

      if (isAuth) {
        const serverData = await fetchServerResponses();
        if (serverData) {
          setResponses(serverData);
          return;
        }
      }
      setResponses(getStoredResponses());
    }
    init();
  }, []);

  // Update HTML dir and lang attributes when language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  // Handle user activity for session timeout
  const handleUserActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // Interval check every 60 seconds
    const interval = setInterval(async () => {
      const now = Date.now();
      // 30 minutes = 1,800,000 ms
      if (isAdminAuthenticated && now - lastActivityRef.current > 30 * 60 * 1000) {
        await logoutAdmin();
        setIsAdminAuthenticated(false);
        setActiveTab('survey');
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearInterval(interval);
    };
  }, [isAdminAuthenticated, handleUserActivity]);

  // Toggle language
  const handleToggleLang = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Toggle Admin mode
  const handleToggleAdmin = async () => {
    if (activeTab === 'dashboard') {
      setActiveTab('survey');
    } else {
      const isStillAuth = await checkAdminSession();
      if (isStillAuth) {
        setIsAdminAuthenticated(true);
        setActiveTab('dashboard');
        const srv = await fetchServerResponses();
        if (srv) setResponses(srv);
      } else {
        setIsAdminAuthenticated(false);
        setIsAdminLoginModalOpen(true);
      }
    }
  };

  // Handle successful Admin Login
  const handleAdminLoginSuccess = async () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginModalOpen(false);
    setActiveTab('dashboard');
    const srv = await fetchServerResponses();
    if (srv) setResponses(srv);
  };

  // Handle Logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveTab('survey');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0F172A] flex flex-col font-sans transition-colors">
      {/* Top Bar */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        isAdmin={activeTab === 'dashboard'}
        onToggleAdmin={handleToggleAdmin}
        onOpenConcept={() => setIsConceptModalOpen(true)}
        onNavigateToSurvey={() => setActiveTab('survey')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'survey' && (
          <SurveyWizard
            lang={lang}
            onOpenConcept={() => setIsConceptModalOpen(true)}
            onOpenDashboard={() => {
              // Direct view for respondents on survey completion
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard
            responses={responses}
            onRefreshResponses={(updated) => setResponses(updated)}
            lang={lang}
            onLogout={handleAdminLogout}
          />
        )}

        {activeTab === 'about' && (
          <AboutStudy
            lang={lang}
            onStartSurvey={() => setActiveTab('survey')}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500 transition-colors no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {lang === 'ar' ? 'دراسة سوق الأثاث والأجهزة المستعملة في الجزائر' : 'Algerian Used Furniture & Appliances Study'}
            </span>
            <span aria-hidden="true">·</span>
            <span>2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>{lang === 'ar' ? 'بحث سوق مستقل لدراسة الجدوى وتطوير الخدمات' : 'Independent Feasibility & UX Market Research'}</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleToggleAdmin}
              className="hover:text-slate-600 transition-colors underline"
            >
              {lang === 'ar' ? 'بوابة التحليلات الإدارية' : 'Admin Portal'}
            </button>
          </div>
        </div>
      </footer>

      {/* Concept Explainer Modal */}
      <ConceptModal
        isOpen={isConceptModalOpen}
        onClose={() => setIsConceptModalOpen(false)}
        lang={lang}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        lang={lang}
      />
    </div>
  );
}
