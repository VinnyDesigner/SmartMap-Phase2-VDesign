import React from 'react';
import { Lightbulb, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiRecommendationCard({ data }) {
  const { isDarkMode } = useTheme();
  const { isArabic } = useLanguage();

  if (!data) return null;

  const {
    title = 'Recommended Action',
    title_ar = 'الإجراء الموصى به',
    recommendations = [],
    priority = 'HIGH',
    impactScore = 'High Impact'
  } = data;

  const displayTitle = isArabic ? (title_ar || title) : title;
  const items = Array.isArray(recommendations) ? recommendations : [recommendations];

  return (
    <div className={`border rounded-2xl p-3.5 my-2.5 shadow-2xs space-y-2.5 transition-colors ${
      isDarkMode ? 'bg-[#121c38] border-amber-500/30' : 'bg-amber-50/40 border-amber-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <Lightbulb className="w-4 h-4 fill-current" />
          <span>{displayTitle}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
            {priority} PRIORITY
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {items.map((item, idx) => {
          const text = typeof item === 'string' ? item : (isArabic ? item.text_ar || item.text : item.text);
          return (
            <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
