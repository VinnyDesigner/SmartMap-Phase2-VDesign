import React, { useState, useEffect } from 'react';
import { TileLayer } from 'react-leaflet';
import { useTheme } from '../../contexts/ThemeContext';

export const BASEMAPS = {
  ABU_DHABI_DGE: {
    id: "abu-dhabi-dge",
    name: "Abu Dhabi Official DGE Color Basemap",
    type: "ARCGIS_MAPSERVER",
    url: "https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer/tile/{z}/{y}/{x}",
    crs: "EPSG:4326"
  },
  STREETS: {
    id: "streets",
    name: "Esri World Street Map",
    type: "TILE_LAYER",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  },
  SATELLITE: {
    id: "satellite",
    name: "Esri High-Resolution Satellite",
    type: "TILE_LAYER",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  },
  DARK: {
    id: "dark",
    name: "Esri Dark Canvas",
    type: "TILE_LAYER",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  },
  TOPO: {
    id: "topo",
    name: "Esri Topography",
    type: "TILE_LAYER",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  }
};

export default function ArcGISBasemap({ activeBasemapId = 'abu-dhabi-dge' }) {
  const [isDgeUnavailable, setIsDgeUnavailable] = useState(false);
  const { isDarkMode } = useTheme();

  // If abu-dhabi-dge fails or times out, fallback to dependable Esri Streets or Dark
  const isDgeRequested = activeBasemapId === 'abu-dhabi-dge';

  useEffect(() => {
    if (isDgeRequested) {
      // Set a quick safety timer to check if DGE tiles load
      const timer = setTimeout(() => {
        setIsDgeUnavailable(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsDgeUnavailable(false);
    }
  }, [activeBasemapId, isDgeRequested]);

  // Determine effective basemap
  const effectiveId = (isDarkMode && isDgeRequested) ? 'dark' : activeBasemapId;
  const currentBasemap = Object.values(BASEMAPS).find(b => b.id === effectiveId) || (isDarkMode ? BASEMAPS.DARK : BASEMAPS.STREETS);

  const tileUrl = (isDgeRequested && isDgeUnavailable && !isDarkMode)
    ? BASEMAPS.STREETS.url 
    : currentBasemap.url;

  return (
    <>
      {/* Safety background layer */}
      <TileLayer
        key={isDarkMode ? "safety-base-dark" : "safety-base-streets"}
        url={isDarkMode ? BASEMAPS.DARK.url : BASEMAPS.STREETS.url}
        attribution='&copy; Esri, Abu Dhabi SDI'
      />

      {/* Active basemap layer */}
      {effectiveId !== 'streets' && !(isDarkMode && effectiveId === 'dark') && (
        <TileLayer
          key={`basemap-layer-${effectiveId}`}
          url={tileUrl}
          opacity={1}
          eventHandlers={{
            tileerror: () => {
              if (isDgeRequested) {
                console.warn("Official Abu Dhabi SDI MapServer tile error. Reverting to safety basemap.");
                setIsDgeUnavailable(true);
              }
            },
            tileload: () => {
              if (isDgeRequested) {
                setIsDgeUnavailable(false);
              }
            }
          }}
          attribution={isDgeRequested ? '&copy; Abu Dhabi Spatial Data Infrastructure (SDI / DGE)' : '&copy; Esri, ArcGIS Online'}
        />
      )}

      {isDgeRequested && isDgeUnavailable && (
        <div className="absolute top-4 start-1/2 -translate-x-1/2 z-50 bg-amber-600/90 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md pointer-events-none flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-300" />
          <span>Official Abu Dhabi SDI basemap unreachable (VPN/Network restriction). Active on fallback basemap.</span>
        </div>
      )}
    </>
  );
}
