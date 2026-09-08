import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, GraduationCap, PlusSquare, TreePine, Bus, 
  ChevronRight, Heart, X, Filter, Navigation, Zap, Target, Info, History, ChevronDown, Check, Globe, BarChart3, Building2, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';

export default function SearchResultsList({ explorerState, setExplorerState }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();

  const results = explorerState?.activeResults || activeProject.datasets || [];
  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'name' | 'type'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);

  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setExplorerState(prev => ({
      ...prev,
      showSearchResults: false
    }));
  };

  const handleSelectFacility = (item) => {
    setExplorerState(prev => ({
      ...prev,
      selectedLocation: item,
      mapFocus: { lat: item.lat, lng: item.lng, zoom: 17 }
    }));
  };

  const handleViewDetails = (item, e) => {
    if (e) e.stopPropagation();
    setExplorerState(prev => ({
      ...prev,
      selectedDetail: item,
      selectedLocation: item,
      mapFocus: { lat: item.lat, lng: item.lng, zoom: 17 }
    }));
  };

  const handleToggleFavorite = (item, e) => {
    if (e) e.stopPropagation();
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
      const exists = current.some(fav => fav.id === item.id || fav.name === item.name);
      const updated = exists 
        ? current.filter(fav => fav.id !== item.id && fav.name !== item.name)
        : [...current, item];
      return { ...prev, savedLocations: updated };
    });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'type') return (a.type || '').localeCompare(b.type || '');
    const distA = a.distance ? parseFloat(a.distance) : 2.0;
    const distB = b.distance ? parseFloat(b.distance) : 2.0;
    return distA - distB;
  });

  const displayedList = showAllResults ? sortedResults : sortedResults.slice(0, 5);

  const queryText = explorerState?.lastQuery || (isArabic ? 'المنشآت الحكومية ضمن نطاق 5 كم' : 'government facilities within 5 km');

  // If search results panel is explicitly hidden by user, return null
  if (explorerState?.showSearchResults === false) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute top-4 start-16 sm:start-20 z-30 w-[330px] sm:w-[370px] max-h-[calc(100vh-140px)] backdrop-blur-2xl rounded-3xl shadow-2xl border flex flex-col overflow-hidden pointer-events-auto transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#080d1a]/95 border-slate-800 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl'
      }`}
    >
      {/* 1. Header (Wireframe Page 03 & 04) */}
      <div className={`p-4 pb-3 border-b flex flex-col gap-2.5 shrink-0 ${
        isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
            {t('Search Results', 'نتائج البحث')}
          </h3>

          <div className="flex items-center gap-1.5">
            {/* Analytics On Demand Trigger */}
            <button
              onClick={() => setExplorerState(prev => ({ 
                ...prev, 
                showAnalyticsModal: true,
                analyticsTitle: isArabic ? 'تحليل نتائج البحث' : 'Government Facilities Analysis'
              }))}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-400 hover:text-[#00e5ff] hover:bg-slate-800' : 'text-slate-500 hover:text-[#215A9E] hover:bg-[#eef3ff]'
              }`}
              title={t('Analytics (On Demand)', 'تحليلات حسب الطلب')}
            >
              <BarChart3 className="w-4 h-4 text-[#215A9E] dark:text-[#00e5ff]" />
            </button>

            {/* Close Button */}
            <button 
              onClick={handleClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-800'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Query Chip Display (Wireframe Page 03) */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 truncate ${
          isDarkMode ? 'bg-[#121c38] border-slate-700/70 text-[#00e5ff]' : 'bg-[#eef3ff] border-[#3D52A0]/20 text-[#215A9E]'
        }`}>
          <Search className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span className="truncate">"{queryText}"</span>
        </div>

        {/* Count & Sort Controls (Wireframe Page 04) */}
        <div className="flex items-center justify-between text-xs font-medium pt-1">
          <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {results.length} {t('results found', 'نتائج تم العثور عليها')}
          </span>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#121c38] border-slate-700/80 text-slate-200 hover:border-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{t('Sort by: ', 'ترتيب حسب: ')}{sortBy === 'distance' ? t('Distance', 'المسافة') : sortBy === 'name' ? t('Name', 'الاسم') : t('Type', 'النوع')}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showSortMenu && (
              <div className={`absolute end-0 top-full mt-1.5 w-36 shadow-xl border rounded-xl py-1 z-50 overflow-hidden ${
                isDarkMode ? 'bg-[#0f1a36] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                {[
                  { id: 'distance', label_en: 'Distance', label_ar: 'المسافة' },
                  { id: 'name', label_en: 'Name', label_ar: 'الاسم' },
                  { id: 'type', label_en: 'Type', label_ar: 'النوع' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      sortBy === opt.id 
                        ? (isDarkMode ? 'bg-[#1e2e5a] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]')
                        : (isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50')
                    }`}
                  >
                    <span>{t(opt.label_en, opt.label_ar)}</span>
                    {sortBy === opt.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Numbered Item List (Wireframe Page 03 & 04) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 sleek-scrollbar">
        {displayedList.map((item, idx) => {
          const isSelected = explorerState?.selectedLocation?.id === item.id || explorerState?.selectedDetail?.id === item.id;
          const isFav = (explorerState?.savedLocations || []).some(fav => fav.id === item.id || fav.name === item.name);

          return (
            <div
              key={item.id || idx}
              onClick={(e) => handleViewDetails(item, e)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group relative ${
                isSelected
                  ? (isDarkMode ? 'bg-[#16274e] border-[#00e5ff]/80 shadow-md' : 'bg-[#eef3ff] border-[#215A9E]/60 shadow-sm')
                  : (isDarkMode ? 'bg-[#0e172e] border-slate-800 hover:bg-[#132145] hover:border-slate-700' : 'bg-slate-50/90 border-slate-200/80 hover:bg-white hover:shadow-xs')
              }`}
            >
              {/* Number Badge (1, 2, 3, 4, 5...) */}
              <div className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                isSelected
                  ? (isDarkMode ? 'bg-[#00e5ff] text-slate-950' : 'bg-[#215A9E] text-white')
                  : (isDarkMode ? 'bg-[#182645] text-slate-300 border border-slate-700' : 'bg-white text-slate-600 border border-slate-200')
              }`}>
                {idx + 1}
              </div>

              {/* Building Category Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-white text-[#215A9E] border border-slate-200/60'
              }`}>
                <Building2 className="w-4 h-4" />
              </div>

              {/* Title & Location details */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-xs truncate transition-colors ${
                  isSelected 
                    ? (isDarkMode ? 'text-[#00e5ff]' : 'text-[#215A9E]') 
                    : (isDarkMode ? 'text-white group-hover:text-sky-300' : 'text-[#1e2749]')
                }`}>
                  {isArabic && item.name_ar ? item.name_ar : item.name}
                </h4>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                  {isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Abu Dhabi')} • {item.distance || `${(1.2 + idx * 0.9).toFixed(1)} km`}
                </p>
              </div>

              {/* Action buttons on item (Favorite icon hidden for Guests) */}
              {isLoggedIn && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleToggleFavorite(item, e)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isFav 
                        ? 'bg-rose-500 text-white border-rose-500' 
                        : (isDarkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800 border-slate-700' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 border-slate-200')
                    }`}
                    title={t('Add to Favorites', 'إضافة للمفضلة')}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Action Pill (Wireframe Page 03 & 04) */}
      <div className={`p-3 border-t shrink-0 ${
        isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-slate-50 border-slate-100'
      }`}>
        <button
          onClick={() => setShowAllResults(!showAllResults)}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            isDarkMode
              ? 'bg-[#152347] border-slate-700 text-[#00e5ff] hover:bg-[#7c3aed] hover:text-white'
              : 'bg-[#eef3ff] border-[#3D52A0]/20 text-[#215A9E] hover:bg-[#215A9E] hover:text-white shadow-2xs'
          }`}
        >
          <span>{showAllResults ? t('Show top 5 results', 'عرض أول 5 نتائج') : t(`View all ${results.length} results`, `عرض جميع النتائج (${results.length})`)}</span>
        </button>
      </div>
    </motion.div>
  );
}
