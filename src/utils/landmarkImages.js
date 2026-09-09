// Comprehensive Landmark Thumbnail Image Resolver for Abu Dhabi Spatial Entities

const LANDMARK_IMAGE_MAP = {
  // TOURISM & CULTURAL LANDMARKS
  'Louvre Abu Dhabi': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  'Qasr Al Watan Cultural Palace': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  'Sheikh Zayed Grand Mosque Center': 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
  'Yas Waterworld': 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=800&q=80',
  'Saadiyat Beach Club': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',

  // GOVERNMENT FACILITIES
  'Department of Government Enablement (DGE) HQ': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'TAMM Customer Service Hub - Al Reem': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  'Abu Dhabi Municipality Service Centre': 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80',
  'Abu Dhabi Judicial Department HQ': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',

  // PUBLIC SAFETY
  'Abu Dhabi Central Police Station': 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=800&q=80',
  'Al Bateen Police Station': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
  'Abu Dhabi Central Ambulance Station': 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',

  // TRANSPORTATION
  'Abu Dhabi Main Central Mobility Terminal': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
  'Zayed International Airport Terminal Hub': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  'Corniche Waterfront Transit Stop #4': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',

  // ENVIRONMENT & PARKS
  'Eastern Mangrove Protected National Park': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Umm Al Emarat Park & Environmental Hub': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
  'Umm Al Emarat Park & Eco Hub': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
  'Yas Gateway Park': 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
  'Yas Gateway Park North': 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',

  // HEALTHCARE & EDUCATION
  'Cleveland Clinic Abu Dhabi': 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
  'Sheikh Shakhbout Medical City (SSMC)': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'Khalifa University Main Campus': 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
  'Sorbonne University Abu Dhabi': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',

  // CIVIC UTILITIES
  'Al Taweelah Power & Desalination Complex': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
  'Mussafah Eco & Waste Recycling Complex': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
};

// Neutral "No Photo" placeholder — shown when no specific image is available
const NO_PHOTO_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#1e2a3a"/>
  <rect x="320" y="180" width="160" height="140" rx="12" fill="#2a3a52" stroke="#3a4f6e" stroke-width="2"/>
  <circle cx="400" cy="232" r="28" fill="#3a4f6e"/>
  <rect x="358" y="270" width="84" height="8" rx="4" fill="#3a4f6e"/>
  <rect x="372" y="290" width="56" height="6" rx="3" fill="#2e3d52"/>
  <text x="400" y="358" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="14" fill="#5a7090" letter-spacing="1">No Photo Available</text>
</svg>
`)}`;

export function getLandmarkThumbnail(item) {
  if (!item) return NO_PHOTO_PLACEHOLDER;

  // If item has an explicit image that isn't the generic government building fallback
  if (item.image && !item.image.includes('photo-1486406146926-c627a92ad1ab')) {
    return item.image;
  }

  const nameKey = item.name || '';

  // 1. Exact name match
  if (LANDMARK_IMAGE_MAP[nameKey]) {
    return LANDMARK_IMAGE_MAP[nameKey];
  }

  // 2. Partial name token match for known landmarks only
  const nameLower = nameKey.toLowerCase();
  if (nameLower.includes('louvre')) return LANDMARK_IMAGE_MAP['Louvre Abu Dhabi'];
  if (nameLower.includes('qasr al watan') || nameLower.includes('watan')) return LANDMARK_IMAGE_MAP['Qasr Al Watan Cultural Palace'];
  if (nameLower.includes('sheikh zayed grand') || nameLower.includes('grand mosque')) return LANDMARK_IMAGE_MAP['Sheikh Zayed Grand Mosque Center'];
  if (nameLower.includes('umm al emarat') || nameLower.includes('emarat park')) return LANDMARK_IMAGE_MAP['Umm Al Emarat Park & Eco Hub'];
  if (nameLower.includes('yas gateway park')) return LANDMARK_IMAGE_MAP['Yas Gateway Park North'];
  if (nameLower.includes('eastern mangrove')) return LANDMARK_IMAGE_MAP['Eastern Mangrove Protected National Park'];
  if (nameLower.includes('cleveland clinic')) return LANDMARK_IMAGE_MAP['Cleveland Clinic Abu Dhabi'];
  if (nameLower.includes('sheikh shakhbout') || nameLower.includes('ssmc')) return LANDMARK_IMAGE_MAP['Sheikh Shakhbout Medical City (SSMC)'];
  if (nameLower.includes('khalifa university')) return LANDMARK_IMAGE_MAP['Khalifa University Main Campus'];
  if (nameLower.includes('sorbonne')) return LANDMARK_IMAGE_MAP['Sorbonne University Abu Dhabi'];
  if (nameLower.includes('corniche') && nameLower.includes('transit')) return LANDMARK_IMAGE_MAP['Corniche Waterfront Transit Stop #4'];
  if (nameLower.includes('zayed international airport') || nameLower.includes('zayed airport')) return LANDMARK_IMAGE_MAP['Zayed International Airport Terminal Hub'];
  if (nameLower.includes('central ambulance') || nameLower.includes('ambulance station')) return LANDMARK_IMAGE_MAP['Abu Dhabi Central Ambulance Station'];
  if (nameLower.includes('central police') || (nameLower.includes('abu dhabi') && nameLower.includes('police'))) return LANDMARK_IMAGE_MAP['Abu Dhabi Central Police Station'];
  if (nameLower.includes('bateen police')) return LANDMARK_IMAGE_MAP['Al Bateen Police Station'];
  if (nameLower.includes('dge') || nameLower.includes('government enablement')) return LANDMARK_IMAGE_MAP['Department of Government Enablement (DGE) HQ'];
  if (nameLower.includes('tamm')) return LANDMARK_IMAGE_MAP['TAMM Customer Service Hub - Al Reem'];
  if (nameLower.includes('al taweelah') || nameLower.includes('desalination')) return LANDMARK_IMAGE_MAP['Al Taweelah Power & Desalination Complex'];
  if (nameLower.includes('mussafah') && nameLower.includes('waste')) return LANDMARK_IMAGE_MAP['Mussafah Eco & Waste Recycling Complex'];

  // 3. No specific match — show placeholder instead of random image
  return NO_PHOTO_PLACEHOLDER;
}
