import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents, Polygon, Circle, Rectangle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles, Navigation, Target, Copy, Check, Trash2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProject } from '../contexts/ProjectContext';
import ArcGISBasemap from './explorer/ArcGISBasemap';
import { triggerViewDetails } from '../utils/viewDetailsHandler';
import { getMasterAuthoritativeDataset } from '../services/spatial/gisQueryEngine';
import { 
  isPointInPolygon, 
  isPointInRectangle, 
  isPointInCircle, 
  matchesGisSubcategories, 
  computeProportionalCategoryBreakdown,
  calculateGeodesicDistance
} from '../services/spatial/spatialAnalysisService';
import { 
  CATEGORY_TREE,
  getSubcategoryLocalizedName, 
  findCategoryBySubcategoryId,
  CANONICAL_TO_CATEGORY_ID 
} from '../config/categoryTree';

const customPinIcon = L.divIcon({
  className: 'custom-map-pin-container',
  html: `<div class="text-[#7c3aed] animate-bounce flex items-center justify-center" style="filter: drop-shadow(0 6px 8px rgba(0,0,0,0.3))">
           <svg width="40" height="50" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M16 0C7.163 0 0 7.163 0 16C0 26.667 16 40 16 40C16 40 32 26.667 32 16C32 7.163 24.837 0 16 0Z" fill="currentColor"/>
             <circle cx="16" cy="16" r="6" fill="white"/>
           </svg>
         </div>`,
  iconSize: [40, 50],
  iconAnchor: [20, 50]
});

