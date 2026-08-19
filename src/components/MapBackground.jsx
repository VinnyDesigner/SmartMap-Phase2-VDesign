import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Polygon, Circle, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import { motion, useTransform, useSpring } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

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

function MapController({ explorerState, setExplorerState, isExplorer }) {
  const map = useMap();
  
  useEffect(() => {
    if (isExplorer) {
      if (explorerState?.isDrawingMode || explorerState?.drawingTool) {
        map.dragging.disable();
      } else {
        map.dragging.enable();
      }
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
    }
  }, [isExplorer, explorerState?.isDrawingMode, explorerState?.drawingTool, map]);

  useEffect(() => {
    if (explorerState?.mapFocus) {
      map.flyTo(
        [explorerState.mapFocus.lat, explorerState.mapFocus.lng], 
        explorerState.mapFocus.zoom || 16, 
        { animate: true, duration: 1.5 }
      );
    }
  }, [explorerState?.mapFocus, map]);

  useEffect(() => {
    if (explorerState?.mapAction) {
      const action = explorerState.mapAction;
      if (action === 'zoomIn') map.zoomIn();
      else if (action === 'zoomOut') map.zoomOut();
      else if (action === 'home' || action === 'compass') {
        map.flyTo([24.4839, 54.3773], 13, { animate: true, duration: 1.5 });
      } else if (action === 'locate') {
        map.locate({ setView: true, maxZoom: 16 });
      }
      
      // Clear the action so it can be triggered again
      setExplorerState(prev => ({ ...prev, mapAction: null }));
    }
  }, [explorerState?.mapAction, map, setExplorerState]);

  return null;
}

