// Central GIS Category & Subcategory Taxonomy for GeoVision / SmartMap
// Matches the authoritative specification from GeoVision U Map (geo-vision-u-map.vercel.app)
// 16 Primary Categories, 71 Granular Subcategories with full bilingual (EN/AR) support

export const CATEGORY_TREE = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    name_ar: 'الرعاية الصحية',
    iconName: 'Activity',
    badgeColor: '#10b981', // green
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/20',
    subcategories: [
      { id: 'hospitals', name: 'Hospitals', name_ar: 'المستشفيات التخصصية' },
      { id: 'clinics', name: 'Clinics', name_ar: 'العيادات والمراكز الصحية' },
      { id: 'pharmacies', name: 'Pharmacies', name_ar: 'الصيدليات' },
      { id: 'medical_centers', name: 'Medical Centers', name_ar: 'المراكز الطبية الشاملة' }
    ]
  },
  {
    id: 'transportation',
    name: 'Transport',
    name_ar: 'النقل والمواصلات',
    iconName: 'Bus',
    badgeColor: '#f59e0b', // amber
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20',
    subcategories: [
      { id: 'bus_stations', name: 'Bus Stations', name_ar: 'محطات الحافلات العامة' },
      { id: 'metro_lines', name: 'Metro Lines', name_ar: 'خطوط المترو والسكك الحديدية' },
      { id: 'taxi_stands', name: 'Taxi Stands', name_ar: 'مواقف سيارات الأجرة' },
      { id: 'parking_lots', name: 'Parking Lots', name_ar: 'مواقف السيارات' },
      { id: 'airports', name: 'Airports', name_ar: 'المطارات المدنية' },
      { id: 'seaports', name: 'Seaports', name_ar: 'الموانئ البحرية' },
      { id: 'petrol_stations', name: 'Petrol Stations', name_ar: 'محطات الوقود' },
      { id: 'vehicle_inspection', name: 'Vehicle Inspection Centers', name_ar: 'مراكز فحص المركبات' }
    ]
  },
  {
    id: 'environment',
    name: 'Environment',
    name_ar: 'البيئة والاستدامة',
    iconName: 'TreePine',
    badgeColor: '#10b981', // green
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/20',
    subcategories: [
      { id: 'air_quality_sensors', name: 'Air Quality Sensors', name_ar: 'أجهزة استشعار جودة الهواء' },
      { id: 'protected_areas', name: 'Protected Areas', name_ar: 'المحميات الطبيعية' },
      { id: 'recycling_centers', name: 'Recycling Centers', name_ar: 'مراكز إعادة التدوير' },
      { id: 'waste_management', name: 'Waste Management', name_ar: 'إدارة ومعالجة النفايات' }
    ]
  },
  {
    id: 'government',
    name: 'Government Services',
    name_ar: 'الخدمات الحكومية',
    iconName: 'Building',
    badgeColor: '#8b5cf6', // purple
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 dark:bg-purple-500/20',
    subcategories: [
      { id: 'ministries', name: 'Ministries', name_ar: 'الوزارات الاتحادية والمحلية' },
      { id: 'embassies', name: 'Embassies', name_ar: 'السفارات والقنصليات' },
      { id: 'courts', name: 'Courts', name_ar: 'المحاكم والدوائر القضائية' },
      { id: 'municipalities', name: 'Municipalities', name_ar: 'مراكز البلديات' },
      { id: 'service_centers', name: 'Service Centers', name_ar: 'مراكز خدمة المتعاملين (تم)' }
    ]
  },
  {
    id: 'tourism',
    name: 'Tourism',
    name_ar: 'السياحة والتراث',
    iconName: 'Landmark',
    badgeColor: '#3b82f6', // blue
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 dark:bg-blue-500/20',
    subcategories: [
      { id: 'hotels', name: 'Hotels', name_ar: 'الفنادق والضيافة' },
      { id: 'museums', name: 'Museums', name_ar: 'المتاحف والمعارض' },
      { id: 'historical_sites', name: 'Historical Sites', name_ar: 'المواقع التاريخية والأثرية' },
      { id: 'resorts', name: 'Resorts', name_ar: 'المنتجعات السياحية' },
      { id: 'attractions', name: 'Attractions', name_ar: 'الوجهات والمعالم الترفيهية' }
    ]
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    name_ar: 'البنية التحتية',
    iconName: 'Building2',
    badgeColor: '#f59e0b', // amber
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20',
    subcategories: [
      { id: 'bridges', name: 'Bridges', name_ar: 'الجسور والتقاطعات' },
      { id: 'road_networks', name: 'Road Networks', name_ar: 'شبكات الطرق السريعة' },
      { id: 'port_facilities', name: 'Port Facilities', name_ar: 'مرافق وأرصفة الموانئ' },
      { id: 'public_lighting', name: 'Public Lighting', name_ar: 'شبكات الإنارة العامة' }
    ]
  },
  {
    id: 'housing',
    name: 'Housing',
    name_ar: 'الإسكان والمجتمعات',
    iconName: 'Home',
    badgeColor: '#8b5cf6', // purple
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 dark:bg-purple-500/20',
    subcategories: [
      { id: 'residential_complexes', name: 'Residential Complexes', name_ar: 'المجمعات السكنية' },
      { id: 'public_housing', name: 'Public Housing', name_ar: 'مشاريع الإسكان الحكومي' },
      { id: 'villas', name: 'Villas', name_ar: 'الفلل السكنية' },
      { id: 'commercial_buildings', name: 'Commercial Buildings', name_ar: 'المباني التجارية والمكتبية' }
    ]
  },
  {
    id: 'public_safety',
    name: 'Public Safety',
    name_ar: 'السلامة العامة والأمن',
    iconName: 'Shield',
    badgeColor: '#f43f5e', // rose
    badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 dark:bg-rose-500/20',
    subcategories: [
      { id: 'police_stations', name: 'Police Stations', name_ar: 'مراكز الشرطة' },
      { id: 'fire_stations', name: 'Fire Stations', name_ar: 'مراكز الإطفاء' },
      { id: 'civil_defense', name: 'Civil Defense', name_ar: 'مراكز الدفاع المدني' },
      { id: 'emergency_centers', name: 'Emergency Centers', name_ar: 'مراكز الإسعاف والطوارئ' }
    ]
  },
  {
    id: 'utilities',
    name: 'Utilities',
    name_ar: 'المرافق والخدمات',
    iconName: 'Zap',
    badgeColor: '#f59e0b', // amber
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20',
    subcategories: [
      { id: 'power_stations', name: 'Power Stations', name_ar: 'محطات توليد الكهرباء' },
      { id: 'water_treatment', name: 'Water Treatment', name_ar: 'محطات معالجة وتحلية المياه' },
      { id: 'substations', name: 'Substations', name_ar: 'محطات التحويل الكهربائية' },
      { id: 'telecom_towers', name: 'Telecom Towers', name_ar: 'أبراج الاتصالات وشبكات 5G' }
    ]
  },
  {
    id: 'climate',
    name: 'Climate',
    name_ar: 'المناخ والطقس',
    iconName: 'CloudRain',
    badgeColor: '#3b82f6', // blue
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 dark:bg-blue-500/20',
    subcategories: [
      { id: 'weather_stations', name: 'Weather Stations', name_ar: 'محطات الرصد الجوي' },
      { id: 'solar_plants', name: 'Solar Plants', name_ar: 'محطات الطاقة الشمسية' },
      { id: 'co2_monitoring', name: 'CO2 Monitoring', name_ar: 'محطات مراقبة انبعاثات الكربون' },
      { id: 'coastal_protection', name: 'Coastal Protection', name_ar: 'حواجز حماية السواحل' }
    ]
  },
  {
    id: 'construction',
    name: 'Construction',
    name_ar: 'البناء والتشييد',
    iconName: 'Hammer',
    badgeColor: '#f59e0b', // amber
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20',
    subcategories: [
      { id: 'construction_sites', name: 'Active Construction Sites', name_ar: 'مواقع البناء النشطة' },
      { id: 'development_projects', name: 'Development Projects', name_ar: 'مشاريع التطوير الكبرى' },
      { id: 'zoning_permits', name: 'Zoning Permits', name_ar: 'تصاريح استخدام وتطوير الأراضي' }
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    name_ar: 'الطاقة والشبكات',
    iconName: 'Zap',
    badgeColor: '#f59e0b', // amber
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20',
    subcategories: [
      { id: 'energy_substations', name: 'Substations', name_ar: 'محطات التحويل والربط' },
      { id: 'gas_networks', name: 'Gas Networks', name_ar: 'شبكات الغاز الطبيعي' },
      { id: 'renewable_energy', name: 'Renewable Energy', name_ar: 'مشاريع الطاقة المتجددة' },
      { id: 'grid_terminals', name: 'Grid Terminals', name_ar: 'محطات الربط الكهربائي الرئيسية' }
    ]
  },
  {
    id: 'park',
    name: 'Parks',
    name_ar: 'الحدائق والمتنزهات',
    iconName: 'TreePine',
    badgeColor: '#10b981', // green
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/20',
    subcategories: [
      { id: 'public_parks', name: 'Public Parks', name_ar: 'الحدائق العامة' },
      { id: 'playgrounds', name: 'Playgrounds', name_ar: 'ملاعب وساحات الأطفال' },
      { id: 'gardens', name: 'Gardens', name_ar: 'الحدائق النباتية والمتخصصة' },
      { id: 'national_parks', name: 'National Parks', name_ar: 'المحميات والمتنزهات الوطنية' }
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    name_ar: 'الزراعة والأمن الغذائي',
    iconName: 'Sprout',
    badgeColor: '#10b981', // green
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/20',
    subcategories: [
      { id: 'farms', name: 'Farms', name_ar: 'المزارع الإنتاجية' },
      { id: 'greenhouses', name: 'Greenhouses', name_ar: 'البيوت المحمية الحديثة' },
      { id: 'irrigation_systems', name: 'Irrigation Systems', name_ar: 'أنظمة الري الذكية' },
      { id: 'livestock_centers', name: 'Livestock Centers', name_ar: 'مراكز الثروة الحيوانية والبيطرية' }
    ]
  },
  {
    id: 'employment',
    name: 'Employment',
    name_ar: 'التوظيف والأعمال',
    iconName: 'Briefcase',
    badgeColor: '#8b5cf6', // purple
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 dark:bg-purple-500/20',
    subcategories: [
      { id: 'business_hubs', name: 'Business Hubs', name_ar: 'مراكز الأعمال وحاضنات المشاريع' },
      { id: 'free_zones', name: 'Free Zones', name_ar: 'المناطق الحرة الاقتصادية' },
      { id: 'job_centers', name: 'Job Centers', name_ar: 'مراكز التوظيف وتنمية الكفاءات' },
      { id: 'corporate_hqs', name: 'Corporate HQs', name_ar: 'المقار الرئيسية للشركات' }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    name_ar: 'التعليم',
    iconName: 'GraduationCap',
    badgeColor: '#10b981', // green
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/20',
    subcategories: [
      { id: 'pod', name: 'POD', name_ar: 'مراكز أصحاب الهمم' },
      { id: 'public_schools', name: 'Public Schools', name_ar: 'المدارس الحكومية' },
      { id: 'private_schools', name: 'Private Schools', name_ar: 'المدارس الخاصة' },
      { id: 'charter_schools', name: 'Charter Schools', name_ar: 'مدارس الشراكة التعليمية' },
      { id: 'nurseries', name: 'Nurseries', name_ar: 'دور الحضانة ورياض الأطفال' }
    ]
  }
];

export const TOTAL_CATEGORIES_COUNT = CATEGORY_TREE.length; // 16
export const TOTAL_SUBCATEGORIES_COUNT = CATEGORY_TREE.reduce((acc, cat) => acc + cat.subcategories.length, 0); // 71

// Helper to look up localized category name
export function getCategoryLocalizedName(catOrName, isArabic = false) {
  if (!catOrName) return '';
  const match = CATEGORY_TREE.find(c => 
    c.id === catOrName || 
    c.name.toLowerCase() === catOrName.toLowerCase() || 
    c.name_ar === catOrName
  );
  if (!match) return catOrName;
  return isArabic ? match.name_ar : match.name;
  }

// Helper to look up localized subcategory name
export function getSubcategoryLocalizedName(subName, isArabic = false) {
  if (!subName) return '';
  const clean = subName.trim().toLowerCase();
  for (const cat of CATEGORY_TREE) {
    for (const sub of cat.subcategories) {
      if (sub.id === clean || sub.name.toLowerCase() === clean || sub.name_ar === subName) {
        return isArabic ? sub.name_ar : sub.name;
      }
    }
  }
  return subName;
}

// Find parent category object by subcategory ID
export function findCategoryBySubcategoryId(subId) {
  if (!subId) return null;
  const clean = subId.trim().toLowerCase();
  for (const cat of CATEGORY_TREE) {
    if (cat.subcategories.some(s => s.id === clean)) {
      return cat;
    }
  }
  return null;
}

// Map Canonical Category (from vocabulary) to matching CategoryTree category ID
export const CANONICAL_TO_CATEGORY_ID = {
  EDUCATION: 'education',
  HOSPITAL: 'healthcare',
  HEALTHCARE: 'healthcare',
  TRANSPORT: 'transportation',
  ENVIRONMENT: 'environment',
  GOVERNMENT: 'government',
  TOURISM: 'tourism',
  INFRASTRUCTURE: 'infrastructure',
  HOUSING: 'housing',
  PUBLIC_SAFETY: 'public_safety',
  CIVIC_INFRASTRUCTURE: 'utilities',
  UTILITIES: 'utilities',
  CLIMATE: 'climate',
  CONSTRUCTION: 'construction',
  ENERGY: 'energy',
  PARK: 'park',
  AGRICULTURE: 'agriculture',
  EMPLOYMENT: 'employment'
};

// Map SubType names or keywords to specific Subcategory IDs
export const SUBTYPE_TO_SUBCATEGORY_ID = {
  hospitals: 'hospitals',
  hospital: 'hospitals',
  clinics: 'clinics',
  clinic: 'clinics',
  pharmacies: 'pharmacies',
  pharmacy: 'pharmacies',
  medical_centers: 'medical_centers',
  medical: 'medical_centers',
  bus: 'bus_stations',
  bus_stations: 'bus_stations',
  metro: 'metro_lines',
  train: 'metro_lines',
  metro_lines: 'metro_lines',
  taxi: 'taxi_stands',
  taxi_stands: 'taxi_stands',
  parking: 'parking_lots',
  parking_lots: 'parking_lots',
  airport: 'airports',
  airports: 'airports',
  port: 'seaports',
  seaport: 'seaports',
  seaports: 'seaports',
  petrol: 'petrol_stations',
  fuel: 'petrol_stations',
  gas_station: 'petrol_stations',
  petrol_stations: 'petrol_stations',
  vehicle_inspection: 'vehicle_inspection',
  sensors: 'air_quality_sensors',
  air_quality_sensors: 'air_quality_sensors',
  protected: 'protected_areas',
  protected_areas: 'protected_areas',
  recycling: 'recycling_centers',
  recycling_centers: 'recycling_centers',
  waste: 'waste_management',
  waste_management: 'waste_management',
  ministries: 'ministries',
  ministry: 'ministries',
  embassies: 'embassies',
  embassy: 'embassies',
  courts: 'courts',
  court: 'courts',
  municipalities: 'municipalities',
  municipality: 'municipalities',
  service_centers: 'service_centers',
  tamm: 'service_centers',
  hotels: 'hotels',
  hotel: 'hotels',
  museums: 'museums',
  museum: 'museums',
  louvre: 'museums',
  palace: 'historical_sites',
  historical_sites: 'historical_sites',
  resorts: 'resorts',
  resort: 'resorts',
  attractions: 'attractions',
  grand_mosque: 'attractions',
  mosque: 'attractions',
  bridges: 'bridges',
  bridge: 'bridges',
  road_networks: 'road_networks',
  highway: 'road_networks',
  port_facilities: 'port_facilities',
  public_lighting: 'public_lighting',
  lighting: 'public_lighting',
  residential_complexes: 'residential_complexes',
  residential: 'residential_complexes',
  public_housing: 'public_housing',
  villas: 'villas',
  villa: 'villas',
  commercial_buildings: 'commercial_buildings',
  commercial: 'commercial_buildings',
  police: 'police_stations',
  police_stations: 'police_stations',
  fire: 'fire_stations',
  fire_stations: 'fire_stations',
  civil_defense: 'civil_defense',
  emergency_centers: 'emergency_centers',
  ambulance: 'emergency_centers',
  power_stations: 'power_stations',
  power: 'power_stations',
  water_treatment: 'water_treatment',
  desalination: 'power_stations',
  substations: 'substations',
  telecom_towers: 'telecom_towers',
  weather_stations: 'weather_stations',
  weather: 'weather_stations',
  solar_plants: 'solar_plants',
  solar: 'solar_plants',
  co2_monitoring: 'co2_monitoring',
  carbon: 'co2_monitoring',
  coastal_protection: 'coastal_protection',
  construction_sites: 'construction_sites',
  development_projects: 'development_projects',
  zoning_permits: 'zoning_permits',
  energy_substations: 'energy_substations',
  gas_networks: 'gas_networks',
  renewable_energy: 'renewable_energy',
  grid_terminals: 'grid_terminals',
  public_parks: 'public_parks',
  park: 'public_parks',
  playgrounds: 'playgrounds',
  gardens: 'gardens',
  national_parks: 'national_parks',
  farms: 'farms',
  greenhouses: 'greenhouses',
  irrigation_systems: 'irrigation_systems',
  livestock_centers: 'livestock_centers',
  business_hubs: 'business_hubs',
  free_zones: 'free_zones',
  job_centers: 'job_centers',
  corporate_hqs: 'corporate_hqs',
  pod: 'pod',
  public_schools: 'public_schools',
  private_schools: 'private_schools',
  charter_schools: 'charter_schools',
  charter_school: 'charter_schools',
  nurseries: 'nurseries',
  nursery: 'nurseries',
  kindergarten: 'nurseries',
  school: 'public_schools',
  schools: 'public_schools',
  university: 'public_schools'
};

