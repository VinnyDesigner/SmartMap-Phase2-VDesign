import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Bookmark, History, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuthPromptModal({ isOpen, onClose, onSignIn, featureName }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md pointer-events-auto cursor-default">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border flex flex-col overflow-hidden pointer-events-auto cursor-default ${
            isDarkMode 
              ? 'bg-[#0b132b]/95 border-slate-700/80 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
              : 'bg-white border-slate-200/90 text-slate-900 shadow-[0_20px_50px_rgba(33,90,158,0.2)]'
          }`}
        >
          {/* SDI Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 end-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Icon Badge */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#215A9E] to-[#7c3aed] flex items-center justify-center text-white shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3D52A0] dark:text-[#00e5ff]">
                {t("Registered User Feature", "خاصية للمستخدم المسجل")}
              </span>
              <h3 className="text-xl font-bold tracking-tight leading-snug">
                {featureName || t("Sign In Required", "يتطلب تسجيل الدخول")}
              </h3>
            </div>
          </div>

          {/* Body Text */}
          <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {isArabic 
              ? `للحصول على التخصيص الكامل وحفظ الاستعلامات في حسابك الشخصي، يرجى تسجيل الدخول كـ "مستخدم مسجل".`
              : `To save custom locations and manage your multi-session history, please sign in as a Registered User.`}
          </p>

          {/* Features Preview List */}
          <div className={`rounded-2xl p-3.5 mb-6 border flex flex-col gap-2.5 ${
            isDarkMode ? 'bg-[#101a36] border-slate-800' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <Bookmark className="w-4 h-4 text-[#3D52A0] dark:text-[#00e5ff]" />
              <span>{t("Saved Searches & Custom Spatial Filters", "حفظ الاستعلامات والفلاتر المكانية")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <History className="w-4 h-4 text-[#7c3aed]" />
              <span>{t("Multi-Session Conversation History", "سجل المحادثات والتحليلات اللاحقة")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t("Verified Registered User Access", "دخول موثق كـ مستخدم مسجل")}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                onSignIn();
              }}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] text-white font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t("Sign In", "تسجيل الدخول")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              onClick={onClose}
              className={`w-full py-2.5 px-5 rounded-2xl font-semibold text-xs transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t("Continue as Guest", "الاستمرار كزائر")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