function CustomDrawControl({ explorerState, setExplorerState }) {
  const map = useMap();
  const { t, isArabic } = useLanguage();
  const [startPoint, setStartPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);

  // For Polygon
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
    return () => {
      map.dragging.enable();
      map.getContainer().style.cursor = '';
    };
  }, [explorerState?.drawingTool, map]);

  const finishDrawing = (type, bounds, center, radius, poly) => {
    // Generate mock results for the drawn area
    const mockResults = [
      { id: Date.now() + 1, name: isArabic ? 'حرم جامعة زايد' : 'Zayed University Campus', type: 'EDUCATION', location: isArabic ? 'منطقة مخصصة' : 'Custom Area', lat: center.lat + 0.002, lng: center.lng + 0.002 },
      { id: Date.now() + 2, name: isArabic ? 'مستشفى المنطقة العام' : 'Area General Hospital', type: 'HOSPITAL', location: isArabic ? 'منطقة مخصصة' : 'Custom Area', lat: center.lat - 0.001, lng: center.lng + 0.003 },
      { id: Date.now() + 3, name: 'Community Central Park', name_ar: 'الحديقة المركزية المجتمعية', type: 'PARK', location: isArabic ? 'منطقة مخصصة' : 'Custom Area', lat: center.lat + 0.003, lng: center.lng - 0.002 },
      { id: Date.now() + 4, name: isArabic ? 'مركز عبور المترو' : 'Metro Transit Hub', type: 'TRANSPORT', location: isArabic ? 'منطقة مخصصة' : 'Custom Area', lat: center.lat - 0.002, lng: center.lng - 0.001 }
    ];

    const chartData = {
      id: Date.now() + 'chart',
      title: isArabic ? 'توزيع البنية التحتية في المنطقة المحددة' : 'Infrastructure Distribution in Selected Area',
      type: 'doughnut',
      data: [
        { label: isArabic ? 'تعليم' : 'Education', name: isArabic ? 'تعليم' : 'Education', value: 25, color: '#4facfe' },
        { label: isArabic ? 'رعاية صحية' : 'Healthcare', name: isArabic ? 'رعاية صحية' : 'Healthcare', value: 15, color: '#f093fb' },
        { label: isArabic ? 'حدائق' : 'Parks', name: isArabic ? 'حدائق' : 'Parks', value: 40, color: '#43e97b' },
        { label: isArabic ? 'نقل' : 'Transport', name: isArabic ? 'نقل' : 'Transport', value: 20, color: '#fa709a' }
      ]
    };

    if (bounds) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    else map.setView(center, 16);

    setExplorerState(prev => ({
      ...prev,
      drawnPolygon: type === 'polygon' ? poly : null,
      drawnCircle: type === 'circle' ? { center: [center.lat, center.lng], radius } : null,
      drawnRectangle: type === 'rectangle' ? [
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
      ] : null,
      drawingTool: null,
      isDrawingMode: false,
      isDockerMinimized: false,
      aiPanelState: 'expanded', // Auto-expand the AI panel to show results
      activeResults: mockResults,
      chatHistory: [
        ...(prev.chatHistory || []),
        { 
          id: Date.now(), 
          role: 'user', 
          content: isArabic ? `تم تحديد منطقة مخصصة على الخريطة.` : `Selected a custom area on the map.` 
        },
        { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: isArabic ? `لقد قمت بتحليل المنطقة المخصصة التي رسمتها. إليك توزيع البنية التحتية داخل هذه المنطقة:\n\n**إجمالي المرافق:** ${mockResults.length}\n**الاستخدام الرئيسي للأراضي:** الحدائق والبيئة\n\nلقد قمت بتثبيت المرافق المحددة على الخريطة من أجلك.` : `I have analyzed the custom area you drew. Here is the infrastructure distribution within this zone:\n\n**Total Facilities Found:** ${mockResults.length}\n**Primary Land Use:** Parks & Environment\n\nI have pinned the specific facilities to the map for you.`,
          results: mockResults,
          suggestions: isArabic ? [
            "عرض البيانات الديموغرافية لهذه المنطقة",
            "ما هو متوسط قيمة العقار هنا؟",
            "هل هناك مشاريع بناء قادمة؟",
            "تصدير تقرير هذه المنطقة إلى PDF"
          ] : [
            "Show demographic data for this area",
            "What is the average property value here?",
            "Are there upcoming construction projects?",
            "Export this area report to PDF"
          ],
          chartData: chartData
        }
      ]
    }));
    
    setStartPoint(null);
    setCurrentPoint(null);
    setPolyPoints([]);
  };

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
    },
    mouseup(e) {
      if (explorerState?.drawingTool === 'rectangle' && startPoint && currentPoint) {
        const bounds = L.latLngBounds(startPoint, currentPoint);
        // Only finish if the box is actually drawn (not just a click)
        if (bounds.getNorthEast().distanceTo(bounds.getSouthWest()) > 10) {
          finishDrawing('rectangle', bounds, bounds.getCenter(), null, null);
        } else {
          setStartPoint(null);
          setCurrentPoint(null);
        }
      } else if (explorerState?.drawingTool === 'circle' && startPoint && currentPoint) {
        const radius = startPoint.distanceTo(currentPoint);
        if (radius > 10) {
          const r = radius;
          const dLat = r / 111320;
          const dLng = r / (111320 * Math.cos(startPoint.lat * (Math.PI / 180)));
          const bounds = L.latLngBounds(
            [startPoint.lat - dLat, startPoint.lng - dLng],
            [startPoint.lat + dLat, startPoint.lng + dLng]
          );
          finishDrawing('circle', bounds, startPoint, radius, null);
        } else {
          setStartPoint(null);
          setCurrentPoint(null);
        }
      }
    },
    dblclick(e) {
      if (explorerState?.drawingTool === 'polygon' && polyPoints.length > 2) {
        const poly = polyPoints.map(p => [p.lat, p.lng]);
        const bounds = L.latLngBounds(polyPoints);
        finishDrawing('polygon', bounds, bounds.getCenter(), null, poly);
      }
    }
  });

  if (explorerState?.drawingTool === 'rectangle' && startPoint && currentPoint) {
    const bounds = L.latLngBounds(startPoint, currentPoint);
    return <Rectangle bounds={bounds} pathOptions={{ color: '#4370f0', weight: 2, dashArray: '5, 5', fillColor: '#4370f0', fillOpacity: 0.2 }} />;
  }

  if (explorerState?.drawingTool === 'circle' && startPoint && currentPoint) {
    const radius = startPoint.distanceTo(currentPoint);
    return <Circle center={startPoint} radius={radius} pathOptions={{ color: '#4370f0', weight: 2, dashArray: '5, 5', fillColor: '#4370f0', fillOpacity: 0.2 }} />;
  }
  
  if (explorerState?.drawingTool === 'polygon' && polyPoints.length > 0) {
    const positions = [...polyPoints.map(p => [p.lat, p.lng])];
    if (mousePos) positions.push([mousePos.lat, mousePos.lng]);
    return <Polygon positions={positions} pathOptions={{ color: '#4370f0', weight: 2, dashArray: '5, 5', fillColor: '#4370f0', fillOpacity: 0.2 }} />;
  }

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
        <MapController explorerState={explorerState} setExplorerState={setExplorerState} isExplorer={isExplorer} />
        
        {isExplorer && (
          <CustomDrawControl explorerState={explorerState} setExplorerState={setExplorerState} />
        )}
        
        <TileLayer
          key={explorerState?.basemap || 'osm'}
          url={
            !isExplorer ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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
                    // Temporarily disabled as per request: no Marker Interaction needed
                    // setExplorerState(prev => ({ ...prev, selectedDetail: item, mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 } }));
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

        {/* Draw Rectangle visualization */}
        {explorerState?.drawnRectangle && (
          <Rectangle bounds={explorerState.drawnRectangle} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />
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

      {/* Floating Clear Shape Button */}
      {(explorerState?.drawnPolygon || explorerState?.drawnCircle || explorerState?.drawnRectangle) && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={() => setExplorerState(prev => ({ ...prev, drawnPolygon: null, drawnCircle: null, drawnRectangle: null, activeResults: [] }))}
          className="absolute top-[88px] left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200 px-5 py-2.5 rounded-full flex items-center gap-2 text-slate-600 hover:text-red-600 hover:bg-white transition-all font-bold tracking-tight text-[13px]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Clear Shape
        </motion.button>
      )}
      
      {/* Subtle overlay just to soften the map slightly, replacing the heavy white wash */}
      {!isExplorer && <div className="absolute inset-0 bg-slate-50/30 pointer-events-none z-[400]" />}
    </motion.div>
  );
}
