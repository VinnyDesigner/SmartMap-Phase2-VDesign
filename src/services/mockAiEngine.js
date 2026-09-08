// Universal AI Application Controller & Natural Language Agent for GeoVision / SmartMap
import { ACTION_TYPES } from './actionRegistry';
import { aiOrchestrator } from './ai/aiOrchestrator';
import { matchKnowledgeBaseQuery } from './ai/aiKnowledgeBase';
import { parseQueryIntent } from './ai/queryIntentResolver';
import { filterByCompoundPredicates, calculateGeodesicDistance } from './spatial/spatialAnalysisService';
import { routingService } from './routing/routingService';

// Clean raw markdown formatting characters (e.g. **) from text for clean UI rendering
export function sanitizeMarkdown(text) {
  if (!text) return '';
  return text.replace(/\*\*/g, '').replace(/###\s*/g, '').trim();
}

// Rich Multi-Theme Abu Dhabi Dataset with Real Coordinates & Quantitative Attributes
export const LOCATIONS_DB = [
  // TOURISM & CULTURAL LANDMARKS
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
    riskLevel: 'Low',
    riskScore: 34,
    waterConsumption: 14200,
    emissionsIndex: 28000,
    capacity: 15000,
    trend: 'stable',
    isCoastal: true,
    hasAlerts: false,
    description: 'Iconic universal museum displaying global art and artifacts under Jean Nouvel’s rain-of-light dome.',
    description_ar: 'متحف عالمي بارز يعرض الأعمال الفنية والتاريخية تحت قبة النور المعمارية.',
    tags: ['tourism', 'museum', 'louvre', 'saadiyat', 'art', 'culture', 'waterfront', 'landmark']
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
    riskLevel: 'Low',
    riskScore: 28,
    waterConsumption: 16800,
    emissionsIndex: 22000,
    capacity: 12000,
    trend: 'stable',
    isCoastal: true,
    hasAlerts: false,
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
    riskLevel: 'Low',
    riskScore: 15,
    waterConsumption: 19800,
    emissionsIndex: 14000,
    capacity: 40000,
    trend: 'stable',
    isCoastal: false,
    hasAlerts: false,
    description: 'Monumental architectural masterpiece and primary cultural landmark of Abu Dhabi.',
    description_ar: 'صرح معماري إسلامي عالمي بارز يعتبر المعلم الديني والثقافي الأكبر في الإمارة.',
    tags: ['tourism', 'mosque', 'sheikh zayed', 'grand mosque', 'heritage', 'landmark']
  },

  // GOVERNMENT FACILITIES & CIVIC SERVICES
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
    trend: 'improving',
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
    waterConsumption: 4800,
    emissionsIndex: 9500,
    capacity: 3500,
    trend: 'improving',
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
    riskLevel: 'Low',
    riskScore: 28,
    waterConsumption: 4100,
    emissionsIndex: 9500,
    capacity: 2500,
    trend: 'improving',
    description: 'Central municipal hub managing urban planning, building permits, and public land GIS registries.',
    description_ar: 'المركز الرئيسي لخدمات البلدية والمعني بالتخطيط العمراني وتصاريح الأراضي.',
    tags: ['government', 'municipality', 'permits', 'urban planning', 'zahiyah']
  },

  // CIVIC INFRASTRUCTURE & UTILITIES
  {
    id: 901,
    name: 'Al Taweelah Power & Desalination Complex',
    name_ar: 'مجمّع الطويلة للطاقة وتحلية المياه',
    type: 'CIVIC_INFRASTRUCTURE',
    category_en: 'Civic Utility',
    category_ar: 'بنية تحتية للمرافق',
    location: 'Al Taweelah',
    location_ar: 'الطويلة',
    district: 'Al Taweelah',
    lat: 24.7810,
    lng: 54.7120,
    rating: 4.8,
    riskLevel: 'High',
    riskScore: 84,
    waterConsumption: 180000,
    emissionsIndex: 125000,
    capacity: 900000,
    trend: 'stable',
    isCoastal: true,
    hasAlerts: true,
    description: 'Major desalinated water supply and power generation facility powering Abu Dhabi Emirate.',
    description_ar: 'المجمع الرئيسي لإمدادات المياه المحلاة وتوليد الطاقة لإمارة أبوظبي.',
    tags: ['civic_infrastructure', 'utilities', 'water', 'desalination', 'power', 'taweelah', 'critical']
  },
  {
    id: 902,
    name: 'Mussafah Eco & Waste Recycling Complex',
    name_ar: 'مجمع مصفح البيئي وإعادة التدوير',
    type: 'CIVIC_INFRASTRUCTURE',
    category_en: 'Civic Utility',
    category_ar: 'بنية تحتية للمرافق',
    location: 'Mussafah Industrial',
    location_ar: 'مصفح الصناعية',
    district: 'Mussafah',
    lat: 24.3450,
    lng: 54.5210,
    rating: 4.5,
    riskLevel: 'Moderate',
    riskScore: 68,
    waterConsumption: 12400,
    emissionsIndex: 42000,
    capacity: 15000,
    trend: 'stable',
    description: 'Civic environmental waste treatment and materials recovery facility in Mussafah.',
    description_ar: 'منشأة معالجة النفايات البيئية واستعادة المواد بمصفح.',
    tags: ['civic_infrastructure', 'waste', 'recycling', 'mussafah', 'environment']
  },

  // TRANSPORTATION & MOBILITY
  {
    id: 15,
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
    riskLevel: 'Moderate',
    riskScore: 62,
    waterConsumption: 4200,
    emissionsIndex: 34000,
    capacity: 25000,
    trend: 'stable',
    isCoastal: false,
    hasAlerts: false,
    description: 'Primary intercity transit hub connecting Abu Dhabi to regional municipal districts.',
    description_ar: 'المحطة الرئيسية للنقل العام والحافلات التي تربط مدينة أبوظبي بالمعالم الإقليمية.',
    tags: ['transport', 'transit', 'bus', 'nahyan', 'mobility']
  },
  {
    id: 16,
    name: 'Zayed International Airport Terminal Hub',
    name_ar: 'مركز مطار زايد الدولي',
    type: 'TRANSPORT',
    category_en: 'Mobility Terminal',
    category_ar: 'محطة نقل عام',
    location: 'Airport Sector',
    location_ar: 'قطاع المطار',
    district: 'Airport Sector',
    lat: 24.4329,
    lng: 54.6511,
    rating: 4.9,
    riskLevel: 'High',
    riskScore: 82,
    waterConsumption: 24000,
    emissionsIndex: 84000,
    capacity: 120000,
    trend: 'increasing',
    isCoastal: false,
    hasAlerts: true,
    description: 'State-of-the-art international aviation gateway connecting Abu Dhabi worldwide.',
    description_ar: 'المبنى الرئيسي لمطار زايد الدولي المربوط بالمحاور المكانية للإمارة.',
    tags: ['transport', 'airport', 'zayed int', 'aviation', 'mobility']
  },

  // PARKS & RECREATION
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
    riskLevel: 'Low',
    riskScore: 15,
    waterConsumption: 15400,
    emissionsIndex: 1200,
    capacity: 12000,
    trend: 'improving',
    isCoastal: false,
    hasAlerts: false,
    description: 'Historic public park featuring shade botanical gardens, shade structures, and eco-learning spaces.',
    description_ar: 'حديقة تاريخية بارزة تضم حدائق نباتية ومساحات بيئية خضراء مظللة.',
    tags: ['park', 'environment', 'umm al emarat', 'mushrif', 'green', 'recreation']
  },
  {
    id: 12,
    name: 'Yas Gateway Park',
    name_ar: 'حديقة ياس جيتواي',
    type: 'PARK',
    category_en: 'Public Park',
    category_ar: 'حديقة عامة ومحمية',
    location: 'Yas Island',
    location_ar: 'جزيرة ياس',
    district: 'Yas Island',
    lat: 24.4920,
    lng: 54.6020,
    rating: 4.8,
    riskLevel: 'Low',
    riskScore: 16,
    waterConsumption: 11200,
    emissionsIndex: 1500,
    capacity: 8000,
    trend: 'improving',
    isCoastal: true,
    hasAlerts: false,
    description: 'Lush green park situated at the entrance of Yas Island with shaded sports tracks.',
    description_ar: 'حديقة خضراء واسعة عند مدخل جزيرة ياس تتميز بمسارات رياضية مظللة.',
    tags: ['park', 'yas island', 'yas', 'green', 'recreation']
  }
];

