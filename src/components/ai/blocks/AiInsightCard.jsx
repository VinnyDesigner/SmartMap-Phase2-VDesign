import React from 'react';
import { Lightbulb, Target, HelpCircle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiInsightCard({ insightData }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();

  if (!insightData) return null;

  const data = insightData.data || insightData;
  const {
    whatHappened,
    whyItMatters,
    recommendedAction,
    whatHappened_ar,
    whyItMatters_ar,
    recommendedAction_ar
  } = data;

  const displayWhatHappened = isArabic ? (whatHappened_ar || whatHappened) : whatHappened;
  const displayWhyItMatters = isArabic ? (whyItMatters_ar || whyItMatters) : whyItMatters;
  const displayRecommendedAction = isArabic ? (recommendedAction_ar || recommendedAction) : recommendedAction;

  return (
    <div className={`border rounded-2xl p-3.5 my-2.5 space-y-2.5 text-xs shadow-2xs transition-colors ${
      isDarkMode 
        ? 'bg-[#182312]/90 border-amber-500/40 text-amber-100' 
        : 'bg-amber-50/80 border-amber-200/80 text-amber-950'
    }`}>
      <div className={`flex items-center gap-1.5 font-extrabold border-b pb-1.5 uppercase tracking-wider ${
        isDarkMode ? 'text-amber-300 border-amber-500/30' : 'text-amber-950 border-amber-200/60'
      }`}>
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 fill-current" />
        <span>{t('KEY INSIGHT', 'رؤية تحليلية رئيسية')}</span>
      </div>

      {displayWhatHappened && (
        <div className="space-y-0.5">
          <span className={`text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
            <HelpCircle className="w-3 h-3 text-amber-500" />
            {t('WHAT HAPPENED?', 'ماذا حدث؟')}
          </span>
          <p className={`text-[11px] font-medium leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{displayWhatHappened}</p>
        </div>
      )}

      {displayWhyItMatters && (
        <div className={`space-y-0.5 pt-1.5 border-t ${isDarkMode ? 'border-amber-500/20' : 'border-amber-200/40'}`}>
          <span className={`text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
            <ShieldCheck className="w-3 h-3 text-amber-500" />
            {t('WHY IT MATTERS?', 'لماذا هذا مهم؟')}
          </span>
          <p className={`text-[11px] font-medium leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{displayWhyItMatters}</p>
        </div>
      )}

      {displayRecommendedAction && (
        <div className={`space-y-0.5 pt-1.5 border-t ${isDarkMode ? 'border-amber-500/20' : 'border-amber-200/40'}`}>
          <span className={`text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
            <Target className="w-3 h-3 text-emerald-500" />
            {t('WHAT SHOULD YOU DO?', 'ماذا يجب أن تفعل؟')}
          </span>
          <p className={`text-[11px] font-bold leading-relaxed ${isDarkMode ? 'text-emerald-200' : 'text-emerald-950'}`}>{displayRecommendedAction}</p>
        </div>
      )}
    </div>
  );
}
