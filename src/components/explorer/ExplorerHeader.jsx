import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, User, Users, HelpCircle, LogIn, LogOut } from 'lucide-react';
import dgeDarkLogo from '../../assets/dge-dark.webp';
import dgeLightLogo from '../../assets/dge-light.webp';
import sdiDarkLogo from '../../assets/sdi-dark.webp';
import sdiLightLogo from '../../assets/sdi-light.webp';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSelector from '../common/LanguageSelector';

export default function ExplorerHeader({ onNavigate, currentView, userAuth, onSignOut, onSignIn }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = userAuth?.isLoggedIn;

  return (
    <header className={`pointer-events-auto border-b shadow-xs px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 h-16 md:h-18 flex items-center justify-between shrink-0 relative transition-colors duration-300 ${
      isDarkMode ? 'bg-[#060a12] border-slate-800/90 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Left: Logo */}
      <div className="flex items-center gap-3 md:gap-5 h-full shrink-0 py-2">
        <img 
          src={isDarkMode ? dgeDarkLogo : dgeLightLogo} 
          alt="Department of Government Enablement" 
          className="h-7 md:h-8 lg:h-9 max-h-9 w-auto object-contain drop-shadow-sm cursor-pointer transition-all my-auto" 
          onClick={() => onNavigate?.('landing')} 
        />
      </div>

      {/* Center: SDI-Style Navigation */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        {[
          { id: 'Home', en: 'Home', ar: 'الرئيسية', view: 'landing' },
          { id: 'SmartMap', en: 'SmartMap', ar: 'الخريطة الذكية', view: 'explorer' },
          { id: 'About', en: 'About', ar: 'من نحن', view: 'about' }
        ].map((item) => {
          const isActive = currentView === item.view || (item.view === 'explorer' && currentView === 'explorer') || (item.view === 'about' && currentView === 'about');
          return (
            <button 
              key={item.id} 
              onClick={() => onNavigate?.(item.view)}
              className={`relative py-1 text-sm md:text-base font-semibold transition-colors duration-200 cursor-pointer select-none ${
                isActive 
                  ? isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold' 
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#7c3aed]'
              }`}
            >
              {t(item.en, item.ar)}
              {isActive && (
                <motion.div 
                  layoutId="sdiExplorerNavUnderline"
                  className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#7c3aed] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0 ms-auto">
        <div className="hidden md:flex items-center gap-2.5">
          {/* SDI-style Text-Only Language Selector */}
          <LanguageSelector isDarkMode={isDarkMode} className="mx-1" />

          {/* 1. Dark / Light Theme Toggle (Icon Only, No Circle) */}
          <button 
            onClick={toggleTheme}
            title={isDarkMode ? t("Switch to Light Mode", "التبديل إلى الوضع الفاتح") : t("Switch to Dark Mode", "التبديل إلى الوضع الداكن")}
            className={`hidden md:flex p-2 rounded-xl transition-colors cursor-pointer select-none ${
              isDarkMode 
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' 
                : 'text-slate-600 hover:text-[#215A9E] hover:bg-slate-100/80'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5 stroke-[1.75]" /> : <Moon className="w-5 h-5 stroke-[1.75]" />}
          </button>

          {/* 2. Help/About Button (Icon Only, No Circle) */}
          <button 
            onClick={() => onNavigate?.('about')}
            title={t("Help & Documentation", "المساعدة والتوثيق")}
            className={`hidden md:flex p-2 rounded-xl transition-colors cursor-pointer select-none ${
              isDarkMode 
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' 
                : 'text-slate-600 hover:text-[#215A9E] hover:bg-slate-100/80'
            }`}
          >
            <HelpCircle className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* 3. User Profile / Guest Sign-In Button (Keeps Circle with Initials "GU" or User Initials) */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={isLoggedIn ? `${userAuth.userName} (${t('Click for Account Details', 'تفاصيل الحساب')})` : t("Guest User (Click to Sign In)", "زائر غير مسجل")}
              className={`hidden md:flex p-[2px] rounded-full transition-all duration-200 cursor-pointer group select-none ${
                isDarkMode 
                  ? 'border border-blue-400/35 hover:border-[#00e5ff]/90 hover:shadow-[0_0_12px_rgba(0,229,255,0.3)]' 
                  : 'border border-slate-300/80 hover:border-[#215A9E]/80 hover:shadow-xs'
              }`}
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors font-extrabold text-xs md:text-sm tracking-wider ${
                isDarkMode ? 'bg-[#0a1730] group-hover:bg-[#112448] text-[#00e5ff]' : 'bg-slate-100 group-hover:bg-[#eef3ff] text-[#215A9E]'
              }`}>
                {isLoggedIn 
                  ? (userAuth?.userName ? userAuth.userName.trim().slice(0, 2).toUpperCase() : 'UA')
                  : 'GU'
                }
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
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-[#215A9E] dark:text-[#00e5ff] flex items-center justify-center font-bold text-xs shrink-0">
                        GU
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
        </div>

        <div className="hidden xl:flex items-center ms-3 shrink-0 py-2">
          <img 
            src={isDarkMode ? sdiDarkLogo : sdiLightLogo} 
            alt="Abu Dhabi Spatial Data Infrastructure" 
            className="h-8 md:h-9 lg:h-10 max-h-10 w-auto object-contain transition-all" 
          />
        </div>
      </div>
    </header>
  );
}
