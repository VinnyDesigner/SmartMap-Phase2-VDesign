import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const ACTION_LABEL_MAP = {
  'Compare Water Consumption': 'مقارنة استهلاك المياه',
  'Export Emissions Report': 'تصدير تقرير الانبعاثات',
  'Compare Nearby Facilities': 'مقارنة المنشآت المجاورة',
  'View 12-Month Trend Line': 'عرض خط المسار لـ 12 شهراً',
  'Download Abu Dhabi Report': 'تحميل تقرير أبوظبي الإداري',
  'Show hospitals': 'عرض المستشفيات',
  'Show schools': 'عرض المدارس',
  'Show parks': 'عرض الحدائق العامة',
  'Public parks': 'حدائق عامة',
  'Show emissions': 'عرض الانبعاثات',
  'Undo': 'تراجع'
};

export default function AiActionSuggestions({ actionCards = [], suggestions = [], onActionClick, onSuggestionClick }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  const hasActions = actionCards && actionCards.length > 0;
  const hasSuggestions = suggestions && suggestions.length > 0;

  if (!hasActions && !hasSuggestions) return null;

  return (
    <div className={`space-y-2 pt-2 border-t my-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      {hasActions && (
        <div className="flex flex-wrap gap-1.5">
          {actionCards.map((card, idx) => {
            const cardLabel = isArabic ? (card.label_ar || ACTION_LABEL_MAP[card.label] || card.label) : card.label;
            return (
              <button
                key={idx}
                onClick={() => onActionClick && onActionClick(card)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all shadow-2xs group cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#131b2e] text-white border-slate-700/80 hover:bg-[#1e2a44]' 
                    : 'bg-[#eef3ff] text-[#3D52A0] border-[#3D52A0]/20 hover:bg-[#3D52A0] hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span>{cardLabel}</span>
                <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform rtl:-scale-x-100" />
              </button>
            );
          })}
        </div>
      )}

      {hasSuggestions && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((sug, idx) => {
            const sugLabel = isArabic ? (ACTION_LABEL_MAP[sug] || sug) : sug;
            return (
              <button
                key={idx}
                onClick={() => onSuggestionClick && onSuggestionClick(sug)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#080d1a] text-slate-300 border-slate-800 hover:bg-[#131b2e] hover:text-white' 
                    : 'bg-slate-100 text-slate-700 border-slate-200/60 hover:bg-[#eef3ff] hover:text-[#3D52A0]'
                }`}
              >
                {sugLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
