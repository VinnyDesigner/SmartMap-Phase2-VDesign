import React from 'react';
import { motion } from 'framer-motion';
import { 
  List, X, Building2, PlusSquare, GraduationCap, TreePine, 
  Bus, Compass, MapPin, Shield, Zap, Home, CloudRain, Hammer,
  Sprout, Briefcase, Activity, Navigation, Layers, Trash2, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  CATEGORY_TREE, 
  getSubcategoryLocalizedName,
  findCategoryBySubcategoryId 
} from '../../config/categoryTree';

// Comprehensive Category Symbology & Pastel Theme Details
export const CATEGORY_SYMBOLOGY_MAP = {
  government: { hex: '#9EC5FE', pastelBg: '#CFE2FE', pastelBorder: '#9EC5FE', iconColor: '#1565C0', icon: Building2, label_en: 'Government & Municipal', label_ar: 'الجهات الحكومية والبلدية' },
  education: { hex: '#81D4FA', pastelBg: '#B3E5FC', pastelBorder: '#81D4FA', iconColor: '#0277BD', icon: GraduationCap, label_en: 'Education & Schools', label_ar: 'التعليم والمدارس' },
  healthcare: { hex: '#FFA4A4', pastelBg: '#FFD6D6', pastelBorder: '#FFA4A4', iconColor: '#C62828', icon: PlusSquare, label_en: 'Healthcare & Hospitals', label_ar: 'الرعاية الصحية والمستشفيات' },
  park: { hex: '#C5E1A5', pastelBg: '#DCEDC8', pastelBorder: '#C5E1A5', iconColor: '#33691E', icon: TreePine, label_en: 'Parks & Greenery', label_ar: 'الحدائق والمساحات الخضراء' },
  environment: { hex: '#9FD6A3', pastelBg: '#C8E6C9', pastelBorder: '#9FD6A3', iconColor: '#2E7D32', icon: TreePine, label_en: 'Environment & Sustainability', label_ar: 'البيئة والاستدامة' },
  transportation: { hex: '#B9A4EC', pastelBg: '#E0D7F8', pastelBorder: '#B9A4EC', iconColor: '#5E35B1', icon: Bus, label_en: 'Transport & Transit', label_ar: 'النقل والمواصلات' },
  tourism: { hex: '#FFCC80', pastelBg: '#FFE5B4', pastelBorder: '#FFCC80', iconColor: '#E65100', icon: Compass, label_en: 'Tourism & Landmarks', label_ar: 'السياحة والمعالم' },
  public_safety: { hex: '#EF9A9A', pastelBg: '#FFCDD2', pastelBorder: '#EF9A9A', iconColor: '#C2185B', icon: Shield, label_en: 'Public Safety & Emergency', label_ar: 'السلامة العامة والطوارئ' },
  utilities: { hex: '#FFF176', pastelBg: '#FFF9C4', pastelBorder: '#FFF176', iconColor: '#F57F17', icon: Zap, label_en: 'Utilities & Power', label_ar: 'المرافق والطاقة' },
  housing: { hex: '#DEABED', pastelBg: '#F1D6F7', pastelBorder: '#DEABED', iconColor: '#7B1FA2', icon: Home, label_en: 'Housing & Communities', label_ar: 'الإسكان والمجتمعات' },
  infrastructure: { hex: '#CBD5E1', pastelBg: '#E2E8F0', pastelBorder: '#CBD5E1', iconColor: '#475569', icon: Building2, label_en: 'Infrastructure & Projects', label_ar: 'البنية التحتية والمشاريع' },
  climate: { hex: '#80DEEA', pastelBg: '#B2EBF2', pastelBorder: '#80DEEA', iconColor: '#00838F', icon: CloudRain, label_en: 'Climate & Meteorology', label_ar: 'المناخ والأرصاد' },
  construction: { hex: '#FFAB91', pastelBg: '#FFD8C7', pastelBorder: '#FFAB91', iconColor: '#D84315', icon: Hammer, label_en: 'Construction & Development', label_ar: 'الإنشاءات والتطوير' },
  energy: { hex: '#FFD54F', pastelBg: '#FFE082', pastelBorder: '#FFD54F', iconColor: '#FF6F00', icon: Zap, label_en: 'Energy & Desalination', label_ar: 'الطاقة وتحلية المياه' },
  agriculture: { hex: '#A9DF9C', pastelBg: '#D7ECC7', pastelBorder: '#A9DF9C', iconColor: '#2E7D32', icon: Sprout, label_en: 'Agriculture & Farms', label_ar: 'الزراعة والمزارع' },
  employment: { hex: '#A4C6FB', pastelBg: '#D0E1FD', pastelBorder: '#A4C6FB', iconColor: '#1E40AF', icon: Briefcase, label_en: 'Employment & Labor', label_ar: 'العمل والتوظيف' }
};

