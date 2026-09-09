import React from 'react';
import GeoSearchResultCard from './GeoSearchResultCard';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateGeodesicDistance } from '../../../services/spatial/spatialAnalysisService';

export default function AiLocationListBlock({ 
  locations = [], 
  onEntityClick, 
  onActionClick, 
  isLoggedIn = false,
  userLocation = null,
  savedLocations = [],
  onToggleFavorite = null,
  onPromptAuth = null,
  activeExpandedCardId = null
}) {
  const { t } = useLanguage();
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
        <span>{t('MATCHING LOCATIONS', 'المواقع المطابقة')} ({sortedLocations.length})</span>
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
    </div>
  );
}
