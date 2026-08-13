import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Polygon, Circle } from 'react-leaflet';
import L from 'leaflet';
import { motion, useTransform, useSpring } from 'framer-motion';

const customPinIcon = L.divIcon({
  className: 'custom-map-pin-container',
  html: `<div class="text-[#3D52A0] animate-bounce flex items-center justify-center" style="filter: drop-shadow(0 6px 8px rgba(0,0,0,0.3))">
           <svg width="40" height="50" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M16 0C7.163 0 0 7.163 0 16C0 26.667 16 40 16 40C16 40 32 26.667 32 16C32 7.163 24.837 0 16 0Z" fill="currentColor"/>
             <circle cx="16" cy="16" r="6" fill="white"/>
           </svg>
         </div>`,
  iconSize: [40, 50],
  iconAnchor: [20, 50]
});

const createCategoryIcon = (type) => {
  let textColor = 'text-[#3D52A0]';
  if (type === 'EDUCATION') textColor = 'text-blue-600';
  else if (type === 'HOSPITAL') textColor = 'text-red-600';
  else if (type === 'PARK') textColor = 'text-green-600';
  else if (type === 'TRANSPORT') textColor = 'text-orange-500';

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

function MapController({ explorerState, isExplorer }) {
  const map = useMap();
  
  useEffect(() => {
    if (isExplorer) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
    }
  }, [isExplorer, map]);

  useEffect(() => {
    if (explorerState?.mapFocus) {
      map.flyTo(
        [explorerState.mapFocus.lat, explorerState.mapFocus.lng], 
        explorerState.mapFocus.zoom || 16, 
        { animate: true, duration: 1.5 }
      );
    }
  }, [explorerState?.mapFocus, map]);

  return null;
}

function NativeDrawControl({ explorerState, setExplorerState }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    if (map.__drawInitialized) return;
    map.__drawInitialized = true;

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      map.on(L.Draw.Event.CREATED, function (e) {
        const type = e.layerType;
        const layer = e.layer;
        
        let bounds, center;
        
        if (type === 'circle') {
          center = layer.getLatLng();
          // Approximate bounds based on radius in meters (1 deg lat ~ 111.32 km)
          const r = layer.getRadius();
          const dLat = r / 111320;
          const dLng = r / (111320 * Math.cos(center.lat * (Math.PI / 180)));
          bounds = L.latLngBounds(
            [center.lat - dLat, center.lng - dLng],
            [center.lat + dLat, center.lng + dLng]
          );
        } else {
          // For polygon and rectangle
          const latlngs = layer.getLatLngs()[0];
          bounds = L.latLngBounds(latlngs);
          center = bounds.getCenter();
        }
        
        // Zoom map to the drawn shape
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        const mockResults = [
          { 
            id: Date.now() + 1, 
            name: 'Selected Area Result 1', 
            type: 'POI', 
            location: 'Custom Selection', 
            lat: center.lat + (Math.random() - 0.5) * 0.005, 
            lng: center.lng + (Math.random() - 0.5) * 0.005 
          },
          { 
            id: Date.now() + 2, 
            name: 'Selected Area Result 2', 
            type: 'POI', 
            location: 'Custom Selection', 
            lat: center.lat + (Math.random() - 0.5) * 0.005, 
            lng: center.lng + (Math.random() - 0.5) * 0.005 
          },
          { 
            id: Date.now() + 3, 
            name: 'Selected Area Result 3', 
            type: 'POI', 
            location: 'Custom Selection', 
            lat: center.lat + (Math.random() - 0.5) * 0.005, 
            lng: center.lng + (Math.random() - 0.5) * 0.005 
          }
        ];

        setExplorerState(prev => {
          let mockPolygon = null;
          let mockCircle = null;
          if (type === 'polygon' || type === 'rectangle') {
            mockPolygon = layer.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);
          } else if (type === 'circle') {
            const latlng = layer.getLatLng();
            mockCircle = { center: [latlng.lat, latlng.lng], radius: layer.getRadius() };
          }
          
          return {
            ...prev,
            drawnPolygon: mockPolygon,
            drawnCircle: mockCircle,
            drawingTool: null,
            isDrawingMode: false,
            isDockerMinimized: false,
            activeResults: mockResults, // Show the new markers inside the docker and map
            chatHistory: [
              ...prev.chatHistory,
              { sender: 'ai', text: `I have searched the selected area and found ${mockResults.length} locations.` }
            ]
          };
        });
      });
  }, [map, setExplorerState]);

  useEffect(() => {
    if (explorerState?.drawingTool && window.L && window.L.Draw) {
       let drawer;
       if (explorerState.drawingTool === 'rectangle') {
         drawer = new window.L.Draw.Rectangle(map);
       } else if (explorerState.drawingTool === 'circle') {
         drawer = new window.L.Draw.Circle(map);
       } else if (explorerState.drawingTool === 'polygon') {
         drawer = new window.L.Draw.Polygon(map);
       }
       
       if (drawer) drawer.enable();
       
       return () => {
         if (drawer) drawer.disable();
       };
    }
  }, [explorerState?.drawingTool, map]);

  return null;
}

function MapEventHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) onMapClick(e.latlng);
    }
  });
  return null;
}

export default function MapBackground({ mouseX, mouseY, isSearchFocused, onMapClick, selectedLocation, isExplorer, explorerState, setExplorerState }) {
  const position = [24.4839, 54.3773]; // Adjusted to center Abu Dhabi nicely
  const uaeBounds = [
    [22.5, 51.5], // Southwest coordinates
    [26.1, 56.5]  // Northeast coordinates
  ];
  
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 800 });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create smooth springs for the mouse position to drive the parallax
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map moves opposite to the cursor, max offset of 30px
  const x = useTransform(smoothX, [0, windowSize.w], [30, -30]);
  const y = useTransform(smoothY, [0, windowSize.h], [30, -30]);

  return (
    <motion.div 
      className="absolute z-0 pointer-events-auto"
      style={isExplorer ? {
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        x: 0,
        y: 0,
      } : {
        width: '110vw',
        height: '110vh',
        top: '-5vh',
        left: '-5vw',
        x,
        y,
        filter: (isSearchFocused || selectedLocation) ? 'blur(4px) brightness(0.95)' : 'blur(0px) brightness(1)',
        transition: 'filter 0.5s ease-in-out, width 0.5s, height 0.5s, top 0.5s, left 0.5s'
      }}
    >
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
        <MapController explorerState={explorerState} isExplorer={isExplorer} />
        
        {isExplorer && (
          <NativeDrawControl explorerState={explorerState} setExplorerState={setExplorerState} />
        )}
        
        <TileLayer
          key={explorerState?.basemap || 'osm'}
          url={
            !isExplorer ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            : explorerState?.basemap === 'satellite' ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : explorerState?.basemap === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : explorerState?.basemap === 'light' ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
          attribution='&copy; CartoDB'
        />
        
        {/* Render markers for active search results in explorer mode */}
        {isExplorer && explorerState?.activeResults && explorerState.activeResults
          .filter(item => {
            const typeMap = { 'EDUCATION': 'Education', 'HOSPITAL': 'Healthcare', 'TRANSPORT': 'Transport', 'PARK': 'Environment' };
            const layerName = typeMap[item.type] || 'Utilities';
            const selectedLayers = explorerState?.layerFilters || ['Education', 'Healthcare', 'Transport', 'Environment', 'Tourism', 'Utilities'];
            return selectedLayers.includes(layerName);
          })
          .map(item => (
            item.lat && item.lng && (
              <Marker 
                key={item.id} 
                position={[item.lat, item.lng]}
                icon={createCategoryIcon(item.type)}
                eventHandlers={{
                  click: () => {
                    setExplorerState(prev => ({ ...prev, selectedDetail: item, mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 } }));
                  }
                }}
              />
            )
          ))
        }

        {/* Draw Polygon visualization */}
        {explorerState?.drawnPolygon && (
          <Polygon positions={explorerState.drawnPolygon} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />
        )}

        {/* Draw Circle visualization */}
        {explorerState?.drawnCircle && (
          <Circle center={explorerState.drawnCircle.center} radius={explorerState.drawnCircle.radius} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />
        )}

        {/* Event Handler */}
        <MapEventHandler onMapClick={onMapClick} />
        
        {/* Render marker if a location is selected */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customPinIcon} />
        )}
      </MapContainer>
      
      {/* Subtle overlay just to soften the map slightly, replacing the heavy white wash */}
      {!isExplorer && <div className="absolute inset-0 bg-slate-50/30 pointer-events-none z-[400]" />}
    </motion.div>
  );
}
