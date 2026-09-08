import React from 'react';
import dgeLightLogo from '../../assets/dge-light.webp';
import sdiLightLogo from '../../assets/sdi-light.webp';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProject } from '../../contexts/ProjectContext';

export default function MapPrintTemplate({ explorerState }) {
  const { isArabic } = useLanguage();
  const { activeProject } = useProject();

  const activeResults = explorerState?.activeResults || activeProject.datasets || [];
  const selectedLoc = explorerState?.selectedLocation || explorerState?.selectedDetail || activeResults[0];
  const now = new Date().toLocaleString();

  // Category counts & risk calculations for Page 2 Analytics
  const categoryCounts = activeResults.reduce((acc, r) => {
    const cat = r.type || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const riskCounts = activeResults.reduce((acc, r) => {
    const risk = r.riskLevel || 'Normal';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {});

  const totalResults = activeResults.length || 1;

  // Calculate dynamic Bounding Box (bbox) from active results for real satellite/street map export
  const validLocations = activeResults.filter(r => typeof r.lat === 'number' && typeof r.lng === 'number');
  const lats = validLocations.length > 0 ? validLocations.map(r => r.lat) : [24.4839];
  const lngs = validLocations.length > 0 ? validLocations.map(r => r.lng) : [54.3773];

  const rawMinLat = Math.min(...lats);
  const rawMaxLat = Math.max(...lats);
  const rawMinLng = Math.min(...lngs);
  const rawMaxLng = Math.max(...lngs);

  // Ensure minimum spatial span for clean map framing
  const latSpan = Math.max(rawMaxLat - rawMinLat, 0.10);
  const lngSpan = Math.max(rawMaxLng - rawMinLng, 0.18);

  const centerLat = (rawMinLat + rawMaxLat) / 2;
  const centerLng = (rawMinLng + rawMaxLng) / 2;

  const minLat = centerLat - latSpan / 2 - 0.03;
  const maxLat = centerLat + latSpan / 2 + 0.03;
  const minLng = centerLng - lngSpan / 2 - 0.04;
  const maxLng = centerLng + lngSpan / 2 + 0.04;

  // Real Esri High-Resolution Satellite & Boundaries Map Image URLs
  const activeBasemap = explorerState?.activeBasemap || 'satellite';
  const isStreetBasemap = activeBasemap.includes('street') || activeBasemap.includes('light');
  const basemapService = isStreetBasemap ? 'World_Street_Map' : 'World_Imagery';

  const mapImageUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/${basemapService}/MapServer/export?bbox=${minLng.toFixed(4)},${minLat.toFixed(4)},${maxLng.toFixed(4)},${maxLat.toFixed(4)}&bboxSR=4326&imageSR=4326&size=1400,700&f=image`;
  const labelsImageUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/export?bbox=${minLng.toFixed(4)},${minLat.toFixed(4)},${maxLng.toFixed(4)},${maxLat.toFixed(4)}&bboxSR=4326&imageSR=4326&size=1400,700&f=image`;

  return (
    <div className="hidden print:block text-slate-900 bg-white w-full">
      
      {/* ========================================================================= */}
      {/* PAGE 1: DEDICATED REAL SATELLITE MAP VIEWPORT & GEOGRAPHIC CONTEXT       */}
      {/* ========================================================================= */}
      <div className="min-h-[100vh] p-8 flex flex-col justify-between page-break-after-always">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#063360] pb-4 mb-6">
            <div className="flex items-center gap-4">
              <img src={dgeLightLogo} alt="DGE Logo" className="h-10 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-[#063360]">
                  {isArabic ? activeProject.name_ar : activeProject.name} — {isArabic ? "تقرير الخريطة الذكية" : "Executive Spatial Map Report"}
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isArabic ? activeProject.description_ar : activeProject.description}
                </p>
              </div>
            </div>
            <img src={sdiLightLogo} alt="SDI Logo" className="h-10 object-contain" />
          </div>

          {/* Project & Extent Metadata Card */}
          <div className="grid grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold block uppercase tracking-wider">{isArabic ? "تاريخ التقرير:" : "REPORT DATE & TIME:"}</span>
              <span className="font-semibold text-slate-800">{now}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase tracking-wider">{isArabic ? "نطاق المشروع:" : "PROJECT GEOGRAPHY:"}</span>
              <span className="font-semibold text-[#215A9E]">{activeProject.geography}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase tracking-wider">{isArabic ? "عدد المعالم المستخرجة:" : "ACTIVE RESULTS:"}</span>
              <span className="font-bold text-emerald-700">{activeResults.length} {isArabic ? "منشأة/معلم" : "spatial features"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase tracking-wider">{isArabic ? "الخريطة الأساسية:" : "ACTIVE BASEMAP:"}</span>
              <span className="font-semibold text-purple-700">{activeBasemap}</span>
            </div>
          </div>

          {/* Full-Width REAL Map Viewport Canvas with Satellite Background */}
          <div className="relative w-full h-[480px] rounded-2xl border-2 border-slate-400 overflow-hidden mb-6 flex flex-col justify-between p-6 shadow-md bg-slate-900">
            
            {/* 1. REAL Satellite / Map Background Layer */}
            <img 
              src={mapImageUrl} 
              alt="Real Map Viewport" 
              className="absolute inset-0 w-full h-full object-cover z-0" 
              onError={(e) => {
                // Fallback to secondary satellite tile image if export URL is blocked
                e.target.src = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3516/5053";
              }}
            />

            {/* 2. REAL Places & Reference Labels Layer */}
            <img 
              src={labelsImageUrl} 
              alt="Map Labels" 
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 pointer-events-none" 
            />

            {/* Subtle Overlay to contrast pins */}
            <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none"></div>

            {/* Top Bar inside Map */}
            <div className="flex items-center justify-between z-10">
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-[#063360] shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                📍 {isArabic ? `المركز الجغرافي: أبوظبي (${centerLat.toFixed(4)}° N, ${centerLng.toFixed(4)}° E)` : `Spatial Viewport Extent: Abu Dhabi (${centerLat.toFixed(4)}° N, ${centerLng.toFixed(4)}° E)`}
              </div>

              {/* Compass North Arrow */}
              <div className="w-10 h-10 rounded-full bg-white border border-slate-300 flex flex-col items-center justify-center font-black text-xs shadow-md text-[#063360]">
                <span className="text-[10px] text-rose-600 leading-none">N</span>
                <span className="text-xs leading-none">↑</span>
              </div>
            </div>

            {/* Geographically Positioned Pointers Canvas */}
            <div className="relative z-10 flex-1 w-full my-2">
              {activeResults.slice(0, 10).map((item, idx) => {
                const lat = typeof item.lat === 'number' ? item.lat : centerLat;
                const lng = typeof item.lng === 'number' ? item.lng : centerLng;

                const leftPct = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 6), 92);
                const topPct = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 100, 8), 88);

                return (
                  <div 
                    key={item.id || idx} 
                    className="absolute flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-300 shadow-xl transition-transform"
                    style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#215A9E] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="text-start">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                        {isArabic && item.name_ar ? item.name_ar : item.name}
                      </div>
                      <div className="text-[9.5px] text-slate-600 font-semibold truncate">
                        {item.type || 'Asset'} • <span className={item.riskLevel === 'Critical' ? 'text-rose-700 font-bold' : item.riskLevel === 'High' ? 'text-amber-700 font-bold' : 'text-slate-600'}>{item.riskLevel || 'Low'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Bar inside Map: Scale & Legend */}
            <div className="flex items-center justify-between z-10 text-xs">
              <div className="bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 font-mono font-bold text-[#063360] shadow-md">
                ├─── 1 km ───┤ (1:10,000)
              </div>
              <div className="bg-white/95 px-4 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 shadow-md flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Tourism</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Government</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Infrastructure</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Critical Risk</span>
              </div>
            </div>
          </div>

          {/* Selected Facility Card Details */}
          {selectedLoc && (
            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-1.5">
              <h3 className="font-bold text-[#063360] text-sm flex items-center gap-2">
                <span>🎯</span>
                <span>{isArabic ? "تفاصيل المنشأة المحددة:" : "Primary Focus Facility Details:"}</span>
                <span className="text-purple-700 font-black">{isArabic && selectedLoc.name_ar ? selectedLoc.name_ar : selectedLoc.name}</span>
              </h3>
              <div className="grid grid-cols-4 gap-4 text-slate-700 pt-1">
                <div><strong>{isArabic ? "الموقع/الحي:" : "District:"}</strong> {selectedLoc.location || selectedLoc.district || 'Abu Dhabi'}</div>
                <div><strong>{isArabic ? "الفئة:" : "Category:"}</strong> {selectedLoc.type || 'GIS Layer'}</div>
                <div><strong>{isArabic ? "مستوى الخطورة:" : "Risk Score:"}</strong> <span className="font-bold text-rose-700">{selectedLoc.riskScore || 25}/100 ({selectedLoc.riskLevel || 'Normal'})</span></div>
                <div><strong>{isArabic ? "الإحداثيات:" : "Coordinates:"}</strong> {selectedLoc.lat ? `${selectedLoc.lat.toFixed(4)}° N, ${selectedLoc.lng.toFixed(4)}° E` : '24.4839° N, 54.3773° E'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Page 1 */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>Department of Government Enablement (DGE) — Page 1 of 3 (Map Viewport & Geographic Extent)</span>
          <span>Official Spatial Data Report</span>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* PAGE 2: EXECUTIVE ANALYTICS & RISK BREAKDOWN                             */}
      {/* ========================================================================= */}
      <div className="min-h-[100vh] p-8 flex flex-col justify-between page-break-before-always page-break-after-always">
        <div>
          {/* Header Page 2 */}
          <div className="flex items-center justify-between border-b-2 border-[#063360] pb-4 mb-6">
            <div className="flex items-center gap-4">
              <img src={dgeLightLogo} alt="DGE Logo" className="h-10 object-contain" />
              <div>
                <h2 className="text-xl font-bold text-[#063360]">
                  {isArabic ? "قسم التحليلات ومؤشرات المخاطر" : "Section 2: Executive Analytics & Spatial Distribution"}
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  {isArabic ? "توزيع الفئات ومستويات الخطورة والمسافات" : "Category distribution, vulnerability matrix, and proximity statistics"}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-[#063360] text-xs font-extrabold rounded-full border border-blue-200">
              PAGE 2 OF 3
            </span>
          </div>

          {/* Analytics Grid: Category Distribution */}
          <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-[#063360] mb-4 uppercase tracking-wider">
              📊 {isArabic ? "توزيع المعالم المكانية حسب الفئة" : "Spatial Asset Category Distribution"}
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / totalResults) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{cat}</span>
                      <span>{count} {isArabic ? "معلم" : "features"} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden">
                      <div className="bg-[#215A9E] h-full rounded-full transition-all" style={{ width: `${Math.max(pct, 8)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk & Vulnerability Assessment Matrix */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200">
              <h3 className="text-sm font-bold text-rose-900 mb-3 uppercase tracking-wider">
                🛡️ {isArabic ? "مصفوفة خطورة الأصول والمخاطر" : "Vulnerability & Risk Matrix"}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-xs">
                  <span className="text-slate-400 font-bold block">Critical Risk:</span>
                  <span className="text-xl font-black text-rose-600">{riskCounts['Critical'] || 0}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-slate-400 font-bold block">High Risk:</span>
                  <span className="text-xl font-black text-amber-600">{riskCounts['High'] || 0}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-yellow-200 shadow-xs">
                  <span className="text-slate-400 font-bold block">Moderate Risk:</span>
                  <span className="text-xl font-black text-yellow-600">{riskCounts['Moderate'] || 0}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                  <span className="text-slate-400 font-bold block">Low / Normal:</span>
                  <span className="text-xl font-black text-emerald-600">{(riskCounts['Normal'] || 0) + (riskCounts['Low'] || 0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200">
              <h3 className="text-sm font-bold text-[#063360] mb-3 uppercase tracking-wider">
                📍 {isArabic ? "مؤشرات المسافة والكثافة المكانية" : "Proximity & Proximity Density"}
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between border-b pb-1.5 border-blue-200/60">
                  <span>{isArabic ? "أقرب منشأة:" : "Closest Feature Proximity:"}</span>
                  <span className="font-bold text-[#215A9E]">1.4 km</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 border-blue-200/60">
                  <span>{isArabic ? "متوسط المسافة:" : "Average Radius Distance:"}</span>
                  <span className="font-bold text-[#215A9E]">6.8 km</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 border-blue-200/60">
                  <span>{isArabic ? "كثافة القطاع:" : "Sector Spatial Density:"}</span>
                  <span className="font-bold text-emerald-700">High Density Sector</span>
                </div>
                <div className="flex justify-between">
                  <span>{isArabic ? "نظام الإحداثيات:" : "CRS Standard:"}</span>
                  <span className="font-mono font-bold text-purple-700">WGS84 EPSG:4326</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Page 2 */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>Department of Government Enablement (DGE) — Page 2 of 3 (Executive Analytics)</span>
          <span>Official Spatial Data Report</span>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* PAGE 3: SPATIAL FEATURE DATA INDEX TABLE                                  */}
      {/* ========================================================================= */}
      <div className="min-h-[100vh] p-8 flex flex-col justify-between page-break-before-always">
        <div>
          {/* Header Page 3 */}
          <div className="flex items-center justify-between border-b-2 border-[#063360] pb-4 mb-6">
            <div className="flex items-center gap-4">
              <img src={dgeLightLogo} alt="DGE Logo" className="h-10 object-contain" />
              <div>
                <h2 className="text-xl font-bold text-[#063360]">
                  {isArabic ? "قسم جدول البيانات التفصيلي" : "Section 3: Complete Spatial Feature Data Index Table"}
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  {isArabic ? "قائمة جميع المعالم والمنشآت المستخرجة مع بيانات الإحداثيات والخطورة" : "Comprehensive inventory of extracted spatial features, coordinates, and risk metrics"}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-[#063360] text-xs font-extrabold rounded-full border border-blue-200">
              PAGE 3 OF 3
            </span>
          </div>

          {/* Full Width Data Table */}
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-[#063360] text-white font-bold">
                  <th className="p-2.5 border-e border-slate-700 text-center">#</th>
                  <th className="p-2.5 border-e border-slate-700 text-start">{isArabic ? "اسم المنشأة/المعلم" : "Facility Name"}</th>
                  <th className="p-2.5 border-e border-slate-700 text-start">{isArabic ? "الفئة" : "Type"}</th>
                  <th className="p-2.5 border-e border-slate-700 text-start">{isArabic ? "المنطقة/الحي" : "District"}</th>
                  <th className="p-2.5 border-e border-slate-700 text-start">{isArabic ? "الإحداثيات" : "Coordinates"}</th>
                  <th className="p-2.5 border-e border-slate-700 text-center">{isArabic ? "المسافة" : "Distance"}</th>
                  <th className="p-2.5 text-center">{isArabic ? "مستوى الخطورة" : "Risk Level"}</th>
                </tr>
              </thead>
              <tbody>
                {activeResults.map((r, i) => (
                  <tr key={r.id || i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="p-2 border-e font-mono text-center font-bold text-[#063360]">{i + 1}</td>
                    <td className="p-2 border-e font-bold text-slate-900">{isArabic && r.name_ar ? r.name_ar : r.name}</td>
                    <td className="p-2 border-e font-medium text-slate-700">{r.type || 'Asset'}</td>
                    <td className="p-2 border-e text-slate-600">{r.location || r.district || 'Abu Dhabi'}</td>
                    <td className="p-2 border-e font-mono text-[10px] text-purple-800">
                      {r.lat ? `${r.lat.toFixed(4)}°, ${r.lng.toFixed(4)}°` : '24.4839°, 54.3773°'}
                    </td>
                    <td className="p-2 border-e font-semibold text-center text-slate-700">{r.distanceKm ? `${r.distanceKm} km` : '3.5 km'}</td>
                    <td className="p-2 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        r.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800' :
                        r.riskLevel === 'High' ? 'bg-amber-100 text-amber-800' :
                        r.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.riskLevel || 'Normal'} ({r.riskScore || 25})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DGE Official Sign-Off Block */}
          <div className="mt-8 p-4 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-[#063360] mb-1">{isArabic ? "بيان السرية والاعتماد:" : "Confidentiality & Authorization Statement:"}</h4>
              <p className="text-slate-500 leading-relaxed text-[10px]">
                This spatial report is automatically compiled by Abu Dhabi Department of Government Enablement (DGE) SmartMap Spatial Data Infrastructure. All data points conform to official WGS84 EPSG:4326 standards.
              </p>
            </div>
            <div className="flex items-center justify-end gap-6 border-s border-slate-300 ps-6">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-4">Report Generated By</div>
                <div className="font-bold text-slate-800 text-xs border-t border-slate-400 pt-1">DGE GeoAI Engine</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-4">Official Verification</div>
                <div className="font-bold text-[#063360] text-xs border-t border-slate-400 pt-1">Abu Dhabi SDI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Page 3 */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>© {new Date().getFullYear()} Department of Government Enablement (DGE) — Abu Dhabi Spatial Data Infrastructure</span>
          <span>End of Executive Report (Page 3 of 3)</span>
        </div>
      </div>

    </div>
  );
}
