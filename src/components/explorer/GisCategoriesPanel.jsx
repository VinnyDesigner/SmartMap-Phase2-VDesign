import React, { useState, useMemo } from 'react';
import { 
  X, Search, ChevronRight, ChevronDown, Check,
  Activity, Bus, TreePine, Landmark, Building, Building2,
  Home, Shield, Zap, CloudRain, Hammer, Trees, Sprout, Briefcase,
  GraduationCap, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';
import { 
  CATEGORY_TREE, 
  getCategoryLocalizedName, 
  getSubcategoryLocalizedName,
  findCategoryBySubcategoryId
} from '../../config/categoryTree';
import { getMasterAuthoritativeDataset } from '../../services/spatial/gisQueryEngine';
import { 
  isPointInRectangle, 
  isPointInCircle, 
  isPointInPolygon, 
  matchesGisSubcategories 
} from '../../services/spatial/spatialAnalysisService';

// Dedicated Icon Mapping for each of the 16 Canonical Categories
const CATEGORY_ICON_MAP = {
  healthcare: Activity,
  transportation: Bus,
  environment: TreePine,
  government: Building,
  tourism: Landmark,
  infrastructure: Building2,
  housing: Home,
  public_safety: Shield,
  utilities: Zap,
  climate: CloudRain,
  construction: Hammer,
  energy: Zap,
  park: Trees,
  agriculture: Sprout,
  employment: Briefcase,
  education: GraduationCap
};

export default function GisCategoriesPanel({ isOpen, onClose, explorerState, setExplorerState }) {
  const [searchTerm, setSearchTerm] = useState('');
  // Expanded category states: Education is open by default (matching reference screenshot)
  const [expandedCategories, setExpandedCategories] = useState({ education: true });
  const { isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();

  const selectedSubcategories = explorerState?.selectedGisSubcategories || [];

  // Auto-expand any category containing selected subcategories or specifically requested by AI search
  React.useEffect(() => {
    if (explorerState?.autoExpandedGisCategory) {
      setExpandedCategories(prev => ({
        ...prev,
        [explorerState.autoExpandedGisCategory]: true
      }));
    } else if (selectedSubcategories.length > 0) {
      const catsToExpand = {};
      selectedSubcategories.forEach(subId => {
        const parent = findCategoryBySubcategoryId(subId);
        if (parent) {
          catsToExpand[parent.id] = true;
        }
      });
      if (Object.keys(catsToExpand).length > 0) {
        setExpandedCategories(prev => ({ ...prev, ...catsToExpand }));
      }
    }
  }, [explorerState?.autoExpandedGisCategory, selectedSubcategories]);

  // Filter locations on map when subcategories change (respects active drawn shapes if present)
  const filterLocationsBySubcategories = (subIds) => {
    const masterDataset = getMasterAuthoritativeDataset(activeProject.datasets || []);

    // If an active spatial drawing exists on the map, constrain dataset to that shape
    let datasetToFilter = masterDataset;
    const hasActiveDrawing = Boolean(
      explorerState?.drawnRectangle || 
      explorerState?.drawnCircle || 
      explorerState?.drawnPolygon ||
      (explorerState?.drawings && explorerState.drawings.length > 0)
    );

    if (explorerState?.drawnRectangle) {
      datasetToFilter = datasetToFilter.filter(loc => isPointInRectangle(loc.lat, loc.lng, explorerState.drawnRectangle));
    } else if (explorerState?.drawnCircle) {
      datasetToFilter = datasetToFilter.filter(loc => isPointInCircle(loc.lat, loc.lng, explorerState.drawnCircle.center, explorerState.drawnCircle.radius));
    } else if (explorerState?.drawnPolygon) {
      datasetToFilter = datasetToFilter.filter(loc => isPointInPolygon(loc.lat, loc.lng, explorerState.drawnPolygon));
    }

    if (!subIds || subIds.length === 0) {
      setExplorerState(prev => ({
        ...prev,
        selectedGisSubcategories: [],
        activeResults: hasActiveDrawing ? datasetToFilter : (activeProject.datasets || masterDataset),
        showSearchResults: hasActiveDrawing
      }));
      return;
    }

    const filtered = datasetToFilter.filter(loc => matchesGisSubcategories(loc, subIds));

    const topLoc = filtered[0] || datasetToFilter[0] || masterDataset[0];

    setExplorerState(prev => ({
      ...prev,
      selectedGisSubcategories: subIds,
      activeResults: filtered,
      showSearchResults: filtered.length > 0,
      mapFocus: topLoc ? { lat: topLoc.lat, lng: topLoc.lng, zoom: activeProject.defaultZoom || 13 } : prev.mapFocus
    }));
  };

  const toggleSubcategory = (subId) => {
    const current = explorerState?.selectedGisSubcategories || [];
    const exists = current.includes(subId);
    const updated = exists ? current.filter(id => id !== subId) : [...current, subId];
    filterLocationsBySubcategories(updated);
  };

  const toggleCategorySelectAll = (cat) => {
    const catSubIds = cat.subcategories.map(s => s.id);
    const current = explorerState?.selectedGisSubcategories || [];
    const allSelected = catSubIds.every(id => current.includes(id));
    const updated = allSelected 
      ? current.filter(id => !catSubIds.includes(id)) 
      : Array.from(new Set([...current, ...catSubIds]));
    filterLocationsBySubcategories(updated);
  };

  const handleClearAll = () => {
    filterLocationsBySubcategories([]);
  };

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Filtered categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return CATEGORY_TREE;
    const term = searchTerm.trim().toLowerCase();

    return CATEGORY_TREE.filter(cat => {
      const catMatch = cat.name.toLowerCase().includes(term) || cat.name_ar.includes(term);
      const subMatch = cat.subcategories.some(sub => 
        sub.name.toLowerCase().includes(term) || sub.name_ar.includes(term)
      );
      return catMatch || subMatch;
    });
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.96 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`absolute start-[72px] top-4 z-40 w-[350px] sm:w-[380px] h-[580px] max-h-[82vh] backdrop-blur-2xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden pointer-events-auto transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#080d1a]/95 border-slate-800 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)]' 
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl'
      }`}
    >
      {/* 1. Header: All Categories & Close Button */}
      <div className={`px-4 pt-3.5 pb-2.5 flex items-center justify-between shrink-0 border-b ${
        isDarkMode ? 'border-slate-800 bg-[#0a0f1d]' : 'border-slate-100 bg-white/70'
      }`}>
        <h3 className={`font-bold text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {isArabic ? 'جميع الفئات' : 'All Categories'}
        </h3>

        <button 
          onClick={onClose} 
          title={isArabic ? 'إغلاق' : 'Close'}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode 
              ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
              : 'hover:bg-slate-100 text-slate-400 hover:text-slate-800'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Search Categories Input */}
      <div className={`p-3 shrink-0 border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isArabic ? 'البحث في الفئات...' : 'Search categories...'}
            className={`w-full text-xs font-medium rounded-xl ps-9 pe-8 py-2 border outline-none transition-all ${
              isDarkMode 
                ? 'bg-[#0d1527] text-white placeholder-slate-400 border-slate-800 focus:border-[#7c3aed]' 
                : 'bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 border-transparent focus:border-slate-300'
            }`}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute end-2.5 text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Scrollable Categories Accordion List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 sleek-scrollbar">
        {filteredCategories.map((cat) => {
          const CatIcon = CATEGORY_ICON_MAP[cat.id] || Building;
          const isExpanded = searchTerm.trim().length > 0 ? true : Boolean(expandedCategories[cat.id]);
          
          const matchingSubs = cat.subcategories.filter(sub => {
            if (!searchTerm.trim()) return true;
            const term = searchTerm.toLowerCase();
            return (
              sub.name.toLowerCase().includes(term) || 
              sub.name_ar.includes(term) ||
              cat.name.toLowerCase().includes(term) ||
              cat.name_ar.includes(term)
            );
          });

          if (searchTerm.trim() && matchingSubs.length === 0) return null;

          const catSubIds = cat.subcategories.map(s => s.id);
          const selectedInCatCount = catSubIds.filter(id => selectedSubcategories.includes(id)).length;
          const isAllCatSelected = catSubIds.length > 0 && selectedInCatCount === catSubIds.length;

          return (
            <div 
              key={cat.id} 
              className={`rounded-xl border transition-all ${
                isDarkMode 
                  ? 'border-slate-800/80 bg-[#0d1527]/70' 
                  : 'border-slate-200/70 bg-slate-50/50'
              }`}
            >
              {/* Category Header Row */}
              <div 
                onClick={() => toggleCategoryExpand(cat.id)}
                className={`flex items-center justify-between px-3 py-2.5 cursor-pointer select-none rounded-xl transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-slate-800/50 text-slate-200' 
                    : 'hover:bg-slate-100/70 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Chevron Indicator */}
                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isDarkMode ? 'bg-[#111c34] text-[#a78bfa]' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    <CatIcon className="w-3.5 h-3.5" />
                  </div>

                  {/* Category Title */}
                  <span className="font-semibold text-xs truncate">
                    {isArabic ? cat.name_ar : cat.name}
                  </span>
                </div>

                {/* Subcategory Count Badge */}
                <div className="flex items-center gap-2 shrink-0 ms-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    selectedInCatCount > 0
                      ? (isDarkMode ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' : 'bg-purple-100 text-purple-800 border border-purple-200')
                      : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200/80 text-slate-600')
                  }`}>
                    {cat.subcategories.length}
                  </span>
                </div>
              </div>

              {/* Category Expanded Subcategories */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`overflow-hidden border-t ${
                      isDarkMode ? 'border-slate-800/80 bg-[#070b14]/50' : 'border-slate-200/60 bg-white/70'
                    }`}
                  >
                    {/* Quick Select All Button */}
                    <div className="flex items-center justify-between px-3 pt-2 pb-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {isArabic ? 'العناصر الفرعية' : 'Subcategories'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategorySelectAll(cat);
                        }}
                        className={`text-[10px] font-bold transition-colors cursor-pointer ${
                          isDarkMode ? 'text-[#a78bfa] hover:text-white' : 'text-[#7c3aed] hover:text-[#5b21b6]'
                        }`}
                      >
                        {isAllCatSelected 
                          ? (isArabic ? 'إلغاء تحديد الكل' : 'Deselect all') 
                          : (isArabic ? 'تحديد الكل' : 'Select all')}
                      </button>
                    </div>

                    {/* Subcategories List */}
                    <div className="px-2 pb-2 space-y-0.5">
                      {matchingSubs.map((sub) => {
                        const isChecked = selectedSubcategories.includes(sub.id);

                        return (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubcategory(sub.id)}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100/70'
                            }`}
                          >
                            {/* Checkbox box */}
                            <div className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                              isChecked
                                ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                                : (isDarkMode ? 'border border-slate-700 bg-slate-900' : 'border border-slate-300 bg-white')
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            {/* Subcategory Label */}
                            <span className={`text-xs select-none truncate ${
                              isChecked 
                                ? (isDarkMode ? 'text-white font-semibold' : 'text-slate-900 font-semibold') 
                                : (isDarkMode ? 'text-slate-300' : 'text-slate-700')
                            }`}>
                              {isArabic ? sub.name_ar : sub.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 4. Footer Bar: Clear All & Apply */}
      <div className={`px-4 py-3 border-t shrink-0 flex items-center justify-between ${
        isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-slate-50 border-slate-200/80'
      }`}>
        <button
          type="button"
          onClick={handleClearAll}
          className={`text-xs font-bold transition-colors cursor-pointer ${
            isDarkMode ? 'text-[#c084fc] hover:text-white' : 'text-[#7c3aed] hover:text-[#5b21b6]'
          }`}
        >
          {isArabic ? 'مسح الكل' : 'Clear all'}
        </button>

        <button
          type="button"
          onClick={onClose}
          className={`px-7 py-2 rounded-full text-xs font-bold text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:brightness-110 shadow-purple-900/30' 
              : 'bg-[#121124] hover:bg-[#1f1d3a]'
          }`}
        >
          {isArabic ? 'تطبيق' : 'Apply'}
        </button>
      </div>
    </motion.div>
  );
}
