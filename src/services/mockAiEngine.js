// Universal AI Application Controller & Natural Language Agent for GeoVision / SmartMap
import { ACTION_TYPES } from './actionRegistry.js';
import { parseQueryIntent } from './ai/queryIntentResolver.js';
import { executeGisQuery, getMasterAuthoritativeDataset } from './spatial/gisQueryEngine.js';
import { calculateGeodesicDistance, formatDistance, matchesGisSubcategories } from './spatial/spatialAnalysisService.js';
import { routingService } from './routing/routingService.js';
import { aiOrchestrator } from './ai/aiOrchestrator.js';
import { getCategoryLocalizedName, getSubcategoryLocalizedName } from '../config/categoryTree.js';

// Clean raw markdown formatting characters (e.g. **) from text for clean UI rendering
export function sanitizeMarkdown(text) {
  if (!text) return '';
  return text.replace(/\*\*/g, '').replace(/###\s*/g, '').trim();
}

// Master Multi-Theme Abu Dhabi Dataset with Real Coordinates & Theme Attributes
export const LOCATIONS_DB = [
  // 1. TOURISM & CULTURAL LANDMARKS
  {
    id: 201,
    name: 'Louvre Abu Dhabi',
    name_ar: 'متحف اللوفر أبوظبي',
    type: 'TOURISM',
    category_en: 'Cultural Landmark',
    category_ar: 'معلم ثقافي وسياحي',
    location: 'Saadiyat Cultural District',
    location_ar: 'المنطقة الثقافية بالسعديات',
    district: 'Saadiyat Island',
    lat: 24.5338,
    lng: 54.3982,
    rating: 4.9,
    annualVisitors: 1250000,
    riskLevel: 'Low',
    riskScore: 34,
    waterConsumption: 14200,
    emissionsIndex: 28000,
    capacity: 15000,
    isCoastal: true,
    description: 'Iconic universal museum displaying global art and artifacts under Jean Nouvel’s rain-of-light dome.',
    description_ar: 'متحف عالمي بارز يعرض الأعمال الفنية والتاريخية تحت قبة النور المعمارية.',
    tags: ['tourism', 'museum', 'louvre', 'saadiyat', 'art', 'culture', 'landmark']
  },
  {
    id: 202,
    name: 'Qasr Al Watan Cultural Palace',
    name_ar: 'قصر الوطن الثقافي',
    type: 'TOURISM',
    category_en: 'Cultural Heritage',
    category_ar: 'معلم ثقافي وتاريخي',
    location: 'Al Ras Al Akhdar',
    location_ar: 'الرأس الأخضر',
    district: 'Al Ras Al Akhdar',
    lat: 24.4628,
    lng: 54.3056,
    rating: 4.8,
    annualVisitors: 850000,
    riskLevel: 'Low',
    riskScore: 28,
    waterConsumption: 16800,
    emissionsIndex: 22000,
    capacity: 12000,
    isCoastal: true,
    description: 'Working presidential palace celebrating Arabian heritage, artistry, and governance.',
    description_ar: 'قصر رئاسي حي يحتفي بالتراث المعماري والحوكمة والثقافة العربية.',
    tags: ['tourism', 'palace', 'qasr al watan', 'heritage', 'culture', 'landmark']
  },
  {
    id: 203,
    name: 'Sheikh Zayed Grand Mosque Center',
    name_ar: 'مركز جامع الشيخ زايد الكبير',
    type: 'TOURISM',
    category_en: 'Architectural Landmark',
    category_ar: 'معلم معماري وثقافي',
    location: 'Al Rawdah',
    location_ar: 'الروضة',
    district: 'Al Rawdah',
    lat: 24.4128,
    lng: 54.4750,
    rating: 4.95,
    annualVisitors: 4500000,
    riskLevel: 'Low',
    riskScore: 15,
    waterConsumption: 19800,
    emissionsIndex: 14000,
    capacity: 40000,
    description: 'Monumental architectural masterpiece and primary cultural landmark of Abu Dhabi.',
    description_ar: 'صرح معماري إسلامي عالمي بارز يعتبر المعلم الديني والثقافي الأكبر في الإمارة.',
    tags: ['tourism', 'mosque', 'sheikh zayed', 'grand mosque', 'heritage', 'landmark']
  },

  // 2. GOVERNMENT FACILITIES & CIVIC SERVICES
  {
    id: 101,
    name: 'Department of Government Enablement (DGE) HQ',
    name_ar: 'دائرة التمكين الحكومي - المقر الرئيسي',
    type: 'GOVERNMENT',
    category_en: 'Executive Governance',
    category_ar: 'منشأة حكومية تنفيذية',
    location: 'Corniche West',
    location_ar: 'طريق الكورنيش الغربي',
    district: 'Corniche West',
    lat: 24.4789,
    lng: 54.3312,
    rating: 4.9,
    riskLevel: 'Low',
    riskScore: 18,
    waterConsumption: 6200,
    emissionsIndex: 11000,
    capacity: 2100,
    description: 'Headquarters driving Abu Dhabi spatial data infrastructure, digital enablement, and government excellence.',
    description_ar: 'المقر الرئيسي المعني بالبنية المكانية للبيانات والتحول الرقمي والتفوق الحكومي.',
    tags: ['government', 'dge', 'sdi', 'enablement', 'headquarters', 'corniche']
  },
  {
    id: 102,
    name: 'TAMM Customer Service Hub - Al Reem',
    name_ar: 'مركز تم لخدمات المتعاملين - الريم',
    type: 'GOVERNMENT',
    category_en: 'Unified Public Services',
    category_ar: 'خدمات حكومية موحدة',
    location: 'Al Reem Island',
    location_ar: 'جزيرة الريم',
    district: 'Al Reem Island',
    lat: 24.5028,
    lng: 54.4056,
    rating: 4.8,
    riskLevel: 'Low',
    riskScore: 22,
    capacity: 3500,
    description: 'Unified Abu Dhabi government customer service center providing smart digital transactions.',
    description_ar: 'مركز الخدمات الحكومية الموحدة تم الخادم لسكان وشركات جزيرة الريم.',
    tags: ['government', 'tamm', 'public service', 'reem', 'civic']
  },
  {
    id: 103,
    name: 'Abu Dhabi Municipality Service Centre',
    name_ar: 'مركز بلدية أبوظبي الرئيسي',
    type: 'GOVERNMENT',
    category_en: 'Municipal Services',
    category_ar: 'خدمات بلدية',
    location: 'Al Zahiyah',
    location_ar: 'الزاهية',
    district: 'Al Zahiyah',
    lat: 24.4920,
    lng: 54.3735,
    rating: 4.7,
    capacity: 2500,
    description: 'Central municipal hub managing urban planning, building permits, and public land GIS registries.',
    description_ar: 'المركز الرئيسي لخدمات البلدية والمعني بالتخطيط العمراني وتصاريح الأراضي.',
    tags: ['government', 'municipality', 'permits', 'urban planning', 'zahiyah']
  },

  // 3. PUBLIC SAFETY (Police & Ambulance)
  {
    id: 401,
    name: 'Abu Dhabi Central Police Station',
    name_ar: 'مركز شرطة أبوظبي المركزي',
    type: 'PUBLIC_SAFETY',
    category_en: 'Police Station',
    category_ar: 'مركز شرطة',
    location: 'Downtown Abu Dhabi',
    location_ar: 'وسط المدينة',
    district: 'Downtown',
    lat: 24.4710,
    lng: 54.3640,
    rating: 4.8,
    description: 'Central headquarters handling urban public safety and civic response.',
    tags: ['safety', 'police', 'downtown', 'public_safety']
  },
  {
    id: 402,
    name: 'Al Bateen Police Station',
    name_ar: 'مركز شرطة البتين',
    type: 'PUBLIC_SAFETY',
    category_en: 'Police Station',
    category_ar: 'مركز شرطة',
    location: 'Al Bateen',
    location_ar: 'البتين',
    district: 'Al Bateen',
    lat: 24.4560,
    lng: 54.3480,
    rating: 4.7,
    description: 'Local precinct maintaining community safety and coastal patrol.',
    tags: ['safety', 'police', 'bateen', 'public_safety']
  },
  {
    id: 410,
    name: 'Abu Dhabi Central Ambulance Station',
    name_ar: 'محطة الإسعاف المركزية والطوارئ الطبية',
    type: 'PUBLIC_SAFETY',
    category_en: 'Ambulance Station',
    category_ar: 'محطة إسعاف',
    location: 'Al Mushrif',
    location_ar: 'المشرف',
    district: 'Al Mushrif',
    lat: 24.4510,
    lng: 54.3790,
    rating: 4.9,
    description: 'Primary rapid-dispatch ambulance hub serving central Abu Dhabi.',
    tags: ['safety', 'ambulance', 'emergency', 'public_safety']
  },

  // 4. TRANSPORTATION & MOBILITY
  {
    id: 501,
    name: 'Abu Dhabi Main Central Mobility Terminal',
    name_ar: 'محطة حافلات أبوظبي الرئيسية',
    type: 'TRANSPORT',
    category_en: 'Mobility Terminal',
    category_ar: 'محطة نقل عام',
    location: 'Al Nahyan',
    location_ar: 'آل نهيان',
    district: 'Al Nahyan',
    lat: 24.4719,
    lng: 54.3725,
    rating: 4.3,
    capacity: 25000,
    description: 'Primary intercity transit hub connecting Abu Dhabi to regional municipal districts.',
    description_ar: 'المحطة الرئيسية للنقل العام والحافلات التي تربط مدينة أبوظبي بالمعالم الإقليمية.',
    tags: ['transport', 'transit', 'bus', 'nahyan', 'mobility']
  },
  {
    id: 502,
    name: 'Corniche Waterfront Transit Stop #4',
    name_ar: 'موقف حافلات الكورنيش رقم 4',
    type: 'TRANSPORT',
    category_en: 'Bus Stop',
    category_ar: 'موقف حافلات',
    location: 'Corniche',
    location_ar: 'الكورنيش',
    district: 'Corniche',
    lat: 24.4820,
    lng: 54.3410,
    rating: 4.5,
    description: 'Public transport stop on Corniche road corridor.',
    tags: ['transport', 'bus', 'transit']
  },

  // 5. ENVIRONMENT & PARKS
  {
    id: 601,
    name: 'Eastern Mangrove Protected National Park',
    name_ar: 'محمية القرم الشرقي الوطنية',
    type: 'ENVIRONMENT',
    category_en: 'Protected Area',
    category_ar: 'محمية طبيعية',
    location: 'Eastern Ring Road',
    location_ar: 'طريق الكورنيش الشرقي',
    district: 'Eastern Ring Rd',
    lat: 24.4410,
    lng: 54.4380,
    rating: 4.9,
    description: 'Lush coastal mangrove ecosystem protecting coastal biodiversity and marine habitat.',
    tags: ['environment', 'mangrove', 'park', 'protected']
  },
  {
    id: 11,
    name: 'Umm Al Emarat Park & Environmental Hub',
    name_ar: 'حديقة أم الإمارات والمركز البيئي',
    type: 'PARK',
    category_en: 'Public Park',
    category_ar: 'حديقة عامة ومحمية',
    location: 'Al Mushrif',
    location_ar: 'المشرف',
    district: 'Al Mushrif',
    lat: 24.4533,
    lng: 54.3879,
    rating: 4.8,
    capacity: 12000,
    description: 'Historic public park featuring shade botanical gardens, shade structures, and eco-learning spaces.',
    description_ar: 'حديقة تاريخية بارزة تضم حدائق نباتية ومساحات بيئية خضراء مظللة.',
    tags: ['park', 'environment', 'umm al emarat', 'mushrif', 'green']
  },
  {
    id: 12,
    name: 'Yas Gateway Park North',
    name_ar: 'حديقة ياس جيتواي الشمالية',
    type: 'PARK',
    category_en: 'Public Park',
    category_ar: 'حديقة عامة ومحمية',
    location: 'Yas Island',
    location_ar: 'جزيرة ياس',
    district: 'Yas Island',
    lat: 24.4920,
    lng: 54.6020,
    rating: 4.8,
    capacity: 8000,
    description: 'Lush green park situated at the entrance of Yas Island with shaded sports tracks.',
    description_ar: 'حديقة خضراء واسعة عند مدخل جزيرة ياس تتميز بمسارات رياضية مظللة.',
    tags: ['park', 'yas island', 'green', 'recreation']
  },
  {
    id: 13,
    name: 'Al Reem Central Park & Waterfront Promenade',
    name_ar: 'حديقة الريم المركزية والممشى المائي',
    type: 'PARK',
    facilityType: 'PARK',
    subType: 'public_parks',
    category_en: 'Public Park & Waterfront Recreation',
    category_ar: 'حديقة عامة ومتنزه ترفيهي مائي',
    location: 'Al Reem Island',
    location_ar: 'جزيرة الريم',
    district: 'Al Reem Island',
    lat: 24.4965,
    lng: 54.4072,
    rating: 4.9,
    capacity: 15000,
    riskLevel: 'Low',
    riskScore: 16,
    isCoastal: true,
    description: 'Iconic 1-million sq ft public park on Al Reem Island featuring waterfront skate parks, shaded recreational lawns, musical fountains, and beachfront promenades.',
    description_ar: 'حديقة عامة رائدة بمساحة مليون قدم مربع في جزيرة الريم تضم مساحات خضراء، نوافير موسيقية، وممشى شاطئي وملاعب رياضية.',
    tags: ['park', 'public park', 'reem', 'al reem island', 'waterfront', 'green', 'recreation', 'garden']
  },

  // 6. HEALTHCARE FACILITIES
  {
    id: 301,
    name: 'Cleveland Clinic Abu Dhabi',
    name_ar: 'مستشفى كليفلاند كلينك أبوظبي',
    type: 'HOSPITAL',
    category_en: 'Tertiary Hospital',
    category_ar: 'مستشفى تخصصي رئيسي',
    location: 'Al Maryah Island',
    location_ar: 'جزيرة المارية',
    district: 'Al Maryah Island',
    lat: 24.5020,
    lng: 54.3890,
    rating: 4.9,
    capacity: 364,
    description: 'World-class multi-specialty hospital providing advanced critical healthcare.',
    tags: ['healthcare', 'hospital', 'cleveland', 'maryah']
  },
  {
    id: 302,
    name: 'Sheikh Shakhbout Medical City (SSMC)',
    name_ar: 'مدينة الشيخ شخبوط الطبية',
    type: 'HOSPITAL',
    category_en: 'Government Hospital',
    category_ar: 'مدينة طبية حكومية',
    location: 'Al Mafraq',
    location_ar: 'المفرق',
    district: 'Al Mafraq',
    lat: 24.2810,
    lng: 54.5920,
    rating: 4.8,
    capacity: 741,
    description: 'The largest tertiary complex hospital in UAE for complex burn and trauma care.',
    tags: ['healthcare', 'hospital', 'ssmc', 'mafraq']
  },

  // 7. EDUCATION FACILITIES
  {
    id: 801,
    name: 'Khalifa University Main Campus',
    name_ar: 'جامعة خليفة - المقر الرئيسي',
    type: 'EDUCATION',
    category_en: 'University',
    category_ar: 'جامعة أبحاث',
    location: 'Al Saada',
    location_ar: 'السعادة',
    district: 'Al Saada',
    lat: 24.4440,
    lng: 54.3980,
    rating: 4.9,
    description: 'Premier research university for science, engineering, and artificial intelligence.',
    tags: ['education', 'university', 'khalifa']
  },
  {
    id: 802,
    name: 'Sorbonne University Abu Dhabi',
    name_ar: 'جامعة السوربون أبوظبي',
    type: 'EDUCATION',
    category_en: 'University',
    category_ar: 'جامعة دولية',
    location: 'Al Reem Island',
    location_ar: 'جزيرة الريم',
    district: 'Al Reem Island',
    lat: 24.4910,
    lng: 54.4120,
    rating: 4.8,
    description: 'International French university campus offering humanities and law programs.',
    tags: ['education', 'university', 'sorbonne', 'reem', 'private_schools']
  },
  {
    id: 803,
    name: 'Al Ghad Charter School - Al Bateen',
    name_ar: 'مدرسة الغد للشراكات التعليمية - البطين',
    type: 'EDUCATION',
    category_en: 'Charter School',
    category_ar: 'مدرسة شراكة تعليمية',
    location: 'Al Bateen',
    location_ar: 'البطين',
    district: 'Al Bateen',
    lat: 24.4600,
    lng: 54.3520,
    rating: 4.8,
    subType: 'charter_schools',
    description: 'Modern public-private partnership charter school delivering bilingual STEM curricula.',
    tags: ['education', 'charter school', 'charter_schools', 'school', 'bateen']
  },
  {
    id: 804,
    name: 'Bright Beginnings Early Childhood Nursery',
    name_ar: 'حضانة البدايات المشرقة للطفولة المبكرة',
    type: 'EDUCATION',
    category_en: 'Nursery & Kindergarten',
    category_ar: 'حضانة ورياض أطفال',
    location: 'Al Mushrif',
    location_ar: 'المشرف',
    district: 'Al Mushrif',
    lat: 24.4680,
    lng: 54.3600,
    rating: 4.9,
    subType: 'nurseries',
    description: 'Accredited early learning nursery offering premier early childhood developmental care.',
    tags: ['education', 'nursery', 'nurseries', 'kindergarten', 'mushrif']
  },
  {
    id: 805,
    name: 'Zayed Higher Organization for People of Determination (POD) Center',
    name_ar: 'مؤسسة زايد العليا لأصحاب الهمم - المركز الرئيسي',
    type: 'EDUCATION',
    category_en: 'People of Determination Center',
    category_ar: 'مركز رعاية وتأهيل أصحاب الهمم',
    location: 'Al Mafraq',
    location_ar: 'المفرق',
    district: 'Al Mafraq',
    lat: 24.4480,
    lng: 54.4150,
    rating: 4.95,
    subType: 'pod',
    description: 'Specialized education and humanitarian center empowering students and people of determination.',
    tags: ['education', 'pod', 'people of determination', 'special needs', 'inclusive education']
  },
  {
    id: 806,
    name: 'Abu Dhabi Public High School for Boys',
    name_ar: 'مدرسة أبوظبي الثانوية الحكومية للبنين',
    type: 'EDUCATION',
    category_en: 'Public School',
    category_ar: 'مدرسة حكومية',
    location: 'Al Manhal',
    location_ar: 'المنهل',
    district: 'Al Manhal',
    lat: 24.4550,
    lng: 54.3820,
    rating: 4.7,
    subType: 'public_schools',
    description: 'Flagship government secondary school with modern digital labs and athletic complexes.',
    tags: ['education', 'public school', 'public_schools', 'school']
  },
  {
    id: 807,
    name: 'Cranleigh Abu Dhabi British International School',
    name_ar: 'مدرسة كرانلي أبوظبي البريطانية الدولية',
    type: 'EDUCATION',
    category_en: 'Private School',
    category_ar: 'مدرسة خاصة دولية',
    location: 'Saadiyat Cultural District',
    location_ar: 'المنطقة الثقافية بالسعديات',
    district: 'Saadiyat Island',
    lat: 24.5360,
    lng: 54.4280,
    rating: 4.9,
    subType: 'private_schools',
    description: 'Leading British international private curriculum day and boarding school on Saadiyat Island.',
    tags: ['education', 'private school', 'private_schools', 'cranleigh', 'saadiyat']
  },

  // 8. HEALTHCARE EXTENSIONS
  {
    id: 303,
    name: 'Al Bateen Community Healthcare Clinic',
    name_ar: 'عيادة البطين للرعاية الصحية المجتمعية',
    type: 'HEALTHCARE',
    category_en: 'Primary Care Clinic',
    category_ar: 'عيادة رعاية صحية أولية',
    location: 'Al Bateen',
    location_ar: 'البطين',
    district: 'Al Bateen',
    lat: 24.4530,
    lng: 54.3490,
    rating: 4.7,
    subType: 'clinics',
    description: 'Primary ambulatory care clinic offering general medicine, pediatrics, and preventive health.',
    tags: ['healthcare', 'clinic', 'clinics', 'medical', 'bateen']
  },
  {
    id: 304,
    name: 'Al Manara Central Pharmacy - Corniche',
    name_ar: 'صيدلية المنارة المركزية - الكورنيش',
    type: 'HEALTHCARE',
    category_en: 'Retail Pharmacy',
    category_ar: 'صيدلية مجتمعية',
    location: 'Corniche West',
    location_ar: 'الكورنيش الغربي',
    district: 'Corniche West',
    lat: 24.4795,
    lng: 54.3540,
    rating: 4.8,
    subType: 'pharmacies',
    description: '24/7 fully stocked retail and prescription pharmacy providing vital medications.',
    tags: ['healthcare', 'pharmacy', 'pharmacies', 'medical', 'corniche']
  },
  {
    id: 305,
    name: 'Mubadala Health Specialty Medical Center',
    name_ar: 'مركز مبادلة للرعاية الصحية التخصصية',
    type: 'HEALTHCARE',
    category_en: 'Comprehensive Medical Center',
    category_ar: 'مركز طبي تخصصي شامل',
    location: 'Al Maryah Island',
    location_ar: 'جزيرة المارية',
    district: 'Al Maryah Island',
    lat: 24.4980,
    lng: 54.3850,
    rating: 4.9,
    subType: 'medical_centers',
    description: 'Multi-specialty outpatient center offering cardiology, oncology, and diagnostic imaging.',
    tags: ['healthcare', 'medical center', 'medical_centers', 'mubadala', 'maryah']
  },

  // 9. TRANSPORT EXTENSIONS
  {
    id: 503,
    name: 'Zayed International Airport (AUH)',
    name_ar: 'مطار زايد الدولي (AUH)',
    type: 'TRANSPORT',
    category_en: 'International Airport',
    category_ar: 'مطار دولي',
    location: 'Airport District',
    location_ar: 'منطقة المطار',
    district: 'Abu Dhabi Airport',
    lat: 24.4430,
    lng: 54.6511,
    rating: 4.95,
    subType: 'airports',
    description: 'State-of-the-art Terminal A gateway serving global airline passengers and international cargo.',
    tags: ['transport', 'airport', 'airports', 'auh', 'zayed airport', 'aviation']
  },
  {
    id: 504,
    name: 'Khalifa Port Deepwater Container Seaport',
    name_ar: 'ميناء خليفة للحاويات والملاحة البحرية',
    type: 'TRANSPORT',
    category_en: 'Commercial Seaport',
    category_ar: 'ميناء بحري تجاري',
    location: 'Taweelah',
    location_ar: 'الطويلة',
    district: 'Khalifa Port',
    lat: 24.8100,
    lng: 54.6800,
    rating: 4.9,
    subType: 'seaports',
    description: 'One of the world’s most technologically advanced semi-automated deepwater container ports.',
    tags: ['transport', 'seaport', 'seaports', 'port', 'maritime', 'khalifa port']
  },
  {
    id: 505,
    name: 'Etihad Rail Abu Dhabi Central Operations Depot',
    name_ar: 'محطة ومركز عمليات قطار الاتحاد - أبوظبي',
    type: 'TRANSPORT',
    category_en: 'Rail Network',
    category_ar: 'شبكة سكك حديدية ومترو',
    location: 'Al Falah Industrial',
    location_ar: 'الفلاح الصناعية',
    district: 'Al Falah',
    lat: 24.3200,
    lng: 54.5500,
    rating: 4.85,
    subType: 'metro_lines',
    description: 'National railway terminal linking commercial freight and future passenger high-speed rail lines.',
    tags: ['transport', 'rail', 'metro_lines', 'train', 'etihad rail', 'transit']
  },
  {
    id: 506,
    name: 'ADNOC Distribution Al Dana Service Station',
    name_ar: 'محطة أدنوك للتوزيع - الدانة',
    type: 'TRANSPORT',
    category_en: 'Petrol & EV Station',
    category_ar: 'محطة وقود وشحن كهربائي',
    location: 'Al Dana',
    location_ar: 'الدانة',
    district: 'Al Dana',
    lat: 24.4950,
    lng: 54.3680,
    rating: 4.7,
    subType: 'petrol_stations',
    description: 'Multi-energy fueling station featuring Super 98, diesel, and ultra-fast DC electric vehicle chargers.',
    tags: ['transport', 'petrol', 'petrol_stations', 'fuel', 'adnoc', 'ev charging']
  },
  {
    id: 507,
    name: 'Abu Dhabi Central Multi-Storey Smart Parking',
    name_ar: 'موقف سيارات أبوظبي الذكي متعدد الطوابق',
    type: 'TRANSPORT',
    category_en: 'Parking Facility',
    category_ar: 'مواقف سيارات ذكية',
    location: 'Downtown Abu Dhabi',
    location_ar: 'وسط المدينة',
    district: 'Downtown',
    lat: 24.4850,
    lng: 54.3620,
    rating: 4.6,
    subType: 'parking_lots',
    description: 'Smart sensor-equipped parking structure with 1,200 automated stalls and EV charging bays.',
    tags: ['transport', 'parking', 'parking_lots', 'car park']
  },
  {
    id: 508,
    name: 'ADNOC Light Vehicle Inspection Center - Muroor',
    name_ar: 'مركز أدنوك للفحص الفني للمركبات - المرور',
    type: 'TRANSPORT',
    category_en: 'Vehicle Inspection Center',
    category_ar: 'مركز فحص المركبات',
    location: 'Al Muroor',
    location_ar: 'المرور',
    district: 'Al Muroor',
    lat: 24.4420,
    lng: 54.4020,
    rating: 4.7,
    subType: 'vehicle_inspection',
    description: 'Official police-accredited vehicle safety testing and registration renewal inspection center.',
    tags: ['transport', 'vehicle inspection', 'vehicle_inspection', 'adnoc', 'muroor']
  },
  {
    id: 509,
    name: 'Al Zahiyah Central Taxi Stand & Mobility Hub',
    name_ar: 'موقف مركبات الأجرة ومركز التنقل - الزاهية',
    type: 'TRANSPORT',
    category_en: 'Taxi Stand Hub',
    category_ar: 'موقف مركبات الأجرة',
    location: 'Al Zahiyah',
    location_ar: 'الزاهية',
    district: 'Al Zahiyah',
    lat: 24.4930,
    lng: 54.3750,
    rating: 4.6,
    subType: 'taxi_stands',
    description: 'Dedicated taxi queuing stand and multi-modal transit connection hub near Abu Dhabi Mall.',
    tags: ['transport', 'taxi', 'taxi_stands', 'cab', 'zahiyah']
  },

  // 10. INFRASTRUCTURE & BRIDGES
  {
    id: 701,
    name: 'Sheikh Zayed Bridge',
    name_ar: 'جسر الشيخ زايد المعماري',
    type: 'INFRASTRUCTURE',
    category_en: 'Iconic Bridge',
    category_ar: 'جسر وتقاطع رئيسي',
    location: 'Al Maqta',
    location_ar: 'المقطع',
    district: 'Al Maqta',
    lat: 24.4210,
    lng: 54.4920,
    rating: 4.95,
    subType: 'bridges',
    description: 'Renowned 842-meter wave-shaped arch bridge designed by Zaha Hadid connecting island to mainland.',
    tags: ['infrastructure', 'bridge', 'bridges', 'zaha hadid', 'maqta']
  },
  {
    id: 702,
    name: 'Sheikh Khalifa Bin Zayed Al Nahyan Highway Corridor',
    name_ar: 'طريق الشيخ خليفة بن زايد السريع (E12)',
    type: 'INFRASTRUCTURE',
    category_en: 'Highway Network',
    category_ar: 'شبكة طرق سريعة',
    location: 'Saadiyat-Yas Expressway',
    location_ar: 'طريق السعديات - ياس السريع',
    district: 'Saadiyat Island',
    lat: 24.5100,
    lng: 54.4200,
    rating: 4.9,
    subType: 'road_networks',
    description: 'High-capacity 10-lane expressway seamlessly connecting downtown Abu Dhabi with Yas and Saadiyat islands.',
    tags: ['infrastructure', 'road', 'road_networks', 'highway', 'expressway']
  },
  {
    id: 703,
    name: 'Mina Zayed Commercial Port Cargo Terminals',
    name_ar: 'أرصفة ميناء زايد التجارية ومحطات الشحن',
    type: 'INFRASTRUCTURE',
    category_en: 'Port Facilities',
    category_ar: 'مرافق وأرصفة الموانئ',
    location: 'Mina Zayed',
    location_ar: 'ميناء زايد',
    district: 'Mina Zayed',
    lat: 24.5210,
    lng: 54.3720,
    rating: 4.75,
    subType: 'port_facilities',
    description: 'Maritime port facilities handling general cargo, ro-ro vessels, and luxury cruise tourism berths.',
    tags: ['infrastructure', 'port', 'port_facilities', 'mina zayed', 'cargo']
  },
  {
    id: 704,
    name: 'Abu Dhabi Island Smart LED Street Lighting Control Grid',
    name_ar: 'شبكة التحكم بالإنارة العامة الذكية - جزيرة أبوظبي',
    type: 'INFRASTRUCTURE',
    category_en: 'Public Lighting Grid',
    category_ar: 'شبكة الإنارة العامة',
    location: 'Corniche & Downtown',
    location_ar: 'الكورنيش ووسط المدينة',
    district: 'Downtown',
    lat: 24.4650,
    lng: 54.3800,
    rating: 4.8,
    subType: 'public_lighting',
    description: 'Centrally monitored IoT smart LED street lighting network optimizing energy efficiency across arterials.',
    tags: ['infrastructure', 'lighting', 'public_lighting', 'smart city', 'led']
  },

  // 11. HOUSING & RESIDENTIAL COMMUNITIES
  {
    id: 901,
    name: 'Al Bandar Marina Residential Complex',
    name_ar: 'مجمع البندر السكني على الواجهة البحرية',
    type: 'HOUSING',
    category_en: 'Residential Complex',
    category_ar: 'مجمع سكني بحري',
    location: 'Al Raha Beach',
    location_ar: 'شاطئ الراحة',
    district: 'Al Raha',
    lat: 24.4490,
    lng: 54.6060,
    rating: 4.85,
    subType: 'residential_complexes',
    description: 'Waterfront residential community featuring luxury apartments, marina slips, and community retail.',
    tags: ['housing', 'residential', 'residential_complexes', 'al raha', 'apartments']
  },
  {
    id: 902,
    name: 'Al Falah National Public Housing Community',
    name_ar: 'مدينة الفلاح السكنية للمواطنين',
    type: 'HOUSING',
    category_en: 'Public Housing Community',
    category_ar: 'مشروع إسكان حكومي',
    location: 'Al Falah',
    location_ar: 'الفلاح',
    district: 'Al Falah',
    lat: 24.4250,
    lng: 54.6850,
    rating: 4.9,
    subType: 'public_housing',
    description: 'Large-scale government residential neighborhood providing high-standard community housing for nationals.',
    tags: ['housing', 'public housing', 'public_housing', 'community', 'al falah']
  },
  {
    id: 903,
    name: 'Saadiyat Beach Luxury Residential Villas',
    name_ar: 'فلل شاطئ السعديات السكنية الفاخرة',
    type: 'HOUSING',
    category_en: 'Luxury Villas',
    category_ar: 'فلل سكنية فاخرة',
    location: 'Saadiyat Beach',
    location_ar: 'شاطئ السعديات',
    district: 'Saadiyat Island',
    lat: 24.5460,
    lng: 54.4420,
    rating: 4.92,
    subType: 'villas',
    description: 'Gated master community of Mediterranean and Arabian designed beachfront residential villas.',
    tags: ['housing', 'villa', 'villas', 'saadiyat', 'luxury']
  },
  {
    id: 904,
    name: 'Abu Dhabi Global Market (ADGM) Commercial Square',
    name_ar: 'أبراج سوق أبوظبي العالمي التجارية (ADGM)',
    type: 'HOUSING',
    category_en: 'Commercial Office Tower',
    category_ar: 'مبنى تجاري ومكتبي',
    location: 'Al Maryah Island',
    location_ar: 'جزيرة المارية',
    district: 'Al Maryah Island',
    lat: 24.5015,
    lng: 54.3880,
    rating: 4.9,
    subType: 'commercial_buildings',
    description: 'Grade-A LEED certified financial towers hosting leading international investment firms and banks.',
    tags: ['housing', 'commercial', 'commercial_buildings', 'adgm', 'maryah', 'offices']
  },

  // 12. UTILITIES & POWER / WATER
  {
    id: 1001,
    name: 'Al Taweelah Power & Seawater Desalination Plant',
    name_ar: 'محطة الطويلة لتوليد الكهرباء وتحلية مياه البحر',
    type: 'UTILITIES',
    category_en: 'Power & Desalination Plant',
    category_ar: 'محطة توليد طاقة وتحلية مياه',
    location: 'Al Taweelah',
    location_ar: 'الطويلة',
    district: 'Al Taweelah',
    lat: 24.7600,
    lng: 54.6900,
    rating: 4.88,
    subType: 'power_stations',
    description: 'World-record reverse osmosis desalination facility and power station supplying municipal freshwater.',
    tags: ['utilities', 'power', 'power_stations', 'water', 'desalination', 'taweelah']
  },
  {
    id: 1002,
    name: 'Al Wathba Advanced Wastewater Treatment Plant',
    name_ar: 'محطة الوثبة المتقدمة لمعالجة مياه الصرف الصحي',
    type: 'UTILITIES',
    category_en: 'Water Treatment Facility',
    category_ar: 'محطة معالجة مياه',
    location: 'Al Wathba',
    location_ar: 'الوثبة',
    district: 'Al Wathba',
    lat: 24.2400,
    lng: 54.6300,
    rating: 4.75,
    subType: 'water_treatment',
    description: 'Tertiary wastewater recycling facility supplying 300,000 cubic meters/day of treated irrigation water.',
    tags: ['utilities', 'water treatment', 'water_treatment', 'recycling', 'irrigation', 'wathba']
  },
  {
    id: 1003,
    name: 'TRANSCO 400kV Bulk Power Transmission Substation',
    name_ar: 'محطة ترانسكو الرئيسية للتحويل الكهربائي 400 ك.ف',
    type: 'UTILITIES',
    category_en: 'Electrical Substation',
    category_ar: 'محطة تحويل كهربائي',
    location: 'Musaffah Grid Sector',
    location_ar: 'قطاع مصفح الكهربائي',
    district: 'Musaffah',
    lat: 24.3500,
    lng: 54.5400,
    rating: 4.8,
    subType: 'substations',
    description: 'Extra-high voltage bulk electricity transmission substation stabilizing the capital power grid.',
    tags: ['utilities', 'substation', 'substations', 'electricity', 'grid', 'transco']
  },
  {
    id: 1004,
    name: 'e& (Etisalat) Core 5G Telecom Tower - Al Maryah',
    name_ar: 'برج الاتصالات وشبكات الجيل الخامس 5G - المارية',
    type: 'UTILITIES',
    category_en: 'Telecom Tower & 5G Node',
    category_ar: 'برج اتصالات وشبكات 5G',
    location: 'Al Maryah Island',
    location_ar: 'جزيرة المارية',
    district: 'Al Maryah Island',
    lat: 24.5040,
    lng: 54.3910,
    rating: 4.85,
    subType: 'telecom_towers',
    description: 'High-density ultra-reliable 5G mmWave telecommunication tower powering critical fintech infrastructure.',
    tags: ['utilities', 'telecom', 'telecom_towers', '5g', 'etisalat', 'telecommunications']
  },

  // 13. CLIMATE & ENVIRONMENT METEOROLOGY
  {
    id: 1101,
    name: 'National Center of Meteorology (NCM) Central Weather Station',
    name_ar: 'محطة الرصد الجوي الرئيسية - المركز الوطني للأرصاد',
    type: 'CLIMATE',
    category_en: 'Meteorological Station',
    category_ar: 'محطة رصد جوي',
    location: 'Al Zaab',
    location_ar: 'الزعاب',
    district: 'Al Zaab',
    lat: 24.4280,
    lng: 54.4620,
    rating: 4.9,
    subType: 'weather_stations',
    description: 'Doppler radar and automated surface observation station tracking wind, heat index, and rain.',
    tags: ['climate', 'weather', 'weather_stations', 'meteorology', 'ncm']
  },
  {
    id: 1102,
    name: 'Noor Abu Dhabi Mega Solar PV Plant (Sweihan)',
    name_ar: 'محطة نور أبوظبي للطاقة الشمسية الكهروضوئية (سويحان)',
    type: 'CLIMATE',
    category_en: 'Utility-Scale Solar Plant',
    category_ar: 'محطة طاقة شمسية كبرى',
    location: 'Sweihan',
    location_ar: 'سويحان',
    district: 'Sweihan',
    lat: 24.2400,
    lng: 55.2600,
    rating: 4.98,
    subType: 'solar_plants',
    description: 'One of the world’s largest single-site solar power plants with 3.2 million crystalline modules.',
    tags: ['climate', 'solar', 'solar_plants', 'clean energy', 'sweihan', 'renewable']
  },
  {
    id: 1103,
    name: 'Al Reyadah CCUS Carbon Capture & Monitoring Plant',
    name_ar: 'مشروع الريادة لاحتجاز ومراقبة انبعاثات الكربون (CCUS)',
    type: 'CLIMATE',
    category_en: 'Carbon Capture & CO2 Monitoring',
    category_ar: 'محطة احتجاز ومراقبة الكربون',
    location: 'Musaffah South',
    location_ar: 'جنوب مصفح',
    district: 'Musaffah',
    lat: 24.3100,
    lng: 54.4900,
    rating: 4.9,
    subType: 'co2_monitoring',
    description: 'First commercial-scale carbon capture utilization and sequestration project in the Middle East.',
    tags: ['climate', 'carbon', 'co2_monitoring', 'emissions', 'ccus', 'sustainability']
  },
  {
    id: 1104,
    name: 'Abu Dhabi Corniche Coastal Surge Defense Barrier',
    name_ar: 'حواجز حماية السواحل من المد البحري - الكورنيش',
    type: 'CLIMATE',
    category_en: 'Coastal Defense Infrastructure',
    category_ar: 'حواجز حماية السواحل',
    location: 'Corniche Breakwater',
    location_ar: 'كاسر أمواج الكورنيش',
    district: 'Corniche',
    lat: 24.4870,
    lng: 54.3320,
    rating: 4.8,
    subType: 'coastal_protection',
    description: 'Engineered revetment seawalls and breakwaters safeguarding urban shorelines from sea-level rise.',
    tags: ['climate', 'coastal protection', 'coastal_protection', 'sea wall', 'corniche']
  },

  // 14. CONSTRUCTION & DEVELOPMENT PROJECTS
  {
    id: 1201,
    name: 'Guggenheim Abu Dhabi Museum Construction Site',
    name_ar: 'موقع إنشاء متحف جوجنهايم أبوظبي',
    type: 'CONSTRUCTION',
    category_en: 'Active Mega Construction Site',
    category_ar: 'موقع بناء نشط',
    location: 'Saadiyat Cultural District',
    location_ar: 'المنطقة الثقافية بالسعديات',
    district: 'Saadiyat Island',
    lat: 24.5380,
    lng: 54.4020,
    rating: 4.85,
    subType: 'construction_sites',
    description: 'Active construction zone of Frank Gehry’s landmark museum featuring industrial safety monitoring.',
    tags: ['construction', 'construction site', 'construction_sites', 'guggenheim', 'saadiyat']
  },
  {
    id: 1202,
    name: 'Hudayriyat Island Mega Master Development Project',
    name_ar: 'مشروع تطوير جزيرة الحديريات الكبرى',
    type: 'CONSTRUCTION',
    category_en: 'Urban Development Project',
    category_ar: 'مشروع تطوير حضري شامل',
    location: 'Hudayriyat Island',
    location_ar: 'جزيرة الحديريات',
    district: 'Hudayriyat',
    lat: 24.4180,
    lng: 54.3350,
    rating: 4.8,
    subType: 'development_projects',
    description: '51-million-square-meter master planned development featuring sports districts and residential communities.',
    tags: ['construction', 'development', 'development_projects', 'hudayriyat', 'master plan']
  },
  {
    id: 1203,
    name: 'DMT Al Reem Master Zoning & Development Permit Zone',
    name_ar: 'منطقة تصاريح استخدام الأراضي والتخطيط العمراني - الريم',
    type: 'CONSTRUCTION',
    category_en: 'Zoning & Development Permits Area',
    category_ar: 'منطقة تصاريح وتخطيط الأراضي',
    location: 'Al Reem Island',
    location_ar: 'جزيرة الريم',
    district: 'Al Reem Island',
    lat: 24.4980,
    lng: 54.4080,
    rating: 4.7,
    subType: 'zoning_permits',
    description: 'Municipal zoning sector regulating floor area ratios, building heights, and environmental permits.',
    tags: ['construction', 'zoning', 'zoning_permits', 'permits', 'dmt', 'reem']
  },

  // 15. ENERGY & DISTRIBUTION NETWORKS
  {
    id: 1301,
    name: 'ADDC Al Maryah Distribution Power Substation',
    name_ar: 'محطة توزيع كهرباء أبوظبي (ADDC) - المارية',
    type: 'ENERGY',
    category_en: 'Power Distribution Substation',
    category_ar: 'محطة توزيع كهرباء',
    location: 'Al Maryah Island',
    location_ar: 'جزيرة المارية',
    district: 'Al Maryah Island',
    lat: 24.4990,
    lng: 54.3930,
    rating: 4.8,
    subType: 'energy_substations',
    description: 'Primary 132/11kV distribution facility routing electrical power to commercial and residential towers.',
    tags: ['energy', 'substation', 'energy_substations', 'power', 'addc', 'electricity']
  },
  {
    id: 1302,
    name: 'ADNOC Gas Pipelines Distribution Grid Hub',
    name_ar: 'شبكة ومركز توزيع خطوط الغاز الطبيعي - أدنوك',
    type: 'ENERGY',
    category_en: 'Natural Gas Network',
    category_ar: 'شبكة توزيع الغاز الطبيعي',
    location: 'Musaffah Energy Corridor',
    location_ar: 'ممر مصفح للطاقة',
    district: 'Musaffah',
    lat: 24.3300,
    lng: 54.4800,
    rating: 4.85,
    subType: 'gas_networks',
    description: 'Monitored pipeline transmission grid distributing clean natural gas to industrial and domestic consumers.',
    tags: ['energy', 'gas', 'gas_networks', 'adnoc', 'pipeline', 'musaffah']
  },
  {
    id: 1303,
    name: 'Masdar City Clean & Renewable Energy Innovation Grid',
    name_ar: 'شبكة أبحاث وحلول الطاقة المتجددة - مدينة مصدر',
    type: 'ENERGY',
    category_en: 'Renewable Energy Grid',
    category_ar: 'شبكة طاقة متجددة ونظيفة',
    location: 'Masdar City',
    location_ar: 'مدينة مصدر',
    district: 'Masdar City',
    lat: 24.4270,
    lng: 54.6180,
    rating: 4.95,
    subType: 'renewable_energy',
    description: 'Zero-carbon smart microgrid integrating rooftop photovoltaics, battery storage, and smart metering.',
    tags: ['energy', 'renewable', 'renewable_energy', 'masdar', 'solar', 'green energy']
  },
  {
    id: 1304,
    name: 'Barakah Transmission Interconnection Grid Terminal',
    name_ar: 'محطة الربط والتحويل الرئيسية لشبكة براكة النووية',
    type: 'ENERGY',
    category_en: 'Bulk Grid Terminal',
    category_ar: 'محطة ربط كهربائي رئيسية',
    location: 'Al Dhafra Grid Node',
    location_ar: 'عقدة الظفرة الكهربائية',
    district: 'Al Dhafra',
    lat: 24.1800,
    lng: 54.3900,
    rating: 4.9,
    subType: 'grid_terminals',
    description: 'Major transmission terminal feeding zero-carbon baseload electricity from Barakah into the national grid.',
    tags: ['energy', 'grid', 'grid_terminals', 'barakah', 'transmission']
  },

  // 16. AGRICULTURE & FOOD SECURITY
  {
    id: 1401,
    name: 'Al Ain Oasis Heritage Date Farms',
    name_ar: 'مزارع واحة العين التقليدية لإنتاج النخيل والتمور',
    type: 'AGRICULTURE',
    category_en: 'Productive Date Farm',
    category_ar: 'مزارع نخيل وتمور',
    location: 'Al Ain Oasis',
    location_ar: 'واحة العين',
    district: 'Al Ain',
    lat: 24.2180,
    lng: 55.7610,
    rating: 4.95,
    subType: 'farms',
    description: 'UNESCO World Heritage date palm farm functioning continuously with historic Falaj irrigation.',
    tags: ['agriculture', 'farm', 'farms', 'al ain', 'dates', 'food security']
  },
  {
    id: 1402,
    name: 'ADQ AgTech High-Tech Desert Greenhouse Complex',
    name_ar: 'مجمع البيوت المحمية الزراعية الذكية - القابضة (ADQ)',
    type: 'AGRICULTURE',
    category_en: 'High-Tech Greenhouse',
    category_ar: 'بيوت محمية زراعية حديثة',
    location: 'Al Khatim',
    location_ar: 'الختم',
    district: 'Al Khatim',
    lat: 24.3800,
    lng: 54.8200,
    rating: 4.88,
    subType: 'greenhouses',
    description: 'Climate-controlled hydroponic greenhouses producing high-yield vegetables with 90% water savings.',
    tags: ['agriculture', 'greenhouse', 'greenhouses', 'hydroponics', 'agtech', 'adq']
  },
  {
    id: 1403,
    name: 'Al Wathba Smart Drip Irrigation System Hub',
    name_ar: 'مركز شبكات وأنظمة الري بالتنقيط الذكية - الوثبة',
    type: 'AGRICULTURE',
    category_en: 'Smart Irrigation System',
    category_ar: 'نظام ري زراعي ذكي',
    location: 'Al Wathba Agricultural Zone',
    location_ar: 'منطقة الوثبة الزراعية',
    district: 'Al Wathba',
    lat: 24.2500,
    lng: 54.6100,
    rating: 4.8,
    subType: 'irrigation_systems',
    description: 'IoT-monitored precision drip irrigation hub reducing water consumption across regional agricultural plots.',
    tags: ['agriculture', 'irrigation', 'irrigation_systems', 'water conservation', 'wathba']
  },
  {
    id: 1404,
    name: 'ADAFSA Veterinary & Livestock Research Center',
    name_ar: 'مركز أبحاث الثروة الحيوانية والبيطرية - هيئة الزراعة والسلامة الغذائية',
    type: 'AGRICULTURE',
    category_en: 'Livestock Center',
    category_ar: 'مركز الثروة الحيوانية والبيطرية',
    location: 'Al Nahnah',
    location_ar: 'النهنه',
    district: 'Abu Dhabi Suburbs',
    lat: 24.3400,
    lng: 54.6500,
    rating: 4.82,
    subType: 'livestock_centers',
    description: 'Government facility specialized in genetic improvement, veterinary disease control, and livestock welfare.',
    tags: ['agriculture', 'livestock', 'livestock_centers', 'adafsa', 'veterinary']
  },

  // 17. EMPLOYMENT & ECONOMIC HUBS
  {
    id: 1501,
    name: 'Hub71 Global Tech Startup Ecosystem',
    name_ar: 'منظومة هاب 71 (Hub71) العالمية للتكنولوجيا والشركات الناشئة',
    type: 'EMPLOYMENT',
    category_en: 'Business & Startup Hub',
    category_ar: 'مركز أعمال وحاضنة تكنولوجية',
    location: 'Al Maryah Island',
    location_ar: 'جزيرة المارية',
    district: 'Al Maryah Island',
    lat: 24.5025,
    lng: 54.3895,
    rating: 4.95,
    subType: 'business_hubs',
    description: 'Abu Dhabi global tech community hosting hundreds of tech founders, VC funds, and corporate accelerators.',
    tags: ['employment', 'business hub', 'business_hubs', 'hub71', 'startups', 'technology']
  },
  {
    id: 1502,
    name: 'KEZAD (Khalifa Economic Zones Abu Dhabi) Free Zone',
    name_ar: 'المناطق الاقتصادية الخاصة (كيزاد) - المنطقة الحرة',
    type: 'EMPLOYMENT',
    category_en: 'Economic Free Zone',
    category_ar: 'منطقة اقتصادية حرة',
    location: 'Al Ma’mourah / Taweelah',
    location_ar: 'المعمورة / الطويلة',
    district: 'KEZAD',
    lat: 24.7850,
    lng: 54.7100,
    rating: 4.9,
    subType: 'free_zones',
    description: 'Largest integrated trade and logistics economic zone offering 100% foreign ownership and zero customs.',
    tags: ['employment', 'free zone', 'free_zones', 'kezad', 'industrial', 'trade']
  },
  {
    id: 1503,
    name: 'Tawteen National Employment & Talent Center',
    name_ar: 'مركز توطين للتوظيف وتنمية الكفاءات الوطنية',
    type: 'EMPLOYMENT',
    category_en: 'Job & Career Center',
    category_ar: 'مركز توظيف وتدريب وطني',
    location: 'Al Mushrif',
    location_ar: 'المشرف',
    district: 'Al Mushrif',
    lat: 24.4580,
    lng: 54.3720,
    rating: 4.8,
    subType: 'job_centers',
    description: 'Government career guidance and talent placement hub connecting national job seekers with top employers.',
    tags: ['employment', 'job center', 'job_centers', 'tawteen', 'careers', 'recruitment']
  },
  {
    id: 1504,
    name: 'ADNOC Corporate World Headquarters Tower',
    name_ar: 'المقر الرئيسي العالمي لشركة أدنوك (ADNOC)',
    type: 'EMPLOYMENT',
    category_en: 'Corporate Headquarters',
    category_ar: 'مقر رئيسي لشركة عالمية',
    location: 'Corniche West',
    location_ar: 'الكورنيش الغربي',
    district: 'Corniche West',
    lat: 24.4640,
    lng: 54.3290,
    rating: 4.9,
    subType: 'corporate_hqs',
    description: 'Commanding 342-meter skyscraper serving as the corporate center for the UAE’s energy workforce.',
    tags: ['employment', 'corporate hq', 'corporate_hqs', 'adnoc', 'headquarters', 'corniche']
  }
];

export const mockAiEngine = {
  async processQuery(queryText, currentState = null, isArabic = false) {
    const rawQ = queryText || '';

    // Step 1: Parse query into canonical NormalizedQuery contract
    const parsedIntent = parseQueryIntent(rawQ, currentState, isArabic);

    // =========================================================================
    // 1. APP CONTROL COMMANDS
    // =========================================================================
    if (parsedIntent && parsedIntent.type === 'APP_CONTROL') {
      let actions = [];
      let reply = "";

      if (parsedIntent.action === 'CHANGE_THEME') {
        const theme = parsedIntent.params.theme;
        actions.push({ type: 'CHANGE_THEME', params: { theme } });
        reply = isArabic 
          ? `تم تغيير مظهر التطبيق بالكامل إلى ${theme === 'dark' ? 'الوضع الداكن 🌙' : 'الوضع الفاتح ☀️'}` 
          : `Switched application color theme to ${theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`;
        return { reply, actions, results: [] };
      }

      if (parsedIntent.action === 'CHANGE_BASEMAP') {
        const basemapId = parsedIntent.params.basemapId;
        actions.push({ type: ACTION_TYPES.MAP_SET_BASEMAP, params: { basemapId } });
        reply = isArabic 
          ? `تم تغيير الخريطة الأساسية إلى **${basemapId}** بنجاح. 🗺️` 
          : `Switched active map view to **${basemapId.toUpperCase()}** basemap. 🗺️`;
        return { reply, actions, results: [] };
      }

      if (parsedIntent.action === 'CHANGE_LANGUAGE') {
        const lang = parsedIntent.params.lang;
        actions.push({ type: ACTION_TYPES.LANGUAGE_SET, params: { lang } });
        reply = lang === 'ar' ? "تم تحويل لغة التطبيق إلى اللغة العربية (RTL) بنجاح 🇦🇪" : "Switched application language to English 🇬🇧";
        return { reply, actions, results: [] };
      }

      if (parsedIntent.action === 'NAVIGATE') {
        const view = parsedIntent.params.view;
        actions.push({ type: ACTION_TYPES.NAVIGATION_SWITCH, params: { view } });
        reply = isArabic ? "جاري الانتقال إلى الصفحة المطلوبة... 🚀" : `Navigating to ${view.toUpperCase()} screen... 🚀`;
        return { reply, actions, results: [] };
      }

      if (parsedIntent.action === 'EXPORT_PDF' || parsedIntent.action === 'PRINT_MAP') {
        actions.push({ 
          type: ACTION_TYPES.REPORT_GENERATE, 
          params: { format: 'pdf', type: 'spatial-data-report' } 
        });

        const hasSpatialZone = Boolean(
          currentState?.activeDrawnArea || 
          currentState?.drawnCircle || 
          currentState?.drawnRectangle || 
          currentState?.drawnPolygon
        );
        const zoneLabel = currentState?.activeDrawnArea?.label || (isArabic ? 'المنطقة المحددة' : 'Active Spatial Zone');
        const activeCount = currentState?.activeResults?.length || 0;

        reply = isArabic 
          ? (hasSpatialZone
              ? `📄 **جاري تصدير تقرير التحليل المكاني إلى PDF**\n\nتم إعداد تقرير التحليل المكاني الشامل لـ **${zoneLabel}**${activeCount > 0 ? ` متضمناً ${activeCount} منشأة مطابقة` : ''}. جاري فتح نافذة الطباعة والحفظ بصيغة PDF... 🖨️`
              : `📄 **جاري تصدير تقرير الخريطة والبيانات المكانية إلى PDF**\n\nتم تجهيز ملخص البيانات والتحليلات الحالية. جاري فتح نافذة الطباعة والحفظ بصيغة PDF... 🖨️`)
          : (hasSpatialZone
              ? `📄 **Exporting Spatial Analysis to PDF**\n\nComprehensive spatial analysis report generated for **${zoneLabel}**${activeCount > 0 ? ` (${activeCount} matching facilities included)` : ''}. Triggering the print and PDF export layout... 🖨️`
              : `📄 **Exporting Spatial Data Report to PDF**\n\nComprehensive spatial data and map report generated. Triggering the print and PDF export layout... 🖨️`);

        const suggestions = isArabic
          ? ['عرض التحليلات البيانية', 'مسح منطقة الرسم', 'عرض المنشآت الحكومية']
          : ['View analytics dashboard', 'Clear drawn area', 'Show government facilities'];

        return { 
          reply, 
          actions, 
          results: currentState?.activeResults || [], 
          suggestions 
        };
      }

      if (parsedIntent.action === 'CLEAR_DRAWN_SHAPE') {
        actions.push({ type: ACTION_TYPES.MAP_CLEAR_DRAWING, params: {} });
        reply = isArabic 
          ? "تم مسح منطقة الرسم وإلغاء التحديد المكاني من الخريطة بنجاح. 🗺️"
          : "Successfully cleared the drawn spatial boundary and reset the selection on the map. 🗺️";
        const suggestions = isArabic
          ? ['عرض المنشآت الحكومية', 'عرض المعالم السياحية', 'عرض الحدائق العامة', 'عرض محطات النقل']
          : ['Show government facilities', 'Show tourism landmarks', 'Show parks', 'Show public transit'];
        return { reply, actions, results: [], suggestions };
      }

      if (parsedIntent.action === 'CLEAR_DIRECTIONS') {
        actions.push({ type: ACTION_TYPES.CLEAR_DIRECTIONS, params: {} });
        reply = isArabic 
          ? "تم مسح خط سير الاتجاهات وإلغاء المسار من الخريطة بنجاح. 🧭"
          : "Active navigation direction line has been cleared from the map. 🧭";
        const suggestions = isArabic
          ? ['عرض المنشآت بالقرب مني', 'عرض كافة المنشآت في أبوظبي']
          : ['Show facilities near me', 'Show all facilities in Abu Dhabi'];
        return { reply, actions, results: [], suggestions };
      }

      if (parsedIntent.action === 'CLEAR_RISK_FILTER') {
        actions.push({ type: ACTION_TYPES.CLEAR_RISK_FILTER, params: {} });
        
        const masterDataset = getMasterAuthoritativeDataset(currentState?.activeProject?.datasets);
        const activeSubs = Array.isArray(currentState?.selectedGisSubcategories) ? currentState.selectedGisSubcategories : [];
        
        let filtered = masterDataset;
        if (activeSubs.length > 0) {
          const subMatches = masterDataset.filter(loc => matchesGisSubcategories(loc, activeSubs));
          if (subMatches.length > 0) {
            filtered = subMatches;
          }
        }

        const displayResults = filtered.slice(0, 10);
        if (displayResults.length > 0 && typeof displayResults[0].lat === 'number') {
          actions.push({
            type: ACTION_TYPES.MAP_FLY_TO,
            params: { lat: displayResults[0].lat, lng: displayResults[0].lng, zoom: 13 }
          });
        }

        if (filtered.length > 10) {
          reply = isArabic
            ? `تمت إزالة تصفية مستوى الخطورة بنجاح. تم العثور على **${filtered.length} منشأة معتمدة**. عرض **أقرب 10 منشآت**:`
            : `Risk level filter has been cleared. Found **${filtered.length} authoritative facilities**. Showing the **top 10 closest**:`;
        } else {
          reply = isArabic
            ? `تمت إزالة تصفية مستوى الخطورة بنجاح. يتم الآن عرض **${filtered.length} منشأة معتمدة** بدون قيود المخاطر:`
            : `Risk level filter has been cleared. Showing **${filtered.length} authoritative facilities** without risk restrictions:`;
        }

        const suggestions = isArabic
          ? (filtered.length > 10 ? ['عرض 10 منشآت إضافية', 'عرض المنشآت الحكومية', 'عرض المعالم السياحية'] : ['عرض المنشآت الحكومية', 'عرض المعالم السياحية', 'عرض الحدائق العامة'])
          : (filtered.length > 10 ? ['Show next 10 facilities', 'Show government facilities', 'Show tourism landmarks'] : ['Show government facilities', 'Show tourism landmarks', 'Show parks near me']);

        return {
          reply,
          actions,
          results: displayResults,
          totalCount: filtered.length,
          allResults: filtered,
          suggestions,
          datasetsUsed: ['DGE Spatial SDI 2026'],
          activeContext: {
            category: 'ALL',
            activeLocations: displayResults,
            allResults: filtered,
            totalCount: filtered.length,
            paginationOffset: 0,
            lastSearchLabel: 'facilities',
            lastSearchLabelAr: 'منشأة',
            lastRefLabel: 'Abu Dhabi',
            lastParsedIntent: parsedIntent,
            selectedFeature: displayResults[0]
          }
        };
      }

      if (parsedIntent.action === 'EXPAND_SEARCH_RADIUS') {
        const origin = (currentState?.selectedLocation && typeof currentState.selectedLocation.lat === 'number')
          ? currentState.selectedLocation
          : (currentState?.mapFocus && typeof currentState.mapFocus.lat === 'number')
            ? currentState.mapFocus
            : (currentState?.userLocation && typeof currentState.userLocation.lat === 'number')
              ? currentState.userLocation
              : { lat: 24.4839, lng: 54.3773 };

        const refName = currentState?.selectedLocation?.name || 'current view';
        const refNameAr = currentState?.selectedLocation?.name_ar || 'العرض الحالي';

        const masterDataset = getMasterAuthoritativeDataset(currentState?.activeProject?.datasets);
        const radiusKm = 25;

        const enriched = masterDataset
          .map(item => {
            const distKm = calculateGeodesicDistance(origin.lat, origin.lng, item.lat, item.lng);
            return { ...item, distanceKm: distKm, distance: formatDistance(distKm) };
          })
          .sort((a, b) => a.distanceKm - b.distanceKm);

        const withinRadius = enriched.filter(item => item.distanceKm <= radiusKm);
        const finalEnriched = withinRadius.length > 0 ? withinRadius : enriched;
        const displayResults = finalEnriched.slice(0, 10);

        if (displayResults.length > 0 && typeof origin.lat === 'number') {
          actions.push({
            type: ACTION_TYPES.MAP_FLY_TO,
            params: { lat: origin.lat, lng: origin.lng, zoom: 12 }
          });
        }

        if (finalEnriched.length > 10) {
          reply = isArabic
            ? `تم توسيع نطاق البحث إلى ${radiusKm} كم حول **${refNameAr}**. تم العثور على **${finalEnriched.length} منشأة**. عرض **أقرب 10 منشآت**:`
            : `Expanded search radius to ${radiusKm} km around **${refName}**. Found **${finalEnriched.length} facilities**. Showing the **top 10 closest**:`;
        } else {
          reply = isArabic
            ? `تم توسيع نطاق البحث إلى ${radiusKm} كم حول **${refNameAr}**. تم العثور على **${finalEnriched.length} منشأة**، مرتبة حسب القرب:`
            : `Expanded search radius to ${radiusKm} km around **${refName}**. Found **${finalEnriched.length} facilities**, ordered by proximity:`;
        }

        const suggestions = isArabic
          ? (finalEnriched.length > 10 ? ['عرض 10 منشآت إضافية', 'عرض كافة المنشآت في أبوظبي', 'عرض المنشآت الحكومية'] : ['عرض كافة المنشآت في أبوظبي', 'عرض المنشآت الحكومية', 'عرض المستشفيات'])
          : (finalEnriched.length > 10 ? ['Show next 10 facilities', 'Show all facilities in Abu Dhabi', 'Show government facilities'] : ['Show all facilities in Abu Dhabi', 'Show government facilities', 'Show hospitals']);

        return {
          reply,
          actions,
          results: displayResults,
          totalCount: finalEnriched.length,
          allResults: finalEnriched,
          suggestions,
          datasetsUsed: ['DGE Spatial SDI 2026'],
          activeContext: {
            category: 'ALL',
            activeLocations: displayResults,
            allResults: finalEnriched,
            totalCount: finalEnriched.length,
            paginationOffset: 0,
            lastSearchLabel: 'facilities',
            lastSearchLabelAr: 'منشأة',
            lastRefLabel: refName,
            lastParsedIntent: parsedIntent,
            selectedFeature: displayResults[0]
          }
        };
      }

      if (parsedIntent.action === 'OPEN_FACILITY_DETAIL') {
        const target = parsedIntent.target || currentState?.selectedLocation || currentState?.activeContext?.selectedFeature || currentState?.activeResults?.[0];
        if (target) {
          actions.push({ type: ACTION_TYPES.FACILITY_OPEN_DETAIL, params: { facility: target } });
          const name = isArabic && target.name_ar ? target.name_ar : target.name;
          reply = isArabic 
            ? `جاري فتح لوحة التفاصيل والمقاييس الشاملة لـ **${name}**... 📋`
            : `Opening comprehensive facility metrics panel for **${name}**... 📋`;
          const suggestions = isArabic
            ? ['عرض منشآت بالقرب من هذا الموقع', 'عرض كافة المنشآت في أبوظبي']
            : ['Show facilities near this location', 'Show other facilities in Abu Dhabi'];
          return { reply, actions, results: [target], suggestions };
        }
      }
    }

    // =========================================================================
    // 2. AMBIGUOUS QUERIES (Clarification required, NO guessing, NO dummy data)
    // =========================================================================
    if (parsedIntent && parsedIntent.type === 'AMBIGUOUS') {
      const reply = isArabic
        ? "❓ **يرجى تحديد الفئة المطلوبة**:\nما نوع المنشآت أو المعالم التي ترغب في استكشافها في إمارة أبوظبي؟"
        : "❓ **Clarification Required**:\nWhich type of facilities or landmarks would you like to explore in Abu Dhabi?";

      const suggestions = isArabic
        ? ['عرض المنشآت الحكومية', 'عرض المعالم السياحية', 'عرض الحدائق بالقرب مني', 'عرض محطات النقل']
        : ['Show government facilities', 'Show tourism landmarks', 'Show parks near me', 'Show public transit'];

      return {
        reply,
        results: [],
        actions: [],
        suggestions,
        datasetsUsed: ['DGE Spatial SDI 2026']
      };
    }

    // =========================================================================
    // 3. DIRECTIONS / ROUTING
    // =========================================================================
    if (parsedIntent && parsedIntent.type === 'DIRECTIONS') {
      const userLat = currentState?.userLocation?.lat || 24.4839;
      const userLng = currentState?.userLocation?.lng || 54.3773;
      const userOrigin = { lat: userLat, lng: userLng };

      const dest = parsedIntent.target || currentState?.selectedLocation || currentState?.activeContext?.selectedFeature || currentState?.activeResults?.[0];

      if (!dest) {
        const reply = isArabic
          ? "⚠️ **تحديد الوجهة**:\nيرجى تحديد منشأة أو موقع من نتائج البحث أولاً لحساب المسار والمسافة."
          : "⚠️ **Target Location Required**:\nPlease select a facility or search result first to calculate geodesic distance and routing.";
        return { reply, results: [], actions: [] };
      }

      const routeCheck = await routingService.calculateRoute(userOrigin, dest);
      const destName = isArabic && dest.name_ar ? dest.name_ar : dest.name;
      const dist = calculateGeodesicDistance(userLat, userLng, dest.lat, dest.lng);

      const reply = isArabic
        ? `🧭 **خدمة الاتجاهات والمسارات**:\n${routeCheck.message_ar || 'تم تحديد المسافة الجغرافية المستقيمة.'}\n\nالموقع المستهدف: **${destName}** (المسافة الهوائية الدقيقة: **${dist} كم**). تم التركيز على الموقع في الخريطة دون رسم مسارات وهمية.`
        : `🧭 **Routing & Direction Service**:\n${routeCheck.message || 'Calculated straight-line geodesic distance.'}\n\nTarget facility: **${destName}** (exact geodesic distance: **${dist} km**). Map focused on the target asset without fabricating unverified routes.`;

      const actions = [{ type: ACTION_TYPES.MAP_FLY_TO, params: { lat: dest.lat, lng: dest.lng, zoom: 15 } }];
      const suggestions = isArabic
        ? ['عرض منشآت بالقرب من هذا الموقع', 'عرض كافة المنشآت في أبوظبي']
        : ['Show facilities near this location', 'Show other facilities in Abu Dhabi'];

      return { reply, results: [dest], actions, suggestions };
    }

    // =========================================================================
    // 4. COMPARATIVE ANALYTICS (Only on explicit request with valid context)
    // =========================================================================
    if (parsedIntent && parsedIntent.type === 'ANALYTICS') {
      const activeList = currentState?.activeResults || [];
      if (activeList.length === 0) {
        const reply = isArabic
          ? "📊 **لا توجد منشآت نشطة للمقارنة**:\nيرجى البحث عن مجموعة من المنشآت أولاً (مثل: المنشآت الحكومية أو الصناعية) لعرض الرسم البياني المقارن."
          : "📊 **No Active Assets to Compare**:\nPlease search for facilities first (e.g. 'Show government facilities' or 'Show manufacturing facilities') to generate a comparative analysis.";
        return { reply, results: [], actions: [] };
      }

      const sampleList = activeList.slice(0, 5);
      const chartData = {
        id: 'comp-' + Date.now(),
        title: isArabic ? "مقارنة مؤشر الانبعاثات التقديري (طن كربون/سنة)" : "Comparative Emissions Index (tCO2e/yr)",
        type: 'bar',
        data: sampleList.map(item => ({
          label: isArabic && item.name_ar ? item.name_ar : item.name,
          name: isArabic && item.name_ar ? item.name_ar : item.name,
          value: item.emissionsIndex || 15000,
          color: item.riskLevel === 'Critical' ? '#f43f5e' : item.riskLevel === 'High' ? '#f59e0b' : '#3b82f6'
        }))
      };

      const reply = isArabic
        ? "تم إنشاء الرسم البياني التحليلي المقارن للمنشآت النشطة بناءً على طلبك:"
        : "Generated comparative analysis chart for the active search results:";

      const suggestions = isArabic
        ? ['أيها الأقرب لي؟', 'عرض كافة المنشآت في أبوظبي', 'تصدير التحليلات']
        : ['Which one is closest?', 'Show all facilities in Abu Dhabi', 'Export Analysis'];

      return { reply, chartData, results: sampleList, outputType: 'chart', suggestions };
    }

    // 4B. Deep Risk Analytics / Historical Trend / Proximity Comparison
    if (parsedIntent && parsedIntent.type === 'ORCHESTRATOR_TASK') {
      const orchestratorResult = await aiOrchestrator.processUserQuery(rawQ, currentState, isArabic);
      if (orchestratorResult) return orchestratorResult;
    }

    // 4C. Pagination / "List More" / "Show Next 10" Handling
    if (parsedIntent && parsedIntent.type === 'PAGINATION') {
      const activeCtx = currentState?.activeContext || {};
      const allList = activeCtx.allResults || activeCtx.activeLocations || [];
      const total = activeCtx.totalCount || allList.length;
      const currentOffset = parsedIntent.offset || 10;
      const pageSize = parsedIntent.limit || 10;

      if (allList.length === 0) {
        const reply = isArabic
          ? "يرجى البحث عن مجموعة من المنشآت أولاً (مثل: المنشآت الحكومية أو المرافق القريبة) لعرض المزيد من النتائج."
          : "Please search for facilities first (e.g., 'Show facilities near me' or 'Show government facilities') to browse additional results.";
        return { reply, results: [], totalCount: 0, suggestions: isArabic ? ['عرض المنشآت بالقرب مني'] : ['Show facilities near me'] };
      }

      const nextBatch = allList.slice(currentOffset, currentOffset + pageSize);

      if (nextBatch.length === 0) {
        const reply = isArabic
          ? `تم بالفعل عرض جميع المنشآت المطابقة بالكامل (${total} منشأة). لا توجد نتائج إضافية.`
          : `All **${total} matching facilities** have already been listed. No additional results remaining.`;
        return {
          reply,
          results: [],
          totalCount: total,
          suggestions: isArabic
            ? ['أيها الأقرب لي؟', 'عرض منشآت بالقرب من هذا الموقع', 'عرض كافة المنشآت في أبوظبي']
            : ['Which one is closest?', 'Show facilities near this location', 'Show all facilities in Abu Dhabi']
        };
      }

      const startIdx = currentOffset + 1;
      const endIdx = currentOffset + nextBatch.length;
      const searchLbl = activeCtx.lastSearchLabel || 'facilities';
      const searchLblAr = activeCtx.lastSearchLabelAr || 'منشأة';
      const refLbl = activeCtx.lastRefLabel || (isArabic ? 'موقعك الجغرافي' : 'your location');

      const reply = isArabic
        ? `عرض المنشآت من **${startIdx} إلى ${endIdx}** من أصل **${total} ${searchLblAr}** بالقرب من **${refLbl}**، مرتبة حسب القرب الجغرافي:`
        : `Showing facilities **${startIdx} to ${endIdx}** of **${total} verified ${searchLbl}** near **${refLbl}**, ordered by proximity:`;

      const topItem = nextBatch[0];
      const actions = [];
      if (topItem && typeof topItem.lat === 'number' && typeof topItem.lng === 'number') {
        actions.push(
          { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: activeCtx.category || 'ALL' }, matchingResults: nextBatch } },
          { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topItem.lat, lng: topItem.lng, zoom: 14 } }
        );
      }

      const hasEvenMore = endIdx < total;
      const suggestions = isArabic
        ? (hasEvenMore 
            ? ['عرض 10 منشآت إضافية', 'أيها الأقرب لي؟', 'مقارنة هذه المنشآت']
            : ['أيها الأقرب لي؟', 'عرض منشآت بالقرب من هذا الموقع', 'عرض كافة المنشآت في أبوظبي'])
        : (hasEvenMore
            ? ['Show next 10 facilities', 'Which one is closest?', 'Compare these facilities']
            : ['Which one is closest?', 'Show facilities near this location', 'Show all facilities in Abu Dhabi']);

      return {
        reply,
        results: nextBatch,
        totalCount: total,
        allResults: allList,
        actions,
        suggestions,
        datasetsUsed: ['DGE Spatial SDI 2026', 'Authoritative Facilities Registry'],
        activeContext: {
          ...activeCtx,
          activeLocations: nextBatch,
          paginationOffset: currentOffset,
          selectedFeature: topItem
        }
      };
    }

    // =========================================================================
    // 5. STRUCTURED GIS QUERY EXECUTION (Strict logical AND, No random fallbacks)
    // =========================================================================
    const queryResult = executeGisQuery(parsedIntent, {
      userLocation: currentState?.userLocation,
      selectedLocation: currentState?.selectedLocation || currentState?.activeContext?.selectedFeature || currentState?.activeResults?.[0],
      activeProject: currentState?.activeProject,
      activeDrawnArea: currentState?.activeDrawnArea,
      drawnRectangle: currentState?.drawnRectangle || currentState?.drawings?.find(d => d.type === 'rectangle')?.bounds,
      drawnCircle: currentState?.drawnCircle || currentState?.drawings?.find(d => d.type === 'circle'),
      drawnPolygon: currentState?.drawnPolygon || currentState?.drawings?.find(d => d.type === 'polygon')?.positions,
      hasActiveDrawingFilter: Boolean(
        currentState?.activeDrawnArea ||
        currentState?.drawnRectangle || 
        currentState?.drawnCircle || 
        currentState?.drawnPolygon ||
        (currentState?.drawings && currentState.drawings.length > 0)
      )
    });

    // 5A. Dataset Unavailable (e.g. libraries, restaurants, banks)
    if (queryResult.status === 'DATASET_UNAVAILABLE') {
      return {
        reply: isArabic ? queryResult.message_ar : queryResult.message_en,
        results: [],
        actions: [],
        suggestions: isArabic 
          ? ['عرض المنشآت الحكومية', 'عرض الحدائق العامة', 'عرض المعالم السياحية', 'عرض محطات النقل']
          : queryResult.suggestions,
        datasetsUsed: ['DGE Spatial SDI 2026']
      };
    }

    // 5B. Zero Results (Criteria too restrictive or zero matches in area)
    if (queryResult.status === 'ZERO_RESULTS') {
      return {
        reply: isArabic ? queryResult.message_ar : queryResult.message_en,
        results: [],
        actions: [],
        suggestions: isArabic 
          ? (queryResult.suggestionsAr || ['توسيع نطاق البحث', 'عرض كافة المنشآت في أبوظبي'])
          : (queryResult.suggestions || ['Expand search radius', 'Show all facilities in Abu Dhabi']),
        datasetsUsed: ['DGE Spatial SDI 2026']
      };
    }

    // 5C. Success (Valid results from authoritative data)
    const allResults = queryResult.results;
    const totalCount = allResults.length;
    const actions = [];

    // Max results per batch: Always cap to top 10 in chat interface to avoid dumping dozens of cards
    const MAX_PAGE_SIZE = 10;
    const isTruncated = totalCount > MAX_PAGE_SIZE && (!parsedIntent.limit || parsedIntent.limit > MAX_PAGE_SIZE);
    const results = isTruncated ? allResults.slice(0, MAX_PAGE_SIZE) : allResults;
    const topItem = results[0];

    // Focus map on top item or extent
    if (topItem && typeof topItem.lat === 'number' && typeof topItem.lng === 'number') {
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: parsedIntent.category || 'ALL' }, matchingResults: allResults, subcategories: parsedIntent.autoActivateSubcategories } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topItem.lat, lng: topItem.lng, zoom: results.length === 1 ? 16 : 14 } }
      );
      if (results.length === 1 || parsedIntent.limit === 1) {
        actions.push({ type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topItem } });
      }
    }

    // Auto-synchronize Category Drawer state if query matched a specific category/subcategory
    if (parsedIntent.autoActivateSubcategories && parsedIntent.autoActivateSubcategories.length > 0) {
      actions.push({
        type: ACTION_TYPES.GIS_SYNC_SUBCATEGORIES,
        params: {
          subcategories: parsedIntent.autoActivateSubcategories,
          categoryId: parsedIntent.autoActivateCategory,
          expandCategory: parsedIntent.autoActivateCategory,
          activeResults: results
        }
      });
    }

    // Formulate response text
    let reply = "";
    const searchLabel = parsedIntent.subType || parsedIntent.categoryMetadata?.name_en || parsedIntent.category || 'facilities';
    const searchLabelAr = parsedIntent.subType || parsedIntent.categoryMetadata?.name_ar || 'منشأة';

    const refLabel = isArabic 
      ? (queryResult.referenceNameAr || 'موقعك الجغرافي')
      : (queryResult.referenceName || 'your location');

    const hasDrawnScope = parsedIntent.isDrawnShapeQuery || (
      parsedIntent.referenceLocationType !== 'selected' && Boolean(
        currentState?.activeDrawnArea ||
        currentState?.drawnRectangle || 
        currentState?.drawnCircle || 
        currentState?.drawnPolygon || 
        (currentState?.drawings && currentState.drawings.length > 0)
      )
    );

    if (hasDrawnScope) {
      const areaLabel = currentState?.activeDrawnArea?.label || 'the drawn area';
      const areaLabelAr = currentState?.activeDrawnArea?.label_ar || 'المنطقة المحددة على الخريطة';
      if (isTruncated) {
        reply = isArabic
          ? `تم العثور على **${totalCount} ${searchLabelAr}** داخل ${areaLabelAr}. عرض **أقرب 10 منشآت**:`
          : `Found **${totalCount} verified ${searchLabel}** within ${areaLabel}. Showing the **top 10 closest**:`;
      } else {
        reply = isArabic
          ? `تم العثور على **${results.length} ${searchLabelAr}** داخل ${areaLabelAr}:`
          : `Found **${results.length} verified ${searchLabel}** within ${areaLabel}:`;
      }
    } else if (parsedIntent.isRefinement) {
      if (isTruncated) {
        reply = isArabic
          ? `تمت تصفية النتائج ضمن الطبقات المحددة: تم العثور على **${totalCount} منشأة**. عرض **أقرب 10 منشآت**:`
          : `Filtered results within your active layer selection: Found **${totalCount} matching facilities**. Showing the **top 10 closest**:`;
      } else {
        reply = isArabic
          ? `تمت تصفية النتائج ضمن الطبقات المحددة حالياً: تم العثور على **${results.length} منشأة** مطابقة للشروط المطلوبة، مرتبة حسب القرب:`
          : `Filtered results within your active layer selection: Found **${results.length} matching facilities**, ordered by distance:`;
      }
    } else if (parsedIntent.type === 'PROXIMITY_RANK' || parsedIntent.limit === 1) {
      const matchName = isArabic && topItem.name_ar ? topItem.name_ar : topItem.name;
      const distStr = topItem.distance || `${topItem.distanceKm} km`;
      reply = isArabic
        ? `أقرب موقع مطابق لبحثك هو **${matchName}**، على بعد **${distStr}** من ${refLabel}.`
        : `The closest matching facility to ${refLabel} is **${matchName}**, approximately **${distStr}** away.`;
    } else if (parsedIntent.referenceLocationType === 'selected' && queryResult.referenceName) {
      if (isTruncated) {
        reply = isArabic
          ? `تم العثور على **${totalCount} منشأة/معلم** بالقرب من **${refLabel}**. عرض **أقرب 10 منشآت**:`
          : `Found **${totalCount} verified ${searchLabel}** near **${refLabel}**. Showing the **top 10 closest**:`;
      } else {
        reply = isArabic
          ? `تم العثور على **${results.length} منشأة/معلم** بالقرب من **${refLabel}**، مرتبة حسب المسافة الجغرافية:`
          : `Found **${results.length} verified ${searchLabel}** near **${refLabel}**, ordered by distance:`;
      }
    } else if (parsedIntent.autoActivateCategory && parsedIntent.autoActivateSubcategories) {
      const activeCatName = isArabic 
        ? getCategoryLocalizedName(parsedIntent.autoActivateCategory, true)
        : getCategoryLocalizedName(parsedIntent.autoActivateCategory, false);
      const areaSuffixEn = (parsedIntent.geographicArea && parsedIntent.geographicArea.id !== 'abu-dhabi')
        ? ` in **${parsedIntent.geographicArea.name_en || queryResult.referenceName}**`
        : '';
      const areaSuffixAr = (parsedIntent.geographicArea && parsedIntent.geographicArea.id !== 'abu-dhabi')
        ? ` في **${parsedIntent.geographicArea.name_ar || queryResult.referenceNameAr}**`
        : '';

      if (isTruncated) {
        reply = isArabic
          ? `تم تفعيل طبقة **${activeCatName}** في قائمة التصنيفات. تم العثور على **${totalCount} ${searchLabelAr}**${areaSuffixAr}. عرض **أقرب 10 منشآت**:`
          : `Activated **${activeCatName}** in the layer drawer. Found **${totalCount} verified ${searchLabel}**${areaSuffixEn}. Showing the **top 10 closest**:`;
      } else {
        reply = isArabic
          ? `تم تفعيل طبقة **${activeCatName}** في قائمة التصنيفات. تم العثور على **${results.length} ${searchLabelAr}**${areaSuffixAr}، مرتبة حسب القرب الجغرافي:`
          : `Activated **${activeCatName}** in the layer drawer. Found **${results.length} verified ${searchLabel}**${areaSuffixEn}, ordered by proximity:`;
      }
    } else {
      const areaSuffixEn = (parsedIntent.geographicArea && parsedIntent.geographicArea.id !== 'abu-dhabi')
        ? ` in **${parsedIntent.geographicArea.name_en || queryResult.referenceName}**`
        : '';
      const areaSuffixAr = (parsedIntent.geographicArea && parsedIntent.geographicArea.id !== 'abu-dhabi')
        ? ` في **${parsedIntent.geographicArea.name_ar || queryResult.referenceNameAr}**`
        : '';

      if (isTruncated) {
        reply = isArabic
          ? `تم العثور على **${totalCount} منشأة/معلم**${areaSuffixAr}. عرض **أقرب 10 منشآت**:`
          : `Found **${totalCount} verified ${searchLabel}**${areaSuffixEn} matching all requested criteria. Showing the **top 10 closest**:`;
      } else {
        reply = isArabic
          ? `تم العثور على **${results.length} منشأة/معلم**${areaSuffixAr}، مرتبة حسب القرب الجغرافي:`
          : `Found **${results.length} verified ${searchLabel}**${areaSuffixEn} matching all requested criteria, ordered by distance:`;
      }
    }

    // Context-aware suggestions:
    // When only 1 result is returned or when the query was already proximity-ranked ("Which one is closest?"),
    // NEVER offer "Which one is closest?" or "Compare these facilities"!
    let suggestions = [];
    const isSingleResult = results.length === 1 || parsedIntent.limit === 1;
    const wasClosestQuery = parsedIntent.type === 'PROXIMITY_RANK' || parsedIntent.intent === 'CLOSEST';

    if (isSingleResult || wasClosestQuery) {
      const hasHighRisk = topItem && (topItem.riskLevel === 'Critical' || topItem.riskLevel === 'High');

      if (hasHighRisk) {
        suggestions = isArabic
          ? ['عرض تفاصيل المنشأة', 'لماذا تعتبر عالية الخطورة؟', 'عرض منشآت بالقرب من هذا الموقع']
          : ['Show facility details', 'Why is this facility high risk?', 'Show facilities near this location'];
      } else if (parsedIntent.subType === 'hospital' || topItem?.type === 'HOSPITAL' || topItem?.category_en?.toLowerCase().includes('hospital')) {
        suggestions = isArabic
          ? ['عرض تفاصيل المنشأة', 'عرض منشآت بالقرب من هذا الموقع', 'عرض كافة المستشفيات في أبوظبي']
          : ['Show facility details', 'Show facilities near this location', 'Show all hospitals in Abu Dhabi'];
      } else if (parsedIntent.subType === 'school' || topItem?.type === 'EDUCATION' || topItem?.category_en?.toLowerCase().includes('school')) {
        suggestions = isArabic
          ? ['عرض تفاصيل المنشأة', 'عرض منشآت بالقرب من هذا الموقع', 'عرض كافة المدارس في أبوظبي']
          : ['Show facility details', 'Show facilities near this location', 'Show all schools in Abu Dhabi'];
      } else if (parsedIntent.subType === 'park' || topItem?.type === 'PARK' || topItem?.category_en?.toLowerCase().includes('park')) {
        suggestions = isArabic
          ? ['عرض تفاصيل المنشأة', 'عرض منشآت بالقرب من هذا الموقع', 'عرض كافة الحدائق في أبوظبي']
          : ['Show facility details', 'Show facilities near this location', 'Show all parks in Abu Dhabi'];
      } else if (parsedIntent.category === 'GOVERNMENT' || topItem?.type === 'GOVERNMENT') {
        suggestions = isArabic
          ? ['عرض تفاصيل المنشأة', 'عرض منشآت بالقرب من هذا الموقع', 'عرض كافة المراكز الحكومية']
          : ['Show facility details', 'Show facilities near this location', 'Show all government centers'];
      } else if (parsedIntent.category === 'PUBLIC_SAFETY' || topItem?.type === 'PUBLIC_SAFETY') {
        suggestions = isArabic
          ? ['عرض تفاصيل المنشأة', 'عرض منشآت بالقرب من هذا الموقع', 'عرض كافة مراكز السلامة العامة']
          : ['Show facility details', 'Show facilities near this location', 'Show all public safety stations'];
      } else {
        suggestions = isArabic
          ? ['عرض تفاصيل المنشأة', 'عرض منشآت بالقرب من هذا الموقع', 'عرض منشآت أخرى في أبوظبي']
          : ['Show facility details', 'Show facilities near this location', 'Show other facilities in Abu Dhabi'];
      }
    } else {
      // MULTIPLE RESULTS:
      // If there are more results than shown, suggest "Show next 10 facilities" first!
      if (isTruncated) {
        suggestions = isArabic
          ? ['عرض 10 منشآت إضافية', 'أيها الأقرب لي؟', 'مقارنة هذه المنشآت', 'تصدير التحليل إلى PDF']
          : ['Show next 10 facilities', 'Which one is closest?', 'Compare these facilities', 'Export spatial analysis to PDF'];
      } else {
        suggestions = isArabic
          ? ['أيها الأقرب لي؟', 'مقارنة هذه المنشآت', 'تصدير التحليل إلى PDF']
          : ['Which one is closest?', 'Compare these facilities', 'Export spatial analysis to PDF'];
      }
    }

    const hasActiveShape = Boolean(
      parsedIntent.isDrawnShapeQuery || 
      currentState?.drawnRectangle || 
      currentState?.drawnCircle || 
      currentState?.drawnPolygon || 
      (currentState?.drawings && currentState.drawings.length > 0)
    );
    if (hasActiveShape && !suggestions.includes('Clear drawn area') && !suggestions.includes('مسح منطقة الرسم')) {
      suggestions.push(isArabic ? 'مسح منطقة الرسم' : 'Clear drawn area');
    }

    return {
      reply,
      results,
      totalCount,
      allResults,
      actions,
      suggestions,
      datasetsUsed: ['DGE Spatial SDI 2026', 'Authoritative Facilities Registry'],
      activeContext: { 
        category: parsedIntent.category, 
        subType: parsedIntent.subType,
        activeLocations: results, 
        allResults,
        totalCount,
        paginationOffset: 0,
        lastSearchLabel: searchLabel,
        lastSearchLabelAr: searchLabelAr,
        lastRefLabel: refLabel,
        lastParsedIntent: parsedIntent,
        selectedFeature: topItem 
      }
    };
  }
};
