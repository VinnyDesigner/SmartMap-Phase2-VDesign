import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents, Polygon, Circle, Rectangle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles, Navigation, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ArcGISBasemap from './explorer/ArcGISBasemap';

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

export default function MapBackground({ mouseX, mouseY, isSearchFocused, onMapClick, selectedLocation, isExplorer, explorerState, setExplorerState }) {
  const { isArabic } = useLanguage();
  const position = [24.4839, 54.3773];
  const uaeBounds = [
    [22.5, 51.5],
    [26.1, 56.5]
  ];

  // Active query result set (map strictly matches only these active results)
  const activeResults = explorerState?.activeResults || [];
  const routeDest = explorerState?.activeRouteDestination || selectedLocation;
  const userLoc = explorerState?.userLocation || { lat: 24.4839, lng: 54.3773 };

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
              <Popup minWidth={260} maxWidth={300} className="custom-facility-popup">
                <div className="p-1 font-sans space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b pb-1.5 border-slate-200">
                    <div>
                      <h4 className="font-bold text-xs text-[#1e2749]">
                        {isArabic && item.name_ar ? item.name_ar : item.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {isArabic && item.location_ar ? item.location_ar : item.location}
                      </p>
                    </div>
                    {item.distanceKm && (
                      <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-[#215A9E]">
                        {item.distanceKm} km
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Category: {item.type}</span>
                    <span className="font-bold text-emerald-600">SDI Verified</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Render Route Polyline when Directions action triggered */}
        {explorerState?.activeRouteDestination && (
          <Polyline 
            positions={[
              [userLoc.lat, userLoc.lng],
              [explorerState.activeRouteDestination.lat, explorerState.activeRouteDestination.lng]
            ]}
            pathOptions={{ color: '#00e5ff', weight: 4, opacity: 0.9, dashArray: '8, 8' }}
          />
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
