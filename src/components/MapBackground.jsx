import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents, Polygon, Circle, Rectangle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles, Navigation, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ArcGISBasemap from './explorer/ArcGISBasemap';
import { getLandmarkThumbnail } from '../utils/landmarkImages';

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

const createCategoryIcon = (type) => {
  let textColor = 'text-[#215A9E]';
  if (type === 'GOVERNMENT' || type === 'MUNICIPAL') textColor = 'text-[#063360]';
  else if (type === 'EDUCATION') textColor = 'text-blue-600';
  else if (type === 'HOSPITAL' || type === 'HEALTHCARE') textColor = 'text-red-600';
  else if (type === 'PARK' || type === 'ENVIRONMENT') textColor = 'text-emerald-600';
  else if (type === 'TRANSPORT') textColor = 'text-purple-600';
  else if (type === 'TOURISM') textColor = 'text-amber-500';

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
    if (explorerState?.mapFocus) {
      map.flyTo(
        [explorerState.mapFocus.lat, explorerState.mapFocus.lng], 
        explorerState.mapFocus.zoom || 15, 
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
  const [startPoint, setStartPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [polyPoints, setPolyPoints] = useState([]);
  const [mousePos, setMousePos] = useState(null);

  useEffect(() => {
    if (explorerState?.drawingTool) {
      map.dragging.disable();
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.dragging.enable();
      map.getContainer().style.cursor = '';
      setStartPoint(null);
      setCurrentPoint(null);
      setPolyPoints([]);
    }
  }, [explorerState?.drawingTool, map]);

  useMapEvents({
    mousedown(e) {
      if (explorerState?.drawingTool === 'rectangle' || explorerState?.drawingTool === 'circle') {
        setStartPoint(e.latlng);
        setCurrentPoint(e.latlng);
      } else if (explorerState?.drawingTool === 'polygon') {
        setPolyPoints(prev => [...prev, e.latlng]);
      }
    },
    mousemove(e) {
      if (explorerState?.drawingTool === 'rectangle' || explorerState?.drawingTool === 'circle') {
        if (startPoint) setCurrentPoint(e.latlng);
      } else if (explorerState?.drawingTool === 'polygon') {
        setMousePos(e.latlng);
      }
    }
  });

  if (explorerState?.drawingTool === 'rectangle' && startPoint && currentPoint) {
    const bounds = L.latLngBounds(startPoint, currentPoint);
    return <Rectangle bounds={bounds} pathOptions={{ color: '#7c3aed', weight: 2, dashArray: '5, 5', fillColor: '#7c3aed', fillOpacity: 0.2 }} />;
  }

  if (explorerState?.drawingTool === 'circle' && startPoint && currentPoint) {
    const radius = startPoint.distanceTo(currentPoint);
    return <Circle center={startPoint} radius={radius} pathOptions={{ color: '#7c3aed', weight: 2, dashArray: '5, 5', fillColor: '#7c3aed', fillOpacity: 0.2 }} />;
  }

  return null;
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

export default function MapBackground({ mouseX, mouseY, isSearchFocused, onMapClick, selectedLocation, isExplorer, explorerState, setExplorerState }) {
  const { isArabic } = useLanguage();
  const position = [24.4839, 54.3773];
  const uaeBounds = [
    [22.5, 51.5],
    [26.1, 56.5]
  ];

  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  // Active query result set (map strictly matches only these active results)
  const activeResults = explorerState?.activeResults || [];
  const routeDest = explorerState?.activeRouteDestination;
  const userLoc = explorerState?.userLocation || { lat: 24.4789, lng: 54.3312 };

  const routeWaypoints = routeDest ? getRoadDirectionsWaypoints(userLoc, routeDest) : [];

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto w-full h-full">
      <MapContainer 
        center={position} 
        zoom={13} 
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
        
        {/* Strictly render ONLY active query result set markers */}
        {isExplorer && activeResults.map(item => (
          item.lat && item.lng && (
            <Marker 
              key={item.id} 
              position={[item.lat, item.lng]}
              icon={createCategoryIcon(item.type || item.facilityType)}
              eventHandlers={{
                click: () => {
                  setExplorerState(prev => ({
                    ...prev,
                    selectedLocation: item,
                    mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 }
                  }));
                }
              }}
            >
              <Popup minWidth={270} maxWidth={300} className="custom-facility-popup">
                <div className="p-1 font-sans flex flex-col gap-2">
                  <div className="w-full h-24 rounded-xl overflow-hidden relative bg-slate-100">
                    <img 
                      src={getLandmarkThumbnail(item)} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-[#1e2749] leading-snug">
                      {isArabic && item.name_ar ? item.name_ar : item.name}
                    </h4>
                    <p className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                      {item.facilityType || item.type || 'Government Facility'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      📍 {isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Al Bateen, Abu Dhabi')}
                    </p>
                    <p className="text-[9.5px] text-slate-400 font-medium mt-0.5">
                      {item.distance || '2.1 km from your location'}
                    </p>
                  </div>

                  <div className={`grid ${isLoggedIn ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5 pt-1 border-t border-slate-100`}>
                    <button 
                      onClick={() => {
                        setExplorerState(prev => ({
                          ...prev,
                          selectedDetail: item,
                          selectedLocation: item
                        }));
                      }}
                      className="py-1.5 px-2 rounded-xl bg-[#215A9E] hover:bg-[#1a477d] text-white font-bold text-[11px] shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      View Details
                    </button>

                    {isLoggedIn && (
                      <button 
                        onClick={() => {
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
                        }}
                        className="py-1.5 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10.5px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Add to Favorites</span>
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
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

        {/* Selected Location Highlight Marker */}
        {(selectedLocation || explorerState?.selectedDetail) && (
          <Marker 
            position={
              selectedLocation 
                ? [selectedLocation.lat, selectedLocation.lng] 
                : [explorerState.selectedDetail.lat, explorerState.selectedDetail.lng]
            } 
            icon={customPinIcon} 
          />
        )}
      </MapContainer>
    </div>
  );
}
