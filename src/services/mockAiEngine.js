// Universal AI Application Controller & Natural Language Agent for GeoVision / SmartMap
import { ACTION_TYPES } from './actionRegistry';
import { aiOrchestrator } from './ai/aiOrchestrator';

// Rich Abu Dhabi Dataset with Multi-Dimensional Quantitative Metrics
const LOCATIONS_DB = [
  // HOSPITALS & HEALTHCARE
  { 
    id: 1, 
    name: 'Cleveland Clinic Abu Dhabi', 
    name_ar: 'كليفلاند كلينك أبوظبي', 
    type: 'HOSPITAL', 
    location: 'Al Maryah Island', 
    location_ar: 'جزيرة الماريه', 
    lat: 24.5011, 
    lng: 54.3942, 
    rating: 4.9, 
    riskLevel: 'High', 
    riskScore: 88, 
    waterConsumption: 14200, // m3/day
    emissionsIndex: 45000,   // tCO2e/yr
    capacity: 364,           // beds
    trend: 'increasing',
    isCoastal: true,
    hasAlerts: true,
    riskDrivers: ['Coastal storm surge vulnerability', 'High HVAC thermal load', 'Heavy medical equipment power draw'],
    tags: ['specialty', 'emergency', 'top rated', 'high risk', 'cleveland', 'clinic', 'coast', 'waterfront'] 
  },
  { 
    id: 2, 
    name: 'Sheikh Shakhbout Medical City', 
    name_ar: 'مدينة الشيخ شخبوط الطبية', 
    type: 'HOSPITAL', 
    location: 'Al Mafraq', 
    location_ar: 'المفرق', 
    lat: 24.2690, 
    lng: 54.6465, 
    rating: 4.8, 
    riskLevel: 'Critical', 
    riskScore: 94, 
    waterConsumption: 18500, // Highest water consumption
    emissionsIndex: 62000,   // High emissions
    capacity: 741,           // Large hospital
    trend: 'increasing',
    isCoastal: false,
    hasAlerts: true,
    riskDrivers: ['Severe groundwater table stress', 'High incinerator emissions', 'Critical emergency access bottleneck'],
    tags: ['government', 'emergency', 'large', 'critical', 'shakhbout', 'ssmc', 'mafraq'] 
  },
  { 
    id: 3, 
    name: 'NMC Specialty Hospital', 
    name_ar: 'مستشفى إن إم سي التخصصي', 
    type: 'HOSPITAL', 
    location: 'Electra Street', 
    location_ar: 'شارع إلكترا', 
    lat: 24.4891, 
    lng: 54.3644, 
    rating: 4.5, 
    riskLevel: 'Moderate', 
    riskScore: 62, 
    waterConsumption: 8900,
    emissionsIndex: 21000,
    capacity: 100,
    trend: 'stable',
    isCoastal: false,
    hasAlerts: false,
    riskDrivers: ['Urban heat island concentration', 'Dense traffic corridor exposure'],
    tags: ['private', 'affordable', 'nmc', 'specialty', 'speciality'] 
  },
  { 
    id: 4, 
    name: 'Al Ain Hospital', 
    name_ar: 'مستشفى العين', 
    type: 'HOSPITAL', 
    location: 'Al Ain', 
    location_ar: 'العين', 
    lat: 24.2155, 
    lng: 55.7389, 
    rating: 4.6, 
    riskLevel: 'High', 
    riskScore: 78, 
    waterConsumption: 12400,
    emissionsIndex: 34000,
    capacity: 412,
    trend: 'improving',
    isCoastal: false,
    hasAlerts: true,
    riskDrivers: ['Arid groundwater depletion zone', 'Extreme summer heat exposure'],
    tags: ['government', 'emergency', 'high risk', 'al ain'] 
  },
  { 
    id: 5, 
    name: 'Burjeel Hospital', 
    name_ar: 'مستشفى برجيل', 
    type: 'HOSPITAL', 
    location: 'Al Najdah Street', 
    location_ar: 'شارع النجدة', 
    lat: 24.4880, 
    lng: 54.3780, 
    rating: 4.7, 
    riskLevel: 'Low', 
    riskScore: 32, 
    waterConsumption: 6100,
    emissionsIndex: 14000,
    capacity: 209,
    trend: 'improving',
    isCoastal: false,
    hasAlerts: false,
    riskDrivers: ['Minor urban congestion'],
    tags: ['private', 'luxury', 'maternity', 'burjeel'] 
  },
  
  // EDUCATION
  { 
    id: 6, 
    name: 'Zayed University Campus', 
    name_ar: 'حرم جامعة زايد', 
    type: 'EDUCATION', 
    location: 'Khalifa City', 
    location_ar: 'مدينة خليفة', 
    lat: 24.4136, 
    lng: 54.5683, 
    rating: 4.7, 
    riskLevel: 'Low', 
    riskScore: 28, 
    waterConsumption: 8400,
    emissionsIndex: 18000,
    capacity: 6500,
    trend: 'stable',
    isCoastal: false,
    hasAlerts: false,
    riskDrivers: ['Expansive roof solar heat gain'],
    tags: ['university', 'government', 'large', 'zayed'] 
  },
  { 
    id: 7, 
    name: 'Sorbonne University Abu Dhabi', 
    name_ar: 'جامعة السوربون أبوظبي', 
    type: 'EDUCATION', 
    location: 'Al Reem Island', 
    location_ar: 'جزيرة الريم', 
    lat: 24.5028, 
    lng: 54.4056, 
    rating: 4.8, 
    riskLevel: 'Moderate', 
    riskScore: 54, 
    waterConsumption: 9800,
    emissionsIndex: 22000,
    capacity: 2500,
    trend: 'stable',
    isCoastal: true,
    hasAlerts: false,
    riskDrivers: ['Coastal perimeter exposure', 'Chilled water loop energy load'],
    tags: ['university', 'private', 'international', 'sorbonne', 'reem', 'coast'] 
  },
  { 
    id: 8, 
    name: 'Bright Riders School', 
    name_ar: 'مدرسة برايت رايدرز', 
    type: 'EDUCATION', 
    location: 'Mohammed Bin Zayed City', 
    location_ar: 'مدينة محمد بن زايد', 
    lat: 24.3297, 
    lng: 54.5361, 
    rating: 4.4, 
    riskLevel: 'Low', 
    riskScore: 22, 
    waterConsumption: 3200,
    emissionsIndex: 8500,
    capacity: 3200,
    trend: 'improving',
    isCoastal: false,
    hasAlerts: false,
    riskDrivers: ['School bus fleet idle emissions'],
    tags: ['school', 'cbse', 'private', 'bright riders'] 
  },
  { 
    id: 9, 
    name: 'Cranleigh Abu Dhabi', 
    name_ar: 'كرانلي أبوظبي', 
    type: 'EDUCATION', 
    location: 'Saadiyat Island', 
    location_ar: 'جزيرة السعديات', 
    lat: 24.5385, 
    lng: 54.4377, 
    rating: 4.9, 
    riskLevel: 'Low', 
    riskScore: 18, 
    waterConsumption: 4100,
    emissionsIndex: 9200,
    capacity: 1800,
    trend: 'improving',
    isCoastal: true,
    hasAlerts: false,
    riskDrivers: ['Island saline soil exposure'],
    tags: ['school', 'british', 'premium', 'cranleigh', 'saadiyat', 'coast'] 
  },
  { 
    id: 10, 
    name: 'NYU Abu Dhabi', 
    name_ar: 'جامعة نيويورك أبوظبي', 
    type: 'EDUCATION', 
    location: 'Saadiyat Island', 
    location_ar: 'جزيرة السعديات', 
    lat: 24.5238, 
    lng: 54.4346, 
    rating: 4.9, 
    riskLevel: 'Low', 
    riskScore: 42, 
    waterConsumption: 11500,
    emissionsIndex: 26000,
    capacity: 2200,
    trend: 'stable',
    isCoastal: true,
    hasAlerts: false,
    riskDrivers: ['High research lab power intensity', 'Chilled water cooling towers'],
    tags: ['university', 'international', 'top rated', 'nyu', 'saadiyat', 'coast'] 
  },

  // PARKS & ENVIRONMENT
  { 
    id: 11, 
    name: 'Umm Al Emarat Park', 
    name_ar: 'حديقة أم الإمارات', 
    type: 'PARK', 
    location: 'Al Mushrif', 
    location_ar: 'المشرف', 
    lat: 24.4533, 
    lng: 54.3879, 
    rating: 4.8, 
    riskLevel: 'Low', 
    riskScore: 12, // Safest
    waterConsumption: 15400, 
    emissionsIndex: 1200,    
    capacity: 10000,
    trend: 'improving',
    isCoastal: false,
    hasAlerts: false,
    riskDrivers: ['Irrigation water supply dependency'],
    tags: ['botanical', 'family', 'events', 'umm al emarat', 'emarat'] 
  },
  { 
    id: 12, 
    name: 'Corniche Beach Park', 
    name_ar: 'حديقة شاطئ الكورنيش', 
    type: 'PARK', 
    location: 'Corniche Road', 
    location_ar: 'طريق الكورنيش', 
    lat: 24.4721, 
    lng: 54.3213, 
    rating: 4.7, 
    riskLevel: 'Moderate', 
    riskScore: 58, 
    waterConsumption: 12000,
    emissionsIndex: 2500,
    capacity: 15000,
    trend: 'stable',
    isCoastal: true,
    hasAlerts: false,
    riskDrivers: ['Sea level rise inundation risk', 'Coastal erosion'],
    tags: ['beach', 'cycling', 'sunset', 'corniche', 'coast', 'waterfront'] 
  },
  { 
    id: 13, 
    name: 'Khalifa Park', 
    name_ar: 'منتزه خليفة', 
    type: 'PARK', 
    location: 'Al Muntazah', 
    location_ar: 'المنتزه', 
    lat: 24.4230, 
    lng: 54.4740, 
    rating: 4.5, 
    riskLevel: 'Low', 
    riskScore: 24, 
    waterConsumption: 13800,
    emissionsIndex: 3100,
    capacity: 12000,
    trend: 'stable',
    isCoastal: false,
    hasAlerts: false,
    riskDrivers: ['Treated sewage effluent supply stability'],
    tags: ['family', 'train', 'large', 'khalifa park'] 
  },
  { 
    id: 14, 
    name: 'Jubail Mangrove Park', 
    name_ar: 'منتزه قرم الجبيل', 
    type: 'PARK', 
    location: 'Jubail Island', 
    location_ar: 'جزيرة الجبيل', 
    lat: 24.5420, 
    lng: 54.4840, 
    rating: 4.9, 
    riskLevel: 'High', 
    riskScore: 82, 
    waterConsumption: 500,
    emissionsIndex: 800,
    capacity: 1500,
    trend: 'increasing',
    isCoastal: true,
    hasAlerts: true,
    riskDrivers: ['High tidal storm flood exposure', 'Marine biodiversity vulnerability'],
    tags: ['nature', 'boardwalk', 'kayaking', 'environment', 'jubail', 'biodiversity', 'coast'] 
  },
  
  // TRANSPORT
  { 
    id: 15, 
    name: 'Abu Dhabi Main Bus Terminal', 
    name_ar: 'محطة حافلات أبوظبي الرئيسية', 
    type: 'TRANSPORT', 
    location: 'Al Nahyan', 
    location_ar: 'آل نهيان', 
    lat: 24.4719, 
    lng: 54.3725, 
    rating: 4.1, 
    riskLevel: 'Moderate', 
    riskScore: 68, 
    waterConsumption: 7500,
    emissionsIndex: 38000, 
    capacity: 25000,
    trend: 'stable',
    isCoastal: false,
    hasAlerts: false,
    riskDrivers: ['Heavy diesel PM2.5 exhaust emissions', 'Heat island congestion zone'],
    tags: ['bus', 'intercity', 'public', 'bus terminal'] 
  },
  { 
    id: 16, 
    name: 'Zayed International Airport', 
    name_ar: 'مطار زايد الدولي', 
    type: 'TRANSPORT', 
    location: 'Airport Road', 
    location_ar: 'شارع المطار', 
    lat: 24.4329, 
    lng: 54.6511, 
    rating: 4.8, 
    riskLevel: 'Critical', 
    riskScore: 92, 
    waterConsumption: 24000, // Highest water & energy
    emissionsIndex: 84000,   // Highest emissions overall
    capacity: 120000,        // Largest facility overall
    trend: 'increasing',
    isCoastal: false,
    hasAlerts: true,
    riskDrivers: ['Extreme aviation carbon emissions', 'Critical infrastructure power dependency', 'High thermal cooling load'],
    tags: ['airport', 'flights', 'international', 'critical', 'zayed int', 'airport road', 'largest'] 
  },
  { 
    id: 17, 
    name: 'Abu Dhabi Cruise Terminal', 
    name_ar: 'محطة أبوظبي للسفن السياحية', 
    type: 'TRANSPORT', 
    location: 'Mina Zayed', 
    location_ar: 'ميناء زايد', 
    lat: 24.5120, 
    lng: 54.3810, 
    rating: 4.6, 
    riskLevel: 'Moderate', 
    riskScore: 64, 
    waterConsumption: 9100,
    emissionsIndex: 42000,
    capacity: 8000,
    trend: 'stable',
    isCoastal: true,
    hasAlerts: false,
    riskDrivers: ['Ship auxiliary engine marine emissions', 'Port tidal surge vulnerability'],
    tags: ['cruise', 'sea', 'tourism', 'mina zayed', 'coast', 'waterfront'] 
  }
];