export const mockAiEngine = {
  async processQuery(queryText, currentState = null, isArabic = false) {
    // 1. Check authoritative AI Knowledge Base dictionary first
    const kbMatch = matchKnowledgeBaseQuery(queryText, currentState, isArabic);
    if (kbMatch) {
      return kbMatch;
    }

    // 2. Delegate to modular GeoAI Orchestrator for open-ended queries
    const orchestratorResult = await aiOrchestrator.processUserQuery(queryText, currentState, isArabic, LOCATIONS_DB);
    if (orchestratorResult) return orchestratorResult;

    await new Promise(resolve => setTimeout(resolve, 350));

    const rawQ = queryText || '';
    const q = rawQ.toLowerCase().trim();
    let actions = [];
    let actionCards = [];
    let results = [];
    let reply = "";
    let suggestions = [];
    let chartData = null;

    // Reference location: user location or default Abu Dhabi center (24.4839, 54.3773)
    const userLat = currentState?.userLocation?.lat || 24.4839;
    const userLng = currentState?.userLocation?.lng || 54.3773;
    const userOrigin = { lat: userLat, lng: userLng };

    // Parse query intent & compound predicates
    const parsedIntent = parseQueryIntent(rawQ, currentState, isArabic);

    // =========================================================
    // 1. APP CONTROL COMMANDS
    // =========================================================
    if (parsedIntent && parsedIntent.type === 'APP_CONTROL') {
      if (parsedIntent.action === 'CHANGE_THEME') {
        const theme = parsedIntent.params.theme;
        actions.push({ type: 'CHANGE_THEME', params: { theme } });
        reply = isArabic 
          ? `تم تغيير مظهر التطبيق بالكامل إلى ${theme === 'dark' ? 'الوضع الداكن 🌙' : 'الوضع الفاتح ☀️'}` 
          : `Switched application color theme to ${theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`;
        return { reply, actions };
      }

      if (parsedIntent.action === 'CHANGE_BASEMAP') {
        const basemapId = parsedIntent.params.basemapId;
        actions.push({ type: ACTION_TYPES.MAP_SET_BASEMAP, params: { basemapId } });
        reply = isArabic 
          ? `تم تغيير الخريطة الأساسية إلى **${basemapId}** بنجاح. 🗺️` 
          : `Switched active map view to **${basemapId.toUpperCase()}** basemap. 🗺️`;
        return { reply, actions };
      }

      if (parsedIntent.action === 'CHANGE_LANGUAGE') {
        const lang = parsedIntent.params.lang;
        actions.push({ type: ACTION_TYPES.LANGUAGE_SET, params: { lang } });
        reply = lang === 'ar' ? "تم تحويل لغة التطبيق إلى اللغة العربية (RTL) بنجاح 🇦🇪" : "Switched application language to English 🇬🇧";
        return { reply, actions };
      }

      if (parsedIntent.action === 'NAVIGATE') {
        const view = parsedIntent.params.view;
        actions.push({ type: ACTION_TYPES.NAVIGATION_SWITCH, params: { view } });
        reply = isArabic ? "جاري الانتقال إلى الصفحة المطلوبة... 🚀" : `Navigating to ${view.toUpperCase()} screen... 🚀`;
        return { reply, actions };
      }

      if (parsedIntent.action === 'PRINT_MAP') {
        actions.push({ type: ACTION_TYPES.REPORT_GENERATE, params: { type: 'map-print' } });
        reply = isArabic ? "جاري فتح نموذج الطباعة المخصص الخريطة والتحليلات... 🖨️" : "Opening map-centric print layout... 🖨️";
        return { reply, actions };
      }
    }

    // =========================================================
    // 2. DIRECTIONS / ROUTING INTERFACE (EXTENSIBLE & SAFE)
    // =========================================================
    if (parsedIntent && parsedIntent.type === 'DIRECTIONS') {
      const dest = parsedIntent.target || currentState?.selectedLocation || LOCATIONS_DB[0];
      const routeCheck = await routingService.calculateRoute(userOrigin, dest);

      const destName = isArabic && dest.name_ar ? dest.name_ar : dest.name;
      const dist = calculateGeodesicDistance(userLat, userLng, dest.lat, dest.lng);

      if (!routeCheck.available) {
        reply = isArabic
          ? `⚠️ **حالة خدمة الاتجاهات والمسارات**:\n${routeCheck.message_ar}\n\nالموقع المحدد: **${destName}** (يبعد مسافة هوائية قدرها **${dist} كم**). تم التركيز على الموقع في الخريطة دون رسم مسارات وهمية.`
          : `⚠️ **Routing Service Notice**:\n${routeCheck.message}\n\nTarget location: **${destName}** (approx **${dist} km** geodesic distance). Map focused on the target facility without fabricating unverified route lines.`;
      }

      actions.push({ type: ACTION_TYPES.MAP_FLY_TO, params: { lat: dest.lat, lng: dest.lng, zoom: 15 } });
      return { reply, results: [dest], actions };
    }

    // =========================================================
    // 3. ANALYTICS ON EXPLICIT REQUEST ONLY
    // =========================================================
    if (parsedIntent && parsedIntent.type === 'ANALYTICS') {
      const activeList = (currentState?.activeContext?.activeLocations || LOCATIONS_DB).slice(0, 4);

      if (parsedIntent.metric === 'emissions') {
        chartData = {
          id: 'comp-' + Date.now(),
          title: isArabic ? "مقارنة مؤشر الانبعاثات التقديري (طن كربون/سنة)" : "Comparative Emissions Index (tCO2e/yr)",
          type: 'bar',
          data: activeList.map(item => ({
            label: isArabic && item.name_ar ? item.name_ar : item.name,
            name: isArabic && item.name_ar ? item.name_ar : item.name,
            value: item.emissionsIndex || 15000,
            color: item.riskLevel === 'Critical' ? '#f43f5e' : item.riskLevel === 'High' ? '#f59e0b' : '#3b82f6'
          }))
        };
        reply = isArabic ? "تم إنشاء الرسم البياني التفاعلي للمقارنة بناءً على طلبك:" : "Generated interactive comparative graph upon your explicit request:";
        return { reply, chartData, results: activeList };
      }

      if (parsedIntent.metric === 'water') {
        chartData = {
          id: 'trend-' + Date.now(),
          title: isArabic ? "اتجاه الاستهلاك السنوي للمياه (م³/يوم)" : "Annual Water Consumption Trend (m³/day)",
          type: 'line',
          data: [{ label: 'Q1', value: 8500 }, { label: 'Q2', value: 11200 }, { label: 'Q3', value: 14800 }, { label: 'Q4', value: 12100 }]
        };
        reply = isArabic ? "تم إنشاء رسم بياني لاتجاه الاستهلاك بناءً على طلبك:" : "Generated consumption trend line chart upon explicit request:";
        return { reply, chartData };
      }
    }

    // =========================================================
    // 4. PROXIMITY RANKING ("Which one is closest?")
    // =========================================================
    if (parsedIntent && parsedIntent.type === 'PROXIMITY_RANK') {
      const activeList = currentState?.activeContext?.activeLocations || LOCATIONS_DB;
      results = filterByCompoundPredicates(activeList, {}, userOrigin);

      const topMatch = results[0];
      if (topMatch) {
        actions.push(
          { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topMatch } },
          { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topMatch.lat, lng: topMatch.lng, zoom: 16 } }
        );
      }

      const matchName = isArabic && topMatch.name_ar ? topMatch.name_ar : topMatch.name;
      reply = isArabic
        ? `بناءً على نتائج البحث الحالية وموقعك الجغرافي، **${matchName}** هي المنشأة الأقرب على بعد **${topMatch.distanceKm} كم**.`
        : `Based on your current active results set, **${matchName}** is the closest facility, located approximately **${topMatch.distanceKm} km** away.`;

      return { reply, results, actions, activeContext: { ...currentState?.activeContext, selectedFeature: topMatch } };
    }

    // =========================================================
    // 5. STRICT COMPOUND SPATIAL SEARCH WITH ZERO FABRICATION
    // =========================================================
    if (parsedIntent && parsedIntent.type === 'SPATIAL_SEARCH') {
      results = filterByCompoundPredicates(LOCATIONS_DB, parsedIntent, userOrigin);

      // Handle Zero-Results State for Compound Queries (e.g. Telangana or impossible predicates)
      if (results.length === 0) {
        reply = isArabic
          ? `⚠️ **لم يتم العثور على أي نتائج مطابقة لاشتراطات البحث الحالي.**\nالمنطقة أو الفئة المحددة (${parsedIntent.region || 'المنطقة المطلوبة'}) لا تحتوي على معالم مكانية مسجلة في البنية المكانية الحالية لـ SDI.`
          : `⚠️ **No matching facilities were found.**\nNone of the registered spatial infrastructure features satisfied all your query predicates (${parsedIntent.region ? `Region: ${parsedIntent.region}` : ''} ${parsedIntent.category ? `Category: ${parsedIntent.category}` : ''} ${parsedIntent.riskLevel ? `Risk: ${parsedIntent.riskLevel}` : ''}).`;

        suggestions = isArabic
          ? ["عرض المنشآت الحكومية بالقرب مني", "تعديل الاستعلام", "توسيع نطاق البحث"]
          : ["Show government facilities near me", "Edit query", "Expand search radius"];

        actionCards = [
          { title: "Show government facilities near me", actionType: 'SEARCH_SUBMIT', params: { query: "Show government facilities near me" } }
        ];

        return { reply, results: [], suggestions, actionCards, datasetsUsed: ['DGE Spatial SDI 2026'] };
      }

      // Valid Results Returned
      const topItem = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: parsedIntent.category || 'ALL' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topItem.lat, lng: topItem.lng, zoom: 14 } }
      );

      const catLabel = isArabic 
        ? (parsedIntent.category === 'GOVERNMENT' ? 'منشآت ومراكز خدمات حكومية' : parsedIntent.category === 'PARK' ? 'حدائق ومحميات' : 'منشآت مكانية')
        : (parsedIntent.category ? `${parsedIntent.category.toLowerCase()} facilities` : 'spatial facilities');

      reply = isArabic
        ? `تم العثور على ${results.length} ${catLabel} مرتبة من الأقرب إلى الأبعد:`
        : `Identified ${results.length} ${catLabel} ordered by proximity (closest to furthest):`;

      const datasetsUsed = ['DGE Spatial SDI 2026', 'Abu Dhabi Master SDI Spatial Layer'];
      const activeContextTags = [
        { id: 'count', label: isArabic ? `${results.length} نتائج` : `${results.length} Results`, icon: '📊' },
        { id: 'sort', label: isArabic ? 'الأقرب أولاً' : 'Nearest First', icon: '📏' }
      ];

      suggestions = isArabic
        ? ["أيها الأقرب لي؟", "اعرض الاتجاهات", "قارن هذه المنشآت"]
        : ["Which one is closest?", "Show me directions", "Compare these facilities"];

      return {
        reply,
        results,
        actions,
        suggestions,
        datasetsUsed,
        activeContextTags,
        activeContext: { category: parsedIntent.category, activeLocations: results, selectedFeature: topItem }
      };
    }

    // Default Fallback
    results = filterByCompoundPredicates(LOCATIONS_DB, {}, userOrigin).slice(0, 5);
    reply = isArabic
      ? `تم تنفيذ الاستعلام المكاني وحصر ${results.length} نتائج مرتبة حسب القرب الجغرافي:`
      : `Executed spatial query and retrieved ${results.length} matching locations ordered by proximity:`;

    return {
      reply,
      results,
      actions: [{ type: ACTION_TYPES.MAP_FLY_TO, params: { lat: results[0].lat, lng: results[0].lng, zoom: 14 } }],
      datasetsUsed: ['DGE Spatial SDI 2026']
    };
  }
};
