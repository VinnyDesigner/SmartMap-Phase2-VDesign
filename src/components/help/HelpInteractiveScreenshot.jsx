// src/components/help/HelpInteractiveScreenshot.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ZoomIn, ZoomOut, Compass, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function HelpInteractiveScreenshot({ 
  screenshot, 
  title, 
  onDeepLink,
  deepLinkAction 
}) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  if (!screenshot || !screenshot.url) return null;

  return (
    <div className="space-y-3">
      {/* Main Interactive Screenshot Frame */}
      <div className={`relative rounded-2xl overflow-hidden border transition-all shadow-md group ${
        isDarkMode ? 'bg-[#0a1122] border-slate-700/80' : 'bg-slate-900/5 border-slate-200'
      }`}>
        {/* Top bar with caption & zoom trigger */}
        <div className={`px-4 py-2.5 flex items-center justify-between border-b text-xs ${
          isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-2 font-semibold truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">{t("Actual Application Screenshot", "لقطة شاشة حقيقية من التطبيق")}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] opacity-60">
              {t("Click markers ① ② ③ for details", "انقر على العلامات ① ② ③ للمزيد")}
            </span>
            <button
              onClick={() => {
                setZoomScale(1);
                setIsZoomOpen(true);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 font-bold ${
                isDarkMode 
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-cyan-400' 
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-[#215A9E]'
              }`}
              title={t("Zoom Fullscreen", "تكبير في شاشة كاملة")}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">{t("Zoom", "تكبير")}</span>
            </button>
          </div>
        </div>

        {/* Image Container with Absolute Hotspots */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 overflow-hidden select-none">
          <img 
            src={screenshot.url} 
            alt={title || "Application Screenshot"} 
            className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />

          {/* Interactive Numbered Hotspots */}
          {screenshot.hotspots && screenshot.hotspots.map((spot) => {
            const isSelected = activeHotspot?.id === spot.id;
            return (
              <div
                key={spot.id}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-20"
              >
                <button
                  onClick={() => setActiveHotspot(isSelected ? null : spot)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-lg relative ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-amber-400/40 z-30' 
                      : 'bg-gradient-to-tr from-[#215A9E] to-cyan-500 text-white hover:scale-110 ring-2 ring-white/80'
                  }`}
                  aria-label={`Hotspot ${spot.label}`}
                >
                  <span className="relative z-10">{spot.label}</span>
                  {!isSelected && (
                    <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-30" />
                  )}
                </button>

                {/* Hotspot Floating Tooltip Card */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 sm:w-72 p-3.5 rounded-xl border shadow-2xl z-40 backdrop-blur-md ${
                        isDarkMode 
                          ? 'bg-[#0b1329]/95 border-cyan-500/40 text-slate-100 ring-1 ring-cyan-500/20' 
                          : 'bg-white/95 border-slate-300 text-slate-900 ring-1 ring-black/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-amber-500 dark:text-amber-400">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center font-extrabold text-[11px]">
                            {spot.label}
                          </span>
                          <span>{t(spot.title_en, spot.title_ar)}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(null);
                          }}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {t(spot.desc_en, spot.desc_ar)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Annotation Strip */}
        <div className={`p-3 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
          isDarkMode ? 'bg-[#0a1224] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-500 shrink-0" />
            <p className={`text-xs italic leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t(screenshot.caption_en, screenshot.caption_ar)}
            </p>
          </div>

          {/* Deep link action button */}
          {deepLinkAction && onDeepLink && (
            <button
              onClick={() => onDeepLink(deepLinkAction.target)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#215A9E] to-cyan-600 hover:from-[#1b4b84] hover:to-cyan-500 text-white font-bold text-xs transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
            >
              <span>{t(deepLinkAction.label_en, deepLinkAction.label_ar)}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </button>
          )}
        </div>
      </div>

      {/* Hotspots Reference Legend List */}
      {screenshot.hotspots && screenshot.hotspots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {screenshot.hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
              className={`p-2.5 rounded-xl border text-start flex items-start gap-2.5 transition-all cursor-pointer ${
                activeHotspot?.id === spot.id
                  ? (isDarkMode ? 'bg-[#152347] border-cyan-500 text-cyan-300' : 'bg-blue-50 border-[#215A9E] text-[#215A9E]')
                  : (isDarkMode ? 'bg-[#0d162d] border-slate-800/80 hover:border-slate-700 text-slate-300' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700')
              }`}
            >
              <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                activeHotspot?.id === spot.id
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-gradient-to-tr from-[#215A9E] to-cyan-500 text-white'
              }`}>
                {spot.label}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">{t(spot.title_en, spot.title_ar)}</p>
                <p className="text-[11px] opacity-75 truncate">{t(spot.desc_en, spot.desc_ar)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between text-white pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm sm:text-base">{title || t("Screenshot Inspector", "معاينة لقطة الشاشة")}</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoomScale(prev => Math.max(0.75, prev - 0.25))}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-cyan-400">{Math.round(zoomScale * 100)}%</span>
                <button
                  onClick={() => setZoomScale(prev => Math.min(2.5, prev + 0.25))}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors ml-2 cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Zoomable Image Viewport */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              <div 
                style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 max-w-full max-h-full"
              >
                <img 
                  src={screenshot.url} 
                  alt={title || "Application Screenshot Zoomed"} 
                  className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </div>
            </div>

            {/* Modal Footer Tip */}
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10 shrink-0">
              {t("Use zoom buttons above to inspect granular interface elements and buttons.", "استخدم أزرار التكبير أعلاه لمعاينة تفاصيل الواجهة والأزرار بدقة.")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