const fmt = num => num.toLocaleString();

export const mockAiEngine = {
  async processQuery(queryText, currentState = null, isArabic = false) {
    // Delegate to modular GeoAI Orchestrator first
    const orchestratorResult = await aiOrchestrator.processUserQuery(queryText, currentState, isArabic, LOCATIONS_DB);
    if (orchestratorResult) return orchestratorResult;

    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 300) + 300));

    const q = queryText.toLowerCase().trim();
    let actions = [];
    let actionCards = [];
    let results = [];
    let reply = "";
    let suggestions = [];
    let chartData = null;

    const currentLoc = currentState?.selectedLocation || LOCATIONS_DB[0];

    // =========================================================
    // 1. LANGUAGE SWITCHING
    // =========================================================
    const isArabicReq = ['arabic', 'عربي', 'عربية', 'العربية', 'to arabic', 'حولي للعربي'].some(w => q.includes(w));
    const isEnglishReq = ['english', 'إنجليزية', 'الانجليزية', 'to english'].some(w => q.includes(w));

    if (isArabicReq && !isArabic) {
      actions.push({ type: ACTION_TYPES.LANGUAGE_SET, params: { lang: 'ar' } });
      reply = "تم تغيير لغة التطبيق إلى اللغة العربية بنجاح.";
      suggestions = ["عرض المستشفيات", "الذهاب للرئيسية", "عرض المدارس"];
      return { reply, actions, suggestions };
    }

    if (isEnglishReq && isArabic) {
      actions.push({ type: ACTION_TYPES.LANGUAGE_SET, params: { lang: 'en' } });
      reply = "Switched application language to English successfully.";
      suggestions = ["Show high-risk facilities", "Go to home page", "Show schools"];
      return { reply, actions, suggestions };
    }

    // =========================================================
    // 2. UNDO & REVERSIBILITY
    // =========================================================
    if (['undo', 'go back', 'revert', 'cancel last action', 'تراجع', 'restore previous view', 'restore default map', 'bring back previous layers'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.UNDO_ACTION });
      reply = isArabic ? "تم إلغاء الإجراء الأخير واستعادة الحالة السابقة." : "Undid the last action and restored the previous application state.";
      suggestions = isArabic ? ["إعادة تعيين الفلاتر", "عرض الخريطة الكاملة"] : ["Reset filters", "Show full map"];
      return { reply, actions, suggestions };
    }

    if (['reset', 'clear all', 'clear filters', 'show full map', 'show whole country', 'entire country', 'complete project area', 'remove all filters', 'clear everything', 'start again'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.MAP_RESET });
      reply = isArabic ? "تم إعادة تعيين الخريطة وإزالة جميع الفلاتر." : "Reset the map view to default bounds and cleared all active filters.";
      suggestions = isArabic ? ["عرض المستشفيات ذات الخطورة العالية", "عرض حديقة أم الإمارات"] : ["Show high risk hospitals", "Show Umm Al Emarat Park"];
      return { reply, actions, suggestions };
    }

    // =========================================================
    // 3.1 GUEST / AUTHENTICATED USER JOURNEYS & MULTI-TURN INTENTS
    // =========================================================

    // Multi-turn context extraction from previous state
    const prevContext = currentState?.activeContext || {};

    // ---------------------------------------------------------
    // 1. QUERY VALIDATION BEFORE GIS EXECUTION ("Show hospitals within 5 km" without reference location)
    // ---------------------------------------------------------
    if (q === 'show hospitals within 5 km' || q === 'hospitals within 5 km' || q === 'عرض المستشفيات ضمن 5 كم') {
      reply = isArabic
        ? "⚠️ **يتطلب هذا الاستعلام تحديد الموقع المرجعي**:\nمن أي موقع ترغب في البحث عن المستشفيات في نطاق 5 كم؟"
        : "⚠️ **Reference Location Required**:\nFrom which location would you like to search for healthcare facilities within a 5 km radius?";

      suggestions = isArabic
        ? ["موقعي الحالي", "مدينة زايد الرياضية", "مدينة خليفة"]
        : ["Near My Location", "Zayed Sports City", "Khalifa City"];

      const actionCards = [
        { title: isArabic ? "استخدام موقعي الحالي" : "Use My Current Location", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals within 5 km of my location" } },
        { title: isArabic ? "مدينة زايد الرياضية" : "Zayed Sports City", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals within 5 km of Zayed Sports City" } },
        { title: isArabic ? "مدينة خليفة" : "Khalifa City", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals in Khalifa City" } }
      ];

      return { reply, suggestions, actionCards, datasetsUsed: ['DGE Spatial SDI 2026'] };
    }

    // ---------------------------------------------------------
    // 2. AMBIGUOUS LOCATION RESOLUTION ("Show parks near Yas")
    // ---------------------------------------------------------
    if (q.includes('near yas') || q.includes('in yas') || q.includes('قريب من ياس') || q.includes('في ياس')) {
      reply = isArabic
        ? "🔍 **تم العثور على عدة مناطق تطابق اسم 'ياس'**:\nأي من المناطق التالية تقصد لبحث الحدائق والمحميات؟"
        : "🔍 **Ambiguous Location Detected**:\nI found several areas matching **'Yas'**. Which location do you mean?";

      suggestions = isArabic
        ? ["جزيرة ياس", "بني ياس", "جزيرة الياسات الغربية"]
        : ["Yas Island", "Bani Yas", "Yasat West Island"];

      const actionCards = [
        { title: isArabic ? "جزيرة ياس" : "Yas Island", actionType: 'SEARCH_SUBMIT', params: { query: "Show parks in Yas Island" } },
        { title: isArabic ? "بني ياس" : "Bani Yas", actionType: 'SEARCH_SUBMIT', params: { query: "Show parks in Bani Yas" } },
        { title: isArabic ? "جزيرة الياسات" : "Yasat West Island", actionType: 'SEARCH_SUBMIT', params: { query: "Show parks in Yasat West Island" } }
      ];

      return { reply, suggestions, actionCards, datasetsUsed: ['DGE Administrative Boundaries'] };
    }

    // ---------------------------------------------------------
    // 3. FEATURE DETAIL RESOLUTION ("Show its details", "Tell me more about it", "Show details")
    // ---------------------------------------------------------
    if (['show its details', 'its details', 'tell me more', 'show details', 'تفاصيلها', 'عرض التفاصيل'].some(w => q.includes(w))) {
      const selectedFac = currentState?.selectedLocation || prevContext.selectedFeature || prevContext.activeLocations?.[0] || LOCATIONS_DB[1]; // Default SSMC

      actions.push(
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: selectedFac } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: selectedFac.lat, lng: selectedFac.lng, zoom: 16 } }
      );

      reply = isArabic
        ? `📋 **عرض تفاصيل المنشأة**:\nتم تفعيل لوحة المعلومات التفصيلية لـ **${selectedFac.name_ar || selectedFac.name}** (${selectedFac.location_ar || selectedFac.location}).\n\n- **نوع المنشأة**: ${selectedFac.type}\n- **مستوى الخطورة المركب**: ${selectedFac.riskLevel} (${selectedFac.riskScore}/100)\n- **استهلاك المياه**: ${fmt(selectedFac.waterConsumption)} م³/يوم\n- **مؤشر الانبعاثات**: ${fmt(selectedFac.emissionsIndex)} طن كربون/سنة`
        : `📋 **Opening Feature Details**:\nActivated details panel for **${selectedFac.name}** (${selectedFac.location}).\n\n- **Facility Type**: ${selectedFac.type}\n- **Compound Risk Level**: ${selectedFac.riskLevel} (${selectedFac.riskScore}/100)\n- **Water Consumption**: ${fmt(selectedFac.waterConsumption)} m³/day\n- **Emissions Index**: ${fmt(selectedFac.emissionsIndex)} tCO2e/yr`;

      const activeContextTags = [
        { id: 'selected', label: isArabic ? `محدد: ${selectedFac.name_ar || selectedFac.name}` : `Selected: ${selectedFac.name}`, icon: '🎯' }
      ];

      suggestions = isArabic
        ? ["عرض المدارس القريبة منها", "حفظ هذا الموقع", "تصدير تقرير المنشأة"]
        : ["Show schools near it", "Save this location", "Export facility report"];

      return { reply, results: [selectedFac], actions, suggestions, datasetsUsed: ['DoH Healthcare Registry', 'DGE Spatial SDI 2026'], activeContextTags, activeContext: { ...prevContext, selectedFeature: selectedFac } };
    }

    // ---------------------------------------------------------
    // 4. TEMPORAL / OPEN-NOW FILTER ("How many are open now?")
    // ---------------------------------------------------------
    if (['how many are open', 'open now', 'working hours', 'مفتوح الآن', 'كم منها مفتوح'].some(w => q.includes(w))) {
      results = (prevContext.activeLocations || LOCATIONS_DB.filter(l => l.type === 'HOSPITAL')).map(h => ({ ...h, isNowOpen: true }));

      reply = isArabic
        ? `🕒 **تطبيق فلتر ساعات العمل (مفتوح الآن)**:\nجميع المنشآت الصحية الـ **${results.length}** في النتائج الحالية تعمل على مدار **24/7 طوال اليوم** لتقديم خدمات الطوارئ.`
        : `🕒 **Applied Operating Hours Filter (Open Now)**:\nAll **${results.length}** healthcare facilities in your current result set operate **24/7 continuously** with emergency trauma care.`;

      const activeContextTags = [
        ...(prevContext.activeContextTags || []),
        { id: 'temporal', label: isArabic ? 'مفتوح الآن 24/7' : 'Open Now (24/7)', icon: '🕒' }
      ];

      suggestions = isArabic
        ? ["أيها الأقرب لي؟", "عرض التفاصيل", "حفظ البحث"]
        : ["Which one is closest?", "Show its details", "Save this search"];

      return { reply, results, actions, suggestions, datasetsUsed: ['DoH Emergency Operating Hours Registry'], activeContextTags, activeContext: { ...prevContext, openNow: true } };
    }

    // ---------------------------------------------------------
    // 5. 7-STEP FINAL ACCEPTANCE JOURNEY & MULTI-TURN SEQUENCE
    // ---------------------------------------------------------

    // Step 1: "Show hospitals in Abu Dhabi"
    if (q === 'show hospitals in abu dhabi' || q === 'hospitals in abu dhabi' || q === 'عرض المستشفيات في أبوظبي') {
      results = LOCATIONS_DB.filter(l => l.type === 'HOSPITAL');
      const topLoc = results[0];

      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'HOSPITAL', district: 'Abu Dhabi Sector' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: 24.4839, lng: 54.3773, zoom: 12 } }
      );

      reply = isArabic
        ? `تم التركيز على **قطاع إمارة أبوظبي** وتحديد **${results.length} مستشفيات ومراكز طبية تخصصية** على الخريطة:\n\n1. **${results[0].name_ar || results[0].name}** (الماريه)\n2. **${results[1].name_ar || results[1].name}** (المفرق)\n3. **${results[2].name_ar || results[2].name}** (شارع إلكترا)`
        : `Identified **${results.length} healthcare facilities** across **Abu Dhabi sector**:\n\n1. **${results[0].name}** (Al Maryah Island)\n2. **${results[1].name}** (Al Mafraq)\n3. **${results[2].name}** (Electra Street)`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'DoH Master Healthcare Registry v2.1'];
      const activeContextTags = [
        { id: 'category', label: isArabic ? 'مستشفيات' : 'Hospitals', icon: '🏥' },
        { id: 'district', label: isArabic ? 'أبوظبي' : 'Abu Dhabi', icon: '📍' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];
      const newContext = { category: 'HOSPITAL', district: 'Abu Dhabi', activeLocations: results };

      suggestions = isArabic 
        ? ["المستشفيات الحكومية فقط", "ضمن نطاق 5 كم من مدينة زايد الرياضية", "أيها الأقرب لي؟"] 
        : ["Only government hospitals", "Within 5 km of Zayed Sports City", "Which one is closest?"];

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, activeContext: newContext };
    }

    // Step 2: "Only government hospitals" (Refines Step 1)
    if (q === 'only government hospitals' || q === 'only government' || q === 'government hospitals' || q === 'المستشفيات الحكومية فقط' || q === 'حكومي فقط') {
      const currentDistrict = prevContext.district || 'Abu Dhabi';
      results = LOCATIONS_DB.filter(l => l.type === 'HOSPITAL' && l.tags.includes('government'));

      const topLoc = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'HOSPITAL', district: currentDistrict, ownership: 'Government' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topLoc.lat, lng: topLoc.lng, zoom: 13 } }
      );

      reply = isArabic
        ? `تم تصفية نتائج **${currentDistrict}** لعرض **المستشفيات الحكومية فقط** (تم العثور على **${results.length} مستشفيات حكومية**):\n\n1. 🏛️ **${results[0].name_ar || results[0].name}** (المفرق - سعة 741 سرير)\n2. 🏛️ **${results[1]?.name_ar || results[1]?.name || 'مستشفى العين الحكومي'}** (العين - سعة 412 سرير)`
        : `Refined active query for **${currentDistrict}** to display **Government Hospitals only** (Found **${results.length} government hospitals**):\n\n1. 🏛️ **${results[0].name}** (Al Mafraq - 741 beds)\n2. 🏛️ **${results[1]?.name || 'Al Ain Government Hospital'}** (Al Ain - 412 beds)`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'DoH Government Healthcare Layer'];
      const activeContextTags = [
        { id: 'category', label: isArabic ? 'مستشفيات' : 'Hospitals', icon: '🏥' },
        { id: 'district', label: isArabic ? currentDistrict : currentDistrict, icon: '📍' },
        { id: 'ownership', label: isArabic ? 'حكومي فقط' : 'Government Only', icon: '🏛️' },
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' }
      ];
      const newContext = { ...prevContext, category: 'HOSPITAL', district: currentDistrict, ownership: 'Government', activeLocations: results };

      suggestions = isArabic 
        ? ["ضمن نطاق 5 كم من مدينة زايد الرياضية", "أيها الأقرب لي؟", "عرض تفاصيلها"] 
        : ["Within 5 km of Zayed Sports City", "Which one is closest?", "Show its details"];

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, activeContext: newContext };
    }

    // Step 3: "Within 5 km of Zayed Sports City" (Refines Step 2)
    if (q.includes('zayed sports city') || q.includes('زايد الرياضية')) {
      const sportsCityCenter = { lat: 24.4172, lng: 54.4531 };

      results = LOCATIONS_DB.filter(l => l.type === 'HOSPITAL' && l.tags.includes('government')).map(h => {
        const d = Math.sqrt(Math.pow(h.lat - sportsCityCenter.lat, 2) + Math.pow(h.lng - sportsCityCenter.lng, 2)) * 111;
        return { ...h, distanceKm: parseFloat(d.toFixed(1)) };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      const topLoc = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'HOSPITAL', ownership: 'Government', radius: '5 km of Zayed Sports City' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: sportsCityCenter.lat, lng: sportsCityCenter.lng, zoom: 14 } }
      );

      reply = isArabic
        ? `تم تنفيذ تحليل النطاق المكانية (5 كم) حول **مدينة زايد الرياضية**. تم العثور على **${results.length} مستشفيات حكومية**:\n\n1. 🏥 **${results[0].name_ar || results[0].name}** (تبعد **${results[0].distanceKm} كم**)\n2. 🏥 **${results[1]?.name_ar || results[1]?.name || 'مستشفى العين الحكومي'}** (تبعد **${results[1]?.distanceKm || 4.2} كم**)`
        : `Executed 5 km proximity analysis around **Zayed Sports City**. Found **${results.length} government hospitals**:\n\n1. 🏥 **${results[0].name}** (**${results[0].distanceKm} km** away)\n2. 🏥 **${results[1]?.name || 'Al Ain Government Hospital'}** (**${results[1]?.distanceKm || 4.2} km** away)`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'DoH Proximity Buffer Engine'];
      const activeContextTags = [
        { id: 'category', label: isArabic ? 'مستشفيات' : 'Hospitals', icon: '🏥' },
        { id: 'ownership', label: isArabic ? 'حكومي' : 'Government', icon: '🏛️' },
        { id: 'district', label: isArabic ? 'مدينة زايد الرياضية' : 'Zayed Sports City', icon: '📍' },
        { id: 'radius', label: isArabic ? 'نطاق 5 كم' : 'Within 5 km', icon: '📏' }
      ];
      const newContext = { ...prevContext, category: 'HOSPITAL', ownership: 'Government', district: 'Zayed Sports City', radius: '5 km', activeLocations: results };

      suggestions = isArabic 
        ? ["أيها الأقرب لي؟", "عرض تفاصيلها", "عرض المدارس ضمن 2 كم من هذه المستشفيات"] 
        : ["Which one is closest?", "Show its details", "Show schools within 2 km of these hospitals"];

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, activeContext: newContext };
    }

    // Step 4: "Which one is closest?" (Ranks active 3 results)
    if (['which one is closest', 'which is closest', 'which one is nearest', 'nearest to me', 'closest to me', 'أيها الأقرب لي', 'أيها الأقرب'].some(w => q.includes(w))) {
      const sportsCityCenter = { lat: 24.4172, lng: 54.4531 };

      const baseList = prevContext.activeLocations || LOCATIONS_DB.filter(l => l.type === 'HOSPITAL' && l.tags.includes('government'));
      results = baseList.map(h => {
        const d = Math.sqrt(Math.pow(h.lat - sportsCityCenter.lat, 2) + Math.pow(h.lng - sportsCityCenter.lng, 2)) * 111;
        return { ...h, distanceKm: parseFloat(d.toFixed(1)) };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      const topLoc = results[0]; // Sheikh Shakhbout Medical City (SSMC)
      actions.push(
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topLoc.lat, lng: topLoc.lng, zoom: 15 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topLoc } }
      );

      reply = isArabic
        ? `**ترتيب المستشفيات الحكومية حسب القرب من مدينة زايد الرياضية**:\n\n1. 🥇 **${topLoc.name_ar || topLoc.name}** — **${topLoc.distanceKm} كم** (الأقرب)\n2. 🥈 **${results[1]?.name_ar || results[1]?.name || 'مستشفى العين الحكومي'}** — **${results[1]?.distanceKm || 4.2} كم**`
        : `**Ranked Government Hospitals by Proximity to Zayed Sports City**:\n\n1. 🥇 **${topLoc.name}** — **${topLoc.distanceKm} km away** (Closest)\n2. 🥈 **${results[1]?.name || 'Al Ain Government Hospital'}** — **${results[1]?.distanceKm || 4.2} km away**`;

      const datasetsUsed = ['DGE GPS Location Engine', 'DoH Proximity Buffer Engine'];
      const activeContextTags = [
        { id: 'category', label: isArabic ? 'مستشفيات' : 'Hospitals', icon: '🏥' },
        { id: 'ownership', label: isArabic ? 'حكومي' : 'Government', icon: '🏛️' },
        { id: 'selected', label: isArabic ? `الأقرب: ${topLoc.name_ar || topLoc.name}` : `Closest: ${topLoc.name}`, icon: '🎯' }
      ];
      const newContext = { ...prevContext, rank: 'DISTANCE', selectedFeature: topLoc, activeLocations: results };

      suggestions = isArabic 
        ? ["عرض تفاصيلها", "عرض المدارس ضمن 2 كم من هذه المستشفيات", "حفظ هذا البحث"] 
        : ["Show its details", "Show schools within 2 km of these hospitals", "Save this search"];

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, activeContext: newContext };
    }

    // Turn 4: "Show schools within 2 km of these hospitals" (Context inherited from Turn 3)
    if (['schools within 2 km of these hospitals', 'schools near these hospitals', 'schools near these', 'within 2 km of these'].some(w => q.includes(w))) {
      const sourceHospitals = prevContext.activeLocations || LOCATIONS_DB.filter(l => l.type === 'HOSPITAL');
      results = LOCATIONS_DB.filter(l => l.type === 'EDUCATION').slice(0, 3);

      const topSchool = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'EDUCATION', spatialBuffer: '2 km of Selected Hospitals' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topSchool.lat, lng: topSchool.lng, zoom: 14 } }
      );

      reply = isArabic
        ? `تم تنفيذ استعلام التحليل المكاني التجميعي (**مدارس ضمن 2 كم من المستشفيات المحددة سابقتًا**). تم العثور على **${results.length} مدارس**:\n\n1. **${results[0].name_ar || results[0].name}** (يبعد 1.1 كم من SSMC)\n2. **${results[1]?.name_ar || results[1]?.name || 'مدرسة برايت رايدرز'}** (يبعد 1.7 كم من SSMC)`
        : `Executed Multi-Layer Spatial Buffer Analysis (**Schools within 2 km of previous Government Hospital results**). Found **${results.length} educational institutions**:\n\n1. **${results[0].name}** (1.1 km from SSMC Hospital)\n2. **${results[1]?.name || 'Bright Riders School'}** (1.7 km from SSMC Hospital)`;

      const datasetsUsed = ['ADEK Schools Registry 2026', 'DoH Healthcare Buffer Layer'];
      const activeContextTags = [
        { id: 'category', label: isArabic ? 'مدارس' : 'Schools', icon: '🎓' },
        { id: 'buffer', label: isArabic ? 'نطاق 2 كم حول المستشفيات' : '2 km Buffer around Hospitals', icon: '🔄' }
      ];
      const newContext = { ...prevContext, category: 'EDUCATION', bufferOrigin: 'Gov Hospitals', radius: '2 km' };

      suggestions = isArabic 
        ? ["حفظ هذا البحث إلى المفضلة", "تصدير التقرير", "بدء بحث جديد"] 
        : ["Save this search to Favorites", "Export Report", "Start new search"];

      return { reply, results, actions, suggestions, datasetsUsed, activeContextTags, activeContext: newContext };
    }

    // E) USE CASE 5: SAVE SEARCH & FAVORITES PROMPT
    if (['save this search', 'save to favorites', 'add to favorites', 'save search', 'حفظ هذا البحث'].some(w => q.includes(w))) {
      const isLoggedIn = currentState?.userAuth?.isLoggedIn;

      if (!isLoggedIn) {
        actions.push({ type: 'PROMPT_AUTH', params: { feature: isArabic ? 'حفظ البحث والمفضلة' : 'Save Search & Favorites' } });
        reply = isArabic
          ? "🔒 **يتطلب هذا الإجراء تسجيل الدخول**:\nيرجى تسجيل الدخول عبر **الهوية الرقمية UAE PASS** أو **حساب دائر التمكين الحكومي** لحفظ عمليات البحث والوصول إلى المفضلة في مساحة عملك المخصصة."
          : "🔒 **Authentication Required**:\nPlease sign in with **UAE PASS** or your **DGE Account** to save custom queries and access your personalized Favorites workspace.";

        return { reply, actions, promptAuth: true };
      }

      reply = isArabic
        ? `✅ **تم حفظ البحث بنجاح**:\nتم حفظ استعلامك المكاني **"${prevContext.category || 'البحث المكاني'}"** إلى قائمة **المفضلة والمستندات المحفوظة**.`
        : `✅ **Query Saved to Favorites**:\nYour spatial query **"${prevContext.category || 'Custom Spatial Search'}"** has been saved to your personalized Favorites workspace.`;

      return { reply, results: prevContext.activeLocations || [] };
    }

    // F) NO RESULT STATE (e.g. "Show hospitals within 500 meters of this location")
    if (['within 500 meters', '500 meters', '500m', 'within 500m'].some(w => q.includes(w))) {
      reply = isArabic
        ? `⚠️ **لم يتم العثور على أي مستشفيات ضمن نطاق 500 متر** من هذا الموقع.\n\nتتوفر مستشفيات عند زيادة نطاق البحث إلى **2 كم** أو **5 كم**.`
        : `⚠️ **No hospitals were found within 500 meters** of this location.\n\nSeveral healthcare facilities are available if you expand the spatial search radius to **2 km** or **5 km**.`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'DoH Healthcare Layer v2.1'];
      suggestions = isArabic
        ? ["توسيع نطاق البحث إلى 2 كم", "توسيع نطاق البحث إلى 5 كم", "تغيير الموقع الحالي"]
        : ["Expand search area to 2 km", "Expand search area to 5 km", "Change location"];

      return { reply, results: [], suggestions, datasetsUsed };
    }

    // G) AMBIGUOUS REQUEST STATE (e.g. "Show good hospitals")
    if (['good hospitals', 'show good hospitals', 'best hospitals', 'good health'].some(w => q.includes(w))) {
      reply = isArabic
        ? `❓ **كيف تود تعريف "المستشفيات الممتازة"؟**\nيرجى تحديد المعيار المطلوب لتصفية البيانات المكانية بشكل دقيق:`
        : `❓ **How would you like to define "good hospitals"?**\nPlease select your preferred criterion for spatial filtering:`;

      suggestions = isArabic
        ? ["الأقرب من موقعي", "المستشفيات الحكومية فقط", "الأعلى تقييماً", "الأكبر سعة"]
        : ["Nearest to me", "Only government hospitals", "Highest rated", "Most capacity"];

      return { reply, suggestions };
    }

    // I) NO RESULTS RECOVERY ("Show rehabilitation centers within 1 km of Zayed City")
    if (q.includes('rehabilitation centers') || q.includes('rehabilitation') || q.includes('مراكز التأهيل')) {
      reply = isArabic
        ? "⚠️ **لم يتم العثور على أي مراكز تأهيل ضمن نطاق 1 كم من مدينة زايد**.\n\nتتوفر عدة خيارات بديلة عند إدخال تعديل بسيط على نطاق أو نوع الاستعلام:"
        : "⚠️ **No rehabilitation centers were found within 1 km of Zayed City**.\n\nSeveral alternative options are available by adjusting your search radius or facility category:";

      suggestions = isArabic
        ? ["البحث ضمن نطاق 5 كم", "البحث حول مدينة زايد", "عرض جميع مراكز التأهيل", "عرض الرعاية الصحية القريبة"]
        : ["Search within 5 km", "Search around Zayed City", "Show all rehabilitation centers", "Show healthcare facilities nearby"];

      const actionCards = [
        { title: isArabic ? "توسيع النطاق إلى 5 كم" : "Search within 5 km", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals within 5 km of Zayed Sports City" } },
        { title: isArabic ? "عرض المنشآت الصحية القريبة" : "Show Healthcare Nearby", actionType: 'SEARCH_SUBMIT', params: { query: "Show hospitals in Abu Dhabi" } }
      ];

      return { reply, results: [], suggestions, actionCards, datasetsUsed: ['DoH Master Spatial Registry 2026'] };
    }

    // J) UNSUPPORTED REQUEST HANDLING ("Show me the richest areas of Abu Dhabi")
    if (q.includes('richest areas') || q.includes('wealthiest') || q.includes('الأغنى')) {
      reply = isArabic
        ? "ℹ️ **بيانات المستوى الاقتصادي غير متوفرة ضمن المنظومة**:\nيمكنني تحليل وإجراء الاستعلامات المكانية لطبقات منصة GeoVision المتاحة (الصحة، التعليم، النقل، البيئة، الصناعة)، لكن لا تتوفر حالياً طبقة بيانات لتوزيع مستويات الدخل."
        : "ℹ️ **Dataset Not Available**:\nI can search and analyze loaded **GeoVision SDI datasets** (Healthcare, Education, Transit, Infrastructure, Industry), but socio-economic household income data is not part of this spatial platform.";

      suggestions = isArabic
        ? ["استكشاف البيانات المتاحة", "عرض المنشآت الصحية", "عرض وسائل النقل العامة"]
        : ["Explore Available Data", "Show healthcare facilities", "Show public transport"];

      return { reply, results: [], suggestions, datasetsUsed: ['DGE SDI Metadata Catalogue 2026'] };
    }

    // H) LOCATION UNAVAILABLE STATE (e.g. "Show hospitals near me" when location not enabled)
    if (['hospitals near me', 'near me'].some(w => q.includes(w)) && !q.includes('5 km')) {
      reply = isArabic
        ? `📍 **نحتاج لتعيين موقعك لتحديد المستشفيات القريبة**.\nيرجى السماح بتحديد الموقع أو اختيار إحدى المناطق التالية:`
        : `📍 **We need your location to find nearby hospitals**.\nPlease allow location permissions or select a district:`;

      suggestions = isArabic
        ? ["استخدام موقعي الحالي", "اختيار مدينة خليفة", "اختيار جزيرة الريم"]
        : ["Use my location", "Choose Khalifa City", "Choose Al Reem Island"];

      return { reply, suggestions };
    }


    if (['hide all other layers', 'hide all layers', 'hide other layers', 'turn off all layers', 'hide layers', 'turn off emissions', 'hide irrelevant layers', 'hide everything except'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.LAYER_DISABLE_ALL });
      reply = isArabic ? "تم إخفاء جميع طبقات الخريطة الإضافية لعرض خريطة واضحة." : "Hidden all overlay layers. Displaying clean basemap view with active facility markers.";
      suggestions = isArabic ? ["عرض طبقة مخاطر الفيضانات", "عرض المنشآت"] : ["Show flood risk layer", "Show high-risk facilities"];
      return { reply, actions, suggestions };
    }

    if (['show flood risk', 'flood layer', 'climate risk', 'water risk', 'flood risk layer', 'water-related layers', 'environmental layers', 'biodiversity and water'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.LAYER_TOGGLE, params: { layerId: 'floodRisk', active: true } });
      reply = isArabic ? "تم تفعيل طبقة **مخاطر الفيضانات والارتفاع الساحلي والتنوع البيولوجي**." : "Enabled **Flood Risk & Environmental Vulnerability** GIS overlay across coastal Abu Dhabi.";
      suggestions = isArabic ? ["إخفاء طبقة الفيضانات", "عرض المستشفيات المتأثرة"] : ["Hide flood layer", "Show affected facilities"];
      return { reply, actions, suggestions };
    }

    if (['hide flood layer', 'hide flood risk', 'turn off flood'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.LAYER_TOGGLE, params: { layerId: 'floodRisk', active: false } });
      reply = isArabic ? "تم إخفاء طبقة مخاطر الفيضانات." : "Hidden Flood Risk layer.";
      return { reply, actions };
    }

    if (['satellite', 'satellite view', 'satellite map'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.MAP_SET_BASEMAP, params: { basemapId: 'satellite' } });
      reply = isArabic ? "تم تغيير الخريطة إلى **التقاطات الأقمار الصناعية عالية الدقة**." : "Switched basemap to High-Resolution Satellite imagery.";
      return { reply, actions };
    }

    if (['normal map', 'terrain', 'default map', 'switch back to normal'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.MAP_SET_BASEMAP, params: { basemapId: 'streets' } });
      reply = isArabic ? "تم العودة إلى الخريطة التخطيطية القياسية." : "Switched basemap back to Standard Vector Map.";
      return { reply, actions };
    }

    // =========================================================
    // 4. QUANTITATIVE METRICS: WATER CONSUMPTION & WATER STRESS
    // =========================================================
    if (['water consumption', 'water stress', 'water usage', 'highest water', 'water stress above 80'].some(w => q.includes(w))) {
      const sortedByWater = [...LOCATIONS_DB].sort((a, b) => b.waterConsumption - a.waterConsumption);
      const topWater = sortedByWater[0]; // Zayed Int Airport or Sheikh Shakhbout

      actions.push(
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topWater.lat, lng: topWater.lng, zoom: 16 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topWater } },
        { type: ACTION_TYPES.FACILITY_OPEN_DETAIL }
      );

      const fName = isArabic && topWater.name_ar ? topWater.name_ar : topWater.name;
      reply = isArabic
        ? `تم التكبير والتركيز على **${fName}**، وهي المنشأة ذات أعلى استهلاك للمياه بـ **${fmt(topWater.waterConsumption)} م³/يوم**. تم فتح ملف التقييم التفصيلي.`
        : `Zoomed directly to **${fName}** in ${topWater.location}, which records the highest water consumption at **${fmt(topWater.waterConsumption)} m³/day**. Opened detailed metrics drawer.`;

      results = sortedByWater.slice(0, 4);
      actionCards = [
        { id: 'chart', label: isArabic ? 'رسم بياني لاستهلاك المياه' : 'View Water Chart', actionType: ACTION_TYPES.ANALYTICS_SHOW_CHART },
        { id: 'export', label: isArabic ? 'تصدير البيانات' : 'Export Analysis', actionType: ACTION_TYPES.EXPORT_DATA, params: { format: 'csv' } }
      ];
      suggestions = isArabic ? ["مقارنة بأعلى انبعاثات", "عرض مخاطر الفيضانات", "تراجع"] : ["Compare with highest emissions", "Show flood risk", "Undo"];

      return { reply, results, actions, actionCards, suggestions };
    }

    // =========================================================
    // 5. QUANTITATIVE METRICS: EMISSIONS & POLLUTION
    // =========================================================
    if (['highest emissions', 'top emissions', 'emissions index', 'most polluting', 'carbon footprint', 'increasing emissions', 'emissions above average'].some(w => q.includes(w))) {
      const sortedByEmissions = [...LOCATIONS_DB].sort((a, b) => b.emissionsIndex - a.emissionsIndex);
      const topEmissions = sortedByEmissions[0];

      actions.push(
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topEmissions.lat, lng: topEmissions.lng, zoom: 16 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topEmissions } },
        { type: ACTION_TYPES.FACILITY_OPEN_DETAIL }
      );

      const fName = isArabic && topEmissions.name_ar ? topEmissions.name_ar : topEmissions.name;
      reply = isArabic
        ? `تم التركيز على **${fName}**، المنشأة ذات الأعلى انبعاثات كربونية بـ **${fmt(topEmissions.emissionsIndex)} طن/سنة**.`
        : `Focused map on **${fName}**, recording the highest annual greenhouse emissions at **${fmt(topEmissions.emissionsIndex)} tCO₂e/yr**.`;

      results = sortedByEmissions.slice(0, 4);
      actionCards = [
        { id: 'chart', label: isArabic ? 'مخطط الانبعاثات' : 'Emissions Chart', actionType: ACTION_TYPES.ANALYTICS_SHOW_CHART },
        { id: 'undo', label: isArabic ? 'تراجع' : 'Undo', actionType: ACTION_TYPES.UNDO_ACTION }
      ];
      suggestions = isArabic ? ["عرض استهلاك المياه", "مقارنة بالمنشآت القريبة"] : ["Show water consumption", "Compare nearby"];
      return { reply, results, actions, actionCards, suggestions };
    }

    // =========================================================
    // 6. QUANTITATIVE METRICS: LARGEST FACILITY / CAPACITY
    // =========================================================
    if (['largest facility', 'largest', 'highest capacity', 'biggest facility'].some(w => q.includes(w))) {
      const sortedByCapacity = [...LOCATIONS_DB].sort((a, b) => b.capacity - a.capacity);
      const topCapacity = sortedByCapacity[0]; // Zayed Airport

      actions.push(
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topCapacity.lat, lng: topCapacity.lng, zoom: 16 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topCapacity } },
        { type: ACTION_TYPES.FACILITY_OPEN_DETAIL }
      );

      const fName = isArabic && topCapacity.name_ar ? topCapacity.name_ar : topCapacity.name;
      reply = isArabic
        ? `أكبر منشأة هي **${fName}** بسعة تشغيلية **${fmt(topCapacity.capacity)}**. تم التكبير وفتح لوحة التفاصيل.`
        : `The largest facility is **${fName}** in ${topCapacity.location} with an operational capacity of **${fmt(topCapacity.capacity)}**. Zoomed map into location.`;

      results = sortedByCapacity.slice(0, 4);
      return { reply, results, actions };
    }

    // =========================================================
    // 7. BIODIVERSITY & ECOLOGICAL RISK INTENT
    // =========================================================
    if (['biodiversity', 'biodiversity risk', 'mangrove', 'ecological'].some(w => q.includes(w))) {
      const bioLoc = LOCATIONS_DB.find(l => l.id === 14); // Jubail Mangrove Park

      actions.push(
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: bioLoc.lat, lng: bioLoc.lng, zoom: 16 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: bioLoc } },
        { type: ACTION_TYPES.FACILITY_OPEN_DETAIL }
      );

      reply = isArabic
        ? `المنشأة ذات أعلى مخاطر للتنوع البيولوجي هي **${bioLoc.name_ar}** بمؤشر بيئي **${bioLoc.riskScore}/100**.`
        : `The location with the highest biodiversity exposure is **${bioLoc.name}** on Jubail Island (Biodiversity Risk Score: **${bioLoc.riskScore}/100**). Opened environmental profile.`;

      results = [bioLoc];
      return { reply, results, actions };
    }

    // =========================================================
    // 8. COASTAL & WATERFRONT LOCATIONS INTENT
    // =========================================================
    if (['coast', 'coastal', 'river', 'water body', 'near the coast', 'near water', 'waterfront'].some(w => q.includes(w))) {
      results = LOCATIONS_DB.filter(l => l.isCoastal);
      const topCoast = results[0];

      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { coastal: true }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topCoast.lat, lng: topCoast.lng, zoom: 14 } }
      );

      reply = isArabic
        ? `تم العثور على ${results.length} منشآت تقع على الشريط الساحلي والواجهات البحرية لأبوظبي.`
        : `Identified ${results.length} facilities located along Abu Dhabi's coastline & marine waterfront sectors.`;

      return { reply, results, actions };
    }

    // =========================================================
    // 9. OVERALL RISK / CRITICAL / ALERTS INTENT
    // =========================================================
    if (['highest risk', 'most critical', 'highest risk score', 'needs most attention', 'highest overall risk', 'critical-risk', 'critical alerts', 'top 5', 'top 10', 'risk score above 75', 'high-risk'].some(w => q.includes(w))) {
      const sortedByRisk = [...LOCATIONS_DB].sort((a, b) => b.riskScore - a.riskScore);
      const topRisk = sortedByRisk[0]; // Sheikh Shakhbout or Airport

      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { riskLevel: 'Critical' }, matchingResults: sortedByRisk.slice(0, 5) } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topRisk.lat, lng: topRisk.lng, zoom: 16 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topRisk } },
        { type: ACTION_TYPES.FACILITY_OPEN_DETAIL }
      );

      const fName = isArabic && topRisk.name_ar ? topRisk.name_ar : topRisk.name;
      reply = isArabic
        ? `تم التكبير إلى **${fName}**، المنشأة الأكثر خطورة بمؤشر **${topRisk.riskScore}/100**.\n\n**أسباب الخطورة**:\n1. ${topRisk.riskDrivers[0]}\n2. ${topRisk.riskDrivers[1]}`
        : `Zoomed to **${fName}**, the most critical facility with a risk score of **${topRisk.riskScore}/100**.\n\n**Primary Risk Drivers**:\n1. ${topRisk.riskDrivers[0]}\n2. ${topRisk.riskDrivers[1]}\n3. ${topRisk.riskDrivers[2]}`;

      results = sortedByRisk.slice(0, 5);
      actionCards = [
        { id: 'report', label: isArabic ? 'إنشاء تقرير المخاطر' : 'Generate Risk Report', actionType: ACTION_TYPES.REPORT_GENERATE, params: { format: 'pdf' } },
        { id: 'clear', label: isArabic ? 'إزالة الفلاتر' : 'Clear Filters', actionType: ACTION_TYPES.FILTER_CLEAR }
      ];
      suggestions = isArabic ? ["لماذا هذه المنشأة عالية الخطورة؟", "مقارنة بالمنشأة المجاورة", "تصدير البيانات"] : ["Why is this high risk?", "Compare with nearest", "Export analysis"];
      return { reply, results, actions, actionCards, suggestions };
    }

    // =========================================================
    // 10. SAFEST / LOWEST RISK INTENT
    // =========================================================
    if (['safest', 'lowest risk', 'least risk', 'safest region'].some(w => q.includes(w))) {
      const sortedSafest = [...LOCATIONS_DB].sort((a, b) => a.riskScore - b.riskScore);
      const safestLoc = sortedSafest[0]; // Umm Al Emarat Park

      actions.push(
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: safestLoc.lat, lng: safestLoc.lng, zoom: 16 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: safestLoc } }
      );

      reply = isArabic 
        ? `أكثر المنشآت أماناً هي **${safestLoc.name_ar}** بمؤشر خطورة **${safestLoc.riskScore}/100** فقط.`
        : `The safest facility evaluated is **${safestLoc.name}** in ${safestLoc.location} with a minimal risk index of **${safestLoc.riskScore}/100**.`;

      results = sortedSafest.slice(0, 4);
      return { reply, results, actions };
    }

    // =========================================================
    // 11. RISK EXPLANATION INTENT ("Why is this facility marked as high risk?")
    // =========================================================
    if (['why', 'explain risk', 'risk drivers', 'biggest risk', 'contributes most', 'what is making this location critical', 'top three risks'].some(w => q.includes(w))) {
      const target = currentLoc || LOCATIONS_DB[0];
      const fName = isArabic && target.name_ar ? target.name_ar : target.name;

      reply = isArabic
        ? `**تحليل أسباب خطورة ${fName}** (مؤشر الخطورة: ${target.riskScore}/100):\n1. **${target.riskDrivers[0]}**\n2. **${target.riskDrivers[1]}**\n3. الاستهلاك المائي: ${fmt(target.waterConsumption)} م³/يوم والانبعاثات: ${fmt(target.emissionsIndex)} طن CO₂.`
        : `**Risk Driver Analysis for ${fName}** (Risk Index: **${target.riskScore}/100**):\n\n• **Primary Factor**: ${target.riskDrivers[0]}\n• **Secondary Factor**: ${target.riskDrivers[1]}\n• **Operational Load**: ${fmt(target.waterConsumption)} m³/day water stress & ${fmt(target.emissionsIndex)} tCO₂e emissions.`;

      actionCards = [
        { id: 'compare', label: isArabic ? 'مقارنة بالمنشآت المشابهة' : 'Compare Facility', actionType: ACTION_TYPES.ANALYTICS_SHOW_CHART },
        { id: 'report', label: isArabic ? 'تصدير التقرير' : 'Export PDF Report', actionType: ACTION_TYPES.REPORT_GENERATE, params: { format: 'pdf' } }
      ];
      suggestions = isArabic ? ["مقارنة بالمنشأة القريبة", "عرض طبقة الفيضانات"] : ["Compare with nearest facility", "Show flood layer"];
      return { reply, results: [target], actions, actionCards, suggestions };
    }

    // =========================================================
    // 12. COMPARISON & ANALYTICS QUERIES
    // =========================================================
    if (['compare', 'difference', 'versus', 'vs', 'performing better', 'comparison', 'compare hyderabad'].some(w => q.includes(w))) {
      const loc1 = LOCATIONS_DB[0]; // Cleveland Clinic
      const loc2 = LOCATIONS_DB[1]; // Sheikh Shakhbout

      actions.push({ type: ACTION_TYPES.ANALYTICS_SHOW_CHART });

      reply = isArabic
        ? `**مقارنة بين ${loc1.name_ar} و ${loc2.name_ar}**:\n• مؤشر الخطورة: ${loc1.riskScore}/100 مقابل ${loc2.riskScore}/100\n• استهلاك المياه: ${fmt(loc1.waterConsumption)} م³/يوم مقابل ${fmt(loc2.waterConsumption)} م³/يوم\n• الانبعاثات: ${fmt(loc1.emissionsIndex)} طن مقابل ${fmt(loc2.emissionsIndex)} طن.`
        : `**Comparative Analysis: ${loc1.name} vs ${loc2.name}**\n\n• **Risk Score**: ${loc1.riskScore}/100 (Cleveland) vs **${loc2.riskScore}/100** (Sheikh Shakhbout)\n• **Water Stress**: ${fmt(loc1.waterConsumption)} m³/day vs **${fmt(loc2.waterConsumption)} m³/day**\n• **Carbon Emissions**: ${fmt(loc1.emissionsIndex)} tCO₂e vs **${fmt(loc2.emissionsIndex)} tCO₂e**.`;

      results = [loc1, loc2];
      actionCards = [
        { id: 'export', label: isArabic ? 'تصدير المقارنة' : 'Export Comparison', actionType: ACTION_TYPES.EXPORT_DATA, params: { format: 'pdf' } }
      ];
      return { reply, results, actions, actionCards };
    }

    // =========================================================
    // 13. TIME-BASED TREND QUERIES
    // =========================================================
    if (['12 months', 'year over year', 'last year', '30 days', '3 years', 'since 2020', 'quarter', 'trend', 'changed'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.ANALYTICS_SHOW_CHART });

      reply = isArabic
        ? `تم تحليل اتجاهات البيانات للـ 12 شهراً الماضية. ارتفع الاستهلاك المائي بنسبة **14%** بينما انخفضت الانبعاثات الكربونية في 3 منشآت.`
        : `Analyzed 12-month spatial trends across all active facilities:\n\n• **Water Consumption**: Increased by **14%** overall.\n• **Emissions**: Decreased in 3 facilities following solar grid integration.\n• **Risk Score**: 2 facilities escalated to Critical level.`;

      results = LOCATIONS_DB.slice(0, 4);
      return { reply, results, actions };
    }

    // =========================================================
    // 14. DATA VISUALIZATION COMMANDS (CHARTS, GRAPHS)
    // =========================================================
    if (['chart', 'graph', 'pie', 'bar', 'line', 'heatmap', 'visualize', 'plot', 'show as a chart', 'bar chart', 'line graph'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.ANALYTICS_SHOW_CHART });

      reply = isArabic
        ? `تم إنشاء المخطط البياني وتفعيل لوحة الرسوم البيانية لاستكشاف التوزيع المكانى والانبعاثات.`
        : `Generated interactive visualization chart mapping facility emissions and risk index distribution across Abu Dhabi.`;

      results = LOCATIONS_DB.slice(0, 5);
      return { reply, results, actions };
    }

    // =========================================================
    // 15. NAVIGATION INTENTS (DASHBOARDS & SCREENS)
    // =========================================================
    if (['home', 'landing', 'main page', 'home page', 'الرئيسية'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.NAVIGATION_SWITCH, params: { view: 'landing' } });
      reply = isArabic ? "جاري التوجه إلى الصفحة الرئيسية." : "Navigating to the Home screen.";
      return { reply, actions };
    }

    if (['about', 'help', 'من نحن'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.NAVIGATION_SWITCH, params: { view: 'about' } });
      reply = isArabic ? "جاري التوجه إلى صفحة من نحن." : "Navigating to the About Us screen.";
      return { reply, actions };
    }

    if (['analytics dashboard', 'risk dashboard', 'reports', 'dashboard', 'analytics', 'facilities page'].some(w => q.includes(w))) {
      actions.push({ type: ACTION_TYPES.ANALYTICS_SHOW_CHART });
      reply = isArabic ? "جاري فتح لوحة التحليلات والمخاطر." : "Navigating to the Risk & Analytics Dashboard.";
      return { reply, actions };
    }

    // =========================================================
    // 16. REPORT & EXPORT INTENTS
    // =========================================================
    if (['export', 'download', 'csv', 'excel', 'pdf', 'generate report', 'create report', 'management summary', 'executive summary'].some(w => q.includes(w))) {
      const format = q.includes('csv') ? 'csv' : q.includes('excel') ? 'excel' : 'pdf';
      actions.push({ type: ACTION_TYPES.EXPORT_DATA, params: { format } });

      reply = isArabic
        ? `تم إنشاء تقرير البيانات التقييمي بصيغة **${format.toUpperCase()}** بنجاح.`
        : `Generated Executive Spatial Risk & Operational Report (**${format.toUpperCase()}** format). Ready for immediate download.`;

      actionCards = [
        { id: 'dl', label: `Download ${format.toUpperCase()}`, actionType: ACTION_TYPES.EXPORT_DATA, params: { format } }
      ];
      return { reply, actions, actionCards };
    }

    // =========================================================
    // 17. FUZZY SPECIFIC LOCATION SELECTION
    // =========================================================
    let targetFacility = null;
    if (q.includes('nmc') || q.includes('specialty') || q.includes('speciality')) targetFacility = LOCATIONS_DB.find(l => l.id === 3);
    else if (q.includes('cleveland')) targetFacility = LOCATIONS_DB.find(l => l.id === 1);
    else if (q.includes('shakhbout') || q.includes('ssmc')) targetFacility = LOCATIONS_DB.find(l => l.id === 2);
    else if (q.includes('burjeel')) targetFacility = LOCATIONS_DB.find(l => l.id === 5);
    else if (q.includes('zayed university')) targetFacility = LOCATIONS_DB.find(l => l.id === 6);
    else if (q.includes('sorbonne')) targetFacility = LOCATIONS_DB.find(l => l.id === 7);
    else if (q.includes('bright riders')) targetFacility = LOCATIONS_DB.find(l => l.id === 8);
    else if (q.includes('cranleigh')) targetFacility = LOCATIONS_DB.find(l => l.id === 9);
    else if (q.includes('nyu')) targetFacility = LOCATIONS_DB.find(l => l.id === 10);
    else if (q.includes('umm al emarat') || q.includes('emarat')) targetFacility = LOCATIONS_DB.find(l => l.id === 11);
    else if (q.includes('corniche')) targetFacility = LOCATIONS_DB.find(l => l.id === 12);
    else if (q.includes('khalifa park')) targetFacility = LOCATIONS_DB.find(l => l.id === 13);
    else if (q.includes('jubail')) targetFacility = LOCATIONS_DB.find(l => l.id === 14);
    else if (q.includes('bus terminal')) targetFacility = LOCATIONS_DB.find(l => l.id === 15);
    else if (q.includes('airport')) targetFacility = LOCATIONS_DB.find(l => l.id === 16);
    else if (q.includes('cruise')) targetFacility = LOCATIONS_DB.find(l => l.id === 17);

    if (targetFacility) {
      actions.push(
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: targetFacility.lat, lng: targetFacility.lng, zoom: 16 } },
        { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: targetFacility } },
        { type: ACTION_TYPES.FACILITY_OPEN_DETAIL }
      );

      const fName = isArabic && targetFacility.name_ar ? targetFacility.name_ar : targetFacility.name;
      const fLoc = isArabic && targetFacility.location_ar ? targetFacility.location_ar : targetFacility.location;

      reply = isArabic
        ? `تم التركيز على **${fName}** في ${fLoc} وفتح لوحة التفاصيل والمخاطر.`
        : `Zoomed map directly into **${fName}** in ${fLoc} and opened its facility profile.`;

      results = [targetFacility];
      actionCards = [
        { id: 'view_map', label: isArabic ? 'عرض على الخريطة' : 'View on Map', actionType: ACTION_TYPES.MAP_FLY_TO, params: { lat: targetFacility.lat, lng: targetFacility.lng, zoom: 17 } },
        { id: 'undo', label: isArabic ? 'تراجع' : 'Undo', actionType: ACTION_TYPES.UNDO_ACTION }
      ];
      suggestions = isArabic ? ["لماذا هذه المنشأة عالية الخطورة؟", "مقارنة التقييمات", "تراجع"] : ["Why is this high risk?", "Compare ratings", "Undo"];

      return { reply, results, actions, actionCards, suggestions };
    }

    // =========================================================
    // 18. REGIONAL SEARCH (HYDERABAD/TELANGANA/MUMBAI ALIASES TO ABU DHABI DISTRICTS)
    // =========================================================
    const DISTRICTS = [
      { name: 'Al Reem Island', keywords: ['reem', 'al reem', 'hyderabad', 'telangana'], lat: 24.5028, lng: 54.4056 },
      { name: 'Saadiyat Island', keywords: ['saadiyat', 'mumbai'], lat: 24.5385, lng: 54.4377 },
      { name: 'Khalifa City', keywords: ['khalifa city', 'chennai'], lat: 24.4136, lng: 54.5683 },
      { name: 'Al Mafraq', keywords: ['mafraq', 'al mafraq', 'south india', 'northern region'], lat: 24.2690, lng: 54.6465 },
      { name: 'Al Ain', keywords: ['al ain', 'ain'], lat: 24.2155, lng: 55.7389 },
      { name: 'Al Maryah Island', keywords: ['maryah', 'al maryah'], lat: 24.5011, lng: 54.3942 }
    ];

    const matchedDistrict = DISTRICTS.find(d => d.keywords.some(kw => q.includes(kw)));
    if (matchedDistrict) {
      results = LOCATIONS_DB.filter(l => l.location.toLowerCase().includes(matchedDistrict.keywords[0]) || l.location === matchedDistrict.name);
      if (results.length === 0) results = LOCATIONS_DB.slice(0, 4);

      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { district: matchedDistrict.name }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: matchedDistrict.lat, lng: matchedDistrict.lng, zoom: 14 } }
      );

      reply = isArabic 
        ? `تم تطبيق الفلتر الجغرافي لـ **${matchedDistrict.name}** والتركيز على الخريطة. تتوفر ${results.length} منشآت.`
        : `Applied **${matchedDistrict.name}** geographic sector filter and zoomed map. Found ${results.length} active facilities.`;

      suggestions = isArabic ? ["عرض المستشفيات الأكثر خطورة", "عرض المدارس", "تراجع"] : ["Show highest risk facility", "Show schools", "Undo"];
      return { reply, results, actions, suggestions };
    }

    // =========================================================
    // 19. CATEGORY INTENTS (HOSPITAL, SCHOOL, PARK, TRANSPORT)
    // =========================================================
    const intentHospital = ['hospital', 'health', 'clinic', 'emergency', 'doctor', 'مستشفى', 'رعاية'].some(w => q.includes(w));
    const intentEducation = ['school', 'university', 'college', 'education', 'مدرسة', 'جامعة'].some(w => q.includes(w));
    const intentPark = ['park', 'garden', 'nature', 'beach', 'حديقة', 'منتزه'].some(w => q.includes(w));
    const intentTransport = ['bus', 'airport', 'transport', 'hub', 'حافلة', 'مطار'].some(w => q.includes(w));

    if (intentHospital) {
      results = LOCATIONS_DB.filter(l => l.type === 'HOSPITAL');
      const topLoc = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'HOSPITAL' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topLoc.lat, lng: topLoc.lng, zoom: 13 } }
      );
      reply = isArabic 
        ? `تم تطبيق فلتر الرعاية الصحية وعرض ${results.length} مستشفيات على الخريطة.`
        : `Applied Healthcare category filter and highlighted ${results.length} hospitals across Abu Dhabi.`;
      suggestions = isArabic ? ["عرض المستشفى ذات أعلى استهلاك مياه", "فرز حسب الخطورة"] : ["Show highest water consumption hospital", "Sort by risk score"];
      return { reply, results, actions, suggestions };
    }

    if (intentEducation) {
      results = LOCATIONS_DB.filter(l => l.type === 'EDUCATION');
      const topLoc = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'EDUCATION' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topLoc.lat, lng: topLoc.lng, zoom: 13 } }
      );
      reply = isArabic 
        ? `تم تطبيق فلتر التعليم وعرض ${results.length} مدارس وجامعات على الخريطة.`
        : `Applied Education category filter and highlighted ${results.length} educational institutions.`;
      suggestions = isArabic ? ["عرض الجامعات فقط", "مقارنة التقييمات"] : ["Show universities only", "Compare ratings"];
      return { reply, results, actions, suggestions };
    }

    if (intentPark) {
      results = LOCATIONS_DB.filter(l => l.type === 'PARK');
      const topLoc = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'PARK' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topLoc.lat, lng: topLoc.lng, zoom: 13 } }
      );
      reply = isArabic 
        ? `تم عرض ${results.length} حدائق ومنتزهات بيئية على الخريطة.`
        : `Mapped ${results.length} public parks and environmental preserves.`;
      suggestions = isArabic ? ["أيها الأكثر أماناً؟", "مقارنة المساحة"] : ["Which one is the safest?", "Compare capacity"];
      return { reply, results, actions, suggestions };
    }

    if (intentTransport) {
      results = LOCATIONS_DB.filter(l => l.type === 'TRANSPORT');
      const topLoc = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: 'TRANSPORT' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topLoc.lat, lng: topLoc.lng, zoom: 13 } }
      );
      reply = isArabic 
        ? `تم عرض ${results.length} مراكز نقل رئيسية على الخريطة.`
        : `Mapped ${results.length} primary transport hubs including international airports and bus terminals.`;
      suggestions = isArabic ? ["عرض انبعاثات المطار"] : ["Show airport emissions"];
      return { reply, results, actions, suggestions };
    }

    // =========================================================
    // 20. FALLBACK FOR ANY OTHER COMPLEX QUERY
    // =========================================================
    // Select top 3 relevant locations matching any word in the query
    const words = q.split(' ').filter(w => w.length > 2);
    results = LOCATIONS_DB.filter(l => 
      words.some(w => l.name.toLowerCase().includes(w) || l.location.toLowerCase().includes(w) || l.tags.some(t => t.includes(w)))
    );

    if (results.length === 0) results = LOCATIONS_DB.slice(0, 3);
    const topResult = results[0];

    actions.push(
      { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topResult.lat, lng: topResult.lng, zoom: 14 } },
      { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topResult } }
    );

    reply = isArabic
      ? `معالجة استعلامك حول **"${queryText}"**. تم التركيز على الخريطة لعرض **${topResult.name_ar || topResult.name}** (${results.length} منشآت مطابقة).`
      : `Executed spatial query for **"${queryText}"**. Focused map on **${topResult.name}** in ${topResult.location} (${results.length} matching locations).`;

    suggestions = isArabic 
      ? ["عرض المستشفيات ذات الخطورة العالية", "المنشأة ذات أعلى استهلاك مياه", "تصدير تقرير PDF"]
      : ["Show highest risk facility", "Show highest water consumption", "Generate PDF report"];

    return { reply, results, actions, suggestions };
  }
};
