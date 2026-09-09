import React, { useState, useEffect, useRef } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';
import { calculateGeodesicDistance, formatDistance } from '../../services/spatial/spatialAnalysisService';
import { aiOrchestrator } from '../../services/ai/aiOrchestrator';
import { triggerViewDetails } from '../../utils/viewDetailsHandler';
import facilitiesData from '../../data/facilitiesData.json';

const getItemCategoryIcon = (type) => {
  const tStr = (type || '').toUpperCase();
  if (tStr.includes('GOVERNMENT') || tStr.includes('MUNICIPAL') || tStr.includes('EXECUTIVE') || tStr.includes('PUBLIC')) {
    return AccountBalanceOutlinedIcon;
  }
  if (tStr.includes('HOSPITAL') || tStr.includes('HEALTHCARE') || tStr.includes('MEDICAL')) {
    return LocalHospitalOutlinedIcon;
  }
  if (tStr.includes('EDUCATION') || tStr.includes('SCHOOL') || tStr.includes('UNIVERSITY')) {
    return SchoolOutlinedIcon;
  }
  if (tStr.includes('PARK') || tStr.includes('ENVIRONMENT') || tStr.includes('GREEN')) {
    return ParkOutlinedIcon;
  }
  if (tStr.includes('TRANSPORT') || tStr.includes('BUS') || tStr.includes('MOBILITY') || tStr.includes('TRANSIT')) {
    return DirectionsBusOutlinedIcon;
  }
  if (tStr.includes('TOURISM') || tStr.includes('HERITAGE') || tStr.includes('MUSEUM')) {
    return ExploreOutlinedIcon;
  }
  if (tStr.includes('UTILITIES') || tStr.includes('POWER') || tStr.includes('ENERGY') || tStr.includes('INFRASTRUCTURE')) {
    return ElectricBoltOutlinedIcon;
  }
  if (tStr.includes('AGRICULTURE') || tStr.includes('AGRICULTURAL') || tStr.includes('FARM')) {
    return AgricultureOutlinedIcon;
  }
  return BusinessOutlinedIcon;
};

