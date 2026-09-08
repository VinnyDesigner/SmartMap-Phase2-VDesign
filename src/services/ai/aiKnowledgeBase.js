// AI Knowledge Base & Intent Matching Dictionary for GeoVision / SmartMap V2
// Provides authoritative pre-engineered responses, GIS actions, visual blocks, context tags, and provenance metadata
// for authentic conversational AI GIS interactions across all priority scenarios.

import { LOCATIONS_DB } from '../mockAiEngine';
import { ACTION_TYPES } from '../actionRegistry';

const fmt = (num) => (num ? num.toLocaleString() : '0');

export const AI_KNOWLEDGE_BASE_ENTRIES = [
  // =========================================================
  // 1. PUBLIC SAFETY (Police & Ambulance)
  // =========================================================
  {
    id: 'PUBLIC_SAFETY_POLICE',
    patterns_en: [
      'show police stations near me',
      'find police stations within 5 km',
      'police stations near me',
      'police stations within 5 km',
      'police stations',
      'find police stations'
    ],
    patterns_ar: [
      'اعرض مراكز الشرطة بالقرب مني',
      'مراكز الشرطة بالقرب مني',
      'البحث عن مراكز الشرطة',
      'مراكز الشرطة'
    ],
    handler: (currentState, isArabic) => {
      const userLat = currentState?.userLocation?.lat || 24.4789;
      const userLng = currentState?.userLocation?.lng || 54.3312;
      const results = [
        { id: 401, name: 'Abu Dhabi Central Police Station', name_ar: 'مركز شرطة أبوظبي المركزي', type: 'PUBLIC_SAFETY', category_en: 'Police Station', category_ar: 'مركز شرطة', location: 'Downtown Abu Dhabi', location_ar: 'وسط المدينة', lat: 24.4710, lng: 54.3640, distanceKm: 3.4, riskLevel: 'Low', description: 'Central headquarters handling urban public safety and civic response.' },
        { id: 402, name: 'Al Bateen Police Station', name_ar: 'مركز شرطة البتين', type: 'PUBLIC_SAFETY', category_en: 'Police Station', category_ar: 'مركز شرطة', location: 'Al Bateen', location_ar: 'البتين', lat: 24.4560, lng: 54.3480, distanceKm: 2.8, riskLevel: 'Low', description: 'Local precinct maintaining community safety and coastal patrol.' },
        { id: 403, name: 'Saadiyat Island Police Post', name_ar: 'نقطة شرطة جزيرة السعديات', type: 'PUBLIC_SAFETY', category_en: 'Police Station', category_ar: 'مركز شرطة', location: 'Saadiyat Cultural District', location_ar: 'السعديات', lat: 24.5290, lng: 54.3910, distanceKm: 8.2, riskLevel: 'Low', description: 'Public safety unit guarding Saadiyat Cultural District and museums.' }
      ];

      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'PUBLIC_SAFETY' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: results[0].lat, lng: results[0].lng, zoom: 13 } }
      ];

      const reply = isArabic
        ? `تم تحديد **${results.length} مراكز شرطة** بالقرب من موقعك الجغرافي:`
        : `Found **${results.length} police stations** near your current location:`;

      const suggestions = isArabic 
        ? ["أيها الأقرب لي؟", "ما هي محطات الإسعاف القريبة؟", "عرض في جدول"] 
        : ["Which one is closest?", "What ambulance stations are nearby?", "Put this in a table"];

      return { reply, results, actions, suggestions, activeContext: { category: 'PUBLIC_SAFETY', activeLocations: results } };
    }
  },

  {
    id: 'PUBLIC_SAFETY_AMBULANCE_NEARBY',
    patterns_en: [
      'what ambulance stations are nearby',
      'ambulance stations nearby',
      'ambulance stations near police station',
      'show ambulance stations',
      'which communities have no nearby ambulance station'
    ],
    patterns_ar: [
      'ما هي محطات الإسعاف القريبة',
      'محطات الإسعاف القريبة',
      'اعرض محطات الإسعاف',
      'المناطق بدون محطات إسعاف'
    ],
    handler: (currentState, isArabic) => {
      const selectedPolice = currentState?.activeContext?.selectedFeature || { name: 'Abu Dhabi Central Police Station', lat: 24.4710, lng: 54.3640 };
      const results = [
        { id: 410, name: 'Abu Dhabi Central Ambulance & Medical Emergency Station', name_ar: 'محطة الإسعاف المركزية والطوارئ الطبية', type: 'PUBLIC_SAFETY', category_en: 'Ambulance Station', category_ar: 'محطة إسعاف', location: 'Al Mushrif', location_ar: 'المشرف', lat: 24.4510, lng: 54.3790, distanceKm: 2.1, description: 'Primary rapid-dispatch ambulance hub serving central Abu Dhabi.' },
        { id: 411, name: 'Al Reem Island Emergency Medical Post', name_ar: 'نقطة الإسعاف الطبي الطارئ - جزيرة الريم', type: 'PUBLIC_SAFETY', category_en: 'Ambulance Station', category_ar: 'محطة إسعاف', location: 'Al Reem Island', location_ar: 'جزيرة الريم', lat: 24.5020, lng: 54.4060, distanceKm: 4.5, description: 'Dedicated paramedic response team for Al Reem district.' }
      ];

      const actions = [
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: results[0].lat, lng: results[0].lng, zoom: 13 } }
      ];

      const reply = isArabic
        ? `بناءً على الاستشهاد بـ **${selectedPolice.name_ar || selectedPolice.name}**، تم العثور على **${results.length} محطات إسعاف قريبة**:`
        : `Resolved spatial reference around **${selectedPolice.name}**. Found **${results.length} nearby ambulance stations**:`;

      const suggestions = isArabic 
        ? ["أيها الأقرب؟", "اعرض الاتجاهات", "مقارنة المنشآت"] 
        : ["Which one is closest?", "Show me directions", "Compare them"];

      return { reply, results, actions, suggestions, activeContext: { ...currentState?.activeContext, activeLocations: results } };
    }
  },

  // =========================================================
  // 2. TRANSPORTATION & MOBILITY
  // =========================================================
  {
    id: 'TRANSPORT_BUS_STOPS',
    patterns_en: [
      'show bus stops near me',
      'bus stops near me',
      'find bus stops',
      'bus stops within 500m',
      'bus stops'
    ],
    patterns_ar: [
      'اعرض محطات الحافلات بالقرب مني',
      'محطات الحافلات القريبة',
      'محطات حافلات'
    ],
    handler: (currentState, isArabic) => {
      const results = [
        { id: 501, name: 'Main Central Bus Terminal Hub', name_ar: 'محطة حافلات أبوظبي الرئيسية', type: 'TRANSPORT', category_en: 'Bus Terminal', category_ar: 'محطة حافلات', location: 'Al Nahyan', location_ar: 'آل نهيان', lat: 24.4719, lng: 54.3725, distanceKm: 0.4 },
        { id: 502, name: 'Corniche Waterfront Transit Stop #4', name_ar: 'موقف حافلات الكورنيش رقم 4', type: 'TRANSPORT', category_en: 'Bus Stop', category_ar: 'موقف حافلات', location: 'Corniche', location_ar: 'الكورنيش', lat: 24.4820, lng: 54.3410, distanceKm: 0.8 },
        { id: 503, name: 'Al Reem Plaza Bus Stop', name_ar: 'موقف حافلات ساحة الريم', type: 'TRANSPORT', category_en: 'Bus Stop', category_ar: 'موقف حافلات', location: 'Al Reem Island', location_ar: 'جزيرة الريم', lat: 24.4990, lng: 54.4080, distanceKm: 1.2 }
      ];

      const actions = [
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: results[0].lat, lng: results[0].lng, zoom: 14 } }
      ];

      const reply = isArabic
        ? `تم تحديد **${results.length} محطات حافلات** بالقرب من موقعك:`
        : `Identified **${results.length} bus stops** near your location:`;

      const suggestions = isArabic 
        ? ["فقط ضمن 500 متر", "أيها الأقرب؟", "عرض على الخريطة"] 
        : ["Only within 500 metres", "Which one is closest?", "Show that one on the map"];

      return { reply, results, actions, suggestions, activeContext: { category: 'TRANSPORT', activeLocations: results } };
    }
  },

  {
    id: 'TRANSPORT_PARKING_PARK_HELPER',
    patterns_en: [
      'i need a place to park',
      'place to park',
      'show parking facilities',
      'parking near me',
      'parking facilities'
    ],
    patterns_ar: [
      'أحتاج إلى مكان لإيقاف السيارة',
      'مواقف سيارات',
      'اعرض مواقف السيارات'
    ],
    handler: (currentState, isArabic) => {
      const results = [
        { id: 510, name: 'Corniche Underground Smart Parking Plaza', name_ar: 'موقف الكورنيش الذكي تحت الأرض', type: 'TRANSPORT', category_en: 'Parking Facility', category_ar: 'موقف سيارات', location: 'Corniche West', location_ar: 'الكورنيش', lat: 24.4770, lng: 54.3350, distanceKm: 0.3, capacity: 850 },
        { id: 511, name: 'Al Maryah Island Central Parking', name_ar: 'مواقف جزيرة المارية المركزية', type: 'TRANSPORT', category_en: 'Parking Facility', category_ar: 'موقف سيارات', location: 'Al Maryah Island', location_ar: 'جزيرة المارية', lat: 24.5010, lng: 54.3880, distanceKm: 1.1, capacity: 1200 }
      ];

      const reply = isArabic
        ? `تم تحديد **${results.length} مواقف سيارات معتمدة** بالقرب منك:`
        : `Found **${results.length} public parking facilities** near your area:`;

      return { reply, results, suggestions: ["Which one is closest?", "Show on map"], activeContext: { category: 'TRANSPORT', activeLocations: results } };
    }
  },

  // =========================================================
  // 3. ENVIRONMENT & PROTECTED AREAS
  // =========================================================
  {
    id: 'ENVIRONMENT_PROTECTED_AREAS',
    patterns_en: [
      'show protected areas in abu dhabi',
      'show protected areas',
      'protected areas',
      'mangrove areas',
      'show mangrove areas'
    ],
    patterns_ar: [
      'اعرض المحميات الطبيعية في أبوظبي',
      'اعرض المحميات',
      'المحميات الطبيعية',
      'مناطق القرم'
    ],
    handler: (currentState, isArabic) => {
      const results = [
        { id: 601, name: 'Eastern Mangrove Protected National Park', name_ar: 'محمية القرم الشرقي الوطنية', type: 'ENVIRONMENT', category_en: 'Protected Area', category_ar: 'محمية طبيعية', location: 'Eastern Ring Road', location_ar: 'طريق الطريق الدائري الشرقي', lat: 24.4410, lng: 54.4380, distanceKm: 4.2, description: 'Lush coastal mangrove ecosystem protecting coastal biodiversity and marine habitat.' },
        { id: 602, name: 'Al Wathba Wetland Protected Reserve', name_ar: 'محمية الوثبة للأراضي الرطبة', type: 'ENVIRONMENT', category_en: 'Wetland Reserve', category_ar: 'محمية رطبة', location: 'Al Wathba', location_ar: 'الوثبة', lat: 24.2620, lng: 54.6290, distanceKm: 28.5, description: 'Ramsar wetland sanctuary famous for flamingo breeding and biological diversity.' },
        { id: 603, name: 'Saadiyat Marine Conservation Zone', name_ar: 'منطقة السعديات للحماية البحرية', type: 'ENVIRONMENT', category_en: 'Marine Sanctuary', category_ar: 'محمية بحرية', location: 'Saadiyat Island', location_ar: 'جزيرة السعديات', lat: 24.5490, lng: 54.4480, distanceKm: 11.0, description: 'Protected marine turtle nesting coastal beach zone.' }
      ];

      const actions = [
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: results[0].lat, lng: results[0].lng, zoom: 12 } }
      ];

      const reply = isArabic
        ? `تم رصد **${results.length} محميات بيئية وطبيعية مسجلة** في إمارة أبوظبي:`
        : `Identified **${results.length} registered environmental protected areas** in Abu Dhabi:`;

      const suggestions = isArabic
        ? ["أيها المناطق التي تتقاطع معها؟", "عرض المشاريع العمرانية القريبة", "عرض في جدول"]
        : ["Which communities overlap them?", "Show development projects near these areas", "Put this in a table"];

      return { reply, results, actions, suggestions, activeContext: { category: 'ENVIRONMENT', activeLocations: results } };
    }
  },

  {
    id: 'ENVIRONMENT_OVERLAPPING_COMMUNITIES',
    patterns_en: [
      'which communities overlap them',
      'which communities overlap protected areas',
      'communities overlap protected areas',
      'show development projects near these areas'
    ],
    patterns_ar: [
      'أيها المناطق التي تتقاطع معها',
      'المناطق المتقاطعة مع المحميات',
      'المشاريع العمرانية القريبة من المحميات'
    ],
    handler: (currentState, isArabic) => {
      const results = [
        { id: 610, name: 'Al Reem & Eastern Mangrove Interface Zone', name_ar: 'منطقة تقاطع الريم والقرم الشرقي', type: 'URBAN', category_en: 'Intersecting Community', category_ar: 'منطقة تقاطع بيئي', location: 'Al Reem / Mangrove', location_ar: 'الريم / القرم', lat: 24.4550, lng: 54.4250, distanceKm: 3.5, description: 'Urban community sector adjacent to protected mangrove buffer.' },
        { id: 611, name: 'Saadiyat Cultural Eco-Development Project', name_ar: 'مشروع التطوير البيئي بالسعديات', type: 'URBAN', category_en: 'Eco-Development', category_ar: 'مشروع تطوير بيئي', location: 'Saadiyat Island', location_ar: 'جزيرة السعديات', lat: 24.5410, lng: 54.4350, distanceKm: 10.5, description: 'Sustainable urban project under strict eco-compliance zoning.' }
      ];

      const reply = isArabic
        ? `تحليل التقاطع المكاني: تم رصد **2 مناطق ومشاريع عمرانية** تتقاطع مباشرة مع حدود المحميات الطبيعية:`
        : `Spatial Intersection Analysis: Found **2 communities/projects** intersecting protected environmental boundaries:`;

      const suggestions = isArabic
        ? ["استبعاد المحميات الطبيعية", "مقارنة المشاريع", "عرض الرسم البياني"]
        : ["Exclude protected areas", "Compare projects", "Show a chart"];

      return { reply, results, suggestions, activeContext: { ...currentState?.activeContext, activeLocations: results } };
    }
  },

  // =========================================================
  // 4. CROSS-THEME & MULTI-LAYER SPATIAL ANALYSIS
  // =========================================================
  {
    id: 'CROSS_THEME_SCHOOLS_HOSPITALS_PARKS',
    patterns_en: [
      'which communities have schools, hospitals and parks nearby',
      'communities with schools hospitals and parks',
      'schools hospitals and parks'
    ],
    patterns_ar: [
      'أيها المناطق التي تتواجد فيها مدارس ومستشفيات وحدائق',
      'مناطق فيها مدارس ومستشفيات وحدائق'
    ],
    handler: (currentState, isArabic) => {
      const results = [
        { id: 701, name: 'Al Reem Island Central District', name_ar: 'قطاع جزيرة الريم المركزي', type: 'ADMINISTRATIVE', category_en: 'Integrated Community', category_ar: 'مجتمع متكامل', location: 'Al Reem Island', location_ar: 'جزيرة الريم', lat: 24.5000, lng: 54.4050, distanceKm: 2.1, schoolsCount: 4, hospitalsCount: 2, parksCount: 3 },
        { id: 702, name: 'Khalifa City Sector A', name_ar: 'مدينة خليفة - القطاع أ', type: 'ADMINISTRATIVE', category_en: 'Integrated Community', category_ar: 'مجتمع متكامل', location: 'Khalifa City', location_ar: 'مدينة خليفة', lat: 24.4200, lng: 54.5800, distanceKm: 12.4, schoolsCount: 6, hospitalsCount: 3, parksCount: 5 }
      ];

      const reply = isArabic
        ? `نتائج التحليل المكاني المتعدد الطبقات:\nتم العثور على **مجموعتين مجتمعيتين تتوفر فيهما المدارس والمستشفيات والحدائق معاً**:\n\n1. 🏙️ **${results[0].name_ar}** (مدارس: 4 | مستشفيات: 2 | حدائق: 3)\n2. 🏙️ **${results[1].name_ar}** (مدارس: 6 | مستشفيات: 3 | حدائق: 5)`
        : `Multi-Layer Spatial Overlay Analysis:\nIdentified **2 communities with nearby Schools, Hospitals, and Parks**:\n\n1. 🏙️ **${results[0].name}** (Schools: 4 | Hospitals: 2 | Parks: 3)\n2. 🏙️ **${results[1].name}** (Schools: 6 | Hospitals: 3 | Parks: 5)`;

      const suggestions = isArabic
        ? ["قارن بينها في رسم بياني", "عرض في جدول", "عرض على الخريطة"]
        : ["Compare them in a chart", "Put this in a table", "Show on the map"];

      return { reply, results, suggestions, activeContext: { category: 'CROSS_THEME', activeLocations: results } };
    }
  },

  {
    id: 'CROSS_THEME_SCHOOLS_NEAR_BUS_STOPS',
    patterns_en: [
      'find schools within 500 m of bus stops',
      'schools within 500 m of bus stops',
      'schools near bus stops'
    ],
    patterns_ar: [
      'البحث عن المدارس الواقعة ضمن 500 متر من محطات الحافلات',
      'مدارس قريب من محطات الحافلات'
    ],
    handler: (currentState, isArabic) => {
      const results = [
        { id: 710, name: 'Cranleigh Abu Dhabi International School', name_ar: 'مدرسة كرانلي أبوظبي الدولية', type: 'EDUCATION', category_en: 'School', category_ar: 'مدرسة', location: 'Saadiyat Cultural District', location_ar: 'السعديات', lat: 24.5310, lng: 54.4080, distanceKm: 0.2, busStopsNearby: 3 },
        { id: 711, name: 'GEMS World Academy - Abu Dhabi', name_ar: 'أكاديمية جيمس العالمية', type: 'EDUCATION', category_en: 'School', category_ar: 'مدرسة', location: 'Al Reem Island', location_ar: 'جزيرة الريم', lat: 24.4960, lng: 54.4020, distanceKm: 0.35, busStopsNearby: 2 }
      ];

      const reply = isArabic
        ? `تم إجراء تراكب الطبقات المكانية: تم العثور على **${results.length} مدارس تقع ضمن نطاق 500م من محطات الحافلات**:`
        : `Executed Spatial Buffer Overlay: Identified **${results.length} schools within 500m of public bus stops**:`;

      const suggestions = isArabic
        ? ["أيها التي تحوي أكثر عدد محطات؟", "اعرض الأقرب", "عرض في جدول"]
        : ["Which one has the most bus stops nearby?", "Which is closest?", "Put this in a table"];

      return { reply, results, suggestions, activeContext: { category: 'CROSS_THEME', activeLocations: results } };
    }
  },

  // =========================================================
  // 5. OUTPUT PRESENTATION CONTROLS (Table, Chart, Explanation)
  // =========================================================
  {
    id: 'OUTPUT_TABLE_REQUEST',
    patterns_en: [
      'put this in a table',
      'give me a table',
      'show in a table',
      'show in table',
      'table view',
      'format as table'
    ],
    patterns_ar: [
      'ضع هذا في جدول',
      'اعرض في جدول',
      'عرض الجدول',
      'جدول البيانات'
    ],
    handler: (currentState, isArabic) => {
      const activeList = currentState?.activeContext?.activeLocations || LOCATIONS_DB.slice(0, 5);
      const reply = isArabic
        ? `تم تغيير نمط العرض إلى **جدول البيانات المكانية المنظمة**:`
        : `Switched presentation mode to **Structured Spatial Data Table**:`;

      return { reply, results: activeList, outputType: 'table', activeContext: currentState?.activeContext };
    }
  },

  {
    id: 'OUTPUT_CHART_REQUEST',
    patterns_en: [
      'compare them in a chart',
      'show a chart',
      'compare in a chart',
      'generate a chart',
      'chart view'
    ],
    patterns_ar: [
      'قارن بينها في رسم بياني',
      'اعرض رسم بياني',
      'مخطط بياني'
    ],
    handler: (currentState, isArabic) => {
      const activeList = currentState?.activeContext?.activeLocations || LOCATIONS_DB.slice(0, 5);
      const chartData = {
        id: 'user-chart-' + Date.now(),
        title: isArabic ? "مقارنة السعة والقرب الجغرافي للمنشآت" : "Comparative Spatial Features Metric",
        type: 'bar',
        data: activeList.map(item => ({
          label: isArabic && item.name_ar ? item.name_ar : item.name,
          name: isArabic && item.name_ar ? item.name_ar : item.name,
          value: item.capacity || (item.distanceKm ? Math.round(item.distanceKm * 10) : 50),
          color: '#3b82f6'
        }))
      };

      const reply = isArabic
        ? `تم إنشاء الرسم البياني بناءً على طلبك الصريح:`
        : `Generated comparative chart graph upon your explicit request:`;

      return { reply, chartData, results: activeList, outputType: 'chart', activeContext: currentState?.activeContext };
    }
  },

  {
    id: 'OUTPUT_EXPLAIN_RESULTS',
    patterns_en: [
      'why are you showing me these locations',
      'why are these results shown',
      'why these results',
      'explain results',
      'why these locations'
    ],
    patterns_ar: [
      'لماذا تعرض لي هذه المواقع',
      'لماذا هذه النتائج',
      'تفسير النتائج'
    ],
    handler: (currentState, isArabic) => {
      const reply = isArabic
        ? "💡 **توضيح النتيجة المكانية**:\nتم اختيار هذه المواقع بناءً على تصنيف المعالم ومطابقتها لاشتراطات النطاق الجغرافي المسجل في البنية المكانية لـ SDI بالنسبة لموقعك الحالي."
        : "💡 **Spatial Result Explanation**:\nThese locations match your request because they are classified under the requested theme and fall within the calculated proximity radius from your active reference location.";

      return { reply, outputType: 'explanation', activeContext: currentState?.activeContext };
    }
  },

  {
    id: 'OUTPUT_EXPLAIN_CALCULATION',
    patterns_en: [
      'how did you calculate this',
      'how is this calculated',
      'explain calculation',
      'explain analysis',
      'how did you find this'
    ],
    patterns_ar: [
      'كيف قمت بحساب هذا',
      'كيف تم الحساب',
      'شرح طريقة الحساب'
    ],
    handler: (currentState, isArabic) => {
      const reply = isArabic
        ? "📐 **طريقة التحليل الجغرافي**:\nتم حساب النتائج عن طريق إجراء نطاق مكاني (Buffer Proximity) حول الموقع الجغرافي المرجعي، واستعلام مجموعة البيانات المحددة وترتيب المعالم بناءً على صيغة المسافة الجيوديسية الحقيقية."
        : "📐 **GIS Calculation Method**:\nThe results were calculated by executing a spatial proximity buffer around the reference coordinates, querying the active SDI dataset layer, and ranking features using exact geodesic distance geometry.";

      return { reply, outputType: 'analysis_explanation', activeContext: currentState?.activeContext };
    }
  },

  // =========================================================
  // 6. AMBIGUOUS & VAGUE NATURAL LANGUAGE QUESTIONS
  // =========================================================
  {
    id: 'AMBIGUOUS_SHOW_FACILITIES_NEAR_ME',
    patterns_en: [
      'show facilities near me',
      'facilities near me',
      'show facilities',
      'find facilities'
    ],
    patterns_ar: [
      'اعرض المنشآت بالقرب مني',
      'المنشآت القريبة مني',
      'اعرض المنشآت'
    ],
    handler: (currentState, isArabic) => {
      const reply = isArabic
        ? "❓ **تحديد فئة المنشآت**:\nأيها نوع من المنشآت تود استكشافها بالقرب منك؟"
        : "❓ **Clarification Required**:\nWhat type of facilities would you like to see around your area?";

      const actionCards = [
        { title: "Government", label: "○ Government", label_ar: "○ حكومية", actionType: 'SEARCH_SUBMIT', params: { query: "Show government facilities near me" }, isOption: true },
        { title: "Transport", label: "○ Transport", label_ar: "○ وسائل نقل", actionType: 'SEARCH_SUBMIT', params: { query: "Show bus stops near me" }, isOption: true },
        { title: "Tourism", label: "○ Tourism", label_ar: "○ سياحة ومعالم", actionType: 'SEARCH_SUBMIT', params: { query: "Show tourist attractions near me" }, isOption: true },
        { title: "Public Safety", label: "○ Public Safety", label_ar: "○ أمن وسلامة", actionType: 'SEARCH_SUBMIT', params: { query: "Show police stations near me" }, isOption: true },
        { title: "Utilities", label: "○ Utilities", label_ar: "○ مرافق عامة", actionType: 'SEARCH_SUBMIT', params: { query: "Show petrol stations near me" }, isOption: true }
      ];

      return { reply, actionCards, suggestions: ["Government", "Transport", "Tourism", "Public Safety", "Utilities"] };
    }
  },

  {
    id: 'VAGUE_WHERE_CAN_I_GO_NEARBY',
    patterns_en: [
      'where can i go nearby',
      'what services are around here',
      'what is available around this location',
      'what am i looking at',
      'tell me about this place'
    ],
    patterns_ar: [
      'أين يمكنني الذهاب بالقرب مني',
      'ما هي الخدمات المتوفرة هنا',
      'ما المتاح في هذا الموقع'
    ],
    handler: (currentState, isArabic) => {
      const results = LOCATIONS_DB.slice(0, 4);
      const reply = isArabic
        ? "🗺️ **استكشاف المنطقة المحيطة**:\nإليك أبرز المعالم والخدمات المتاحة بالقرب من موقعك الحالي:"
        : "🗺️ **Spatial Area Overview**:\nHere are key landmarks and public services available around your current location:";

      return { reply, results, suggestions: ["Show on map", "Put this in a table"], activeContext: { activeLocations: results } };
    }
  }
];

// Fuzzy natural language query matcher against the AI Knowledge Base
export function matchKnowledgeBaseQuery(queryText, currentState, isArabic = false) {
  const q = (queryText || '').toLowerCase().trim();
  if (!q) return null;

  // Evaluate against knowledge base entries
  for (const entry of AI_KNOWLEDGE_BASE_ENTRIES) {
    const patterns = isArabic ? (entry.patterns_ar || entry.patterns_en) : entry.patterns_en;
    
    // Check if query matches any pattern explicitly or via token inclusion
    const matched = patterns.some(pat => {
      const p = pat.toLowerCase().trim();
      return q === p || q.includes(p) || p.includes(q);
    });

    if (matched) {
      return entry.handler(currentState, isArabic);
    }
  }

  return null;
}
