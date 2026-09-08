import React from 'react';
import { motion } from 'framer-motion';
import { 
  List, X, Building2, PlusSquare, GraduationCap, TreePine, 
  Bus, Compass, MapPin, Waves, Droplets, Flame, Check
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const LEGEND_ICON_MAP = {
  GOVERNMENT: Building2,
  MUNICIPAL: Building2,
  PUBLIC: Building2,
  HEALTHCARE: PlusSquare,
  HOSPITAL: PlusSquare,
  EDUCATION: GraduationCap,
  PARK: TreePine,
  ENVIRONMENT: TreePine,
  TRANSPORT: Bus,
  TOURISM: Compass
};

export default function MapLegendPanel({ explorerState, setExplorerState, onClose }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const activeResults = explorerState?.activeResults || [];
  
  // Extract unique categories present in the active result set
  const activeCategories = Array.from(new Set(activeResults.map(r => (r.type || r.facilityType || 'GOVERNMENT').toUpperCase())));
  if (activeCategories.length === 0) {
    activeCategories.push('GOVERNMENT', 'PARK', 'HOSPITAL');
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`absolute top-16 left-14 z-[400] w-76 rounded-3xl p-4 border shadow-2xl backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-[#0b132b]/95 border-slate-700/80 text-white shadow-2xl' 
          : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#063360] via-[#215A9E] to-[#7c3aed] text-white flex items-center justify-center shadow-xs">
            <List className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-tight">
              {t("Active Map Legend", "مفتاح الخريطة النشط")}
            </h3>
            <span className="text-[9.5px] font-bold text-slate-400 block -mt-0.5">
              {t("Matches Active Result Set", "مطابق للنتائج الحالية")}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body: Active Result Categories Symbology */}
      <div className="mt-3.5 space-y-2.5 text-xs">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5">
          {t("ACTIVE LAYERS", "الطبقات النشطة")} ({activeCategories.length})
        </div>

        <div className="grid grid-cols-1 gap-2">
          {activeCategories.map(cat => {
            const Icon = LEGEND_ICON_MAP[cat] || Building2;
            const count = activeResults.filter(r => (r.type || r.facilityType || '').toUpperCase() === cat).length;
            return (
              <div 
                key={cat} 
                className={`flex items-center justify-between p-2 rounded-xl border ${
                  isDarkMode ? 'bg-[#131d35] border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px] ${
                    cat === 'GOVERNMENT' ? 'bg-[#063360]' : cat === 'PARK' ? 'bg-emerald-600' : cat === 'HOSPITAL' ? 'bg-rose-600' : 'bg-blue-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[11px]">
                    {cat}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {count > 0 ? `${count} items` : 'Active'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Location / Route Legend Row */}
        {(explorerState?.selectedLocation || explorerState?.activeRouteDestination) && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5">
              {t("MAP CONTEXT", "سياق الخريطة")}
            </div>
            {explorerState?.selectedLocation && (
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-[10.5px] font-bold text-purple-600 dark:text-purple-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                  <span>{t("Selected Feature", "العنصر المحدد")}</span>
                </div>
                <span>●</span>
              </div>
            )}
            {explorerState?.activeRouteDestination && (
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[10.5px] font-bold text-cyan-600 dark:text-cyan-400">
                <div className="flex items-center gap-1.5">
                  <span>━━</span>
                  <span>{t("Calculated Route", "المسار المكتشف")}</span>
                </div>
                <span>✓</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
