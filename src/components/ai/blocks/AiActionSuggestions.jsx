import React from 'react';
import { Zap, ArrowRight, Lock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const ACTION_LABEL_MAP = {
  'Compare Water Consumption': 'مقارنة استهلاك المياه',
  'Export Emissions Report': 'تصدير تقرير الانبعاثات',
  'Compare Nearby Facilities': 'مقارنة المنشآت المجاورة',
  'View 12-Month Trend Line': 'عرض خط المسار لـ 12 شهراً',
  'Download Abu Dhabi Report': 'تحميل تقرير أبوظبي الإداري',
  'Download executive report': 'تحميل التقرير التنفيذي',
  'Simulate flood scenario': 'محاكاة سيناريو الفيضانات',
  'Show hospitals': 'عرض المستشفيات',
  'Show hospitals in abu dhabi': 'اعرض المستشفيات في أبوظبي',
  'Show schools': 'عرض المدارس',
  'Show parks': 'عرض الحدائق العامة',
  'Public parks': 'حدائق عامة',
  'Show emissions': 'عرض الانبعاثات',
  'Undo': 'تراجع',
  'Which one is closest?': 'أيها الأقرب لي؟',
  'Which one is closest': 'أيها الأقرب لي؟',
  'Within 5 km of Zayed Sports City': 'ضمن نطاق 5 كم من مدينة زايد الرياضية',
  'Show its details': 'عرض تفاصيلها',
  'Show schools within 2 km of these hospitals': 'عرض المدارس ضمن 2 كم من هذه المستشفيات',
  'Save this search': 'حفظ هذا البحث',
  'Save this location to Favorites': 'حفظ هذا الموقع إلى المفضلة',
  'Show schools near it': 'عرض المدارس القريبة منها',
  'Export facility report': 'تصدير تقرير المنشأة',
  'Only government hospitals': 'المستشفيات الحكومية فقط',
  'Enable Location': 'تفعيل تحديد الموقع',
  'Choose Location on Map': 'اختر الموقع على الخريطة',
  'Compare with highest emissions': 'مقارنة بأعلى انبعاثات',
  'Show flood risk': 'عرض مخاطر الفيضانات',
  'Show water consumption': 'عرض استهلاك المياه',
  'Compare nearby': 'مقارنة بالمنشآت القريبة',
  'Show vehicle inspection centers near me': 'عرض مراكز فحص السيارات القريبة مني',
  'Export Analysis': 'تصدير التحليلات',
  'Emissions Chart': 'مخطط الانبعاثات',
  'View Water Chart': 'مخطط استهلاك المياه',
  'Why High Risk?': 'لماذا تعتبر عالية الخطورة؟'
};

const RESTRICTED_GUEST_KEYWORDS = [
  'compare', 'nearby facilities', 'trend', 'line', 'simulate', 'scenario', 'flood', 
  'report', 'download', 'export', 'water', 'emissions', 'consumption', 'analytics',
  'مقارنة', 'منشآت', 'مسار', 'محاكاة', 'سيناريو', 'فيضان', 'تقرير', 'تحميل', 'تصدير', 'استهلاك', 'انبعاثات', 'تحليلات'
];

const isRestrictedGuestItem = (itemText = '') => {
  const text = (itemText || '').toLowerCase();
  return RESTRICTED_GUEST_KEYWORDS.some(k => text.includes(k));
};

export default function AiActionSuggestions({ actionCards = [], suggestions = [], onActionClick, onSuggestionClick, isLoggedIn = false }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  const hasActions = actionCards && actionCards.length > 0;
  const hasSuggestions = suggestions && suggestions.length > 0;

  if (!hasActions && !hasSuggestions) return null;

  return (
    <div className={`space-y-2.5 pt-2.5 border-t my-2.5 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
      {/* 1. Interactive Choice Cards / Radio Options (e.g. Ambiguous Search: Yas Island, Bani Yas) */}
      {hasActions && actionCards.some(c => c.isOption) && (
        <div className="space-y-1.5 my-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ms-1">
            {isArabic ? "اختيار المنطقة المقصودة:" : "Select your intended area:"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {actionCards.filter(c => c.isOption).map((card, idx) => {
              const labelText = isArabic ? (card.label_ar || card.title) : (card.label || card.title);
              const cleanLabel = labelText.replace(/^○\s*/, '');
              
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onActionClick && onActionClick(card)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold border text-start transition-all cursor-pointer group shadow-2xs ${
                    isDarkMode 
                      ? 'bg-[#121c35] text-white border-slate-700/80 hover:bg-[#7c3aed] hover:border-[#7c3aed] shadow-xs' 
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-[#215A9E] hover:text-white hover:border-[#215A9E]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isDarkMode 
                      ? 'border-[#00e5ff] group-hover:border-white group-hover:bg-white/20' 
                      : 'border-[#215A9E] group-hover:border-white group-hover:bg-white/20'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="flex-1 truncate">{cleanLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all rtl:-scale-x-100" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Interactive Action Cards (e.g. Compare Water Consumption, Export Report, Simulate Flood) */}
      {hasActions && actionCards.some(c => !c.isOption) && (
        <div className="flex flex-wrap gap-1.5">
          {actionCards.filter(c => !c.isOption).map((card, idx) => {
            const cardLabel = isArabic ? (card.label_ar || card.title_ar || ACTION_LABEL_MAP[card.label] || card.label || card.title) : (card.label || card.title);
            const isRestricted = isRestrictedGuestItem(card.label || card.title);
            const isLocked = isRestricted && !isLoggedIn;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onActionClick && onActionClick(card)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all shadow-2xs group cursor-pointer ${
                  isLocked 
                    ? (isDarkMode ? 'bg-[#182035] text-amber-300 border-amber-500/40 hover:bg-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100')
                    : (isDarkMode ? 'bg-[#131b2e] text-white border-slate-700/80 hover:bg-[#7c3aed] hover:border-[#7c3aed]' : 'bg-[#eef3ff] text-[#3D52A0] border-[#3D52A0]/20 hover:bg-[#215A9E] hover:text-white')
                }`}
              >
                {isLocked ? (
                  <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                ) : (
                  <Zap className="w-3 h-3 group-hover:scale-110 transition-transform text-amber-400 shrink-0" />
                )}
                <span>{cardLabel}</span>
                {isLocked && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold ms-0.5">
                    {isArabic ? "تسجيل الدخول" : "Sign In"}
                  </span>
                )}
                <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform rtl:-scale-x-100" />
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Interactive Suggestion Pills */}
      {hasSuggestions && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((sug, idx) => {
            const sugLabel = isArabic ? (ACTION_LABEL_MAP[sug] || sug) : sug;
            const isRestricted = isRestrictedGuestItem(sug);
            const isLocked = isRestricted && !isLoggedIn;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick(sug)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer shadow-2xs flex items-center gap-1 group ${
                  isLocked 
                    ? (isDarkMode ? 'bg-[#161d30] text-amber-300 border-amber-500/40 hover:bg-amber-500/20' : 'bg-amber-50/90 text-amber-800 border-amber-300 hover:bg-amber-100')
                    : (isDarkMode ? 'bg-[#0b1328] text-slate-200 border-slate-700/80 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-[#eef3ff] hover:text-[#215A9E] hover:border-[#215A9E]/40')
                }`}
              >
                {isLocked && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                <span>{sugLabel}</span>
                {isLocked && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold ms-0.5">
                    {isArabic ? "تسجيل الدخول" : "Sign In"}
                  </span>
                )}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ms-1 group-hover:ms-0 transition-all rtl:-scale-x-100" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
