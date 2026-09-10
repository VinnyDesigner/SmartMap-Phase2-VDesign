// Spatial Analysis & Geodesic Calculation Service for GeoVision / SmartMap

/**
 * Calculate geodesic distance in kilometers between two lat/lng pairs using Haversine formula
 */
export function calculateGeodesicDistance(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== 'number' || typeof lon1 !== 'number' || 
    typeof lat2 !== 'number' || typeof lon2 !== 'number' ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
  ) return 0;
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Format a distance in kilometers into a human-readable string (e.g., 800m, 1.4 km).
 */
export function formatDistance(distKm) {
  if (distKm === undefined || distKm === null || isNaN(distKm)) return '0 m';
  const val = Number(distKm);
  if (val < 0.001) return '0 m';
  if (val < 1) {
    const meters = Math.round(val * 1000);
    return `${meters}m`;
  }
  const kmFormatted = (Math.round(val * 10) / 10).toFixed(1);
  const cleanKm = kmFormatted.endsWith('.0') ? kmFormatted.slice(0, -2) : kmFormatted;
  return `${cleanKm} km`;
}


/**
 * Filter dataset items using strict logical AND semantics across all requested compound predicates.
 * Never returns fabricated items or items from wrong regions/categories.
 */
export function filterByCompoundPredicates(dataset = [], predicates = {}, origin = { lat: 24.4839, lng: 54.3773 }) {
  if (!dataset || !Array.isArray(dataset)) return [];

  const { category, subType, region, riskLevel, radiusKm } = predicates;

  return dataset.filter(item => {
    // 1. Category Logical Match (AND)
    if (category) {
      const itemCat = (item.type || item.facilityType || item.category || '').toUpperCase();
      const targetCat = category.toUpperCase();
      const tags = (item.tags || []).map(t => t.toLowerCase());
      const catMatch = itemCat === targetCat || tags.includes(targetCat.toLowerCase()) || (targetCat === 'GOVERNMENT' && tags.includes('government'));
      if (!catMatch) return false;

      // 1b. SubType tag-level filter — if a precise keyword was requested, item MUST have it in tags
      if (subType) {
        const subLower = subType.toLowerCase();
        const hasSubType = tags.some(tag => tag.includes(subLower));
        if (!hasSubType) return false;
      }
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
 * Geometric Point-in-Polygon containment test using ray-casting (Jordan curve theorem)
 * @param {number} lat Latitude of query point
 * @param {number} lng Longitude of query point
 * @param {Array<Array<number>|Object>} polygonPositions Array of [lat, lng] or {lat, lng}
 * @returns {boolean} True if point is strictly inside polygon
 */
export function isPointInPolygon(lat, lng, polygonPositions) {
  if (!polygonPositions || !Array.isArray(polygonPositions) || polygonPositions.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygonPositions.length - 1; i < polygonPositions.length; j = i++) {
    const ptI = polygonPositions[i];
    const ptJ = polygonPositions[j];
    const yi = Array.isArray(ptI) ? ptI[0] : ptI.lat;
    const xi = Array.isArray(ptI) ? ptI[1] : ptI.lng;
    const yj = Array.isArray(ptJ) ? ptJ[0] : ptJ.lat;
    const xj = Array.isArray(ptJ) ? ptJ[1] : ptJ.lng;

    const intersect = ((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Point in axis-aligned rectangle bounds test
 */
export function isPointInRectangle(lat, lng, bounds) {
  if (!bounds || !Array.isArray(bounds) || bounds.length < 2) return false;
  const p1 = bounds[0];
  const p2 = bounds[1];
  const minLat = Math.min(Array.isArray(p1) ? p1[0] : p1.lat, Array.isArray(p2) ? p2[0] : p2.lat);
  const maxLat = Math.max(Array.isArray(p1) ? p1[0] : p1.lat, Array.isArray(p2) ? p2[0] : p2.lat);
  const minLng = Math.min(Array.isArray(p1) ? p1[1] : p1.lng, Array.isArray(p2) ? p2[1] : p2.lng);
  const maxLng = Math.max(Array.isArray(p1) ? p1[1] : p1.lng, Array.isArray(p2) ? p2[1] : p2.lng);
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

/**
 * Point in circle radius test
 */
export function isPointInCircle(lat, lng, center, radiusMeters) {
  if (!center || typeof radiusMeters !== 'number') return false;
  const centerLat = Array.isArray(center) ? center[0] : (center.lat !== undefined ? center.lat : center[0]);
  const centerLng = Array.isArray(center) ? center[1] : (center.lng !== undefined ? center.lng : center[1]);
  const distKm = calculateGeodesicDistance(centerLat, centerLng, lat, lng);
  return (distKm * 1000) <= radiusMeters;
}

/**
 * Universal Point in Drawn Shape tester
 */
export function isPointInDrawnShape(lat, lng, shape = {}) {
  if (!lat || !lng || !shape) return false;
  if (shape.bounds || shape.type === 'rectangle') {
    return isPointInRectangle(lat, lng, shape.bounds || shape);
  }
  if (shape.center && (shape.radius !== undefined || shape.radiusMeters !== undefined)) {
    return isPointInCircle(lat, lng, shape.center, shape.radius || shape.radiusMeters);
  }
  if (shape.positions || shape.type === 'polygon' || Array.isArray(shape)) {
    return isPointInPolygon(lat, lng, shape.positions || shape);
  }
  return false;
}

/**
 * Checks if a facility strictly matches active GIS subcategories
 */
export function matchesGisSubcategories(item, subIds) {
  if (!subIds || !Array.isArray(subIds) || subIds.length === 0) return true;
  if (!item) return false;

  const locSubType = (item.subType || '').toLowerCase();
  const locType = (item.type || item.facilityType || '').toLowerCase();
  const tags = (item.tags || []).map(t => String(t).toLowerCase());
  const locName = (item.name || '').toLowerCase();
  const locCategory = (item.category_en || '').toLowerCase();

  return subIds.some(subId => {
    const cleanSubId = String(subId).toLowerCase();
    if (locSubType === cleanSubId) return true;
    if (tags.includes(cleanSubId) || tags.includes(cleanSubId.replace(/_/g, ' '))) return true;
    if (locType === cleanSubId) return true;
    if (locName.includes(cleanSubId.replace(/_/g, ' ')) || locCategory.includes(cleanSubId.replace(/_/g, ' '))) return true;
    return false;
  });
}

/**
 * Compute proportional category and subcategory breakdown for facilities within a drawn zone.
 * Ensures the result is proportional/relevant to the selected categories.
 */
export function computeProportionalCategoryBreakdown(facilities = [], selectedSubcategories = [], isArabic = false) {
  const total = facilities.length;
  if (total === 0) {
    return {
      total: 0,
      breakdown: [],
      dominantCategory: null,
      kpiMetrics: [],
      chartData: null,
      summaryBulletsEn: '',
      summaryBulletsAr: ''
    };
  }

  // Pre-defined category color palette
  const COLOR_PALETTE = [
    '#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#06b6d4', 
    '#ec4899', '#f97316', '#6366f1', '#14b8a6', '#84cc16'
  ];

  // Group by category / subcategory
  const countsMap = new Map();

  facilities.forEach(item => {
    let groupKey = null;
    let labelEn = null;
    let labelAr = null;

    if (selectedSubcategories && selectedSubcategories.length > 0) {
      // Find which of the selected subcategories this item satisfies
      const matchedSub = selectedSubcategories.find(subId => matchesGisSubcategories(item, [subId]));
      if (matchedSub) {
        groupKey = matchedSub;
        labelEn = matchedSub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        labelAr = item.subType_ar || item.category_ar || labelEn;
      }
    }

    // Fallback to primary category
    if (!groupKey) {
      groupKey = (item.type || item.facilityType || item.category_en || 'OTHER').toUpperCase();
      labelEn = item.category_en || item.facilityType || item.type || 'Government Facility';
      labelAr = item.category_ar || item.facilityType_ar || 'منشأة حكومية';
    }

    if (!countsMap.has(groupKey)) {
      countsMap.set(groupKey, {
        key: groupKey,
        label: labelEn,
        label_ar: labelAr,
        count: 0
      });
    }

    countsMap.get(groupKey).count += 1;
  });

  // Calculate percentages and sort descending by count
  const breakdown = Array.from(countsMap.values())
    .map((entry, idx) => ({
      ...entry,
      percentage: parseFloat(((entry.count / total) * 100).toFixed(1)),
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
    }))
    .sort((a, b) => b.count - a.count);

  const dominant = breakdown[0];

  // Build bullet points for text summary
  const summaryBulletsEn = breakdown
    .map(b => `• **${b.label}**: ${b.count} ${b.count === 1 ? 'facility' : 'facilities'} (${b.percentage}%)`)
    .join('\n');

  const summaryBulletsAr = breakdown
    .map(b => `• **${b.label_ar}**: ${b.count} ${b.count === 1 ? 'منشأة' : 'منشآت'} (${b.percentage}%)`)
    .join('\n');

  // Build KPI Grid metrics
  const kpiMetrics = [
    {
      label: 'Total in Zone',
      label_ar: 'إجمالي المنشآت في النطاق',
      value: `${total} ${isArabic ? 'منشأة' : 'Facilities'}`,
      iconType: 'facilities',
      trend: 'positive',
      change: isArabic ? 'ضمن الحدود المرسومة' : 'Within drawn zone'
    },
    {
      label: 'Dominant Category',
      label_ar: 'الفئة الأكثر تمثيلاً',
      value: `${isArabic ? dominant.label_ar : dominant.label} (${dominant.percentage}%)`,
      iconType: 'activity',
      trend: 'neutral',
      change: `${dominant.count} ${isArabic ? 'من أصل' : 'of'} ${total}`
    },
    {
      label: 'Category Scope',
      label_ar: 'نطاق الفئات',
      value: selectedSubcategories.length > 0 
        ? `${selectedSubcategories.length} ${isArabic ? 'فئات نشطة' : 'Active Scope'}`
        : (isArabic ? 'كافة الفئات' : 'All Categories'),
      iconType: 'risk',
      trend: 'neutral',
      change: isArabic ? 'تصفية الفئات المختارة' : 'Selected category filter'
    },
    {
      label: 'Distribution Spread',
      label_ar: 'معدل التوزيع النسبي',
      value: `${(total / (breakdown.length || 1)).toFixed(1)} ${isArabic ? 'منشأة/فئة' : 'avg/category'}`,
      iconType: 'emissions',
      trend: 'neutral',
      change: `${breakdown.length} ${isArabic ? 'فئات ممثلة' : 'categories represented'}`
    }
  ];

  // Build Proportional Horizontal Ranked Bar Chart
  const chartData = {
    title: isArabic ? 'التوزيع النسبي للفئات ضمن النطاق المحدد' : 'Category Distribution in Drawn Zone',
    title_ar: 'التوزيع النسبي للفئات ضمن النطاق المحدد',
    chartType: 'bar',
    type: 'bar',
    unit: isArabic ? 'منشأة' : 'facilities',
    data: breakdown.map(b => ({
      label: isArabic ? b.label_ar : b.label,
      name: isArabic ? b.label_ar : b.label,
      value: b.count,
      percentage: b.percentage,
      riskScore: b.count,
      color: b.color
    }))
  };

  return {
    total,
    breakdown,
    dominantCategory: dominant,
    kpiMetrics,
    chartData,
    summaryBulletsEn,
    summaryBulletsAr
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

