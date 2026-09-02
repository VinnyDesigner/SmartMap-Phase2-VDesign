import React, { useState } from 'react';
import { Sun, Moon, User, HelpCircle, Menu, X } from 'lucide-react';
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

  const isLoggedIn = userAuth?.isLoggedIn;

  return (
    <>
      {/* Top SDI Brand Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-50 bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed]" />

      <header className={`absolute top-1.5 left-0 right-0 z-40 px-4 md:px-8 h-14 md:h-16 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
        currentView === 'explorer'
          ? isDarkMode 
            ? 'bg-[#060a12] border-b border-slate-800/90 text-white shadow-md' 
            : 'bg-white border-b border-slate-200 text-slate-900 shadow-xs'
          : isDarkMode 
            ? 'bg-transparent border-b border-transparent text-white' 
            : 'bg-transparent border-b border-transparent text-slate-800'
      }`}>
        {/* Left: Logos */}
        <div className="flex items-center pointer-events-auto gap-3 md:gap-4 h-full">
          <img 
            src={dgeLogo} 
            alt="Department of Government Enablement" 
            className={`h-7 md:h-8 object-contain drop-shadow-sm cursor-pointer transition-all ${isDarkMode ? 'brightness-0 invert' : ''}`} 
            onClick={() => onNavigate?.('landing')} 
          />
        </div>

        {/* Center: SDI-Style Navigation */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
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
                className={`relative py-1 text-sm md:text-[15px] font-semibold transition-colors duration-200 cursor-pointer select-none ${
                  isActive 
                    ? isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold' 
                    : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#7c3aed]'
                }`}
              >
                {t(item.en, item.ar)}
                {isActive && (
                  <motion.div 
                    layoutId="activeHeaderNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#215A9E] to-[#7c3aed] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* SDI Header Brand Logo */}
          <div className="hidden xl:flex items-center me-2">
            <img src={sdiLogo} alt="Abu Dhabi Spatial Data Infrastructure" className="h-6 md:h-7 w-auto object-contain" />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* SDI-style Text-Only Language Selector */}
            <div className="hidden md:flex items-center">
              <LanguageSelector isDarkMode={isDarkMode} />
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
            
            {/* Authenticated User Profile Pill vs Guest User Status Pill */}
            {isLoggedIn ? (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                  AH
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[11px] font-bold leading-tight">
                    {isArabic ? userAuth.userNameAr || userAuth.userName : userAuth.userName}
                  </span>
                  <span className="text-[9px] opacity-80 leading-tight">UAE PASS Verified</span>
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
                  className="ms-1.5 h-7 px-3 rounded-full text-white bg-black hover:bg-[#7c3aed] transition-all duration-200 font-bold text-[10.5px] cursor-pointer shadow-2xs transform hover:-translate-y-0.5"
                >
                  {t('Sign In', 'دخول')}
                </button>
              </div>
            )}
            
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
              
              {/* SDI-style Language Selector for Mobile */}
              <button 
                onClick={() => { 
                  setPendingLanguage(!isArabic);
                  setIsMobileMenuOpen(false);
                }}
                className="p-4 rounded-xl flex items-center justify-between text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer w-full text-start"
              >
                <span>{t('Language', 'اللغة')}</span>
                <span className="text-sm font-semibold text-[#7c3aed]">
                  {isArabic ? 'English' : 'عربي'}
                </span>
              </button>
              
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
