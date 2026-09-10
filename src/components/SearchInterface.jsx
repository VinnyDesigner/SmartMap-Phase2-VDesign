import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Landmark, Zap, TreePine, Bus, LayoutGrid, Sparkles, Palmtree, Building2, MapPin, Factory } from 'lucide-react';
import WebGLTextEffect from './WebGLTextEffect';
import GeoVisionLogoText from './common/GeoVisionLogoText';
import { useTypewriterPlaceholder } from '../hooks/useTypewriter';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProject } from '../contexts/ProjectContext';

export default function SearchInterface({ isFocused, setIsFocused, onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const placeholderText = useTypewriterPlaceholder(
    isArabic ? [
      `البحث في مشروع ${activeProject.name_ar}...`,
      ...activeProject.searchSuggestions_ar,
      `اسأل عن أي شيء يتعلق بـ ${activeProject.name_ar}...`
    ] : [
      `Search ${activeProject.name}...`,
      ...activeProject.searchSuggestions,
      `Ask anything about ${activeProject.name}...`
    ]
  );

  const suggestions = (isArabic ? activeProject.searchSuggestions_ar : activeProject.searchSuggestions).map((text, idx) => {
    const icons = [
      <Landmark key={idx} className="w-4 h-4 text-purple-500" />,
      <Sparkles key={idx} className="w-4 h-4 text-blue-500" />,
      <Zap key={idx} className="w-4 h-4 text-amber-500" />,
      <Bus key={idx} className="w-4 h-4 text-emerald-500" />
    ];
    return { icon: icons[idx % icons.length], text };
  });


  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none mt-16 overflow-y-auto py-12">
      <motion.div 
        className="search-ui relative w-full max-w-5xl px-4 md:px-6 flex flex-col items-center text-center my-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Headlines & Logo */}
        <motion.div 
          className="mb-8 w-full"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* GeoVision Logo with Animated Looping Geo Icon SVG replacing 'o' in Geo */}
          <div className="flex items-center justify-center mb-3 select-none drop-shadow-sm" dir="ltr">
            <GeoVisionLogoText sizeClass="text-6xl md:text-[5.5rem]" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-3 mb-2">
            <span className={`text-xl md:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>{t('Search.', 'ابحث.')}</span>
            <span className={`text-xl md:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-slate-200 drop-shadow-md' : 'text-slate-800'}`}>{t('Discover.', 'استكشف.')}</span>
            <span className={`text-xl md:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-slate-200 drop-shadow-md' : 'text-slate-800'}`}>{t('Analyze.', 'حلل.')}</span>
            <span className={`text-xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-[#c084fc] drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]' : 'text-[#7c3aed]'}`}>{t('Decide.', 'قرر.')}</span>
          </div>
          <p className={`text-base md:text-xl font-medium ${isDarkMode ? 'text-slate-300 drop-shadow-md' : 'text-dge-grey'}`}>
            {t("Explore Abu Dhabi Through Spatial Intelligence", "استكشف أبوظبي عبر الذكاء الجغرافي المكاني")}
          </p>
        </motion.div>

        {/* The Search Bar Surface */}
        <motion.div 
          className="relative group w-full max-w-4xl rounded-full p-[2px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden pointer-events-auto"
          onMouseMove={handleMouseMove}
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? (isDarkMode ? '0 30px 90px rgba(168,85,247,0.3)' : '0 30px 80px rgba(0,0,0,0.1)') 
              : (isDarkMode ? '0 12px 40px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.04)')
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Base subtle border to give structure */}
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-700/60' : 'bg-slate-200/40'}`} />
          
          {/* Solar Plasma Energy Ring */}
          <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] z-0 pointer-events-none">
             {/* Plasma Main Trail */}
             <div className="absolute inset-0" 
                  style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(168, 85, 247, 0.1) 50%, rgba(61, 82, 160, 0.4) 70%, rgba(168, 85, 247, 0.8) 85%, rgba(255, 255, 255, 1) 90%, rgba(168, 85, 247, 0.8) 93%, rgba(61, 82, 160, 0.4) 96%, transparent 98%)' }} />
             
             {/* Core Solar Flare (Bulge/Glow) */}
             <div className="absolute inset-0 opacity-90" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 70%, rgba(168, 85, 247, 0.4) 80%, rgba(255, 255, 255, 1) 90%, rgba(168, 85, 247, 0.4) 94%, transparent 97%)',
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
                    background: 'conic-gradient(from 0deg, transparent 82%, rgba(255, 255, 255, 0.8) 82.2%, transparent 82.5%, transparent 85%, rgba(168, 85, 247, 0.9) 85.2%, transparent 85.5%, transparent 94%, rgba(168, 85, 247, 0.8) 94.2%, transparent 94.5%)',
                    filter: 'blur(1px)'
                  }} />
          </div>

          <div className={`relative flex items-center px-3 py-3 w-full backdrop-blur-2xl rounded-full z-10 transition-colors ${
            isDarkMode 
              ? (isFocused ? 'bg-[#0b152c] border border-[#c084fc]/50' : 'bg-[#0b152c]/90 border border-slate-700/70') 
              : (isFocused ? 'bg-white' : 'bg-white/95')
          }`}>
            {/* Left Search Icon (Clean icon without circle background) */}
            <div className="ps-3 md:ps-4 pe-1 flex items-center justify-center shrink-0">
              <Search className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-purple-400' : 'text-[#7c3aed]'}`} />
            </div>
            
            <input 
              type="text"
              placeholder={t("Ask a location question...", "اسأل سؤالاً مكانياً...")}
              className={`flex-1 bg-transparent border-none outline-none px-3 md:px-5 font-medium text-base md:text-lg w-full ${
                isDarkMode ? 'text-white placeholder-slate-400' : 'text-dge-reliable placeholder-dge-grey/70'
              }`}
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
                onClick={() => onSearch && onSearch(searchValue)}
                className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 shadow-md relative overflow-hidden group/action ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#215A9E] shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
                    : 'bg-dge-tech'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/action:translate-y-0 transition-transform duration-300" />
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 rtl:-scale-x-100" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Explore by Theme Section (Wireframe Page 1) */}
        <motion.div 
          className="mt-8 w-full pointer-events-auto"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className={`text-xs md:text-sm font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-[#063360]'}`}>
              {t("Explore by Theme", "استكشف حسب الموضوعات")}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                icon: Palmtree,
                title_en: "Tourism & Culture",
                title_ar: "السياحة والثقافة",
                query: "Show tourism & culture attractions in Abu Dhabi",
                color: "text-purple-500 dark:text-purple-400"
              },
              {
                icon: Landmark,
                title_en: "Government Services",
                title_ar: "الخدمات الحكومية",
                query: "Show government facilities near me",
                color: "text-blue-600 dark:text-blue-400"
              },
              {
                icon: Building2,
                title_en: "Infrastructure",
                title_ar: "البنية التحتية",
                query: "Show civic infrastructure datasets",
                color: "text-indigo-600 dark:text-indigo-400"
              },
              {
                icon: Bus,
                title_en: "Mobility & Transport",
                title_ar: "النقل والمواصلات",
                query: "Show transit and transport stations",
                color: "text-emerald-600 dark:text-emerald-400"
              },
              {
                icon: MapPin,
                title_en: "Parks & Public Spaces",
                title_ar: "الحدائق والأماكن العامة",
                query: "Find parks in Yas Island",
                color: "text-amber-500 dark:text-amber-400"
              },
              {
                icon: Factory,
                title_en: "Manufacturing & Industry",
                title_ar: "التصنيع والصناعة",
                query: "Show manufacturing and industrial zones",
                color: "text-rose-500 dark:text-rose-400"
              }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSearch && onSearch(item.query)}
                className={`p-3.5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center text-center gap-2 cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-[#0b1730]/90 border-slate-800 hover:border-[#00e5ff]/60 hover:bg-[#112347] text-white shadow-md' 
                    : 'bg-white/95 border-slate-200/90 hover:border-[#215A9E]/60 hover:bg-white text-slate-800 shadow-xs'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-[#15274d]' : 'bg-blue-50'}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-xs font-bold leading-tight">{t(item.title_en, item.title_ar)}</span>
              </button>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
