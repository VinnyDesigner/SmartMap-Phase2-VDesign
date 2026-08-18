import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, GraduationCap, PlusSquare, TreePine, Bus, LayoutGrid, Mic, Sparkles } from 'lucide-react';
import WebGLTextEffect from './WebGLTextEffect';
import { useTypewriterPlaceholder } from '../hooks/useTypewriter';
import { useLanguage } from '../contexts/LanguageContext';

export default function SearchInterface({ isFocused, setIsFocused, onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const { t, isArabic } = useLanguage();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const placeholderText = useTypewriterPlaceholder(
    isArabic ? [
      'البحث عن الأماكن...',
      'البحث عن مدارس قريبة من جزيرة الريم',
      'اسأل عن أي شيء حول الأماكن أو الخدمات في أبوظبي...'
    ] : [
      'Search places...',
      'Find schools near Al Reem Island',
      'Ask anything about places, services, or data in Abu Dhabi...'
    ]
  );

  const suggestions = [
    { icon: <GraduationCap className="w-4 h-4 text-blue-500" />, text: t("Schools near me", "المدارس القريبة مني") },
    { icon: <PlusSquare className="w-4 h-4 text-red-500" />, text: t("Healthcare facilities", "مرافق الرعاية الصحية") },
    { icon: <TreePine className="w-4 h-4 text-emerald-500" />, text: t("Public parks", "الحدائق العامة") },
    { icon: <Bus className="w-4 h-4 text-amber-500" />, text: t("Transport stops", "مواقف النقل") },
    { icon: <LayoutGrid className="w-4 h-4 text-teal-500" />, text: t("More ideas", "المزيد من الأفكار") }
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none mt-16">
      <motion.div 
        className="search-ui relative w-full max-w-4xl px-4 md:px-6 flex flex-col items-center text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Headlines & Logo */}
        <motion.div 
          className="mb-8 w-full"
          animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -10 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* GeoVision Logo with Clean Gradient */}
          <div className="flex items-center justify-center mb-3 select-none drop-shadow-sm" dir="ltr">
            <span className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#1e2749] to-[#3D52A0]">
              Geo
            </span>
            <span className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-none ms-1 flex items-end bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#00e5ff]">
              Visi
              <div className="relative inline-flex flex-col items-center justify-end mx-1" style={{ width: '0.85em', height: '1.1em' }}>
                <svg viewBox="0 0 24 24" className="w-full h-full text-[#3D52A0] relative z-10" fill="currentColor">
                  <path d="M12 1.5C7.36 1.5 3.5 5.36 3.5 10c0 5.25 8.5 12.5 8.5 12.5s8.5-7.25 8.5-12.5c0-4.64-3.86-8.5-8.5-8.5z" />
                </svg>
                {/* Custom inner arrow pointing top-left */}
                <svg viewBox="0 0 24 24" className="absolute w-[45%] h-[45%] text-white fill-white top-[22%] left-[27%] z-20" style={{ transform: 'rotate(-90deg)' }}>
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                {/* Bottom shadow */}
                <div className="absolute -bottom-[5%] left-1/2 -translate-x-1/2 w-[60%] h-[10%] bg-[#3D52A0]/30 rounded-[100%] blur-[4px] z-0"></div>
              </div>
              n
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-3 mb-2">
            <span className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight">{t('Find.', 'ابحث.')}</span>
            <span className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight">{t('Explore.', 'استكشف.')}</span>
            <span className="text-xl md:text-3xl font-bold text-dge-tech tracking-tight">{t('Understand.', 'افهم.')}</span>
          </div>
          <p className="text-base md:text-xl text-dge-grey font-medium">
            {t("Abu Dhabi's Public Data, At Your Fingertips.", "بيانات أبوظبي العامة، بين يديك.")}
          </p>
        </motion.div>

        {/* The Search Bar Surface */}
        <motion.div 
          className="relative group w-full rounded-full p-[2px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden pointer-events-auto"
          onMouseMove={handleMouseMove}
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? '0 30px 80px rgba(0,0,0,0.1)' 
              : '0 8px 32px rgba(0,0,0,0.04)'
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Base subtle border to give structure */}
          <div className="absolute inset-0 bg-slate-200/40" />
          
          {/* Solar Plasma Energy Ring */}
          <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] z-0 pointer-events-none">
             {/* Plasma Main Trail */}
             <div className="absolute inset-0" 
                  style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(0, 229, 255, 0.1) 50%, rgba(61, 82, 160, 0.4) 70%, rgba(0, 229, 255, 0.8) 85%, rgba(255, 255, 255, 1) 90%, rgba(0, 229, 255, 0.8) 93%, rgba(61, 82, 160, 0.4) 96%, transparent 98%)' }} />
             
             {/* Core Solar Flare (Bulge/Glow) */}
             <div className="absolute inset-0 opacity-90" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 229, 255, 0.4) 80%, rgba(255, 255, 255, 1) 90%, rgba(0, 229, 255, 0.4) 94%, transparent 97%)',
                    filter: 'blur(6px)' 
                  }} />

             {/* Intense Core Center */}
             <div className="absolute inset-0" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 85%, rgba(255, 255, 255, 0.6) 88%, #ffffff 90%, rgba(255, 255, 255, 0.6) 92%, transparent 95%)',
                    filter: 'blur(2px)' 
                  }} />

             {/* Secondary energy wisps/particles */}
             <div className="absolute inset-0" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 82%, rgba(255, 255, 255, 0.8) 82.2%, transparent 82.5%, transparent 85%, rgba(0, 229, 255, 0.9) 85.2%, transparent 85.5%, transparent 94%, rgba(0, 229, 255, 0.8) 94.2%, transparent 94.5%)',
                    filter: 'blur(1px)'
                  }} />
          </div>

          <div className="relative flex items-center px-3 py-3 w-full bg-white/95 backdrop-blur-2xl rounded-full z-10"
               style={{ backgroundColor: isFocused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.95)' }}
          >
            {/* Left Search Icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-dge-tech flex items-center justify-center text-white shadow-sm ms-1 relative overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
            </div>
            
            <input 
              type="text"
              placeholder={placeholderText}
              className="flex-1 bg-transparent border-none outline-none px-3 md:px-5 text-dge-reliable placeholder-dge-grey/70 font-medium text-base md:text-lg w-full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearch) {
                  onSearch(searchValue);
                }
              }}
            />
            
            {/* Right Action Button */}
            <div className="flex items-center gap-1 pe-1">
              <button 
                type="button" 
                className="hidden sm:flex w-10 h-10 items-center justify-center text-slate-400 hover:text-dge-tech hover:bg-slate-50 transition-colors rounded-full"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onSearch && onSearch(searchValue)}
                className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-dge-tech flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 shadow-sm relative overflow-hidden group/action"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/action:translate-y-0 transition-transform duration-300" />
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 rtl:-scale-x-100" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Suggestion Pills */}
        <motion.div 
          className="mt-6 flex flex-wrap items-center gap-2 md:gap-4 justify-center pointer-events-auto"
          animate={{ opacity: isFocused ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="hidden md:inline text-sm font-medium text-dge-grey me-2">{t('Try searching:', 'جرب البحث عن:')}</span>
          {suggestions.map((item, i) => (
            <button 
              key={i}
              onClick={() => onSearch && onSearch(item.text)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-dge-reliable">{item.text}</span>
            </button>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}
