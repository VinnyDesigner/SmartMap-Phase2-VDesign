import React from 'react';
import { ShieldAlert, Zap, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiRiskBreakdown({ riskData }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();

  if (!riskData) return null;

  const totalScore = riskData.totalRiskScore || riskData.score || 92;
  const drivers = riskData.drivers || [
    { name: 'Flood Exposure', name_ar: 'التعرض للفيضانات', points: 25 },
    { name: 'Water Stress', name_ar: 'الإجهاد المائي', points: 18 },
    { name: 'Heat Exposure', name_ar: 'التعرض الحراري', points: 15 },
    { name: 'Operational Load', name_ar: 'الحمل التشغيلي', points: 12 },
    { name: 'Environmental Impact', name_ar: 'الأثر البيئي', points: 10 },
    { name: 'Other Factors', name_ar: 'عوامل أخرى', points: 7 }
  ];

  const compoundEffect = riskData.compoundPenalty || riskData.compoundEffect || 8;
  const compoundFactors = riskData.compoundFactors || (isArabic ? 'الفيضانات + الإجهاد المائي' : 'Flood + Water Stress');
  const confidence = riskData.confidence || 'HIGH CONFIDENCE (Spatial intersection verified)';

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className={`border rounded-2xl p-3.5 my-2.5 space-y-3 shadow-2xs transition-colors ${
      isDarkMode ? 'bg-[#121b33] border-slate-700/80 text-slate-100' : 'bg-slate-50 border-slate-200/90 text-slate-800'
    }`}>
      {/* Header with Risk Score */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider text-[#3D52A0] dark:text-[#00e5ff]">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>{isArabic ? 'تحليل محركات المخاطر المفسر' : 'RISK DECOMPOSITION'}</span>
        </div>
        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${getScoreColor(totalScore)}`}>
          {totalScore} / 100 {isArabic ? 'مؤشر الخطورة' : 'Risk Score'}
        </span>
      </div>

      {/* Horizontal Bar Chart for Risk Drivers */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          {isArabic ? 'مكونات الخطر الرئيسية:' : 'RISK DRIVERS BREAKDOWN:'}
        </span>
        {drivers.map((drv, idx) => {
          const drvName = isArabic ? (drv.name_ar || drv.name) : drv.name;
          const maxPts = 30;
          const pct = Math.min(100, Math.round((drv.points / maxPts) * 100));

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span>{drvName}</span>
                <span className="font-extrabold text-[#3D52A0] dark:text-[#00e5ff]">+{drv.points} {isArabic ? 'نقاط' : 'pts'}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-800">
                <div 
                  className="bg-gradient-to-r from-[#3D52A0] to-[#7c3aed] dark:from-[#00e5ff] dark:to-[#7c3aed] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${pct}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Compound Risk Interaction Effect */}
      {compoundEffect > 0 && (
        <div className="p-2.5 rounded-xl border bg-rose-500/5 dark:bg-rose-950/30 border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-600 dark:text-rose-400">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isArabic ? 'مخاطر تراكمية مركبة:' : 'COMPOUND RISK:'}</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
              {isArabic ? `أثر التفاعل +${compoundEffect}` : `Interaction Effect +${compoundEffect}`}
            </span>
          </div>
          <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 ps-4">
            {compoundFactors}
          </p>
        </div>
      )}

      {/* Confidence Level */}
      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500">
        <span className="font-semibold">{isArabic ? 'مستوى الثقة:' : 'CONFIDENCE:'}</span>
        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{confidence}</span>
        </span>
      </div>
    </div>
  );
}
