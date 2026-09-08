import React, { useState } from 'react';
import { 
  X, Search, ChevronDown, ChevronUp, Layers, RotateCcw, 
  Activity, GraduationCap, Bus, Landmark, TreePine, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LOCATIONS_DB } from '../../services/mockAiEngine';

export const GIS_CATEGORIES_DATA = [
  {
    id: 'tourism',
    title: 'Tourism & Culture',
    title_ar: 'السياحة والثقافة',
    icon: Landmark,
    subcategories: [
      { id: 'museums', label: 'Museums & Galleries', label_ar: 'المتاحف والمعارض', count: 18 },
      { id: 'heritage', label: 'Cultural Heritage', label_ar: 'التراث الثقافي', count: 24 },
      { id: 'landmarks', label: 'Landmarks & Monuments', label_ar: 'المعالم البارزة', count: 32 }
    ]
  },
  {
    id: 'government',
    title: 'Government Services',
    title_ar: 'الخدمات الحكومية',
    icon: Landmark,
    subcategories: [
      { id: 'tamm_hubs', label: 'TAMM Customer Hubs', label_ar: 'مراكز تم للمتعاملين', count: 24 },
      { id: 'executive_hq', label: 'Executive Governance', label_ar: 'المقرات الحكومية', count: 18 },
      { id: 'municipality_offices', label: 'Municipality Offices', label_ar: 'مكاتب البلدية', count: 14 }
    ]
  },
  {
    id: 'utilities',
    title: 'Civic Infrastructure',
    title_ar: 'البنية التحتية والمرافق',
    icon: Zap,
    subcategories: [
      { id: 'desalination', label: 'Desalination & Water', label_ar: 'تحلية المياه وإمداداتها', count: 12 },
      { id: 'power_plants', label: 'Power & Solar Stations', label_ar: 'محطات الطاقة والشمسية', count: 28 },
      { id: 'waste_recycling', label: 'Eco & Recycling Hubs', label_ar: 'مجمعات التدوير البيئي', count: 19 }
    ]
  },
  {
    id: 'transport',
    title: 'Mobility & Transit',
    title_ar: 'النقل والمواصفات',
    icon: Bus,
    subcategories: [
      { id: 'bus_stations', label: 'Bus Terminals', label_ar: 'محطات الحافلات', count: 65 },
      { id: 'aviation_hubs', label: 'Airports & Aviation', label_ar: 'المطارات والملاحة', count: 6 },
      { id: 'maritime_ports', label: 'Maritime Ports', label_ar: 'الموانئ البحرية', count: 12 }
    ]
  },
  {
    id: 'parks_recreation',
    title: 'Parks & Public Spaces',
    title_ar: 'الحدائق والمساحات العامة',
    icon: TreePine,
    subcategories: [
      { id: 'public_parks', label: 'Public Parks', label_ar: 'الحدائق العامة', count: 45 },
      { id: 'botanical', label: 'Botanical Gardens', label_ar: 'الحدائق النباتية', count: 14 },
      { id: 'sanctuaries', label: 'Environmental Sanctuaries', label_ar: 'المحميات البيئية', count: 19 }
    ]
  }
];

