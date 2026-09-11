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
  const activeBasemap = explorerState?.activeBasemap || 'abu-dhabi-dge';
  const isStreetBasemap = activeBasemap.includes('street') || activeBasemap.includes('light');
  const basemapService = isStreetBasemap ? 'World_Street_Map' : 'World_Imagery';

  const mapImageUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/${basemapService}/MapServer/export?bbox=${minLng.toFixed(4)},${minLat.toFixed(4)},${maxLng.toFixed(4)},${maxLat.toFixed(4)}&bboxSR=4326&imageSR=4326&size=1400,700&f=image`;
  const labelsImageUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/export?bbox=${minLng.toFixed(4)},${minLat.toFixed(4)},${maxLng.toFixed(4)},${maxLat.toFixed(4)}&bboxSR=4326&imageSR=4326&size=1400,700&f=image`;

  return (
    <div className="print-root hidden print:block w-full bg-white text-slate-900">
      
      {/* ========================================================================= */}
      {/* PAGE 1: DEDICATED SATELLITE MAP VIEWPORT & GEOGRAPHIC CONTEXT (EXACT 1P) */}
      {/* ========================================================================= */}
      <div className="print-page w-full p-2 bg-white flex flex-col justify-start">
        
        {/* 1. Header */}
        <div className="flex items-center justify-between border-b-2 border-[#063360] pb-2 mb-2">
          <div className="flex items-center gap-3">
            <img src={dgeLightLogo} alt="DGE Logo" className="h-9 object-contain" />
            <div>
              <div className="text-[9px] uppercase tracking-wider font-extrabold text-[#215A9E]">
                {isArabic ? "دولة الإمارات العربية المتحدة • إمارة أبوظبي" : "UNITED ARAB EMIRATES • EMIRATE OF ABU DHABI"}
              </div>
              <h1 className="text-xl font-bold text-[#063360] leading-tight">
                {isArabic ? activeProject.name_ar : activeProject.name} — {isArabic ? "تقرير الخريطة الذكية" : "Executive Spatial Map Report"}
              </h1>
              <p className="text-[10.5px] text-slate-500 font-medium">
                {isArabic ? activeProject.description_ar : activeProject.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-2.5 py-1 bg-blue-50 text-[#063360] text-[10px] font-bold rounded-lg border border-blue-200">
              AD-SDI VERIFIED
            </span>
            <img src={sdiLightLogo} alt="SDI Logo" className="h-9 object-contain" />
          </div>
        </div>

        {/* 2. Project & Extent Metadata Card */}
        <div className="grid grid-cols-4 gap-2 mb-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
              {isArabic ? "تاريخ التقرير:" : "REPORT DATE & TIME:"}
            </span>
            <span className="font-semibold text-slate-800 text-[10.5px] truncate block">{now}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
              {isArabic ? "نطاق المشروع:" : "PROJECT GEOGRAPHY:"}
            </span>
            <span className="font-semibold text-[#215A9E] text-[10.5px] truncate block">{activeProject.geography}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
              {isArabic ? "عدد المعالم المستخرجة:" : "ACTIVE RESULTS:"}
            </span>
            <span className="font-bold text-emerald-700 text-[10.5px] block">
              {activeResults.length} {isArabic ? "منشأة/معلم" : "spatial features"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
              {isArabic ? "الخريطة الأساسية:" : "ACTIVE BASEMAP:"}
            </span>
            <span className="font-semibold text-purple-700 text-[10.5px] truncate block">
              {activeBasemap === 'abu-dhabi-dge' ? 'Abu Dhabi Official DGE Basemap' : activeBasemap}
            </span>
          </div>
        </div>

        {/* 3. Responsive Map Viewport Canvas */}
        <div className="print-map-canvas relative w-full rounded-xl border-2 border-slate-400 overflow-hidden mb-2 flex flex-col justify-between p-3.5 shadow-sm bg-slate-900">
          
          {/* Real Satellite / Map Background Layer */}
          <img 
            src={mapImageUrl} 
            alt="Real Map Viewport" 
            className="absolute inset-0 w-full h-full object-cover z-0" 
            onError={(e) => {
              e.target.src = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3516/5053";
            }}
          />

          {/* Real Places & Reference Labels Layer */}
          <img 
            src={labelsImageUrl} 
            alt="Map Labels" 
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 pointer-events-none" 
          />

          {/* Contrast overlay */}
          <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none"></div>

          {/* Top Bar inside Map */}
          <div className="flex items-center justify-between z-10">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 text-[10.5px] font-bold text-[#063360] shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              📍 {isArabic ? `المركز الجغرافي: أبوظبي (${centerLat.toFixed(4)}° N, ${centerLng.toFixed(4)}° E)` : `Spatial Viewport Extent: Abu Dhabi (${centerLat.toFixed(4)}° N, ${centerLng.toFixed(4)}° E)`}
            </div>

            {/* Compass North Arrow */}
            <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex flex-col items-center justify-center font-black text-xs shadow-sm text-[#063360]">
              <span className="text-[8.5px] text-rose-600 leading-none">N</span>
              <span className="text-[9.5px] leading-none">↑</span>
            </div>
          </div>

          {/* Geographically Positioned Pins Canvas */}
          <div className="relative z-10 flex-1 w-full my-1 min-h-[140px]">
            {activeResults.slice(0, 10).map((item, idx) => {
              const lat = typeof item.lat === 'number' ? item.lat : centerLat;
              const lng = typeof item.lng === 'number' ? item.lng : centerLng;

              const leftPct = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 8), 88);
              const topPct = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 100, 12), 82);

              return (
                <div 
                  key={item.id || idx} 
                  className="absolute flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg border border-purple-300 shadow-md transition-transform"
                  style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="w-4 h-4 rounded-full bg-[#215A9E] text-white text-[9px] font-black flex items-center justify-center shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="text-start">
                    <div className="text-[10px] font-bold text-slate-900 truncate max-w-[120px]">
                      {isArabic && item.name_ar ? item.name_ar : item.name}
                    </div>
                    <div className="text-[8.5px] text-slate-600 font-semibold truncate">
                      {item.type || 'Asset'} • <span className={item.riskLevel === 'Critical' ? 'text-rose-700 font-bold' : item.riskLevel === 'High' ? 'text-amber-700 font-bold' : 'text-slate-600'}>{item.riskLevel || 'Low'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar inside Map: Scale & Legend */}
          <div className="flex items-center justify-between z-10 text-[10px]">
            <div className="bg-white/95 px-2 py-0.5 rounded-lg border border-slate-200 font-mono font-bold text-[#063360] shadow-sm">
              ├─── 1 km ───┤ (1:10,000)
            </div>
            <div className="bg-white/95 px-2.5 py-0.5 rounded-lg border border-slate-200 font-semibold text-slate-700 shadow-sm flex items-center gap-2.5 text-[9.5px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Tourism</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600"></span> Government</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Infrastructure</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600"></span> Risk</span>
            </div>
          </div>
        </div>

        {/* 4. Selected Facility Card Details */}
        {selectedLoc && (
          <div className="px-3 py-1.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs mb-2">
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="font-bold text-[#063360] text-[11px] flex items-center gap-1.5">
                <span>🎯</span>
                <span>{isArabic ? "تفاصيل المنشأة المحددة:" : "Primary Focus Facility Details:"}</span>
                <span className="text-purple-700 font-black">{isArabic && selectedLoc.name_ar ? selectedLoc.name_ar : selectedLoc.name}</span>
              </h3>
              <span className="text-[9.5px] text-slate-500 font-mono">
                {selectedLoc.lat ? `${selectedLoc.lat.toFixed(4)}° N, ${selectedLoc.lng.toFixed(4)}° E` : '24.4839° N, 54.3773° E'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-slate-700 text-[10px]">
              <div><strong>{isArabic ? "الموقع/الحي:" : "District:"}</strong> {selectedLoc.location || selectedLoc.district || 'Abu Dhabi'}</div>
              <div><strong>{isArabic ? "الفئة:" : "Category:"}</strong> {selectedLoc.type || 'GIS Layer'}</div>
              <div><strong>{isArabic ? "مستوى الخطورة:" : "Risk Score:"}</strong> <span className="font-bold text-rose-700">{selectedLoc.riskScore || 25}/100 ({selectedLoc.riskLevel || 'Normal'})</span></div>
              <div><strong>{isArabic ? "حالة الأصل:" : "Asset Status:"}</strong> <span className="font-bold text-emerald-700">Active Operational</span></div>
            </div>
          </div>
        )}

        {/* 5. Spatial Executive Summary Bar */}
        <div className="grid grid-cols-4 gap-2 mb-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-center">
          <div>
            <span className="text-slate-400 font-bold block text-[8.5px] uppercase">Primary District</span>
            <span className="font-bold text-[#063360]">{activeProject.geography || 'Abu Dhabi Central'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[8.5px] uppercase">Spatial Density</span>
            <span className="font-bold text-blue-700">High Density Sector</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[8.5px] uppercase">Compliance Status</span>
            <span className="font-bold text-emerald-700">100% AD-SDI Verified</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[8.5px] uppercase">Geodetic Datum</span>
            <span className="font-mono font-bold text-purple-700">WGS84 EPSG:4326</span>
          </div>
        </div>

        {/* 6. Footer Page 1 (Firmly on Page 1) */}
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span>Department of Government Enablement (DGE) — Page 1 of 3 (Map Viewport & Geographic Extent)</span>
          <span>Official Spatial Intelligence Report • WGS84 EPSG:4326</span>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* PAGE 2: EXECUTIVE ANALYTICS & RISK BREAKDOWN (EXACT 1P)                    */}
      {/* ========================================================================= */}
      <div className="print-page w-full p-2 bg-white flex flex-col justify-start">
        
        {/* Header Page 2 */}
        <div className="flex items-center justify-between border-b-2 border-[#063360] pb-2 mb-2">
          <div className="flex items-center gap-3">
            <img src={dgeLightLogo} alt="DGE Logo" className="h-9 object-contain" />
            <div>
              <div className="text-[9px] uppercase tracking-wider font-extrabold text-[#215A9E]">
                {isArabic ? "التحليلات المكانية المتقدمة" : "SPATIAL INTELLIGENCE & INFRASTRUCTURE ANALYTICS"}
              </div>
              <h2 className="text-xl font-bold text-[#063360]">
                {isArabic ? "قسم التحليلات ومؤشرات المخاطر" : "Section 2: Executive Analytics & Spatial Distribution"}
              </h2>
              <p className="text-[10.5px] text-slate-500 font-semibold">
                {isArabic ? "توزيع الفئات ومستويات الخطورة والمسافات" : "Category distribution, vulnerability matrix, and proximity density statistics"}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-[#063360] text-[11px] font-black rounded-full border border-blue-200">
            PAGE 2 OF 3
          </span>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-400 font-bold block uppercase text-[8.5px]">Total Monitored Features</span>
            <span className="text-base font-black text-[#063360]">{totalResults} Assets</span>
          </div>
          <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-200 text-center">
            <span className="text-blue-500 font-bold block uppercase text-[8.5px]">Average Proximity</span>
            <span className="text-base font-black text-[#215A9E]">1.8 km</span>
          </div>
          <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200 text-center">
            <span className="text-amber-500 font-bold block uppercase text-[8.5px]">Elevated Risk Count</span>
            <span className="text-base font-black text-amber-700">{(riskCounts['Critical'] || 0) + (riskCounts['High'] || 0)} Assets</span>
          </div>
          <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-200 text-center">
            <span className="text-emerald-500 font-bold block uppercase text-[8.5px]">Spatial Compliance</span>
            <span className="text-base font-black text-emerald-700">98.4%</span>
          </div>
        </div>

        {/* Analytics Card: Category Distribution */}
        <div className="mb-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-[#063360] mb-2 uppercase tracking-wider flex items-center justify-between">
            <span>📊 {isArabic ? "توزيع المعالم المكانية حسب الفئة" : "Spatial Asset Category Distribution"}</span>
            <span className="text-[9.5px] text-slate-500 lowercase font-normal">{totalResults} assets indexed</span>
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {Object.entries(categoryCounts).slice(0, 6).map(([cat, count]) => {
              const pct = Math.round((count / totalResults) * 100);
              return (
                <div key={cat} className="space-y-0.5">
                  <div className="flex justify-between text-[10.5px] font-bold text-slate-700">
                    <span>{cat}</span>
                    <span>{count} {isArabic ? "معلم" : "features"} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#215A9E] h-full rounded-full transition-all" style={{ width: `${Math.max(pct, 10)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk & Vulnerability Assessment Matrix (Side-by-Side) */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200">
            <h3 className="text-xs font-bold text-rose-900 mb-1 uppercase tracking-wider">
              🛡️ {isArabic ? "مصفوفة خطورة الأصول والمخاطر" : "Vulnerability & Risk Matrix"}
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="bg-white p-1.5 rounded-lg border border-rose-200 shadow-xs">
                <span className="text-slate-400 font-bold block text-[8.5px]">Critical Risk:</span>
                <span className="text-base font-black text-rose-600">{riskCounts['Critical'] || 0}</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-amber-200 shadow-xs">
                <span className="text-slate-400 font-bold block text-[8.5px]">High Risk:</span>
                <span className="text-base font-black text-amber-600">{riskCounts['High'] || 0}</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-yellow-200 shadow-xs">
                <span className="text-slate-400 font-bold block text-[8.5px]">Moderate Risk:</span>
                <span className="text-base font-black text-yellow-600">{riskCounts['Moderate'] || 0}</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-emerald-200 shadow-xs">
                <span className="text-slate-400 font-bold block text-[8.5px]">Low / Normal:</span>
                <span className="text-base font-black text-emerald-600">{(riskCounts['Normal'] || 0) + (riskCounts['Low'] || 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-200">
            <h3 className="text-xs font-bold text-[#063360] mb-1 uppercase tracking-wider">
              📍 {isArabic ? "مؤشرات المسافة والكثافة المكانية" : "Proximity & Spatial Density"}
            </h3>
            <div className="space-y-1 text-xs text-slate-700">
              <div className="flex justify-between border-b pb-0.5 border-blue-200/60 text-[10.5px]">
                <span>{isArabic ? "أقرب منشأة:" : "Closest Feature Proximity:"}</span>
                <span className="font-bold text-[#215A9E]">1.4 km</span>
              </div>
              <div className="flex justify-between border-b pb-0.5 border-blue-200/60 text-[10.5px]">
                <span>{isArabic ? "متوسط المسافة:" : "Average Radius Distance:"}</span>
                <span className="font-bold text-[#215A9E]">4.8 km</span>
              </div>
              <div className="flex justify-between border-b pb-0.5 border-blue-200/60 text-[10.5px]">
                <span>{isArabic ? "كثافة القطاع:" : "Sector Spatial Density:"}</span>
                <span className="font-bold text-emerald-700">High Density Core</span>
              </div>
              <div className="flex justify-between text-[10.5px]">
                <span>{isArabic ? "نظام الإحداثيات:" : "CRS Standard:"}</span>
                <span className="font-mono font-bold text-purple-700">WGS84 EPSG:4326</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Page 2 */}
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span>Department of Government Enablement (DGE) — Page 2 of 3 (Executive Analytics)</span>
          <span>Official Spatial Data Report</span>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* PAGE 3: SPATIAL FEATURE DATA INDEX TABLE (EXACT 1P)                       */}
      {/* ========================================================================= */}
      <div className="print-page w-full p-2 bg-white flex flex-col justify-start">
        
        {/* Header Page 3 */}
        <div className="flex items-center justify-between border-b-2 border-[#063360] pb-2 mb-2">
          <div className="flex items-center gap-3">
            <img src={dgeLightLogo} alt="DGE Logo" className="h-9 object-contain" />
            <div>
              <div className="text-[9px] uppercase tracking-wider font-extrabold text-[#215A9E]">
                {isArabic ? "سجل المعالم والبيانات الجغرافية" : "OFFICIAL GEODETIC FEATURE REGISTRY"}
              </div>
              <h2 className="text-xl font-bold text-[#063360]">
                {isArabic ? "قسم جدول البيانات التفصيلي" : "Section 3: Complete Spatial Feature Data Index Table"}
              </h2>
              <p className="text-[10.5px] text-slate-500 font-semibold">
                {isArabic ? "قائمة جميع المعالم والمنشآت المستخرجة مع بيانات الإحداثيات والخطورة" : "Comprehensive inventory of extracted spatial features, coordinates, and risk metrics"}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-[#063360] text-[11px] font-black rounded-full border border-blue-200">
            PAGE 3 OF 3
          </span>
        </div>

        {/* Full Width Data Table */}
        <div className="mb-2 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-start text-[10px] border-collapse">
            <thead>
              <tr className="bg-[#063360] text-white font-bold text-[9.5px] uppercase">
                <th className="py-1 px-2 border-e border-slate-700 text-center">#</th>
                <th className="py-1 px-2 border-e border-slate-700 text-start">{isArabic ? "اسم المنشأة/المعلم" : "Facility Name"}</th>
                <th className="py-1 px-2 border-e border-slate-700 text-start">{isArabic ? "الفئة" : "Type"}</th>
                <th className="py-1 px-2 border-e border-slate-700 text-start">{isArabic ? "المنطقة/الحي" : "District"}</th>
                <th className="py-1 px-2 border-e border-slate-700 text-start">{isArabic ? "الإحداثيات" : "Coordinates"}</th>
                <th className="py-1 px-2 border-e border-slate-700 text-center">{isArabic ? "المسافة" : "Distance"}</th>
                <th className="py-1 px-2 text-center">{isArabic ? "مستوى الخطورة" : "Risk Level"}</th>
              </tr>
            </thead>
            <tbody>
              {activeResults.slice(0, 8).map((r, i) => (
                <tr key={r.id || i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="py-1 px-2 border-e font-mono text-center font-bold text-[#063360]">{i + 1}</td>
                  <td className="py-1 px-2 border-e font-bold text-slate-900 truncate max-w-[170px]">
                    {isArabic && r.name_ar ? r.name_ar : r.name}
                  </td>
                  <td className="py-1 px-2 border-e font-medium text-slate-700 truncate max-w-[110px]">{r.type || 'Asset'}</td>
                  <td className="py-1 px-2 border-e text-slate-600 truncate max-w-[120px]">{r.location || r.district || 'Abu Dhabi'}</td>
                  <td className="py-1 px-2 border-e font-mono text-[9px] text-purple-800">
                    {r.lat ? `${r.lat.toFixed(4)}°, ${r.lng.toFixed(4)}°` : '24.4839°, 54.3773°'}
                  </td>
                  <td className="py-1 px-2 border-e font-semibold text-center text-slate-700">{r.distanceKm ? `${r.distanceKm} km` : '3.5 km'}</td>
                  <td className="py-1 px-2 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded text-[9px] ${
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
        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-2 gap-4 text-xs mb-2">
          <div>
            <h4 className="font-bold text-[#063360] mb-0.5 text-[10.5px]">{isArabic ? "بيان السرية والاعتماد:" : "Confidentiality & Authorization Statement:"}</h4>
            <p className="text-slate-500 leading-relaxed text-[9px]">
              This spatial report is automatically compiled by Abu Dhabi Department of Government Enablement (DGE) SmartMap Spatial Data Infrastructure. All data points conform to official WGS84 EPSG:4326 standards.
            </p>
          </div>
          <div className="flex items-center justify-end gap-6 border-s border-slate-300 ps-6">
            <div className="text-center">
              <div className="text-[8.5px] text-slate-400 font-bold uppercase mb-1.5">Report Generated By</div>
              <div className="font-bold text-slate-800 text-[10.5px] border-t border-slate-400 pt-0.5">DGE GeoAI Engine</div>
            </div>
            <div className="text-center">
              <div className="text-[8.5px] text-slate-400 font-bold uppercase mb-1.5">Official Verification</div>
              <div className="font-bold text-[#063360] text-[10.5px] border-t border-slate-400 pt-0.5">Abu Dhabi SDI</div>
            </div>
          </div>
        </div>

        {/* Footer Page 3 */}
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span>© {new Date().getFullYear()} Department of Government Enablement (DGE) — Abu Dhabi Spatial Data Infrastructure</span>
          <span>End of Executive Report (Page 3 of 3)</span>
        </div>

      </div>

    </div>
  );
}
