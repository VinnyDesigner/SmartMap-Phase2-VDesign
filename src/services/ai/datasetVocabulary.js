// Authoritative Dataset Vocabulary & Semantic Mapping Layer for GeoVision / SmartMap
// Governs valid entity types, categories, sub-categories, attributes, geographic landmarks,
// and explicitly registers concepts that are NOT present in the dataset to prevent hallucinations.

export const CANONICAL_CATEGORIES = {
  EDUCATION: 'EDUCATION',
  HOSPITAL: 'HOSPITAL',
  HEALTHCARE: 'HOSPITAL',
  TRANSPORT: 'TRANSPORT',
  ENVIRONMENT: 'ENVIRONMENT',
  GOVERNMENT: 'GOVERNMENT',
  TOURISM: 'TOURISM',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  HOUSING: 'HOUSING',
  PUBLIC_SAFETY: 'PUBLIC_SAFETY',
  UTILITIES: 'CIVIC_INFRASTRUCTURE',
  CLIMATE: 'CLIMATE',
  CONSTRUCTION: 'CONSTRUCTION',
  ENERGY: 'ENERGY',
  PARK: 'PARK',
  AGRICULTURE: 'AGRICULTURE',
  EMPLOYMENT: 'EMPLOYMENT',
  CIVIC_INFRASTRUCTURE: 'CIVIC_INFRASTRUCTURE',
  MANUFACTURING: 'MANUFACTURING'
};

