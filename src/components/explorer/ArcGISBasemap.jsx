import React, { useEffect } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { dynamicMapLayer } from 'esri-leaflet';

export const BASEMAPS = {
  ABU_DHABI_DGE: {
    id: "abu-dhabi-dge",
    name: "Abu Dhabi Official DGE Color Basemap",
    type: "TILE_LAYER",
    url: "https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_WM/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Abu Dhabi Spatial Data Infrastructure (AD-SDI / DGE)"
  },
  ESRI_VECTOR: {
    id: "esri-vector",
    name: "Esri Vector Basemap",
    type: "TILE_LAYER",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
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

function EsriMapServerLayer({ url, attribution }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !url) return;

    let layer;
    try {
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
      <EsriMapServerLayer
        key={`esri-server-${currentBasemap.id}`}
        url={currentBasemap.serviceUrl}
        attribution='&copy; Abu Dhabi Spatial Data Infrastructure (AD-SDI / DGE)'
      />
    );
  }

  return (
    <>
      <TileLayer
        key={`basemap-base-${currentBasemap.id}`}
        url={currentBasemap.url}
        maxZoom={19}
        minZoom={3}
        keepBuffer={8}
        updateInterval={100}
        attribution={currentBasemap.attribution || '&copy; Esri, ArcGIS Online'}
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
