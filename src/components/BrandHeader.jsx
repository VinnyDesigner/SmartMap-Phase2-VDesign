import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, Users, HelpCircle, Menu, X, ArrowLeft, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dgeDarkLogo from '../assets/dge-dark.webp';
import dgeLightLogo from '../assets/dge-light.webp';
import sdiDarkLogo from '../assets/sdi-dark.webp';
import sdiLightLogo from '../assets/sdi-light.webp';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './common/LanguageSelector';
import ProjectSelectorDropdown from './common/ProjectSelectorDropdown';

export default function BrandHeader({ onNavigate, currentView, userAuth, onSignOut, onSignIn, setExplorerState }) {
  const { isArabic, setIsArabic, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

      <header className={`fixed top-1.5 left-0 right-0 z-40 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 h-16 md:h-18 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
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
        {/* Left: DGE Logo */}
        <div className="flex items-center pointer-events-auto gap-3 md:gap-4 h-full shrink-0">
          <img 
            src={isDarkMode ? dgeDarkLogo : dgeLightLogo} 
            alt="Department of Government Enablement" 
            className="h-8 md:h-9 lg:h-10 w-auto object-contain drop-shadow-sm cursor-pointer transition-all" 
            onClick={() => onNavigate?.('landing')} 
          />
        </div>

        {/* Center: SDI Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 top-0 bottom-0 -translate-x-1/2 h-full pointer-events-auto">
          {[
            { id: 'Home', en: 'Home', ar: 'الرئيسية', view: 'landing' },
            { id: 'SmartMap', en: 'SmartMap', ar: 'الخريطة الذكية', view: 'explorer' },
            { id: 'About', en: 'About', ar: 'من نحن', view: 'about' }
          ].map((item) => {
            const isActive = currentView === item.view || (item.view === 'explorer' && currentView === 'explorer') || (item.view === 'about' && currentView === 'about') || (item.view === 'help' && currentView === 'help');
            return (
              <button 
                key={item.id} 
                onClick={() => onNavigate?.(item.view)}
                className={`relative h-full flex items-center px-1.5 text-sm md:text-base font-semibold transition-colors duration-200 cursor-pointer select-none group ${
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

        {/* Right: Controls & User Authentication & SDI Logo */}
        <div className="flex items-center gap-4 shrink-0 ms-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center">
              <LanguageSelector isDarkMode={isDarkMode} />
            </div>

            {/* 1. Dark/Light Theme Toggle */}
            <button 
              onClick={toggleTheme}
              title={isDarkMode ? t("Switch to Light Mode", "التبديل إلى الوضع الفاتح") : t("Switch to Dark Mode", "التبديل إلى الوضع الداكن")}
              className={`hidden md:flex p-[2px] rounded-full transition-all duration-200 cursor-pointer group select-none ${
                isDarkMode 
                  ? 'border border-blue-400/35 hover:border-[#00e5ff]/90 hover:shadow-[0_0_12px_rgba(0,229,255,0.3)]' 
                  : 'border border-slate-300/80 hover:border-[#215A9E]/80 hover:shadow-xs'
              }`}
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
                isDarkMode ? 'bg-[#0a1730] group-hover:bg-[#112448] text-white' : 'bg-slate-100 group-hover:bg-[#eef3ff] text-[#215A9E]'
              }`}>
                {isDarkMode ? <Sun className="w-4.5 h-4.5 stroke-[1.5]" /> : <Moon className="w-4.5 h-4.5 stroke-[1.5]" />}
              </div>
            </button>

            {/* 2. Help/About Button */}
            <button 
              onClick={() => onNavigate?.('help')}
              title={t("Help & Documentation", "المساعدة والتوثيق")}
              className={`hidden md:flex p-[2px] rounded-full transition-all duration-200 cursor-pointer group select-none ${
                isDarkMode 
                  ? 'border border-blue-400/35 hover:border-[#00e5ff]/90 hover:shadow-[0_0_12px_rgba(0,229,255,0.3)]' 
                  : 'border border-slate-300/80 hover:border-[#215A9E]/80 hover:shadow-xs'
              }`}
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
                isDarkMode ? 'bg-[#0a1730] group-hover:bg-[#112448] text-white' : 'bg-slate-100 group-hover:bg-[#eef3ff] text-[#215A9E]'
              }`}>
                <HelpCircle className="w-4.5 h-4.5 stroke-[1.5]" />
              </div>
            </button>

            {/* 3. User Profile / Guest Dropdown Trigger Button */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={isLoggedIn ? `${userAuth.userName} (${t('Click for Account Details', 'تفاصيل الحساب')})` : t("Sign In / User Options", "خيارات المستخدم")}
                className={`hidden md:flex p-[2px] rounded-full transition-all duration-200 cursor-pointer group select-none ${
                  isDarkMode 
                    ? 'border border-blue-400/35 hover:border-[#00e5ff]/90 hover:shadow-[0_0_12px_rgba(0,229,255,0.3)]' 
                    : 'border border-slate-300/80 hover:border-[#215A9E]/80 hover:shadow-xs'
                }`}
              >
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode ? 'bg-[#0a1730] group-hover:bg-[#112448] text-white' : 'bg-slate-100 group-hover:bg-[#eef3ff] text-[#215A9E]'
                }`}>
                  {isLoggedIn ? <User className="w-4.5 h-4.5 stroke-[1.5]" /> : <Users className="w-4.5 h-4.5 stroke-[1.5]" />}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className={`absolute end-0 top-full mt-2 w-64 shadow-2xl border rounded-2xl p-4 z-50 flex flex-col gap-3 backdrop-blur-2xl ${
                  isDarkMode ? 'bg-[#0d1424]/95 border-slate-700/80 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
                }`}>
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-[#215A9E] text-white font-bold flex items-center justify-center text-sm shrink-0">
                          {userAuth?.userName ? userAuth.userName.slice(0, 2).toUpperCase() : 'UA'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs truncate">{isArabic && userAuth?.userNameAr ? userAuth.userNameAr : (userAuth?.userName || 'Eng. Ahmed')}</h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{userAuth?.role || 'Senior Geospatial Officer'}</p>
                          <p className="text-[9.5px] text-slate-400 truncate">{userAuth?.userEmail}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut?.();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t("Sign Out", "تسجيل الخروج")}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 border-b pb-2.5 border-slate-200 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-[#215A9E] dark:text-[#00e5ff] flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs">{t("Guest User", "زائر غير مسجل")}</h4>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                            {t("Sign in to save favorites and view history", "سجل الدخول لحفظ المفضلة وسجل البحث")}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate?.('login');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#215A9E] hover:bg-[#1a477d] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{t("Sign In", "تسجيل الدخول")}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border shadow-xs transition-all ${isDarkMode ? 'bg-[#132042]/90 border-slate-700/60 text-white' : 'bg-white/70 border-white/60 text-slate-700 hover:bg-white'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Extreme Right: SDI Logo */}
          <div className="hidden xl:flex items-center ms-3 shrink-0">
            <img 
              src={isDarkMode ? sdiDarkLogo : sdiLightLogo} 
              alt="Abu Dhabi Spatial Data Infrastructure" 
              className="h-11 md:h-12 lg:h-14 xl:h-16 w-auto object-contain max-h-16 transition-all" 
            />
          </div>
        </div>
      </header>

      {/* Mobile Off-canvas Drawer */}
      <AnimatePresence>
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
                <img src={isDarkMode ? dgeDarkLogo : dgeLightLogo} alt="DGE Logo" className="h-8 object-contain" />
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