export const CATEGORY_METADATA = {
  [CANONICAL_CATEGORIES.GOVERNMENT]: {
    name_en: 'Government Services',
    name_ar: 'الخدمات الحكومية',
    subTypes: ['ministries', 'embassies', 'courts', 'municipalities', 'service_centers', 'executive', 'tamm', 'municipality', 'judicial'],
    tags: ['government', 'ministry', 'embassy', 'court', 'municipality', 'service center', 'dge', 'sdi', 'enablement', 'headquarters', 'tamm', 'civic', 'public service']
  },
  [CANONICAL_CATEGORIES.TOURISM]: {
    name_en: 'Tourism',
    name_ar: 'السياحة والتراث',
    subTypes: ['hotels', 'museums', 'historical_sites', 'resorts', 'attractions', 'palace', 'mosque', 'heritage', 'beach', 'landmark'],
    tags: ['tourism', 'hotel', 'museum', 'historical site', 'resort', 'attraction', 'louvre', 'palace', 'qasr al watan', 'mosque', 'sheikh zayed', 'grand mosque', 'heritage', 'culture', 'landmark']
  },
  [CANONICAL_CATEGORIES.PARK]: {
    name_en: 'Parks',
    name_ar: 'الحدائق والمتنزهات',
    subTypes: ['public_parks', 'playgrounds', 'gardens', 'national_parks', 'garden', 'recreation', 'waterfront_park'],
    tags: ['park', 'public park', 'playground', 'garden', 'national park', 'recreation', 'green', 'botanical', 'umm al emarat', 'yas gateway', 'mushrif']
  },
  [CANONICAL_CATEGORIES.TRANSPORT]: {
    name_en: 'Transport',
    name_ar: 'النقل والمواصلات',
    subTypes: ['bus_stations', 'metro_lines', 'taxi_stands', 'parking_lots', 'airports', 'seaports', 'petrol_stations', 'vehicle_inspection', 'bus', 'airport', 'port', 'transit', 'parking'],
    tags: ['transport', 'transit', 'bus', 'metro', 'taxi', 'parking', 'airport', 'seaport', 'petrol', 'gas station', 'vehicle inspection', 'mobility']
  },
  [CANONICAL_CATEGORIES.HOSPITAL]: {
    name_en: 'Healthcare',
    name_ar: 'الرعاية الصحية',
    subTypes: ['hospitals', 'clinics', 'pharmacies', 'medical_centers', 'hospital', 'clinic', 'medical_city', 'trauma'],
    tags: ['healthcare', 'hospital', 'clinic', 'pharmacy', 'medical center', 'medical', 'cleveland', 'ssmc', 'health']
  },
  [CANONICAL_CATEGORIES.EDUCATION]: {
    name_en: 'Education',
    name_ar: 'التعليم',
    subTypes: ['charter_schools', 'nurseries', 'pod', 'public_schools', 'private_schools', 'university', 'college', 'campus'],
    tags: ['education', 'charter school', 'nursery', 'pod', 'people of determination', 'public school', 'private school', 'school', 'university', 'college', 'khalifa university', 'sorbonne', 'campus', 'academic']
  },
  [CANONICAL_CATEGORIES.MANUFACTURING]: {
    name_en: 'Manufacturing',
    name_ar: 'التصنيع والصناعة',
    subTypes: ['manufacturing', 'industrial', 'metals', 'plant'],
    tags: ['manufacturing', 'industrial', 'mussafah', 'kizad', 'taweelah', 'metals', 'heavy industrial', 'factory', 'plant']
  },
  [CANONICAL_CATEGORIES.CIVIC_INFRASTRUCTURE]: {
    name_en: 'Utilities',
    name_ar: 'المرافق والخدمات',
    subTypes: ['power_stations', 'water_treatment', 'substations', 'telecom_towers', 'utility', 'desalination', 'power', 'water', 'waste'],
    tags: ['utilities', 'utility', 'power station', 'water treatment', 'substation', 'telecom tower', 'desalination', 'electricity', 'energy', 'waste']
  },
  [CANONICAL_CATEGORIES.PUBLIC_SAFETY]: {
    name_en: 'Public Safety',
    name_ar: 'السلامة العامة والأمن',
    subTypes: ['police_stations', 'fire_stations', 'civil_defense', 'emergency_centers', 'police', 'ambulance', 'emergency'],
    tags: ['public_safety', 'safety', 'police', 'police station', 'fire station', 'civil defense', 'ambulance', 'emergency', 'precinct']
  },
  [CANONICAL_CATEGORIES.ENVIRONMENT]: {
    name_en: 'Environment',
    name_ar: 'البيئة والاستدامة',
    subTypes: ['air_quality_sensors', 'protected_areas', 'recycling_centers', 'waste_management', 'mangrove', 'wetland', 'reserve'],
    tags: ['environment', 'air quality', 'sensor', 'protected area', 'recycling', 'waste management', 'mangrove', 'wetland', 'reserve', 'conservation']
  },
  [CANONICAL_CATEGORIES.INFRASTRUCTURE]: {
    name_en: 'Infrastructure',
    name_ar: 'البنية التحتية',
    subTypes: ['bridges', 'road_networks', 'port_facilities', 'public_lighting'],
    tags: ['infrastructure', 'bridge', 'road', 'highway', 'network', 'port facility', 'lighting', 'civic infrastructure']
  },
  [CANONICAL_CATEGORIES.HOUSING]: {
    name_en: 'Housing',
    name_ar: 'الإسكان والمجتمعات',
    subTypes: ['residential_complexes', 'public_housing', 'villas', 'commercial_buildings'],
    tags: ['housing', 'residential', 'residential complex', 'public housing', 'villa', 'commercial building', 'apartment', 'neighborhood']
  },
  [CANONICAL_CATEGORIES.CLIMATE]: {
    name_en: 'Climate',
    name_ar: 'المناخ والطقس',
    subTypes: ['weather_stations', 'solar_plants', 'co2_monitoring', 'coastal_protection'],
    tags: ['climate', 'weather station', 'solar plant', 'co2', 'carbon', 'coastal protection', 'sustainability']
  },
  [CANONICAL_CATEGORIES.CONSTRUCTION]: {
    name_en: 'Construction',
    name_ar: 'البناء والتشييد',
    subTypes: ['construction_sites', 'development_projects', 'zoning_permits'],
    tags: ['construction', 'active construction', 'development project', 'zoning', 'permit', 'contractor', 'building site']
  },
  [CANONICAL_CATEGORIES.ENERGY]: {
    name_en: 'Energy',
    name_ar: 'الطاقة والشبكات',
    subTypes: ['energy_substations', 'gas_networks', 'renewable_energy', 'grid_terminals'],
    tags: ['energy', 'substation', 'gas network', 'renewable energy', 'grid terminal', 'solar', 'clean energy', 'power grid']
  },
  [CANONICAL_CATEGORIES.AGRICULTURE]: {
    name_en: 'Agriculture',
    name_ar: 'الزراعة والأمن الغذائي',
    subTypes: ['farms', 'greenhouses', 'irrigation_systems', 'livestock_centers'],
    tags: ['agriculture', 'farm', 'greenhouse', 'irrigation', 'livestock', 'crops', 'farming', 'food security']
  },
  [CANONICAL_CATEGORIES.EMPLOYMENT]: {
    name_en: 'Employment',
    name_ar: 'التوظيف والأعمال',
    subTypes: ['business_hubs', 'free_zones', 'job_centers', 'corporate_hqs'],
    tags: ['employment', 'business hub', 'free zone', 'job center', 'corporate hq', 'headquarters', 'business', 'work']
  }
};

