import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Trees, GraduationCap, Building2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export default function HoverExplorationPopup({ x, y, areaContext, onExplore }) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const getIcon = (type) => {
    switch(type) {
      case 'parks': return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'transport': return <Navigation className="w-3.5 h-3.5 text-amber-400" />;
      case 'education': return <GraduationCap className="w-3.5 h-3.5 text-blue-400" />;
      case 'health': return <Building2 className="w-3.5 h-3.5 text-rose-400" />;
      default: return <MapPin className="w-3.5 h-3.5 text-[#00e5ff]" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'parks': return 'bg-emerald-500/20';
      case 'transport': return 'bg-amber-500/20';
      case 'education': return 'bg-blue-500/20';
      case 'health': return 'bg-rose-500/20';
      default: return 'bg-cyan-500/20';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute z-[90] idle-popup pointer-events-auto p-4 -m-4"
        style={{ 
          left: Math.max(20, Math.min(x - 130, window.innerWidth - 300)), 
          top: Math.max(20, y - 240) 
        }}
      >
        <div className="relative p-[1.5px] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden group">
          {/* Animated Shiny Stroke Layer */}
          <div className="absolute aspect-square w-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] z-0 opacity-70"
               style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(0, 229, 255, 0.5) 60%, #00e5ff 85%, transparent 100%)' }} 
          />
          
          {/* Inner Content Layer */}
          <div className={`relative z-10 w-[300px] backdrop-blur-3xl rounded-[calc(1.5rem-1px)] p-5 flex flex-col gap-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-[#0f1a36]/95 text-white' : 'bg-white/95 text-slate-800'
          }`}>
            <div className={`flex items-center gap-2 border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />
              <h4 className={`text-[17px] font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#3D52A0]'}`}>
                {areaContext?.areaName || t('Explore this area', 'استكشف هذه المنطقة')}
              </h4>
            </div>
            
            {areaContext?.description && (
              <div className="flex flex-col gap-1.5 mb-1">
                <p className={`text-[13px] font-bold leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {areaContext.description.split('\n')[0]}
                </p>
                <p className={`text-[12px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {areaContext.description.split('\n')[1]}
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {areaContext?.highlights?.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => onExplore(item.type, item.id)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-[14px] transition-all text-left group/btn w-full border ${
                    isDarkMode 
                      ? 'bg-[#0d1424] hover:bg-[#162035] border-slate-800/80 hover:border-slate-700' 
                      : 'bg-white/50 hover:bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-full ${getBgColor(item.type)} flex items-center justify-center group-hover/btn:scale-110 transition-transform shrink-0 shadow-sm`}>
                      {getIcon(item.type)}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-bold tracking-tight leading-snug ${
                        isDarkMode ? 'text-white group-hover/btn:text-[#c084fc]' : 'text-[#3D52A0]'
                      }`}>{item.name}</span>
                      {item.tagline && (
                        <span className="text-[11px] font-medium text-slate-400 tracking-tight mt-0.5">{item.tagline}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-[#c084fc] transition-colors shrink-0 group-hover/btn:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Pointer triangle */}
        <div className={`absolute left-[calc(50%-8px)] bottom-[-8px] w-4 h-4 rotate-45 rounded-sm z-[-1] ${
          isDarkMode ? 'bg-[#080d1a] border-r border-b border-slate-800' : 'bg-white border-r border-b border-gray-100'
        }`} />
      </motion.div>
    </AnimatePresence>
  );
}
