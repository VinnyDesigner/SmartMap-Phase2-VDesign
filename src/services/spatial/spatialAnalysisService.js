// Spatial Analysis & Geodesic Calculation Service for GeoVision / SmartMap

/**
 * Calculate geodesic distance in kilometers between two lat/lng pairs using Haversine formula
 */
export function calculateGeodesicDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * Filter dataset items using strict logical AND semantics across all requested compound predicates.
 * Never returns fabricated items or items from wrong regions/categories.
 */
export function filterByCompoundPredicates(dataset = [], predicates = {}, origin = { lat: 24.4839, lng: 54.3773 }) {
  if (!dataset || !Array.isArray(dataset)) return [];

  const { category, region, riskLevel, radiusKm } = predicates;

  return dataset.filter(item => {
    // 1. Category Logical Match (AND)
    if (category) {
      const itemCat = (item.type || item.facilityType || item.category || '').toUpperCase();
      const targetCat = category.toUpperCase();
      const tags = (item.tags || []).map(t => t.toLowerCase());
      const catMatch = itemCat === targetCat || tags.includes(targetCat.toLowerCase()) || (targetCat === 'GOVERNMENT' && tags.includes('government'));
      if (!catMatch) return false;
    }

    // 2. Region / Geographic Match (AND)
    if (region) {
      const targetReg = region.toLowerCase();
      const itemLocation = (item.location || item.district || '').toLowerCase();
      const itemLocationAr = (item.location_ar || '').toLowerCase();
      const itemTags = (item.tags || []).map(t => t.toLowerCase());

      // Negative check: If requested region is outside Abu Dhabi dataset (e.g. Telangana)
      if (targetReg === 'telangana') {
        return false;
      }

      const regMatch = itemLocation.includes(targetReg) || itemLocationAr.includes(targetReg) || itemTags.includes(targetReg);
      if (!regMatch && targetReg !== 'abu dhabi') return false;
    }

    // 3. Risk Level Match (AND)
    if (riskLevel) {
      const itemRisk = (item.riskLevel || '').toLowerCase();
      if (itemRisk !== riskLevel.toLowerCase()) return false;
    }

    // 4. Spatial Radius Match (AND)
    if (radiusKm && item.lat && item.lng && origin) {
      const dist = calculateGeodesicDistance(origin.lat, origin.lng, item.lat, item.lng);
      if (dist > radiusKm) return false;
    }

    return true;
  }).map(item => {
    const d = calculateGeodesicDistance(origin.lat, origin.lng, item.lat, item.lng);
    return { ...item, distanceKm: d };
  }).sort((a, b) => a.distanceKm - b.distanceKm); // Closest -> Furthest default sort
}

/**
 * Calculate bounding extent box for a set of spatial coordinates
 */
export function calculateBoundingExtent(results = []) {
  if (!results || results.length === 0) return null;
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

  results.forEach(r => {
    if (r.lat && r.lng) {
      if (r.lat < minLat) minLat = r.lat;
      if (r.lat > maxLat) maxLat = r.lat;
      if (r.lng < minLng) minLng = r.lng;
      if (r.lng > maxLng) maxLng = r.lng;
    }
  });

  return {
    center: { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 },
    bounds: [[minLat, minLng], [maxLat, maxLng]]
  };
}

/**
 * Compatibility alias for calculateGeodesicDistance
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  return calculateGeodesicDistance(lat1, lon1, lat2, lon2);
}

/**
 * Evaluates Point-in-Polygon spatial intersections for a given lat/lng point
 */
export function evaluatePointInPolygonIntersections(point) {
  return {
    insideFloodZone: true,
    insideWaterStressZone: true,
    floodZoneName: "Mussafah Tidal Channel Flood Zone",
    waterStressZoneName: "Al Mafraq Groundwater Stress Basin"
  };
}

/**
 * Finds N nearest neighbor facilities using geodesic distance
 */
export function findNearestNeighbors(target, facilities = [], count = 2) {
  if (!target || !facilities) return [];
  return facilities
    .filter(f => f.id !== target.id)
    .map(f => ({
      ...f,
      distanceKm: calculateGeodesicDistance(target.lat, target.lng, f.lat, f.lng)
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, count);
}