// Fallback lookup from result item types
const resolveCategoryKey = (typeStr = '') => {
  const norm = (typeStr || '').toLowerCase();
  if (norm.includes('govt') || norm.includes('government') || norm.includes('municipal')) return 'government';
  if (norm.includes('school') || norm.includes('education') || norm.includes('academic')) return 'education';
  if (norm.includes('hospital') || norm.includes('health') || norm.includes('clinic')) return 'healthcare';
  if (norm.includes('park') || norm.includes('garden')) return 'park';
  if (norm.includes('transit') || norm.includes('transport') || norm.includes('bus') || norm.includes('parking')) return 'transportation';
  if (norm.includes('tour') || norm.includes('attraction') || norm.includes('landmark')) return 'tourism';
  if (norm.includes('police') || norm.includes('safety') || norm.includes('fire') || norm.includes('ambulance')) return 'public_safety';
  if (norm.includes('utility') || norm.includes('power') || norm.includes('water') || norm.includes('grid')) return 'utilities';
  return 'government';
};

export default function MapLegendPanel({ explorerState, setExplorerState, onClose }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const selectedSubcategories = explorerState?.selectedGisSubcategories || [];
  const activeResults = explorerState?.activeResults || [];
  const selectedLocation = explorerState?.selectedLocation;

  const hasDrawnShape = Boolean(
    explorerState?.drawnPolygon || 
    explorerState?.drawnCircle || 
    explorerState?.drawnRectangle || 
    (explorerState?.drawings && explorerState.drawings.length > 0)
  );

  let drawnShapeLabelEn = 'Drawn Spatial Zone';
  let drawnShapeLabelAr = 'المنطقة الجغرافية المحددة';
  if (explorerState?.drawnCircle) {
    drawnShapeLabelEn = 'Circular Analysis Zone';
    drawnShapeLabelAr = 'نطاق تحليلي دائري';
  } else if (explorerState?.drawnRectangle) {
    drawnShapeLabelEn = 'Bounding Box Zone';
    drawnShapeLabelAr = 'نطاق تحليلي مستطيل';
  } else if (explorerState?.drawnPolygon) {
    drawnShapeLabelEn = 'Polygon Boundary Zone';
    drawnShapeLabelAr = 'نطاق تحليلي مضلع';
  }

  // Handle clearing active drawn shape directly from legend
  const handleClearDrawing = () => {
    setExplorerState(prev => ({
      ...prev,
      drawnPolygon: null,
      drawnCircle: null,
      drawnRectangle: null,
      activeDrawnArea: null,
      drawings: []
    }));
  };

  // Open the GIS Layers Category Drawer
  const handleOpenCategoryDrawer = () => {
    setExplorerState(prev => ({
      ...prev,
      showCategoriesPanel: true,
      activeMenu: null
    }));
  };

  // 1. Compute Active Layers based on selected subcategories or active query results
  const hasSelectedLayers = selectedSubcategories.length > 0;
  const hasSearchResults = !hasSelectedLayers && activeResults.length > 0;

  // Render list of active layers when subcategories are checked in drawer
  const activeSubcategoryItems = selectedSubcategories.map(subId => {
    const parentCat = findCategoryBySubcategoryId(subId);
    const subName = getSubcategoryLocalizedName(subId, isArabic);
    const catKey = parentCat?.id || 'government';
    const symbology = CATEGORY_SYMBOLOGY_MAP[catKey] || CATEGORY_SYMBOLOGY_MAP.government;
    const count = activeResults.filter(r => {
      const rSub = (r.subType || r.subType_en || r.type || '').toLowerCase();
      const rCat = (r.category || r.category_en || '').toLowerCase();
      return rSub.includes(subId.replace('_', '')) || rCat.includes(subId.replace('_', ''));
    }).length;

    return {
      id: subId,
      name: subName,
      parentName: isArabic ? parentCat?.name_ar : parentCat?.name,
      symbology,
      count
    };
  });

  // Render list of active categories from AI search results when no manual subcategories selected
  const activeSearchResultCategories = React.useMemo(() => {
    if (!hasSearchResults) return [];
    const catMap = new Map();

    activeResults.forEach(item => {
      const catKey = resolveCategoryKey(item.type || item.facilityType || item.category || '');
      const current = catMap.get(catKey) || 0;
      catMap.set(catKey, current + 1);
    });

    return Array.from(catMap.entries()).map(([catKey, count]) => ({
      catKey,
      count,
      symbology: CATEGORY_SYMBOLOGY_MAP[catKey] || CATEGORY_SYMBOLOGY_MAP.government
    }));
  }, [hasSearchResults, activeResults]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -16, scale: 0.96 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`absolute start-[88px] md:start-[98px] top-4 z-[400] w-[320px] sm:w-[350px] max-h-[calc(100vh-140px)] rounded-2xl border shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#080d1a]/95 border-slate-800/90 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)]' 
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl'
      }`}
    >
      {/* 1. Header */}
      <div className={`px-3.5 py-3 flex items-center justify-between shrink-0 border-b ${
        isDarkMode ? 'border-slate-800/90 bg-[#0c1427]' : 'border-slate-100 bg-slate-50/80'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#063360] via-[#215A9E] to-[#7c3aed] text-white flex items-center justify-center shadow-xs">
            <List className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-tight leading-tight">
              {t("Map Legend & Symbology", "مفتاح ورموز الخريطة")}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 block">
              {hasSelectedLayers
                ? t(`Active Layers (${selectedSubcategories.length})`, `الطبقات النشطة (${selectedSubcategories.length})`)
                : hasSearchResults
                  ? t(`Search Scope (${activeResults.length} assets)`, `نطاق الاستعلام (${activeResults.length} منشأة)`)
                  : t("SDI Authoritative Basemap", "خريطة الأساس المكانية المعتمدة")}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200/70 text-slate-500 hover:text-slate-800'
          }`}
          title={t("Close Legend", "إغلاق مفتاح الخريطة")}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Scrollable Body */}
      <div className="p-3.5 overflow-y-auto space-y-3.5 text-xs">

        {/* --- SECTION A: ACTIVE MAP LAYERS (When layers or results exist) --- */}
        {hasSelectedLayers ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("ENABLED GIS LAYERS", "الطبقات الجغرافية المفعلة")}
              </span>
              <button
                type="button"
                onClick={handleOpenCategoryDrawer}
                className="text-[10px] font-extrabold text-[#00e5ff] dark:text-[#00e5ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>{t("Edit in Drawer", "تعديل في القائمة")}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {activeSubcategoryItems.map(item => {
                const Icon = item.symbology.icon;
                return (
                  <div 
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isDarkMode 
                        ? 'bg-[#0f172a]/90 border-slate-800/80 hover:border-slate-700' 
                        : 'bg-slate-50/90 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Colored Pastel Pin Badge */}
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border shadow-xs transition-colors"
                        style={{ 
                          backgroundColor: item.symbology.pastelBg || item.symbology.hex,
                          borderColor: item.symbology.pastelBorder || item.symbology.hex,
                          color: item.symbology.iconColor || '#ffffff'
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-[11px] block truncate leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[9.5px] font-medium text-slate-400 block truncate">
                          {item.parentName}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                      item.count > 0 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.count > 0 ? `${item.count} ${t("on map", "على الخريطة")}` : t("Active", "نشط")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : hasSearchResults ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("QUERY RESULTS BY CATEGORY", "نتائج الاستعلام حسب الفئة")}
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                {activeResults.length} {t("locations", "موقع")}
              </span>
            </div>

            <div className="space-y-1.5">
              {activeSearchResultCategories.map(item => {
                const Icon = item.symbology.icon;
                const label = isArabic ? item.symbology.label_ar : item.symbology.label_en;
                return (
                  <div 
                    key={item.catKey}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isDarkMode 
                        ? 'bg-[#0f172a]/90 border-slate-800/80' 
                        : 'bg-slate-50/90 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border shadow-xs transition-colors"
                        style={{ 
                          backgroundColor: item.symbology.pastelBg || item.symbology.hex,
                          borderColor: item.symbology.pastelBorder || item.symbology.hex,
                          color: item.symbology.iconColor || '#ffffff'
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-[11px] truncate">
                        {label}
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
                      {item.count} {t("items", "منشآت")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* --- DEFAULT / BASEMAP STATE: Primary Canonical Layers --- */
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("AUTHORITATIVE SDI LAYERS", "الطبقات المكانية المعتمدة")}
              </span>
              <button
                type="button"
                onClick={handleOpenCategoryDrawer}
                className="text-[10px] font-extrabold text-[#215A9E] dark:text-[#00e5ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>{t("Open Layers Drawer", "فتح قائمة الطبقات")}</span>
              </button>
            </div>

            {/* Core Thematic Pin Layers Preview */}
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { key: 'government', name_en: 'Government Facilities', name_ar: 'المنشآت الحكومية' },
                { key: 'education', name_en: 'Education & Schools', name_ar: 'المدارس والتعليم' },
                { key: 'healthcare', name_en: 'Healthcare & Hospitals', name_ar: 'المستشفيات والمراكز الطبية' },
                { key: 'public_safety', name_en: 'Public Safety & Police', name_ar: 'السلامة العامة والشرطة' },
                { key: 'park', name_en: 'Parks & Environment', name_ar: 'الحدائق والمحميات' }
              ].map(cat => {
                const sym = CATEGORY_SYMBOLOGY_MAP[cat.key];
                const Icon = sym.icon;
                return (
                  <div 
                    key={cat.key}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border ${
                      isDarkMode ? 'bg-[#0f172a]/70 border-slate-800/80' : 'bg-slate-50/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] border shadow-2xs transition-colors"
                        style={{ 
                          backgroundColor: sym.pastelBg || sym.hex,
                          borderColor: sym.pastelBorder || sym.hex,
                          color: sym.iconColor || '#ffffff'
                        }}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-[11px]">
                        {isArabic ? cat.name_ar : cat.name_en}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">
                      {t("SDI Core", "معتمد SDI")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- SECTION B: MAP SYMBOLOGY GUIDE --- */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/90 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
            {t("MAP SYMBOLS & CONTEXT", "رموز الخريطة وسياق العرض")}
          </div>

          <div className="space-y-1.5">
            {/* 1. Selected Location / Feature Pointer */}
            <div className={`flex items-center justify-between p-2 rounded-xl border ${
              selectedLocation 
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300 font-bold' 
                : (isDarkMode ? 'bg-[#0f172a]/70 border-slate-800/80 text-slate-300' : 'bg-slate-50/80 border-slate-200/80 text-slate-600')
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[10.5px] block truncate">
                    {t("Selected Feature", "المنشأة المحددة")}
                  </span>
                  {selectedLocation && (
                    <span className="text-[9px] font-medium opacity-80 block truncate">
                      {isArabic && selectedLocation.name_ar ? selectedLocation.name_ar : selectedLocation.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping shrink-0" />
            </div>

            {/* 2. Drawn Spatial Boundary Zone */}
            {hasDrawnShape && (
              <div className="flex items-center justify-between p-2 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-5 h-5 rounded-md border-2 border-dashed border-violet-500 bg-violet-500/20 flex items-center justify-center shrink-0" />
                  <div className="min-w-0">
                    <span className="font-extrabold text-[10.5px] block truncate">
                      {isArabic ? drawnShapeLabelAr : drawnShapeLabelEn}
                    </span>
                    <span className="text-[9px] font-medium opacity-80 block">
                      {t("Active Spatial Filter Zone", "نطاق تصفية مكاني نشط")}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearDrawing}
                  className="px-2 py-0.5 text-[9.5px] font-extrabold rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  title={t("Clear Drawn Area", "مسح منطقة الرسم")}
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>{t("Clear", "مسح")}</span>
                </button>
              </div>
            )}

            {/* 3. Active Navigation Route (Google Maps Style) */}
            {explorerState?.activeRouteDestination && (
              <div className="flex items-center justify-between p-2 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-[#1a73e8] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Navigation className="w-3 h-3 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-[10.5px] block truncate">
                      {t("Active Route (Google Maps)", "مسار الاتجاهات النشط")}
                    </span>
                    <span className="text-[9px] font-medium opacity-80 block truncate">
                      {isArabic && explorerState.activeRouteDestination.name_ar 
                        ? explorerState.activeRouteDestination.name_ar 
                        : explorerState.activeRouteDestination.name}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExplorerState(prev => ({ ...prev, activeRouteDestination: null }))}
                  className="px-2 py-0.5 text-[9.5px] font-extrabold rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  title={t("Clear active route", "مسح المسار")}
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>{t("Clear", "مسح")}</span>
                </button>
              </div>
            )}

            {/* 4. User Location Beacon */}
            <div className={`flex items-center justify-between p-2 rounded-xl border ${
              isDarkMode ? 'bg-[#0f172a]/70 border-slate-800/80 text-slate-300' : 'bg-slate-50/80 border-slate-200/80 text-slate-600'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-[#00e5ff] text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Navigation className="w-3 h-3 fill-current" />
                </div>
                <span className="font-bold text-[10.5px]">
                  {t("User Location (GPS Origin)", "موقعي الحالي (نقطة القياس)")}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00e5ff] shrink-0" />
            </div>

            {/* 4. Risk / Priority Status Indicators */}
            <div className={`p-2 rounded-xl border space-y-1.5 ${
              isDarkMode ? 'bg-[#0f172a]/70 border-slate-800/80' : 'bg-slate-50/80 border-slate-200/80'
            }`}>
              <span className="text-[9.5px] font-bold text-slate-400 block uppercase">
                {t("Risk Assessment Symbology", "رموز مؤشرات الخطورة")}
              </span>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-1.5 text-rose-500">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{t("Critical Risk", "خطورة حرجة")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{t("High Risk", "خطورة عالية")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{t("Standard", "قياسي")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Footer Action Strip */}
      <div className={`px-3.5 py-2.5 border-t flex items-center justify-between text-[10px] font-bold ${
        isDarkMode ? 'border-slate-800/90 bg-[#0a0f1d] text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
      }`}>
        <span>{t("GeoVision Spatial SDI 2026", "منصة جيو فيجن المكانية 2026")}</span>
        <button
          type="button"
          onClick={handleOpenCategoryDrawer}
          className="text-[#215A9E] dark:text-[#00e5ff] hover:underline cursor-pointer"
        >
          {t("Configure Layers →", "تخصيص الطبقات ←")}
        </button>
      </div>
    </motion.div>
  );
}
