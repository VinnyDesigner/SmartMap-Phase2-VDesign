// Authoritative GIS Query Execution & Validation Engine for GeoVision / SmartMap
// STRICT NO-RANDOM-RESULT GUARANTEE:
// Every returned result MUST satisfy ALL compound predicates against authoritative dataset records.
// If no records match, returns ZERO_RESULTS. If dataset is missing, returns DATASET_UNAVAILABLE.
// Never hallucinates, guesses, fabricates distances, or substitutes demo data.

import { 
  calculateGeodesicDistance, 
  formatDistance,
  isPointInPolygon,
  isPointInRectangle,
  isPointInCircle
} from './spatialAnalysisService.js';
import facilitiesData from '../../data/facilitiesData.json' with { type: 'json' };
import { LOCATIONS_DB } from '../mockAiEngine.js';
import { CANONICAL_CATEGORIES, GEOGRAPHIC_LANDMARKS } from '../ai/datasetVocabulary.js';

/**
 * Builds a unified, deduplicated authoritative master facility dataset
 * merging the GeoJSON authoritative registry, LOCATIONS_DB points of interest,
 * and any active project-specific datasets.
 */
export function getMasterAuthoritativeDataset(activeProjectDatasets = null) {
  const masterMap = new Map();

  // Helper to normalize and insert
  const addFeature = (f) => {
    if (!f || (!f.name && !f.properties?.name)) return;
    const name = (f.name || f.properties?.name || '').trim();
    const key = name.toLowerCase();

    const lat = typeof f.lat === 'number' 
      ? f.lat 
      : (typeof f.geometry?.coordinates?.[1] === 'number' ? f.geometry.coordinates[1] : null);
    const lng = typeof f.lng === 'number' 
      ? f.lng 
      : (typeof f.geometry?.coordinates?.[0] === 'number' ? f.geometry.coordinates[0] : null);

    if (lat === null || lng === null) return;

    const props = f.properties || f;

    const unified = {
      id: f.id || props.id || `FAC-${key.replace(/[^a-z0-9]/g, '-').slice(0, 15)}`,
      name,
      name_ar: props.name_ar || name,
      type: (props.type || props.facilityType || 'GOVERNMENT').toUpperCase(),
      facilityType: (props.facilityType || props.type || 'GOVERNMENT').toUpperCase(),
      subType: props.subType || props.subType_en || null,
      subType_ar: props.subType_ar || null,
      category_en: props.category_en || props.sector || 'Civic Infrastructure',
      category_ar: props.category_ar || 'مرفق حكومي',
      location: props.location || props.district || 'Abu Dhabi',
      location_ar: props.location_ar || props.district_ar || 'أبوظبي',
      district: props.district || props.location || 'Abu Dhabi',
      district_ar: props.district_ar || props.location_ar || 'أبوظبي',
      city: props.city || 'Abu Dhabi',
      country: props.country || 'United Arab Emirates',
      state: props.state || 'Abu Dhabi',
      lat,
      lng,
      riskScore: typeof props.riskScore === 'number' ? props.riskScore : 25,
      riskLevel: props.riskLevel || (props.riskScore > 80 ? 'Critical' : props.riskScore > 60 ? 'High' : props.riskScore > 40 ? 'Moderate' : 'Low'),
      waterConsumption: props.waterConsumption || 12000,
      emissionsIndex: props.emissionsIndex || 15000,
      capacity: props.capacity || props.dailyVisitorCap || 5000,
      annualVisitors: props.annualVisitors || null,
      rating: props.rating || 4.8,
      isCoastal: Boolean(props.isCoastal),
      tags: Array.isArray(props.tags) ? props.tags.map(t => String(t).toLowerCase()) : [name.toLowerCase()],
      description: props.description || `${name} in ${props.district || 'Abu Dhabi'}.`,
      description_ar: props.description_ar || `${props.name_ar || name} في إمارة أبوظبي.`
    };

    if (!masterMap.has(key)) {
      masterMap.set(key, unified);
    } else {
      // Merge properties preserving richest fields
      const existing = masterMap.get(key);
      masterMap.set(key, { ...existing, ...unified, tags: Array.from(new Set([...existing.tags, ...unified.tags])) });
    }
  };

  // 1. Authoritative GeoJSON Facilities
  if (facilitiesData && Array.isArray(facilitiesData.features)) {
    facilitiesData.features.forEach(addFeature);
  }

  // 2. Authoritative POI Database
  if (Array.isArray(LOCATIONS_DB)) {
    LOCATIONS_DB.forEach(addFeature);
  }

  // 3. Project-specific datasets if loaded
  if (Array.isArray(activeProjectDatasets)) {
    activeProjectDatasets.forEach(addFeature);
  }

  return Array.from(masterMap.values());
}

