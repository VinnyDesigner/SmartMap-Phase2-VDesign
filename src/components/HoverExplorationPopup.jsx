import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Trees, GraduationCap, Building2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HoverExplorationPopup({ x, y, areaContext, onExplore }) {
  const { t } = useLanguage();
  const getIcon = (type) => {
    switch(type) {
      case 'parks': return <Trees className="w-3.5 h-3.5 text-green-600" />;
      case 'transport': return <Navigation className="w-3.5 h-3.5 text-orange-600" />;
      case 'education': return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
      case 'health': return <Building2 className="w-3.5 h-3.5 text-red-600" />;
      default: return <MapPin className="w-3.5 h-3.5 text-dge-tech" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'parks': return 'bg-green-500/10';
      case 'transport': return 'bg-orange-500/10';
      case 'education': return 'bg-blue-500/10';
      case 'health': return 'bg-red-500/10';
      default: return 'bg-dge-tech/10';
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
        <div className="relative p-[1.5px] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] overflow-hidden group">
          {/* Animated Shiny Stroke Layer - forced square for perfectly smooth rotation */}
          <div className="absolute aspect-square w-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] z-0 opacity-70"
               style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(61, 82, 160, 0.5) 60%, #00e5ff 85%, transparent 100%)' }} 
          />
          
          {/* Inner Content Layer */}
          <div className="relative z-10 w-[300px] bg-white/95 backdrop-blur-3xl rounded-[calc(1.5rem-1px)] p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-[#3D52A0]" />
              <h4 className="text-[17px] font-black text-[#3D52A0] tracking-tight">{areaContext?.areaName || t('Explore this area', 'استكشف هذه المنطقة')}</h4>
            </div>
            
            {areaContext?.description && (
              <div className="flex flex-col gap-1.5 mb-1">
                <p className="text-[13px] font-bold text-slate-800 leading-tight">
                  {areaContext.description.split('\n')[0]}
                </p>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  {areaContext.description.split('\n')[1]}
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {areaContext?.highlights?.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => onExplore(item.type, item.id)}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm rounded-[14px] transition-all text-left group/btn w-full"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-full ${getBgColor(item.type)} flex items-center justify-center group-hover/btn:scale-110 transition-transform shrink-0 shadow-sm`}>
                      {getIcon(item.type)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#3D52A0] tracking-tight leading-snug">{item.name}</span>
                      {item.tagline && (
                        <span className="text-[11px] font-medium text-slate-500 tracking-tight mt-0.5">{item.tagline}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover/btn:text-[#00e5ff] transition-colors shrink-0 group-hover/btn:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Subtle pointer triangle */}
        {/* Subtle pointer triangle */}
        <div className="absolute left-[calc(50%-8px)] bottom-[-8px] w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45 rounded-sm z-[-1]" />
      </motion.div>
    </AnimatePresence>
  );
}
