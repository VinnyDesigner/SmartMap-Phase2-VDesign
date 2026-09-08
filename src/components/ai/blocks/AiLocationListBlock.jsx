import React from 'react';
import GeoSearchResultCard from './GeoSearchResultCard';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiLocationListBlock({ 
  locations = [], 
  onEntityClick, 
  onActionClick, 
  isLoggedIn = false,
  userLocation = null,
  savedLocations = [],
  onToggleFavorite = null,
  onPromptAuth = null 
}) {
  const { t } = useLanguage();
  if (!locations || locations.length === 0) return null;

  return (
    <div className="space-y-2 my-2.5">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5 flex items-center justify-between">
        <span>{t('MATCHING LOCATIONS', 'المواقع المطابقة')} ({locations.length})</span>
        <span className="text-[9px] text-slate-400 font-normal">{t('Ordered by proximity', 'مرتبة حسب القرب')}</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {locations.map((item) => {
          const isFav = savedLocations?.some(fav => fav.id === item.id || fav.name === item.name);
          return (
            <GeoSearchResultCard
              key={item.id}
              item={item}
              onEntityClick={onEntityClick}
              onActionClick={onActionClick}
              isLoggedIn={isLoggedIn}
              userLocation={userLocation}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
              onPromptAuth={onPromptAuth}
            />
          );
        })}
      </div>
    </div>
  );
}
