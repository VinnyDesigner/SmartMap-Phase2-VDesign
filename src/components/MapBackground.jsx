import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents, Polygon, Circle, Rectangle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles, Navigation, Target, Copy, Check, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProject } from '../contexts/ProjectContext';
import ArcGISBasemap from './explorer/ArcGISBasemap';
import { getLandmarkThumbnail } from '../utils/landmarkImages';
import { triggerViewDetails } from '../utils/viewDetailsHandler';

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

const getCategoryColorDetails = (type) => {
  let textColor = 'text-[#215A9E]';
  let hexColor = '#215A9E';

  if (type === 'GOVERNMENT' || type === 'MUNICIPAL') {
    textColor = 'text-[#063360]';
    hexColor = '#063360';
  } else if (type === 'EDUCATION') {
    textColor = 'text-blue-600';
    hexColor = '#2563eb';
  } else if (type === 'HOSPITAL' || type === 'HEALTHCARE') {
    textColor = 'text-red-600';
    hexColor = '#dc2626';
  } else if (type === 'PARK' || type === 'ENVIRONMENT') {
    textColor = 'text-emerald-600';
    hexColor = '#059669';
  } else if (type === 'TRANSPORT') {
    textColor = 'text-purple-600';
    hexColor = '#9333ea';
  } else if (type === 'TOURISM') {
    textColor = 'text-amber-500';
    hexColor = '#d97706';
  }

  return { textColor, hexColor };
};

