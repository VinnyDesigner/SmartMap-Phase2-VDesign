import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, Users, HelpCircle, LogIn, LogOut, Heart } from 'lucide-react';
import dgeDarkLogo from '../../assets/dge-dark.webp';
import dgeLightLogo from '../../assets/dge-light.webp';
import sdiDarkLogo from '../../assets/sdi-dark.webp';
import sdiLightLogo from '../../assets/sdi-light.webp';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSelector from '../common/LanguageSelector';

const ShareFeedbackIcon = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5,3 5.7,4.5 7.3,4.7 6.1,5.8 6.4,7.4 5,6.6 3.6,7.4 3.9,5.8 2.7,4.7 4.3,4.5" fill="currentColor" stroke="none" />
    <polygon points="12,2 12.7,3.5 14.3,3.7 13.1,4.8 13.4,6.4 12,5.6 10.6,6.4 10.9,4.8 9.7,3.7 11.3,3.5" fill="currentColor" stroke="none" />
    <polygon points="19,3 19.7,4.5 21.3,4.7 20.1,5.8 20.4,7.4 19,6.6 17.6,7.4 17.9,5.8 16.7,4.7 18.3,4.5" fill="currentColor" stroke="none" />
    <path d="M21 13a2 2 0 0 1-2 2H7l-4 4V11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function ExplorerHeader({ onNavigate, currentView, userAuth, onSignOut, onSignIn, setExplorerState, onOpenFeedback }) {
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
                ? 'text-[#7c3aed] hover:text-white hover:bg-slate-800/60' 
                : 'text-[#7c3aed] hover:text-[#7c3aed] hover:bg-purple-50'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5 stroke-[1.75]" /> : <Moon className="w-5 h-5 stroke-[1.75]" />}
          </button>

          {/* 2. User Profile / Guest Sign-In Button */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={isLoggedIn ? `${userAuth.userName} (${t('Click for Account Details', 'تفاصيل الحساب')})` : t("Guest User (Click to Sign In)", "زائر غير مسجل")}
              className={`hidden md:flex p-[2px] rounded-full transition-all duration-200 cursor-pointer group select-none ${
                isDarkMode 
                  ? 'border border-purple-500/40 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                  : 'border border-slate-300/80 hover:border-[#7c3aed]/80 hover:shadow-xs'
              }`}
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors font-extrabold text-xs md:text-sm tracking-wider ${
                isDarkMode ? 'bg-[#0a0c16] group-hover:bg-purple-950/60 text-purple-400' : 'bg-slate-100 group-hover:bg-purple-50 text-[#7c3aed]'
              }`}>
                {isLoggedIn 
                  ? (userAuth?.userName ? userAuth.userName.trim().slice(0, 2).toUpperCase() : 'UA')
                  : 'GU'
                }
              </div>
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)} 
                  />

                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute end-0 top-full mt-2 w-64 shadow-2xl border rounded-2xl p-2.5 z-50 flex flex-col gap-1 backdrop-blur-2xl ${
                      isDarkMode ? 'bg-[#0d1424]/95 border-slate-700/80 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    {/* User Header Summary */}
                    {isLoggedIn ? (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl border-b border-slate-200 dark:border-slate-800/80 mb-1">
                        <div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                          {userAuth?.userName ? userAuth.userName.slice(0, 2).toUpperCase() : 'UA'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs truncate">{isArabic && userAuth?.userNameAr ? userAuth.userNameAr : (userAuth?.userName || 'Eng. Ahmed')}</h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{userAuth?.role || 'Senior Geospatial Officer'}</p>
                          <p className="text-[9.5px] text-slate-400 truncate">{userAuth?.userEmail}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl border-b border-slate-200 dark:border-slate-800/80 mb-1">
                        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#7c3aed] dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                          GU
                        </div>
                        <div>
                          <h4 className="font-bold text-xs">{t("Guest User", "زائر غير مسجل")}</h4>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                            {t("Open Data Access & GIS Intelligence", "وصول محدد للبيانات المفتوحة")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 1. Share Feedback */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenFeedback?.();
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs md:text-sm transition-colors flex items-center gap-3.5 text-start cursor-pointer ${
                        isDarkMode ? 'hover:bg-purple-950/40 text-slate-200 hover:text-purple-300' : 'hover:bg-purple-50 text-slate-700 hover:text-[#7c3aed]'
                      }`}
                    >
                      <ShareFeedbackIcon className="w-5 h-5 shrink-0 text-[#7c3aed] dark:text-purple-400" />
                      <span>{t("Share Feedback", "مشاركة الملاحظات")}</span>
                    </button>

                    {/* 2. Help & Support */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate?.('help');
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs md:text-sm transition-colors flex items-center gap-3.5 text-start cursor-pointer ${
                        isDarkMode ? 'hover:bg-purple-950/40 text-slate-200 hover:text-purple-300' : 'hover:bg-purple-50 text-slate-700 hover:text-[#7c3aed]'
                      }`}
                    >
                      <HelpCircle className="w-5 h-5 shrink-0 text-[#7c3aed] dark:text-purple-400 stroke-[1.75]" />
                      <span>{t("Help & Support", "المساعدة والدعم")}</span>
                    </button>

                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />

                    {/* 3. Sign Out / Sign In */}
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut?.();
                        }}
                        className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs md:text-sm transition-colors flex items-center gap-3.5 text-start text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <LogOut className="w-5 h-5 shrink-0 stroke-[1.75]" />
                        <span>{t("Sign Out", "تسجيل الخروج")}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate?.('login');
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs md:text-sm transition-all flex items-center gap-3.5 text-start cursor-pointer ${
                          isDarkMode 
                            ? 'bg-[#7c3aed] hover:bg-[#060a12] text-white' 
                            : 'bg-[#060a12] hover:bg-[#7c3aed] text-white'
                        }`}
                      >
                        <LogIn className="w-5 h-5 shrink-0 stroke-[1.75]" />
                        <span>{t("Sign In", "تسجيل الدخول")}</span>
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
