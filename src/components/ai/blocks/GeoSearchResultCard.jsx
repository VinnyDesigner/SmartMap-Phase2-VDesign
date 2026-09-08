import React from 'react';
import { 
  Building2, PlusSquare, GraduationCap, TreePine, Bus, Navigation, 
  MapPin, Bookmark, Eye, ArrowRight, Compass, ShieldAlert, Zap
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
        onPromptAuth(isArabic ? 'حفظ المواقع في المفضلة' : 'Save Location to Favorites');
      }
      return;
    }
    if (onToggleFavorite) {
      onToggleFavorite(item);
    }
  };

  const handleFocusClick = (e) => {
    e.stopPropagation();
    if (onEntityClick) {
      onEntityClick(item);
    }
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

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick({
        actionType: 'FACILITY_OPEN_DETAIL',
        title: displayName,
        params: { facility: item }
      });
    } else if (onEntityClick) {
      onEntityClick(item);
    }
  };

  return (
    <div 
      onClick={() => onEntityClick && onEntityClick(item)}
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

      {/* Short Description or Key Attributes */}
      {(item.description || item.description_ar || item.riskDrivers || item.capacity || item.openingHours) && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {isArabic ? (item.description_ar || item.description || (item.riskDrivers ? item.riskDrivers.join(' • ') : 'منشأة عامة رسمية معتمدة من حكومة أبوظبي')) : (item.description || (item.riskDrivers ? item.riskDrivers.join(' • ') : 'Official government infrastructure facility registered in DGE Spatial SDI.'))}
        </p>
      )}

      {/* Reusable Uniform Action Button Row */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 text-[10px] flex-wrap">
        <div className="flex items-center gap-1">
          {/* View Details */}
          <button
            type="button"
            onClick={handleViewDetailsClick}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isDarkMode 
                ? 'bg-[#182645] text-slate-200 hover:bg-[#7c3aed] hover:text-white border border-slate-700/80' 
                : 'bg-slate-100 text-slate-700 hover:bg-black hover:text-white border border-slate-200'
            }`}
            title={t('View details', 'عرض التفاصيل')}
          >
            <Eye className="w-3 h-3" />
            <span>{t('View', 'عرض')}</span>
          </button>

          {/* Focus on Map */}
          <button
            type="button"
            onClick={handleFocusClick}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isDarkMode 
                ? 'bg-[#182645] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-slate-950 border border-slate-700/80' 
                : 'bg-[#eef3ff] text-[#215A9E] hover:bg-[#215A9E] hover:text-white border border-[#215A9E]/20'
            }`}
            title={t('Focus on map', 'تركيز الخريطة')}
          >
            <Navigation className="w-3 h-3" />
            <span>{t('Focus', 'تركيز')}</span>
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

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-lg font-bold transition-all cursor-pointer border ${
            isFavorite
              ? 'bg-amber-500 text-white border-amber-500'
              : (isDarkMode 
                  ? 'bg-[#182645] text-slate-400 hover:text-amber-400 border-slate-700/80 hover:bg-slate-800' 
                  : 'bg-slate-100 text-slate-400 hover:text-amber-600 border-slate-200 hover:bg-slate-200')
          }`}
          title={isFavorite ? t('Remove from Favorites', 'إزالة من المفضلة') : t('Favorite this location', 'إضافة للمفضلة')}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
