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
        ? ["أيها الأقرب لي؟", "ما هي محطات الإسعاف القريبة؟"] 
        : ["Which one is closest?", "What ambulance stations are nearby?"];

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
  // 2. GOVERNMENT FACILITIES
  // =========================================================
  {
    id: 'GOVERNMENT_FACILITIES_NEARBY',
    patterns_en: [
      'show government facilities near me',
      'government facilities near me',
      'show government facilities',
      'government facilities',
      'find government facilities'
    ],
    patterns_ar: [
      'اعرض المنشآت الحكومية بالقرب مني',
      'المنشآت الحكومية القريبة مني',
      'اعرض المنشآت الحكومية',
      'المنشآت الحكومية'
    ],
    handler: (currentState, isArabic) => {
      const govtList = [
        { id: 101, name: 'Department of Government Enablement (DGE) HQ', name_ar: 'دائرة التمكين الحكومي - المقر الرئيسي', type: 'GOVERNMENT', category_en: 'Executive Governance', category_ar: 'منشأة حكومية تنفيذية', location: 'Corniche West', location_ar: 'طريق الكورنيش الغربي', district: 'Corniche West', lat: 24.4789, lng: 54.3312, riskLevel: 'Low', riskScore: 18, distanceKm: 1.2, description: 'Headquarters driving Abu Dhabi spatial data infrastructure and digital enablement.' },
        { id: 102, name: 'TAMM Customer Service Hub - Al Reem', name_ar: 'مركز تم لخدمات المتعاملين - الريم', type: 'GOVERNMENT', category_en: 'Unified Public Services', category_ar: 'خدمات حكومية موحدة', location: 'Al Reem Island', location_ar: 'جزيرة الريم', district: 'Al Reem Island', lat: 24.5028, lng: 54.4056, riskLevel: 'Low', riskScore: 22, distanceKm: 3.5, description: 'Unified Abu Dhabi government customer service center providing smart digital transactions.' },
        { id: 103, name: 'Abu Dhabi Municipality Service Centre', name_ar: 'مركز بلدية أبوظبي الرئيسي', type: 'GOVERNMENT', category_en: 'Municipal Services', category_ar: 'خدمات بلدية', location: 'Al Zahiyah', location_ar: 'الزاهية', district: 'Al Zahiyah', lat: 24.4920, lng: 54.3735, riskLevel: 'Low', riskScore: 24, distanceKm: 2.4, description: 'Central municipal hub managing urban planning, building permits, and public land GIS registries.' }
      ];

      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { facilityType: 'GOVERNMENT' }, matchingResults: govtList } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: govtList[0].lat, lng: govtList[0].lng, zoom: 14 } }
      ];

      const reply = isArabic
        ? `تم تحديد **${govtList.length} مقرات حكومية ومراكز خدمات موحدة (تم)** بالقرب من موقعك:`
        : `Identified **${govtList.length} official government facilities and unified TAMM hubs** near your location:`;

      const suggestions = isArabic
        ? ["مقارنة انبعاثات الطاقة", "عرض المعالم السياحية", "عرض الحدائق العامة"]
        : ["Compare Energy Emissions", "Show tourism attractions", "Show public parks"];

      return {
        reply,
        results: govtList,
        actions,
        suggestions,
        datasetsUsed: ['DGE Spatial SDI 2026', 'Government Facilities Layer v2.1'],
        activeContext: { category: 'GOVERNMENT', activeLocations: govtList }
      };
    }
  },

  // =========================================================
  // 3. TRANSPORTATION & MOBILITY
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
  // 4. ENVIRONMENT & PROTECTED AREAS
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
        ? ["أيها المناطق التي تتقاطع معها؟", "عرض المشاريع العمرانية القريبة"]
        : ["Which communities overlap them?", "Show development projects near these areas"];

      return { reply, results, actions, suggestions, activeContext: { category: 'ENVIRONMENT', activeLocations: results } };
    }
  },

  // =========================================================
  // 5. AMBIGUOUS & VAGUE NATURAL LANGUAGE QUESTIONS
  // =========================================================
  {
    id: 'AMBIGUOUS_SHOW_FACILITIES_NEAR_ME',
    patterns_en: [
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

      // Retain ONLY the highlighted suggestions version per design requirement (do not duplicate with actionCards)
      const suggestions = ["Government", "Transport", "Tourism", "Public Safety", "Utilities"];

      return { reply, suggestions };
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

      return { reply, results, suggestions: ["Show on map"], activeContext: { activeLocations: results } };
    }
  }
];

// Fuzzy natural language query matcher against the AI Knowledge Base
export function matchKnowledgeBaseQuery(queryText, currentState, isArabic = false) {
  const q = (queryText || '').toLowerCase().trim();
  if (!q) return null;

  // Evaluate against knowledge base entries
  for (const entry of AI_KNOWLEDGE_BASE_ENTRIES) {
    // Special guard: If entry is generic ambiguous search, do NOT match if query contains a specific sector/category
    if (entry.id === 'AMBIGUOUS_SHOW_FACILITIES_NEAR_ME') {
      const specificKeywords = ['government', 'police', 'bus', 'hospital', 'park', 'parking', 'tourism', 'utility', 'utilities', 'حكومية', 'حكومي', 'شرطة', 'مستشفى', 'حديقة', 'سياحة'];
      if (specificKeywords.some(k => q.includes(k))) {
        continue;
      }
    }

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