// Semantic synonym mappings from natural language phrases to canonical categories
export const SEMANTIC_SYNONYMS = [
  // Government
  { terms: ['government', 'government facilities', 'government facility', 'government services', 'government offices', 'government office', 'government centers', 'government center', 'public government facilities', 'civic centers', 'ministry', 'ministries', 'embassy', 'embassies', 'court', 'courts', 'dge', 'tamm', 'municipality', 'حكومية', 'حكومي', 'خدمات حكومية', 'منشآت حكومية', 'منشأة حكومية', 'مراكز حكومية', 'مركز حكومي', 'دوائر حكومية', 'دائرة حكومية', 'وزارة', 'وزارات', 'سفارة', 'سفارات', 'محكمة', 'محاكم', 'تم', 'بلدية'], category: CANONICAL_CATEGORIES.GOVERNMENT },
  
  // Tourism
  { terms: ['tourism', 'tourist', 'tourist attractions', 'tourist attraction', 'tourism attractions', 'tourism locations', 'attractions', 'attraction', 'cultural landmarks', 'cultural landmark', 'cultural heritage', 'landmarks', 'landmark', 'museums', 'museum', 'hotel', 'hotels', 'resort', 'resorts', 'palaces', 'palace', 'monuments', 'monument', 'mosques', 'mosque', 'سياحة', 'سياحي', 'معالم سياحية', 'معلم سياحي', 'معالم ثقافية', 'معلم ثقافي', 'متاحف', 'متحف', 'فندق', 'فنادق', 'منتجع', 'منتجعات', 'قصور', 'قصر', 'مساجد', 'مسجد', 'جامع', 'جوامع', 'آثار'], category: CANONICAL_CATEGORIES.TOURISM },
  
  // Parks
  { terms: ['park', 'parks', 'public park', 'public parks', 'garden', 'gardens', 'playground', 'playgrounds', 'national park', 'national parks', 'botanical garden', 'green spaces', 'green space', 'recreation', 'recreational', 'حديقة', 'حدائق', 'حديقة عامة', 'حدائق عامة', 'منتزه', 'منتزهات', 'ملاعب أطفال', 'محمية وطنية', 'مساحات خضراء'], category: CANONICAL_CATEGORIES.PARK },
  
  // Transport
  { terms: ['transport', 'transportation', 'transport facilities', 'transportation facilities', 'transit', 'mobility', 'public transit', 'bus', 'buses', 'bus stops', 'bus stop', 'bus stations', 'bus station', 'metro', 'metro lines', 'taxi', 'taxi stands', 'parking', 'parking lots', 'airport', 'airports', 'seaport', 'seaports', 'petrol station', 'petrol stations', 'vehicle inspection', 'نقل', 'مواصلات', 'نقل عام', 'حافلات', 'حافلة', 'محطات حافلات', 'محطة حافلات', 'مترو', 'تاكسي', 'سيارات أجرة', 'مواقف سيارات', 'موقف سيارات', 'مطار', 'مطارات', 'ميناء', 'موانئ', 'محطات وقود', 'فحص مركبات'], category: CANONICAL_CATEGORIES.TRANSPORT },
  
  // Hospitals / Healthcare
  { terms: ['hospital', 'hospitals', 'medical', 'medical center', 'medical centers', 'clinic', 'clinics', 'pharmacy', 'pharmacies', 'healthcare', 'health facilities', 'tertiary care', 'مستشفى', 'مستشفيات', 'مركز طبي', 'مراكز طبية', 'عيادة', 'عيادات', 'صيدلية', 'صيدليات', 'رعاية صحية', 'صحي'], category: CANONICAL_CATEGORIES.HOSPITAL },
  
  // Education
  { terms: ['education', 'school', 'schools', 'public schools', 'public school', 'private schools', 'private school', 'charter schools', 'charter school', 'nursery', 'nurseries', 'pod', 'people of determination', 'university', 'universities', 'college', 'colleges', 'higher education', 'campus', 'campuses', 'تعليم', 'مدارس', 'مدرسة', 'مدارس حكومية', 'مدارس خاصة', 'شراكة تعليمية', 'حضانة', 'حضانات', 'أصحاب الهمم', 'جامعة', 'جامعات', 'كلية', 'كليات', 'تعليم عالي', 'حرم جامعي'], category: CANONICAL_CATEGORIES.EDUCATION },
  
  // Manufacturing
  { terms: ['manufacturing', 'industrial', 'manufacturing facility', 'manufacturing facilities', 'industry', 'industrial zones', 'industrial plants', 'metals', 'heavy industry', 'factory', 'factories', 'صناعة', 'صناعي', 'تصنيع', 'منشآت صناعية', 'منشأة صناعية', 'مصانع', 'مصنع', 'مجمعات صناعية'], category: CANONICAL_CATEGORIES.MANUFACTURING },
  
  // Civic Infrastructure / Utilities
  { terms: ['utilities', 'utility', 'power station', 'power stations', 'water treatment', 'desalination', 'substation', 'substations', 'telecom towers', 'telecom', 'infrastructure', 'مرافق', 'خدمات', 'محطات كهرباء', 'تحلية المياه', 'معالجة المياه', 'محطات تحويل', 'أبراج اتصالات'], category: CANONICAL_CATEGORIES.CIVIC_INFRASTRUCTURE },
  
  // Public Safety
  { terms: ['public safety', 'safety', 'police', 'police stations', 'police station', 'fire station', 'fire stations', 'civil defense', 'emergency centers', 'emergency', 'ambulance', 'ambulance stations', 'سلامة عامة', 'أمن', 'شرطة', 'مراكز شرطة', 'مركز شرطة', 'إطفاء', 'دفاع مدني', 'طوارئ', 'إسعاف'], category: CANONICAL_CATEGORIES.PUBLIC_SAFETY },
  
  // Environment
  { terms: ['environment', 'environmental', 'protected areas', 'protected area', 'air quality', 'air quality sensors', 'recycling', 'recycling centers', 'waste management', 'mangrove', 'mangroves', 'wetlands', 'wetland', 'nature reserve', 'reserves', 'بيئة', 'بيئي', 'محميات', 'محمية', 'استشعار جودة الهواء', 'إعادة تدوير', 'إدارة النفايات', 'محمية طبيعية', 'القرم', 'أشجار القرم'], category: CANONICAL_CATEGORIES.ENVIRONMENT },

  // Infrastructure
  { terms: ['infrastructure', 'bridges', 'bridge', 'road networks', 'roads', 'road', 'highways', 'port facilities', 'public lighting', 'بنية تحتية', 'جسور', 'جسر', 'شبكات طرق', 'طرق', 'إنارة عامة'], category: CANONICAL_CATEGORIES.INFRASTRUCTURE },

  // Housing
  { terms: ['housing', 'residential', 'residential complexes', 'public housing', 'villas', 'villa', 'commercial buildings', 'apartments', 'إسكان', 'سكني', 'مجمعات سكنية', 'إسكان حكومي', 'فلل', 'فيلا', 'مباني تجارية'], category: CANONICAL_CATEGORIES.HOUSING },

  // Climate
  { terms: ['climate', 'weather stations', 'weather', 'solar plants', 'solar plant', 'co2 monitoring', 'carbon', 'coastal protection', 'مناخ', 'طقس', 'محطات رصد جوي', 'طاقة شمسية', 'مراقبة الكربون', 'حماية السواحل'], category: CANONICAL_CATEGORIES.CLIMATE },

  // Construction
  { terms: ['construction', 'construction sites', 'active construction', 'development projects', 'zoning permits', 'zoning', 'بناء', 'تشييد', 'مواقع بناء', 'مشاريع تطوير', 'تصاريح أراضي'], category: CANONICAL_CATEGORIES.CONSTRUCTION },

  // Energy
  { terms: ['energy', 'energy substations', 'gas networks', 'gas network', 'renewable energy', 'grid terminals', 'power grid', 'طاقة', 'شبكات غاز', 'طاقة متجددة', 'ربط شبكي'], category: CANONICAL_CATEGORIES.ENERGY },

  // Agriculture
  { terms: ['agriculture', 'farms', 'farm', 'greenhouses', 'greenhouse', 'irrigation systems', 'irrigation', 'livestock centers', 'livestock', 'food security', 'زراعة', 'مزارع', 'مزرعة', 'بيوت محمية', 'أنظمة ري', 'ثروة حيوانية', 'أمن غذائي'], category: CANONICAL_CATEGORIES.AGRICULTURE },

  // Employment
  { terms: ['employment', 'business hubs', 'business hub', 'free zones', 'free zone', 'job centers', 'job center', 'corporate hqs', 'corporate hq', 'headquarters', 'توظيف', 'أعمال', 'مراكز أعمال', 'مناطق حرة', 'مراكز توظيف', 'مقار شركات'], category: CANONICAL_CATEGORIES.EMPLOYMENT }
];

