import React from 'react';
import { motion } from 'framer-motion';
import { 
  List, X, ShieldAlert, PlusSquare, GraduationCap, TreePine, 
  Bus, MapPin, Waves, Droplets, Flame, Check, Layers
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function MapLegendPanel({ explorerState, setExplorerState, onClose }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const showFloodZones = explorerState?.showFloodZones !== false;
  const showWaterStress = explorerState?.showWaterStress !== false;
  const showEmissionsHeatmap = explorerState?.showEmissionsHeatmap || false;

  const toggleLayer = (layerKey) => {
    setExplorerState(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`absolute top-16 left-14 z-[400] w-80 rounded-3xl p-4 sm:p-5 border shadow-2xl backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-[#0b132b]/95 border-slate-700/80 text-white shadow-[0_15px_40px_rgba(0,0,0,0.8)]' 
          : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-[0_15px_40px_rgba(33,90,158,0.18)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#215A9E] to-[#7c3aed] text-white flex items-center justify-center shadow-xs">
            <List className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-tight">
              {t("Map Legend & Symbology", "مفتاح الخريطة والرموز")}
            </h3>
            <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-400 block -mt-0.5">
              {t("DGE Spatial Layers 2026", "الطبقات المكانية الرسمية")}
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

      {/* Body: Facility Categories Symbology */}
      <div className="mt-3.5 space-y-3 text-xs">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5">
          {t("Facility Categories", "فئات المنشآت والخطورة")}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Healthcare Critical / High */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-rose-500/20 bg-rose-500/5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                <PlusSquare className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[11px] text-rose-600 dark:text-rose-400">
                {t("Critical Risk Healthcare (SSMC)", "رعاية صحية - خطورة حرجة")}
              </span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>

          {/* Healthcare Normal */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                <PlusSquare className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-300">
                {t("Normal Healthcare Facilities", "منشآت رعاية صحية اعتيادية")}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          {/* Education */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[11px] text-indigo-700 dark:text-indigo-300">
                {t("Schools & Universities", "المدارس والجامعات")}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>

          {/* Parks & Reserves */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-teal-500/20 bg-teal-500/5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                <TreePine className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[11px] text-teal-700 dark:text-teal-300">
                {t("Public Parks & Protected Reserves", "الحدائق والمحميات")}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>

          {/* Transport */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                <Bus className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[11px] text-purple-700 dark:text-purple-300">
                {t("Transit Hubs & Airports", "محطات الحافلات والمطارات")}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
        </div>

        {/* Spatial Hazard Layer Toggles */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5">
            {t("Spatial Risk Overlays", "طبقات المخاطر الجغرافية")}
          </div>

          {/* Flood Zone Toggle */}
          <button
            onClick={() => toggleLayer('showFloodZones')}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
              showFloodZones 
                ? (isDarkMode ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-cyan-50 border-cyan-300 text-cyan-900') 
                : (isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500')
            }`}
          >
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-500" />
              <span className="font-bold text-[11px]">
                {t("Coastal Flood Surge Zone", "نطاق فيضانات السواحل")}
              </span>
            </div>
            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
              showFloodZones ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-400'
            }`}>
              {showFloodZones && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Groundwater Stress Toggle */}
          <button
            onClick={() => toggleLayer('showWaterStress')}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
              showWaterStress 
                ? (isDarkMode ? 'bg-blue-950/40 border-blue-500/50 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-900') 
                : (isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500')
            }`}
          >
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-[11px]">
                {t("Groundwater Stress Basin", "أحواض إجهاد المياه الجوفية")}
              </span>
            </div>
            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
              showWaterStress ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-400'
            }`}>
              {showWaterStress && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Emissions Heatmap Toggle */}
          <button
            onClick={() => toggleLayer('showEmissionsHeatmap')}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
              showEmissionsHeatmap 
                ? (isDarkMode ? 'bg-amber-950/40 border-amber-500/50 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900') 
                : (isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500')
            }`}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-[11px]">
                {t("Operational Emissions Heatmap", "خريطة الانبعاثات التفاعلية")}
              </span>
            </div>
            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
              showEmissionsHeatmap ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-400'
            }`}>
              {showEmissionsHeatmap && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