const userLocationPinIcon = L.divIcon({
  className: 'user-location-pin-container',
  html: `<div class="relative flex items-center justify-center" style="width: 48px; height: 48px;">
           <div class="absolute inset-0 rounded-full bg-[#00e5ff]/35 animate-ping"></div>
           <div class="absolute inset-2 rounded-full bg-[#215A9E]/40 animate-pulse"></div>
           <div class="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#063360] via-[#215A9E] to-[#00e5ff] border-2 border-white shadow-[0_4px_14px_rgba(0,229,255,0.8)] flex items-center justify-center">
             <div class="w-2.5 h-2.5 rounded-full bg-white shadow-inner"></div>
           </div>
         </div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

// Google Maps Style Origin Waypoint Pin
const googleMapsOriginIcon = L.divIcon({
  className: 'google-maps-origin-pin',
  html: `
    <div style="width: 22px; height: 22px; background: white; border: 4px solid #1a73e8; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
      <div style="width: 5px; height: 5px; background: #1a73e8; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Google Maps Style Destination Red Pin
const googleMapsDestinationIcon = L.divIcon({
  className: 'google-maps-destination-pin',
  html: `
    <div style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.45)); transform: translateY(-4px);">
      <svg width="30" height="38" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#EA4335"/>
        <circle cx="14" cy="14" r="7" fill="#B31412"/>
        <circle cx="14" cy="14" r="5" fill="white"/>
        <circle cx="14" cy="14" r="2.5" fill="#EA4335"/>
      </svg>
    </div>
  `,
  iconSize: [30, 38],
  iconAnchor: [15, 38]
});

export const CATEGORY_STYLE_MAP = {
  healthcare: {
    pastelBg: '#FFD6D6',
    pastelBorder: '#FFA4A4',
    iconColor: '#C62828',
    label_en: 'Healthcare',
    label_ar: 'الرعاية الصحية',
    iconInnerSvg: '<path d="M12 5v14M5 12h14" stroke-width="3" stroke-linecap="round"/>'
  },
  transportation: {
    pastelBg: '#E0D7F8',
    pastelBorder: '#B9A4EC',
    iconColor: '#5E35B1',
    label_en: 'Transport',
    label_ar: 'النقل والمواصلات',
    iconInnerSvg: '<rect width="18" height="13" x="3" y="4" rx="2" stroke-width="2"/><path d="M7 17v2M17 17v2M3 11h18M7 14h.01M17 14h.01" stroke-width="2" stroke-linecap="round"/>'
  },
  environment: {
    pastelBg: '#C8E6C9',
    pastelBorder: '#9FD6A3',
    iconColor: '#2E7D32',
    label_en: 'Environment',
    label_ar: 'البيئة والاستدامة',
    iconInnerSvg: '<path d="m12 2 4 5h-2.5l3.5 5h-3l4 6H5l4-6H6l3.5-5H7l5-5zM12 18v4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  government: {
    pastelBg: '#CFE2FE',
    pastelBorder: '#9EC5FE',
    iconColor: '#1565C0',
    label_en: 'Government Services',
    label_ar: 'الخدمات الحكومية',
    iconInnerSvg: '<path d="M3 21h18M4 18h16M4 8l8-5 8 5M6 8v10M10 8v10M14 8v10M18 8v10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  tourism: {
    pastelBg: '#FFE5B4',
    pastelBorder: '#FFCC80',
    iconColor: '#E65100',
    label_en: 'Tourism',
    label_ar: 'السياحة والتراث',
    iconInnerSvg: '<polygon points="12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5 12 2" fill="#E65100" stroke="none"/>'
  },
  infrastructure: {
    pastelBg: '#E2E8F0',
    pastelBorder: '#CBD5E1',
    iconColor: '#475569',
    label_en: 'Infrastructure',
    label_ar: 'البنية التحتية',
    iconInnerSvg: '<path d="M4 19V6M20 19V6M2 19h20M4 10h16M4 10c4 5 8 5 8 5s4 0 8-5" stroke-width="2" stroke-linecap="round"/>'
  },
  housing: {
    pastelBg: '#F1D6F7',
    pastelBorder: '#DEABED',
    iconColor: '#7B1FA2',
    label_en: 'Housing',
    label_ar: 'الإسكان والمجتمعات',
    iconInnerSvg: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-4v-6h-6v6H4a1 1 0 0 1-1-1Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  public_safety: {
    pastelBg: '#FFCDD2',
    pastelBorder: '#EF9A9A',
    iconColor: '#C2185B',
    label_en: 'Public Safety',
    label_ar: 'السلامة العامة والأمن',
    iconInnerSvg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  utilities: {
    pastelBg: '#FFF9C4',
    pastelBorder: '#FFF176',
    iconColor: '#F57F17',
    label_en: 'Utilities',
    label_ar: 'المرافق والخدمات',
    iconInnerSvg: '<polygon points="13 2 4 13 11 13 10 22 20 11 13 11 13 2" fill="#F57F17" stroke="none"/>'
  },
  climate: {
    pastelBg: '#B2EBF2',
    pastelBorder: '#80DEEA',
    iconColor: '#00838F',
    label_en: 'Climate',
    label_ar: 'المناخ والطقس',
    iconInnerSvg: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 15v3M14 15v3" stroke-width="2" stroke-linecap="round"/>'
  },
  construction: {
    pastelBg: '#FFD8C7',
    pastelBorder: '#FFAB91',
    iconColor: '#D84315',
    label_en: 'Construction',
    label_ar: 'البناء والتشييد',
    iconInnerSvg: '<path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" stroke-width="2" stroke-linecap="round"/><path d="M17.5 15 22 10.5M21 3.5l-6 6a2 2 0 0 0 0 3l1.5 1.5a2 2 0 0 0 3 0l6-6-4.5-4.5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  energy: {
    pastelBg: '#FFE082',
    pastelBorder: '#FFD54F',
    iconColor: '#FF6F00',
    label_en: 'Energy',
    label_ar: 'الطاقة والشبكات',
    iconInnerSvg: '<circle cx="12" cy="12" r="4" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2" stroke-width="2" stroke-linecap="round"/>'
  },
  park: {
    pastelBg: '#DCEDC8',
    pastelBorder: '#C5E1A5',
    iconColor: '#33691E',
    label_en: 'Parks',
    label_ar: 'الحدائق والمتنزهات',
    iconInnerSvg: '<path d="M12 22v-6M8 12a4 4 0 0 1 8 0 4 4 0 0 1-2 3.5M6 12a4 4 0 0 0 6 3.5" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="5" stroke-width="2"/>'
  },
  agriculture: {
    pastelBg: '#D7ECC7',
    pastelBorder: '#A9DF9C',
    iconColor: '#2E7D32',
    label_en: 'Agriculture',
    label_ar: 'الزراعة والأمن الغذائي',
    iconInnerSvg: '<path d="M7 20h10M12 20v-8M12 12a5 5 0 0 1 5-5h2v2a5 5 0 0 1-5 5h-2zM12 12a5 5 0 0 0-5-5H5v2a5 5 0 0 0 5 5h2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  employment: {
    pastelBg: '#D0E1FD',
    pastelBorder: '#A4C6FB',
    iconColor: '#1E40AF',
    label_en: 'Employment',
    label_ar: 'التوظيف والأعمال',
    iconInnerSvg: '<rect width="18" height="12" x="3" y="8" rx="2" stroke-width="2"/><path d="M16 8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3M3 13h18" stroke-width="2" stroke-linecap="round"/>'
  },
  education: {
    pastelBg: '#B3E5FC',
    pastelBorder: '#81D4FA',
    iconColor: '#0277BD',
    label_en: 'Education',
    label_ar: 'التعليم',
    iconInnerSvg: '<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke-width="2" stroke-linecap="round"/>'
  }
};

export function getCategoryKeyFromItem(itemOrType) {
  if (!itemOrType) return 'government';
  
  if (typeof itemOrType === 'string') {
    const s = itemOrType.trim().toUpperCase();
    if (CANONICAL_TO_CATEGORY_ID && CANONICAL_TO_CATEGORY_ID[s]) {
      return CANONICAL_TO_CATEGORY_ID[s];
    }
    const sLow = itemOrType.trim().toLowerCase();
    const cat = CATEGORY_TREE.find(c => c.id === sLow || c.name.toLowerCase() === sLow);
    if (cat) return cat.id;

    if (sLow.includes('health') || sLow.includes('hospital') || sLow.includes('clinic') || sLow.includes('pharm')) return 'healthcare';
    if (sLow.includes('transit') || sLow.includes('transport') || sLow.includes('bus') || sLow.includes('metro') || sLow.includes('airport') || sLow.includes('taxi') || sLow.includes('seaport') || sLow.includes('port')) return 'transportation';
    if (sLow.includes('park') || sLow.includes('garden') || sLow.includes('playground')) return 'park';
    if (sLow.includes('environ') || sLow.includes('sensor') || sLow.includes('recycl') || sLow.includes('waste')) return 'environment';
    if (sLow.includes('school') || sLow.includes('educat') || sLow.includes('college') || sLow.includes('univers') || sLow.includes('pod') || sLow.includes('nursery')) return 'education';
    if (sLow.includes('tour') || sLow.includes('hotel') || sLow.includes('museum') || sLow.includes('resort') || sLow.includes('attract') || sLow.includes('landmark')) return 'tourism';
    if (sLow.includes('police') || sLow.includes('safety') || sLow.includes('fire') || sLow.includes('civil') || sLow.includes('emergency') || sLow.includes('ambulance')) return 'public_safety';
    if (sLow.includes('house') || sLow.includes('housing') || sLow.includes('residential') || sLow.includes('villa')) return 'housing';
    if (sLow.includes('power') || sLow.includes('utility') || sLow.includes('utilities') || sLow.includes('water') || sLow.includes('telecom') || sLow.includes('substation')) return 'utilities';
    if (sLow.includes('climat') || sLow.includes('weather') || sLow.includes('co2')) return 'climate';
    if (sLow.includes('solar') || sLow.includes('energy') || sLow.includes('gas') || sLow.includes('grid')) return 'energy';
    if (sLow.includes('construct') || sLow.includes('building project') || sLow.includes('zoning')) return 'construction';
    if (sLow.includes('infrastruct') || sLow.includes('bridge') || sLow.includes('road') || sLow.includes('lighting')) return 'infrastructure';
    if (sLow.includes('agri') || sLow.includes('farm') || sLow.includes('crop') || sLow.includes('irrigation') || sLow.includes('livestock') || sLow.includes('greenhouse')) return 'agriculture';
    if (sLow.includes('employ') || sLow.includes('job') || sLow.includes('business hub') || sLow.includes('free zone') || sLow.includes('corporate')) return 'employment';
    if (sLow.includes('govt') || sLow.includes('government') || sLow.includes('ministry') || sLow.includes('embassy') || sLow.includes('court') || sLow.includes('municipal') || sLow.includes('service') || sLow.includes('tamm')) return 'government';
    return 'government';
  }

  const item = itemOrType;
  if (item.subType) {
    const parentCat = findCategoryBySubcategoryId(item.subType);
    if (parentCat) return parentCat.id;
  }
  
  if (item.type && CANONICAL_TO_CATEGORY_ID && CANONICAL_TO_CATEGORY_ID[item.type.toUpperCase()]) {
    return CANONICAL_TO_CATEGORY_ID[item.type.toUpperCase()];
  }

  const catName = item.category_en || item.category;
  if (catName) {
    const cLow = catName.toLowerCase();
    const cat = CATEGORY_TREE.find(c => c.id === cLow || c.name.toLowerCase() === cLow);
    if (cat) return cat.id;
  }

  return getCategoryKeyFromItem(item.facilityType || item.type || item.name || 'government');
}

export const getCategoryColorDetails = (itemOrType) => {
  const catKey = getCategoryKeyFromItem(itemOrType);
  const style = CATEGORY_STYLE_MAP[catKey] || CATEGORY_STYLE_MAP.government;
  return {
    textColor: `text-[${style.iconColor}]`,
    hexColor: style.iconColor,
    pastelBg: style.pastelBg,
    pastelBorder: style.pastelBorder
  };
};

export const createPulsePointerIcon = (itemOrType = 'government') => {
  const catKey = getCategoryKeyFromItem(itemOrType);
  const style = CATEGORY_STYLE_MAP[catKey] || CATEGORY_STYLE_MAP.government;
  const { pastelBg, pastelBorder, iconColor, iconInnerSvg } = style;
  
  return L.divIcon({
    className: 'custom-pulse-pointer-container',
    html: `
      <div class="relative flex items-center justify-center" style="width: 60px; height: 60px;">
        <!-- Expanding Radar Ping Wave in Pastel Accent -->
        <div class="absolute inset-0 rounded-full animate-ping opacity-60 pointer-events-none" style="background-color: ${pastelBorder}60;"></div>
        <!-- Glowing Ambient Aura Ring -->
        <div class="absolute inset-2 rounded-full animate-pulse opacity-75 pointer-events-none border-2" style="background-color: ${pastelBg}90; border-color: ${pastelBorder}; box-shadow: 0 0 16px ${pastelBorder};"></div>
        <!-- Pulse Target Center Anchor Core -->
        <div class="relative w-7 h-7 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] flex items-center justify-center border-2 pointer-events-auto" style="border-color: ${pastelBorder};">
          <div class="w-3 h-3 rounded-full animate-ping" style="background-color: ${iconColor};"></div>
          <div class="absolute w-2.5 h-2.5 rounded-full shadow-xs" style="background-color: ${iconColor};"></div>
        </div>
        <!-- Floating Animated Pastel Pin with Embedded Category Icon -->
        <div class="absolute -top-9 animate-bounce flex items-center justify-center pointer-events-none" style="filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));">
          <svg width="36" height="46" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 1C9.268 1 3 7.268 3 15C3 25.5 17 43 17 43C17 43 31 25.5 31 15C31 7.268 24.732 1 17 1Z" 
                  fill="${pastelBg}" stroke="${pastelBorder}" stroke-width="2"/>
            <circle cx="17" cy="15" r="9.5" fill="#FFFFFF" stroke="${pastelBorder}" stroke-width="0.75"/>
            <svg x="10.5" y="8.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              ${iconInnerSvg}
            </svg>
          </svg>
        </div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30]
  });
};

export const createCategoryIcon = (itemOrType, isSelected = false) => {
  if (isSelected) {
    return createPulsePointerIcon(itemOrType);
  }

  const catKey = getCategoryKeyFromItem(itemOrType);
  const style = CATEGORY_STYLE_MAP[catKey] || CATEGORY_STYLE_MAP.government;
  const { pastelBg, pastelBorder, iconColor, iconInnerSvg } = style;

  return L.divIcon({
    className: 'custom-map-pin-container',
    html: `
      <div class="flex items-center justify-center hover:scale-125 hover:-translate-y-1.5 transition-transform duration-200 origin-bottom cursor-pointer" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.28));">
        <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 1C9.268 1 3 7.268 3 15C3 25.5 17 43 17 43C17 43 31 25.5 31 15C31 7.268 24.732 1 17 1Z" 
                fill="${pastelBg}" stroke="${pastelBorder}" stroke-width="1.75"/>
          <circle cx="17" cy="15" r="9.5" fill="#FFFFFF" stroke="${pastelBorder}" stroke-width="0.5"/>
          <svg x="10.5" y="8.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            ${iconInnerSvg}
          </svg>
        </svg>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -42]
  });
};

function MapController({ explorerState, setExplorerState, isExplorer }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    map.invalidateSize();
    const container = map.getContainer();
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [map]);

  useEffect(() => {
    if (isExplorer) {
      map.invalidateSize();
      if (explorerState?.isDrawingMode || explorerState?.drawingTool) {
        map.dragging.disable();
      } else {
        map.dragging.enable();
      }
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    }
  }, [isExplorer, explorerState?.isDrawingMode, explorerState?.drawingTool, explorerState?.resizeTrigger, map]);

  const lastFlownRef = useRef(null);

  useEffect(() => {
    if (explorerState?.mapFocus && explorerState.mapFocus.lat && explorerState.mapFocus.lng) {
      const { lat, lng, zoom = 16, timestamp } = explorerState.mapFocus;
      
      // Guard against redundant flyTo animations to the same location
      const last = lastFlownRef.current;
      if (
        last && 
        last.lat === lat && 
        last.lng === lng && 
        last.zoom === zoom && 
        (!timestamp || last.timestamp === timestamp)
      ) {
        return;
      }

      lastFlownRef.current = { lat, lng, zoom, timestamp };
      map.flyTo([lat, lng], zoom, { animate: true, duration: 1.5 });
    }
  }, [explorerState?.mapFocus, map]);

  useEffect(() => {
    if (explorerState?.mapAction) {
      const action = explorerState.mapAction;
      if (action === 'zoomIn') map.zoomIn();
      else if (action === 'zoomOut') map.zoomOut();
      else if (action === 'home' || action === 'compass') {
        map.flyTo([24.4839, 54.3773], 13, { animate: true, duration: 1.2 });
      } else if (action === 'locate') {
        const isCoordInUAE = (lat, lng) => typeof lat === 'number' && typeof lng === 'number' && lat >= 22.5 && lat <= 26.2 && lng >= 51.4 && lng <= 56.5;

        let targetLat = explorerState?.userLocation?.lat;
        let targetLng = explorerState?.userLocation?.lng;

        if (!isCoordInUAE(targetLat, targetLng)) {
          targetLat = 24.4839;
          targetLng = 54.3773;
        }

        // Immediately fly map to user location with zoom 16
        map.flyTo([targetLat, targetLng], 16, { animate: true, duration: 1.5 });
        lastFlownRef.current = { lat: targetLat, lng: targetLng, zoom: 16, timestamp: Date.now() };

        setExplorerState(prev => ({
          ...prev,
          userLocationEnabled: true,
          userLocation: { lat: targetLat, lng: targetLng },
          mapFocus: { lat: targetLat, lng: targetLng, zoom: 16, timestamp: Date.now(), source: 'user-locate' }
        }));

        // Concurrently query browser geolocation for fresh GPS coordinates
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const freshLat = pos.coords.latitude;
              const freshLng = pos.coords.longitude;
              // Only override if fresh coordinates are actually inside the UAE
              if (isCoordInUAE(freshLat, freshLng)) {
                if (Math.abs(freshLat - targetLat) > 0.0001 || Math.abs(freshLng - targetLng) > 0.0001) {
                  map.flyTo([freshLat, freshLng], 16, { animate: true, duration: 1.5 });
                  lastFlownRef.current = { lat: freshLat, lng: freshLng, zoom: 16, timestamp: Date.now() };
                  setExplorerState(prev => ({
                    ...prev,
                    userLocationEnabled: true,
                    userLocation: { lat: freshLat, lng: freshLng, accuracy: pos.coords.accuracy },
                    mapFocus: { lat: freshLat, lng: freshLng, zoom: 16, timestamp: Date.now(), source: 'geolocation-granted' }
                  }));
                }
              }
            },
            (err) => {
              console.warn("Browser Geolocation query during locate action:", err);
            },
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
          );
        }
      }
      setExplorerState(prev => ({ ...prev, mapAction: null }));
    }
  }, [explorerState?.mapAction, explorerState?.userLocation, explorerState?.userLocationEnabled, map, setExplorerState]);

  return null;
}