// Concepts explicitly NOT tracked in the dataset (to prevent hallucinations and gracefully clarify)
export const UNAVAILABLE_DATASETS = [
  {
    id: 'library',
    terms: ['library', 'libraries', 'public library', 'book store', 'bookstore', 'مكتبة', 'مكتبات', 'مكتبة عامة'],
    label_en: 'public library',
    label_ar: 'المكتبات العامة'
  },
  {
    id: 'restaurant',
    terms: ['restaurant', 'restaurants', 'cafe', 'cafes', 'coffee', 'food', 'dining', 'eatery', 'مطعم', 'مطاعم', 'كافيه', 'كافيهات', 'قهوة', 'مقهى'],
    label_en: 'restaurant / cafe',
    label_ar: 'المطاعم والمقاهي'
  },
  {
    id: 'retail',
    terms: ['mall', 'malls', 'shopping mall', 'shopping', 'supermarket', 'supermarkets', 'grocery', 'store', 'shops', 'مول', 'سوق', 'مراكز تسوق', 'سوبرماركت', 'بقالة'],
    label_en: 'shopping mall / retail',
    label_ar: 'المراكز التجارية ومحلات التجزئة'
  },
  {
    id: 'banking',
    terms: ['bank', 'banks', 'atm', 'atms', 'cash machine', 'بنك', 'بنوك', 'صراف', 'صراف آلي', 'مصرف', 'مصارف'],
    label_en: 'bank / ATM',
    label_ar: 'البنوك وأجهزة الصراف الآلي'
  },
  {
    id: 'entertainment',
    terms: ['cinema', 'cinemas', 'movie theater', 'theatre', 'theater', 'bowling', 'arcade', 'سينما', 'مسرح', 'دور عرض'],
    label_en: 'cinema / commercial entertainment',
    label_ar: 'دور السينما والترفيه التجاري'
  },
  {
    id: 'fuel',
    terms: ['petrol station', 'gas station', 'fuel station', 'filling station', 'adnoc dist', 'محطة وقود', 'محطة بنزين', 'وقود', 'بنزين'],
    label_en: 'petrol / gas station',
    label_ar: 'محطات الوقود'
  },
  {
    id: 'fitness',
    terms: ['gym', 'fitness', 'workout', 'bodybuilding', 'sports club', 'صالة رياضية', 'نادي رياضي', 'جيم'],
    label_en: 'fitness gym',
    label_ar: 'الصالات والأندية الرياضية'
  }
];

