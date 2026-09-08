import React from 'react';
import dgeLightLogo from '../../assets/dge-light.webp';
import sdiLightLogo from '../../assets/sdi-light.webp';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';

export default function MapPrintTemplate({ explorerState }) {
  const { isArabic } = useLanguage();
  const { activeProject } = useProject();
  const activeResults = explorerState?.activeResults || activeProject.datasets || [];
  const selectedLoc = explorerState?.selectedLocation || explorerState?.selectedDetail;
  const now = new Date().toLocaleString();

  return (
    <div className="hidden print:block fixed inset-0 bg-white text-slate-900 p-8 z-[99999] overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#063360] pb-4 mb-6">
        <div className="flex items-center gap-4">
          <img src={dgeLightLogo} alt="DGE Logo" className="h-10 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-[#063360]">
              {isArabic ? activeProject.name_ar : activeProject.name} — {isArabic ? "منصة الخرائط الذكية" : "SmartMap Project Report"}
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              {isArabic ? activeProject.description_ar : activeProject.description}
            </p>
          </div>
        </div>
        <img src={sdiLightLogo} alt="SDI Logo" className="h-8 object-contain" />
      </div>

      {/* Map Extent & Context Info Card */}
      <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        <div>
          <span className="text-slate-400 font-bold block uppercase tracking-wider">{isArabic ? "تاريخ التقرير:" : "Report Date & Time:"}</span>
          <span className="font-semibold text-slate-800">{now}</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold block uppercase tracking-wider">{isArabic ? "نطاق المشروع:" : "Project Geography:"}</span>
          <span className="font-semibold text-[#215A9E]">{activeProject.geography}</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold block uppercase tracking-wider">{isArabic ? "عدد النتائج:" : "Total Results Found:"}</span>
          <span className="font-bold text-emerald-700">{activeResults.length} {isArabic ? "منشآت" : "features"}</span>
        </div>
      </div>


      {/* Simulated Map Print Viewport Frame with North Arrow & Scale */}
      <div className="relative w-full h-[400px] bg-slate-100 rounded-2xl border-2 border-slate-300 overflow-hidden mb-6 flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 start-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#063360] shadow-xs">
          📍 {isArabic ? "المركز الجغرافي: أبوظبي" : "Extent: Abu Dhabi Sector (24.4839° N, 54.3773° E)"}
        </div>

        {/* North Arrow */}
        <div className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold text-xs shadow-xs">
          N ↑
        </div>

        {/* Center Map Graphic Placeholder Representation */}
        <div className="text-center space-y-2">
          <div className="text-4xl text-[#215A9E]">🗺️</div>
          <p className="font-bold text-slate-700 text-sm">
            {isArabic ? "عرض الخريطة التفاعلية والطبقات الرسمية" : "Active Abu Dhabi DGE ArcGIS Map Viewport"}
          </p>
          <p className="text-xs text-slate-500">
            {isArabic ? `عرض ${activeResults.length} موقع مكاني على الخريطة` : `Rendering ${activeResults.length} spatial result markers on official DGE basemap`}
          </p>
        </div>

        {/* Scale Bar */}
        <div className="absolute bottom-4 start-4 bg-white/90 px-3 py-1 rounded border border-slate-200 text-[10px] font-mono font-bold">
          ├─── 1 km ───┤
        </div>
      </div>

      {/* Selected Location Summary (if active) */}
      {selectedLoc && (
        <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1">
          <h3 className="font-bold text-[#063360] text-sm">
            🎯 {isArabic ? "المنشأة المحددة:" : "Selected Facility Detail:"} {isArabic && selectedLoc.name_ar ? selectedLoc.name_ar : selectedLoc.name}
          </h3>
          <p className="text-slate-600">
            <strong>{isArabic ? "الموقع:" : "Location:"}</strong> {selectedLoc.location || selectedLoc.district} | <strong>{isArabic ? "الفئة:" : "Category:"}</strong> {selectedLoc.type} | <strong>{isArabic ? "مستوى الخطورة:" : "Risk Score:"}</strong> {selectedLoc.riskScore}/100 ({selectedLoc.riskLevel})
          </p>
        </div>
      )}

      {/* Active Results Table */}
      {activeResults.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">
            {isArabic ? "جدول البيانات المكانية المستخرجة" : "Active Spatial Results Table"} ({activeResults.length})
          </h3>
          <table className="w-full text-start text-xs border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-2 border-e">#</th>
                <th className="p-2 border-e">{isArabic ? "اسم المنشأة" : "Facility Name"}</th>
                <th className="p-2 border-e">{isArabic ? "الفئة" : "Type"}</th>
                <th className="p-2 border-e">{isArabic ? "الموقع" : "District"}</th>
                <th className="p-2 border-e">{isArabic ? "المسافة" : "Distance"}</th>
                <th className="p-2">{isArabic ? "مستوى الخطورة" : "Risk Level"}</th>
              </tr>
            </thead>
            <tbody>
              {activeResults.slice(0, 10).map((r, i) => (
                <tr key={r.id || i} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-2 border-e font-mono text-center">{i + 1}</td>
                  <td className="p-2 border-e font-bold">{isArabic && r.name_ar ? r.name_ar : r.name}</td>
                  <td className="p-2 border-e">{r.type}</td>
                  <td className="p-2 border-e">{r.location || r.district}</td>
                  <td className="p-2 border-e">{r.distanceKm ? `${r.distanceKm} km` : '-'}</td>
                  <td className="p-2 font-semibold">{r.riskLevel || 'Normal'} ({r.riskScore || 25})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
        <span>© {new Date().getFullYear()} Department of Government Enablement (DGE) - Abu Dhabi Spatial Data Infrastructure</span>
        <span>Confidential & Official Spatial Report</span>
      </div>
    </div>
  );
}
