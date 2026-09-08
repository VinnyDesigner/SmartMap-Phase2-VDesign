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
    tags: ['education', 'university', 'sorbonne', 'reem']
  }
];

export const mockAiEngine = {
  async processQuery(queryText, currentState = null, isArabic = false) {
    const activeProject = currentState?.activeProject;
    const activeDataset = activeProject?.datasets || LOCATIONS_DB;

    // 1. Check authoritative AI Knowledge Base dictionary first
    const kbMatch = matchKnowledgeBaseQuery(queryText, currentState, isArabic);
    if (kbMatch) {
      return kbMatch;
    }

    // 2. Delegate to modular GeoAI Orchestrator for open-ended queries
    const orchestratorResult = await aiOrchestrator.processUserQuery(queryText, currentState, isArabic, activeDataset);
    if (orchestratorResult) return orchestratorResult;

    await new Promise(resolve => setTimeout(resolve, 300));

    const rawQ = queryText || '';
    let actions = [];
    let actionCards = [];
    let results = [];
    let reply = "";
    let suggestions = [];
    let chartData = null;

    // Reference location: user location or default project center
    const userLat = currentState?.userLocation?.lat || activeProject?.defaultCenter?.lat || 24.4839;
    const userLng = currentState?.userLocation?.lng || activeProject?.defaultCenter?.lng || 54.3773;
    const userOrigin = { lat: userLat, lng: userLng };

    // Parse query intent & compound predicates
    const parsedIntent = parseQueryIntent(rawQ, currentState, isArabic);

    // 1. APP CONTROL COMMANDS
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

    // 2. DIRECTIONS / ROUTING INTERFACE
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

    // 3. ANALYTICS ON EXPLICIT REQUEST ONLY
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
        return { reply, chartData, results: activeList, outputType: 'chart' };
      }
    }

    // 4. PROXIMITY RANKING ("Which one is closest?")
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
        ? `بناءً على نتائج البحث الحالية وموقعك الجغرافي، **${matchName}** هي المنشأة الأقرب على بعد **${topMatch.distanceKm || 1.2} كم**.`
        : `Based on your current active results set, **${matchName}** is the closest facility, located approximately **${topMatch.distanceKm || 1.2} km** away.`;

      return { reply, results, actions, activeContext: { ...currentState?.activeContext, selectedFeature: topMatch } };
    }

    // 5. STRICT COMPOUND SPATIAL SEARCH
    if (parsedIntent && parsedIntent.type === 'SPATIAL_SEARCH') {
      results = filterByCompoundPredicates(activeDataset, parsedIntent, userOrigin);

      if (results.length === 0) {
        reply = isArabic
          ? `⚠️ **لم يتم العثور على أي نتائج مطابقة لاشتراطات البحث الحالي.**`
          : `⚠️ **No matching facilities were found for your query.**`;

        suggestions = isArabic
          ? ["عرض المنشآت الحكومية بالقرب مني", "تعديل الاستعلام"]
          : ["Show government facilities near me", "Edit query"];

        return { reply, results: [], suggestions, datasetsUsed: ['DGE Spatial SDI 2026'] };
      }

      const topItem = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: parsedIntent.category || 'ALL' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topItem.lat, lng: topItem.lng, zoom: 14 } }
      );

      reply = isArabic
        ? `تم العثور على ${results.length} نتائج مرتبة حسب القرب الجغرافي:`
        : `Identified ${results.length} matching facilities ordered by proximity:`;

      suggestions = isArabic
        ? ["أيها الأقرب لي؟", "اعرض الاتجاهات", "ضع هذا في جدول"]
        : ["Which one is closest?", "Show me directions", "Put this in a table"];

      return {
        reply,
        results,
        actions,
        suggestions,
        datasetsUsed: ['DGE Spatial SDI 2026'],
        activeContext: { category: parsedIntent.category, activeLocations: results, selectedFeature: topItem }
      };
    }

    // Default Fallback
    results = filterByCompoundPredicates(activeDataset, {}, userOrigin).slice(0, 5);
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
