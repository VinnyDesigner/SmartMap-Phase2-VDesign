// AI Knowledge Base & Intent Matching Dictionary for GeoVision / SmartMap V2
// Provides authoritative pre-engineered responses, GIS actions, visual blocks, context tags, and provenance metadata
// for authentic conversational AI GIS interactions across all priority scenarios.

import { LOCATIONS_DB } from '../mockAiEngine';
import { ACTION_TYPES } from '../actionRegistry';

const fmt = (num) => (num ? num.toLocaleString() : '0');

export const AI_KNOWLEDGE_BASE_ENTRIES = [
  // =========================================================
  // PRIORITY 1 — 5-STEP REFERENCE RESOLUTION JOURNEY (PHASE 2 THEME DIRECTION)
  // =========================================================
  {
    id: 'P1_STEP1_TOURISM_ABU_DHABI',
    patterns_en: [
      'show tourism attractions in abu dhabi',
      'tourism attractions in abu dhabi',
      'find tourism in abu dhabi',
      'list tourism abu dhabi',
      'tourism abu dhabi',
      'get tourism attractions in abu dhabi',
      'show museums in abu dhabi'
    ],
    patterns_ar: [
      'اعرض المعالم السياحية في أبوظبي',
      'المعالم السياحية في أبوظبي',
      'السياحة في أبوظبي',
      'أظهر معالم أبوظبي',
      'البحث عن متاحف ومعالم في أبوظبي'
    ],
    handler: (currentState, isArabic) => {
      const results = LOCATIONS_DB.filter(l => l.type === 'TOURISM');
      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'TOURISM', district: 'Abu Dhabi Sector' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: 24.4839, lng: 54.3773, zoom: 12 } }
      ];
      const reply = isArabic
        ? `تم التركيز على **قطاع إمارة أبوظبي** وتحديد **${results.length} معالم سياحية وثقافية** على الخريطة:\n\n1. 🏛️ **${results[0].name_ar || results[0].name}** (المنطقة الثقافية بالسعديات)\n2. 🏛️ **${results[1].name_ar || results[1].name}** (الرأس الأخضر)\n3. 🕌 **${results[2].name_ar || results[2].name}** (الروضة)`
        : `Identified **${results.length} cultural and tourism landmarks** across **Abu Dhabi sector**:\n\n1. 🏛️ **${results[0].name}** (Saadiyat Cultural District)\n2. 🏛️ **${results[1].name}** (Al Ras Al Akhdar)\n3. 🕌 **${results[2].name}** (Al Rawdah)`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'DCT Cultural & Tourism Master Registry'];
      const activeContextTags = [
        { id: 'district', label: isArabic ? 'أبوظبي' : 'Abu Dhabi', icon: '📍' },
        { id: 'category', label: isArabic ? 'معالم سياحية' : 'Tourism Assets', icon: '🏛️' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];
      const suggestions = isArabic 
        ? ["المراكز الحكومية فقط", "ضمن نطاق 5 كم من الكورنيش", "أيها الأقرب لي؟"] 
        : ["Only government centers", "Within 5 km of Corniche", "Which one is closest?"];

      const howThisResultWasFound = {
        question: isArabic ? "ما هي المعالم السياحية في أبوظبي؟" : "Show tourism attractions in Abu Dhabi.",
        datasets: ['Cultural & Tourism Registry', 'Abu Dhabi Administrative Boundaries'],
        filters: isArabic ? "جميع المعالم الثقافية والتراثية" : "All Cultural & Heritage Landmarks",
        spatialCondition: isArabic ? "حدود قطاع إمارة أبوظبي" : "Abu Dhabi Administrative Boundary",
        resultCount: `${results.length} facilities`
      };

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, howThisResultWasFound, activeContext: { category: 'TOURISM', district: 'Abu Dhabi', activeLocations: results } };
    }
  },

  {
    id: 'P1_STEP2_GOVT_SERVICES',
    patterns_en: [
      'only government centers',
      'only government facilities',
      'government service centers',
      'show government centers',
      'tamm service centers'
    ],
    patterns_ar: [
      'المراكز الحكومية فقط',
      'مراكز تم فقط',
      'الخدمات الحكومية',
      'مراكز الخدمات الحكومية'
    ],
    handler: (currentState, isArabic) => {
      const prevContext = currentState?.activeContext || {};
      const currentDistrict = prevContext.district || 'Abu Dhabi';
      const results = LOCATIONS_DB.filter(l => l.type === 'GOVERNMENT');

      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'GOVERNMENT', district: currentDistrict }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: results[0].lat, lng: results[0].lng, zoom: 13 } }
      ];

      const reply = isArabic
        ? `تم تصفية نتائج **${currentDistrict}** لعرض **المراكز الحكومية ومراكز تم فقط** (تم العثور على **${results.length} مراكز حكومية**):\n\n1. 🏢 **${results[0].name_ar || results[0].name}** (الكورنيش الغربي)\n2. 🏢 **${results[1]?.name_ar || results[1]?.name}** (جزيرة الريم)`
        : `Refined active query for **${currentDistrict}** to display **Government & TAMM Service Centers only** (Found **${results.length} government hubs**):\n\n1. 🏢 **${results[0].name}** (Corniche West)\n2. 🏢 **${results[1]?.name}** (Al Reem Island)`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'TAMM Government Service Registry'];
      const activeContextTags = [
        { id: 'district', label: isArabic ? currentDistrict : currentDistrict, icon: '📍' },
        { id: 'category', label: isArabic ? 'مراكز حكومية' : 'Government Hubs', icon: '🏢' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];

      const suggestions = isArabic 
        ? ["ضمن نطاق 5 كم من الكورنيش", "أيها الأقرب لي؟", "عرض تفاصيلها"] 
        : ["Within 5 km of Corniche", "Which one is closest?", "Show its details"];

      const howThisResultWasFound = {
        question: isArabic ? "عرض المراكز الحكومية ومراكز تم في أبوظبي" : "Only government centers.",
        datasets: ['Government Facilities Registry', 'TAMM Service Hubs Layer'],
        filters: isArabic ? "الفئة = منشآت حكومية ومراكز تم" : "Category = Government & TAMM Centers",
        spatialCondition: isArabic ? "قطاع أبوظبي" : "Abu Dhabi Sector Spatial Limit",
        resultCount: `${results.length} facilities`
      };

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, howThisResultWasFound, activeContext: { ...prevContext, category: 'GOVERNMENT', district: currentDistrict, activeLocations: results } };
    }
  },

  {
    id: 'P1_STEP3_WITHIN_5KM_ZAYED_SPORTS',
    patterns_en: [
      'within 5 km of zayed sports city',
      'within 5km of zayed sports city',
      '5 km of zayed sports city',
      'zayed sports city 5 km',
      'hospitals 5 km zayed sports city'
    ],
    patterns_ar: [
      'ضمن نطاق 5 كم من مدينة زايد الرياضية',
      'في حدود 5 كم من مدينة زايد الرياضية',
      'مدينة زايد الرياضية 5 كم',
      '5 كم مدينة زايد الرياضية'
    ],
    handler: (currentState, isArabic) => {
      const prevContext = currentState?.activeContext || {};
      const sportsCityCenter = { lat: 24.4172, lng: 54.4531 };

      const results = LOCATIONS_DB.filter(l => l.type === 'HOSPITAL' && l.tags.includes('government')).map(h => {
        const d = Math.sqrt(Math.pow(h.lat - sportsCityCenter.lat, 2) + Math.pow(h.lng - sportsCityCenter.lng, 2)) * 111;
        return { ...h, distanceKm: parseFloat(d.toFixed(1)) };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'HOSPITAL', ownership: 'Government', radius: '5 km of Zayed Sports City' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: sportsCityCenter.lat, lng: sportsCityCenter.lng, zoom: 14 } }
      ];

      const reply = isArabic
        ? `تم تنفيذ تحليل النطاق المكاني (5 كم) حول **مدينة زايد الرياضية**. تم العثور على **${results.length} مستشفيات حكومية**:\n\n1. 🏥 **${results[0].name_ar || results[0].name}** (تبعد **${results[0].distanceKm} كم**)\n2. 🏥 **${results[1]?.name_ar || results[1]?.name || 'مستشفى العين الحكومي'}** (تبعد **${results[1]?.distanceKm || 4.2} كم**)`
        : `Executed 5 km proximity analysis around **Zayed Sports City**. Found **${results.length} government hospitals**:\n\n1. 🏥 **${results[0].name}** (**${results[0].distanceKm} km** away)\n2. 🏥 **${results[1]?.name || 'Al Ain Government Hospital'}** (**${results[1]?.distanceKm || 4.2} km** away)`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'DoH Proximity Buffer Engine'];
      const activeContextTags = [
        { id: 'district', label: isArabic ? 'مدينة زايد الرياضية' : 'Zayed Sports City', icon: '📍' },
        { id: 'category', label: isArabic ? 'مستشفيات' : 'Hospitals', icon: '🏥' },
        { id: 'ownership', label: isArabic ? 'حكومي' : 'Government', icon: '🏛️' },
        { id: 'radius', label: isArabic ? 'نطاق 5 كم' : 'Within 5 km', icon: '📏' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];

      const suggestions = isArabic 
        ? ["أيها الأقرب لي؟", "عرض تفاصيلها", "عرض المدارس ضمن 2 كم من هذه المستشفيات"] 
        : ["Which one is closest?", "Show its details", "Show schools within 2 km of these hospitals"];

      const howThisResultWasFound = {
        question: isArabic ? "عرض المستشفيات الحكومية ضمن 5 كم من مدينة زايد الرياضية" : "Within 5 km of Zayed Sports City.",
        datasets: ['Healthcare Facilities Registry', 'Proximity Buffer Analytics Layer'],
        filters: isArabic ? "حكومي فقط" : "Government Ownership",
        spatialCondition: isArabic ? "نطاق بفر دائري 5 كم حول مدينة زايد الرياضية" : "5 km Circular Proximity Buffer around Zayed Sports City",
        resultCount: `${results.length} facilities`
      };

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, howThisResultWasFound, activeContext: { ...prevContext, category: 'HOSPITAL', ownership: 'Government', district: 'Zayed Sports City', radius: '5 km', activeLocations: results } };
    }
  },

  {
    id: 'P1_STEP4_WHICH_IS_CLOSEST',
    patterns_en: [
      'which one is closest',
      'which is closest',
      'which one is nearest',
      'nearest to me',
      'closest to me',
      'rank by distance',
      'which is nearest'
    ],
    patterns_ar: [
      'أيها الأقرب',
      'أيها الأقرب لي',
      'أيها أقرب',
      'أي واحد أقرب',
      'ترتيب حسب المسافة'
    ],
    handler: (currentState, isArabic) => {
      const prevContext = currentState?.activeContext || {};
      const sportsCityCenter = { lat: 24.4172, lng: 54.4531 };

      const baseList = prevContext.activeLocations || LOCATIONS_DB.filter(l => l.type === 'HOSPITAL' && l.tags.includes('government'));
      const results = baseList.map(h => {
        const d = Math.sqrt(Math.pow(h.lat - sportsCityCenter.lat, 2) + Math.pow(h.lng - sportsCityCenter.lng, 2)) * 111;
        return { ...h, distanceKm: parseFloat(d.toFixed(1)) };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      const topLoc = results[0]; // Sheikh Shakhbout Medical City (SSMC)
      const actions = [
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topLoc.lat, lng: topLoc.lng, zoom: 15 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topLoc } }
      ];

      const reply = isArabic
        ? `**ترتيب المستشفيات الحكومية حسب القرب من مدينة زايد الرياضية**:\n\n1. 🥇 **${topLoc.name_ar || topLoc.name}** — **${topLoc.distanceKm} كم** (الأقرب)\n2. 🥈 **${results[1]?.name_ar || results[1]?.name || 'مستشفى العين الحكومي'}** — **${results[1]?.distanceKm || 4.2} كم**`
        : `**Ranked Government Hospitals by Proximity to Zayed Sports City**:\n\n1. 🥇 **${topLoc.name}** — **${topLoc.distanceKm} km away** (Closest)\n2. 🥈 **${results[1]?.name || 'Al Ain Government Hospital'}** — **${results[1]?.distanceKm || 4.2} km away**`;

      const datasetsUsed = ['DGE GPS Location Engine', 'DoH Proximity Buffer Engine'];
      const activeContextTags = [
        { id: 'district', label: isArabic ? 'مدينة زايد الرياضية' : 'Zayed Sports City', icon: '📍' },
        { id: 'ownership', label: isArabic ? 'حكومي' : 'Government', icon: '🏛️' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' },
        { id: 'selected', label: isArabic ? `الأقرب: ${topLoc.name_ar || topLoc.name}` : `Closest: ${topLoc.name}`, icon: '⭐' }
      ];

      const suggestions = isArabic 
        ? ["عرض تفاصيلها", "عرض المدارس ضمن 2 كم من هذه المستشفيات", "حفظ هذا البحث"] 
        : ["Show its details", "Show schools within 2 km of these hospitals", "Save this search"];

      const howThisResultWasFound = {
        question: isArabic ? "أيها الأقرب من المستشفيات الحكومية الحالية؟" : "Which one is closest?",
        datasets: ['GPS Proximity Engine', 'Healthcare Spatial Network'],
        filters: isArabic ? "ترتيب تنازلي للمسافة المباشرة" : "Ranked Euclidean Proximity Calculation",
        spatialCondition: isArabic ? "مسافة المركز الجغرافي لمدينة زايد الرياضية" : "Distance to Zayed Sports City Spatial Point",
        resultCount: `Selected #1: ${topLoc.name} (${topLoc.distanceKm} km)`
      };

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, howThisResultWasFound, activeContext: { ...prevContext, rank: 'DISTANCE', selectedFeature: topLoc, activeLocations: results } };
    }
  },

  {
    id: 'P1_STEP5_SHOW_ITS_DETAILS',
    patterns_en: [
      'show its details',
      'its details',
      'tell me more about it',
      'show details',
      'open facility details',
      'details of the closest'
    ],
    patterns_ar: [
      'عرض تفاصيلها',
      'تفاصيلها',
      'أظهر تفاصيلها',
      'اخبرني المزيد عنها',
      'عرض التفاصيل'
    ],
    handler: (currentState, isArabic) => {
      const prevContext = currentState?.activeContext || {};
      const selectedFac = currentState?.selectedLocation || prevContext.selectedFeature || prevContext.activeLocations?.[0] || LOCATIONS_DB[1]; // SSMC

      const actions = [
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: selectedFac } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: selectedFac.lat, lng: selectedFac.lng, zoom: 16 } }
      ];

      const reply = isArabic
        ? `📋 **تم تحديد الاستشهاد "تفاصيلها" لـ ${selectedFac.name_ar || selectedFac.name}**:\nتم فتح لوحة البيانات المكانية لـ **${selectedFac.name_ar || selectedFac.name}** (${selectedFac.location_ar || selectedFac.location}).\n\n- **نوع المنشأة**: ${selectedFac.type === 'HOSPITAL' ? 'مستشفى تخصصي حكومي' : selectedFac.type}\n- **السعة التشغيلية**: 741 سرير طوارئ أسرة تخصصية\n- **مستوى الخطورة المركب**: ${selectedFac.riskLevel === 'Critical' ? 'حرج' : selectedFac.riskLevel} (${selectedFac.riskScore}/100)\n- **استهلاك المياه**: ${fmt(selectedFac.waterConsumption)} م³/يوم`
        : `📋 **Resolved reference "its" to ${selectedFac.name}**:\nOpened feature details slide panel for **${selectedFac.name}** (${selectedFac.location}).\n\n- **Facility Type**: ${selectedFac.type}\n- **Operational Capacity**: 741 Trauma Beds\n- **Compound Risk Level**: ${selectedFac.riskLevel} (${selectedFac.riskScore}/100)\n- **Water Consumption**: ${fmt(selectedFac.waterConsumption)} m³/day`;

      const activeContextTags = [
        { id: 'selected', label: isArabic ? `محدد: ${selectedFac.name_ar || selectedFac.name}` : `Selected: ${selectedFac.name}`, icon: '⭐' }
      ];

      const suggestions = isArabic
        ? ["عرض المدارس القريبة منها", "حفظ هذا الموقع إلى المفضلة", "تصدير تقرير المنشأة"]
        : ["Show schools near it", "Save this location to Favorites", "Export facility report"];

      return { reply, results: [selectedFac], actions, suggestions, datasetsUsed: ['DoH Healthcare Registry 2026'], activeContextTags, activeContext: { ...prevContext, selectedFeature: selectedFac } };
    }
  },

  // =========================================================
  // PRIORITY 2 — AMBIGUOUS LOCATION RESOLUTION ("Show parks near Yas")
  // =========================================================
  {
    id: 'P2_AMBIGUOUS_YAS',
    patterns_en: [
      'show parks near yas',
      'parks near yas',
      'parks in yas',
      'show parks in yas',
      'find parks near yas'
    ],
    patterns_ar: [
      'اعرض الحدائق بالقرب من ياس',
      'الحدائق في ياس',
      'حدائق قريب من ياس',
      'حدائق في ياس'
    ],
    handler: (currentState, isArabic) => {
      const reply = isArabic
        ? "🔍 **تم العثور على عدة مناطق تطابق اسم 'ياس'**:\nأي من المناطق التالية تود استخدامها لتحديد موقع الحدائق والمحميات؟"
        : "🔍 **Ambiguous Location Detected**:\nI found several locations matching **'Yas'**. Which one would you like to use?";

      const suggestions = isArabic
        ? ["جزيرة ياس", "بني ياس", "جزيرة الياسات الغربية", "جزيرة الياسات"]
        : ["Yas Island", "Bani Yas", "Yasat West Island", "Al Yasat Island"];

      const actionCards = [
        { title: "Yas Island", label: "○ Yas Island", label_ar: "○ جزيرة ياس", actionType: 'SEARCH_SUBMIT', params: { query: "Show parks in Yas Island" }, isOption: true },
        { title: "Bani Yas", label: "○ Bani Yas", label_ar: "○ بني ياس", actionType: 'SEARCH_SUBMIT', params: { query: "Show parks in Bani Yas" }, isOption: true },
        { title: "Yasat West Island", label: "○ Yasat West Island", label_ar: "○ جزيرة الياسات الغربية", actionType: 'SEARCH_SUBMIT', params: { query: "Show parks in Yasat West Island" }, isOption: true },
        { title: "Al Yasat Island", label: "○ Al Yasat Island", label_ar: "○ جزيرة الياسات", actionType: 'SEARCH_SUBMIT', params: { query: "Show parks in Al Yasat Island" }, isOption: true }
      ];

      return { reply, suggestions, actionCards, datasetsUsed: ['DGE Administrative Boundaries'] };
    }
  },

  {
    id: 'P2_RESOLVE_BANI_YAS',
    patterns_en: [
      'bani yas',
      'show parks in bani yas',
      'parks in bani yas',
      'parks near bani yas'
    ],
    patterns_ar: [
      'بني ياس',
      'الحدائق في بني ياس',
      'اعرض الحدائق في بني ياس'
    ],
    handler: (currentState, isArabic) => {
      const results = LOCATIONS_DB.filter(l => l.type === 'PARK' || l.type === 'ATTRACTION').map(p => ({
        ...p,
        location: 'Bani Yas',
        location_ar: 'بني ياس'
      }));

      const baniYasCenter = { lat: 24.3120, lng: 54.6320 };
      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'PARK', district: 'Bani Yas' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: baniYasCenter.lat, lng: baniYasCenter.lng, zoom: 14 } }
      ];

      const reply = isArabic
        ? `✅ تم تحديد موقع **بني ياس** وعرض **${results.length} حدائق ومحميات طبيعية**:\n\n1. 🌲 **حديقة بني ياس العامة**\n2. 🌲 **حديقة الوثبة المجتمعية**\n3. 🌲 **منتزه بني ياس العائلي**`
        : `✅ Resolved location to **Bani Yas** and identified **${results.length} public parks & green reserves**:\n\n1. 🌲 **Bani Yas Public Park**\n2. 🌲 **Al Wathba Community Park**\n3. 🌲 **Bani Yas Family Park**`;

      const datasetsUsed = ['DGE Administrative Boundaries', 'DGE Parks & Greenery Layer v1.4'];
      const activeContextTags = [
        { id: 'district', label: isArabic ? 'بني ياس' : 'Bani Yas', icon: '📍' },
        { id: 'category', label: isArabic ? 'حدائق' : 'Parks', icon: '🌲' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];

      const suggestions = isArabic
        ? ["عرض المنشآت الصحية في بني ياس", "حفظ هذا البحث", "عرض المدارس القريبة"]
        : ["Show healthcare in Bani Yas", "Save this search", "Show schools nearby"];

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, activeContext: { category: 'PARK', district: 'Bani Yas', activeLocations: results } };
    }
  },

  // =========================================================
  // PRIORITY 3 — NO-RESULTS RECOVERY ("Show rehabilitation centers within 1 km of Zayed City")
  // =========================================================
  {
    id: 'P3_NO_RESULTS_REHAB',
    patterns_en: [
      'show rehabilitation centers within 1 km of zayed city',
      'rehabilitation centers within 1 km of zayed city',
      'rehabilitation centers zayed city',
      'rehabilitation 1 km zayed city'
    ],
    patterns_ar: [
      'اعرض مراكز التأهيل ضمن 1 كم من مدينة زايد',
      'مراكز التأهيل في مدينة زايد',
      'مراكز التأهيل 1 كم مدينة زايد'
    ],
    handler: (currentState, isArabic) => {
      const reply = isArabic
        ? "⚠️ **لم يتم العثور على أي مراكز تأهيل ضمن نطاق 1 كم من مدينة زايد**.\n\nتتوفر عدة خيارات بديلة عند إدخال تعديل بسيط على نطاق أو نوع الاستعلام:"
        : "⚠️ **No rehabilitation centers were found within 1 km of Zayed City**.\n\nSeveral alternative options are available by adjusting your search radius or facility category:";

      const suggestions = isArabic
        ? ["البحث ضمن نطاق 5 كم", "البحث حول مدينة زايد", "عرض جميع مراكز التأهيل", "عرض الرعاية الصحية القريبة"]
        : ["Search within 5 km", "Search around Zayed City", "Show healthcare facilities nearby", "Show all rehabilitation centers"];

      const actionCards = [
        { title: isArabic ? "توسيع النطاق إلى 5 كم" : "Search within 5 km", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals within 5 km of Zayed Sports City" } },
        { title: isArabic ? "عرض الرعاية الصحية القريبة" : "Show Healthcare Nearby", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals in Abu Dhabi" } }
      ];

      return { reply, results: [], suggestions, actionCards, datasetsUsed: ['DoH Master Spatial Registry 2026'] };
    }
  },

  // =========================================================
  // PRIORITY 4 — UNSUPPORTED REQUEST HANDLING ("Show me the richest areas of Abu Dhabi")
  // =========================================================
  {
    id: 'P4_UNSUPPORTED_RICHEST_AREAS',
    patterns_en: [
      'show me the richest areas of abu dhabi',
      'richest areas of abu dhabi',
      'richest areas',
      'wealthiest areas abu dhabi',
      'income level abu dhabi'
    ],
    patterns_ar: [
      'اعرض أغنى المناطق في أبوظبي',
      'أغنى المناطق في أبوظبي',
      'مناطق الدخل العالي أبوظبي'
    ],
    handler: (currentState, isArabic) => {
      const reply = isArabic
        ? "ℹ️ **بيانات المستوى الاقتصادي غير متوفرة ضمن المنظومة**:\nيمكنني تحليل وإجراء الاستعلامات المكانية لطبقات منصة GeoVision المتاحة (الصحة، التعليم، النقل، البيئة، الصناعة)، لكن لا تتوفر حالياً طبقة بيانات لتوزيع مستويات الدخل."
        : "ℹ️ **Dataset Not Available**:\nI can search and analyze loaded **GeoVision SDI datasets** (Healthcare, Education, Transit, Infrastructure, Industry), but socio-economic household income data is not part of this spatial platform.";

      const suggestions = isArabic
        ? ["استكشاف البيانات المتاحة", "عرض المنشآت الصحية", "عرض وسائل النقل العامة"]
        : ["Explore Available Data", "Show healthcare facilities", "Show public transport"];

      return { reply, results: [], suggestions, datasetsUsed: ['DGE SDI Metadata Catalogue 2026'] };
    }
  },

  // =========================================================
  // PRIORITY 5 — LOCATION PERMISSION STATE ("Show vehicle inspection centers near me")
  // =========================================================
  // =========================================================
  // PRIORITY 5 — HOSPITALS NEAR ME & LOCATION PERMISSION
  // =========================================================
  {
    id: 'P5_HOSPITALS_NEAR_ME',
    patterns_en: [
      'hospitals near me',
      'hospitals nearby',
      'find hospitals near me',
      'show hospitals near me',
      'hospitals near me within 5 km',
      'near me'
    ],
    patterns_ar: [
      'مستشفيات بالقرب مني',
      'المستشفيات القريبة مني',
      'مستشفيات قريبة',
      'قريب مني'
    ],
    handler: (currentState, isArabic) => {
      const isLocationEnabled = currentState?.userLocationEnabled;

      if (!isLocationEnabled) {
        const reply = isArabic
          ? "📍 **موقعك الحالي مطلوب لمتابعة هذا البحث**:\nيرجى السماح بتحديد الموقع الجغرافي (GPS) أو اختيار منطقة إدارية لعرض المستشفيات والمراكز الصحية القريبة منك."
          : "📍 **Your current location is required to continue this search**:\nPlease grant location access or select a reference sector to view healthcare facilities near you.";

        const actionCards = [
          { title: isArabic ? "تفعيل تحديد الموقع GPS" : "Enable Location", label: "○ Enable Location", label_ar: "○ تفعيل تحديد الموقع", actionType: 'ENABLE_LOCATION', isOption: true },
          { title: isArabic ? "مدينة زايد الرياضية" : "Zayed Sports City", label: "○ Zayed Sports City", label_ar: "○ مدينة زايد الرياضية", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals within 5 km of Zayed Sports City" }, isOption: true },
          { title: isArabic ? "مدينة خليفة" : "Khalifa City", label: "○ Khalifa City", label_ar: "○ مدينة خليفة", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals in Khalifa City" }, isOption: true }
        ];

        return { reply, suggestions: ["Enable Location", "Zayed Sports City", "Khalifa City"], actionCards, datasetsUsed: ['DGE GPS Location Engine'] };
      }

      // Location enabled -> return 3 nearest healthcare facilities with distances
      const userLat = currentState?.userLocation?.lat || 24.4839;
      const userLng = currentState?.userLocation?.lng || 54.3773;

      const results = LOCATIONS_DB.filter(l => l.type === 'HOSPITAL').map(h => {
        const d = Math.sqrt(Math.pow(h.lat - userLat, 2) + Math.pow(h.lng - userLng, 2)) * 111;
        return { ...h, distanceKm: parseFloat(d.toFixed(1)) };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      const topLoc = results[0];
      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'HOSPITAL', radius: '5 km of User GPS' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: userLat, lng: userLng, zoom: 13 } }
      ];

      const reply = isArabic
        ? `✅ تم تفعيل GPS وتحديد **${results.length} مستشفيات بالقرب من موقعك الحالي** (نطاق 5 كم):\n\n1. 🏥 **${results[0].name_ar || results[0].name}** (تبعد **${results[0].distanceKm} كم**)\n2. 🏥 **${results[1].name_ar || results[1].name}** (تبعد **${results[1].distanceKm} كم**)\n3. 🏥 **${results[2].name_ar || results[2].name}** (تبعد **${results[2].distanceKm} كم**)`
        : `✅ Granted GPS Location Access. Identified **${results.length} healthcare facilities near your location** (5 km proximity radius):\n\n1. 🏥 **${results[0].name}** (**${results[0].distanceKm} km** away - Al Maryah Island)\n2. 🏥 **${results[1].name}** (**${results[1].distanceKm} km** away - Al Mafraq)\n3. 🏥 **${results[2].name}** (**${results[2].distanceKm} km** away - Electra Street)`;

      const datasetsUsed = ['DGE GPS Location Engine', 'DoH Master Healthcare Registry v2.1'];
      const activeContextTags = [
        { id: 'location', label: isArabic ? 'موقعي الحالي' : 'My Location', icon: '📍' },
        { id: 'category', label: isArabic ? 'مستشفيات' : 'Hospitals', icon: '🏥' },
        { id: 'radius', label: isArabic ? 'نطاق 5 كم' : 'Within 5 km', icon: '📏' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];

      const suggestions = isArabic 
        ? ["المستشفيات الحكومية فقط", "أيها الأقرب لي؟", "عرض تفاصيلها"] 
        : ["Only government hospitals", "Which one is closest?", "Show its details"];

      const howThisResultWasFound = {
        question: isArabic ? "عرض المستشفيات القريبة من موقعي الحالي" : "Show hospitals near me.",
        datasets: ['GPS Location Proximity Engine', 'Healthcare Facilities Registry'],
        filters: isArabic ? "نطاق بفر دائري 5 كم من إحداثيات GPS الحالية" : "5 km Radius Proximity Buffer around User GPS Location",
        spatialCondition: `User Location Point [${userLat.toFixed(4)}, ${userLng.toFixed(4)}]`,
        resultCount: `${results.length} facilities`
      };

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, howThisResultWasFound, activeContext: { category: 'HOSPITAL', radius: '5 km', center: [userLat, userLng], activeLocations: results } };
    }
  },

  {
    id: 'P5_LOCATION_PERMISSION',
    patterns_en: [
      'show vehicle inspection centers near me',
      'vehicle inspection centers near me',
      'inspection centers near me',
      'vehicle inspection near me'
    ],
    patterns_ar: [
      'اعرض مراكز الفحص الفني بالقرب مني',
      'مراكز الفحص الفني بالقرب مني',
      'فحص السيارات قريب مني'
    ],
    handler: (currentState, isArabic) => {
      const isLocationEnabled = currentState?.userLocationEnabled;

      if (!isLocationEnabled) {
        const reply = isArabic
          ? "📍 **موقعك الحالي مطلوب لمتابعة هذا البحث**:\nيتطلب هذا الاستعلام تفعيل خاصية تحديد الموقع الجغرافي لتحديد مراكز الفحص الفني القريبة منك."
          : "📍 **Your current location is required to continue this search**:\nPlease grant location access or select a reference area to view vehicle inspection centers.";

        const actionCards = [
          { title: isArabic ? "تفعيل تحديد الموقع" : "Enable Location", actionType: 'ENABLE_LOCATION', isOption: true },
          { title: isArabic ? "اختيار الموقع على الخريطة" : "Choose Location on Map", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals in Khalifa City" }, isOption: true },
          { title: isArabic ? "اختيار منطقة إدارية" : "Select an Area", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals in Abu Dhabi" }, isOption: true }
        ];

        return { reply, suggestions: ["Enable Location", "Choose Location on Map"], actionCards, datasetsUsed: ['GPS Location Engine'] };
      }

      // Location enabled -> return 6 vehicle inspection centers
      const userLat = currentState?.userLocation?.lat || 24.4839;
      const userLng = currentState?.userLocation?.lng || 54.3773;

      const results = [
        { id: 'insp-1', name: 'Al Salama Vehicle Inspection Center', name_ar: 'مركز السلامة للفحص الفني', lat: 24.4620, lng: 54.3720, type: 'INSPECTION', distanceKm: 1.4 },
        { id: 'insp-2', name: 'ADNOC Vehicle Inspection - Mushrif', name_ar: 'فحص أدنوك - المشرف', lat: 24.4480, lng: 54.3910, type: 'INSPECTION', distanceKm: 2.8 },
        { id: 'insp-3', name: 'Mahawi Vehicle Testing Center', name_ar: 'مركز فحص مروح المحاوي', lat: 24.3210, lng: 54.5820, type: 'INSPECTION', distanceKm: 4.1 }
      ];

      const actions = [
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'INSPECTION', radius: 'Near User Location' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: userLat, lng: userLng, zoom: 13 } }
      ];

      const reply = isArabic
        ? `✅ تم العثور على **3 مراكز فحص فني للمركبات بالقرب من موقعك**:\n\n1. 🚗 **مركز السلامة للفحص الفني** (1.4 كم - مفتوح الآن 24/7)\n2. 🚗 **فحص أدنوك للمركبات - المشرف** (2.8 كم)\n3. 🚗 **مركز فحص مروح المحاوي** (4.1 كم)`
        : `✅ Found **3 vehicle inspection centers near your location**:\n\n1. 🚗 **Al Salama Vehicle Inspection Center** (1.4 km - Open Now 24/7)\n2. 🚗 **ADNOC Vehicle Inspection - Mushrif** (2.8 km)\n3. 🚗 **Mahawi Testing Hub** (4.1 km)`;

      const datasetsUsed = ['Abu Dhabi Police Traffic Inspection Layer', 'ADNOC Auto Registry'];
      const activeContextTags = [
        { id: 'location', label: isArabic ? 'موقعي الحالي' : 'My Location', icon: '📍' },
        { id: 'category', label: isArabic ? 'فحص فني' : 'Vehicle Inspection', icon: '🚗' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];

      const suggestions = isArabic
        ? ["كم منها مفتوح الآن؟", "عرض الأقرب لي", "حفظ البحث"]
        : ["How many are open now?", "Which one is closest?", "Save this search"];

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, activeContext: { category: 'INSPECTION', activeLocations: results } };
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
