import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Language } from '../types/survey';
import { translations } from '../translations';
import { loginAdmin } from '../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[lang];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    const result = await loginAdmin(password);
    setIsLoading(false);

    if (result.success) {
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg(result.error || t.authError);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.adminLoginTitle}</h3>
              <p className="text-xs text-slate-500">{t.adminLoginDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.enterPassword}
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder={t.passwordPlaceholder}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm"
              />
              <KeyRound className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
            </div>
            {errorMsg && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{t.securityNotice}</span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {t.close}
            </button>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-1/2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.loggingIn}</span>
                </>
              ) : (
                <span>{t.loginBtn}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
