// Query Intent Resolver for GeoVision / SmartMap V2
// Parses natural language input and current SmartMapSession context into a structured query intent object.

export const INTENT_TYPES = {
  PROXIMITY_SEARCH: 'PROXIMITY_SEARCH',
  CROSS_LAYER: 'CROSS_LAYER',
  AGGREGATION: 'AGGREGATION',
  REFINEMENT: 'REFINEMENT',
  NEAREST: 'NEAREST',
  REFERENCE_RESOLUTION: 'REFERENCE_RESOLUTION',
  VALIDATION_REQUIRED: 'VALIDATION_REQUIRED',
  AMBIGUOUS_LOCATION: 'AMBIGUOUS_LOCATION',
  TEMPORAL_FILTER: 'TEMPORAL_FILTER',
  UNSUPPORTED_DATASET: 'UNSUPPORTED_DATASET',
  RECOMMENDATION: 'RECOMMENDATION',
  CLARIFICATION: 'CLARIFICATION',
  NO_RESULTS: 'NO_RESULTS',
  DISCOVERY: 'DISCOVERY'
};

export const VISUALIZATION_TYPES = {
  DISCOVERY: 'DISCOVERY',       // Map + result cards
  PROXIMITY: 'PROXIMITY',       // Map + radius + result list + distances
  CROSS_LAYER: 'CROSS_LAYER',   // Map + multiple layers + spatial buffer + cross-layer results
  AGGREGATION: 'AGGREGATION',   // Choropleth/district shading + ranked table + chart + summary card
  COMPARISON: 'COMPARISON',     // Comparison cards/table + map
  RECOMMENDATION: 'RECOMMENDATION', // Ranked results + map
  CLARIFICATION: 'CLARIFICATION', // Clarification UI + suggested choices
  NO_RESULTS: 'NO_RESULTS',     // Explanation + recovery actions
  DETAIL_PANEL: 'DETAIL_PANEL'  // Feature detail slide panel
};

