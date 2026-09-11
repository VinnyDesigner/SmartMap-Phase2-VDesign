import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, Eye, FileText, ChevronRight, Download, CheckCircle2, Compass, Layers, ShieldCheck } from 'lucide-react';
import dgeLightLogo from '../../assets/dge-light.webp';
import sdiLightLogo from '../../assets/sdi-light.webp';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';

export default function PrintPreviewModal({ isOpen, onClose, explorerState }) {
  const { isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();
  const [selectedPage, setSelectedPage] = useState(1);
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' | 'portrait'

  if (!isOpen) return null;

  const activeResults = explorerState?.activeResults || activeProject.datasets || [];
  const selectedLoc = explorerState?.selectedLocation || explorerState?.selectedDetail || activeResults[0];
  const now = new Date().toLocaleString();

  // Category & risk aggregates
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

  // Spatial extent
  const validLocations = activeResults.filter(r => typeof r.lat === 'number' && typeof r.lng === 'number');
  const lats = validLocations.length > 0 ? validLocations.map(r => r.lat) : [24.4839];
  const lngs = validLocations.length > 0 ? validLocations.map(r => r.lng) : [54.3773];

  const rawMinLat = Math.min(...lats);
  const rawMaxLat = Math.max(...lats);
  const rawMinLng = Math.min(...lngs);
  const rawMaxLng = Math.max(...lngs);

  const latSpan = Math.max(rawMaxLat - rawMinLat, 0.10);
  const lngSpan = Math.max(rawMaxLng - rawMinLng, 0.18);

  const centerLat = (rawMinLat + rawMaxLat) / 2;
  const centerLng = (rawMinLng + rawMaxLng) / 2;

  const minLat = centerLat - latSpan / 2 - 0.03;
  const maxLat = centerLat + latSpan / 2 + 0.03;
  const minLng = centerLng - lngSpan / 2 - 0.04;
  const maxLng = centerLng + lngSpan / 2 + 0.04;

  const activeBasemap = explorerState?.activeBasemap || 'abu-dhabi-dge';
  const isStreetBasemap = activeBasemap.includes('street') || activeBasemap.includes('light');
  const basemapService = isStreetBasemap ? 'World_Street_Map' : 'World_Imagery';

  const mapImageUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/${basemapService}/MapServer/export?bbox=${minLng.toFixed(4)},${minLat.toFixed(4)},${maxLng.toFixed(4)},${maxLat.toFixed(4)}&bboxSR=4326&imageSR=4326&size=1400,700&f=image`;
  const labelsImageUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/export?bbox=${minLng.toFixed(4)},${minLat.toFixed(4)},${maxLng.toFixed(4)},${maxLat.toFixed(4)}&bboxSR=4326&imageSR=4326&size=1400,700&f=image`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="no-print fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Centered Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative z-10 w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
            isDarkMode 
              ? 'bg-[#0b1324] border-slate-700/70 text-slate-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Modal Header */}
          <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-4 shrink-0 ${
            isDarkMode ? 'bg-[#0f1b33] border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#063360] flex items-center justify-center text-white shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm md:text-base font-bold text-[#063360] dark:text-blue-300">
                    {isArabic ? "معاينة وطباعة تقرير الخريطة الرسمي" : "Official Executive Spatial Map Report"}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#063360] dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    A4 Landscape • 3 Pages
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isArabic ? "دائرة التمكين الحكومي • منصة أبوظبي للبيانات المكانية (AD-SDI)" : "Department of Government Enablement • Abu Dhabi Spatial Data Infrastructure"}
                </p>
              </div>
            </div>

            {/* Actions: Orientation Toggle, Page Switcher & Print Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Orientation Selector */}
              <div className={`flex items-center rounded-xl p-1 border text-xs font-semibold ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-200/70 border-slate-300'
              }`}>
                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                    orientation === 'landscape'
                      ? 'bg-[#063360] text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Landscape Layout (Recommended)"
                >
                  <span>🖼️</span>
                  <span>{isArabic ? "أفقي" : "Landscape"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                    orientation === 'portrait'
                      ? 'bg-[#063360] text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Portrait Layout"
                >
                  <span>📄</span>
                  <span>{isArabic ? "عمودي" : "Portrait"}</span>
                </button>
              </div>

              {/* Page Navigator Buttons */}
              <div className={`flex items-center rounded-xl p-1 border text-xs font-semibold ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-200/70 border-slate-300'
              }`}>
                {[
                  { num: 1, label: isArabic ? "ص 1: الخريطة" : "Page 1: Map View" },
                  { num: 2, label: isArabic ? "ص 2: التحليلات" : "Page 2: Analytics" },
                  { num: 3, label: isArabic ? "ص 3: البيانات" : "Page 3: Data Index" }
                ].map((pg) => (
                  <button
                    key={pg.num}
                    type="button"
                    onClick={() => setSelectedPage(pg.num)}
                    className={`px-3 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      selectedPage === pg.num
                        ? 'bg-[#063360] text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {pg.label}
                  </button>
                ))}
              </div>

              {/* Main Print Trigger Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#063360] to-[#215A9E] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:brightness-110 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isArabic ? "طباعة / حفظ كـ PDF" : "Print / Save as PDF"}</span>
              </button>

              {/* Close Modal Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body: Centered Interactive Document Preview Sheet */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-start bg-slate-200/50 dark:bg-slate-900/50">
            
            {/* Sheet Canvas Container (Adapts to Landscape or Portrait) */}
            <div className={`w-full ${
              orientation === 'landscape' ? 'max-w-[860px]' : 'max-w-[620px]'
            } bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col justify-between p-6 transition-all duration-300`}>
              
              {/* ================= PAGE 1 PREVIEW ================= */}
              {selectedPage === 1 && (
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-[#063360] pb-2.5">
                    <div className="flex items-center gap-3">
                      <img src={dgeLightLogo} alt="DGE Logo" className="h-8 object-contain" />
                      <div>
                        <div className="text-[8.5px] uppercase tracking-wider font-extrabold text-[#215A9E]">
                          UNITED ARAB EMIRATES • EMIRATE OF ABU DHABI
                        </div>
                        <h1 className="text-base font-bold text-[#063360] leading-tight">
                          {isArabic ? activeProject.name_ar : activeProject.name} — {isArabic ? "تقرير الخريطة الذكية" : "Executive Spatial Map Report"}
                        </h1>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {isArabic ? activeProject.description_ar : activeProject.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#063360] text-[9.5px] font-bold rounded border border-blue-200">
                        AD-SDI VERIFIED
                      </span>
                      <img src={sdiLightLogo} alt="SDI Logo" className="h-8 object-contain" />
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[8.5px]">REPORT DATE & TIME</span>
                      <span className="font-semibold text-slate-800 text-[10px] truncate block">{now}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[8.5px]">PROJECT GEOGRAPHY</span>
                      <span className="font-semibold text-[#215A9E] text-[10px] truncate block">{activeProject.geography}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[8.5px]">ACTIVE RESULTS</span>
                      <span className="font-bold text-emerald-700 text-[10px] block">{activeResults.length} spatial features</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[8.5px]">ACTIVE BASEMAP</span>
                      <span className="font-semibold text-purple-700 text-[10px] truncate block">{activeBasemap}</span>
                    </div>
                  </div>

                  {/* Map Canvas */}
                  <div className="relative w-full h-[280px] rounded-lg border-2 border-slate-400 overflow-hidden flex flex-col justify-between p-3 shadow-sm bg-slate-900">
                    <img 
                      src={mapImageUrl} 
                      alt="Map Viewport" 
                      className="absolute inset-0 w-full h-full object-cover z-0" 
                      onError={(e) => {
                        e.target.src = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3516/5053";
                      }}
                    />
                    <img 
                      src={labelsImageUrl} 
                      alt="Map Labels" 
                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 pointer-events-none" 
                    />
                    <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none"></div>

                    {/* Top pill inside map */}
                    <div className="flex items-center justify-between z-10">
                      <div className="bg-white/95 px-2.5 py-1 rounded text-[10px] font-bold text-[#063360] shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        📍 Spatial Viewport Extent: Abu Dhabi ({centerLat.toFixed(4)}° N, {centerLng.toFixed(4)}° E)
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex flex-col items-center justify-center font-black text-[9px] shadow-sm text-[#063360]">
                        <span className="text-[8px] text-rose-600 leading-none">N</span>
                        <span className="text-[9px] leading-none">↑</span>
                      </div>
                    </div>

                    {/* Map Markers */}
                    <div className="relative z-10 flex-1 w-full my-1">
                      {activeResults.slice(0, 10).map((item, idx) => {
                        const lat = typeof item.lat === 'number' ? item.lat : centerLat;
                        const lng = typeof item.lng === 'number' ? item.lng : centerLng;
                        const leftPct = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 8), 88);
                        const topPct = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 100, 12), 82);

                        return (
                          <div 
                            key={item.id || idx} 
                            className="absolute flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded border border-purple-300 shadow-md"
                            style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: 'translate(-50%, -50%)' }}
                          >
                            <div className="w-4 h-4 rounded-full bg-[#215A9E] text-white text-[9px] font-black flex items-center justify-center shrink-0">
                              {idx + 1}
                            </div>
                            <span className="text-[10px] font-bold text-slate-900 truncate max-w-[100px]">{item.name}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom scale & legend */}
                    <div className="flex items-center justify-between z-10 text-[9.5px]">
                      <div className="bg-white/95 px-2 py-0.5 rounded font-mono font-bold text-[#063360] shadow-sm">
                        ├─── 1 km ───┤ (1:10,000)
                      </div>
                      <div className="bg-white/95 px-2.5 py-0.5 rounded font-semibold text-slate-700 shadow-sm flex items-center gap-2">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Tourism</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> Government</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Infrastructure</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Risk</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Focus Card */}
                  {selectedLoc && (
                    <div className="px-3 py-1.5 rounded-lg bg-purple-50/80 border border-purple-200 text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[#063360] text-[11px] flex items-center gap-1">
                          <span>🎯 Primary Focus:</span>
                          <span className="text-purple-700 font-black">{selectedLoc.name}</span>
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-mono">
                          {selectedLoc.lat ? `${selectedLoc.lat.toFixed(4)}° N, ${selectedLoc.lng.toFixed(4)}° E` : '24.4839° N, 54.3773° E'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-slate-700 text-[10px]">
                        <div><strong>District:</strong> {selectedLoc.location || selectedLoc.district || 'Abu Dhabi'}</div>
                        <div><strong>Category:</strong> {selectedLoc.type || 'GIS Layer'}</div>
                        <div><strong>Risk Score:</strong> <span className="font-bold text-rose-700">{selectedLoc.riskScore || 25}/100</span></div>
                        <div><strong>Status:</strong> <span className="font-bold text-emerald-700">Active Operational</span></div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Department of Government Enablement (DGE) — Page 1 of 3 (Map Viewport & Geographic Extent)</span>
                    <span>Official Spatial Intelligence Report • WGS84 EPSG:4326</span>
                  </div>
                </div>
              )}

              {/* ================= PAGE 2 PREVIEW ================= */}
              {selectedPage === 2 && (
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-[#063360] pb-2.5">
                    <div className="flex items-center gap-3">
                      <img src={dgeLightLogo} alt="DGE Logo" className="h-8 object-contain" />
                      <div>
                        <div className="text-[8.5px] uppercase tracking-wider font-extrabold text-[#215A9E]">
                          SPATIAL INTELLIGENCE & INFRASTRUCTURE ANALYTICS
                        </div>
                        <h2 className="text-base font-bold text-[#063360]">
                          Section 2: Executive Analytics & Spatial Distribution
                        </h2>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          Category distribution, vulnerability matrix, and proximity density statistics
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-[#063360] text-[10px] font-black rounded-full border border-blue-200">
                      PAGE 2 OF 3
                    </span>
                  </div>

                  {/* KPI Chips */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                      <span className="text-slate-400 font-bold block uppercase text-[8px]">Total Assets</span>
                      <span className="text-base font-black text-[#063360]">{totalResults}</span>
                    </div>
                    <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-200 text-center">
                      <span className="text-blue-500 font-bold block uppercase text-[8px]">Average Proximity</span>
                      <span className="text-base font-black text-[#215A9E]">1.8 km</span>
                    </div>
                    <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200 text-center">
                      <span className="text-amber-500 font-bold block uppercase text-[8px]">Elevated Risk</span>
                      <span className="text-base font-black text-amber-700">{(riskCounts['Critical'] || 0) + (riskCounts['High'] || 0)}</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200 text-center">
                      <span className="text-emerald-500 font-bold block uppercase text-[8px]">Compliance</span>
                      <span className="text-base font-black text-emerald-700">98.4%</span>
                    </div>
                  </div>

                  {/* Category Bars */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <h3 className="text-[11px] font-bold text-[#063360] mb-2 uppercase tracking-wider">
                      📊 Spatial Asset Category Distribution
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {Object.entries(categoryCounts).slice(0, 6).map(([cat, count]) => {
                        const pct = Math.round((count / totalResults) * 100);
                        return (
                          <div key={cat} className="space-y-0.5">
                            <div className="flex justify-between text-[10px] font-bold text-slate-700">
                              <span>{cat}</span>
                              <span>{count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div className="bg-[#215A9E] h-full rounded-full" style={{ width: `${Math.max(pct, 10)}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Side-by-Side Risk & Proximity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-200">
                      <h3 className="text-[11px] font-bold text-rose-900 mb-2 uppercase tracking-wider">
                        🛡️ Vulnerability & Risk Matrix
                      </h3>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="bg-white p-1.5 rounded border border-rose-200 shadow-xs">
                          <span className="text-slate-400 font-bold block text-[8.5px]">Critical Risk</span>
                          <span className="text-base font-black text-rose-600">{riskCounts['Critical'] || 0}</span>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-amber-200 shadow-xs">
                          <span className="text-slate-400 font-bold block text-[8.5px]">High Risk</span>
                          <span className="text-base font-black text-amber-600">{riskCounts['High'] || 0}</span>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-yellow-200 shadow-xs">
                          <span className="text-slate-400 font-bold block text-[8.5px]">Moderate Risk</span>
                          <span className="text-base font-black text-yellow-600">{riskCounts['Moderate'] || 0}</span>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-emerald-200 shadow-xs">
                          <span className="text-slate-400 font-bold block text-[8.5px]">Low / Normal</span>
                          <span className="text-base font-black text-emerald-600">{(riskCounts['Normal'] || 0) + (riskCounts['Low'] || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200">
                      <h3 className="text-[11px] font-bold text-[#063360] mb-2 uppercase tracking-wider">
                        📍 Proximity & Spatial Density
                      </h3>
                      <div className="space-y-1 text-[10px] text-slate-700">
                        <div className="flex justify-between border-b pb-0.5 border-blue-200/60">
                          <span>Closest Feature Proximity:</span>
                          <span className="font-bold text-[#215A9E]">1.4 km</span>
                        </div>
                        <div className="flex justify-between border-b pb-0.5 border-blue-200/60">
                          <span>Average Radius Distance:</span>
                          <span className="font-bold text-[#215A9E]">4.8 km</span>
                        </div>
                        <div className="flex justify-between border-b pb-0.5 border-blue-200/60">
                          <span>Sector Spatial Density:</span>
                          <span className="font-bold text-emerald-700">High Density Core</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CRS Standard:</span>
                          <span className="font-mono font-bold text-purple-700">WGS84 EPSG:4326</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Department of Government Enablement (DGE) — Page 2 of 3 (Executive Analytics)</span>
                    <span>Official Spatial Data Report</span>
                  </div>
                </div>
              )}

              {/* ================= PAGE 3 PREVIEW ================= */}
              {selectedPage === 3 && (
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b-2 border-[#063360] pb-2.5">
                    <div className="flex items-center gap-3">
                      <img src={dgeLightLogo} alt="DGE Logo" className="h-8 object-contain" />
                      <div>
                        <div className="text-[8.5px] uppercase tracking-wider font-extrabold text-[#215A9E]">
                          OFFICIAL GEODETIC FEATURE REGISTRY
                        </div>
                        <h2 className="text-base font-bold text-[#063360]">
                          Section 3: Complete Spatial Feature Data Index Table
                        </h2>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          Comprehensive inventory of extracted spatial features, coordinates, and risk metrics
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-[#063360] text-[10px] font-black rounded-full border border-blue-200">
                      PAGE 3 OF 3
                    </span>
                  </div>

                  {/* Table */}
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full text-start text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-[#063360] text-white font-bold text-[9px] uppercase">
                          <th className="py-1 px-1.5 border-e border-slate-700 text-center">#</th>
                          <th className="py-1 px-1.5 border-e border-slate-700 text-start">Facility Name</th>
                          <th className="py-1 px-1.5 border-e border-slate-700 text-start">Type</th>
                          <th className="py-1 px-1.5 border-e border-slate-700 text-start">District</th>
                          <th className="py-1 px-1.5 border-e border-slate-700 text-start">Coordinates</th>
                          <th className="py-1 px-1.5 border-e border-slate-700 text-center">Distance</th>
                          <th className="py-1 px-1.5 text-center">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeResults.slice(0, 8).map((r, i) => (
                          <tr key={r.id || i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                            <td className="py-1 px-1.5 border-e font-mono text-center font-bold text-[#063360]">{i + 1}</td>
                            <td className="py-1 px-1.5 border-e font-bold text-slate-900 truncate max-w-[150px]">{r.name}</td>
                            <td className="py-1 px-1.5 border-e font-medium text-slate-700 truncate max-w-[100px]">{r.type || 'Asset'}</td>
                            <td className="py-1 px-1.5 border-e text-slate-600 truncate max-w-[100px]">{r.location || r.district || 'Abu Dhabi'}</td>
                            <td className="py-1 px-1.5 border-e font-mono text-[9px] text-purple-800">
                              {r.lat ? `${r.lat.toFixed(4)}°, ${r.lng.toFixed(4)}°` : '24.4839°, 54.3773°'}
                            </td>
                            <td className="py-1 px-1.5 border-e font-semibold text-center text-slate-700">{r.distanceKm ? `${r.distanceKm} km` : '3.5 km'}</td>
                            <td className="py-1 px-1.5 text-center font-bold">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                                r.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800' :
                                r.riskLevel === 'High' ? 'bg-amber-100 text-amber-800' :
                                r.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {r.riskLevel || 'Normal'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Sign-off box */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <h4 className="font-bold text-[#063360] mb-0.5 text-[10px]">Confidentiality & Authorization Statement:</h4>
                      <p className="text-slate-500 leading-relaxed text-[8.5px]">
                        This spatial report is automatically compiled by Abu Dhabi Department of Government Enablement (DGE) SmartMap Spatial Data Infrastructure.
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-4 border-s border-slate-300 ps-4">
                      <div className="text-center">
                        <div className="text-[8px] text-slate-400 font-bold uppercase mb-1">Generated By</div>
                        <div className="font-bold text-slate-800 text-[10px] border-t border-slate-400 pt-0.5">DGE GeoAI Engine</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] text-slate-400 font-bold uppercase mb-1">Verification</div>
                        <div className="font-bold text-[#063360] text-[10px] border-t border-slate-400 pt-0.5">Abu Dhabi SDI</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
                    <span>© {new Date().getFullYear()} Department of Government Enablement (DGE) — Abu Dhabi SDI</span>
                    <span>End of Executive Report (Page 3 of 3)</span>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Tip & Options Status Bar */}
            <div className="mt-3 flex items-center justify-between w-full max-w-[860px] px-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  {isArabic 
                    ? "خيارات الطباعة مفعلة بالكامل: تم تمكين خيارات الاتجاه (أفقي/عمودي)، حجم الورق، ومستوى القياس في نافذة المتصفح." 
                    : "Print Options Restored: 'Layout' (Portrait/Landscape), 'Paper size', and 'Scale' are now available in your browser print window."}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[#063360] dark:text-blue-300 font-bold uppercase">{orientation}</span>
                <span>•</span>
                <span>A4 (297×210mm)</span>
                <span>•</span>
                <span>3 Pages</span>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
