// Natural Language Query Intent Resolver for GeoVision / SmartMap
// Converts freeform natural language queries into a canonical NormalizedQuery contract.
// Backed by authoritative datasetVocabulary. Never guesses or invents categories.

import { 
  CANONICAL_CATEGORIES, 
  CATEGORY_METADATA, 
  checkUnavailableDataset, 
  resolveCanonicalCategory, 
  resolveGeographicReference 
} from './datasetVocabulary.js';
import { 
  CATEGORY_TREE, 
  CANONICAL_TO_CATEGORY_ID, 
  SUBTYPE_TO_SUBCATEGORY_ID, 
  findCategoryBySubcategoryId 
} from '../../config/categoryTree.js';

// Strict word boundary checker to prevent accidental substring collisions (e.g. "port" inside "export")
function hasWord(text, word) {
  if (!text || !word) return false;
  // For Arabic, use includes because Arabic words take morphological prefixes like 'ال' (الشرطة, بالميناء)
  if (/[\u0600-\u06FF]/.test(word)) {
    return text.includes(word);
  }
  // For Latin/English words, use strict regex word boundaries to prevent collisions like "port" in "export"
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

function hasAnyWord(text, words = []) {
  return words.some(w => hasWord(text, w));
}

export function parseQueryIntent(queryText, currentState = null, isArabic = false) {
  if (!queryText || typeof queryText !== 'string') return null;
  const rawQ = queryText.trim();
  const q = rawQ.toLowerCase();

  // =========================================================================
  // 1. APP CONTROL INTENTS (Theme, Language, Basemap, Navigation, Print)
  // =========================================================================

  // 1A. Dark Theme Triggers
  const darkThemeTriggers = [
    'make it dark', 'change theme to dark', 'change to dark', 'change to dark theme', 
    'change to dark mode', 'change theme dark', 'switch to dark', 'switch to dark theme', 
    'switch to dark mode', 'switch theme to dark', 'set theme to dark', 'set to dark', 
    'dark mode', 'dark theme', 'enable dark mode', 'enable dark theme', 'turn on dark mode', 
    'turn on dark theme', 'الوضع الداكن', 'الوضع المظلم', 'الداكن', 'تغيير المظهر إلى الداكن', 
    'تغير المظهر الى الداكن', 'تحويل إلى الوضع الداكن', 'تفعيل الوضع الداكن'
  ];

  // 1B. Light Theme Triggers
  const lightThemeTriggers = [
    'make it light', 'change theme to light', 'change to light', 'change to light theme', 
    'change to light mode', 'change theme light', 'switch to light', 'switch to light theme', 
    'switch to light mode', 'switch theme to light', 'set theme to light', 'set to light', 
    'light mode', 'light theme', 'enable light mode', 'enable light theme', 'turn on light mode', 
    'turn on light theme', 'الوضع الفاتح', 'الفاتح', 'تغيير المظهر إلى الفاتح', 
    'تغير المظهر الى الفاتح', 'تحويل إلى الوضع الفاتح', 'تفعيل الوضع الفاتح'
  ];

  // 1C. Arabic Language Triggers
  const arabicLangTriggers = [
    'change language to arabic', 'change to arabic', 'change to arabic language', 
    'switch language to arabic', 'switch to arabic', 'switch to arabic language', 
    'set language to arabic', 'set to arabic', 'arabic language', 'arabic version', 
    'enable arabic', 'enable arabic version', 'show arabic', 'use arabic', 'عربي', 
    'العربية', 'النسخة العربية', 'تغيير اللغة إلى العربية', 'تغيير اللغة للعربية', 
    'تغير اللغة الى العربية', 'التحويل إلى العربية', 'تفعيل اللغة العربية', 'اللغة العربية'
  ];

  // 1D. English Language Triggers
  const englishLangTriggers = [
    'change language to english', 'change to english', 'change to english language', 
    'switch language to english', 'switch to english', 'switch to english language', 
    'set language to english', 'set to english', 'english language', 'english version', 
    'enable english', 'enable english version', 'show english', 'use english', 'إنجليزية', 
    'الانجليزية', 'النسخة الإنجليزية', 'تغيير اللغة إلى الإنجليزية', 'تغيير اللغة للإنجليزية', 
    'تغير اللغة الى الانجليزية', 'التحويل إلى الإنجليزية', 'تفعيل اللغة الإنجليزية', 'اللغة الإنجليزية'
  ];

  // Basemap triggers
  if (['change basemap', 'switch basemap', 'satellite view', 'satellite map', 'use satellite', 'use abu dhabi basemap', 'show streets', 'تغيير الخريطة', 'خريطة الأقمار الصناعية'].some(k => q.includes(k))) {
    let basemapId = 'satellite';
    if (q.includes('dark') || q.includes('مظلمة')) basemapId = 'dark';
    else if (q.includes('street') || q.includes('شوارع')) basemapId = 'streets';
    else if (q.includes('dge') || q.includes('abu dhabi') || q.includes('أبوظبي')) basemapId = 'abu-dhabi-dge';
    return { type: 'APP_CONTROL', action: 'CHANGE_BASEMAP', params: { basemapId } };
  }

  // Theme Controls
  if (darkThemeTriggers.some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CHANGE_THEME', params: { theme: 'dark' } };
  }
  if (lightThemeTriggers.some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CHANGE_THEME', params: { theme: 'light' } };
  }

  // Language Controls
  if (arabicLangTriggers.some(k => q === k || (k !== 'arabic' && q.includes(k))) || q === 'arabic') {
    return { type: 'APP_CONTROL', action: 'CHANGE_LANGUAGE', params: { lang: 'ar' } };
  }
  if (englishLangTriggers.some(k => q === k || (k !== 'english' && q.includes(k))) || q === 'english') {
    return { type: 'APP_CONTROL', action: 'CHANGE_LANGUAGE', params: { lang: 'en' } };
  }

  // Navigation
  if (['about us', 'open about us', 'go to about us', 'من نحن'].some(k => q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'NAVIGATE', params: { view: 'about' } };
  }

  // Print & PDF Export (Spatial Data, Analysis Report, Current Map View)
  const isPdfOrExportQuery = (
    // Regex matching export/print/save/download with pdf or report or data or analysis
    /(?:export|print|download|save)\b.*?\b(?:pdf|report|analysis|data|map)\b/i.test(q) ||
    // Typos like "saptial" or "spacial" with export/print and pdf/data
    /\b(?:export|print)\b.*?\b(?:saptial|spacial|spatial)\b/i.test(q) ||
    /\b(?:pdf)\b.*?\b(?:export|print|download|report|save)/i.test(q) ||
    (/\bpdf\b/i.test(q) && /(?:export|print|generate|download|save|create)/i.test(q)) ||
    ['export to pdf', 'export pdf', 'print pdf', 'save as pdf', 'download pdf', 'export data to pdf', 'export spatial', 'export saptial', 'export analysis', 'export report', 'export data', 'print map', 'print report', 'print this map', 'print current view', 'print screen', 'print view', 'print'].some(k => q === k || q.includes(k)) ||
    // Arabic triggers
    ['تصدير إلى pdf', 'تصدير الى pdf', 'تصدير تقرير', 'تصدير التقرير', 'تصدير التحليل', 'تصدير البيانات', 'تصدير الخريطة', 'طباعة الخريطة', 'طباعة الشاشة', 'طباعة التقرير', 'طباعة pdf', 'طباعة'].some(k => q.includes(k)) ||
    (['تصدير', 'طباعة'].some(k => q.includes(k)) && ['pdf', 'تقرير', 'تحليل', 'بيانات', 'خريطة'].some(k => q.includes(k)))
  );

  if (isPdfOrExportQuery) {
    const isExplicitPdf = /\bpdf\b/i.test(q) || q.includes('pdf');
    return { 
      type: 'APP_CONTROL', 
      action: isExplicitPdf ? 'EXPORT_PDF' : 'PRINT_MAP', 
      params: { 
        format: 'pdf', 
        type: 'spatial-data-report',
        hasDrawnArea: Boolean(currentState?.activeDrawnArea || currentState?.drawnCircle || currentState?.drawnRectangle || currentState?.drawnPolygon)
      } 
    };
  }

  // Clear Drawn Shape / Boundary
  const clearAreaTriggers = [
    'clear drawn area', 'clear area', 'clear shape', 'clear drawing', 'remove drawing',
    'clear drawn zone', 'reset area', 'clear boundary', 'clear the drawn area',
    'clear drawn shape', 'remove shape', 'delete drawing', 'clear zone',
    'مسح منطقة الرسم', 'مسح المنطقة', 'مسح الرسم', 'مسح المنطقة المحددة', 'إزالة الرسم', 'إلغاء التحديد'
  ];
  if (clearAreaTriggers.some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CLEAR_DRAWN_SHAPE', params: {} };
  }

  // Clear Directions / Route
  const clearDirectionTriggers = [
    'clear direction', 'clear directions', 'clear route', 'remove direction', 'remove directions',
    'remove route', 'cancel route', 'cancel directions', 'hide directions', 'hide route',
    'close directions', 'reset route', 'stop directions', 'clear navigation',
    'مسح الاتجاهات', 'مسح المسار', 'إلغاء المسار', 'إلغاء الاتجاهات', 'إخفاء المسار', 'إزالة المسار', 'مسح خط السير'
  ];
  if (clearDirectionTriggers.some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CLEAR_DIRECTIONS', params: {} };
  }

  // Clear Risk Filter
  const clearRiskTriggers = [
    'clear risk filter', 'clear risk', 'remove risk filter', 'remove risk',
    'reset risk filter', 'reset risk', 'clear the risk filter', 'disable risk filter',
    'إلغاء تصفية الخطورة', 'مسح تصفية الخطورة', 'إزالة تصفية الخطورة', 'إعادة ضبط الخطورة', 'إلغاء فلتر الخطورة'
  ];
  if (clearRiskTriggers.some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CLEAR_RISK_FILTER', params: {} };
  }

  // Expand Search Radius
  const expandRadiusTriggers = [
    'expand search radius', 'expand radius', 'expand the search radius', 'wider radius',
    'increase radius', 'search wider', 'expand search',
    'توسيع نطاق البحث', 'توسيع النطاق', 'زيادة مسافة البحث', 'توسيع البحث'
  ];
  if (expandRadiusTriggers.some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'EXPAND_SEARCH_RADIUS', params: { expandedRadiusKm: 25 } };
  }

  // Facility Details Inspection Intent
  if (['show facility details', 'show details', 'facility details', 'show its details', 'view details', 'عرض تفاصيل المنشأة', 'عرض التفاصيل', 'تفاصيل المنشأة'].some(k => q.includes(k))) {
    return { 
      type: 'APP_CONTROL', 
      action: 'OPEN_FACILITY_DETAIL', 
      target: currentState?.selectedLocation || currentState?.activeContext?.selectedFeature || currentState?.activeResults?.[0] || null 
    };
  }

  // =========================================================================
  // 2. SPECIALIZED CONVERSATIONAL INTENTS (Directions, Analytics, Routing)
  // =========================================================================

  // Directions / Routing
  if (['show me directions', 'give me directions', 'directions', 'route to this facility', 'how do i get there', 'اتجاهات', 'اعرض الاتجاهات'].some(k => q.includes(k))) {
    return { 
      type: 'DIRECTIONS', 
      intent: 'DIRECTIONS',
      target: currentState?.selectedLocation || null 
    };
  }

  // Comparative Analytics on explicit command
  if (['compare these facilities', 'compare them', 'compare facilities', 'compare emissions', 'مقارنة الانبعاثات', 'قارن الانبعاثات'].some(k => q.includes(k))) {
    return { 
      type: 'ANALYTICS', 
      intent: 'COMPARE',
      chartType: 'bar', 
      metric: 'emissions' 
    };
  }
  if (['show the trend', 'trend', 'show trend', 'الاتجاه', 'عرض الاتجاه'].some(k => q.includes(k))) {
    return { 
      type: 'ANALYTICS', 
      intent: 'TREND',
      chartType: 'line', 
      metric: 'water' 
    };
  }

  // Check for Pagination / "Show More" / "List More" queries
  const isPaginationQuery = (
    q === 'show more' || q === 'list more' || q === 'more' || q === 'next' ||
    q.includes('show more facilities') || q.includes('list more facilities') ||
    q.includes('show next 10') || q.includes('next 10') || q.includes('more facilities') ||
    q.includes('more results') || q.includes('show more results') ||
    q.includes('list more') || q.includes('show more') ||
    q.includes('عرض المزيد') || q.includes('المزيد') || q.includes('التالي') ||
    q.includes('عرض 10 إضافية') || q.includes('عرض المزيد من المنشآت') || q.includes('عرض المزيد من النتائج')
  );

  if (isPaginationQuery) {
    return {
      type: 'PAGINATION',
      intent: 'PAGINATE',
      originalQuery: rawQ,
      offset: (currentState?.activeContext?.paginationOffset || 0) + 10,
      limit: 10
    };
  }

  // Deep Risk Analytics, Proximity Comparison & Historical Trends
  if (
    q.includes('which one is worst') || q.includes('which is worst') || q.includes('أيها الأسوأ') || q.includes('أي منها الأكثر خطورة') ||
    q === 'why' || q === 'why?' || q.includes('why is this facility high risk') || q.includes('why high risk') || q.includes('لماذا تعتبر عالية الخطورة') ||
    q === 'compare it' || q.includes('compare this facility with nearby') || q.includes('compare with nearby') || q.includes('مقارنة بالمنشآت المجاورة') ||
    q.includes('show the last 12 months') || q.includes('last 12 months') || q.includes('12 month trend') || q.includes('الـ 12 شهراً الأخيرة')
  ) {
    return {
      type: 'ORCHESTRATOR_TASK',
      intent: 'ORCHESTRATOR_TASK',
      originalQuery: rawQ
    };
  }

  // =========================================================================
  // 3. STRUCTURED GIS QUERY NORMALIZATION & EXTRACTION
  // =========================================================================

  // 3A. Check for explicitly UNAVAILABLE datasets (e.g. libraries, restaurants, banks)
  const unavailableMatch = checkUnavailableDataset(q);
  if (unavailableMatch) {
    return {
      type: 'SPATIAL_SEARCH',
      intent: 'SEARCH',
      originalQuery: rawQ,
      datasetExists: false,
      requestedDataset: unavailableMatch,
      category: null,
      subType: unavailableMatch.id,
      filters: {},
      sort: { field: 'distance', direction: 'asc' }
    };
  }

  // 3B. Extract Spatial Radius
  let radiusKm = null;
  const radiusMetersMatch = q.match(/(\d+)\s*(?:meters|meter|m|متر|متراً)\b/i);
  const radiusKmMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:km|kms|kilometers|kilometer|كم|كيلومتر|كيلومتراً)\b/i);

  if (radiusMetersMatch) {
    radiusKm = parseFloat(radiusMetersMatch[1]) / 1000;
  } else if (radiusKmMatch) {
    radiusKm = parseFloat(radiusKmMatch[1]);
  }

  // 3C. Extract Risk Level Predicate
  let riskLevel = null;
  if (/\bcritical\b/i.test(q) || q.includes('حرج') || q.includes('حرجة') || q.includes('القصوى')) {
    riskLevel = 'Critical';
  } else if (/\bhigh\s*risk\b/i.test(q) || /\bhigh-risk\b/i.test(q) || q.includes('عالي الخطورة') || q.includes('عالية الخطورة') || q.includes('خطورة عالية')) {
    riskLevel = 'High';
  } else if (/\bmoderate\b/i.test(q) || q.includes('متوسط الخطورة') || q.includes('متوسطة الخطورة')) {
    riskLevel = 'Moderate';
  } else if (/\blow\s*risk\b/i.test(q) || q.includes('منخفض الخطورة') || q.includes('منخفضة الخطورة')) {
    riskLevel = 'Low';
  }

  // 3D. Extract Geographic Reference
  const geographicArea = resolveGeographicReference(q);

  // 3E. Extract Reference Location Type
  let referenceLocationType = 'user';
  let spatialRelation = null;

  if (
    q.includes('near this location') || 
    q.includes('near the selected location') || 
    q.includes('near this facility') || 
    q.includes('near selected') || 
    q.includes('near here') || 
    q.includes('around here') || 
    q.includes('بالقرب من هذا الموقع') || 
    q.includes('بالقرب من المنشأة المحددة') || 
    q.includes('حول هذا الموقع') ||
    q.includes('قريب من هنا')
  ) {
    referenceLocationType = 'selected';
    spatialRelation = 'near';
  } else if (geographicArea && (q.includes('around') || q.includes('near') || q.includes('nearby') || q.includes('حول') || q.includes('قريب من') || q.includes('بالقرب من'))) {
    referenceLocationType = 'named';
    spatialRelation = 'near';
  } else if (geographicArea) {
    referenceLocationType = 'named';
    spatialRelation = 'in';
  } else if (q.includes('near me') || q.includes('nearby') || q.includes('closest to me') || q.includes('closest') || q.includes('nearest') || q.includes('قريب مني') || q.includes('الأقرب لي') || q.includes('بالقرب مني')) {
    referenceLocationType = 'user';
    spatialRelation = 'near';
  } else if (radiusKm !== null) {
    referenceLocationType = 'user';
    spatialRelation = 'within';
  }

  // 3F. Extract Sorting & Limits
  let sort = { field: 'distance', direction: 'asc' };
  let limit = null;

  const isClosestQuery = (
    q.includes('which one is closest') || 
    q.includes('which is closest') || 
    q.includes('which is nearest') || 
    q.includes('closest to me') ||
    q.includes('closest to my') ||
    q.includes('which government facility is closest') ||
    q.includes('أيها الأقرب') || 
    q.includes('أقرب منشأة') ||
    q.includes('أقرب حديقة') ||
    q.includes('أقرب مرفق') ||
    q.includes('أيها الأقرب لي')
  );

  const isFurthestQuery = q.includes('furthest') || q.includes('الأبعد');
  const isDistanceSortQuery = q.includes('sorted by distance') || q.includes('order by distance') || q.includes('مرتبة حسب المسافة') || q.includes('حسب القرب');

  if (isClosestQuery) {
    sort = { field: 'distance', direction: 'asc' };
    // "Which government facility is closest to me?" or "which one is closest" targets the single best match
    if (q.startsWith('which ') || q.includes('أيها') || q.includes('أقرب منشأة')) {
      limit = 1;
    }
  } else if (isFurthestQuery) {
    sort = { field: 'distance', direction: 'desc' };
  } else if (isDistanceSortQuery) {
    sort = { field: 'distance', direction: 'asc' };
  }

  // Explicit limit / top N extraction (e.g. "top 10", "top 5", "أفضل 5")
  const topMatch = q.match(/(?:top|first|أفضل|أول)\s+(\d+)/i);
  if (topMatch) {
    limit = parseInt(topMatch[1], 10);
  }

  // 3G. Resolve Canonical Category from Vocabulary
  let category = resolveCanonicalCategory(q);
  if (!category && (isClosestQuery || q.includes('these facilities') || q.includes('هذه المنشآت'))) {
    if (currentState?.activeContext?.category) {
      category = currentState.activeContext.category;
    }
  }

  // 3H. Precise Sub-Types (Strict Word Boundaries to avoid false positives like "port" in "export")
  let subType = null;
  if (hasAnyWord(q, ['museum', 'museums', 'متحف'])) subType = 'museum';
  else if (hasAnyWord(q, ['mosque', 'mosques', 'masjid', 'مسجد', 'جامع'])) subType = 'mosque';
  else if (hasAnyWord(q, ['palace', 'palaces', 'قصر'])) subType = 'palace';
  else if (hasAnyWord(q, ['louvre', 'لوفر'])) subType = 'louvre';
  else if (hasAnyWord(q, ['beach', 'beaches', 'شاطئ'])) subType = 'beach';
  else if (hasAnyWord(q, ['park', 'parks', 'garden', 'gardens', 'حديقة', 'منتزه']) && !hasWord(q, 'parking')) subType = 'park';
  else if (hasAnyWord(q, ['police', 'شرطة'])) subType = 'police';
  else if (hasAnyWord(q, ['ambulance', 'ambulances', 'إسعاف'])) subType = 'ambulance';
  else if (hasAnyWord(q, ['hospital', 'hospitals', 'مستشفى'])) subType = 'hospital';
  else if (hasAnyWord(q, ['clinic', 'clinics', 'عيادة'])) subType = 'clinic';
  else if (hasAnyWord(q, ['university', 'universities', 'جامعة'])) subType = 'university';
  else if (hasAnyWord(q, ['college', 'colleges', 'كلية'])) subType = 'college';
  else if (hasAnyWord(q, ['bus', 'buses', 'حافلة', 'حافلات'])) subType = 'bus';
  else if (hasAnyWord(q, ['airport', 'airports', 'مطار'])) subType = 'airport';
  else if (hasAnyWord(q, ['port', 'ports', 'seaport', 'seaports', 'harbor', 'harbour', 'ميناء', 'موانئ'])) subType = 'port';
  else if (hasAnyWord(q, ['desalination', 'desal', 'تحلية'])) subType = 'desalination';
  else if (hasAnyWord(q, ['power', 'grid', 'طاقة', 'كهرباء'])) subType = 'power';
  else if (hasAnyWord(q, ['tamm', 'مركز تم', 'منصة تم', 'مراكز تم'])) subType = 'tamm';
  else if (hasAnyWord(q, ['municipality', 'municipal', 'بلدية'])) subType = 'municipality';
  else if (isClosestQuery && currentState?.activeContext?.subType) {
    subType = currentState.activeContext.subType;
  }

  // 3I. Intent-Aware Scoping & Layer Auto-Activation
  const activeSubcategories = Array.isArray(currentState?.selectedGisSubcategories) ? currentState.selectedGisSubcategories : [];
  const hasActiveDrawerScope = activeSubcategories.length > 0;

  let isRefinement = false;
  let activeSubcategoryScope = null;
  let autoActivateSubcategories = null;
  let autoActivateCategory = null;

  // Case 1: Refinement Query within active drawer scope
  // If user has active subcategories in drawer AND did NOT name an explicit new category/subType
  // e.g., "show high risk facilities", "which one is closest", "show those in Al Bateen", "within 5 km"
  // BUT general queries asking for all facilities, facilities near a location, or un-scoped queries MUST NOT be restricted!
  const isGlobalFacilityQuery = (
    q.includes('all facilities') || 
    q.includes('every facility') ||
    q.includes('show all') || 
    q.includes('facilities near') ||
    q.includes('near this location') ||
    q.includes('near here') ||
    q.includes('around here') ||
    q.includes('near this facility') ||
    q.includes('what is near') ||
    q.includes('facilities near me') ||
    q.includes('what facilities') ||
    q.includes('كافة المنشآت') ||
    q.includes('جميع المنشآت') ||
    q.includes('كل المنشآت') ||
    q.includes('منشآت قريبة') ||
    q.includes('بالقرب من هذا الموقع')
  );

  if (hasActiveDrawerScope && !category && !subType && !isGlobalFacilityQuery) {
    isRefinement = true;
    activeSubcategoryScope = [...activeSubcategories];
  }

  // Case 2: Cross-Category or Category Query -> Auto-activate in Category Drawer
  if (subType || category) {
    let matchedSubId = null;
    if (subType && SUBTYPE_TO_SUBCATEGORY_ID[subType]) {
      matchedSubId = SUBTYPE_TO_SUBCATEGORY_ID[subType];
    } else if (category) {
      const catTreeId = CANONICAL_TO_CATEGORY_ID[category];
      const catObj = CATEGORY_TREE.find(c => c.id === catTreeId);
      if (catObj && catObj.subcategories.length > 0) {
        matchedSubId = catObj.subcategories[0].id;
      }
    }

    if (matchedSubId) {
      autoActivateSubcategories = [matchedSubId];
      const parentCat = findCategoryBySubcategoryId(matchedSubId);
      if (parentCat) {
        autoActivateCategory = parentCat.id;
      }
    }
  }

  // 3J. Check for Ambiguous Queries (Only if no category, no subType, no risk, and not a refinement)
  const isAmbiguousQuery = (
    (!category && !subType && !riskLevel && !isRefinement) &&
    (
      q === 'facilities' || 
      q === 'show facilities' || 
      q === 'find facilities' || 
      q === 'facilities near me' || 
      q === 'what is near me' ||
      q === 'منشآت' ||
      q === 'اعرض المنشآت' ||
      q === 'منشآت قريبة'
    )
  );

  if (isAmbiguousQuery) {
    return {
      type: 'AMBIGUOUS',
      intent: 'AMBIGUOUS',
      originalQuery: rawQ,
      datasetExists: true,
      category: null,
      filters: {},
      suggestions: [
        'Show government facilities',
        'Show tourism landmarks',
        'Show parks near me',
        'Show public transit'
      ]
    };
  }

  // 3K. Check for Drawn Shape Spatial Queries
  const isDrawnShapeQuery = Boolean(
    q.includes('in this area') || q.includes('in the area') || q.includes('in the drawn') || 
    q.includes('in drawn') || q.includes('in this drawn area') || q.includes('in drawn area') ||
    q.includes('in selected area') || q.includes('in this zone') || q.includes('in the zone') ||
    q.includes('within this area') || q.includes('within the drawn area') || q.includes('inside this area') ||
    q.includes('inside the shape') || q.includes('in the circle') || q.includes('in the box') || 
    q.includes('within drawn') || q.includes('في المنطقة المحددة') || q.includes('في هذه المنطقة المحددة') ||
    q.includes('في هذه المنطقة') || q.includes('في المنطقة') || q.includes('في الرسم') || 
    q.includes('ضمن الشكل') || q.includes('في الدائرة') || q.includes('في المربع') || 
    q.includes('داخل الرسم') || q.includes('داخل هذه المنطقة') || q.includes('ضمن هذه المنطقة')
  );

  // 3L. Build and return canonical NormalizedQuery
  return {
    type: isClosestQuery && limit === 1 ? 'PROXIMITY_RANK' : 'SPATIAL_SEARCH',
    intent: isClosestQuery ? 'CLOSEST' : 'SEARCH',
    originalQuery: rawQ,
    datasetExists: true,
    category,
    categoryMetadata: category ? CATEGORY_METADATA[category] : null,
    subType,
    geographicArea,
    spatialRelation,
    referenceLocationType,
    radiusKm,
    filters: {
      ...(riskLevel ? { riskLevel } : {})
    },
    sort,
    limit,
    isRefinement,
    activeSubcategoryScope,
    autoActivateSubcategories,
    autoActivateCategory,
    isDrawnShapeQuery
  };
}
