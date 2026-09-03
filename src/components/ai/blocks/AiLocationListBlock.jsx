import React from 'react';
import { MapPin, GraduationCap, PlusSquare, TreePine, Bus } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const ICON_MAP = {
  EDUCATION: GraduationCap,
  HOSPITAL: PlusSquare,
  PARK: TreePine,
  TRANSPORT: Bus,
  MANUFACTURING: MapPin
};

const LOCATION_ARABIC_MAP = {
  'Al Maryah Island': 'جزيرة الماريه',
  'Al Mafraq': 'المفرق',
  'Mussafah': 'مصفح',
  'KIZAD / Taweelah': 'كيزاد / الطويلة',
  'Corniche Road': 'طريق الكورنيش',
  'Al Mushrif': 'المشرف',
  'Khalifa City': 'مدينة خليفة',
  'Al Ain': 'العين',
  'Electra Street': 'شارع إلكترا',
  'Airport Road': 'شارع المطار',
  'Al Reem Island': 'جزيرة الريم',
  'Mohammed Bin Zayed City': 'مدينة محمد بن زايد',
  'Zayed Sports City': 'مدينة زايد الرياضية',
  'Al Jimi': 'الجيمي'
};

export default function AiLocationListBlock({ locations = [], onEntityClick }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  if (!locations || locations.length === 0) return null;

  return (
    <div className="space-y-2 my-2.5">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5">
        {t('MATCHING LOCATIONS', 'المواقع المطابقة')} ({locations.length})
      </div>
      <div className="grid grid-cols-1 gap-2">
        {locations.map((item) => {
          const CategoryIcon = ICON_MAP[item.facilityType || item.type] || MapPin;
          const isCritical = item.riskLevel === 'Critical';
          const isHigh = item.riskLevel === 'High';

          const displayName = isArabic && item.name_ar ? item.name_ar : item.name;
          const rawLoc = item.district || item.location || '';
          const displayLocation = isArabic 
            ? (item.district_ar || item.location_ar || LOCATION_ARABIC_MAP[rawLoc] || rawLoc) 
            : rawLoc;

          const riskLabel = isArabic 
            ? (item.riskLevel === 'Critical' ? 'حرج' : item.riskLevel === 'High' ? 'عالي' : 'منخفض') 
            : (item.riskLevel || 'Normal');

          return (
            <div 
              key={item.id} 
              onClick={() => onEntityClick && onEntityClick(item)}
              className={`border rounded-xl p-2 sm:p-2.5 flex items-center justify-between transition-all cursor-pointer group shadow-2xs gap-2 ${
                isDarkMode 
                  ? 'bg-[#0d1527] border-slate-800 text-slate-100 hover:border-slate-700 hover:bg-[#111c34]' 
                  : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:border-[#3D52A0]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCritical 
                    ? (isDarkMode ? 'bg-rose-950/80 text-rose-300' : 'bg-rose-100 text-rose-700') 
                    : isHigh 
                    ? (isDarkMode ? 'bg-amber-950/80 text-amber-300' : 'bg-amber-100 text-amber-700') 
                    : (isDarkMode ? 'bg-[#063360] border border-[#215A9E]/60 text-[#7DA1C4]' : 'bg-[#eef3ff] text-[#3D52A0]')
                }`}>
                  <CategoryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`font-bold text-xs leading-tight transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-[#7DA1C4]' : 'text-[#1e2749] group-hover:text-[#3D52A0]'
                  }`}>{displayName}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 flex-wrap">
                    <span className="font-medium">{displayLocation}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <span className={`font-bold ${isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {riskLabel} {t('Risk', 'خطورة')} ({item.riskScore || 25})
                    </span>
                  </div>
                </div>
              </div>

              <div 
                title={t('View on Map', 'عرض على الخريطة')}
                className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center transition-all shrink-0 border ${
                  isDarkMode 
                    ? 'bg-[#182645] text-[#00e5ff] border-slate-700/80 group-hover:bg-[#7c3aed] group-hover:text-white' 
                    : 'bg-[#eef3ff] text-[#215A9E] border-[#215A9E]/20 group-hover:bg-[#215A9E] group-hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
