// Query Intent & Compound Predicate Parser for GeoVision / SmartMap

export function parseQueryIntent(queryText, currentState = null, isArabic = false) {
  if (!queryText) return null;
  const q = queryText.toLowerCase().trim();

  // 1. APP CONTROL INTENTS
  if (['make it dark', 'change theme to dark', 'dark mode', 'dark theme', 'الوضع الداكن', 'الوضع المظلم'].some(k => q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CHANGE_THEME', params: { theme: 'dark' } };
  }
  if (['make it light', 'change theme to light', 'light mode', 'light theme', 'الوضع الفاتح'].some(k => q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CHANGE_THEME', params: { theme: 'light' } };
  }
  if (['change basemap', 'switch basemap', 'satellite view', 'satellite map', 'use satellite', 'use abu dhabi basemap', 'show streets', 'تغيير الخريطة', 'خريطة الأقمار الصناعية'].some(k => q.includes(k))) {
    let basemapId = 'satellite';
    if (q.includes('dark') || q.includes('مظلمة')) basemapId = 'dark';
    else if (q.includes('street') || q.includes('شوارع')) basemapId = 'streets';
    else if (q.includes('dge') || q.includes('abu dhabi') || q.includes('أبوظبي')) basemapId = 'abu-dhabi-dge';
    return { type: 'APP_CONTROL', action: 'CHANGE_BASEMAP', params: { basemapId } };
  }
  if (['switch to arabic', 'show arabic', 'arabic', 'عربي', 'العربية'].some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CHANGE_LANGUAGE', params: { lang: 'ar' } };
  }
  if (['switch to english', 'show english', 'english', 'إنجليزية'].some(k => q === k || q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'CHANGE_LANGUAGE', params: { lang: 'en' } };
  }
  if (['about us', 'open about us', 'go to about us', 'من نحن'].some(k => q.includes(k))) {
    return { type: 'APP_CONTROL', action: 'NAVIGATE', params: { view: 'about' } };
  }
  if (['print this map', 'print map', 'print current view', 'print', 'طباعة الخريطة'].some(k => q.includes(k))) {
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
  if (q.includes('tourism') || q.includes('museum') || q.includes('culture') || q.includes('attraction') || q.includes('palace') || q.includes('beach') || q.includes('متحف') || q.includes('سياحي') || q.includes('ثقافي')) category = 'TOURISM';
  else if (q.includes('government') || q.includes('tamm') || q.includes('civic') || q.includes('municipality') || q.includes('ministry') || q.includes('dge') || q.includes('حكومية') || q.includes('حكومي') || q.includes('وزارة') || q.includes('تم')) category = 'GOVERNMENT';
  else if (q.includes('infrastructure') || q.includes('utility') || q.includes('desalination') || q.includes('water') || q.includes('power') || q.includes('solar') || q.includes('مرافق') || q.includes('طاقة') || q.includes('مياه')) category = 'CIVIC_INFRASTRUCTURE';
  else if (q.includes('transport') || q.includes('transit') || q.includes('bus') || q.includes('airport') || q.includes('port') || q.includes('حافلات') || q.includes('مطار') || q.includes('ميناء')) category = 'TRANSPORT';
  else if (q.includes('park') || q.includes('green') || q.includes('recreation') || q.includes('حديقة') || q.includes('منتزه')) category = 'PARK';
  else if (q.includes('manufacturing') || q.includes('industrial') || q.includes('kizad') || q.includes('mussafah') || q.includes('مصنع') || q.includes('صناعي')) category = 'MANUFACTURING';

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
    region,
    riskLevel,
    radiusKm,
    rawQuery: queryText
  };
}
