import React, { useState } from 'react';
import { Sun, LogIn, HelpCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';
import { useLanguage } from '../contexts/LanguageContext';

export default function BrandHeader({ onNavigate, currentView }) {
  const { isArabic, setIsArabic, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      {/* Top Brand Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-50 bg-gradient-to-r from-dge-light via-dge-tech to-dge-reliable" />

      <header className="absolute top-0 left-0 right-0 z-40 px-4 py-4 md:px-8 md:py-6 mt-1 flex items-center justify-between pointer-events-none">
      {/* Logos */}
      <div className="flex items-center pointer-events-auto gap-3 md:gap-5">
        <img src={dgeLogo} alt="Department of Government Enablement" className="h-8 md:h-12 object-contain drop-shadow-sm" />
      </div>

      {/* Navigation */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 p-[1px] rounded-full overflow-hidden shadow-[0_4px_20px_rgba(33,90,158,0.08)] pointer-events-auto group">
        {/* Animated Shiny Stroke Layer - forced square for perfectly smooth rotation */}
        <div className="absolute aspect-square w-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] z-0 opacity-60"
             style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(61, 82, 160, 0.5) 60%, #00e5ff 85%, transparent 100%)' }} 
        />
        <nav className="relative z-10 flex items-center bg-white/90 backdrop-blur-xl p-1.5 rounded-full w-full h-full">
          {['Home', 'Map View'].map((item) => {
            const isActive = (item === 'Home' && currentView === 'landing') || (item === 'Map View' && currentView === 'explorer');
            return (
              <button 
                key={item} 
                onClick={() => {
                  if (item === 'Home') onNavigate?.('landing');
                  else if (item === 'Map View') onNavigate?.('explorer');
                }}
                className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? 'bg-white text-[#3D52A0] shadow-sm' : 'text-slate-600 hover:text-[#3D52A0] hover:bg-white/50'}`}
              >
                {t(item, item === 'Home' ? 'الرئيسية' : 'عرض الخريطة')}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Actions & Right Logo */}
      <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
        <img src={sdiLogo} alt="Abu Dhabi Spatial Data" className="h-8 md:h-10 object-contain drop-shadow-sm hidden md:block opacity-90 hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Toggle Switch */}
          <div 
            onClick={() => setIsArabic(!isArabic)}
            className="hidden md:flex items-center bg-white/50 backdrop-blur-md p-1 rounded-full shadow-inner border border-white/40 cursor-pointer w-20 relative"
          >
            <div className={`absolute left-1 top-1 w-8 h-8 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isArabic ? 'translate-x-[36px]' : 'translate-x-0'}`}></div>
            <div className={`w-9 h-8 flex items-center justify-center text-[13px] font-bold z-10 transition-colors ${!isArabic ? 'text-dge-reliable' : 'text-slate-500'}`}>EN</div>
            <div className={`w-9 h-8 flex items-center justify-center text-[16px] font-bold font-sans z-10 transition-colors ${isArabic ? 'text-dge-reliable' : 'text-slate-500'}`}>ع</div>
          </div>
          
          <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-dge-reliable bg-white/70 backdrop-blur-md border border-white/60 hover:bg-white hover:shadow-sm transition-all shadow-sm">
            <Sun className="w-[18px] h-[18px] fill-dge-reliable" />
          </button>
          
          {/* Empty chunk as we move it to the end */}
          <button 
            onClick={() => onNavigate?.('about')}
            className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-white bg-white/70 backdrop-blur-md border border-white/60 hover:bg-white hover:shadow-sm transition-all shadow-sm"
          >
            <HelpCircle className="w-[20px] h-[20px] fill-dge-reliable text-white" />
          </button>
          
          <button 
            onClick={() => onNavigate?.('login')}
            className="hidden lg:flex h-10 px-5 md:h-11 md:px-7 rounded-full bg-gradient-to-r from-dge-tech to-dge-reliable border-none shadow-[0_4px_16px_rgba(6,51,96,0.25)] items-center gap-2 text-white hover:shadow-[0_6px_20px_rgba(6,51,96,0.35)] transition-all transform hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">{t('Sign In', 'تسجيل الدخول')}</span>
          </button>
          
          {/* Hamburger Menu on Mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-dge-reliable bg-white/70 backdrop-blur-md border border-white/60 hover:bg-white hover:shadow-sm transition-all shadow-sm"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>

    <AnimatePresence>
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
                onClick={() => { setIsArabic(!isArabic); setIsMobileMenuOpen(false); }}
                className="p-4 rounded-xl flex items-center justify-between text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{t('Language (English/Arabic)', 'اللغة (العربية/English)')}</span>
                <div className="flex items-center bg-slate-200 p-1 rounded-full w-14 relative">
                  <div className={`absolute start-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isArabic ? 'translate-x-[24px] rtl:-translate-x-[24px]' : 'translate-x-0'}`}></div>
                  <div className="w-6 h-5 flex items-center justify-center text-[9px] z-10 text-dge-reliable">EN</div>
                  <div className="w-6 h-5 flex items-center justify-center text-[11px] z-10 text-dge-reliable">ع</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={() => { onNavigate?.('login'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-dge-tech to-dge-reliable text-white font-bold text-[15px]"
              >
                <LogIn className="w-4 h-4" />
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
