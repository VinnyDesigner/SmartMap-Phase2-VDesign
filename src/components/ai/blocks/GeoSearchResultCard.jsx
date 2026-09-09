import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { 
  Building2, MapPin, Phone, Clock, Activity, Compass, 
  Layers, ShieldCheck, Bus, PlusSquare, Navigation 
} from 'lucide-react';

import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateGeodesicDistance, formatDistance } from '../../../services/spatial/spatialAnalysisService';
import { getLandmarkThumbnail } from '../../../utils/landmarkImages';

const ICON_MAP = {
  GOVERNMENT: AccountBalanceOutlinedIcon,
  MUNICIPAL: AccountBalanceOutlinedIcon,
  PUBLIC: AccountBalanceOutlinedIcon,
  HEALTHCARE: LocalHospitalOutlinedIcon,
  HOSPITAL: LocalHospitalOutlinedIcon,
  EDUCATION: SchoolOutlinedIcon,
  PARK: ParkOutlinedIcon,
  ENVIRONMENT: ParkOutlinedIcon,
  TRANSPORT: DirectionsBusOutlinedIcon,
  TOURISM: ExploreOutlinedIcon,
  UTILITIES: ElectricBoltOutlinedIcon,
  AGRICULTURE: AgricultureOutlinedIcon,
  COMMERCIAL: BusinessOutlinedIcon
};

