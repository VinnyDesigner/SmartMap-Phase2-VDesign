import React from 'react';
import { ShieldCheck, CheckCircle2, Database, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiDataQualityCard({ data }) {
  const { isDarkMode } = useTheme();
  const { isArabic } = useLanguage();

  if (!data) return null;

  const {
    score = 98,
    label = 'Verified High Precision',
    label_ar = 'دقة مكانية مؤكدة',
    spatialCrs = 'WGS84 EPSG:4326',
    geometryStatus = 'Verified Geometry',
    lastUpdated = '2026-09-09',
    datasets = ['DGE Spatial SDI 2026', 'Government Facilities Layer v2.1']
  } = data;

  return (
    <div className={`border rounded-2xl p-3 my-2.5 shadow-2xs space-y-2 transition-colors ${
      isDarkMode ? 'bg-[#0e172e] border-slate-700/80' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4" />
          <span>{isArabic ? 'مؤشر جودة البيانات المكانية' : 'DATA QUALITY SCORE'}</span>
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-500 font-extrabold border border-emerald-500/20">
          {score}/100
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
        <div className="p-2 rounded-xl bg-white dark:bg-[#18274d] border border-slate-200 dark:border-slate-700">
          <span className="text-slate-400 block font-bold uppercase">{isArabic ? 'النظام المرجعي' : 'Spatial CRS'}</span>
          <span className="font-semibold text-slate-800 dark:text-white mt-0.5 block">{spatialCrs}</span>
        </div>

        <div className="p-2 rounded-xl bg-white dark:bg-[#18274d] border border-slate-200 dark:border-slate-700">
          <span className="text-slate-400 block font-bold uppercase">{isArabic ? 'حالة الهندسة' : 'Geometry Status'}</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{geometryStatus}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
