import React from 'react';
import { Zap, ArrowRight, Lock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const ACTION_LABEL_MAP = {
  'Compare Water Consumption': 'مقارنة استهلاك المياه',
  'Export Emissions Report': 'طباعة تقرير الانبعاثات',
  'Compare Nearby Facilities': 'مقارنة المنشآت المجاورة',
  'View 12-Month Trend Line': 'عرض خط المسار لـ 12 شهراً',
  'Print Abu Dhabi Report': 'طباعة تقرير أبوظبي الإداري',
  'Print executive report': 'طباعة التقرير التنفيذي',
  'Download Abu Dhabi Report': 'طباعة تقرير أبوظبي الإداري',
  'Download executive report': 'طباعة التقرير التنفيذي',
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
  'Export facility report': 'طباعة تقرير المنشأة',
  'Only government hospitals': 'المستشفيات الحكومية فقط',
  'Enable Location': 'تفعيل تحديد الموقع',
  'Choose Location on Map': 'اختر الموقع على الخريطة',
  'Compare with highest emissions': 'مقارنة بأعلى انبعاثات',
  'Show flood risk': 'عرض مخاطر الفيضانات',
  'Show water consumption': 'عرض استهلاك المياه',
  'Compare nearby': 'مقارنة بالمنشآت القريبة',
  'Show vehicle inspection centers near me': 'عرض مراكز فحص السيارات القريبة مني',
  'Export Analysis': 'طباعة التحليلات',
  'Emissions Chart': 'مخطط الانبعاثات',
  'View Water Chart': 'مخطط استهلاك المياه',
  'Why High Risk?': 'لماذا تعتبر عالية الخطورة؟'
};

const REVERSE_LABEL_MAP = {
  'مقارنة استهلاك المياه': 'Compare Water Consumption',
  'طباعة تقرير الانبعاثات': 'Export Emissions Report',
  'مقارنة المنشآت المجاورة': 'Compare Nearby Facilities',
  'عرض خط المسار لـ 12 شهراً': 'View 12-Month Trend',
  'عرض التوجه الزمني': 'View 12-Month Trend',
  'طباعة تقرير أبوظبي الإداري': 'Print Abu Dhabi Report',
  'طباعة التقرير التنفيذي': 'Print Executive Report',
  'تصدير تقرير أبوظبي': 'Export Abu Dhabi Report',
  'تصدير تقرير PDF': 'Export PDF Report',
  'فحص جودة البيانات': 'Check Data Quality',
  'محاكاة سيناريو الفيضانات': 'Simulate Flood Scenario',
  'عرض المستشفيات': 'Show Hospitals',
  'اعرض المستشفيات في أبوظبي': 'Show Hospitals in Abu Dhabi',
  'عرض المدارس': 'Show Schools',
  'عرض الحدائق العامة': 'Show Public Parks',
  'حدائق عامة': 'Public Parks',
  'عرض الانبعاثات': 'Show Emissions',
  'تراجع': 'Undo',
  'أيها الأقرب لي؟': 'Which one is closest?',
  'عرض تفاصيلها': 'Show Details',
  'عرض المدارس ضمن 2 كم من هذه المستشفيات': 'Show Schools within 2 km of these Hospitals',
  'حفظ هذا البحث': 'Save this Search',
  'حفظ هذا الموقع إلى المفضلة': 'Save Location to Favorites',
  'عرض المدارس القريبة منها': 'Show Schools Near It',
  'طباعة تقرير المنشأة': 'Print Facility Report',
  'المستشفيات الحكومية فقط': 'Only Government Hospitals',
  'تفعيل تحديد الموقع': 'Enable Location Access',
  'لماذا تعتبر عالية الخطورة؟': 'Why is this High Risk?',
  'لماذا مستشفى شخبوط عالي الخطورة؟': 'Why is SSMC High Risk?'
};

const isSaveOrFavoriteItem = (itemText = '') => {
  const text = (itemText || '').toLowerCase();
  return ['save', 'favorite', 'حفظ', 'مفضلة'].some(k => text.includes(k));
};

const isUndoItem = (itemText = '') => {
  const text = (itemText || '').toLowerCase();
  return ['undo', 'تراجع', 'undo_action'].some(k => text.includes(k));
};

const isIrrelevantOrHeaderItem = (itemText = '') => {
  if (!itemText) return true;
  const text = (itemText || '').toLowerCase().trim();
  return ['focused map', 'التركيز على موقع'].some(k => text.includes(k));
};

const isRestrictedGuestItem = (itemText = '') => {
  return false;
};

export default function AiActionSuggestions({ actionCards = [], suggestions = [], onActionClick, onSuggestionClick, isLoggedIn = false }) {
  const { isDarkMode } = useTheme();
  const { isArabic } = useLanguage();

  // Filter out any save/favorite actions, Undo suggestions, or irrelevant header titles
  const filteredActionCards = (actionCards || []).filter(c => 
    !isUndoItem(c.label || c.title || c.id) && 
    !isIrrelevantOrHeaderItem(c.label || c.title || c.id) && 
    (isLoggedIn || !isSaveOrFavoriteItem(c.label || c.title))
  );
  const filteredSuggestions = (suggestions || []).filter(sug => 
    !isUndoItem(sug) && 
    !isIrrelevantOrHeaderItem(sug) && 
    (isLoggedIn || !isSaveOrFavoriteItem(sug))
  );

  const hasActions = filteredActionCards.length > 0;
  const hasSuggestions = filteredSuggestions.length > 0;

  if (!hasActions && !hasSuggestions) return null;

  return (
    <div className={`space-y-2.5 pt-2.5 border-t my-2.5 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
      {/* 1. Interactive Choice Cards / Radio Options (e.g. Ambiguous Search: Yas Island, Bani Yas) */}
      {hasActions && filteredActionCards.some(c => c.isOption) && (
        <div className="space-y-1.5 my-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ms-1">
            {isArabic ? "اختيار المنطقة المقصودة:" : "Select your intended area:"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {filteredActionCards.filter(c => c.isOption).map((card, idx) => {
              const labelText = isArabic 
                ? (card.label_ar || ACTION_LABEL_MAP[card.label] || card.title) 
                : (card.label || REVERSE_LABEL_MAP[card.label_ar] || card.title);
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
      {hasActions && filteredActionCards.some(c => !c.isOption) && (
        <div className="flex flex-col gap-1.5 my-1">
          {filteredActionCards.filter(c => !c.isOption).map((card, idx) => {
            const rawLabel = card.label || card.title || '';
            const rawAr = card.label_ar || card.title_ar || '';
            const cardLabel = isArabic 
              ? (rawAr || ACTION_LABEL_MAP[rawLabel] || rawLabel) 
              : (rawLabel && !/[\u0600-\u06FF]/.test(rawLabel) ? rawLabel : (REVERSE_LABEL_MAP[rawAr || rawLabel] || rawLabel));
            
            const isRestricted = isRestrictedGuestItem(card.label || card.title);
            const isLocked = isRestricted && !isLoggedIn;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onActionClick && onActionClick(card)}
                className={`w-full px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-2 group text-start ${
                  isLocked 
                    ? (isDarkMode 
                        ? 'bg-[#182035] text-amber-300 border-amber-500/40 hover:bg-amber-500/20' 
                        : 'bg-amber-50/90 text-amber-900 border-amber-300/80 hover:bg-amber-100/80')
                    : (isDarkMode 
                        ? 'bg-[#131b2e] text-white border-slate-700/80 hover:bg-[#7c3aed] hover:border-[#7c3aed]' 
                        : 'bg-[#eef3ff] text-[#3D52A0] border-[#3D52A0]/20 hover:bg-[#215A9E] hover:text-white')
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 text-start">
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-amber-400 shrink-0" />
                  )}
                  <span className="leading-snug text-start">{cardLabel}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isLocked && (
                    <span className="text-[9.5px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                      {isArabic ? "تسجيل الدخول" : "Sign In"}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all rtl:-scale-x-100" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Interactive Suggestion Options */}
      {hasSuggestions && (
        <div className="flex flex-col gap-1.5 my-1">
          {filteredSuggestions.map((sug, idx) => {
            const sugLabel = isArabic 
              ? (ACTION_LABEL_MAP[sug] || sug) 
              : (REVERSE_LABEL_MAP[sug] || (sug && !/[\u0600-\u06FF]/.test(sug) ? sug : sug));
            const isRestricted = isRestrictedGuestItem(sug);
            const isLocked = isRestricted && !isLoggedIn;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick(sug)}
                className={`w-full px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-2 group text-start ${
                  isLocked 
                    ? (isDarkMode 
                        ? 'bg-[#161d30] text-amber-300 border-amber-500/40 hover:bg-amber-500/20' 
                        : 'bg-amber-50/90 text-amber-900 border-amber-300/80 hover:bg-amber-100/80')
                    : (isDarkMode 
                        ? 'bg-[#0b1328] text-slate-200 border-slate-700/80 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed]' 
                        : 'bg-slate-100/90 text-slate-700 border-slate-200/90 hover:bg-[#eef3ff] hover:text-[#215A9E] hover:border-[#215A9E]/40')
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isLocked && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  <span className="leading-snug">{sugLabel}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isLocked && (
                    <span className="text-[9.5px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                      {isArabic ? "تسجيل الدخول" : "Sign In"}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all rtl:-scale-x-100" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
