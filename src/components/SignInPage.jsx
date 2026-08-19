import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Fingerprint, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';
import { useLanguage } from '../contexts/LanguageContext';

export default function SignInPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] w-full flex bg-[#F8FAFC] transition-colors duration-300 overflow-hidden">
      {/* Left Panel - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-dge-reliable via-dge-tech to-blue-400 overflow-hidden">
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[100px]" />

        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00e5ff] to-transparent z-10" />

        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div>
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-12"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">{t("Back to Home", "العودة للرئيسية")}</span>
            </button>

            <img src={dgeLogo} alt="DGE" className="h-16 object-contain mb-8 brightness-0 invert" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {t("Discover Your World Through ", "اكتشف عالمك عبر ")}<span className="text-[#00e5ff]" dir="ltr">GeoVision</span>
              </h1>
              <p className="text-lg text-blue-100 max-w-md">
                {t("Access the most comprehensive spatial data infrastructure. Secure, reliable, and intelligent mapping solutions.", "قم بالوصول إلى البنية التحتية الشاملة للبيانات المكانية. حلول خرائط آمنة وموثوقة وذكية.")}
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-6">
            <img src={sdiLogo} alt="SDI" className="h-12 object-contain brightness-0 invert opacity-90" />
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">{t("Secure Government Portal", "بوابة حكومية آمنة")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-24 relative">
        {/* Mobile Header / Back button */}
        <div className="absolute top-8 left-8 lg:hidden flex justify-between w-[calc(100%-4rem)]">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-slate-600 hover:text-dge-reliable transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">{t("Back", "رجوع")}</span>
          </button>
          <img src={dgeLogo} alt="DGE" className="h-8 object-contain" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10 text-center lg:text-left rtl:lg:text-right">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t("Welcome Back", "مرحباً بعودتك")}</h2>
            <p className="text-slate-500">{t("Sign in to access your GeoVision workspace.", "قم بتسجيل الدخول للوصول إلى مساحة عمل جيوفيجين الخاصة بك.")}</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-dge-tech transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full ps-11 pe-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dge-tech/20 focus:border-dge-tech transition-all shadow-sm text-start"
                  placeholder="name@government.ae"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-dge-tech transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full ps-11 pe-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dge-tech/20 focus:border-dge-tech transition-all shadow-sm text-start"
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
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-dge-tech focus:ring-dge-tech/20" />
                <span className="text-slate-600 font-medium">{t("Remember me", "تذكرني")}</span>
              </label>
              <a href="#" className="text-dge-tech font-semibold hover:text-dge-reliable transition-colors">
                {t("Forgot password?", "هل نسيت كلمة المرور؟")}
              </a>
            </div>

            <button
              type="submit"
              onClick={() => onNavigate('explorer')}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-dge-tech to-dge-reliable hover:shadow-md transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dge-tech"
            >
              {t("Sign In", "تسجيل الدخول")}
            </button>
          </form>



          <p className="mt-10 text-center text-sm text-slate-500">
            {t("Don't have an account?", "ليس لديك حساب؟")}{' '}
            <a href="#" className="font-bold text-dge-tech hover:text-dge-reliable transition-colors">
              {t("Request Access", "طلب وصول")}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}





