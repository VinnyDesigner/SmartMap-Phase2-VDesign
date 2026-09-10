import React from 'react';
import GeoSearchResultCard from './GeoSearchResultCard';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateGeodesicDistance } from '../../../services/spatial/spatialAnalysisService';
import { Sparkles } from 'lucide-react';

export default function AiLocationListBlock({ 
  locations = [], 
  totalCount = null,
  onEntityClick, 
  onActionClick, 
  isLoggedIn = false,
  userLocation = null,
  savedLocations = [],
  onToggleFavorite = null,
  onPromptAuth = null,
  activeExpandedCardId = null
}) {
  const { t, isArabic } = useLanguage();
  const [internalExpandedCardId, setInternalExpandedCardId] = React.useState(null);

  const activeId = activeExpandedCardId || internalExpandedCardId;

  React.useEffect(() => {
    if (activeExpandedCardId) {
      setInternalExpandedCardId(activeExpandedCardId);
      const timer = setTimeout(() => {
        const targetEl = document.getElementById(`chat-card-${activeExpandedCardId}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeExpandedCardId]);

  if (!locations || locations.length === 0) return null;

  const originLat = userLocation?.lat || 24.4839;
  const originLng = userLocation?.lng || 54.3773;

  // Compute exact distance & sort closest first by geodesic distance from user location
  const sortedLocations = [...locations].map(item => {
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
      distanceKm: distKm !== undefined ? distKm : 0
    };
  }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  return (
    <div className="space-y-2 my-2.5">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5 flex items-center justify-between">
        <span>
          {t('MATCHING LOCATIONS', 'المواقع المطابقة')} ({totalCount && totalCount > sortedLocations.length ? `${sortedLocations.length} ${t('of', 'من أصل')} ${totalCount}` : sortedLocations.length})
        </span>
        <span className="text-[9px] text-slate-400 font-semibold text-emerald-600 dark:text-emerald-400">{t('Ordered by proximity (Closest first)', 'مرتبة حسب الأقرب مسافة')}</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {sortedLocations.map((item) => {
          const isFav = savedLocations?.some(fav => fav.id === item.id || fav.name === item.name);
          const cardId = item.id || item.name;
          const isExp = String(activeId) === String(cardId);

          return (
            <GeoSearchResultCard
              key={cardId}
              item={item}
              onEntityClick={onEntityClick}
              onActionClick={onActionClick}
              isLoggedIn={isLoggedIn}
              userLocation={userLocation}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
              onPromptAuth={onPromptAuth}
              isExpandedProp={isExp}
              onToggleExpand={() => setInternalExpandedCardId(prev => prev === cardId ? null : cardId)}
            />
          );
        })}
      </div>

      {totalCount && totalCount > sortedLocations.length && (
        <button
          type="button"
          onClick={() => {
            if (onActionClick) {
              onActionClick({ 
                actionType: 'SEARCH_SUBMIT', 
                query: isArabic ? 'عرض 10 منشآت إضافية' : 'Show next 10 facilities' 
              });
            }
          }}
          className="w-full mt-2 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer bg-purple-500/10 hover:bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300 hover:border-purple-500/50 shadow-2xs group"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse group-hover:scale-110 transition-transform" />
          <span>
            {isArabic 
              ? `عرض 10 منشآت إضافية (متبقي ${totalCount - sortedLocations.length}) ←` 
              : `List more facilities (${totalCount - sortedLocations.length} remaining) →`}
          </span>
        </button>
      )}
    </div>
  );
}
