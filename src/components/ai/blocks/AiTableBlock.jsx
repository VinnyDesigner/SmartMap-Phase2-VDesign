import React from 'react';
import { Table, MapPin, Compass, Building2, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiTableBlock({ results = [], onEntityClick, onActionClick }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();

  if (!results || results.length === 0) return null;

  return (
    <div className={`mt-3 rounded-2xl border overflow-hidden shadow-xs transition-all ${
      isDarkMode ? 'bg-[#0f182e] border-slate-800' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className={`px-3.5 py-2.5 border-b flex items-center justify-between ${
        isDarkMode ? 'bg-[#14203e] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-[#00e5ff]" />
          <span className="font-extrabold text-xs uppercase tracking-wider">
            {isArabic ? `جدول البيانات المكانية (${results.length} نتائج)` : `Spatial Data Table (${results.length} records)`}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400">
          EPSG:4326 WGS84
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto sleek-scrollbar">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className={`border-b text-[10px] uppercase font-extrabold tracking-wider ${
              isDarkMode ? 'bg-[#0b1224] text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">{isArabic ? "اسم المنشأة" : "Feature Name"}</th>
              <th className="py-2 px-3">{isArabic ? "الفئة" : "Category"}</th>
              <th className="py-2 px-3">{isArabic ? "المنطقة" : "District"}</th>
              <th className="py-2 px-3">{isArabic ? "المسافة" : "Distance"}</th>
              <th className="py-2 px-3 text-center">{isArabic ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-200/80 text-slate-700'}`}>
            {results.map((item, idx) => {
              const displayName = isArabic && item.name_ar ? item.name_ar : item.name;
              const displayCategory = isArabic && item.category_ar ? item.category_ar : (item.type || item.facilityType || 'Facility');
              const displayLocation = isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Abu Dhabi');
              const distStr = item.distanceKm !== undefined ? `${item.distanceKm} km` : (item.distance || '2.1 km');

              return (
                <tr 
                  key={item.id || idx}
                  onClick={() => onEntityClick && onEntityClick(item)}
                  className={`transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:bg-[#162345]' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-400 text-[10px]">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {displayName}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9.5px] border border-slate-200 dark:border-slate-700">
                      {displayCategory}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-500 dark:text-slate-400">
                    {displayLocation}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[10px]">
                    {distStr}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEntityClick) onEntityClick(item);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 ${
                        isDarkMode 
                          ? 'bg-[#182645] text-[#00e5ff] hover:bg-[#7c3aed] hover:text-white' 
                          : 'bg-[#eef3ff] text-[#215A9E] hover:bg-[#215A9E] hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{isArabic ? "تركيز" : "Focus"}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
