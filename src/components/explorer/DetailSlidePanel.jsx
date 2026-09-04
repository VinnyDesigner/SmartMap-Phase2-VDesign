import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, MapPin, ExternalLink, Mail, Phone, Bookmark, Activity, BookOpen, TreePine, Bus, ShieldAlert, Droplets, Wind, Sparkles, Navigation, Download } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function DetailSlidePanel({ explorerState, setExplorerState }) {
  const detail = explorerState?.selectedDetail;
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  const handleClose = () => {
    setExplorerState(prev => ({ ...prev, selectedDetail: null, selectedLocation: null }));
  };

  const getIcon = (type) => {
    if (type === 'EDUCATION') return <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />;
    if (type === 'HOSPITAL') return <Activity className={`w-6 h-6 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />;
    if (type === 'PARK') return <TreePine className={`w-6 h-6 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />;
    if (type === 'TRANSPORT') return <Bus className={`w-6 h-6 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />;
    return <Activity className={`w-6 h-6 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />;
  };

  const handleAskAi = () => {
    const facilityName = detail?.name || 'this facility';
    setExplorerState(prev => ({
      ...prev,
      pendingQuery: `Why is ${facilityName} marked as high risk and what are its main risk drivers?`,
      selectedDetail: null
    }));
  };

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          initial={{ x: isArabic ? '-100%' : '100%' }}
          animate={{ x: 0 }}
          exit={{ x: isArabic ? '-100%' : '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className={`fixed top-16 bottom-0 ${isArabic ? 'left-0 border-e' : 'right-0 border-s'} w-full sm:w-[420px] backdrop-blur-2xl shadow-2xl pointer-events-auto z-50 overflow-y-auto flex flex-col transition-colors duration-300 ${
            isDarkMode ? 'bg-[#0b132b]/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200/80 text-slate-800'
          }`}
        >
          {/* Top Sticky Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10 shrink-0 ${
            isDarkMode ? 'bg-[#0a1128]/90 border-slate-800' : 'bg-white/90 border-slate-200/60'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {t('Spatial Profile', 'الملف المكاني')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    setExplorerState(prev => {
                      const current = prev.savedLocations || [];
                      const exists = current.some(item => item.id === detail?.id);
                      const updated = exists 
                        ? current.filter(item => item.id !== detail?.id)
                        : [...current, detail];
                      return { ...prev, savedLocations: updated };
                    });
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    (explorerState?.savedLocations || []).some(item => item.id === detail?.id)
                      ? (isDarkMode ? 'bg-[#00e5ff] text-slate-950' : 'bg-[#3D52A0] text-white')
                      : (isDarkMode ? 'text-slate-400 hover:text-[#00e5ff] hover:bg-slate-800' : 'text-slate-400 hover:text-[#3D52A0] hover:bg-slate-100')
                  }`}
                  title={t('Save Location', 'حفظ الموقع')}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              )}
              <button onClick={handleClose} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 sleek-scrollbar">
            {/* Facility Header Block */}
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#1e2e5a] border-slate-700/80' : 'bg-[#eef3ff] border-[#3D52A0]/20'
              }`}>
                {getIcon(detail.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {detail.type}
                  </span>
                  {detail.riskLevel && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      detail.riskLevel === 'Critical' || detail.riskLevel === 'High'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                        : detail.riskLevel === 'Moderate'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    }`}>
                      {detail.riskLevel} {t('Risk', 'خطورة')}
                    </span>
                  )}
                </div>
                <h2 className={`text-base font-bold tracking-tight leading-tight mt-1 ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                  {isArabic && detail.name_ar ? detail.name_ar : detail.name}
                </h2>
                <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isArabic && detail.location_ar ? detail.location_ar : detail.location}
                </p>
              </div>
            </div>

            {/* Ask AI Agent Banner */}
            <div 
              onClick={handleAskAi}
              className={`p-3.5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center justify-between group ${
                isDarkMode 
                  ? 'bg-[#131b2e] border border-slate-700/80 text-white hover:bg-[#1e2a44]' 
                  : 'bg-gradient-to-r from-[#3D52A0] to-[#1e2749] text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-tight">{t('Ask AI Spatial Agent', 'اسأل مساعد الخرائط الذكي')}</h4>
                  <p className="text-[10px] text-blue-100 opacity-90">{t('Analyze risk drivers & spatial factors', 'تحليل عوامل الخطورة والمؤشرات المكانية')}</p>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </div>

            {/* Operational Metrics Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className={`border rounded-xl p-3 flex flex-col ${
                isDarkMode ? 'bg-[#0f1a36]/80 border-slate-700/60' : 'bg-slate-50 border-slate-200/70'
              }`}>
                <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-500" />
                  {t('Risk Score', 'مؤشر الخطورة')}
                </span>
                <span className={`text-lg font-extrabold mt-1 ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                  {detail.riskScore || 75}/100
                </span>
              </div>

              <div className={`border rounded-xl p-3 flex flex-col ${
                isDarkMode ? 'bg-[#0f1a36]/80 border-slate-700/60' : 'bg-slate-50 border-slate-200/70'
              }`}>
                <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  {t('Water Stress', 'استهلاك المياه')}
                </span>
                <span className="text-lg font-extrabold text-[#1e2749] mt-1">
                  {detail.waterConsumption ? `${(detail.waterConsumption / 1000).toFixed(1)}k m³/d` : '9.4k m³/d'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <Wind className="w-3 h-3 text-amber-500" />
                  {t('Emissions', 'الانبعاثات')}
                </span>
                <span className="text-lg font-extrabold text-[#1e2749] mt-1">
                  {detail.emissionsIndex ? `${(detail.emissionsIndex / 1000).toFixed(1)}k tCO₂` : '22k tCO₂'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  {t('Capacity', 'السعة التشغيلية')}
                </span>
                <span className="text-lg font-extrabold text-[#1e2749] mt-1">
                  {detail.capacity ? detail.capacity.toLocaleString() : '350'}
                </span>
              </div>
            </div>

            {/* Risk Drivers List */}
            {detail.riskDrivers && detail.riskDrivers.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 space-y-2">
                <h4 className="text-xs font-bold text-[#1e2749] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  {t('Identified Risk Drivers', 'عوامل الخطورة المحددة')}
                </h4>
                <ul className="space-y-1.5">
                  {detail.riskDrivers.map((driver, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 font-medium flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Follow-up AI Query */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDarkMode ? 'bg-[#121c35] border-purple-500/30' : 'bg-purple-50/70 border-purple-200/80'
            }`}>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Suggested Follow-up AI Query', 'استعلام المتابعة المقترح')}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const followQuery = isArabic 
                    ? `اعرض المدارس القريبة من ${detail.name_ar || detail.name}` 
                    : `Show schools within 2 km of ${detail.name}`;
                  setExplorerState(prev => ({
                    ...prev,
                    pendingQuery: followQuery
                  }));
                }}
                className={`w-full p-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-2 text-start cursor-pointer border shadow-2xs group ${
                  isDarkMode 
                    ? 'bg-[#182645] text-[#00e5ff] border-slate-700/80 hover:bg-[#7c3aed] hover:text-white' 
                    : 'bg-white text-[#215A9E] border-[#215A9E]/20 hover:bg-[#215A9E] hover:text-white'
                }`}
              >
                <span>{isArabic ? `اعرض المدارس القريبة من ${detail.name_ar || detail.name}` : `Show schools within 2 km of ${detail.name}`}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform rtl:-scale-x-100" />
              </button>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => setExplorerState(prev => ({
                  ...prev,
                  mapFocus: { lat: detail.lat, lng: detail.lng, zoom: 17 }
                }))}
                className="flex-1 bg-[#3D52A0] text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#1e2749] transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                {t('Zoom to location', 'التركيز على الخريطة')}
              </button>

              {isLoggedIn && (
                <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
                  <Bookmark className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
