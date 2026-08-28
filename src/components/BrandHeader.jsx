import React, { useState } from 'react';
import { Sun, Moon, User, HelpCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';



export default function BrandHeader({ onNavigate, currentView }) {
  const { isArabic, setIsArabic, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);
  return (
    <>
      {/* Top Brand Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-50 bg-gradient-to-r from-[#c084fc] via-[#8b5cf6] to-[#6d28d9]" />

      <header className={`absolute top-1.5 left-0 right-0 z-40 px-4 md:px-8 h-14 md:h-16 flex items-center justify-between backdrop-blur-2xl border-b pointer-events-auto transition-all duration-300 ${
        isDarkMode ? 'bg-[#060a12]/85 border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-white' : 'bg-white/95 border-slate-200 shadow-xs text-slate-800'
      }`}>
        {/* Left: Logos */}
        <div className="flex items-center pointer-events-auto gap-3 md:gap-4 h-full">
          <img 
            src={dgeLogo} 
            alt="Department of Government Enablement" 
            className={`h-8 md:h-9 object-contain drop-shadow-sm cursor-pointer transition-all ${isDarkMode ? 'brightness-0 invert' : ''}`} 
            onClick={() => onNavigate?.('landing')} 
          />
        </div>

        {/* Center: Navigation Pills */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-[1px] rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] pointer-events-auto group">
          <div 
            className="absolute aspect-square w-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] z-0 opacity-40"
            style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(168, 85, 247, 0.4) 60%, #c084fc 85%, transparent 100%)' }} 
          />
          <nav className={`relative z-10 flex items-center backdrop-blur-2xl p-1 rounded-full h-9 border transition-colors ${
            isDarkMode ? 'bg-[#0c1322]/90 border-slate-800/90' : 'bg-white/90 border-transparent'
          }`}>
            {['Home', 'Map View'].map((item) => {
              const isActive = (item === 'Home' && currentView === 'landing') || (item === 'Map View' && currentView === 'explorer');
              return (
                <button 
                  key={item} 
                  onClick={() => {
                    if (item === 'Home') onNavigate?.('landing');
                    else if (item === 'Map View') onNavigate?.('explorer');
                  }}
                  className={`px-5 h-7 flex items-center justify-center rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] text-white shadow-sm font-bold' 
                        : 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-sm font-bold'
                      : isDarkMode 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' 
                        : 'text-slate-600 hover:text-[#7c3aed] hover:bg-slate-100/60'
                  }`}
                >
                  {t(item, item === 'Home' ? 'الرئيسية' : 'عرض الخريطة')}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions & Logo */}
        <div className="flex items-center gap-3 md:gap-4 pointer-events-auto h-full">
          <img 
            src={sdiLogo} 
            alt="Abu Dhabi Spatial Data" 
            className={`h-7 md:h-8 object-contain drop-shadow-sm hidden md:block opacity-90 hover:opacity-100 transition-all ${isDarkMode ? 'brightness-0 invert' : ''}`} 
          />
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Toggle Switch */}
            <div 
              onClick={() => setIsArabic(!isArabic)}
              className={`hidden md:flex items-center backdrop-blur-md p-0.5 rounded-full shadow-sm border cursor-pointer w-20 h-9 relative ${isDarkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white/70 border-white/60'}`}
            >
              <div className={`absolute left-0.5 top-0.5 w-8 h-8 rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isDarkMode ? 'bg-[#7c3aed]' : 'bg-[#7c3aed]'} ${isArabic ? 'translate-x-[36px]' : 'translate-x-0'}`} />
              <div className={`w-9 h-8 flex items-center justify-center text-[12px] font-bold z-10 transition-colors ${!isArabic ? 'text-white' : 'text-slate-400'}`}>EN</div>
              <div className={`w-9 h-8 flex items-center justify-center text-[14px] font-bold font-sans z-10 transition-colors ${isArabic ? 'text-white' : 'text-slate-400'}`}>ع</div>
            </div>
            
            {/* Dark/Light Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`hidden md:flex w-9 h-9 rounded-full items-center justify-center backdrop-blur-md border shadow-sm transition-all ${isDarkMode ? 'bg-[#0f172a]/90 border-slate-800 text-amber-300 hover:bg-slate-800' : 'bg-white/70 border-white/60 text-[#7c3aed] hover:bg-white'}`}
              title={isDarkMode ? t("Switch to Light Mode", "التبديل إلى الوضع الفاتح") : t("Switch to Dark Mode", "التبديل إلى الوضع الداكن")}
            >
              {isDarkMode ? <Sun className="w-4 h-4 fill-current" /> : <Moon className="w-4 h-4 fill-current" />}
            </button>
            
            {/* Help/About Button */}
            <button 
              onClick={() => onNavigate?.('about')}
              className={`hidden md:flex w-9 h-9 rounded-full items-center justify-center backdrop-blur-md border shadow-sm transition-all ${isDarkMode ? 'bg-[#0f172a]/90 border-slate-800 text-white hover:bg-slate-800' : 'bg-white/70 border-white/60 text-white hover:bg-white'}`}
            >
              <HelpCircle className={`w-4 h-4 ${isDarkMode ? 'fill-white text-[#0f172a]' : 'fill-[#7c3aed] text-white'}`} />
            </button>
            
            {/* Sign In Button */}
            <button 
              onClick={() => onNavigate?.('login')}
              className={`hidden lg:flex h-9 px-5 rounded-full items-center gap-2 text-white transition-all transform hover:-translate-y-0.5 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:from-[#6d28d9] hover:to-[#4c1d95] shadow-sm border border-[#7c3aed]/40' 
                  : 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:from-[#6d28d9] hover:to-[#4c1d95] shadow-[0_4px_16px_rgba(124,58,237,0.3)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="text-xs md:text-sm font-bold tracking-wide">{t('Sign In', 'تسجيل الدخول')}</span>
            </button>
            
            {/* Mobile Hamburger Menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border shadow-sm transition-all ${isDarkMode ? 'bg-[#132042]/90 border-slate-700/60 text-white' : 'bg-white/70 border-white/60 text-dge-reliable hover:bg-white'}`}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

    <AnimatePresence onExitComplete={() => {
      if (pendingLanguage !== null) {
        setIsArabic(pendingLanguage);
        setPendingLanguage(null);
      }
    }}>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] pointer-events-auto lg:hidden"
          />
          {/* Off Canvas Panel */}
          <motion.div
            initial={{ x: isArabic ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 bottom-0 start-0 w-[280px] bg-white z-[101] shadow-2xl flex flex-col pointer-events-auto lg:hidden"
          >
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <img src={dgeLogo} alt="DGE Logo" className="h-8 object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
              <button 
                onClick={() => { onNavigate?.('landing'); setIsMobileMenuOpen(false); }}
                className={`p-4 rounded-xl text-start font-bold text-[15px] transition-colors ${currentView === 'landing' ? 'bg-[#f0f4ff] text-[#3D52A0]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {t('Home', 'الرئيسية')}
              </button>
              <button 
                onClick={() => { onNavigate?.('explorer'); setIsMobileMenuOpen(false); }}
                className={`p-4 rounded-xl text-start font-bold text-[15px] transition-colors ${currentView === 'explorer' ? 'bg-[#f0f4ff] text-[#3D52A0]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {t('Map View', 'عرض الخريطة')}
              </button>
              <button 
                onClick={() => { onNavigate?.('about'); setIsMobileMenuOpen(false); }}
                className="p-4 rounded-xl text-start font-bold text-[15px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {t('About Us', 'من نحن')}
              </button>
              <div className="h-px bg-gray-100 my-2" />
              
              {/* Language Toggle for Mobile */}
              <div 
                onClick={() => { 
                  setPendingLanguage(!isArabic);
                  setIsMobileMenuOpen(false);
                }}
                className="p-4 rounded-xl flex items-center justify-between text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{t('Language (English/Arabic)', 'اللغة (العربية/English)')}</span>
                <div className="flex items-center bg-slate-200 p-1 rounded-full w-14 relative">
                  <div className={`absolute start-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isArabic ? 'translate-x-[24px] rtl:-translate-x-[24px]' : 'translate-x-0'}`}></div>
                  <div className="w-6 h-5 flex items-center justify-center text-[9px] z-10 text-dge-reliable">EN</div>
                  <div className="w-6 h-5 flex items-center justify-center text-[11px] z-10 text-dge-reliable">ع</div>
                </div>
              </div>
              
              {/* Theme Toggle for Mobile */}
              <div 
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className="p-4 rounded-xl flex items-center justify-between text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{isDarkMode ? t('Switch to Light Mode', 'التبديل إلى الوضع الفاتح') : t('Switch to Dark Mode', 'التبديل إلى الوضع الداكن')}</span>
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full text-dge-reliable">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
              </div>

            </div>
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={() => { onNavigate?.('login'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-dge-tech to-dge-reliable text-white font-bold text-[15px]"
              >
                <User className="w-4 h-4" />
                {t('Sign In', 'تسجيل الدخول')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