export default function SearchResultsList({ explorerState, setExplorerState }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();

  const results = explorerState?.activeResults || [];
  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'name' | 'type'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [searchInput, setSearchInput] = useState(explorerState?.lastQuery || '');

  useEffect(() => {
    if (explorerState?.lastQuery !== undefined) {
      setSearchInput(explorerState.lastQuery);
    }
  }, [explorerState?.lastQuery]);

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchInput || !searchInput.trim()) return;

    const trimmed = searchInput.trim();
    const response = await aiOrchestrator.processUserQuery(trimmed, explorerState, isArabic);

    let newResults = [];
    if (response?.blocks) {
      const locBlock = response.blocks.find(b => b.type === 'LOCATION_LIST' || b.type === 'FACILITY_LIST');
      if (locBlock?.locations) {
        newResults = locBlock.locations;
      }
    }

    if (!newResults || newResults.length === 0) {
      const qLower = trimmed.toLowerCase();
      newResults = facilitiesData.features.map(f => ({
        id: f.properties.id,
        name: f.properties.name,
        name_ar: f.properties.name_ar,
        location: `${f.properties.district}, ${f.properties.city}`,
        type: f.properties.facilityType,
        sector: f.properties.sector,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0]
      })).filter(f => 
        (f.name && f.name.toLowerCase().includes(qLower)) ||
        (f.name_ar && f.name_ar.includes(trimmed)) ||
        (f.location && f.location.toLowerCase().includes(qLower)) ||
        (f.type && f.type.toLowerCase().includes(qLower))
      );
    }

    setExplorerState(prev => ({
      ...prev,
      lastQuery: trimmed,
      activeResults: newResults,
      showSearchResults: true,
      chatHistory: [
        ...(prev.chatHistory || []),
        { sender: 'user', text: trimmed, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { sender: 'ai', text: response.text || `Search results for "${trimmed}"`, blocks: response.blocks, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    }));
  };

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

  const handleSelectFacility = (item, e) => {
    if (e) e.stopPropagation();
    const rect = e?.currentTarget?.getBoundingClientRect();
    triggerViewDetails(item, rect, setExplorerState, isArabic);
  };

  const handleViewDetails = (item, e) => {
    if (e) e.stopPropagation();
    const rect = e?.currentTarget?.getBoundingClientRect();
    triggerViewDetails(item, rect, setExplorerState, isArabic);
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
      const exists = current.some(fav => 
        (fav.id && item.id && String(fav.id) === String(item.id)) || 
        (fav.name && item.name && fav.name.trim().toLowerCase() === item.name.trim().toLowerCase())
      );
      const updated = exists 
        ? current.filter(fav => !((fav.id && item.id && String(fav.id) === String(item.id)) || (fav.name && item.name && fav.name.trim().toLowerCase() === item.name.trim().toLowerCase())))
        : [item, ...current];
      return { ...prev, savedLocations: updated };
    });
  };

  const originLat = explorerState?.userLocation?.lat || activeProject?.defaultCenter?.lat || 24.4839;
  const originLng = explorerState?.userLocation?.lng || activeProject?.defaultCenter?.lng || 54.3773;

  // Process items with exact geodesic distance from user location
  const processedResults = results.map(item => {
    const lat = item.lat || (item.geometry?.coordinates?.[1]);
    const lng = item.lng || (item.geometry?.coordinates?.[0]);
    let distKm = item.distanceKm;
    if (lat && lng) {
      distKm = calculateGeodesicDistance(originLat, originLng, lat, lng);
    }
    return {
      ...item,
      lat,
      lng,
      distanceKm: distKm !== undefined && distKm !== null ? distKm : 0
    };
  });

  const sortedResults = [...processedResults].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'type') return (a.type || '').localeCompare(b.type || '');
    return (a.distanceKm || 0) - (b.distanceKm || 0); // Closest first
  });

  const displayedList = showAllResults ? sortedResults : sortedResults.slice(0, 5);
  const queryText = explorerState?.lastQuery || (isArabic ? 'نتائج البحث' : 'Search Results');

  // If search results panel is explicitly hidden by user or no active results, return null
  if (explorerState?.showSearchResults === false || results.length === 0) {
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
              <BarChartOutlinedIcon style={{ fontSize: 18 }} />
            </button>

            {/* Close Button */}
            <button 
              onClick={handleClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-800'
              }`}
            >
              <CloseOutlinedIcon style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>

        {/* Interactive Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <SearchOutlinedIcon style={{ fontSize: 16 }} className={`absolute start-3 pointer-events-none z-10 ${
            isDarkMode ? 'text-[#00e5ff]' : 'text-[#215A9E]'
          }`} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('Search locations, facilities...', 'ابحث عن المواقع والمنشآت...')}
            className={`w-full ps-8 pe-8 py-1.5 text-xs font-semibold rounded-xl border outline-none transition-all ${
              isDarkMode 
                ? 'bg-[#121c38] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]' 
                : 'bg-[#f4f7fc] border-[#3D52A0]/20 text-[#1e2749] placeholder:text-slate-400 focus:border-[#215A9E] focus:ring-1 focus:ring-[#215A9E] focus:bg-white'
            }`}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute end-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              title={t('Clear search', 'مسح البحث')}
            >
              <CloseOutlinedIcon style={{ fontSize: 14 }} />
            </button>
          )}
        </form>

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
              <KeyboardArrowDownOutlinedIcon style={{ fontSize: 16 }} />
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
                    {sortBy === opt.id && <CheckOutlinedIcon style={{ fontSize: 16 }} />}
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
          const isFav = (explorerState?.savedLocations || []).some(fav => 
            (fav.id && item.id && String(fav.id) === String(item.id)) || 
            (fav.name && item.name && fav.name.trim().toLowerCase() === item.name.trim().toLowerCase())
          );
          const CategoryItemIcon = getItemCategoryIcon(item.type || item.facilityType || item.category);

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
              {/* Category Icon (Left side) */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E] border border-[#3D52A0]/20'
              }`}>
                <CategoryItemIcon style={{ fontSize: 20 }} />
              </div>

              {/* Title & Location details (Middle) */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-xs truncate transition-colors ${
                  isSelected 
                    ? (isDarkMode ? 'text-[#00e5ff]' : 'text-[#215A9E]') 
                    : (isDarkMode ? 'text-white group-hover:text-sky-300' : 'text-[#1e2749]')
                }`}>
                  {isArabic && item.name_ar ? item.name_ar : item.name}
                </h4>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                  {isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Abu Dhabi')}
                </p>
              </div>

              {/* Right Side: Distance Badge & Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className={`px-2.5 py-1 rounded-xl font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs whitespace-nowrap border ${
                  isSelected
                    ? (isDarkMode ? 'bg-[#00e5ff] text-slate-950 border-[#00e5ff]' : 'bg-[#215A9E] text-white border-[#215A9E]')
                    : (isDarkMode ? 'bg-[#142347] text-[#00e5ff] border-[#00e5ff]/30' : 'bg-[#f0f4ff] text-[#215A9E] border-[#3D52A0]/20')
                }`}>
                  {formatDistance(item.distanceKm)}
                </div>

                {isLoggedIn && (
                  <button
                    onClick={(e) => handleToggleFavorite(item, e)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isFav 
                        ? 'bg-rose-500 text-white border-rose-500' 
                        : (isDarkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800 border-slate-700' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 border-slate-200')
                    }`}
                    title={t('Add to Favorites', 'إضافة للمفضلة')}
                  >
                    {isFav ? <FavoriteOutlinedIcon style={{ fontSize: 16 }} /> : <FavoriteBorderOutlinedIcon style={{ fontSize: 16 }} />}
                  </button>
                )}
              </div>
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
