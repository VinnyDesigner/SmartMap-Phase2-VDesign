import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, User, HelpCircle } from 'lucide-react';
import dgeLogo from '../../assets/dge-logo.png';
import sdiLogo from '../../assets/sdilogo.png';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSelector from '../common/LanguageSelector';

export default function ExplorerHeader({ onNavigate, currentView }) {
  const { t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={`pointer-events-auto border-b shadow-xs px-4 md:px-8 h-14 md:h-16 flex items-center justify-between shrink-0 relative transition-colors duration-300 ${
      isDarkMode ? 'bg-[#060a12] border-slate-800/90 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Left: Logo */}
      <div className="flex items-center gap-3 md:gap-5 h-full">
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
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-2">
          {/* SDI-style Text-Only Language Selector */}
          <LanguageSelector isDarkMode={isDarkMode} className="mx-1" />

          {/* Dark / Light Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-xs transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800 text-amber-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-[#7c3aed] hover:bg-white'
            }`}
            title={isDarkMode ? t("Switch to Light Mode", "التبديل إلى الوضع الفاتح") : t("Switch to Dark Mode", "التبديل إلى الوضع الداكن")}
          >
            {isDarkMode ? <Sun className="w-4 h-4 fill-current" /> : <Moon className="w-4 h-4 fill-current" />}
          </button>

          {/* Help/About Button */}
          <button 
            onClick={() => onNavigate?.('about')}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-xs transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Sign In Button - SDI Default Black, Hover Purple */}
        <button 
          onClick={() => onNavigate?.('login')}
          className="h-9 px-6 rounded-full bg-black text-white text-[13px] md:text-sm font-bold tracking-wide hover:bg-[#7c3aed] transition-all duration-300 flex items-center gap-2 shadow-xs cursor-pointer transform hover:-translate-y-0.5"
        >
          <User className="w-3.5 h-3.5" fill="currentColor" />
          <span className="hidden sm:inline">{t('Sign In', 'تسجيل الدخول')}</span>
        </button>

        <img 
          src={sdiLogo} 
          alt="Abu Dhabi Spatial Data" 
          className={`h-7 md:h-8 object-contain ml-1 md:ml-2 hidden md:block transition-all ${isDarkMode ? 'brightness-0 invert' : ''}`} 
        />
      </div>
    </header>
  );
}
