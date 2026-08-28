import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Droplets, Zap, ShieldAlert, Building } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const ICON_MAP = {
  facilities: Building,
  risk: ShieldAlert,
  emissions: Zap,
  water: Droplets,
  alerts: AlertTriangle,
  activity: Activity
};

const KPI_LABEL_MAP = {
  'Composite Risk': 'مؤشر الخطورة المركب',
  'Tidal Inundation': 'خطر الغمر البحري',
  'Aquifer Drawdown': 'استنزاف المياه الجوفية',
  'Compound Penalty': 'عقوبة التراكم المركب',
  'Mussafah Emissions': 'انبعاثات مصفح',
  'KIZAD Emissions': 'انبعاثات كيزاد',
  'Emissions Variance': 'فارق الانبعاثات',
  'Primary Sector': 'القطاع الرئيسي',
  'Peak Month': 'الشهر الأعلى خطورة',
  'Lowest Month': 'الشهر الأقل خطورة',
  '12-M Average': 'متوسط الـ 12 شهراً',
  '12-M Delta': 'تغير الـ 12 شهراً',
  'Target Site': 'الموقع المستهدف',
  'Nearest Asset': 'أقرب منشأة',
  'Proximity Distance': 'مسافة القرب'
};

export default function AiKpiGrid({ metrics }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 my-2.5">
      {metrics.map((item, idx) => {
        const IconComponent = ICON_MAP[item.iconType] || Activity;
        const itemLabel = isArabic ? (item.label_ar || KPI_LABEL_MAP[item.label] || item.label) : item.label;
        return (
          <div key={idx} className={`border rounded-xl p-2.5 flex flex-col justify-between shadow-2xs transition-all ${
            isDarkMode 
              ? 'bg-[#0d1527] border-slate-800 text-slate-100 hover:border-slate-700' 
              : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:border-[#3D52A0]/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{itemLabel}</span>
              <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#1e293b] border-slate-700/60 text-sky-300' : 'bg-white border-slate-200/60 text-[#3D52A0]'
              }`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>
            
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`text-base font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>{item.value}</span>
              {item.change && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${item.change.startsWith('+') || item.changeType === 'increase' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {item.change.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </span>
              )}
            </div>
            
            {item.subtext && (
              <span className="text-[9px] font-medium text-slate-400 mt-0.5 truncate">{item.subtext}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
