import React from 'react';
import { ArrowUpRight, ArrowDownRight, MapPin, Scale, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiComparisonBlock({ data, onEntityClick }) {
  const { isDarkMode } = useTheme();
  const { isArabic } = useLanguage();

  if (!data) return null;

  const {
    title,
    title_ar,
    primaryEntity = {},
    secondaryEntity = {},
    difference = null,
    percentageChange = null,
    metrics = [],
    proximityList = []
  } = data;

  const displayTitle = isArabic ? (title_ar || title || 'مقارنة التحليلات') : (title || 'Analytics Comparison');
  const primName = isArabic ? (primaryEntity.name_ar || primaryEntity.name) : primaryEntity.name;
  const secName = isArabic ? (secondaryEntity.name_ar || secondaryEntity.name) : secondaryEntity.name;

  return (
    <div className={`border rounded-2xl p-3.5 my-2.5 shadow-2xs space-y-3 transition-colors ${
      isDarkMode ? 'bg-[#132042] border-slate-700/80' : 'bg-slate-50 border-slate-200/90'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3D52A0] dark:text-[#00e5ff]">
          <Scale className="w-3.5 h-3.5" />
          <span>{displayTitle}</span>
        </div>
        {percentageChange && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
            percentageChange.startsWith('+') || percentageChange.includes('higher')
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
          }`}>
            {percentageChange.includes('higher') || percentageChange.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{percentageChange}</span>
          </span>
        )}
      </div>

      {/* Side by side primary comparison cards */}
      {(primaryEntity.name || secondaryEntity.name) && (
        <div className="grid grid-cols-2 gap-2">
          <div 
            onClick={() => onEntityClick && primaryEntity.facility && onEntityClick(primaryEntity.facility)}
            className={`p-3 rounded-xl border text-center transition-all ${
              onEntityClick ? 'cursor-pointer hover:border-[#3D52A0] dark:hover:border-[#00e5ff]' : ''
            } ${isDarkMode ? 'bg-[#18274d] border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <span className="text-[10px] font-bold text-slate-400 block truncate">{primName}</span>
            <div className="text-sm font-extrabold mt-1 text-slate-800 dark:text-white">
              {primaryEntity.value} <span className="text-[10px] font-semibold text-slate-400">{primaryEntity.unit || ''}</span>
            </div>
          </div>

          <div 
            onClick={() => onEntityClick && secondaryEntity.facility && onEntityClick(secondaryEntity.facility)}
            className={`p-3 rounded-xl border text-center transition-all ${
              onEntityClick ? 'cursor-pointer hover:border-[#3D52A0] dark:hover:border-[#00e5ff]' : ''
            } ${isDarkMode ? 'bg-[#18274d] border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <span className="text-[10px] font-bold text-slate-400 block truncate">{secName}</span>
            <div className="text-sm font-extrabold mt-1 text-slate-800 dark:text-white">
              {secondaryEntity.value} <span className="text-[10px] font-semibold text-slate-400">{secondaryEntity.unit || ''}</span>
            </div>
          </div>
        </div>
      )}

      {/* Difference pill */}
      {difference && (
        <div className="text-center bg-slate-200/50 dark:bg-slate-800/50 py-1.5 px-3 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          {isArabic ? `الفارق: ` : `Difference: `}
          <strong className="text-slate-900 dark:text-white font-bold">{difference}</strong>
        </div>
      )}

      {/* Additional metric comparative rows */}
      {metrics.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-100/70 dark:bg-[#18274d]/70">
              <span className="font-semibold text-slate-600 dark:text-slate-400">{isArabic && m.label_ar ? m.label_ar : m.label}</span>
              <div className="flex items-center gap-3 font-bold text-slate-800 dark:text-white">
                <span className="text-[#3D52A0] dark:text-[#00e5ff]">{m.val1}</span>
                <span className="text-slate-400 text-[10px]">vs</span>
                <span className="text-purple-600 dark:text-purple-400">{m.val2}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proximity Distance List */}
      {proximityList.length > 0 && (
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            {isArabic ? 'قائمة المنشآت القريبة المسافة:' : 'PROXIMITY NEIGHBORS (GEODESIC DISTANCE):'}
          </span>
          {proximityList.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onEntityClick && onEntityClick(item.facility || item)}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#18274d] border-slate-700/80 hover:border-[#00e5ff] text-slate-200' 
                  : 'bg-white border-slate-200 hover:border-[#3D52A0] text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#3D52A0] dark:text-[#00e5ff] shrink-0" />
                <span className="truncate">{isArabic && item.name_ar ? item.name_ar : item.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ms-2">
                <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.distanceKm || item.distance} {isArabic ? 'كم' : 'km'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
