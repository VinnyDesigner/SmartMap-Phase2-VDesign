import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents, Polygon, Circle, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import { motion, useTransform, useSpring } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ArcGISBasemap from './explorer/ArcGISBasemap';

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
  
  // ResizeObserver automatically calls map.invalidateSize() whenever container element resizes
  useEffect(() => {
    if (!map) return;

    map.invalidateSize();

    const container = map.getContainer();
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
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
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
    }
  }, [isExplorer, explorerState?.isDrawingMode, explorerState?.drawingTool, explorerState?.resizeTrigger, map]);

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
    const newDrawing = {
      id: Date.now(),
      type,
      bounds: bounds ? [
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
      ] : null,
      center: center ? [center.lat, center.lng] : null,
      radius,
      poly
    };

    // Generate results for the drawn area
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

    setExplorerState(prev => {
      const existingDrawings = prev.drawings || [];
      const updatedDrawings = [...existingDrawings, newDrawing];

      return {
        ...prev,
        drawings: updatedDrawings,
        drawnPolygon: type === 'polygon' ? poly : prev.drawnPolygon,
        drawnCircle: type === 'circle' ? { center: [center.lat, center.lng], radius } : prev.drawnCircle,
        drawnRectangle: type === 'rectangle' ? [
          [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
          [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
        ] : prev.drawnRectangle,
        drawingTool: null,
        isDrawingMode: false,
        isDockerMinimized: false,
        aiPanelState: 'expanded',
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
              "Show only hospitals in this drawn AOI",
              "Show schools inside drawn boundary",
              "Create 2 km buffer around drawn zone",
              "Analyze drawn Circle Buffer (1.0 km radius)"
            ] : [
              "Show only hospitals in this drawn AOI",
              "Show schools inside drawn boundary",
              "Create 2 km buffer around drawn zone",
              "Analyze drawn Circle Buffer (1.0 km radius)"
            ],
            chartData: chartData
          }
        ]
      };
    });
    
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
  const { t, isArabic } = useLanguage();
  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);
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
        width: '100%',
        height: '100%',
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
        
        <ArcGISBasemap activeBasemapId={explorerState?.activeBasemap || explorerState?.basemap || 'abu-dhabi-dge'} />
        
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
                    setExplorerState(prev => ({
                      ...prev,
                      selectedDetail: null,
                      selectedLocation: item,
                      mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 }
                    }));
                  }
                }}
              >
                <Popup minWidth={270} maxWidth={310} className="custom-facility-popup">
                  <div className="p-1.5 font-sans space-y-2.5">
                    {/* 1. Header & Risk Level Badge */}
                    <div className="flex items-start justify-between gap-2 border-b pb-2 border-slate-200/80">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          item.riskLevel === 'Critical' 
                            ? 'bg-rose-100 text-rose-700' 
                            : item.riskLevel === 'High' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-blue-100 text-[#215A9E]'
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-[#1e2749] leading-tight truncate">
                            {isArabic && item.name_ar ? item.name_ar : item.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
                            {isArabic && item.location_ar ? item.location_ar : (item.location || item.district || 'Abu Dhabi Sector')}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-extrabold shrink-0 border ${
                        item.riskLevel === 'Critical' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : item.riskLevel === 'High' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {isArabic 
                          ? (item.riskLevel === 'Critical' ? 'حرج' : item.riskLevel === 'High' ? 'عالي' : 'منخفض') 
                          : (item.riskLevel || 'Normal')} ({item.riskScore || 25})
                      </span>
                    </div>

                    {/* 2. Metadata Grid (Category, Coordinates, Layer Source) */}
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/80 text-[10px]">
                      <div>
                        <span className="text-slate-400 font-medium block">{isArabic ? "الفئة:" : "Category:"}</span>
                        <strong className="text-slate-700 font-bold">{item.type || 'FACILITY'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">{isArabic ? "الإحداثيات:" : "Coordinates:"}</span>
                        <strong className="text-slate-700 font-mono font-bold">{item.lat?.toFixed(3)}°, {item.lng?.toFixed(3)}°</strong>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[9.5px]">
                        <span className="text-slate-400">{isArabic ? "المصدر المكاني:" : "SDI Layer:"}</span>
                        <span className="font-bold text-[#215A9E]">DGE Spatial SDI 2026</span>
                      </div>
                    </div>

                    {/* 3. Operational Metrics Mini KPIs */}
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <div className="p-1.5 rounded-lg bg-purple-50/80 border border-purple-200/60">
                        <span className="text-[9px] text-purple-600 font-semibold block">{isArabic ? "السعة" : "Capacity"}</span>
                        <strong className="text-[11px] font-extrabold text-purple-900">{item.capacity || (item.type === 'HOSPITAL' ? '350 beds' : item.type === 'PARK' ? '12k visitors' : '450 units')}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-blue-50/80 border border-blue-200/60">
                        <span className="text-[9px] text-blue-600 font-semibold block">{isArabic ? "المياه" : "Water"}</span>
                        <strong className="text-[11px] font-extrabold text-blue-900">{item.waterConsumption ? `${(item.waterConsumption / 1000).toFixed(1)}k m³` : '9.4k m³'}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-amber-50/80 border border-amber-200/60">
                        <span className="text-[9px] text-amber-600 font-semibold block">{isArabic ? "الانبعاثات" : "Emissions"}</span>
                        <strong className="text-[11px] font-extrabold text-amber-900">{item.emissionsIndex ? `${(item.emissionsIndex / 1000).toFixed(1)}k tCO₂` : '22k tCO₂'}</strong>
                      </div>
                    </div>

                    {/* 4. Action Buttons */}
                    <div className="space-y-1.5 pt-1">
                      {isLoggedIn ? (
                        <button
                          type="button"
                          onClick={() => {
                            setExplorerState(prev => ({
                              ...prev,
                              selectedDetail: item,
                              selectedLocation: item
                            }));
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 text-white text-[10.5px] font-bold hover:bg-[#215A9E] transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>{isArabic ? "عرض الملف المكاني الكامل" : "View Full Spatial Profile"}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setExplorerState(prev => ({
                              ...prev,
                              showAuthPrompt: true,
                              pendingAuthFeature: isArabic ? 'الملف المكاني الكامل' : 'Full Spatial Profile'
                            }));
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-[#162035] text-slate-500 dark:text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all group"
                        >
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-500" />
                            <span>{isArabic ? "الملف المكاني الكامل" : "View Full Spatial Profile"}</span>
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                            {isArabic ? "مستخدم مسجل فقط" : "Registered User Only"}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const followQuery = isArabic 
                            ? `اعرض المدارس القريبة من ${item.name_ar || item.name}` 
                            : `Show schools within 2 km of ${item.name}`;
                          setExplorerState(prev => ({
                            ...prev,
                            pendingQuery: followQuery
                          }));
                        }}
                        className="w-full p-2 rounded-xl bg-[#eef3ff] border border-[#215A9E]/30 text-[10.5px] font-bold text-[#215A9E] hover:bg-[#215A9E] hover:text-white transition-all flex items-center justify-between gap-1.5 text-start cursor-pointer shadow-2xs group"
                      >
                        <span className="leading-snug truncate">
                          ✨ {isArabic ? `اعرض المدارس القريبة من ${item.name_ar || item.name}` : `Show schools within 2 km of ${item.name}`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform rtl:-scale-x-100" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))
        }

        {/* Render All Active Drawn Shapes */}
        {(explorerState?.drawings || []).map((shape) => {
          if (shape.type === 'polygon' && shape.poly) {
            return <Polygon key={shape.id} positions={shape.poly} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />;
          }
          if (shape.type === 'rectangle' && shape.bounds) {
            return <Rectangle key={shape.id} bounds={shape.bounds} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />;
          }
          if (shape.type === 'circle' && shape.center) {
            return <Circle key={shape.id} center={shape.center} radius={shape.radius} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />;
          }
          return null;
        })}

        {/* Draw Single Shape Visualizations Fallback */}
        {(!explorerState?.drawings || explorerState.drawings.length === 0) && explorerState?.drawnPolygon && (
          <Polygon positions={explorerState.drawnPolygon} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />
        )}
        {(!explorerState?.drawings || explorerState.drawings.length === 0) && explorerState?.drawnRectangle && (
          <Rectangle bounds={explorerState.drawnRectangle} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />
        )}
        {(!explorerState?.drawings || explorerState.drawings.length === 0) && explorerState?.drawnCircle && (
          <Circle center={explorerState.drawnCircle.center} radius={explorerState.drawnCircle.radius} pathOptions={{ color: '#4370f0', weight: 2, fillColor: '#4370f0', fillOpacity: 0.2 }} />
        )}

        {/* Proximity 5 km Circle Overlay */}
        {(explorerState?.activeContext?.radius === '5 km' || explorerState?.activeContextTags?.some(t => t.id === 'radius' && t.label?.includes('5 km'))) && (
          <Circle 
            center={[24.4839, 54.3773]} 
            radius={5000} 
            pathOptions={{ color: '#7c3aed', weight: 2.5, fillColor: '#7c3aed', fillOpacity: 0.15, dashArray: '6, 6' }} 
          />
        )}

        {/* Cross-Layer 2 km Spatial Buffer Circle Overlay */}
        {(explorerState?.activeContext?.radius === '2 km' || explorerState?.activeContextTags?.some(t => t.id === 'radius' && t.label?.includes('2 km'))) && (
          <Circle 
            center={[24.4136, 54.5683]} 
            radius={2000} 
            pathOptions={{ color: '#00e5ff', weight: 2.5, fillColor: '#00e5ff', fillOpacity: 0.18, dashArray: '4, 4' }} 
          />
        )}

        {/* Event Handler */}
        <MapEventHandler onMapClick={onMapClick} />
        
        {/* Render marker if a location is selected */}
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

      {/* Floating Clear Shape Button */}
      {((explorerState?.drawings && explorerState.drawings.length > 0) || explorerState?.drawnPolygon || explorerState?.drawnCircle || explorerState?.drawnRectangle) && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={() => setExplorerState(prev => ({ ...prev, drawings: [], drawnPolygon: null, drawnCircle: null, drawnRectangle: null, activeResults: [] }))}
          className="absolute top-[88px] left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200 px-5 py-2.5 rounded-full flex items-center gap-2 text-slate-600 hover:text-red-600 hover:bg-white transition-all font-bold tracking-tight text-[13px]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Clear Shape {explorerState?.drawings?.length > 1 ? `(${explorerState.drawings.length})` : ''}
        </motion.button>
      )}
      
      {/* Subtle overlay just to soften the map slightly, replacing the heavy white wash */}
      {!isExplorer && <div className="absolute inset-0 bg-slate-50/30 pointer-events-none z-[400]" />}
    </motion.div>
  );
}
