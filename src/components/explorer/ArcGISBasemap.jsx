import React from 'react';
import { TileLayer } from 'react-leaflet';

export const BASEMAPS = {
  ABU_DHABI_DGE: {
    id: "abu-dhabi-dge",
    name: "Abu Dhabi Official DGE Color Basemap",
    type: "TILE_LAYER",
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
  const currentBasemap = Object.values(BASEMAPS).find(b => b.id === activeBasemapId) || BASEMAPS.ABU_DHABI_DGE;

  return (
    <TileLayer
      key={`basemap-layer-${currentBasemap.id}`}
      url={currentBasemap.url}
      maxZoom={19}
      minZoom={5}
      attribution='&copy; Abu Dhabi Spatial Data Infrastructure (SDI / DGE)'
    />
  );
}



