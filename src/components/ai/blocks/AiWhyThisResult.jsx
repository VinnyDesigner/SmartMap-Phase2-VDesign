import React from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiWhyThisResult({ data }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  if (!data || !data.predicatesSatisfied) return null;

  const { facilityName, predicatesSatisfied = [], ranking, confidence, spatialMethod } = data;

  return (
    <div className={`border rounded-xl p-3 my-2.5 space-y-2 text-xs shadow-2xs ${
      isDarkMode 
        ? 'bg-[#0c192e] border-slate-700/80 text-slate-100' 
        : 'bg-[#f4f7fc] border-[#215A9E]/30 text-slate-900'
    }`}>
      <div className={`flex items-center justify-between font-bold border-b pb-1.5 ${
        isDarkMode ? 'text-[#00e5ff] border-slate-700/80' : 'text-[#063360] border-slate-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#215A9E] dark:text-[#00e5ff] shrink-0" />
          <span>{t('WHY THIS RESULT?', 'لماذا هذه النتيجة؟')}</span>
        </span>
        {ranking && (
          <span className="bg-gradient-to-r from-[#063360] to-[#215A9E] text-white px-2 py-0.5 rounded text-[10px] font-mono shadow-2xs">
            {isArabic ? 'المرشح الأبرز رقم 1' : ranking}
          </span>
        )}
      </div>

      {facilityName && (
        <div className={`flex items-center gap-1 text-[11px] font-extrabold ${isDarkMode ? 'text-slate-100' : 'text-[#063360]'}`}>
          <MapPin className="w-3.5 h-3.5 text-[#215A9E] dark:text-[#00e5ff]" />
          <span>{isArabic && data.facilityName_ar ? data.facilityName_ar : facilityName}</span>
        </div>
      )}

      <div className="space-y-1 pt-0.5">
        {predicatesSatisfied.map((item, idx) => {
          let itemText = item;
          if (isArabic) {
            if (item.includes('Located in Mussafah')) itemText = '✓ تقع المنشأة في منطقة مصفح الصناعية، أبوظبي';
            else if (item.includes('Inside Mussafah Tidal')) itemText = '✓ ناتج التقاطع المكاني: داخل منطقة غمر القنوات البحرية بمصفح (WGS84 EPSG:4326)';
            else if (item.includes('Inside Al Mafraq')) itemText = '✓ ناتج التقاطع المكاني: داخل حوض الإجهاد المائي بالمفرق (WGS84 EPSG:4326)';
            else if (item.includes('Classified as')) itemText = `✓ تصنيف المنشأة الصناعي معتمد رسميًا`;
            else if (item.includes('Located in')) itemText = item.replace('Located in', 'تقع في');
          }
          return (
            <div key={idx} className={`text-[11px] font-medium flex items-start gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <span>{itemText}</span>
            </div>
          );
        })}
      </div>

      <div className={`pt-1.5 border-t flex items-center justify-between text-[10px] font-semibold ${
        isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
      }`}>
        <span>{t('Spatial Method', 'الطريقة المكانية')}: {spatialMethod || 'POINT_IN_POLYGON (WGS84 EPSG:4326)'}</span>
        <span className={`border px-2 py-0.5 rounded font-bold ${
          isDarkMode ? 'bg-[#182645] border-slate-700 text-[#00e5ff]' : 'bg-[#eef3ff] border-[#215A9E]/30 text-[#215A9E]'
        }`}>
          {isArabic ? 'دقة عالية' : (confidence || 'HIGH')}
        </span>
      </div>
    </div>
  );
}