function CustomDrawControl({ explorerState, setExplorerState }) {
  const map = useMap();
  const { isArabic } = useLanguage();
  const { activeProject } = useProject();
  const [startPoint, setStartPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [isDraggingDraw, setIsDraggingDraw] = useState(false);
  const [polyPoints, setPolyPoints] = useState([]);
  const [mousePos, setMousePos] = useState(null);

  const drawingTool = explorerState?.drawingTool;

  useEffect(() => {
    if (drawingTool) {
      map.dragging.disable();
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.dragging.enable();
      map.getContainer().style.cursor = '';
      setStartPoint(null);
      setCurrentPoint(null);
      setIsDraggingDraw(false);
      setPolyPoints([]);
      setMousePos(null);
    }
  }, [drawingTool, map]);

  const generateAiChatMessages = (shapeType, filteredAll, centerCoords, activeSubcategories = [], inShape = []) => {
    let shapeLabelEn = 'Drawn Zone';
    let shapeLabelAr = 'المنطقة المحددة';
    if (shapeType === 'circle') { shapeLabelEn = 'Circle Zone'; shapeLabelAr = 'المنطقة الدائرية'; }
    else if (shapeType === 'rectangle') { shapeLabelEn = 'Box Zone'; shapeLabelAr = 'المنطقة المربعة'; }
    else if (shapeType === 'polygon') { shapeLabelEn = 'Polygon Zone'; shapeLabelAr = 'المنطقة المضلعة'; }

    // Proportional breakdown analytics
    const proportionalAnalytics = computeProportionalCategoryBreakdown(filteredAll, activeSubcategories, isArabic);

    // Selected category names for messaging
    const selectedNamesEn = activeSubcategories
      .map(id => getSubcategoryLocalizedName(id, false))
      .filter(Boolean)
      .join(', ');
    const selectedNamesAr = activeSubcategories
      .map(id => getSubcategoryLocalizedName(id, true))
      .filter(Boolean)
      .join('، ');

    const hasCategoryFilter = activeSubcategories.length > 0;
    const categoryScopeHeaderEn = hasCategoryFilter ? ` (${selectedNamesEn})` : '';
    const categoryScopeHeaderAr = hasCategoryFilter ? ` (${selectedNamesAr})` : '';

    const userMsg = {
      id: `msg-draw-usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'user',
      content: isArabic 
        ? `تحليل مكاني: ${shapeLabelAr}${categoryScopeHeaderAr} (${filteredAll.length} نتائج)` 
        : `Spatial Analysis: ${shapeLabelEn}${categoryScopeHeaderEn} (${filteredAll.length} results found)`
    };

    // Sort closest to center of drawn shape
    const sortedFiltered = [...filteredAll].map(loc => {
      const distKm = centerCoords && loc.lat && loc.lng 
        ? calculateGeodesicDistance(centerCoords.lat, centerCoords.lng, loc.lat, loc.lng)
        : (loc.distanceKm || 0);
      return { ...loc, distanceKm: distKm };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    // Initial page capping (top 10 closest to shape center)
    const MAX_PAGE_SIZE = 10;
    const displayResults = sortedFiltered.slice(0, MAX_PAGE_SIZE);

    let contentEn = '';
    let contentAr = '';

    if (filteredAll.length === 0) {
      contentEn = hasCategoryFilter
        ? `🎯 **Spatial Analysis for ${shapeLabelEn}**\n\nNo facilities matching your selected categories (**${selectedNamesEn}**) were found inside the drawn boundary.\n\n💡 *Tip: Expand the drawn boundary on the map or enable additional categories in the category drawer.*`
        : `🎯 **Spatial Analysis for ${shapeLabelEn}**\n\nNo spatial assets or government facilities were detected within the drawn boundary.`;

      contentAr = hasCategoryFilter
        ? `🎯 **التحليل المكاني لـ ${shapeLabelAr}**\n\nلم يتم العثور على أي منشآت مطابقة للفئات المحددة (**${selectedNamesAr}**) داخل حدود الرسم.\n\n💡 *نصيحة: يمكنك توسيع نطاق الرسم على الخريطة أو تفعيل فئات إضافية من قائمة التصنيفات.*`
        : `🎯 **التحليل المكاني لـ ${shapeLabelAr}**\n\nلم يتم رصد أي منشآت أو معالم ضمن حدود الرسم الحالية.`;
    } else {
      const totalCount = filteredAll.length;
      const countHeaderEn = totalCount > MAX_PAGE_SIZE 
        ? `Showing the **top ${MAX_PAGE_SIZE} closest** of **${totalCount} verified facilities**`
        : `Identified **${totalCount} verified ${totalCount === 1 ? 'facility' : 'facilities'}**`;
      const countHeaderAr = totalCount > MAX_PAGE_SIZE
        ? `عرض **أقرب ${MAX_PAGE_SIZE} منشآت** من أصل **${totalCount} منشأة معتمدة**`
        : `تم تحديد **${totalCount} منشأة معتمدة**`;

      if (hasCategoryFilter) {
        contentEn = `🎯 **Spatial Analysis Complete for ${shapeLabelEn}**\n\n${countHeaderEn} strictly proportional and relevant to your active scope (**${selectedNamesEn}**) within the bounding zone.\n\n**Proportional Category Breakdown:**\n${proportionalAnalytics.summaryBulletsEn}`;
        contentAr = `🎯 **اكتمل التحليل المكاني لـ ${shapeLabelAr}**\n\n${countHeaderAr} متناسبة ومتوافقة مع الفئات المحددة (**${selectedNamesAr}**) ضمن الحدود المكانية.\n\n**التوزيع النسبي حسب الفئات:**\n${proportionalAnalytics.summaryBulletsAr}`;
      } else {
        contentEn = `🎯 **Spatial Analysis Complete for ${shapeLabelEn}**\n\n${countHeaderEn} across **${proportionalAnalytics.breakdown.length} categories** within the bounding zone.\n\n**Proportional Distribution:**\n${proportionalAnalytics.summaryBulletsEn}`;
        contentAr = `🎯 **اكتمل التحليل المكاني لـ ${shapeLabelAr}**\n\n${countHeaderAr} موزعة عبر **${proportionalAnalytics.breakdown.length} فئات** ضمن الحدود المكانية.\n\n**التوزيع النسبي للفئات:**\n${proportionalAnalytics.summaryBulletsAr}`;
      }
    }

    // Compute random other category not currently selected
    const selectedCategoryIds = new Set(
      activeSubcategories.map(subId => findCategoryBySubcategoryId(subId)?.id).filter(Boolean)
    );

    // Look for other categories with facilities present inside the drawn shape
    const otherFacilitiesInShape = (inShape || []).filter(loc => !matchesGisSubcategories(loc, activeSubcategories));
    const otherCategoriesInShape = [];
    otherFacilitiesInShape.forEach(loc => {
      const catTree = CATEGORY_TREE.find(cat => {
        if (selectedCategoryIds.has(cat.id)) return false;
        const subIds = (cat.subcategories || []).map(s => s.id);
        return matchesGisSubcategories(loc, subIds);
      });
      if (catTree && !otherCategoriesInShape.some(c => c.id === catTree.id)) {
        otherCategoriesInShape.push(catTree);
      }
    });

    const unselectedPool = otherCategoriesInShape.length > 0
      ? otherCategoriesInShape
      : CATEGORY_TREE.filter(cat => !selectedCategoryIds.has(cat.id));

    const randomOtherCategory = unselectedPool.length > 0
      ? unselectedPool[Math.floor(Math.random() * unselectedPool.length)]
      : null;

    const suggestions = [];
    if (filteredAll.length > MAX_PAGE_SIZE) {
      suggestions.push(isArabic ? 'عرض 10 منشآت إضافية' : 'Show next 10 facilities');
    }
    if (filteredAll.length > 1) {
      suggestions.push(isArabic ? 'أيها الأقرب؟' : 'Which one is closest?');
      suggestions.push(isArabic ? 'مقارنة المنشآت في هذا النطاق' : 'Compare facilities in this zone');
    } else if (filteredAll.length === 1) {
      suggestions.push(isArabic ? 'عرض تفاصيل المنشأة' : 'Show facility details');
    }

    // 1. Suggest searching random other category within the drawn area
    if (randomOtherCategory) {
      suggestions.push(isArabic 
        ? `عرض ${randomOtherCategory.name_ar} في هذه المنطقة المحددة`
        : `Show ${randomOtherCategory.name} in this drawn area`
      );
    }

    // 2. Suggest clearing the drawn area
    suggestions.push(isArabic ? 'مسح منطقة الرسم' : 'Clear drawn area');

    suggestions.push(isArabic ? 'تصدير التحليل إلى PDF' : 'Export spatial analysis to PDF');

    const assistantMsg = {
      id: `msg-draw-ast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'assistant',
      content: isArabic ? contentAr : contentEn,
      results: displayResults,
      totalCount: filteredAll.length,
      allResults: sortedFiltered,
      kpiGrid: proportionalAnalytics.kpiMetrics,
      chartData: proportionalAnalytics.chartData,
      datasetsUsed: ['DGE Spatial SDI 2026', 'Abu Dhabi Government Facilities Registry'],
      suggestions
    };

    return [userMsg, assistantMsg];
  };

  const finishRectangle = (start, end) => {
    if (!start || !end) return;
    const minLat = Math.min(start.lat, end.lat);
    const maxLat = Math.max(start.lat, end.lat);
    const minLng = Math.min(start.lng, end.lng);
    const maxLng = Math.max(start.lng, end.lng);

    if (Math.abs(maxLat - minLat) < 0.00005 || Math.abs(maxLng - minLng) < 0.00005) {
      return;
    }

    const bounds = [[minLat, minLng], [maxLat, maxLng]];
    const centerCoords = { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
    const widthKm = calculateGeodesicDistance(minLat, minLng, minLat, maxLng);
    const heightKm = calculateGeodesicDistance(minLat, minLng, maxLat, minLng);
    const areaKm2 = (widthKm * heightKm).toFixed(1);

    const newDrawing = {
      id: 'rect-' + Date.now(),
      type: 'rectangle',
      bounds
    };

    const activeDrawnArea = {
      type: 'rectangle',
      label: `Drawn Area · ${areaKm2} km²`,
      label_ar: `المنطقة المحددة · ${areaKm2} كم²`,
      areaKm2: Number(areaKm2),
      bounds,
      centerCoords
    };

    setExplorerState(prev => ({
      ...prev,
      drawingTool: null,
      activeMenu: null,
      drawnRectangle: bounds,
      drawnCircle: null,
      drawnPolygon: null,
      drawings: [newDrawing],
      activeDrawnArea,
      activeResults: [],
      showSearchResults: false
    }));

    setStartPoint(null);
    setCurrentPoint(null);
    setIsDraggingDraw(false);
  };

  const finishCircle = (start, end) => {
    if (!start || !end) return;
    const radius = start.distanceTo(end);
    if (radius < 5) return;

    const center = [start.lat, start.lng];
    const centerCoords = { lat: start.lat, lng: start.lng };
    const radiusKm = (radius / 1000).toFixed(1);

    const newDrawing = {
      id: 'circle-' + Date.now(),
      type: 'circle',
      center,
      radius
    };

    const activeDrawnArea = {
      type: 'circle',
      label: `Drawn Area · ${radiusKm} km radius`,
      label_ar: `المنطقة المحددة · نصف قطر ${radiusKm} كم`,
      radiusKm: Number(radiusKm),
      radius,
      center,
      centerCoords
    };

    setExplorerState(prev => ({
      ...prev,
      drawingTool: null,
      activeMenu: null,
      drawnCircle: { center, radius },
      drawnRectangle: null,
      drawnPolygon: null,
      drawings: [newDrawing],
      activeDrawnArea,
      activeResults: [],
      showSearchResults: false
    }));

    setStartPoint(null);
    setCurrentPoint(null);
    setIsDraggingDraw(false);
  };

  const finishPolygon = (pts) => {
    if (!pts || pts.length < 3) return;
    const positions = pts.map(p => [p.lat, p.lng]);

    // Compute centroid for distance sorting
    const lats = pts.map(p => p.lat);
    const lngs = pts.map(p => p.lng);
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    const centerCoords = { lat: avgLat, lng: avgLng };

    // Approximate area in km2
    let area = 0;
    for (let i = 0; i < positions.length; i++) {
      const j = (i + 1) % positions.length;
      area += positions[i][1] * positions[j][0] - positions[j][1] * positions[i][0];
    }
    const areaKm2 = Math.abs((area * 111 * 111 * Math.cos(avgLat * Math.PI / 180)) / 2).toFixed(1);

    const newDrawing = {
      id: 'poly-' + Date.now(),
      type: 'polygon',
      positions
    };

    const activeDrawnArea = {
      type: 'polygon',
      label: `Drawn Area · ${areaKm2} km²`,
      label_ar: `المنطقة المحددة · ${areaKm2} كم²`,
      areaKm2: Number(areaKm2),
      positions,
      centerCoords
    };

    setExplorerState(prev => ({
      ...prev,
      drawingTool: null,
      activeMenu: null,
      drawnPolygon: positions,
      drawnCircle: null,
      drawnRectangle: null,
      drawings: [newDrawing],
      activeDrawnArea,
      activeResults: [],
      showSearchResults: false
    }));

    setPolyPoints([]);
    setMousePos(null);
  };

  useMapEvents({
    mousedown(e) {
      if (drawingTool === 'rectangle' || drawingTool === 'circle') {
        if (!startPoint) {
          setStartPoint(e.latlng);
          setCurrentPoint(e.latlng);
          setIsDraggingDraw(true);
        }
      } else if (drawingTool === 'polygon') {
        setPolyPoints(prev => [...prev, e.latlng]);
      }
    },
    mousemove(e) {
      if (drawingTool === 'rectangle' || drawingTool === 'circle') {
        if (startPoint) {
          setCurrentPoint(e.latlng);
        }
      } else if (drawingTool === 'polygon') {
        setMousePos(e.latlng);
      }
    },
    mouseup(e) {
      if ((drawingTool === 'rectangle' || drawingTool === 'circle') && startPoint && currentPoint) {
        const dist = startPoint.distanceTo(currentPoint);
        if (dist > 10) {
          if (drawingTool === 'rectangle') {
            finishRectangle(startPoint, currentPoint);
          } else if (drawingTool === 'circle') {
            finishCircle(startPoint, currentPoint);
          }
        }
      }
    },
    click(e) {
      if ((drawingTool === 'rectangle' || drawingTool === 'circle') && startPoint && currentPoint) {
        const dist = startPoint.distanceTo(currentPoint);
        if (dist > 10) {
          if (drawingTool === 'rectangle') {
            finishRectangle(startPoint, currentPoint);
          } else if (drawingTool === 'circle') {
            finishCircle(startPoint, currentPoint);
          }
        }
      }
    },
    dblclick(e) {
      if (drawingTool === 'polygon') {
        finishPolygon(polyPoints);
      }
    }
  });

  return (
    <>
      {/* Transient rectangle while drawing */}
      {drawingTool === 'rectangle' && startPoint && currentPoint && (
        <Rectangle 
          bounds={L.latLngBounds(startPoint, currentPoint)} 
          pathOptions={{ color: '#7c3aed', weight: 2.5, dashArray: '6, 6', fillColor: '#7c3aed', fillOpacity: 0.25 }} 
        />
      )}

      {/* Transient circle while drawing */}
      {drawingTool === 'circle' && startPoint && currentPoint && (
        <Circle 
          center={startPoint} 
          radius={startPoint.distanceTo(currentPoint)} 
          pathOptions={{ color: '#7c3aed', weight: 2.5, dashArray: '6, 6', fillColor: '#7c3aed', fillOpacity: 0.25 }} 
        />
      )}

      {/* Transient polygon while drawing */}
      {drawingTool === 'polygon' && polyPoints.length > 0 && (
        <>
          <Polyline 
            positions={polyPoints.map(p => [p.lat, p.lng])} 
            pathOptions={{ color: '#7c3aed', weight: 2.5, dashArray: '6, 6' }} 
          />
          {polyPoints.length >= 3 && (
            <Polygon 
              positions={polyPoints.map(p => [p.lat, p.lng])} 
              pathOptions={{ color: '#7c3aed', weight: 2, fillColor: '#7c3aed', fillOpacity: 0.15 }} 
            />
          )}
          {mousePos && polyPoints.length > 0 && (
            <Polyline 
              positions={[[polyPoints[polyPoints.length - 1].lat, polyPoints[polyPoints.length - 1].lng], [mousePos.lat, mousePos.lng]]} 
              pathOptions={{ color: '#00e5ff', weight: 2, dashArray: '4, 4' }} 
            />
          )}
        </>
      )}
    </>
  );
}

// Helper function to generate realistic road waypoints following Abu Dhabi road network and bridges
function getRoadDirectionsWaypoints(startLoc, destLoc) {
  if (!startLoc || !destLoc) return [];
  const sLat = Number(startLoc.lat || 24.4839);
  const sLng = Number(startLoc.lng || 54.3773);
  const dLat = Number(destLoc.lat);
  const dLng = Number(destLoc.lng);
  if (isNaN(sLat) || isNaN(sLng) || isNaN(dLat) || isNaN(dLng)) return [];

  const directDist = Math.hypot(dLat - sLat, dLng - sLng);
  if (directDist < 0.0001) {
    return [[sLat, sLng], [dLat, dLng]];
  }

  // Geographic island boundaries in Abu Dhabi
  const isSaadiyat = (lat, lng) => lat > 24.515 && lng > 54.390 && lng < 54.470;
  const isYas = (lat, lng) => lng > 54.550 && lat > 24.460;
  const isReem = (lat, lng) => lat > 24.492 && lat < 24.525 && lng > 54.398 && lng < 54.430;

  const startOnSaadiyat = isSaadiyat(sLat, sLng);
  const destOnSaadiyat = isSaadiyat(dLat, dLng);
  const startOnYas = isYas(sLat, sLng);
  const destOnYas = isYas(dLat, dLng);
  const startOnReem = isReem(sLat, sLng);
  const destOnReem = isReem(dLat, dLng);

  // 1. Saadiyat Island crossing (via Sheikh Khalifa Bridge E12) - ONLY when crossing water
  if (!startOnSaadiyat && destOnSaadiyat) {
    return [
      [sLat, sLng],
      [Math.max(sLat, 24.5060), sLng + (54.3720 - sLng) * 0.6], // Mina St approach
      [24.5160, 54.3830], // Sheikh Khalifa Bridge
      [24.5260, 54.3950], // Saadiyat Cultural District
      [dLat, dLng]
    ];
  }

  // 2. Yas Island crossing (via E12 Highway & Jubail Causeway) - ONLY when crossing from main island
  if (!startOnYas && destOnYas && sLng < 54.50) {
    return [
      [sLat, sLng],
      [24.5060, 54.3720], // Mina approach
      [24.5160, 54.3830], // E12 Highway start
      [24.5300, 54.4300], // Saadiyat corridor
      [24.5380, 54.5000], // Jubail causeway
      [dLat, dLng]
    ];
  }

  // 3. Al Reem Island crossing (via Al Reem / Hazza Bin Zayed Bridge) - ONLY when crossing from main island
  if (!startOnReem && destOnReem) {
    const bridgePt = [24.4990, 54.3920]; // Hazza Bin Zayed Bridge
    return [
      [sLat, sLng],
      [sLat + (bridgePt[0] - sLat) * 0.6, sLng + (bridgePt[1] - sLng) * 0.4],
      bridgePt,
      [dLat, dLng]
    ];
  }

  // 4. Direct Street-Grid Navigation for same contiguous landmass / downtown / mainland
  // Follows Abu Dhabi's orthogonal street grid directly between start and destination
  // All intermediate points are strictly bounded between sLat/dLat and sLng/dLng
  const deltaLat = dLat - sLat;
  const deltaLng = dLng - sLng;

  // Generate logical stepped street turns that strictly follow the corridor
  const p1 = [sLat + deltaLat * 0.25, sLng + deltaLng * 0.08];
  const p2 = [sLat + deltaLat * 0.55, sLng + deltaLng * 0.45];
  const p3 = [sLat + deltaLat * 0.85, sLng + deltaLng * 0.82];

  return [
    [sLat, sLng],
    p1,
    p2,
    p3,
    [dLat, dLng]
  ];
}

function FacilityMarker({ item, isArabic, isLoggedIn, explorerState, setExplorerState }) {
  const map = useMap();
  const { isDarkMode } = useTheme();

  const selectedItem = explorerState?.selectedLocation || explorerState?.selectedDetail;
  const isSelected = Boolean(
    (selectedItem && (
      (selectedItem.id && item.id && String(selectedItem.id) === String(item.id)) ||
      (selectedItem.name && item.name && selectedItem.name.trim().toLowerCase() === item.name.trim().toLowerCase()) ||
      (selectedItem.lat && selectedItem.lng && Math.abs(item.lat - selectedItem.lat) < 0.0001 && Math.abs(item.lng - selectedItem.lng) < 0.0001)
    )) ||
    (explorerState?.mapFocus?.lat && explorerState?.mapFocus?.lng && Math.abs(item.lat - explorerState.mapFocus.lat) < 0.0001 && Math.abs(item.lng - explorerState.mapFocus.lng) < 0.0001)
  );

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    map.closePopup(); // Immediately close popup on map!
    triggerViewDetails(item, rect, setExplorerState, isArabic);
  };

  const handleToggleFavoriteClick = (e) => {
    e.stopPropagation();
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

  const isFav = (explorerState?.savedLocations || []).some(fav => 
    (fav.id && item.id && String(fav.id) === String(item.id)) || 
    (fav.name && item.name && fav.name.trim().toLowerCase() === item.name.trim().toLowerCase())
  );

  return (
    <Marker 
      position={[item.lat, item.lng]}
      icon={createCategoryIcon(item, isSelected)}
      zIndexOffset={isSelected ? 3000 : 100}
      eventHandlers={{
        click: () => {
          setExplorerState(prev => ({
            ...prev,
            selectedLocation: item,
            selectedDetail: item,
            mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 }
          }));
        }
      }}
    >
      <Popup minWidth={270} maxWidth={300} className="custom-facility-popup">
        <div className={`p-1.5 font-sans flex flex-col gap-2 rounded-2xl ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          <div>
            <h4 className={`font-extrabold text-xs leading-snug ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
              {isArabic && item.name_ar ? item.name_ar : item.name}
            </h4>
            <p className={`text-[10.5px] font-semibold mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
              {item.facilityType || item.type || 'Government Facility'}
            </p>
            <p className={`text-[10px] font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              📍 {isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Al Bateen, Abu Dhabi')}
            </p>
            <p className={`text-[9.5px] font-medium mt-0.5 ${isDarkMode ? 'text-[#00e5ff]' : 'text-slate-400'}`}>
              {item.distance || '2.1 km from your location'}
            </p>
          </div>

          <div className={`grid ${isLoggedIn ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5 pt-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <button 
              onClick={handleViewDetailsClick}
              className="py-1.5 px-2 rounded-xl bg-[#215A9E] hover:bg-[#1a477d] text-white font-bold text-[11px] shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              View Details
            </button>

            {isLoggedIn && (
              <button 
                onClick={handleToggleFavoriteClick}
                className={`py-1.5 px-2 rounded-xl border font-bold text-[10.5px] transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                  isFav
                    ? 'bg-rose-500 text-white border-rose-500'
                    : (isDarkMode 
                        ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
                }`}
              >
                <span>{isFav ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function MapCoordinatesTracker({ setMapStatus }) {
  const map = useMapEvents({
    move: () => {
      const c = map.getCenter();
      setMapStatus(prev => ({ ...prev, lat: c.lat, lng: c.lng, zoom: map.getZoom() }));
    },
    zoomend: () => {
      const c = map.getCenter();
      setMapStatus(prev => ({ ...prev, lat: c.lat, lng: c.lng, zoom: map.getZoom() }));
    },
    mousemove: (e) => {
      setMapStatus(prev => ({ ...prev, mouseLat: e.latlng.lat, mouseLng: e.latlng.lng }));
    }
  });

  useEffect(() => {
    if (map) {
      const c = map.getCenter();
      setMapStatus({ lat: c.lat, lng: c.lng, zoom: map.getZoom() });
    }
  }, [map, setMapStatus]);

  return null;
}

function MapStatusBar({ mapStatus, isDarkMode }) {
  const [copied, setCopied] = useState(false);

  const displayLat = (mapStatus?.mouseLat || mapStatus?.lat || 22.958390).toFixed(6);
  const displayLng = (mapStatus?.mouseLng || mapStatus?.lng || 51.984460).toFixed(6);
  const coordString = `${displayLat} ${displayLng} Degree`;

  const handleCopy = (e) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(coordString);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoom = mapStatus?.zoom || 16;
  const lat = mapStatus?.lat || 24.4839;

  const metersPerPx = (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
  const scaleBarWidthPx = 130;
  const rawMeters = scaleBarWidthPx * metersPerPx;

  const scaleSteps = [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
  const maxDist = scaleSteps.find(s => s >= rawMeters) || scaleSteps[scaleSteps.length - 1];

  const isKm = maxDist >= 1000;
  const unitSuffix = isKm ? 'KM' : 'M';
  const val = isKm ? maxDist / 1000 : maxDist;

  const tick0 = 0;
  const tick1 = isKm ? (val * 0.125).toFixed(1).replace(/\.0$/, '') : Math.round(val * 0.125);
  const tick2 = isKm ? (val * 0.25).toFixed(1).replace(/\.0$/, '') : Math.round(val * 0.25);
  const tick3 = isKm ? (val * 0.5).toFixed(1).replace(/\.0$/, '') : Math.round(val * 0.5);
  const tick4 = isKm ? (val * 0.75).toFixed(1).replace(/\.0$/, '') : Math.round(val * 0.75);
  const tick5 = `${val}${unitSuffix}`;

  return (
    <div className="absolute bottom-4 start-4 md:start-6 z-[400] flex items-center gap-2.5 pointer-events-auto select-none">
      {/* 1. Coordinates Pill Box */}
      <div className={`px-3.5 py-1.5 rounded-[16px] border shadow-lg backdrop-blur-xl flex items-center gap-2 transition-all ${
        isDarkMode 
          ? 'bg-[#0f1932]/95 border-slate-700/60 text-slate-100 shadow-[0_6px_24px_rgba(0,0,0,0.4)]' 
          : 'bg-white/95 border-slate-200/90 text-[#182645] shadow-[0_6px_24px_rgba(0,0,0,0.08)]'
      }`}>
        <span className="font-extrabold text-[12.5px] tracking-tight font-sans">
          {coordString}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          title="Copy Coordinates"
          className={`p-1 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
            isDarkMode 
              ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
              : 'hover:bg-slate-100 text-[#182645] hover:text-[#215A9E]'
          }`}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
          ) : (
            <Copy className="w-3.5 h-3.5 stroke-[2]" />
          )}
        </button>
      </div>

      {/* 2. Scale Bar Pill Box */}
      <div className={`px-3.5 py-1 rounded-[16px] border shadow-lg backdrop-blur-xl flex flex-col items-center justify-center min-w-[170px] transition-all ${
        isDarkMode 
          ? 'bg-[#0f1932]/95 border-slate-700/60 text-slate-100 shadow-[0_6px_24px_rgba(0,0,0,0.4)]' 
          : 'bg-white/95 border-slate-200/90 text-[#182645] shadow-[0_6px_24px_rgba(0,0,0,0.08)]'
      }`}>
        {/* Scale Line with Vertical Caps and Alternating Filled Segments */}
        <div className="relative w-full h-[9px] flex items-center px-0.5 mt-0.5">
          {/* Left End Vertical Cap */}
          <div className={`w-[2px] h-[9px] rounded-full ${isDarkMode ? 'bg-slate-100' : 'bg-[#182645]'}`} />
          
          {/* Segment Bar */}
          <div className="flex-1 h-[3px] flex mx-[-1px]">
            <div className={`w-[12.5%] h-full ${isDarkMode ? 'bg-[#00e5ff]' : 'bg-[#182645]'}`} />
            <div className="w-[12.5%] h-full bg-transparent" />
            <div className={`w-[25%] h-full ${isDarkMode ? 'bg-[#00e5ff]' : 'bg-[#182645]'}`} />
            <div className="w-[25%] h-full bg-transparent" />
            <div className={`w-[25%] h-full ${isDarkMode ? 'bg-[#00e5ff]' : 'bg-[#182645]'}`} />
          </div>

          {/* Right End Vertical Cap */}
          <div className={`w-[2px] h-[9px] rounded-full ${isDarkMode ? 'bg-slate-100' : 'bg-[#182645]'}`} />
        </div>

        {/* Dynamic Scale Ticks & Numbers */}
        <div className={`flex justify-between w-full text-[9.5px] font-extrabold tracking-tight mt-0.5 font-sans ${
          isDarkMode ? 'text-slate-200' : 'text-[#182645]'
        }`}>
          <span>{tick0}</span>
          <span>{tick1}</span>
          <span>{tick2}</span>
          <span>{tick3}</span>
          <span>{tick4}</span>
          <span>{tick5}</span>
        </div>
      </div>
    </div>
  );
}

export default function MapBackground({ mouseX, mouseY, isSearchFocused, onMapClick, selectedLocation, isExplorer, explorerState, setExplorerState }) {
  const { isArabic, t } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();
  const [mapStatus, setMapStatus] = useState({ lat: 24.483910, lng: 54.377320, zoom: 16 });
  const userLoc = explorerState?.userLocation || { lat: 24.4839, lng: 54.3773 };
  const hasUserLocation = Boolean(explorerState?.userLocationEnabled && explorerState?.userLocation);
  const initialCenter = hasUserLocation
    ? [userLoc.lat, userLoc.lng]
    : (explorerState?.mapFocus?.lat ? [explorerState.mapFocus.lat, explorerState.mapFocus.lng] : [24.4839, 54.3773]);
  const initialZoom = hasUserLocation ? 16 : (explorerState?.mapFocus?.zoom || 13);

  const uaeBounds = [
    [22.5, 51.5],
    [26.1, 56.5]
  ];

  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  // Active query result set (map strictly matches only these active results)
  const activeResults = explorerState?.activeResults || [];
  const routeDest = explorerState?.activeRouteDestination;

  // Live Road Navigation Routing State (Open Source Routing Machine)
  const [osrmRoute, setOsrmRoute] = useState(null);

  useEffect(() => {
    if (!routeDest || !routeDest.lat || !routeDest.lng || !userLoc || !userLoc.lat || !userLoc.lng) {
      setOsrmRoute(null);
      return;
    }

    let isMounted = true;
    const sLat = Number(userLoc.lat);
    const sLng = Number(userLoc.lng);
    const dLat = Number(routeDest.lat);
    const dLng = Number(routeDest.lng);

    if (isNaN(sLat) || isNaN(sLng) || isNaN(dLat) || isNaN(dLng)) {
      setOsrmRoute(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const fetchLiveRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${sLng},${sLat};${dLng},${dLat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.code === 'Ok' && data.routes && data.routes[0]?.geometry?.coordinates?.length > 1) {
            const coords = data.routes[0].geometry.coordinates.map(pt => [pt[1], pt[0]]);
            setOsrmRoute({
              waypoints: coords,
              distanceKm: data.routes[0].distance / 1000,
              durationMin: Math.max(1, Math.round(data.routes[0].duration / 60))
            });
          }
        }
      } catch (err) {
        // Fallback to local street grid routing
      }
    };

    fetchLiveRoute();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [routeDest?.lat, routeDest?.lng, routeDest?.name, userLoc?.lat, userLoc?.lng]);

  const fallbackWaypoints = routeDest ? getRoadDirectionsWaypoints(userLoc, routeDest) : [];
  const routeWaypoints = (osrmRoute && osrmRoute.waypoints && osrmRoute.waypoints.length > 1)
    ? osrmRoute.waypoints
    : fallbackWaypoints;

  const rawGeodesicKm = routeDest && userLoc && routeDest.lat && routeDest.lng
    ? calculateGeodesicDistance(userLoc.lat, userLoc.lng, routeDest.lat, routeDest.lng)
    : null;
  const routeDistanceKm = osrmRoute?.distanceKm || rawGeodesicKm;
  const routeDurationMin = osrmRoute?.durationMin || Math.max(2, Math.round(((routeDistanceKm || 2.5) / 35) * 60));

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto w-full h-full">
      <MapContainer 
        center={initialCenter} 
        zoom={initialZoom} 
        zoomControl={false}
        scrollWheelZoom={isExplorer}
        doubleClickZoom={isExplorer}
        dragging={isExplorer}
        touchZoom={isExplorer}
        maxBounds={uaeBounds}
        maxBoundsViscosity={1.0}
        minZoom={7}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <MapController explorerState={explorerState} setExplorerState={setExplorerState} isExplorer={isExplorer} />
        
        {isExplorer && (
          <CustomDrawControl explorerState={explorerState} setExplorerState={setExplorerState} />
        )}
        
        <ArcGISBasemap activeBasemapId={explorerState?.activeBasemap || explorerState?.basemap || 'abu-dhabi-dge'} />
        
        {/* User Location Marker Pin with radar ring & location popup (strictly when location is allowed) */}
        {explorerState?.userLocationEnabled && userLoc && userLoc.lat && userLoc.lng && (
          <Marker 
            position={[userLoc.lat, userLoc.lng]} 
            icon={userLocationPinIcon} 
            zIndexOffset={1500}
          >
            <Popup minWidth={220} maxWidth={260} className="custom-user-location-popup">
              <div className={`p-1.5 font-sans flex flex-col items-center text-center gap-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg border ${
                  isDarkMode 
                    ? 'bg-[#182645] text-[#00e5ff] border-[#00e5ff]/30' 
                    : 'bg-[#215A9E]/10 text-[#215A9E] border-[#215A9E]/20'
                }`}>
                  🎯
                </div>
                <div>
                  <h4 className={`font-black text-xs tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                    {isArabic ? 'موقعك الحالي' : 'Your Current Location'}
                  </h4>
                  <p className={`text-[10px] font-semibold mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                    {isArabic ? 'مركز التكبير المحدد' : 'Focused Location'} • Zoom Level 16
                  </p>
                  <p className={`text-[9.5px] font-mono mt-0.5 ${isDarkMode ? 'text-sky-400' : 'text-slate-400'}`}>
                    {userLoc.lat.toFixed(4)}° N, {userLoc.lng.toFixed(4)}° E
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Strictly render ONLY active query result set markers */}
        {isExplorer && activeResults.map(item => (
          item.lat && item.lng && (
            <FacilityMarker 
              key={item.id || item.name} 
              item={item} 
              isArabic={isArabic} 
              isLoggedIn={isLoggedIn} 
              explorerState={explorerState} 
              setExplorerState={setExplorerState} 
            />
          )
        ))}

        {/* Render Realistic Google Maps Style Route Polyline */}
        {routeWaypoints.length > 0 && (
          <>
            {/* 1. Subtle Outer Drop Shadow / Casing */}
            <Polyline 
              positions={routeWaypoints}
              pathOptions={{ 
                color: isDarkMode ? '#0d47a1' : '#174ea6', 
                weight: 10, 
                opacity: 0.95, 
                lineCap: 'round', 
                lineJoin: 'round' 
              }} 
            />
            {/* 2. Google Maps Navigation Blue Core Line */}
            <Polyline 
              positions={routeWaypoints}
              pathOptions={{ 
                color: '#1a73e8', 
                weight: 6, 
                opacity: 1, 
                lineCap: 'round', 
                lineJoin: 'round' 
              }} 
            />
            {/* 3. Subtle Inner White Directional Highway Dash Overlay */}
            <Polyline 
              positions={routeWaypoints}
              pathOptions={{ 
                color: '#ffffff', 
                weight: 2, 
                opacity: 0.45, 
                dashArray: '8, 16', 
                lineCap: 'round', 
                lineJoin: 'round' 
              }} 
            />

            {/* Google Maps Origin Waypoint Dot */}
            {routeWaypoints[0] && (
              <Marker 
                position={routeWaypoints[0]} 
                icon={googleMapsOriginIcon} 
                zIndexOffset={2000} 
              />
            )}

            {/* Google Maps Destination Pin */}
            {routeWaypoints[routeWaypoints.length - 1] && (
              <Marker 
                position={routeWaypoints[routeWaypoints.length - 1]} 
                icon={googleMapsDestinationIcon} 
                zIndexOffset={2001} 
              />
            )}
          </>
        )}

        {/* Render Saved Drawings from explorerState */}
        {isExplorer && (explorerState?.drawings || []).map((draw, idx) => {
          if (draw.type === 'rectangle' && draw.bounds) {
            return (
              <Rectangle 
                key={draw.id || `rect-${idx}`} 
                bounds={draw.bounds} 
                pathOptions={{ color: '#7c3aed', weight: 2.5, fillColor: '#7c3aed', fillOpacity: 0.2 }} 
              />
            );
          }
          if (draw.type === 'circle' && draw.center && draw.radius) {
            return (
              <Circle 
                key={draw.id || `circ-${idx}`} 
                center={draw.center} 
                radius={draw.radius} 
                pathOptions={{ color: '#7c3aed', weight: 2.5, fillColor: '#7c3aed', fillOpacity: 0.2 }} 
              />
            );
          }
          if (draw.type === 'polygon' && draw.positions) {
            return (
              <Polygon 
                key={draw.id || `poly-${idx}`} 
                positions={draw.positions} 
                pathOptions={{ color: '#7c3aed', weight: 2.5, fillColor: '#7c3aed', fillOpacity: 0.2 }} 
              />
            );
          }
          return null;
        })}

        {isExplorer && !explorerState?.drawings?.length && explorerState?.drawnRectangle && (
          <Rectangle 
            bounds={explorerState.drawnRectangle} 
            pathOptions={{ color: '#7c3aed', weight: 2.5, fillColor: '#7c3aed', fillOpacity: 0.2 }} 
          />
        )}
        {isExplorer && !explorerState?.drawings?.length && explorerState?.drawnCircle && (
          <Circle 
            center={explorerState.drawnCircle.center} 
            radius={explorerState.drawnCircle.radius} 
            pathOptions={{ color: '#7c3aed', weight: 2.5, fillColor: '#7c3aed', fillOpacity: 0.2 }} 
          />
        )}
        {isExplorer && !explorerState?.drawings?.length && explorerState?.drawnPolygon && (
          <Polygon 
            positions={explorerState.drawnPolygon} 
            pathOptions={{ color: '#7c3aed', weight: 2.5, fillColor: '#7c3aed', fillOpacity: 0.2 }} 
          />
        )}

        {/* Selected Location Highlight Marker - Render pulse pointer ONLY if NOT already rendered by FacilityMarker */}
        {(() => {
          const targetLoc = selectedLocation || explorerState?.selectedDetail || explorerState?.selectedLocation || explorerState?.mapFocus;
          if (!targetLoc || !targetLoc.lat || !targetLoc.lng) return null;

          const isAlreadyInActiveResults = isExplorer && activeResults.some(item => 
            (targetLoc.id && item.id && String(targetLoc.id) === String(item.id)) ||
            (targetLoc.name && item.name && targetLoc.name.trim().toLowerCase() === item.name.trim().toLowerCase()) ||
            (Math.abs(item.lat - targetLoc.lat) < 0.0001 && Math.abs(item.lng - targetLoc.lng) < 0.0001)
          );

          if (isAlreadyInActiveResults) return null;

          const itemType = targetLoc.facilityType || targetLoc.type || 'GOVERNMENT';

          return (
            <Marker 
              position={[targetLoc.lat, targetLoc.lng]} 
              icon={createPulsePointerIcon(targetLoc)}
              zIndexOffset={3000}
            />
          );
        })()}
        {/* Map Coordinates & Scale Live Tracker */}
        <MapCoordinatesTracker setMapStatus={setMapStatus} />
      </MapContainer>

      {/* Map Bottom Left Coordinates & Scale Bar Pill Widgets */}
      <MapStatusBar mapStatus={mapStatus} isDarkMode={isDarkMode} />

      {/* Floating Drawing Tool Guidance Toast Banner */}
      {isExplorer && explorerState?.drawingTool && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 rounded-2xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] text-white shadow-2xl border border-white/20 flex items-center gap-3 font-bold text-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
          <span>
            {explorerState.drawingTool === 'rectangle' && (isArabic ? 'انقر واسحب أو انقر لتحديد منطقة المربع' : 'Click & drag or click on map to fix Box area')}
            {explorerState.drawingTool === 'circle' && (isArabic ? 'انقر واسحب أو انقر لتحديد نطاق الدائرة' : 'Click & drag or click on map to fix Circle area')}
            {explorerState.drawingTool === 'polygon' && (isArabic ? 'انقر لإضافة نقاط، وانقر مرتين لإكمال المضلع' : 'Click map to add vertices, double-click to finish Polygon')}
          </span>
          <button
            type="button"
            onClick={() => setExplorerState(prev => ({ ...prev, drawingTool: null }))}
            className="ms-2 px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] cursor-pointer"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      )}

      {/* Floating Center Control Area (Google Maps Direction Card & Spatial Zone Filter) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[450] pointer-events-auto flex flex-col items-center gap-2 max-w-[94%] sm:max-w-md w-full px-2">
        {/* Floating Google Maps Style Direction Navigation Card with Clear Button */}
        {isExplorer && routeDest && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`w-full rounded-2xl border shadow-2xl p-2.5 sm:px-3.5 sm:py-3 flex items-center justify-between gap-3 backdrop-blur-xl transition-all ${
              isDarkMode 
                ? 'bg-[#0b1426]/95 border-slate-700/80 text-white shadow-[0_15px_35px_rgba(0,0,0,0.6)]' 
                : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl'
            }`}
          >
            {/* Google Maps Blue Turn Icon */}
            <div className="w-9 h-9 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center shrink-0 shadow-md">
              <Navigation className="w-5 h-5 fill-current" />
            </div>

            {/* Destination & Route Metrics */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs truncate">
                  {isArabic && routeDest.name_ar ? routeDest.name_ar : routeDest.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold mt-0.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {routeDurationMin} {t('min', 'دقيقة')}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-bold">
                  {routeDistanceKm ? routeDistanceKm.toFixed(1) : '2.5'} {t('km', 'كم')}
                </span>
                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-400 text-[10px] hidden sm:inline font-medium">
                  {t('Fastest route', 'أسرع مسار')}
                </span>
              </div>
            </div>

            {/* Clear Direction Route Button */}
            <button
              type="button"
              onClick={() => setExplorerState(prev => ({ ...prev, activeRouteDestination: null }))}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
              title={t('Clear active route', 'إلغاء وتفريغ المسار')}
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">{t('Clear Route', 'مسح المسار')}</span>
            </button>
          </motion.div>
        )}

        {/* Floating Active Spatial Zone Filter Banner with Clear Shape Button */}
        {isExplorer && ((explorerState?.drawings && explorerState.drawings.length > 0) || explorerState?.drawnPolygon || explorerState?.drawnCircle || explorerState?.drawnRectangle) && !explorerState?.drawingTool && (
          <div className={`px-3.5 py-2 rounded-2xl shadow-xl border flex items-center gap-2.5 backdrop-blur-xl transition-all ${
            isDarkMode 
              ? 'bg-[#0f1932]/95 border-purple-500/40 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
              : 'bg-white/95 border-purple-200 text-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
          }`}>
            <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
            <span className="text-xs font-bold">
              {isArabic ? 'منطقة التحليل المكانية نشطة' : 'Active Spatial Zone Filter'}
            </span>
            <button
              type="button"
              onClick={() => {
                const datasets = activeProject?.datasets || explorerState?.activeProject?.datasets || [];
                const masterDataset = getMasterAuthoritativeDataset(datasets);
                const activeSubs = explorerState?.selectedGisSubcategories || [];
                const restoredResults = activeSubs.length > 0
                  ? masterDataset.filter(loc => matchesGisSubcategories(loc, activeSubs))
                  : (datasets.length > 0 ? datasets : masterDataset);

                setExplorerState(prev => ({
                  ...prev,
                  drawings: [],
                  drawnPolygon: null,
                  drawnCircle: null,
                  drawnRectangle: null,
                  activeDrawnArea: null,
                  activeResults: restoredResults,
                  showSearchResults: activeSubs.length > 0
                }));
              }}
              className="ms-1 px-2.5 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 dark:hover:text-white border border-rose-500/30 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              title={isArabic ? 'مسح الشكل المكتوب' : 'Clear drawn shape'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'مسح الرسم' : 'Clear Shape'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