export function resolveQueryIntent(queryText, currentState = null, isArabic = false) {
  const q = (queryText || '').toLowerCase().trim();
  const activeContext = currentState?.activeContext || {};

  // 1. FEATURE DETAIL RESOLUTION ("Show its details", "Tell me more about it", "Show details of the closest one")
  if (
    ['its details', 'show details', 'details of the closest', 'tell me more', 'تفاصيلها', 'عرض التفاصيل', 'أظهر التفاصيل'].some(w => q.includes(w))
  ) {
    return {
      intentType: INTENT_TYPES.REFERENCE_RESOLUTION,
      referenceTarget: currentState?.selectedLocation || activeContext.activeLocations?.[0] || 'nearest_facility',
      resultVisualization: VISUALIZATION_TYPES.DETAIL_PANEL,
      explanation_en: 'Resolved reference "its" to currently selected / nearest facility details.',
      explanation_ar: 'تم توجيه الضمير "تفاصيلها" إلى المنشأة المحددة/الأقرب وتفعيل لوحة التفاصيل.'
    };
  }

  // 2. QUERY VALIDATION: MISSING LOCATION ("Show hospitals within 5 km" without reference location or user location)
  if (
    ['within 5 km', '5 km'].some(w => q.includes(w)) &&
    ['hospitals', 'hospital', 'المستشفيات'].some(w => q.includes(w)) &&
    !q.includes('my location') && !q.includes('me') && !q.includes('zayed') && !q.includes('khalifa') && !q.includes('موقعي') && !q.includes('زايد') && !q.includes('خليفة')
  ) {
    return {
      intentType: INTENT_TYPES.VALIDATION_REQUIRED,
      missingField: 'location',
      resultVisualization: VISUALIZATION_TYPES.CLARIFICATION,
      explanation_en: 'Missing location parameter for 5 km proximity search.',
      explanation_ar: 'يتطلب الاستعلام تحديد الموقع المرجعي لنطاق 5 كم.'
    };
  }

  // 3. AMBIGUOUS LOCATION RESOLUTION ("Show parks near Yas")
  if (
    ['near yas', 'in yas', 'حول ياس', 'قريب من ياس'].some(w => q.includes(w)) &&
    !q.includes('yas island') && !q.includes('bani yas') && !q.includes('جزيرة ياس') && !q.includes('بني ياس')
  ) {
    return {
      intentType: INTENT_TYPES.AMBIGUOUS_LOCATION,
      searchTerm: 'Yas',
      ambiguousMatches: ['Yas Island', 'Bani Yas', 'Yasat West Island'],
      resultVisualization: VISUALIZATION_TYPES.CLARIFICATION,
      explanation_en: 'Ambiguous location "Yas" detected. Requesting user choice.',
      explanation_ar: 'تم رصد موقع غير محدد "ياس". يرجى توضيح المنطقة المقصودة.'
    };
  }

  // 4. TEMPORAL / OPEN-NOW FILTER ("How many are open now?", "open now", "مفتوح الآن")
  if (
    ['open now', 'how many are open', 'working hours', 'مفتوح الآن', 'كم منها مفتوح'].some(w => q.includes(w))
  ) {
    return {
      intentType: INTENT_TYPES.TEMPORAL_FILTER,
      filterKey: 'operatingHours',
      filterValue: 'Open 24/7',
      resultVisualization: VISUALIZATION_TYPES.DISCOVERY,
      explanation_en: 'Applied "Open Now" operating hours filter to active result set.',
      explanation_ar: 'تم تطبيق فلتر ساعات العمل "مفتوح الآن" على قائمة النتائج الحالية.'
    };
  }

  // 5. UNSUPPORTED DATASET TOPIC ("Show me the richest areas of Abu Dhabi")
  if (
    ['richest areas', 'wealthiest', 'income level', 'الأغنى', 'مستوى الدخل'].some(w => q.includes(w))
  ) {
    return {
      intentType: INTENT_TYPES.UNSUPPORTED_DATASET,
      requestedTopic: 'Socioeconomic Wealth Index',
      resultVisualization: VISUALIZATION_TYPES.NO_RESULTS,
      explanation_en: 'Requested topic is outside loaded GeoVision SDI datasets.',
      explanation_ar: 'الموضوع المطلوب غير متوفر ضمن طبقات البيانات المكانية الحالية.'
    };
  }

  // 6. NEAREST NEIGHBOR INTENT ("Which is nearest to me?", "Which one is closest?")
  if (
    ['nearest', 'closest', 'near me', 'الأقرب', 'أقرب واحد', 'أيها أقرب', 'أيها الأقرب'].some(w => q.includes(w)) &&
    !q.includes('within')
  ) {
    return {
      intentType: INTENT_TYPES.NEAREST,
      dataset: activeContext.category || 'HOSPITAL',
      referenceLocation: activeContext.district || 'Zayed Sports City',
      resultVisualization: VISUALIZATION_TYPES.RECOMMENDATION,
      explanation_en: 'Identified nearest facility relative to reference location.',
      explanation_ar: 'تم تحديد المنشأة الأقرب بالنسبة للموقع المرجعي.'
    };
  }

  // 7. CONTEXTUAL FILTER REFINEMENT INTENT ("Only government hospitals", "Within 5 km of Zayed Sports City")
  if (
    ['only government', 'government hospitals', 'zayed sports city', 'حكومي فقط', 'المستشفيات الحكومية'].some(w => q.includes(w))
  ) {
    return {
      intentType: INTENT_TYPES.REFINEMENT,
      dataset: activeContext.category || 'HOSPITAL',
      location: q.includes('zayed sports city') || q.includes('زايد الرياضية') ? 'Zayed Sports City' : (activeContext.district || 'Abu Dhabi'),
      resultVisualization: VISUALIZATION_TYPES.DISCOVERY,
      explanation_en: 'Applied ownership and spatial refinement to active query.',
      explanation_ar: 'تم تطبيق تصفية الملكية والنطاق المكاني على الاستعلام الحالي.'
    };
  }

  // 8. CROSS-LAYER PROXIMITY INTENT ("Show schools within 2 km of these hospitals")
  if (
    (['schools', 'school', 'المدارس', 'مدرسة'].some(w => q.includes(w)) &&
     ['bus', 'transit', 'hospitals', 'hospital', 'these hospitals', 'الحافلات', 'المستشفيات', 'هذه المستشفيات'].some(w => q.includes(w)) &&
     ['within', '2 km', '2km', 'نطاق', '2 كم'].some(w => q.includes(w)))
  ) {
    const isTargetingActiveHospitals = q.includes('hospitals') || q.includes('المستشفيات');
    const primaryLayer = 'Schools';
    const secondaryLayer = isTargetingActiveHospitals ? 'Hospitals' : 'Bus Stations';

    return {
      intentType: INTENT_TYPES.CROSS_LAYER,
      primaryDataset: primaryLayer,
      secondaryDataset: secondaryLayer,
      distanceKm: 2.0,
      spatialRelationship: 'within_2km_buffer',
      resultVisualization: VISUALIZATION_TYPES.CROSS_LAYER,
      explanation_en: `Cross-layer spatial analysis: ${primaryLayer} within 2 km buffer of ${secondaryLayer}.`,
      explanation_ar: `تحليل مكاني متقاطع: ${primaryLayer} ضمن نطاق 2 كم من ${secondaryLayer}.`
    };
  }

  // 9. SPATIAL AGGREGATION INTENT ("Which area has the highest number of healthcare facilities?")
  if (
    ['highest number', 'most healthcare', 'highest concentration', 'area has the highest', 'أعلى عدد', 'أعلى تركيز', 'أي منطقة تحوي'].some(w => q.includes(w))
  ) {
    return {
      intentType: INTENT_TYPES.AGGREGATION,
      dataset: 'Healthcare Facilities',
      groupingMetric: 'Administrative District',
      resultVisualization: VISUALIZATION_TYPES.AGGREGATION,
      explanation_en: 'Spatial aggregation analysis: Facility counts grouped by Abu Dhabi administrative districts.',
      explanation_ar: 'تحليل تجميعي مكاني: حساب أعداد المنشآت موزعة حسب القطاعات الإدارية.'
    };
  }

  // DEFAULT INTENT: GENERAL DISCOVERY
  return {
    intentType: INTENT_TYPES.DISCOVERY,
    dataset: activeContext.category || 'General SDI Layers',
    resultVisualization: VISUALIZATION_TYPES.DISCOVERY,
    explanation_en: 'General spatial discovery & layer inspection.',
    explanation_ar: 'استكشاف مكاني عام ومعاينة الطبقات الجغرافية.'
  };
}
