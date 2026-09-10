import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Heart, Activity, Phone, Globe, Clock, Building2, 
  Navigation, Printer, Compass, Sparkles, Star, ArrowRight, BookOpen, PlusSquare, TreePine, Bus, Zap,
  Layers, ShieldCheck, Gauge, Droplets, Target, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';

export default function DetailSlidePanel({ explorerState, setExplorerState }) {
  const detail = explorerState?.selectedDetail || explorerState?.selectedLocation;
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'details' | 'nearby' | 'related'

  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  if (!detail) return null;

  const handleClose = () => {
    setExplorerState(prev => ({ 
      ...prev, 
      selectedDetail: null, 
      selectedLocation: null
    }));
  };

  const handleDirections = () => {
    setExplorerState(prev => ({
      ...prev,
      activeRouteDestination: detail,
      mapFocus: { lat: detail.lat, lng: detail.lng, zoom: 16 }
    }));
  };

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      setExplorerState(prev => ({
        ...prev,
        showAuthModal: true,
        authModalReason: isArabic ? 'يتطلب تسجيل الدخول لإضافة المفضلة' : 'Sign in required to save locations to Favorites'
      }));
      return;
    }
    setExplorerState(prev => {
      const current = prev.savedLocations || [];
      const exists = current.some(item => 
        (item.id && detail?.id && String(item.id) === String(detail.id)) || 
        (item.name && detail?.name && item.name.trim().toLowerCase() === detail.name.trim().toLowerCase())
      );
      const updated = exists 
        ? current.filter(item => !((item.id && detail?.id && String(item.id) === String(detail.id)) || (item.name && detail?.name && item.name.trim().toLowerCase() === detail.name.trim().toLowerCase())))
        : [detail, ...current];
      return { ...prev, savedLocations: updated };
    });
  };

  const isFavorite = Boolean((explorerState?.savedLocations || []).some(item => 
    (item.id && detail?.id && String(item.id) === String(detail.id)) || 
    (item.name && detail?.name && item.name.trim().toLowerCase() === detail.name.trim().toLowerCase())
  ));

  const facilityName = isArabic && detail.name_ar ? detail.name_ar : (detail.name || 'DGE Headquarters');
  const facilityType = isArabic && detail.type_ar ? detail.type_ar : (detail.facilityType || detail.type || 'Government Facility');
  const department = isArabic ? 'دائرة التمكين الحكومي - أبوظبي' : 'Department of Government Enablement';
  const address = isArabic && detail.location_ar ? detail.location_ar : (detail.location || detail.district || 'Al Bateen, Abu Dhabi');
  const distanceStr = detail.distance || '2.1 km from your location';

  // Derived Nearby POIs
  const nearbyPois = [
    {
      id: 'poi-bus-1',
      name: isArabic ? 'محطة حافلات النقل العام الرئيسي' : 'Corniche Central Transit Stop #4',
      type: isArabic ? 'مواصلات عامة' : 'Public Transit',
      distance: '320 m',
      icon: Bus,
      color: 'text-amber-500 bg-amber-500/10',
      lat: detail.lat ? detail.lat + 0.0015 : 24.4854,
      lng: detail.lng ? detail.lng - 0.0020 : 54.3753
    },
    {
      id: 'poi-park-2',
      name: isArabic ? 'مواقف السيارات الذكية - التمكين الحكومي' : 'Smart Visitor Parking (38 spots open)',
      type: isArabic ? 'مواقف سيارات' : 'Smart Parking',
      distance: '150 m',
      icon: Navigation,
      color: 'text-blue-500 bg-blue-500/10',
      lat: detail.lat ? detail.lat - 0.0010 : 24.4829,
      lng: detail.lng ? detail.lng + 0.0012 : 54.3785
    },
    {
      id: 'poi-safety-3',
      name: isArabic ? 'مركز شرطة البطين والخدمات الأمنية' : 'Al Bateen Police Station',
      type: isArabic ? 'الأمن العام' : 'Public Safety',
      distance: '750 m',
      icon: ShieldCheck,
      color: 'text-indigo-500 bg-indigo-500/10',
      lat: detail.lat ? detail.lat + 0.0035 : 24.4874,
      lng: detail.lng ? detail.lng + 0.0040 : 54.3813
    },
    {
      id: 'poi-health-4',
      name: isArabic ? 'وحدة الإسعاف والطوارئ الطبية' : 'First-Aid & Paramedic Emergency Station',
      type: isArabic ? 'رعاية صحية' : 'Healthcare Unit',
      distance: '1.1 km',
      icon: PlusSquare,
      color: 'text-rose-500 bg-rose-500/10',
      lat: detail.lat ? detail.lat - 0.0045 : 24.4794,
      lng: detail.lng ? detail.lng - 0.0030 : 54.3743
    }
  ];

  // Derived Related Landmarks
  const relatedLandmarks = (activeProject?.datasets || []).filter(item => item.id !== detail.id).slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute top-4 start-16 sm:start-20 z-30 w-[340px] sm:w-[380px] max-h-[calc(100vh-140px)] backdrop-blur-2xl rounded-3xl shadow-2xl border flex flex-col overflow-hidden pointer-events-auto transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#080d1a]/95 border-slate-800 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
            : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl'
        }`}
      >
        {/* 1. Facility Header & Status (No Thumbnail) */}
        <div className={`p-4 pb-3 border-b shrink-0 transition-colors ${
          isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                  isDarkMode ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-[#215A9E]'
                }`}>
                  {facilityType}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[10px] font-semibold text-sky-300 border border-slate-700/50">
                  {detail.riskLevel ? `${detail.riskLevel} Risk` : 'SDI Verified'}
                </span>
              </div>
              <h3 className={`font-extrabold text-base tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {facilityName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                📍 {address}
              </p>
            </div>

            <button 
              onClick={handleClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-800'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Navigation Tabs (Wireframe Page 05) */}
        <div className={`flex items-center justify-around border-b shrink-0 px-2 py-1.5 text-xs font-bold ${
          isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          {[
            { id: 'overview', label_en: 'Overview', label_ar: 'نظرة عامة' },
            { id: 'details', label_en: 'Details', label_ar: 'التفاصيل' },
            { id: 'nearby', label_en: 'Nearby', label_ar: 'بالقرب' },
            { id: 'related', label_en: 'Related', label_ar: 'ذات صلة' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer relative ${
                  isActive
                    ? (isDarkMode ? 'text-[#00e5ff]' : 'text-[#215A9E]')
                    : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
                }`}
              >
                <span>{t(tab.label_en, tab.label_ar)}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeLocationTabUnderline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#215A9E] dark:bg-[#00e5ff] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 4. Tab Body Content (Wireframe Page 05) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 sleek-scrollbar">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Government Facility Type */}
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                }`}>
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                    {facilityType}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {department}
                  </p>
                </div>
              </div>

              {/* Address & Distance */}
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                }`}>
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                    {address}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {distanceStr}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                }`}>
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                    {t('Contact', 'معلومات الاتصال')}
                  </h4>
                  <div className="text-[11px] font-medium text-slate-400 mt-0.5 space-y-0.5">
                    <p>+971 2 800 555</p>
                    <p className="text-[#215A9E] dark:text-[#00e5ff] font-semibold">www.dge.gov.ae</p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                }`}>
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                    {t('Working Hours', 'ساعات العمل')}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    Mon - Fri, 7:30 AM - 3:30 PM
                  </p>
                </div>
              </div>

              {/* Operational Status */}
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                }`}>
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                    {t('Status & Operations', 'الحالة التشغيلية')}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {isArabic ? 'نشط ومطابق للمواصفات المكانية' : 'Fully Operational & SDI Certified'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-3">
              <div className={`p-3 rounded-2xl border text-xs ${isDarkMode ? 'bg-[#101a35] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h5 className="font-bold text-[#215A9E] dark:text-[#00e5ff] text-xs mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>{t('Geospatial Coordinates', 'الإحداثيات المكانية')}</span>
                </h5>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">{t('Latitude', 'خط العرض')}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{(detail.lat || 24.4839).toFixed(4)}° N</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t('Longitude', 'خط الطول')}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{(detail.lng || 54.3773).toFixed(4)}° E</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block">{t('Spatial Reference (SRID)', 'النظام المرجعي المكاني')}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">EPSG:4326 (WGS 84 / Abu Dhabi Grid)</span>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border text-xs ${isDarkMode ? 'bg-[#101a35] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h5 className="font-bold text-[#215A9E] dark:text-[#00e5ff] text-xs mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>{t('SDI Layer & Asset Metrics', 'مؤشرات الطبقة والمرافق')}</span>
                </h5>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t('Feature ID', 'معرف المنشأة')}:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{detail.id || 'FAC-AD-001'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t('SDI Layer Code', 'كود الطبقة المكانية')}:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{detail.layerId || 'DGE-SDI-LAYER-2026'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t('Capacity Metric', 'السعة الاستيعابية')}:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{detail.capacity || '1,200 / day'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t('Environmental Risk Index', 'مؤشر المخاطر البيئية')}:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      detail.riskLevel === 'High' || detail.riskLevel === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {detail.riskLevel || 'Low'} ({detail.riskScore || 18}/100)
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border text-xs ${isDarkMode ? 'bg-[#101a35] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h5 className="font-bold text-[#215A9E] dark:text-[#00e5ff] text-xs mb-2 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4" />
                  <span>{t('Utility & Resource Stats', 'استهلاك الموارد والطاقة')}</span>
                </h5>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('Water Rate', 'معدل المياه')}</span>
                      <span className="font-bold">{detail.waterUsage || '64 m³/day'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('Energy Rating', 'كفاءة الطاقة')}</span>
                      <span className="font-bold text-amber-500">Grade A+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NEARBY */}
          {activeTab === 'nearby' && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-400 font-medium">
                {t('Surrounding mobility, safety, and civic services within 2 km radius:', 'خدمات النقل والأمن والمرافق المجاورة في محيط 2 كم:')}
              </p>

              {nearbyPois.map(poi => {
                const IconComponent = poi.icon;
                const flyToPoi = () => setExplorerState(prev => ({
                  ...prev,
                  mapFocus: { lat: poi.lat, lng: poi.lng, zoom: 17, _ts: Date.now() }
                }));
                return (
                  <button
                    key={poi.id}
                    onClick={flyToPoi}
                    className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer text-start group ${
                      isDarkMode 
                        ? 'bg-[#101a35] border-slate-800 hover:border-[#00e5ff]/40 hover:bg-[#152040]' 
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-sm hover:border-[#215A9E]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${poi.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs truncate text-slate-800 dark:text-slate-100">{poi.name}</h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{poi.type}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#215A9E] dark:text-[#00e5ff]">{poi.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-1.5 rounded-lg border text-[10px] font-bold shrink-0 transition-colors ${
                        isDarkMode 
                          ? 'bg-[#182645] border-slate-700 text-[#00e5ff] group-hover:bg-[#00e5ff] group-hover:text-slate-950' 
                          : 'bg-white border-slate-200 text-[#215A9E] group-hover:bg-[#215A9E] group-hover:text-white'
                      }`}
                      title={t('Focus on map', 'التركيز الخريطة')}
                    >
                      <Target className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 4: RELATED */}
          {activeTab === 'related' && (
            <div className="space-y-3">
              {/* Linked GIS Layers */}
              <div className={`p-3 rounded-2xl border text-xs ${isDarkMode ? 'bg-[#101a35] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h5 className="font-bold text-[#215A9E] dark:text-[#00e5ff] text-xs mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>{t('Active Linked SDI Layers', 'طبقات البيانات المكانية المرتبطة')}</span>
                </h5>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold">Abu Dhabi Land Parcel Registry v4.2</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Active</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold">TAQA Subsurface Power Grid</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Active</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold">EAD Coastal Buffer & Biodiversity</span>
                    <span className="text-[10px] text-sky-400 font-bold">Vector Layer</span>
                  </div>
                </div>
              </div>

              {/* Neighboring District Entities */}
              <div>
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">
                  {t('District Landmarks & Facilities', 'منشآت ومعالم المنطقة المجاورة')}
                </h5>
                <div className="space-y-2">
                  {relatedLandmarks.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => setExplorerState(prev => ({
                        ...prev,
                        selectedLocation: item,
                        selectedDetail: item,
                        mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 }
                      }))}
                      className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isDarkMode ? 'bg-[#101a35] border-slate-800 hover:bg-[#162447]' : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-xs'
                      }`}
                    >
                      <div className="min-w-0 flex-1 me-2">
                        <h6 className="font-bold text-xs truncate text-slate-800 dark:text-slate-100">
                          {isArabic && item.name_ar ? item.name_ar : item.name}
                        </h6>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.type || 'Government Facility'} • {item.distance || '1.8 km'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-[#215A9E] dark:text-[#00e5ff] flex items-center gap-0.5 shrink-0">
                        <span>{t('View', 'عرض')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Footer Action Buttons (Wireframe Page 05) */}
        <div className={`p-4 border-t shrink-0 grid ${isLoggedIn ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 ${
          isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          {/* Add to Favorites (Only for Logged-In Users) */}
          {isLoggedIn && (
            <button
              onClick={handleToggleFavorite}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                isFavorite
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-[#215A9E] text-white hover:bg-[#1a477d]'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? t('Favorited', 'في المفضلة') : t('Add to Favorites', 'إضافة للمفضلة')}</span>
            </button>
          )}

          {/* Get Directions / Clear Route Toggle */}
          {Boolean(
            explorerState?.activeRouteDestination && 
            (
              (detail?.id && explorerState.activeRouteDestination.id === detail.id) ||
              (detail?.name && explorerState.activeRouteDestination.name === detail.name)
            )
          ) ? (
            <button
              type="button"
              onClick={() => setExplorerState(prev => ({ ...prev, activeRouteDestination: null }))}
              className="py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/80 border-rose-200 dark:border-rose-800"
              title={t('Clear active route from map', 'إلغاء ومسح المسار من الخريطة')}
            >
              <X className="w-4 h-4 text-rose-500 stroke-[2.5]" />
              <span>{t('Clear Route', 'مسح المسار')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDirections}
              className="py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border bg-[#1a73e8] hover:bg-[#1557bf] text-white border-transparent shadow-sm"
              title={t('Show directions on map', 'عرض الاتجاهات على الخريطة')}
            >
              <Navigation className="w-4 h-4 text-white fill-current" />
              <span>{t('Get Directions', 'اتجاهات السير')}</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