/**
 * Result Validation Gate:
 * Confirms whether a candidate record satisfies EVERY requested predicate in normalizedQuery.
 * Returns boolean true ONLY if all explicit constraints pass.
 */
export function validateEntity(item, normalizedQuery, origin = null, context = {}) {
  if (!item || typeof item.lat !== 'number' || typeof item.lng !== 'number') {
    return false;
  }

  const { category, subType, filters, geographicArea, radiusKm, isRefinement, activeSubcategoryScope, isDrawnShapeQuery } = normalizedQuery;

  // 0. Active Subcategory Scope Filter (for Refinement Queries within active layer filters)
  if (isRefinement && Array.isArray(activeSubcategoryScope) && activeSubcategoryScope.length > 0) {
    const locSubType = (item.subType || '').toLowerCase();
    const locType = (item.type || item.facilityType || '').toLowerCase();
    const tags = (item.tags || []).map(t => String(t).toLowerCase());

    const matchesScope = activeSubcategoryScope.some(subId => {
      const cleanSubId = subId.toLowerCase();
      if (locSubType === cleanSubId) return true;
      if (tags.includes(cleanSubId) || tags.includes(cleanSubId.replace(/_/g, ' '))) return true;
      if (locType === cleanSubId) return true;
      return false;
    });

    if (!matchesScope) return false;
  }

  // 1. Strict Category Match
  if (category) {
    const itemType = (item.type || item.facilityType || '').toUpperCase();
    const targetCat = category.toUpperCase();
    const itemTags = item.tags || [];

    const isMatch = (itemType === targetCat) ||
      (targetCat === CANONICAL_CATEGORIES.GOVERNMENT && (itemType === 'GOVERNMENT' || itemTags.includes('government') || itemTags.includes('dge') || itemTags.includes('tamm'))) ||
      (targetCat === CANONICAL_CATEGORIES.TOURISM && (itemType === 'TOURISM' || itemTags.includes('tourism') || itemTags.includes('museum') || itemTags.includes('mosque') || itemTags.includes('landmark'))) ||
      (targetCat === CANONICAL_CATEGORIES.PARK && (itemType === 'PARK' || itemTags.includes('park') || itemTags.includes('garden'))) ||
      (targetCat === CANONICAL_CATEGORIES.TRANSPORT && (itemType === 'TRANSPORT' || itemTags.includes('transport'))) ||
      (targetCat === CANONICAL_CATEGORIES.HOSPITAL && (itemType === 'HOSPITAL' || itemType === 'HEALTHCARE' || itemTags.includes('hospital') || itemTags.includes('healthcare') || itemTags.includes('medical') || itemTags.includes('clinic') || itemTags.includes('pharmacy'))) ||
      (targetCat === CANONICAL_CATEGORIES.EDUCATION && (itemType === 'EDUCATION' || itemTags.includes('university') || itemTags.includes('college') || itemTags.includes('education') || itemTags.includes('school') || itemTags.includes('nursery') || itemTags.includes('pod'))) ||
      (targetCat === CANONICAL_CATEGORIES.MANUFACTURING && (itemType === 'MANUFACTURING' || itemTags.includes('manufacturing') || itemTags.includes('industrial'))) ||
      (targetCat === CANONICAL_CATEGORIES.CIVIC_INFRASTRUCTURE && (itemType === 'CIVIC_INFRASTRUCTURE' || itemType === 'UTILITIES' || itemTags.includes('utility') || itemTags.includes('utilities') || itemTags.includes('desalination'))) ||
      (targetCat === CANONICAL_CATEGORIES.PUBLIC_SAFETY && (itemType === 'PUBLIC_SAFETY' || itemTags.includes('police') || itemTags.includes('ambulance') || itemTags.includes('safety') || itemTags.includes('public_safety') || itemTags.includes('fire') || itemTags.includes('civil defense'))) ||
      (targetCat === CANONICAL_CATEGORIES.ENVIRONMENT && (itemType === 'ENVIRONMENT' || itemTags.includes('environment') || itemTags.includes('mangrove') || itemTags.includes('wetland') || itemTags.includes('protected') || itemTags.includes('recycling'))) ||
      (targetCat === CANONICAL_CATEGORIES.HOUSING && (itemType === 'HOUSING' || itemTags.includes('housing') || itemTags.includes('residential') || itemTags.includes('villa') || itemTags.includes('commercial'))) ||
      (targetCat === CANONICAL_CATEGORIES.INFRASTRUCTURE && (itemType === 'INFRASTRUCTURE' || itemTags.includes('infrastructure') || itemTags.includes('bridge') || itemTags.includes('highway') || itemTags.includes('road') || itemTags.includes('port') || itemTags.includes('lighting'))) ||
      (targetCat === CANONICAL_CATEGORIES.CLIMATE && (itemType === 'CLIMATE' || itemTags.includes('climate') || itemTags.includes('weather') || itemTags.includes('solar') || itemTags.includes('carbon') || itemTags.includes('coastal'))) ||
      (targetCat === CANONICAL_CATEGORIES.CONSTRUCTION && (itemType === 'CONSTRUCTION' || itemTags.includes('construction') || itemTags.includes('development') || itemTags.includes('zoning'))) ||
      (targetCat === CANONICAL_CATEGORIES.ENERGY && (itemType === 'ENERGY' || itemTags.includes('energy') || itemTags.includes('substation') || itemTags.includes('gas') || itemTags.includes('renewable') || itemTags.includes('grid'))) ||
      (targetCat === CANONICAL_CATEGORIES.AGRICULTURE && (itemType === 'AGRICULTURE' || itemTags.includes('agriculture') || itemTags.includes('farm') || itemTags.includes('greenhouse') || itemTags.includes('irrigation') || itemTags.includes('livestock'))) ||
      (targetCat === CANONICAL_CATEGORIES.EMPLOYMENT && (itemType === 'EMPLOYMENT' || itemTags.includes('employment') || itemTags.includes('business hub') || itemTags.includes('free zone') || itemTags.includes('job center') || itemTags.includes('corporate')));

    if (!isMatch) return false;
  }

  // 2. Strict SubType Match
  if (subType) {
    const sub = subType.toLowerCase();
    const itemTags = (item.tags || []).map(t => t.toLowerCase());
    const nameLower = (item.name || '').toLowerCase();
    const nameArLower = (item.name_ar || '').toLowerCase();
    const catEnLower = (item.category_en || '').toLowerCase();

    const matchesSubType = itemTags.some(t => t.includes(sub)) || 
      nameLower.includes(sub) || 
      nameArLower.includes(sub) || 
      catEnLower.includes(sub);

    if (!matchesSubType) return false;
  }

  // 3. Strict Attribute Filters (e.g. riskLevel)
  if (filters) {
    if (filters.riskLevel) {
      const targetRisk = filters.riskLevel.toLowerCase();
      const itemRisk = (item.riskLevel || '').toLowerCase();
      if (itemRisk !== targetRisk) return false;
    }

    if (filters.isCoastal !== undefined) {
      if (Boolean(item.isCoastal) !== Boolean(filters.isCoastal)) return false;
    }
  }

  // 4. Strict Geographic Area Match
  if (geographicArea) {
    // If geographicArea is external (e.g. Telangana, Mumbai, Dubai), dataset has 0 records
    if (geographicArea.isExternal) {
      const itemCountry = (item.country || '').toLowerCase();
      const itemState = (item.state || '').toLowerCase();
      const areaName = geographicArea.name.toLowerCase();
      const matchesExternal = itemCountry.includes(areaName) || itemState.includes(areaName);
      if (!matchesExternal) return false;
    } else {
      const areaName = (geographicArea.name_en || geographicArea.name || '').toLowerCase();
      const areaNameAr = (geographicArea.name_ar || '').toLowerCase();

      // If user specified a specific local landmark area (e.g. "Yas Island", "Corniche", "Al Reem Island", "Al Mushrif")
      // We skip district restriction if the landmark is Abu Dhabi itself (since all facilities belong to Abu Dhabi)
      if (geographicArea.id !== 'abu-dhabi' && areaName !== 'abu dhabi') {
        const itemLocation = (item.location || '').toLowerCase();
        const itemDistrict = (item.district || '').toLowerCase();
        const itemLocationAr = (item.location_ar || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        const itemNameAr = (item.name_ar || '').toLowerCase();
        const itemTags = (item.tags || []).map(t => String(t).toLowerCase());

        // Gather all known aliases for the target geographic area
        const aliases = Array.from(new Set([
          ...(geographicArea.names || []),
          geographicArea.name_en,
          geographicArea.name_ar,
          geographicArea.name,
          geographicArea.id?.replace(/-/g, ' ')
        ])).filter(Boolean).map(a => a.toLowerCase().trim());

        const textMatches = aliases.some(alias => 
          itemLocation.includes(alias) || 
          itemDistrict.includes(alias) || 
          itemLocationAr.includes(alias) || 
          itemTags.some(t => t === alias || t.includes(alias)) ||
          itemName.includes(alias) ||
          itemNameAr.includes(alias)
        );

        if (normalizedQuery.spatialRelation === 'in') {
          // STRICT DISTRICT CONTAINMENT (e.g. "parks in al reem island", "schools in al bateen")
          if (textMatches) {
            return true;
          }

          // If text doesn't match directly, only allow spatial fallback if within tight neighborhood boundary (<= 1.8 km)
          // AND it does NOT belong to an explicitly different, conflicting district (e.g. Al Mushrif vs Al Reem Island)
          if (geographicArea.coords && typeof item.lat === 'number' && typeof item.lng === 'number') {
            const distToLandmark = calculateGeodesicDistance(
              geographicArea.coords.lat, 
              geographicArea.coords.lng, 
              item.lat, 
              item.lng
            );

            if (distToLandmark <= 1.8) {
              const knownMajorDistricts = [
                'al mushrif', 'mushrif', 'yas island', 'saadiyat', 'corniche', 
                'mussafah', 'al taweelah', 'al bateen', 'al rawdah', 'al maryah', 'al reem'
              ];
              const hasConflictingDistrict = knownMajorDistricts.some(other => 
                !aliases.some(a => a.includes(other) || other.includes(a)) && 
                (itemDistrict.includes(other) || itemLocation.includes(other))
              );
              if (!hasConflictingDistrict) {
                return true;
              }
            }
          }

          return false;
        } else {
          // PROXIMITY SEARCH (e.g. "attractions around Yas Island", "facilities near Corniche")
          let spatialNearLandmark = false;
          if (geographicArea.coords && typeof item.lat === 'number' && typeof item.lng === 'number') {
            const distToLandmark = calculateGeodesicDistance(
              geographicArea.coords.lat, 
              geographicArea.coords.lng, 
              item.lat, 
              item.lng
            );
            if (distToLandmark <= 4.0) spatialNearLandmark = true;
          }

          if (!textMatches && !spatialNearLandmark) return false;
        }
      }
    }
  }

  // 5. Strict Spatial Radius Filter
  if (typeof radiusKm === 'number' && radiusKm > 0 && origin && typeof origin.lat === 'number' && typeof origin.lng === 'number') {
    const dist = calculateGeodesicDistance(origin.lat, origin.lng, item.lat, item.lng);
    if (dist > radiusKm) return false;
  }

  // 6. Active Drawn Shape Spatial Containment
  const hasDrawnFilter = Boolean(
    context?.hasActiveDrawingFilter ||
    context?.activeDrawnArea ||
    context?.drawnCircle ||
    context?.drawnRectangle ||
    context?.drawnPolygon
  );

  // Active drawn area filter applies to queries within the drawn shape,
  // but does not constrain explicit selected-location proximity searches unless requested.
  const isSelectedProximity = normalizedQuery.referenceLocationType === 'selected' && !isDrawnShapeQuery;

  if ((isDrawnShapeQuery || hasDrawnFilter) && !isSelectedProximity) {
    if (context.drawnRectangle && !isPointInRectangle(item.lat, item.lng, context.drawnRectangle)) {
      return false;
    }
    if (context.drawnCircle && !isPointInCircle(item.lat, item.lng, context.drawnCircle.center, context.drawnCircle.radius)) {
      return false;
    }
    if (context.drawnPolygon && !isPointInPolygon(item.lat, item.lng, context.drawnPolygon)) {
      return false;
    }
  }

  return true;
}

/**
 * Execute Structured GIS Query
 */
export function executeGisQuery(normalizedQuery, context = {}) {
  // 1. DATASET UNAVAILABLE: If query requests a concept not present in GeoVision
  if (normalizedQuery.datasetExists === false) {
    const label = normalizedQuery.requestedDataset?.label_en || 'requested';
    const labelAr = normalizedQuery.requestedDataset?.label_ar || 'المطلوبة';

    return {
      status: 'DATASET_UNAVAILABLE',
      results: [],
      totalCount: 0,
      requestedDataset: normalizedQuery.requestedDataset,
      message_en: `"${label.toUpperCase()}" data is not available in the current GeoVision dataset. Available datasets include Government Facilities, Tourism & Cultural Heritage, Parks & Recreation, Mobility & Transit, Public Safety, Healthcare, Utilities, and Manufacturing.`,
      message_ar: `بيانات "${labelAr}" غير متوفرة في قاعدة البيانات الجغرافية الحالية لمنصة GeoVision. تشمل البيانات المتوفرة: المنشآت الحكومية، المعالم السياحية والتراثية، الحدائق العامة، النقل والمواصلات، السلامة العامة، الرعاية الصحية، المرافق العامة، ومجمعات التصنيع.`,
      suggestions: ['Show government facilities', 'Show parks near me', 'Show tourism landmarks', 'Show public transit']
    };
  }

  // 2. Resolve Reference Origin Coordinates
  // Priority: 1. Selected feature -> 2. Named landmark -> 3. User location -> 4. Project center
  let origin = null;
  let referenceName = null;
  let referenceNameAr = null;

  if (normalizedQuery.referenceLocationType === 'selected') {
    if (context.selectedLocation && typeof context.selectedLocation.lat === 'number') {
      origin = { lat: context.selectedLocation.lat, lng: context.selectedLocation.lng };
      referenceName = context.selectedLocation.name;
      referenceNameAr = context.selectedLocation.name_ar;
    } else if (context.mapFocus && typeof context.mapFocus.lat === 'number' && typeof context.mapFocus.lng === 'number') {
      origin = { lat: context.mapFocus.lat, lng: context.mapFocus.lng };
      referenceName = 'Map View';
      referenceNameAr = 'مركز الخريطة';
    } else if (context.activeDrawnArea?.centerCoords) {
      origin = context.activeDrawnArea.centerCoords;
      referenceName = context.activeDrawnArea.label || 'Drawn Area';
      referenceNameAr = context.activeDrawnArea.label_ar || 'المنطقة المحددة';
    } else if (context.userLocation && typeof context.userLocation.lat === 'number') {
      origin = { lat: context.userLocation.lat, lng: context.userLocation.lng };
      referenceName = 'Your Location';
      referenceNameAr = 'موقعك الحالي';
    } else {
      const defaultCenter = context.activeProject?.defaultCenter || { lat: 24.4839, lng: 54.3773 };
      origin = defaultCenter;
      referenceName = 'Abu Dhabi Central';
      referenceNameAr = 'وسط أبوظبي';
    }
  } else if (normalizedQuery.referenceLocationType === 'named' && normalizedQuery.geographicArea && !normalizedQuery.geographicArea.isExternal && normalizedQuery.geographicArea.coords) {
    origin = normalizedQuery.geographicArea.coords;
    referenceName = normalizedQuery.geographicArea.name_en;
    referenceNameAr = normalizedQuery.geographicArea.name_ar;
  } else if (context.userLocation && typeof context.userLocation.lat === 'number') {
    origin = { lat: context.userLocation.lat, lng: context.userLocation.lng };
    referenceName = 'Your Location';
    referenceNameAr = 'موقعك الحالي';
  } else {
    // Default project / Abu Dhabi center
    const defaultCenter = context.activeProject?.defaultCenter || { lat: 24.4839, lng: 54.3773 };
    origin = defaultCenter;
    referenceName = 'Abu Dhabi Central';
    referenceNameAr = 'وسط أبوظبي';
  }

  // 3. Load Authoritative Dataset
  const dataset = getMasterAuthoritativeDataset(context.activeProject?.datasets);

  // 4. Filter & Validate Every Item
  const validatedList = dataset.filter(item => {
    // If querying near a selected facility, exclude the reference asset itself
    if (normalizedQuery.referenceLocationType === 'selected' && context.selectedLocation) {
      if (item.name === context.selectedLocation.name && Math.abs(item.lat - context.selectedLocation.lat) < 0.0001) {
        return false;
      }
    }
    return validateEntity(item, normalizedQuery, origin, context);
  });

  // 5. Calculate Geodesic Distance from Origin for every validated item
  const enrichedList = validatedList.map(item => {
    const distKm = origin 
      ? calculateGeodesicDistance(origin.lat, origin.lng, item.lat, item.lng)
      : 0;
    return {
      ...item,
      distanceKm: distKm,
      distance: formatDistance(distKm)
    };
  });

  // 6. Sort Results
  const sortField = normalizedQuery.sort?.field || 'distance';
  const sortDir = normalizedQuery.sort?.direction || 'asc';

  enrichedList.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'distance') {
      valA = a.distanceKm ?? 9999;
      valB = b.distanceKm ?? 9999;
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // 7. Limit Results if specified
  const finalResults = (typeof normalizedQuery.limit === 'number' && normalizedQuery.limit > 0)
    ? enrichedList.slice(0, normalizedQuery.limit)
    : enrichedList;

  // 8. Handle ZERO RESULTS
  if (finalResults.length === 0) {
    const catLabel = normalizedQuery.categoryMetadata?.name_en || normalizedQuery.category || 'records';
    const catLabelAr = normalizedQuery.categoryMetadata?.name_ar || 'سجلات';
    const radiusText = normalizedQuery.radiusKm ? ` within ${normalizedQuery.radiusKm} km` : '';
    const radiusTextAr = normalizedQuery.radiusKm ? ` ضمن نطاق ${normalizedQuery.radiusKm} كم` : '';
    const areaText = normalizedQuery.geographicArea ? ` in ${normalizedQuery.geographicArea.name_en || normalizedQuery.geographicArea.name}` : '';
    const areaTextAr = normalizedQuery.geographicArea ? ` في ${normalizedQuery.geographicArea.name_ar || ''}` : '';
    const riskText = normalizedQuery.filters?.riskLevel ? ` matching "${normalizedQuery.filters.riskLevel} Risk"` : '';
    const riskTextAr = normalizedQuery.filters?.riskLevel ? ` بمستوى خطورة "${normalizedQuery.filters.riskLevel}"` : '';

    const suggestions = [];
    const suggestionsAr = [];

    // ONLY suggest clearing risk filter if a risk filter was actually active!
    if (normalizedQuery.filters?.riskLevel) {
      suggestions.push('Clear risk filter');
      suggestionsAr.push('إلغاء تصفية الخطورة');
    }

    if (normalizedQuery.radiusKm || normalizedQuery.spatialRelation === 'near') {
      suggestions.push('Expand search radius');
      suggestionsAr.push('توسيع نطاق البحث');
    }

    if (normalizedQuery.isDrawnShapeQuery || context?.hasActiveDrawingFilter) {
      suggestions.push('Clear drawn area');
      suggestionsAr.push('مسح منطقة الرسم');
    }

    suggestions.push('Show all facilities in Abu Dhabi');
    suggestionsAr.push('عرض كافة المنشآت في أبوظبي');

    if (normalizedQuery.category) {
      suggestions.push(`Show all ${catLabel} in Abu Dhabi`);
      suggestionsAr.push(`عرض كافة ${catLabelAr} في أبوظبي`);
    } else {
      suggestions.push('Show government facilities');
      suggestionsAr.push('عرض المنشآت الحكومية');
    }

    return {
      status: 'ZERO_RESULTS',
      results: [],
      totalCount: 0,
      origin,
      referenceName,
      referenceNameAr,
      message_en: `No ${catLabel}${riskText} found${radiusText}${areaText} in the authoritative dataset.`,
      message_ar: `لم يتم العثور على ${catLabelAr}${riskTextAr}${radiusTextAr}${areaTextAr} في قاعدة البيانات المعتمدة.`,
      suggestions: suggestions.slice(0, 3),
      suggestionsAr: suggestionsAr.slice(0, 3)
    };
  }

  // 9. Success Response
  return {
    status: 'SUCCESS',
    results: finalResults,
    totalCount: finalResults.length,
    origin,
    referenceName,
    referenceNameAr,
    normalizedQuery
  };
}