// Authoritative Geographic Landmarks & Reference Coordinates
export const GEOGRAPHIC_LANDMARKS = [
  {
    id: 'yas-island',
    names: ['yas island', 'yas', 'جزيرة ياس', 'ياس'],
    coords: { lat: 24.4920, lng: 54.6020 },
    name_en: 'Yas Island',
    name_ar: 'جزيرة ياس'
  },
  {
    id: 'saadiyat',
    names: ['saadiyat island', 'saadiyat cultural district', 'saadiyat', 'جزيرة السعديات', 'السعديات'],
    coords: { lat: 24.5338, lng: 54.3982 },
    name_en: 'Saadiyat Island',
    name_ar: 'جزيرة السعديات'
  },
  {
    id: 'corniche',
    names: ['corniche west', 'corniche', 'الكورنيش الغربي', 'الكورنيش'],
    coords: { lat: 24.4789, lng: 54.3312 },
    name_en: 'Corniche',
    name_ar: 'الكورنيش'
  },
  {
    id: 'al-reem',
    names: ['al reem island', 'reem island', 'al reem', 'reem', 'جزيرة الريم', 'الريم'],
    coords: { lat: 24.5028, lng: 54.4056 },
    name_en: 'Al Reem Island',
    name_ar: 'جزيرة الريم'
  },
  {
    id: 'al-bateen',
    names: ['al bateen', 'bateen', 'البطين', 'البتين'],
    coords: { lat: 24.4560, lng: 54.3480 },
    name_en: 'Al Bateen',
    name_ar: 'البطين'
  },
  {
    id: 'al-maryah',
    names: ['al maryah island', 'maryah island', 'maryah', 'جزيرة المارية', 'المارية'],
    coords: { lat: 24.5020, lng: 54.3890 },
    name_en: 'Al Maryah Island',
    name_ar: 'جزيرة المارية'
  },
  {
    id: 'al-mushrif',
    names: ['al mushrif', 'mushrif', 'المشرف'],
    coords: { lat: 24.4533, lng: 54.3879 },
    name_en: 'Al Mushrif',
    name_ar: 'المشرف'
  },
  {
    id: 'al-nahyan',
    names: ['al nahyan', 'nahyan', 'آل نهيان'],
    coords: { lat: 24.4719, lng: 54.3725 },
    name_en: 'Al Nahyan',
    name_ar: 'آل نهيان'
  },
  {
    id: 'mussafah',
    names: ['mussafah', 'mussafah industrial', 'مصفح', 'مصفح الصناعية'],
    coords: { lat: 24.3540, lng: 54.3410 },
    name_en: 'Mussafah',
    name_ar: 'مصفح'
  },
  {
    id: 'al-taweelah',
    names: ['al taweelah', 'taweelah', 'kizad', 'الطويلة', 'كيزاد'],
    coords: { lat: 24.7810, lng: 54.7120 },
    name_en: 'Al Taweelah / KIZAD',
    name_ar: 'الطويلة / كيزاد'
  },
  {
    id: 'downtown',
    names: ['downtown abu dhabi', 'downtown', 'وسط المدينة', 'وسط مدينة أبوظبي'],
    coords: { lat: 24.4710, lng: 54.3640 },
    name_en: 'Downtown Abu Dhabi',
    name_ar: 'وسط مدينة أبوظبي'
  },
  {
    id: 'al-rawdah',
    names: ['al rawdah', 'rawdah', 'الروضة'],
    coords: { lat: 24.4128, lng: 54.4750 },
    name_en: 'Al Rawdah',
    name_ar: 'الروضة'
  },
  {
    id: 'abu-dhabi',
    names: ['abu dhabi', 'abu dhabi city', 'أبوظبي', 'مدينة أبوظبي'],
    coords: { lat: 24.4839, lng: 54.3773 },
    name_en: 'Abu Dhabi',
    name_ar: 'أبوظبي'
  }
];

