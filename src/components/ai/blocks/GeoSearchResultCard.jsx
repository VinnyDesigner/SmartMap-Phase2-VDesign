import React, { useState } from 'react';
import { 
  Building2, PlusSquare, GraduationCap, TreePine, Bus, Navigation, 
  MapPin, Heart, ArrowRight, Compass, ShieldAlert, Zap, Info, Target, Globe
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const ICON_MAP = {
  GOVERNMENT: Building2,
  MUNICIPAL: Building2,
  PUBLIC: Building2,
  HEALTHCARE: PlusSquare,
  HOSPITAL: PlusSquare,
  EDUCATION: GraduationCap,
  PARK: TreePine,
  ENVIRONMENT: TreePine,
  TRANSPORT: Bus,
  TOURISM: Compass,
  UTILITIES: Zap,
  COMMERCIAL: Building2
};

export default function GeoSearchResultCard({ 
  item, 
  onEntityClick, 
  onActionClick, 
  isLoggedIn = false,
  userLocation = null,
  isFavorite = false,
  onToggleFavorite = null,
  onPromptAuth = null
}) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!item) return null;

  const itemCategory = (item.type || item.facilityType || item.category || 'GOVERNMENT').toUpperCase();
  const CategoryIcon = ICON_MAP[itemCategory] || Building2;

  const displayName = isArabic && item.name_ar ? item.name_ar : item.name;
  const displayLocation = isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Abu Dhabi');
  const displayCategory = isArabic && item.category_ar ? item.category_ar : (item.category_en || item.type || 'Government Facility');

  // Compute or format distance
  let distanceStr = null;
  if (item.distanceKm !== undefined && item.distanceKm !== null) {
    distanceStr = `${item.distanceKm} km`;
  } else if (item.distance !== undefined && item.distance !== null) {
    distanceStr = typeof item.distance === 'number' ? `${item.distance.toFixed(1)} km` : item.distance;
  } else if (userLocation && item.lat && item.lng) {
    const d = Math.sqrt(Math.pow(item.lat - userLocation.lat, 2) + Math.pow(item.lng - userLocation.lng, 2)) * 111;
    distanceStr = `${d.toFixed(1)} km`;
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
        params: { lat: item.lat, lng: item.lng, zoom: 17 }
      });
    } else if (onEntityClick) {
      onEntityClick(item);
    }
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  const handleDirectionsClick = (e) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick({
        actionType: 'SHOW_DIRECTIONS',
        title: isArabic ? `الاتجاهات إلى ${displayName}` : `Directions to ${displayName}`,
        params: { destination: item }
      });
    }
  };

  return (
    <div 
      onClick={handleFocusClick}
      className={`group relative rounded-2xl p-3 sm:p-3.5 border transition-all cursor-pointer shadow-xs overflow-hidden flex flex-col gap-2.5 ${
        isDarkMode 
          ? 'bg-[#0f182e] border-slate-800/90 text-slate-100 hover:border-[#7c3aed]/60 hover:bg-[#131e3a]' 
          : 'bg-white border-slate-200/90 text-slate-800 hover:border-[#215A9E]/40 hover:shadow-md'
      }`}
    >
      {/* Top Header: Icon, Title, Category Badge, Distance */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
            item.riskLevel === 'Critical'
              ? (isDarkMode ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-rose-100 text-rose-700 border border-rose-200')
              : item.riskLevel === 'High'
              ? (isDarkMode ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'bg-amber-100 text-amber-700 border border-amber-200')
              : (isDarkMode ? 'bg-[#182645] text-[#00e5ff] border border-slate-700/80' : 'bg-[#eef3ff] text-[#215A9E] border border-[#215A9E]/20')
          }`}>
            <CategoryIcon className="w-4.5 h-4.5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className={`font-bold text-xs leading-snug truncate transition-colors ${
                isDarkMode ? 'text-white group-hover:text-[#00e5ff]' : 'text-[#1e2749] group-hover:text-[#215A9E]'
              }`}>
                {displayName}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 flex-wrap">
              <span className="font-semibold text-slate-500 dark:text-slate-400">{displayCategory}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
              <span className="font-medium text-slate-500 dark:text-slate-400 truncate">{displayLocation}</span>
            </div>
          </div>
        </div>

        {/* Distance Badge */}
        {distanceStr && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 border flex items-center gap-1 ${
            isDarkMode 
              ? 'bg-[#182645] text-[#00e5ff] border-slate-700/80' 
              : 'bg-[#eef3ff] text-[#215A9E] border-[#215A9E]/20'
          }`}>
            <MapPin className="w-3 h-3 text-amber-500" />
            <span>{distanceStr}</span>
          </span>
        )}
      </div>

      {/* Short Description */}
      {(item.description || item.description_ar || item.riskDrivers || item.capacity || item.openingHours) && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {isArabic ? (item.description_ar || item.description || (item.riskDrivers ? item.riskDrivers.join(' • ') : 'منشأة عامة رسمية معتمدة من حكومة أبوظبي')) : (item.description || (item.riskDrivers ? item.riskDrivers.join(' • ') : 'Official government infrastructure facility registered in DGE Spatial SDI.'))}
        </p>
      )}

      {/* Reusable Uniform Action Button Row */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 text-[10px] flex-wrap">
        <div className="flex items-center gap-1">
          {/* Focus on Map */}
          <button
            type="button"
            onClick={handleFocusClick}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isDarkMode 
                ? 'bg-[#182645] text-sky-300 hover:bg-[#7c3aed] hover:text-white border border-slate-700/80' 
                : 'bg-slate-100 text-slate-700 hover:bg-black hover:text-white border border-slate-200'
            }`}
            title={t('Focus on map location', 'التركيز على خريطة الموقع')}
          >
            <Target className="w-3 h-3 text-sky-400" />
            <span>{t('Focus', 'تركيز')}</span>
          </button>

          {/* Info / Toggle Inline Collapsible Details */}
          <button
            type="button"
            onClick={handleInfoClick}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isExpanded
                ? 'bg-[#00e5ff] text-slate-950 font-extrabold shadow-2xs'
                : (isDarkMode 
                    ? 'bg-[#182645] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-slate-950 border border-slate-700/80' 
                    : 'bg-[#eef3ff] text-[#215A9E] hover:bg-[#215A9E] hover:text-white border border-[#215A9E]/20')
            }`}
            title={t('Toggle information details below', 'عرض/إخفاء التفاصيل المكانية')}
          >
            <Info className="w-3 h-3" />
            <span>{isExpanded ? t('Hide Info', 'إخفاء') : t('Info', 'معلومات')}</span>
          </button>

          {/* Directions / Route */}
          <button
            type="button"
            onClick={handleDirectionsClick}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isDarkMode 
                ? 'bg-[#182645] text-emerald-400 hover:bg-emerald-600 hover:text-white border border-slate-700/80' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
            }`}
            title={t('Get directions', 'الاتجاهات')}
          >
            <Compass className="w-3 h-3" />
            <span>{t('Directions', 'الاتجاهات')}</span>
          </button>
        </div>

        {/* Favorite (Heart) Button - Enabled for Registered Users Only */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg font-bold transition-all cursor-pointer border ${
              isFavorite
                ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                : (isDarkMode 
                    ? 'bg-[#182645] text-slate-400 hover:text-rose-400 border-slate-700/80 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-400 hover:text-rose-600 border-slate-200 hover:bg-slate-200')
            }`}
            title={isFavorite ? t('Remove from Favorites', 'إزالة من المفضلة') : t('Add to Favorites', 'إضافة للمفضلة')}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* COLLAPSIBLE INLINE INFORMATION PANEL BELOW THE CARD */}
      {isExpanded && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`mt-2 pt-3 border-t space-y-2.5 transition-all text-start ${
            isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-700'
          }`}
        >
          {/* Spatial WGS84 Reference */}
          <div className={`p-2.5 rounded-xl border space-y-1.5 ${
            isDarkMode ? 'bg-[#0a1124] border-slate-800' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#00e5ff]" />
                <span>{t('Spatial Coordinates', 'الإحداثيات الجغرافية')}</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                EPSG:4326
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-100">
              <div>lat: {item.lat ? item.lat.toFixed(4) : '24.4839'}° N</div>
              <div>lng: {item.lng ? item.lng.toFixed(4) : '54.3773'}° E</div>
            </div>

            <div className="text-[10px] text-slate-500 font-semibold truncate pt-1 border-t border-slate-200/40 dark:border-slate-800">
              SDI ID: SDI-AD-{item.id || '2026'} • Sector: {item.district || item.location || 'Abu Dhabi'}
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {item.rating && (
              <div className={`p-2 rounded-lg border flex flex-col justify-between ${isDarkMode ? 'bg-[#121c35] border-slate-700/60' : 'bg-white border-slate-200'}`}>
                <span className="text-slate-400 font-semibold">{t('Rating', 'التقييم')}</span>
                <span className="font-bold text-amber-500 mt-0.5">⭐ {item.rating} / 5.0</span>
              </div>
            )}

            {item.annualVisitors && (
              <div className={`p-2 rounded-lg border flex flex-col justify-between ${isDarkMode ? 'bg-[#121c35] border-slate-700/60' : 'bg-white border-slate-200'}`}>
                <span className="text-slate-400 font-semibold">{t('Annual Visitors', 'الزوار السنويون')}</span>
                <span className="font-bold text-slate-800 dark:text-white mt-0.5">{item.annualVisitors.toLocaleString()}</span>
              </div>
            )}

            {item.emissionsIndex && (
              <div className={`p-2 rounded-lg border flex flex-col justify-between ${isDarkMode ? 'bg-[#121c35] border-slate-700/60' : 'bg-white border-slate-200'}`}>
                <span className="text-slate-400 font-semibold">{t('Carbon Emissions', 'انبعاثات الكربون')}</span>
                <span className="font-bold text-slate-800 dark:text-white mt-0.5">{item.emissionsIndex.toLocaleString()} tCO2e</span>
              </div>
            )}

            {item.waterConsumption && (
              <div className={`p-2 rounded-lg border flex flex-col justify-between ${isDarkMode ? 'bg-[#121c35] border-slate-700/60' : 'bg-white border-slate-200'}`}>
                <span className="text-slate-400 font-semibold">{t('Water Usage', 'استهلاك المياه')}</span>
                <span className="font-bold text-slate-800 dark:text-white mt-0.5">{item.waterConsumption.toLocaleString()} m³/d</span>
              </div>
            )}
          </div>

          {/* Full Narrative Overview */}
          {(item.description || item.description_ar) && (
            <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
              isDarkMode ? 'bg-[#0a1124] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <h5 className="font-bold text-[10px] uppercase text-slate-400 mb-1">{t('Overview & Technical Mandate', 'النبذة الفنية والتشغيلية')}</h5>
              <p>{isArabic && item.description_ar ? item.description_ar : item.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
