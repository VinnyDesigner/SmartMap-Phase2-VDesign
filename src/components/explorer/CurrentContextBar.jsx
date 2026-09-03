import React from 'react';
import { MapPin, Layers, Filter, Compass, X, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function CurrentContextBar({ activeContextTags, onRemoveTag, onClearAllContext }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  if (!activeContextTags || activeContextTags.length === 0) return null;

  return (
    <div 
      className={`px-3 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto text-[11px] shrink-0 transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0a1226]/95 border-slate-800/90 text-slate-200' : 'bg-slate-50/95 border-slate-200/90 text-slate-800'
      }`}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto sleek-scrollbar flex-1 py-0.5">
        <span className="font-bold text-[10px] uppercase tracking-wider opacity-75 shrink-0 me-1 flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#3D52A0] dark:text-[#00e5ff]" />
          <span>{t("CURRENT CONTEXT:", "السياق النشط:")}</span>
        </span>

        {activeContextTags.map((tag) => (
          <span 
            key={tag.id}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold shrink-0 transition-all shadow-2xs group ${
              tag.id === 'selected' || tag.id === 'closest'
                ? (isDarkMode ? 'bg-amber-950/70 border-amber-500/80 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900')
                : (isDarkMode 
                    ? 'bg-[#182645] border-slate-700/80 text-[#00e5ff] hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-700' 
                    : 'bg-white border-slate-300/90 text-[#215A9E] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200')
            }`}
          >
            <span className="text-xs">{tag.icon || (tag.id === 'selected' ? '⭐' : '📍')}</span>
            <span>{isArabic && tag.label_ar ? tag.label_ar : tag.label}</span>
            <button
              type="button"
              onClick={() => onRemoveTag(tag.id)}
              className="w-3.5 h-3.5 rounded-full hover:bg-rose-200/80 dark:hover:bg-rose-900/60 flex items-center justify-center transition-colors cursor-pointer ms-0.5"
              title={t('Remove context item', 'إزالة عنصر السياق')}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {activeContextTags.length > 0 && (
        <button
          type="button"
          onClick={onClearAllContext}
          className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors shrink-0 ms-2 cursor-pointer flex items-center gap-1"
          title={t('Clear active conversation context', 'مسح سياق المحادثة النشط')}
        >
          <RefreshCw className="w-3 h-3" />
          <span>{t('Clear Context', 'مسح السياق')}</span>
        </button>
      )}
    </div>
  );
}
