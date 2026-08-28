import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiRiskBreakdown({ riskData }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  if (!riskData || !riskData.drivers) return null;

  return (
    <div className={`border rounded-xl p-3 my-2.5 space-y-2.5 shadow-2xs ${
      isDarkMode 
        ? 'bg-[#0d1527] border-slate-800 text-slate-100' 
        : 'bg-[#fcfafd] border-purple-200/80 text-purple-950'
    }`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 font-bold text-xs ${isDarkMode ? 'text-slate-200' : 'text-purple-950'}`}>
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span>{t('Explainable Risk Decomposition', 'تفصيل وتحليل عناصر المخاطر المفسر')}</span>
        </div>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
          isDarkMode 
            ? 'text-slate-300 bg-slate-800 border-slate-700' 
            : 'text-purple-800 bg-purple-100 border-purple-200'
        }`}>
          {riskData.totalRiskScore}/100 {t('Risk Score', 'مؤشر الخطورة')}
        </span>
      </div>

      <div className="space-y-2">
        {riskData.drivers.map((drv, idx) => (
          <div key={idx} className="space-y-1">
            <div className={`flex justify-between text-[10px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>{isArabic ? (drv.name_ar || drv.name) : drv.name}</span>
              <span className={`font-bold ${isDarkMode ? 'text-sky-300' : 'text-purple-800'}`}>+{drv.points} {t('pts', 'نقاط')}</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/80'}`}>
              <div 
                className="bg-gradient-to-r from-slate-600 to-sky-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (drv.points / 30) * 100)}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {riskData.compoundPenalty > 0 && (
        <div className={`pt-2 border-t flex items-center justify-between text-[10px] font-semibold ${
          isDarkMode ? 'border-purple-500/30 text-purple-300' : 'border-purple-200/60 text-purple-900'
        }`}>
          <span>Compound Interaction Effect:</span>
          <span className={`px-2 py-0.5 rounded font-mono font-bold ${
            isDarkMode ? 'bg-rose-950/80 text-rose-300' : 'bg-rose-100 text-rose-700'
          }`}>
            +{riskData.compoundPenalty} pts Penalty
          </span>
        </div>
      )}
    </div>
  );
}
