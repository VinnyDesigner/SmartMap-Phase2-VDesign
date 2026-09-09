// Query Intent & Compound Predicate Parser for GeoVision / SmartMap

export function parseQueryIntent(queryText, currentState = null, isArabic = false) {
  if (!queryText) return null;
  const q = queryText.toLowerCase().trim();

  // 1. APP CONTROL INTENTS

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

  // Check Basemap change if explicitly mentioning basemap or map style
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
  if (['about us', 'open about us', 'go to about us', 'من نحن'].some(k => q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'NAVIGATE', params: { view: 'about' } };
  }
  if (['print this map', 'print map', 'print current view', 'print screen', 'print the screen', 'print view', 'print page', 'print report', 'print', 'طباعة الخريطة', 'طباعة الشاشة', 'طباعة التقرير', 'طباعة'].some(k => q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'PRINT_MAP', params: {} };
  }

  // 2. ANALYTICS INTENTS (CHART / TREND / COMPARISON)
  if (['compare these facilities', 'compare them', 'compare facilities', 'compare emissions', 'مقارنة', 'قارن'].some(k => q.includes(k))) {
    return { type: 'ANALYTICS', chartType: 'bar', metric: 'emissions' };
  }
  if (['show the trend', 'trend', 'show trend', 'الاتجاه', 'عرض الاتجاه'].some(k => q.includes(k))) {
    return { type: 'ANALYTICS', chartType: 'line', metric: 'water' };
  }

  // 3. PROXIMITY RANK INTENTS ("Which one is closest?")
  if (['which one is closest', 'which is closest', 'which is nearest', 'closest one', 'أيها الأقرب', 'أيها الأقرب لي'].some(k => q.includes(k))) {
    return { type: 'PROXIMITY_RANK', rankMode: 'NEAREST' };
  }

  // 4. DIRECTIONS / ROUTING INTENTS
  if (['show me directions', 'give me directions', 'directions', 'route to this facility', 'how do i get there', 'اتجاهات', 'اعرض الاتجاهات'].some(k => q.includes(k))) {
    return { type: 'DIRECTIONS', target: currentState?.selectedLocation || null };
  }

  // 5. COMPOUND SPATIAL SEARCH INTENT & PREDICATE EXTRACTION
  let category = null;
  let subType = null; // precise tag-level filter (e.g. "museum", "mosque", "park")
  let notInDataset = false; // true when user asks for something we don't have data for

  // --- Types NOT in our Abu Dhabi GIS dataset (show helpful not-found message) ---
  if (q.includes('petrol') || q.includes('gas station') || q.includes('fuel station') || q.includes('filling station') || q.includes('محطة وقود') || q.includes('محطة بنزين')) {
    notInDataset = true; subType = 'petrol station';
  } else if (q.includes('restaurant') || q.includes('cafe') || q.includes('coffee') || q.includes('food') || q.includes('eat') || q.includes('dining') || q.includes('مطعم') || q.includes('كافيه') || q.includes('طعام')) {
    notInDataset = true; subType = 'restaurant';
  } else if (q.includes('hotel') || q.includes('resort') || q.includes('accommodation') || q.includes('فندق') || q.includes('منتجع')) {
    notInDataset = true; subType = 'hotel';
  } else if (q.includes('mall') || q.includes('shopping') || q.includes('shop') || q.includes('store') || q.includes('supermarket') || q.includes('مول') || q.includes('تسوق') || q.includes('سوبرماركت')) {
    notInDataset = true; subType = 'mall';
  } else if (q.includes('pharmacy') || q.includes('chemist') || q.includes('drugstore') || q.includes('صيدلية')) {
    notInDataset = true; subType = 'pharmacy';
  } else if (q.includes('atm') || q.includes('bank') || q.includes('صراف') || q.includes('بنك') || q.includes('مصرف')) {
    notInDataset = true; subType = 'bank/ATM';
  } else if (q.includes('gym') || q.includes('fitness') || q.includes('sport') || q.includes('stadium') || q.includes('صالة رياضية') || q.includes('ملعب')) {
    notInDataset = true; subType = 'gym/sports facility';
  } else if (q.includes('cinema') || q.includes('movie') || q.includes('theatre') || q.includes('theater') || q.includes('سينما') || q.includes('مسرح')) {
    notInDataset = true; subType = 'cinema';
  } else if (q.includes('salon') || q.includes('spa') || q.includes('barber') || q.includes('صالون') || q.includes('سبا')) {
    notInDataset = true; subType = 'salon/spa';
  }

  // --- Specific sub-type keywords for items IN our dataset ---
  else if (q.includes('museum') || q.includes('متحف')) {
    category = 'TOURISM'; subType = 'museum';
  } else if (q.includes('mosque') || q.includes('مسجد') || q.includes('جامع')) {
    category = 'TOURISM'; subType = 'mosque';
  } else if (q.includes('palace') || q.includes('قصر')) {
    category = 'TOURISM'; subType = 'palace';
  } else if (q.includes('louvre') || q.includes('لوفر')) {
    category = 'TOURISM'; subType = 'louvre';
  } else if (q.includes('saadiyat') || q.includes('السعديات')) {
    category = 'TOURISM'; subType = 'saadiyat';
  } else if (q.includes('beach') || q.includes('شاطئ')) {
    category = 'TOURISM'; subType = 'beach';
  } else if (q.includes('park') || q.includes('garden') || q.includes('حديقة') || q.includes('منتزه')) {
    category = 'PARK'; subType = 'park';
  } else if (q.includes('mangrove') || q.includes('قرم')) {
    category = 'ENVIRONMENT'; subType = 'mangrove';
  } else if (q.includes('police') || q.includes('police station') || q.includes('شرطة')) {
    category = 'PUBLIC_SAFETY'; subType = 'police';
  } else if (q.includes('ambulance') || q.includes('إسعاف') || q.includes('طوارئ')) {
    category = 'PUBLIC_SAFETY'; subType = 'ambulance';
  } else if (q.includes('hospital') || q.includes('clinic') || q.includes('مستشفى') || q.includes('عيادة')) {
    category = 'HOSPITAL'; subType = 'hospital';
  } else if (q.includes('university') || q.includes('school') || q.includes('college') || q.includes('جامعة') || q.includes('مدرسة')) {
    category = 'EDUCATION'; subType = 'university';
  } else if (q.includes('bus') || q.includes('transit') || q.includes('حافلة') || q.includes('حافلات')) {
    category = 'TRANSPORT'; subType = 'bus';
  } else if (q.includes('airport') || q.includes('مطار')) {
    category = 'TRANSPORT'; subType = 'airport';
  } else if (q.includes('tamm') || q.includes('تم')) {
    category = 'GOVERNMENT'; subType = 'tamm';
  } else if (q.includes('municipality') || q.includes('بلدية')) {
    category = 'GOVERNMENT'; subType = 'municipality';
  } else if (q.includes('tourism') || q.includes('culture') || q.includes('attraction') || q.includes('landmark') || q.includes('سياحي') || q.includes('ثقافي')) {
    category = 'TOURISM';
  } else if (q.includes('government') || q.includes('civic') || q.includes('ministry') || q.includes('dge') || q.includes('حكومية') || q.includes('حكومي') || q.includes('وزارة')) {
    category = 'GOVERNMENT';
  } else if (q.includes('infrastructure') || q.includes('utility') || q.includes('desalination') || q.includes('water') || q.includes('power') || q.includes('solar') || q.includes('مرافق') || q.includes('طاقة') || q.includes('مياه')) {
    category = 'CIVIC_INFRASTRUCTURE';
  } else if (q.includes('transport') || q.includes('port') || q.includes('ميناء')) {
    category = 'TRANSPORT';
  } else if (q.includes('manufacturing') || q.includes('industrial') || q.includes('kizad') || q.includes('mussafah') || q.includes('مصنع') || q.includes('صناعي')) {
    category = 'MANUFACTURING';
  }

  // Region / District Extraction
  let region = null;
  if (q.includes('telangana') || q.includes('تيلانجانا')) region = 'Telangana';
  else if (q.includes('yas island') || q.includes('جزيرة ياس')) region = 'Yas Island';
  else if (q.includes('khalifa city') || q.includes('مدينة خليفة')) region = 'Khalifa City';
  else if (q.includes('al ain') || q.includes('العين')) region = 'Al Ain';
  else if (q.includes('corniche') || q.includes('الكورنيش')) region = 'Corniche';
  else if (q.includes('abu dhabi') || q.includes('أبوظبي') || q.includes('near me') || q.includes('قريب')) region = 'Abu Dhabi';

  // Risk Level Extraction
  let riskLevel = null;
  if (q.includes('critical') || q.includes('حرج')) riskLevel = 'Critical';
  else if (q.includes('high risk') || q.includes('عالي الخطورة') || q.includes('عالية الخطورة')) riskLevel = 'High';
  else if (q.includes('moderate') || q.includes('متوسط')) riskLevel = 'Moderate';

  // Radius Extraction
  let radiusKm = null;
  if (q.includes('500m') || q.includes('500 meters') || q.includes('500 متر')) radiusKm = 0.5;
  else if (q.includes('2 km') || q.includes('2كم') || q.includes('2 كم')) radiusKm = 2;
  else if (q.includes('5 km') || q.includes('5كم') || q.includes('5 كم')) radiusKm = 5;
  else if (q.includes('10 km') || q.includes('10كم') || q.includes('10 كم')) radiusKm = 10;

  return {
    type: 'SPATIAL_SEARCH',
    category,
    subType,
    notInDataset,
    region,
    riskLevel,
    radiusKm,
    rawQuery: queryText
  };
}


