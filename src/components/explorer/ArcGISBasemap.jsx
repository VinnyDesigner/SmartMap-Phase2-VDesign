import React, { useEffect } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { dynamicMapLayer, tiledMapLayer } from 'esri-leaflet';

export const BASEMAPS = {
  ABU_DHABI_DGE: {
    id: "abu-dhabi-dge",
    name: "Abu Dhabi Official DGE Color Basemap",
    type: "ARCGIS_SERVER",
    serviceUrl: "https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer",
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

function EsriMapServerLayer({ url, attribution }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !url) return;

    let layer;
    try {
      // DGE_Color_Basemap_GCS is a GCS EPSG:4326 MapServer endpoint.
      // Set updateInterval: 0 for instant trigger & transparent: true for crisp overlay blending
      layer = dynamicMapLayer({
        url,
        attribution,
        format: 'png32',
        transparent: true,
        useCors: false,
        updateInterval: 0,
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
        } catch (_) {}
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
        {/* Instant crisp base tile layer ensuring zero blur during pan/zoom */}
        <TileLayer
          key="base-crisp-tile-layer"
          url={BASEMAPS.STREETS.url}
          maxZoom={19}
          minZoom={3}
          opacity={0.4}
        />
        <EsriMapServerLayer
          key={`esri-server-${currentBasemap.id}`}
          url={currentBasemap.serviceUrl}
          attribution='&copy; Abu Dhabi Spatial Data Infrastructure (SDI / DGE)'
        />
      </>
    );
  }

  return (
    <TileLayer
      key={`basemap-layer-${currentBasemap.id}`}
      url={currentBasemap.url}
      maxZoom={19}
      minZoom={3}
      attribution='&copy; Esri, ArcGIS Online'
    />
  );
}




