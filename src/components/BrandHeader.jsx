import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, HelpCircle, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './common/LanguageSelector';

export default function BrandHeader({ onNavigate, currentView, userAuth, onSignOut, onSignIn }) {
  const { isArabic, setIsArabic, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const target = e.target;
      const scrollTop = target === document || target === window ? window.scrollY : (target && target.scrollTop !== undefined ? target.scrollTop : 0);
      if (scrollTop > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const isLoggedIn = userAuth?.isLoggedIn;

  return (
    <>
      {/* Top SDI Brand Line */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed]" />

      <header className={`fixed top-1.5 left-0 right-0 z-40 px-4 md:px-8 h-14 md:h-16 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
        currentView === 'explorer'
          ? isDarkMode 
            ? 'bg-[#060a12] border-b border-slate-800/90 text-white shadow-md' 
            : 'bg-white border-b border-slate-200 text-slate-900 shadow-xs'
          : isScrolled
            ? isDarkMode
              ? 'bg-[#060a12]/95 backdrop-blur-md border-b border-slate-800/90 text-white shadow-lg'
              : 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-md'
            : isDarkMode 
              ? 'bg-transparent border-b border-transparent text-white' 
              : 'bg-transparent border-b border-transparent text-slate-800'
      }`}>
        {/* Left: Back Button & DGE Logo */}
        <div className="flex items-center pointer-events-auto gap-3 md:gap-4 h-full">
          {currentView !== 'landing' && (
            <button
              onClick={() => onNavigate?.('landing')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#182645] border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title={t("Go back to home", "العودة للرئيسية")}
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span className="hidden sm:inline">{t('Back', 'رجوع')}</span>
            </button>
          )}

          <img 
            src={dgeLogo} 
            alt="Department of Government Enablement" 
            className={`h-7 md:h-8 object-contain drop-shadow-sm cursor-pointer transition-all ${isDarkMode ? 'brightness-0 invert' : ''}`} 
            onClick={() => onNavigate?.('landing')} 
          />
        </div>

        {/* Center: SDI Navigation */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 top-0 bottom-0 -translate-x-1/2 h-full pointer-events-auto">
          {[
            { id: 'Home', en: 'Home', ar: 'الرئيسية', view: 'landing' },
            { id: 'Map View', en: 'Map View', ar: 'عرض الخريطة', view: 'explorer' },
            { id: 'About Us', en: 'About Us', ar: 'من نحن', view: 'about' }
          ].map((item) => {
            const isActive = currentView === item.view;
            return (
              <button 
                key={item.id} 
                onClick={() => onNavigate?.(item.view)}
                className={`relative h-full flex items-center px-1 text-sm md:text-[15px] font-semibold transition-colors duration-200 cursor-pointer select-none group ${
                  isActive 
                    ? isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold' 
                    : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#215A9E]'
                }`}
              >
                {t(item.en, item.ar)}
                
                {isActive && (
                  <motion.div 
                    layoutId="activeHeaderNav"
                    className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] rounded-full shadow-xs z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & User Authentication */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center me-2">
            <img src={sdiLogo} alt="Abu Dhabi Spatial Data Infrastructure" className={`h-6 md:h-7 w-auto object-contain ${isDarkMode ? 'brightness-0 invert' : ''}`} />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center">
              <LanguageSelector isDarkMode={isDarkMode} />
            </div>
            
            {/* Dark/Light Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`hidden md:flex w-9 h-9 rounded-full items-center justify-center backdrop-blur-md border shadow-xs transition-all ${isDarkMode ? 'bg-[#0f172a]/90 border-slate-800 text-amber-300 hover:bg-slate-800' : 'bg-white/70 border-white/60 text-[#7c3aed] hover:bg-white'}`}
              title={isDarkMode ? t("Switch to Light Mode", "التبديل إلى الوضع الفاتح") : t("Switch to Dark Mode", "التبديل إلى الوضع الداكن")}
            >
              {isDarkMode ? <Sun className="w-4 h-4 fill-current" /> : <Moon className="w-4 h-4 fill-current" />}
            </button>
            
            <button 
              onClick={() => onNavigate?.('help')}
              className={`hidden md:flex w-9 h-9 rounded-full items-center justify-center backdrop-blur-md border shadow-xs transition-all ${isDarkMode ? 'bg-[#0f172a]/90 border-slate-800 text-white hover:bg-slate-800' : 'bg-white/70 border-white/60 text-white hover:bg-white'}`}
              title={t("Help & Documentation", "المساعدة والتوثيق")}
            >
              <HelpCircle className={`w-4 h-4 ${isDarkMode ? 'fill-white text-[#0f172a]' : 'fill-[#7c3aed] text-white'}`} />
            </button>
            
            {/* Authenticated User Status vs Guest Status */}
            {isLoggedIn ? (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                  AH
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[11px] font-bold leading-tight">
                    {isArabic ? userAuth.userNameAr || userAuth.userName : userAuth.userName}
                  </span>
                  <span className="text-[9px] opacity-80 leading-tight">{t("Registered User", "مستخدم مسجل")}</span>
                </div>
                <button
                  onClick={onSignOut}
                  className="ms-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                >
                  {t('Sign Out', 'خروج')}
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[11px] font-bold leading-tight">
                    {t('Guest User', 'مستخدم زائر')}
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">{t('Open Data Access', 'بيانات عامة')}</span>
                </div>
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="ms-1.5 h-7 px-3 rounded-full text-white bg-black hover:bg-[#7c3aed] transition-all duration-200 font-bold text-[10.5px] cursor-pointer shadow-2xs"
                >
                  {t('Sign In', 'دخول')}
                </button>
              </div>
            )}
            
            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border shadow-xs transition-all ${isDarkMode ? 'bg-[#132042]/90 border-slate-700/60 text-white' : 'bg-white/70 border-white/60 text-slate-700 hover:bg-white'}`}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Off-canvas Drawer */}
      <AnimatePresence onExitComplete={() => {
        if (pendingLanguage !== null) {
          setIsArabic(pendingLanguage);
          setPendingLanguage(null);
        }
      }}>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[100] pointer-events-auto lg:hidden"
            />
            <motion.div
              initial={{ x: isArabic ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 bottom-0 start-0 w-[280px] bg-white dark:bg-[#0c1427] z-[101] shadow-2xl flex flex-col pointer-events-auto lg:hidden"
            >
              <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
                <img src={dgeLogo} alt="DGE Logo" className="h-8 object-contain dark:brightness-0 dark:invert" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
                <button 
                  onClick={() => { onNavigate?.('landing'); setIsMobileMenuOpen(false); }}
                  className={`p-3 rounded-xl text-start font-bold text-sm ${currentView === 'landing' ? 'bg-[#eef3ff] text-[#215A9E]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  {t('Home', 'الرئيسية')}
                </button>
                <button 
                  onClick={() => { onNavigate?.('explorer'); setIsMobileMenuOpen(false); }}
                  className={`p-3 rounded-xl text-start font-bold text-sm ${currentView === 'explorer' ? 'bg-[#eef3ff] text-[#215A9E]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  {t('Map View', 'عرض الخريطة')}
                </button>
                <button 
                  onClick={() => { onNavigate?.('about'); setIsMobileMenuOpen(false); }}
                  className="p-3 rounded-xl text-start font-bold text-sm text-slate-600 dark:text-slate-300"
                >
                  {t('About Us', 'من نحن')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
