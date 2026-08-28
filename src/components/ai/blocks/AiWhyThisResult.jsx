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
        ? 'bg-[#0d1527] border-slate-800 text-slate-100' 
        : 'bg-emerald-50/80 border-emerald-200/90 text-emerald-950'
    }`}>
      <div className={`flex items-center justify-between font-bold border-b pb-1.5 ${
        isDarkMode ? 'text-emerald-400 border-slate-800' : 'text-emerald-950 border-emerald-200/60'
      }`}>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t('WHY THIS RESULT?', 'لماذا هذه النتيجة؟')}</span>
        </span>
        {ranking && (
          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-mono">
            {isArabic ? 'المرشح الأبرز رقم 1' : ranking}
          </span>
        )}
      </div>

      {facilityName && (
        <div className={`flex items-center gap-1 text-[11px] font-extrabold ${isDarkMode ? 'text-emerald-200' : 'text-emerald-900'}`}>
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
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
            <div key={idx} className={`text-[11px] font-medium flex items-start gap-1.5 ${isDarkMode ? 'text-emerald-200' : 'text-emerald-900'}`}>
              <span>{itemText}</span>
            </div>
          );
        })}
      </div>

      <div className={`pt-1.5 border-t flex items-center justify-between text-[10px] font-semibold ${
        isDarkMode ? 'border-emerald-500/30 text-emerald-300' : 'border-emerald-200/60 text-emerald-800'
      }`}>
        <span>{t('Spatial Method', 'الطريقة المكانية')}: {spatialMethod || 'POINT_IN_POLYGON (WGS84 EPSG:4326)'}</span>
        <span className={`border px-2 py-0.5 rounded font-bold ${
          isDarkMode ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' : 'bg-emerald-100 border-emerald-300/80 text-emerald-900'
        }`}>
          {isArabic ? 'دقة عالية' : (confidence || 'HIGH')}
        </span>
      </div>
    </div>
  );
}