export default function GisCategoriesPanel({ isOpen, onClose, explorerState, setExplorerState }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const selectedSubcategories = explorerState?.selectedGisSubcategories || [];

  const filterLocationsBySubcategories = (subIds) => {
    let filtered = [];
    const hasTourism = subIds.some(id => ['tourism', 'museums', 'heritage', 'landmarks'].includes(id));
    const hasGovt = subIds.some(id => ['government', 'tamm_hubs', 'executive_hq', 'municipality_offices'].includes(id));
    const hasUtilities = subIds.some(id => ['utilities', 'desalination', 'power_plants', 'waste_recycling'].includes(id));
    const hasTransit = subIds.some(id => ['transport', 'bus_stations', 'aviation_hubs', 'maritime_ports'].includes(id));
    const hasParks = subIds.some(id => ['parks_recreation', 'public_parks', 'botanical', 'sanctuaries'].includes(id));

    if (hasTourism) filtered = [...filtered, ...LOCATIONS_DB.filter(l => l.type === 'TOURISM')];
    if (hasGovt) filtered = [...filtered, ...LOCATIONS_DB.filter(l => l.type === 'GOVERNMENT')];
    if (hasUtilities) filtered = [...filtered, ...LOCATIONS_DB.filter(l => l.type === 'CIVIC_INFRASTRUCTURE' || l.type === 'MANUFACTURING')];
    if (hasTransit) filtered = [...filtered, ...LOCATIONS_DB.filter(l => l.type === 'TRANSPORT')];
    if (hasParks) filtered = [...filtered, ...LOCATIONS_DB.filter(l => l.type === 'PARK')];

    if (filtered.length === 0 && subIds.length === 0) {
      filtered = LOCATIONS_DB;
    }

    const topLoc = filtered[0] || LOCATIONS_DB[0];

    setExplorerState(prev => ({
      ...prev,
      selectedGisSubcategories: subIds,
      activeResults: filtered,
      mapFocus: topLoc ? { lat: topLoc.lat, lng: topLoc.lng, zoom: 13 } : prev.mapFocus
    }));
  };

  const toggleSubcategory = (subId) => {
    const current = explorerState?.selectedGisSubcategories || [];
    const exists = current.includes(subId);
    const updated = exists ? current.filter(id => id !== subId) : [...current, subId];
    filterLocationsBySubcategories(updated);
  };

  const handleSelectAllCategory = (cat) => {
    const subIds = cat.subcategories.map(s => s.id);
    const current = explorerState?.selectedGisSubcategories || [];
    const allSelected = subIds.every(id => current.includes(id));
    const updated = allSelected ? current.filter(id => !subIds.includes(id)) : Array.from(new Set([...current, ...subIds]));
    filterLocationsBySubcategories(updated);
  };

  const handleClearAll = () => {
    filterLocationsBySubcategories([]);
  };

  const toggleCategoryCollapse = (catId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`absolute start-[72px] top-4 z-40 w-[340px] sm:w-[360px] max-h-[480px] backdrop-blur-2xl rounded-3xl shadow-2xl border flex flex-col overflow-hidden pointer-events-auto transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#080d1a]/95 border-slate-800/90 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)]' 
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className={`p-3.5 pb-2.5 border-b flex items-center justify-between shrink-0 ${
        isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-white/50 border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-[#111c34] text-[#00e5ff] border border-cyan-500/30' : 'bg-[#3D52A0]/10 text-[#3D52A0]'
          }`}>
            <Layers className="w-3.5 h-3.5" />
          </div>
          <h3 className={`font-bold text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
            {t('GIS CATEGORIES', 'تصنيفات نظم المعلومات الجغرافية')}
          </h3>
        </div>

        <button 
          onClick={onClose} 
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Subheader: Category Count & Clear All */}
      <div className={`px-3.5 py-2 flex items-center justify-between shrink-0 ${
        isDarkMode ? 'bg-[#060a12]/80' : 'bg-slate-50/50'
      }`}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {GIS_CATEGORIES_DATA.length} {t('CATEGORIES', 'تصنيفات')}
        </span>

        <button
          onClick={handleClearAll}
          className={`flex items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
            isDarkMode ? 'text-[#00e5ff] hover:text-white' : 'text-[#3D52A0] hover:text-[#2d3e7d]'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('Clear All', 'مسح الكل')}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className={`px-3.5 py-1.5 shrink-0 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search categories...', 'البحث في التصنيفات...')}
            className={`w-full text-xs font-medium rounded-xl ps-8 pe-3 py-2 border outline-none transition-all ${
              isDarkMode 
                ? 'bg-[#0d1527] text-white placeholder-slate-400 border-slate-800 focus:border-[#00e5ff]' 
                : 'bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 border-transparent focus:border-[#3D52A0]/40'
            }`}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute end-3 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Categories List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 sleek-scrollbar">
        {GIS_CATEGORIES_DATA.map((cat) => {
          const CatIcon = cat.icon;
          const isCollapsed = collapsedCategories[cat.id];
          
          const filteredSubs = cat.subcategories.filter(sub => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (
              sub.label.toLowerCase().includes(term) || 
              sub.label_ar.toLowerCase().includes(term) ||
              cat.title.toLowerCase().includes(term)
            );
          });

          if (searchTerm && filteredSubs.length === 0) return null;

          const subIds = cat.subcategories.map(s => s.id);
          const allSelected = subIds.every(id => selectedSubcategories.includes(id));

          return (
            <div 
              key={cat.id} 
              className={`border rounded-2xl p-3 space-y-2.5 transition-all ${
                isDarkMode ? 'bg-[#0d1527] border-slate-800/90' : 'bg-slate-50/70 border-slate-200/70'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => toggleCategoryCollapse(cat.id)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center shadow-2xs transition-colors ${
                    isDarkMode ? 'bg-[#215A9E] text-white' : 'bg-[#3D52A0] text-white group-hover:bg-[#2d3e7d]'
                  }`}>
                    <CatIcon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className={`font-bold text-xs tracking-tight transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-[#00e5ff]' : 'text-[#1e2749] group-hover:text-[#3D52A0]'
                  }`}>
                    {isArabic ? cat.title_ar : cat.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleSelectAllCategory(cat)}
                    className={`text-[9px] font-bold tracking-wider uppercase cursor-pointer ${
                      isDarkMode ? 'text-[#00e5ff] hover:text-white' : 'text-[#3D52A0] hover:text-[#2d3e7d]'
                    }`}
                  >
                    {allSelected ? t('DESELECT ALL', 'إلغاء الكل') : t('SELECT ALL', 'تحديد الكل')}
                  </button>

                  <button
                    onClick={() => toggleCategoryCollapse(cat.id)}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              {!isCollapsed && (
                <div className={`space-y-1.5 pt-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200/50'}`}>
                  {filteredSubs.map((sub) => {
                    const isChecked = selectedSubcategories.includes(sub.id);

                    return (
                      <div 
                        key={sub.id} 
                        className={`flex items-center justify-between py-1 px-1.5 rounded-lg transition-colors ${
                          isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => toggleSubcategory(sub.id)}
                            className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                              isChecked 
                                ? (isDarkMode ? 'bg-[#00e5ff]' : 'bg-[#3D52A0]') 
                                : (isDarkMode ? 'bg-slate-700' : 'bg-slate-300')
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full shadow-xs transform transition-transform ${
                              isDarkMode ? (isChecked ? 'bg-slate-950' : 'bg-slate-400') : 'bg-white'
                            } ${isChecked ? 'translate-x-3 rtl:-translate-x-3' : 'translate-x-0'}`} />
                          </button>

                          <span 
                            onClick={() => toggleSubcategory(sub.id)}
                            className={`text-xs font-semibold transition-colors cursor-pointer truncate ${
                              isDarkMode ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            {isArabic ? sub.label_ar : sub.label}
                          </span>
                        </div>

                        <span className="text-[11px] font-semibold text-slate-400 font-mono shrink-0 ms-2">
                          {sub.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SDI Filter Drawer Footer */}
      <div className={`p-3 border-t shrink-0 flex items-center justify-between z-20 ${
        isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-slate-50 border-slate-200/80'
      }`}>
        <button
          onClick={handleClearAll}
          className={`text-xs font-bold transition-colors cursor-pointer ${
            isDarkMode ? 'text-[#c084fc] hover:text-white' : 'text-[#7c3aed] hover:text-[#5b21b6]'
          }`}
        >
          {t('Clear all', 'مسح الكل')}
        </button>
        <button
          onClick={onClose}
          className={`px-6 py-2 rounded-full text-xs font-bold text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            isDarkMode ? 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6]' : 'bg-[#121124] hover:bg-[#1a1936]'
          }`}
        >
          {t('Apply', 'تطبيق')}
        </button>
      </div>
    </motion.div>
  );
}