// Helper: Check if query explicitly asks for an unavailable dataset
export function checkUnavailableDataset(query = '') {
  if (!query) return null;
  const q = query.toLowerCase();
  
  for (const entry of UNAVAILABLE_DATASETS) {
    for (const term of entry.terms) {
      const isArabicOrUnicode = /[^\x00-\x7F]/.test(term);
      if (isArabicOrUnicode) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[\\s،,.;:!?()"\'])${escaped}($|[\\s،,.;:!?()"\'])`, 'i');
        if (regex.test(q)) return entry;
      } else {
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(q)) return entry;
      }
    }
  }
  return null;
}

// Helper: Map natural-language text to a canonical category if supported
export function resolveCanonicalCategory(query = '') {
  if (!query) return null;
  const q = query.toLowerCase();

  for (const syn of SEMANTIC_SYNONYMS) {
    for (const term of syn.terms) {
      const isArabicOrUnicode = /[^\x00-\x7F]/.test(term);
      if (isArabicOrUnicode) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[\\s،,.;:!?()"\'])${escaped}($|[\\s،,.;:!?()"\'])`, 'i');
        if (regex.test(q)) return syn.category;
      } else {
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(q)) return syn.category;
      }
    }
  }
  return null;
}

// Helper: Resolve geographic landmark reference from query
export function resolveGeographicReference(query = '') {
  if (!query) return null;
  const q = query.toLowerCase();

  // Negative check: detect foreign regions explicitly (e.g. Telangana, Dubai, Mumbai)
  if (/\btelangana\b/i.test(q) || q.includes('تيلانجانا')) {
    return { isExternal: true, name: 'Telangana', name_ar: 'تيلانجانا' };
  }
  if (/\bdubai\b/i.test(q) || q.includes('دبي')) {
    return { isExternal: true, name: 'Dubai', name_ar: 'دبي' };
  }
  if (/\bmumbai\b/i.test(q) || q.includes('مومباي')) {
    return { isExternal: true, name: 'Mumbai', name_ar: 'مومباي' };
  }
  if (/\bhyderabad\b/i.test(q) || q.includes('حيدر أباد')) {
    return { isExternal: true, name: 'Hyderabad', name_ar: 'حيدر أباد' };
  }

  for (const landmark of GEOGRAPHIC_LANDMARKS) {
    for (const name of landmark.names) {
      if (q.includes(name)) {
        return { isExternal: false, ...landmark };
      }
    }
  }

  return null;
}
