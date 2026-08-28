// Real GIS Spatial Geometry & Analysis Service for GeoVision / SmartMap
import floodRiskZonesData from '../../data/floodRiskZonesData.json';
import waterStressZonesData from '../../data/waterStressZonesData.json';

/**
 * Validate coordinates and CRS (WGS84 EPSG:4326)
 */
export function validateWgs84Coordinates(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Calculate Haversine distance between two spatial coordinates in kilometers
 * CRS: WGS84 EPSG:4326 (Geodesic distance calculation)
 */
export function calculateHaversineDistanceKm(lat1, lng1, lat2, lng2) {
  if (!validateWgs84Coordinates(lat1, lng1) || !validateWgs84Coordinates(lat2, lng2)) return 0;
  
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Ray-casting Point-in-Polygon test on WGS84 GeoJSON polygon coordinates
 * Polygon coords format: [[lng, lat], [lng, lat], ...]
 */
export function isPointInGeoJsonPolygon(lat, lng, polygonCoordinates) {
  if (!polygonCoordinates || polygonCoordinates.length < 3) return false;
  let inside = false;
  
  for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
    const xi = polygonCoordinates[i][1], yi = polygonCoordinates[i][0];
    const xj = polygonCoordinates[j][1], yj = polygonCoordinates[j][0];

    const intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Check if a facility point intersects a GeoJSON FeatureCollection of hazard polygons
 */
export function checkSpatialPolygonIntersection(facilityPoint, featureCollection) {
  if (!facilityPoint || !featureCollection || !featureCollection.features) return false;
  const { lat, lng } = facilityPoint;
  if (!validateWgs84Coordinates(lat, lng)) return false;

  for (const feature of featureCollection.features) {
    if (feature.geometry && feature.geometry.type === 'Polygon') {
      const ring = feature.geometry.coordinates[0]; // Exterior ring
      if (isPointInGeoJsonPolygon(lat, lng, ring)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Evaluate true geometry-based spatial intersections for flood risk and water stress zones
 */
export function evaluatePointInPolygonIntersections(facilityPoint) {
  const intersectsFlood = checkSpatialPolygonIntersection(facilityPoint, floodRiskZonesData);
  const intersectsWater = checkSpatialPolygonIntersection(facilityPoint, waterStressZonesData);

  return {
    intersectsFloodZone: intersectsFlood,
    intersectsWaterStressZone: intersectsWater,
    isCompoundIntersect: intersectsFlood && intersectsWater,
    crs: 'WGS84 EPSG:4326',
    analysisMethod: 'POINT_IN_POLYGON'
  };
}

/**
 * Find nearest N neighbors with geodesic Haversine distance
 */
export function findNearestNeighbors(targetPoint, locations, limit = 3) {
  if (!targetPoint || !locations || locations.length === 0) return [];
  
  return [...locations]
    .filter(loc => loc.id !== targetPoint.id && loc.country === targetPoint.country)
    .map(loc => ({
      ...loc,
      distanceKm: calculateHaversineDistanceKm(targetPoint.lat, targetPoint.lng, loc.lat, loc.lng)
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