export default function GeoSearchResultCard({ 
  item, 
  onEntityClick, 
  onActionClick, 
  isLoggedIn = false,
  userLocation = null,
  isFavorite = false,
  onToggleFavorite = null,
  onPromptAuth = null,
  isExpandedProp,
  onToggleExpand
}) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  const [internalExpanded, setInternalExpanded] = useState(Boolean(isExpandedProp));
  const [cardTab, setCardTab] = useState('overview'); // 'overview' | 'details' | 'nearby' | 'related'
  const [travelMode, setTravelMode] = useState('driving'); // 'driving' | 'walking' | 'transit' | 'bicycling'

  React.useEffect(() => {
    if (isExpandedProp) {
      setInternalExpanded(true);
    }
  }, [isExpandedProp]);

  const isExpanded = internalExpanded;

  const itemCategory = (item.type || item.facilityType || item.category || 'GOVERNMENT').toUpperCase();
  const CategoryIcon = ICON_MAP[itemCategory] || BusinessOutlinedIcon;

  const displayName = isArabic && item.name_ar ? item.name_ar : item.name;
  const displayLocation = isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Abu Dhabi');
  const displayCategory = isArabic && item.category_ar ? item.category_ar : (item.category_en || item.type || 'Government Facility');

  // Compute exact geodesic distance from active user location or default origin
  const originLat = userLocation?.lat || 24.4839;
  const originLng = userLocation?.lng || 54.3773;

  let distanceStr = null;
  if (item.lat && item.lng) {
    const computedDist = calculateGeodesicDistance(originLat, originLng, item.lat, item.lng);
    distanceStr = formatDistance(computedDist);
  } else if (item.distanceKm !== undefined && item.distanceKm !== null) {
    distanceStr = formatDistance(item.distanceKm);
  } else if (item.distance !== undefined && item.distance !== null) {
    distanceStr = typeof item.distance === 'number' ? formatDistance(item.distance) : item.distance;
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      if (onPromptAuth) {
        onPromptAuth(isArabic ? 'يتطلب تسجيل الدخول لإضافة المفضلة' : 'Sign in required to save locations to Favorites');
      }
      return;
    }
    if (onToggleFavorite) {
      onToggleFavorite(item);
    }
  };

  const handleFocusClick = (e) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick({
        actionType: 'MAP_FLY_TO',
        title: displayName,
        params: { lat: item.lat, lng: item.lng, zoom: 17, item: item, location: item }
      });
    }
    if (onEntityClick) {
      onEntityClick(item);
    }
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setInternalExpanded(prev => !prev);
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  const numericDistanceKm = typeof item.distanceKm === 'number' 
    ? item.distanceKm 
    : (item.lat && item.lng ? calculateGeodesicDistance(originLat, originLng, item.lat, item.lng) : 2.5);

  const getEstimatedTime = (mode) => {
    const dist = numericDistanceKm || 2.5;
    if (mode === 'driving') {
      const mins = Math.max(2, Math.round((dist / 35) * 60));
      return `${mins} min`;
    }
    if (mode === 'walking') {
      const mins = Math.max(5, Math.round((dist / 4.5) * 60));
      return `${mins} min`;
    }
    if (mode === 'transit') {
      const mins = Math.max(4, Math.round((dist / 22) * 60 + 4));
      return `${mins} min`;
    }
    if (mode === 'bicycling') {
      const mins = Math.max(3, Math.round((dist / 14) * 60));
      return `${mins} min`;
    }
    return '5 min';
  };

  const handleDirectionsClick = (e, selectedMode = travelMode) => {
    if (e) e.stopPropagation();
    if (onActionClick) {
      onActionClick({
        actionType: 'SHOW_DIRECTIONS',
        title: isArabic ? `الاتجاهات إلى ${displayName}` : `Directions to ${displayName}`,
        params: { destination: item, travelMode: selectedMode }
      });
    }
  };

  const googleMapsDestination = (item.lat && item.lng)
    ? `${item.lat},${item.lng}`
    : encodeURIComponent(displayName);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${googleMapsDestination}&travelmode=${travelMode}`;

  return (
    <div 
      id={`chat-card-${item.id || item.name}`}
      onClick={handleFocusClick}
      className={`group relative w-full rounded-2xl p-3 border transition-colors duration-200 cursor-pointer shadow-xs overflow-hidden flex flex-col gap-2 ${
        isDarkMode 
          ? 'bg-[#0f182e] border-slate-800/90 text-slate-100' 
          : 'bg-white border-slate-200/90 text-slate-800'
      }`}
    >
      {/* Top Header: Icon, Title, Distance */}
      <div className="flex items-start gap-2.5 min-w-0">
        {/* Category Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
          item.riskLevel === 'Critical'
            ? (isDarkMode ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-rose-100 text-rose-700 border border-rose-200')
            : item.riskLevel === 'High'
            ? (isDarkMode ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'bg-amber-100 text-amber-700 border border-amber-200')
            : (isDarkMode ? 'bg-[#182645] text-[#00e5ff] border border-slate-700/80' : 'bg-[#eef3ff] text-[#215A9E] border border-[#215A9E]/20')
        }`}>
          <CategoryIcon className="w-4.5 h-4.5" />
        </div>

        {/* Name + Meta + Distance */}
        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
          <div className="flex items-start justify-between gap-1.5 min-w-0">
            <h4 className={`font-bold text-xs leading-snug min-w-0 flex-1 break-words ${
              isDarkMode ? 'text-white' : 'text-[#1e2749]'
            }`}>
              {displayName}
            </h4>
            {/* Distance Badge — shrinks to the right of the name */}
            {distanceStr && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 border flex items-center gap-1 self-start ${
                isDarkMode 
                  ? 'bg-[#182645] text-[#00e5ff] border-slate-700/80' 
                  : 'bg-[#eef3ff] text-[#215A9E] border-[#215A9E]/20'
              }`}>
                <PlaceOutlinedIcon style={{ fontSize: 11 }} className="text-amber-500" />
                <span className="whitespace-nowrap">{distanceStr}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 flex-wrap">
            <span className="font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{displayCategory}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            <span className="font-medium text-slate-500 dark:text-slate-400 truncate">{displayLocation}</span>
          </div>
        </div>
      </div>

      {/* Short Description */}
      {(item.description || item.description_ar || item.riskDrivers || item.capacity || item.openingHours) && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {isArabic ? (item.description_ar || item.description || (item.riskDrivers ? item.riskDrivers.join(' • ') : 'منشأة عامة رسمية معتمدة من حكومة أبوظبي')) : (item.description || (item.riskDrivers ? item.riskDrivers.join(' • ') : 'Official government infrastructure facility registered in DGE Spatial SDI.'))}
        </p>
      )}

      {/* Action Button Row */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 flex-wrap">
        {/* Focus on Map */}
        <button
          type="button"
          onClick={handleFocusClick}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[10px] ${
            isDarkMode 
              ? 'bg-[#182645] text-sky-300 hover:bg-[#7c3aed] hover:text-white border border-slate-700/80' 
              : 'bg-slate-100 text-slate-700 hover:bg-black hover:text-white border border-slate-200'
          }`}
          title={t('Focus on map location', 'التركيز على خريطة الموقع')}
        >
          <MyLocationOutlinedIcon style={{ fontSize: 14 }} className="text-sky-400" />
          <span>{t('Focus', 'تركيز')}</span>
        </button>

        {/* Details Button */}
        <button
          type="button"
          onClick={handleInfoClick}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[10px] ${
            isExpanded
              ? 'bg-[#3B66AD] text-white font-extrabold shadow-2xs'
              : (isDarkMode 
                  ? 'bg-[#182645] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-slate-950 border border-slate-700/80' 
                  : 'bg-[#eef3ff] text-[#215A9E] hover:bg-[#215A9E] hover:text-white border border-[#215A9E]/20')
          }`}
          title={t('Toggle details panel', 'عرض/إخفاء التفاصيل')}
        >
          <InfoOutlinedIcon style={{ fontSize: 14 }} />
          <span>{isExpanded ? t('Hide', 'إخفاء') : t('Details', 'التفاصيل')}</span>
        </button>

        {/* Directions */}
        <button
          type="button"
          onClick={handleDirectionsClick}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[10px] ${
            isDarkMode 
              ? 'bg-[#182645] text-emerald-400 hover:bg-emerald-600 hover:text-white border border-slate-700/80' 
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
          }`}
          title={t('Get directions', 'الاتجاهات')}
        >
          <DirectionsOutlinedIcon style={{ fontSize: 14 }} />
          <span>{t('Directions', 'الاتجاهات')}</span>
        </button>

        {/* Favorite (Heart) — Logged-in only, pushed to end */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`ms-auto p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isFavorite 
                ? 'bg-rose-500 text-white border-rose-500' 
                : (isDarkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800 border-slate-700' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 border-slate-200')
            }`}
            title={isFavorite ? t('Remove from Favorites', 'إزالة من المفضلة') : t('Add to Favorites', 'إضافة للمفضلة')}
          >
            {isFavorite ? <FavoriteOutlinedIcon style={{ fontSize: 14 }} /> : <FavoriteBorderOutlinedIcon style={{ fontSize: 14 }} />}
          </button>
        )}
      </div>

      {/* RICH COLLAPSIBLE ACCORDION DETAILS WITH SMOOTH HEIGHT ANIMATION */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="details-accordion-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              height: { duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] },
              opacity: { duration: 0.22, ease: 'easeOut' }
            }}
            className="overflow-hidden w-full pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={`pt-2.5 border-t space-y-3 text-start rounded-2xl overflow-hidden ${
                isDarkMode ? 'border-slate-800 text-slate-200 bg-[#080e1e]/95' : 'border-slate-200 text-slate-700 bg-slate-50/95'
              }`}
            >
              {/* 1. Landmark Image Banner with Title & Risk Badge (Image 2) */}
              <div className="relative w-full h-32 rounded-xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 shadow-xs">
                <img
                  src={getLandmarkThumbnail(item)}
                  alt={displayName}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2 start-2.5 end-2.5 flex items-center justify-between text-white text-[11px] font-bold tracking-tight">
                  <span className="truncate drop-shadow-md">{displayName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-sky-300 border border-white/20 shrink-0 ms-2">
                    {item.riskLevel ? `${item.riskLevel} Risk` : 'SDI Certified'}
                  </span>
                </div>
              </div>

              {/* 2. 4 Tabs: Overview | Details | Nearby | Related (Image 2) */}
              <div className={`flex items-center justify-around border-b shrink-0 px-1 py-1 text-[11px] font-extrabold ${
                isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200/80'
              }`}>
                {[
                  { id: 'overview', label_en: 'Overview', label_ar: 'نظرة عامة' },
                  { id: 'details', label_en: 'Details', label_ar: 'التفاصيل' },
                  { id: 'nearby', label_en: 'Nearby', label_ar: 'بالقرب' },
                  { id: 'related', label_en: 'Related', label_ar: 'ذات صلة' }
                ].map(tab => {
                  const isActive = cardTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCardTab(tab.id)}
                      className={`py-1 px-2 rounded-lg transition-all cursor-pointer relative ${
                        isActive
                          ? (isDarkMode ? 'text-[#00e5ff] font-black' : 'text-[#215A9E] font-black')
                          : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
                      }`}
                    >
                      <span>{t(tab.label_en, tab.label_ar)}</span>
                      {isActive && (
                        <motion.div 
                          layoutId={`activeTabBadge-${item.id || item.name}`}
                          className="absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-[#215A9E] dark:bg-[#00e5ff] rounded-full" 
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 3. Tab Body Contents with Smooth Motion Fade */}
              <div className="p-3 pt-1 text-[11px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cardTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                  >
                    {/* TAB 1: OVERVIEW (Image 2 elements) */}
                    {cardTab === 'overview' && (
                      <div className="space-y-2.5">
                        {/* Government Facility Type */}
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                          }`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                              {displayCategory}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-400">
                              {isArabic ? 'دائرة التمكين الحكومي - أبوظبي' : 'Department of Government Enablement'}
                            </p>
                          </div>
                        </div>

                        {/* Address & Distance */}
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                          }`}>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                              {displayLocation}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-400">
                              {distanceStr || '2.1 km'}
                            </p>
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                          }`}>
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                              {t('Contact', 'معلومات الاتصال')}
                            </h4>
                            <div className="text-[10px] font-medium text-slate-400 space-y-0.5">
                              <p>+971 2 800 555</p>
                              <p className="text-[#215A9E] dark:text-[#00e5ff] font-semibold">www.dge.gov.ae</p>
                            </div>
                          </div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                          }`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                              {t('Working Hours', 'ساعات العمل')}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-400">
                              Mon - Fri, 7:30 AM - 3:30 PM
                            </p>
                          </div>
                        </div>

                        {/* Operational Status */}
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDarkMode ? 'bg-[#121c38] text-[#00e5ff]' : 'bg-[#eef3ff] text-[#215A9E]'
                          }`}>
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                              {t('Status & Operations', 'الحالة التشغيلية')}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                {isArabic ? 'نشط ومطابق للمواصفات المكانية' : 'Fully Operational & SDI Certified'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: DETAILS */}
                    {cardTab === 'details' && (
                      <div className="space-y-2.5">
                        <div className={`p-2.5 rounded-xl border text-[11px] ${isDarkMode ? 'bg-[#101a35] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <h5 className="font-bold text-[#215A9E] dark:text-[#00e5ff] text-[11px] mb-1.5 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5" />
                            <span>{t('Geospatial Coordinates', 'الإحداثيات المكانية')}</span>
                          </h5>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            <div>
                              <span className="text-slate-400 block">{t('Latitude', 'خط العرض')}</span>
                              <span className="font-mono font-bold">{(item.lat || 24.4839).toFixed(4)}° N</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">{t('Longitude', 'خط الطول')}</span>
                              <span className="font-mono font-bold">{(item.lng || 54.3773).toFixed(4)}° E</span>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                              <span className="text-slate-400 block">{t('Spatial Reference (SRID)', 'النظام المرجعي المكاني')}</span>
                              <span className="font-semibold text-slate-600 dark:text-slate-300">EPSG:4326 (WGS 84 / Abu Dhabi Grid)</span>
                            </div>
                          </div>
                        </div>

                        <div className={`p-2.5 rounded-xl border text-[11px] ${isDarkMode ? 'bg-[#101a35] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <h5 className="font-bold text-[#215A9E] dark:text-[#00e5ff] text-[11px] mb-1.5 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{t('SDI Layer & Asset Metrics', 'مؤشرات الطبقة والمرافق')}</span>
                          </h5>
                          <div className="space-y-1 text-[10px]">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">{t('Feature ID', 'معرف المنشأة')}:</span>
                              <span className="font-mono font-bold">SDI-AD-{item.id || '2026'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">{t('Environmental Risk', 'مؤشر المخاطر')}:</span>
                              <span className={`font-bold px-1.5 py-0.5 rounded-full text-[9px] ${
                                item.riskLevel === 'High' || item.riskLevel === 'Critical'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {item.riskLevel || 'Low Risk'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: NEARBY */}
                    {cardTab === 'nearby' && (
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-400 font-medium">
                          {t('Surrounding services within 2 km radius:', 'الخدمات والمرافق المجاورة في محيط 2 كم:')}
                        </p>
                        {[
                          { name: isArabic ? 'محطة حافلات النقل العام' : 'Corniche Transit Stop', type: 'Public Transit', dist: '320 m', distKm: 0.32, latOffset: 0.003, lngOffset: 0.001, icon: Bus, color: 'text-amber-500 bg-amber-500/10' },
                          { name: isArabic ? 'مواقف السيارات الذكية' : 'Smart Visitor Parking', type: 'Smart Parking', dist: '150 m', distKm: 0.15, latOffset: -0.001, lngOffset: 0.002, icon: Navigation, color: 'text-blue-500 bg-blue-500/10' },
                          { name: isArabic ? 'مركز شرطة البطين' : 'Al Bateen Safety Hub', type: 'Public Safety', dist: '750 m', distKm: 0.75, latOffset: -0.005, lngOffset: -0.003, icon: ShieldCheck, color: 'text-indigo-500 bg-indigo-500/10' },
                          { name: isArabic ? 'وحدة الإسعاف الطبية' : 'Paramedic Station', type: 'Healthcare', dist: '1.1 km', distKm: 1.1, latOffset: 0.007, lngOffset: -0.004, icon: PlusSquare, color: 'text-rose-500 bg-rose-500/10' }
                        ].map((poi, pIdx) => {
                          const PoiIcon = poi.icon;
                          const poiLat = item.lat + (poi.latOffset || 0);
                          const poiLng = item.lng + (poi.lngOffset || 0);
                          const handlePoiClick = (e) => {
                            e.stopPropagation();
                            const poiItem = { ...poi, lat: poiLat, lng: poiLng, type: poi.type, location: poi.type };
                            if (onActionClick) {
                              onActionClick({
                                actionType: 'MAP_FLY_TO',
                                title: poi.name,
                                params: { lat: poiLat, lng: poiLng, zoom: 17, item: poiItem, location: poiItem }
                              });
                            }
                            if (onEntityClick) {
                              onEntityClick(poiItem);
                            }
                          };
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={handlePoiClick}
                              className={`w-full p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-150 text-start group/poi ${
                                isDarkMode
                                  ? 'bg-[#101a35] border-slate-800 hover:border-[#00e5ff]/40 hover:bg-[#182645]'
                                  : 'bg-white border-slate-200 hover:border-[#215A9E]/40 hover:bg-[#eef3ff]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${poi.color}`}>
                                  <PoiIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-[11px] truncate">{poi.name}</h5>
                                  <span className="text-[9.5px] text-slate-400">{poi.type} • <strong className="text-[#215A9E] dark:text-[#00e5ff]">{poi.dist}</strong></span>
                                </div>
                              </div>
                              {/* Focus indicator */}
                              <MyLocationOutlinedIcon style={{ fontSize: 13 }} className="text-slate-300 dark:text-slate-600 group-hover/poi:text-[#215A9E] dark:group-hover/poi:text-[#00e5ff] shrink-0 transition-colors" />
                            </button>
                          );
                        })}

                      </div>
                    )}

                    {/* TAB 4: RELATED */}
                    {cardTab === 'related' && (
                      <div className="space-y-2">
                        <div className={`p-2.5 rounded-xl border text-[11px] ${isDarkMode ? 'bg-[#101a35] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <h5 className="font-bold text-[#215A9E] dark:text-[#00e5ff] text-[11px] mb-1.5 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{t('Active Linked SDI Layers', 'طبقات البيانات المكانية المرتبطة')}</span>
                          </h5>
                          <div className="space-y-1 text-[10px]">
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 flex items-center justify-between">
                              <span className="font-semibold truncate">Abu Dhabi Land Registry v4.2</span>
                              <span className="text-emerald-500 font-bold ms-1 shrink-0">Active</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 flex items-center justify-between">
                              <span className="font-semibold truncate">TAQA Subsurface Power Grid</span>
                              <span className="text-emerald-500 font-bold ms-1 shrink-0">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 4. Travel Mode Selector & Directions Footer (Matching Reference Image 2) */}
              <div className="p-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 space-y-2.5">
                {/* Travel Mode Pills (Drive, Walk, Transit, Bike) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-0.5">
                    <span>{t('Travel Mode', 'وسيلة التنقل')}</span>
                    <span className="text-[#215A9E] dark:text-[#00e5ff] font-bold">~{getEstimatedTime(travelMode)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'driving', label_en: 'Drive', label_ar: 'سيارة', icon: DirectionsCarOutlinedIcon },
                      { id: 'walking', label_en: 'Walk', label_ar: 'مشي', icon: DirectionsWalkOutlinedIcon },
                      { id: 'transit', label_en: 'Transit', label_ar: 'حافلة', icon: DirectionsBusOutlinedIcon },
                      { id: 'bicycling', label_en: 'Bike', label_ar: 'دراجة', icon: DirectionsBikeOutlinedIcon }
                    ].map(mode => {
                      const ModeIcon = mode.icon;
                      const isSelected = travelMode === mode.id;
                      const estTime = getEstimatedTime(mode.id);
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTravelMode(mode.id);
                          }}
                          className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            isSelected
                              ? (isDarkMode 
                                  ? 'bg-[#182645] border-[#00e5ff] text-[#00e5ff] font-bold shadow-xs' 
                                  : 'bg-[#eef3ff] border-[#215A9E] text-[#215A9E] font-bold shadow-xs')
                              : (isDarkMode 
                                  ? 'bg-[#0f1932] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300')
                          }`}
                          title={`${mode.label_en} (~${estTime})`}
                        >
                          <ModeIcon style={{ fontSize: 16 }} />
                          <span className="text-[9.5px] font-extrabold mt-0.5">{t(mode.label_en, mode.label_ar)}</span>
                          <span className="text-[8.5px] font-semibold opacity-75">{estTime}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary In-App Get Directions Button */}
                <button
                  type="button"
                  onClick={(e) => handleDirectionsClick(e, travelMode)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3B66AD] hover:bg-[#2c508c] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-white" />
                  <span>{t('Get Directions', 'اتجاهات السير')} ({getEstimatedTime(travelMode)})</span>
                </button>

                {/* Google Maps External Navigation Link (Reference Image 2 Design) */}
                <div className="pt-1 flex items-center justify-center border-t border-slate-100 dark:border-slate-800/80">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-[11px] font-bold text-[#2563eb] hover:text-[#1d4ed8] dark:text-[#38bdf8] dark:hover:text-[#7dd3fc] underline decoration-[#2563eb]/40 hover:decoration-[#2563eb] transition-all cursor-pointer group/gmap py-0.5"
                  >
                    <div className="w-5 h-5 rounded bg-[#4285F4] text-white flex items-center justify-center shrink-0 shadow-2xs text-[10px] font-black group-hover/gmap:scale-105 transition-transform">
                      ➜
                    </div>
                    <span>{t('Get Directions on Google Maps', 'الحصول على الاتجاهات في خرائط Google')}</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
