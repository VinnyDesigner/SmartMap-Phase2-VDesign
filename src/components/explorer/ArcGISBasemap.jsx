import React, { useEffect } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { dynamicMapLayer } from 'esri-leaflet';

export const BASEMAPS = {
  ABU_DHABI_DGE: {
    id: "abu-dhabi-dge",
    name: "Abu Dhabi Official DGE Color Basemap",
    type: "ARCGIS_SERVER",
    serviceUrl: "https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer",
    baseTileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    subTileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
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
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
  },
  DARK: {
    id: "dark",
    name: "Esri Dark Canvas",
    type: "TILE_LAYER",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    subUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
  },
  TOPO: {
    id: "topo",
    name: "Esri Topography",
    type: "TILE_LAYER",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  }
};

// Background preloader for Abu Dhabi DGE tiles & initial MapServer extent
function preloadDgeBasemap() {
  if (typeof window === 'undefined') return;

  const preloadUrls = [
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/13/3516/5053",
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/13/3516/5054",
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/13/3517/5053",
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/13/3517/5054",
    "https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer/export?bbox=54.2,24.3,54.6,24.6&size=1024,768&format=png32&transparent=true&f=image"
  ];

  preloadUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Trigger background preloading immediately on module load
preloadDgeBasemap();

function EsriMapServerLayer({ url, attribution }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !url) return;

    let layer;
    try {
      // DGE_Color_Basemap_GCS MapServer endpoint with high performance buffer caching
      layer = dynamicMapLayer({
        url,
        attribution,
        format: 'png32',
        transparent: true,
        useCors: false,
        updateInterval: 150,
        keepBuffer: 6,
        f: 'image'
      });
      layer.addTo(map);
    } catch (err) {
      console.warn("Esri Leaflet dynamicMapLayer notice:", err);
    }

    return () => {
      if (layer && map) {
        try {
          map.removeLayer(layer);
        } catch {}
      }
    };
  }, [map, url, attribution]);

  return null;
}

export default function ArcGISBasemap({ activeBasemapId = 'abu-dhabi-dge' }) {
  const currentBasemap = Object.values(BASEMAPS).find(b => b.id === activeBasemapId) || BASEMAPS.ABU_DHABI_DGE;

  if (currentBasemap.type === "ARCGIS_SERVER") {
    return (
      <>
        {/* Instant Tile Base ensuring ZERO wait time / blank canvas for DGE */}
        {currentBasemap.baseTileUrl && (
          <TileLayer
            key="dge-instant-base-tile-layer"
            url={currentBasemap.baseTileUrl}
            maxZoom={19}
            minZoom={3}
            opacity={1.0}
          />
        )}
        {currentBasemap.subTileUrl && (
          <TileLayer
            key="dge-instant-sub-tile-layer"
            url={currentBasemap.subTileUrl}
            maxZoom={19}
            minZoom={3}
            opacity={0.85}
          />
        )}

        {/* Dynamic DGE MapServer Layer overlaying smoothly on top */}
        <EsriMapServerLayer
          key={`esri-server-${currentBasemap.id}`}
          url={currentBasemap.serviceUrl}
          attribution='&copy; Abu Dhabi Spatial Data Infrastructure (AD-SDI / DGE)'
        />
      </>
    );
  }

  return (
    <>
      <TileLayer
        key={`basemap-base-${currentBasemap.id}`}
        url={currentBasemap.url}
        maxZoom={19}
        minZoom={3}
        attribution='&copy; Esri, ArcGIS Online'
      />
      {currentBasemap.subUrl && (
        <TileLayer
          key={`basemap-sub-${currentBasemap.id}`}
          url={currentBasemap.subUrl}
          maxZoom={19}
          minZoom={3}
          opacity={0.9}
        />
      )}
    </>
  );
}
