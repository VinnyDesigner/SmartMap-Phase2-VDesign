import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './common/LanguageSelector';

export default function SignInPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col lg:flex-row transition-colors duration-300 overflow-hidden relative ${isDarkMode ? 'bg-[#060a12] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* Signature Top SDI Brand Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-50 bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed]" />

      {/* Top Header Controls Bar */}
      <div className="absolute top-1.5 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => onNavigate('landing')}
          className={`flex items-center gap-2 transition-colors group cursor-pointer ${
            isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#063360]'
          }`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">{t("Back to Home", "العودة للرئيسية")}</span>
        </button>

        {/* SDI-Style Text-Only Language Selector */}
        <LanguageSelector isDarkMode={isDarkMode} />
      </div>

      {/* Left Panel - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-[#063360] via-[#102a4e] to-[#063360] overflow-hidden pt-16">
        {/* Subtle Ambient Orbs matching SDI Brand */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#215A9E]/20 blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c3aed]/10 blur-[100px]" />

        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <img src={dgeLogo} alt="Department of Government Enablement" className="h-10 md:h-12 object-contain brightness-0 invert" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {t("Discover Your World Through ", "اكتشف عالمك عبر ")}
                <span className="text-[#7DA1C4]" dir="ltr">GeoVision</span>
              </h1>
              <p className="text-lg text-slate-200/90 max-w-md leading-relaxed">
                {t("Access the most comprehensive spatial data infrastructure. Secure, reliable, and intelligent mapping solutions.", "قم بالوصول إلى البنية التحتية الشاملة للبيانات المكانية. حلول خرائط آمنة وموثوقة وذكية.")}
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-6 pt-12 border-t border-white/10">
            <img src={sdiLogo} alt="Abu Dhabi Spatial Data Infrastructure" className="h-9 md:h-10 object-contain brightness-0 invert opacity-90" />
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="w-5 h-5 text-[#7DA1C4]" />
              <span className="text-sm font-medium tracking-wide">{t("Secure Government Portal", "بوابة حكومية آمنة")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className={`flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-24 pt-20 pb-12 relative ${isDarkMode ? 'bg-[#060a12]' : 'bg-[#F8FAFC]'}`}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Mobile Brand Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src={dgeLogo} alt="DGE" className={`h-9 object-contain mx-auto ${isDarkMode ? 'brightness-0 invert' : ''}`} />
          </div>

          <div className="mb-8 text-center lg:text-start">
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t("Welcome Back", "مرحباً بعودتك")}</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{t("Sign in to access your GeoVision workspace.", "قم بتسجيل الدخول للوصول إلى مساحة عمل جيوفيجين الخاصة بك.")}</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#7c3aed] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full ps-11 pe-4 py-3.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all shadow-xs text-start ${
                    isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  placeholder="name@government.ae"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#7c3aed] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full ps-11 pe-12 py-3.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all shadow-xs text-start ${
                    isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  placeholder={t("Enter your password", "أدخل كلمة المرور")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#7c3aed] focus:ring-[#7c3aed]/20" />
                <span className={isDarkMode ? 'text-slate-300 font-medium' : 'text-slate-600 font-medium'}>{t("Remember me", "تذكرني")}</span>
              </label>
              <a href="#" className="font-semibold text-[#7c3aed] hover:text-[#5b21b6] transition-colors">
                {t("Forgot password?", "هل نسيت كلمة المرور؟")}
              </a>
            </div>

            <button
              type="submit"
              onClick={() => onNavigate('explorer')}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-black hover:bg-[#7c3aed] transition-all duration-300 shadow-sm transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed] cursor-pointer"
            >
              {t("Sign In", "تسجيل الدخول")}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500">
            {t("Don't have an account?", "ليس لديك حساب؟")}{' '}
            <a href="#" className="font-bold text-[#7c3aed] hover:text-[#5b21b6] transition-colors">
              {t("Request Access", "طلب وصول")}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