const createPulsePointerIcon = (type = 'GOVERNMENT') => {
  const { textColor, hexColor } = getCategoryColorDetails(type);
  
  return L.divIcon({
    className: 'custom-pulse-pointer-container',
    html: `
      <div class="relative flex items-center justify-center" style="width: 56px; height: 56px;">
        <!-- Expanding Pulse Wave 1 -->
        <div class="absolute inset-0 rounded-full animate-ping opacity-65 pointer-events-none" style="background-color: ${hexColor}40;"></div>
        <!-- Glowing Pulse Aura 2 -->
        <div class="absolute inset-1.5 rounded-full animate-pulse opacity-85 pointer-events-none border-2" style="background-color: ${hexColor}25; border-color: ${hexColor}; box-shadow: 0 0 20px ${hexColor};"></div>
        <!-- Pulse Target Center Core -->
        <div class="relative w-7 h-7 rounded-full bg-white shadow-[0_0_14px_${hexColor}] flex items-center justify-center border-2 pointer-events-auto" style="border-color: ${hexColor};">
          <div class="w-3 h-3 rounded-full animate-ping" style="background-color: ${hexColor};"></div>
          <div class="absolute w-2.5 h-2.5 rounded-full shadow-sm" style="background-color: ${hexColor};"></div>
        </div>
        <!-- Floating Animated Pointer Pin above pulse beacon -->
        <div class="absolute -top-7 ${textColor} animate-bounce flex items-center justify-center pointer-events-none" style="filter: drop-shadow(0 6px 10px ${hexColor}80);">
          <svg width="32" height="38" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16C0 26.667 16 40 16 40C16 40 32 26.667 32 16C32 7.163 24.837 0 16 0Z" fill="currentColor"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
            <circle cx="16" cy="16" r="3" fill="currentColor"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 28]
  });
};

const createCategoryIcon = (type, isSelected = false) => {
  const { textColor } = getCategoryColorDetails(type);

  if (isSelected) {
    return createPulsePointerIcon(type);
  }

  return L.divIcon({
    className: 'custom-map-pin-container',
    html: `<div class="${textColor} flex items-center justify-center hover:scale-110 transition-transform duration-300 origin-bottom" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3))">
             <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M16 0C7.163 0 0 7.163 0 16C0 26.667 16 40 16 40C16 40 32 26.667 32 16C32 7.163 24.837 0 16 0Z" fill="currentColor"/>
               <circle cx="16" cy="16" r="6" fill="white"/>
             </svg>
           </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40]
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

  useEffect(() => {
    if (isExplorer) {
      const targetLat = explorerState?.mapFocus?.lat || explorerState?.userLocation?.lat || 24.4839;
      const targetLng = explorerState?.mapFocus?.lng || explorerState?.userLocation?.lng || 54.3773;
      const targetZoom = explorerState?.mapFocus?.zoom || 16;
      map.flyTo([targetLat, targetLng], targetZoom, { animate: true, duration: 1.2 });
    }
  }, [isExplorer]);

  useEffect(() => {
    if (explorerState?.mapFocus) {
      map.flyTo(
        [explorerState.mapFocus.lat, explorerState.mapFocus.lng], 
        explorerState.mapFocus.zoom || 16, 
        { animate: true, duration: 1.2 }
      );
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
        const loc = explorerState?.userLocation || { lat: 24.4839, lng: 54.3773 };
        map.flyTo([loc.lat, loc.lng], 16, { animate: true, duration: 1.2 });
      }
      setExplorerState(prev => ({ ...prev, mapAction: null }));
    }
  }, [explorerState?.mapAction, explorerState?.userLocation, map, setExplorerState]);

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

  const generateAiChatMessages = (shapeType, filtered) => {
    let shapeLabelEn = 'Drawn Area';
    let shapeLabelAr = 'المنطقة المحددة';
    if (shapeType === 'circle') { shapeLabelEn = 'Circle Zone'; shapeLabelAr = 'المنطقة الدائرية'; }
    else if (shapeType === 'rectangle') { shapeLabelEn = 'Box Zone'; shapeLabelAr = 'المنطقة المربعة'; }
    else if (shapeType === 'polygon') { shapeLabelEn = 'Polygon Zone'; shapeLabelAr = 'المنطقة المضلعة'; }

    const userMsg = {
      id: `msg-draw-usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'user',
      content: isArabic 
        ? `تحليل مكاني: ${shapeLabelAr} (${filtered.length} نتائج)` 
        : `Spatial Analysis: ${shapeLabelEn} (${filtered.length} results found)`
    };

    const assistantMsg = {
      id: `msg-draw-ast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'assistant',
      content: isArabic
        ? `🎯 **اكتمل التحليل المكاني لـ ${shapeLabelAr}**\n\nتم تحليل نطاق الرسم بنجاح وتصفية **${filtered.length}** موقعاً ومعلماً حكومياً ضمن الحدود المحددة.`
        : `🎯 **Spatial Analysis Complete for ${shapeLabelEn}**\n\nSuccessfully processed your spatial drawing and identified **${filtered.length}** points of interest and government facilities within the bounding zone.`,
      results: filtered,
      datasetsUsed: ['DGE Spatial SDI 2026', 'Abu Dhabi Government Facilities Registry'],
      suggestions: isArabic
        ? ["مقارنة المنشآت القريبة", "تصدير التحليل إلى PDF", "عرض الملخص الديموغرافي"]
        : ["Compare nearby facilities", "Export spatial analysis to PDF", "Show area demographics"]
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
    const dataset = activeProject?.datasets || [];
    const filtered = dataset.filter(loc => 
      loc.lat >= minLat && loc.lat <= maxLat &&
      loc.lng >= minLng && loc.lng <= maxLng
    );

    const newDrawing = {
      id: 'rect-' + Date.now(),
      type: 'rectangle',
      bounds
    };

    const [userMsg, assistantMsg] = generateAiChatMessages('rectangle', filtered);

    setExplorerState(prev => ({
      ...prev,
      drawingTool: null,
      activeMenu: null,
      drawnRectangle: bounds,
      drawings: [...(prev.drawings || []), newDrawing],
      chatHistory: [...(prev.chatHistory || []), userMsg, assistantMsg],
      activeResults: filtered,
      showSearchResults: filtered.length > 0
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
    const dataset = activeProject?.datasets || [];
    const filtered = dataset.filter(loc => {
      const dist = L.latLng(start.lat, start.lng).distanceTo([loc.lat, loc.lng]);
      return dist <= radius;
    });

    const newDrawing = {
      id: 'circle-' + Date.now(),
      type: 'circle',
      center,
      radius
    };

    const [userMsg, assistantMsg] = generateAiChatMessages('circle', filtered);

    setExplorerState(prev => ({
      ...prev,
      drawingTool: null,
      activeMenu: null,
      drawnCircle: { center, radius },
      drawings: [...(prev.drawings || []), newDrawing],
      chatHistory: [...(prev.chatHistory || []), userMsg, assistantMsg],
      activeResults: filtered,
      showSearchResults: filtered.length > 0
    }));

    setStartPoint(null);
    setCurrentPoint(null);
    setIsDraggingDraw(false);
  };

  const finishPolygon = (pts) => {
    if (!pts || pts.length < 3) return;
    const positions = pts.map(p => [p.lat, p.lng]);

    const lats = pts.map(p => p.lat);
    const lngs = pts.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const dataset = activeProject?.datasets || [];
    const filtered = dataset.filter(loc => 
      loc.lat >= minLat && loc.lat <= maxLat &&
      loc.lng >= minLng && loc.lng <= maxLng
    );

    const newDrawing = {
      id: 'poly-' + Date.now(),
      type: 'polygon',
      positions
    };

    const [userMsg, assistantMsg] = generateAiChatMessages('polygon', filtered);

    setExplorerState(prev => ({
      ...prev,
      drawingTool: null,
      activeMenu: null,
      drawnPolygon: positions,
      drawings: [...(prev.drawings || []), newDrawing],
      chatHistory: [...(prev.chatHistory || []), userMsg, assistantMsg],
      activeResults: filtered,
      showSearchResults: filtered.length > 0
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
  const sLat = startLoc.lat || 24.4789;
  const sLng = startLoc.lng || 54.3312;
  const dLat = destLoc.lat;
  const dLng = destLoc.lng;

  // 1. Saadiyat Island / Louvre Abu Dhabi area (Crosses via Sheikh Khalifa Bridge E12)
  if (dLat > 24.51 && dLng > 54.37 && dLng < 54.45) {
    return [
      [sLat, sLng],
      [24.4920, 54.3520], // Corniche East
      [24.5060, 54.3720], // Mina St / Port Exit
      [24.5160, 54.3830], // Sheikh Khalifa Bridge (E12 Highway)
      [24.5280, 54.3930], // Saadiyat Cultural District Interchange
      [dLat, dLng]
    ];
  }

  // 2. Yas Island area (Crosses via E12 Saadiyat Expressway & Jubail Causeway)
  if (dLat > 24.48 && dLng > 54.55) {
    return [
      [sLat, sLng],
      [24.5060, 54.3720], // Mina St
      [24.5160, 54.3830], // Sheikh Khalifa Bridge
      [24.5300, 54.4300], // Saadiyat Expressway
      [24.5380, 54.5000], // Jubail Island Highway
      [24.5200, 54.5700], // Yas West Interchange
      [dLat, dLng]
    ];
  }

  // 3. Qasr Al Watan / Ras Al Akhdar area (Follows Corniche West & Bainuna St)
  if (dLng < 54.32) {
    return [
      [sLat, sLng],
      [24.4730, 54.3230], // Corniche West
      [24.4660, 54.3120], // Bainuna St
      [24.4635, 54.3080], // Palace Entrance Drive
      [dLat, dLng]
    ];
  }

  // 4. Sheikh Zayed Mosque / South Abu Dhabi (Follows Airport Road E11 corridor)
  if (dLat < 24.43 && dLng > 54.42) {
    return [
      [sLat, sLng],
      [24.4650, 54.3520], // Sultan Bin Zayed St
      [24.4420, 54.3980], // Sheikh Rashid Bin Saeed St (Airport Rd)
      [24.4250, 54.4400], // Al Muroor Sector
      [24.4160, 54.4680], // Mosque Interchange
      [dLat, dLng]
    ];
  }

  // 5. Umm Al Emarat Park / Al Mushrif area
  if (dLat >= 24.43 && dLat <= 24.46 && dLng >= 54.36 && dLng <= 54.40) {
    return [
      [sLat, sLng],
      [24.4650, 54.3550], // Karamah St
      [24.4540, 54.3720], // 15th St (Mohammed Bin Khalifa St)
      [24.4480, 54.3800], // Park Access Rd
      [dLat, dLng]
    ];
  }

  // Generic Abu Dhabi Street Grid Route (curves along main avenues instead of cutting straight line)
  const midLat1 = sLat + (dLat - sLat) * 0.35;
  const midLng1 = sLng + (dLng - sLng) * 0.15;
  const midLat2 = sLat + (dLat - sLat) * 0.75;
  const midLng2 = sLng + (dLng - sLng) * 0.85;

  return [
    [sLat, sLng],
    [midLat1, midLng1],
    [midLat2, midLng2],
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
      icon={createCategoryIcon(item.type || item.facilityType, isSelected)}
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
        <div className={`p-1 font-sans flex flex-col gap-2 rounded-2xl ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          <div className={`w-full h-24 rounded-xl overflow-hidden relative ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <img 
              src={getLandmarkThumbnail(item)} 
              alt={item.name} 
              className="w-full h-full object-cover" 
            />
          </div>

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
  const { isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const [mapStatus, setMapStatus] = useState({ lat: 24.483910, lng: 54.377320, zoom: 16 });
  const userLoc = explorerState?.userLocation || { lat: 24.4839, lng: 54.3773 };
  const initialCenter = [
    explorerState?.mapFocus?.lat || userLoc.lat,
    explorerState?.mapFocus?.lng || userLoc.lng
  ];
  const initialZoom = explorerState?.mapFocus?.zoom || 16;

  const uaeBounds = [
    [22.5, 51.5],
    [26.1, 56.5]
  ];

  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  // Active query result set (map strictly matches only these active results)
  const activeResults = explorerState?.activeResults || [];
  const routeDest = explorerState?.activeRouteDestination;

  const routeWaypoints = routeDest ? getRoadDirectionsWaypoints(userLoc, routeDest) : [];

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
        
        <ArcGISBasemap activeBasemapId={explorerState?.activeBasemap || explorerState?.basemap || 'esri-vector'} />
        
        {/* User Location Marker Pin with radar ring & location popup */}
        {userLoc && userLoc.lat && userLoc.lng && (
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

        {/* Render Realistic Road Network Polyline for Directions */}
        {routeWaypoints.length > 0 && (
          <>
            {/* Outer dark road casing for high contrast */}
            <Polyline 
              positions={routeWaypoints}
              pathOptions={{ color: '#0b1426', weight: 8, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }}
            />
            {/* Inner cyan animated road navigation line */}
            <Polyline 
              positions={routeWaypoints}
              pathOptions={{ color: '#00e5ff', weight: 4, opacity: 1, dashArray: '10, 10', lineCap: 'round', lineJoin: 'round' }}
            />
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
              icon={createPulsePointerIcon(itemType)}
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

      {/* Floating Active Spatial Zone Filter Banner with Clear Shape Button */}
      {isExplorer && ((explorerState?.drawings && explorerState.drawings.length > 0) || explorerState?.drawnPolygon || explorerState?.drawnCircle || explorerState?.drawnRectangle) && !explorerState?.drawingTool && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[400] px-3.5 py-2 rounded-2xl shadow-xl border flex items-center gap-2.5 backdrop-blur-xl transition-all ${
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
            onClick={() => setExplorerState(prev => ({
              ...prev,
              drawings: [],
              drawnPolygon: null,
              drawnCircle: null,
              drawnRectangle: null,
              activeResults: []
            }))}
            className="ms-1 px-2.5 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 dark:hover:text-white border border-rose-500/30 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer"
            title={isArabic ? 'مسح الشكل المكتوب' : 'Clear drawn shape'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'مسح الرسم' : 'Clear Shape'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
