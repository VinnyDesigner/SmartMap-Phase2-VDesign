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
    name_ar: 'Ù…ØªØ­Ù Ø§Ù„Ù„ÙˆÙØ± Ø£Ø¨ÙˆØ¸Ø¨ÙŠ',
    type: 'TOURISM',
    category_en: 'Cultural Landmark',
    category_ar: 'Ù…Ø¹Ù„Ù… Ø«Ù‚Ø§ÙÙŠ ÙˆØ³ÙŠØ§Ø­ÙŠ',
    location: 'Saadiyat Cultural District',
    location_ar: 'Ø§Ù„Ù…Ù†Ø·Ù‚Ø© Ø§Ù„Ø«Ù‚Ø§ÙÙŠØ© Ø¨Ø§Ù„Ø³Ø¹Ø¯ÙŠØ§Øª',
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
    description: 'Iconic universal museum displaying global art and artifacts under Jean Nouvelâ€™s rain-of-light dome.',
    description_ar: 'Ù…ØªØ­Ù Ø¹Ø§Ù„Ù…ÙŠ Ø¨Ø§Ø±Ø² ÙŠØ¹Ø±Ø¶ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ø§Ù„ÙÙ†ÙŠØ© ÙˆØ§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ© ØªØ­Øª Ù‚Ø¨Ø© Ø§Ù„Ù†ÙˆØ± Ø§Ù„Ù…Ø¹Ù…Ø§Ø±ÙŠØ©.',
    tags: ['tourism', 'museum', 'louvre', 'saadiyat', 'art', 'culture', 'landmark']
  },
  {
    id: 202,
    name: 'Qasr Al Watan Cultural Palace',
    name_ar: 'Ù‚ØµØ± Ø§Ù„ÙˆØ·Ù† Ø§Ù„Ø«Ù‚Ø§ÙÙŠ',
    type: 'TOURISM',
    category_en: 'Cultural Heritage',
    category_ar: 'Ù…Ø¹Ù„Ù… Ø«Ù‚Ø§ÙÙŠ ÙˆØªØ§Ø±ÙŠØ®ÙŠ',
    location: 'Al Ras Al Akhdar',
    location_ar: 'Ø§Ù„Ø±Ø£Ø³ Ø§Ù„Ø£Ø®Ø¶Ø±',
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
    description_ar: 'Ù‚ØµØ± Ø±Ø¦Ø§Ø³ÙŠ Ø­ÙŠ ÙŠØ­ØªÙÙŠ Ø¨Ø§Ù„ØªØ±Ø§Ø« Ø§Ù„Ù…Ø¹Ù…Ø§Ø±ÙŠ ÙˆØ§Ù„Ø­ÙˆÙƒÙ…Ø© ÙˆØ§Ù„Ø«Ù‚Ø§ÙØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©.',
    tags: ['tourism', 'palace', 'qasr al watan', 'heritage', 'culture', 'landmark']
  },
  {
    id: 203,
    name: 'Sheikh Zayed Grand Mosque Center',
    name_ar: 'Ù…Ø±ÙƒØ² Ø¬Ø§Ù…Ø¹ Ø§Ù„Ø´ÙŠØ® Ø²Ø§ÙŠØ¯ Ø§Ù„ÙƒØ¨ÙŠØ±',
    type: 'TOURISM',
    category_en: 'Architectural Landmark',
    category_ar: 'Ù…Ø¹Ù„Ù… Ù…Ø¹Ù…Ø§Ø±ÙŠ ÙˆØ«Ù‚Ø§ÙÙŠ',
    location: 'Al Rawdah',
    location_ar: 'Ø§Ù„Ø±ÙˆØ¶Ø©',
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
    description_ar: 'ØµØ±Ø­ Ù…Ø¹Ù…Ø§Ø±ÙŠ Ø¥Ø³Ù„Ø§Ù…ÙŠ Ø¹Ø§Ù„Ù…ÙŠ Ø¨Ø§Ø±Ø² ÙŠØ¹ØªØ¨Ø± Ø§Ù„Ù…Ø¹Ù„Ù… Ø§Ù„Ø¯ÙŠÙ†ÙŠ ÙˆØ§Ù„Ø«Ù‚Ø§ÙÙŠ Ø§Ù„Ø£ÙƒØ¨Ø± ÙÙŠ Ø§Ù„Ø¥Ù…Ø§Ø±Ø©.',
    tags: ['tourism', 'mosque', 'sheikh zayed', 'grand mosque', 'heritage', 'landmark']
  },

  // 2. GOVERNMENT FACILITIES & CIVIC SERVICES
  {
    id: 101,
    name: 'Department of Government Enablement (DGE) HQ',
    name_ar: 'Ø¯Ø§Ø¦Ø±Ø© Ø§Ù„ØªÙ…ÙƒÙŠÙ† Ø§Ù„Ø­ÙƒÙˆÙ…ÙŠ - Ø§Ù„Ù…Ù‚Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ',
    type: 'GOVERNMENT',
    category_en: 'Executive Governance',
    category_ar: 'Ù…Ù†Ø´Ø£Ø© Ø­ÙƒÙˆÙ…ÙŠØ© ØªÙ†ÙÙŠØ°ÙŠØ©',
    location: 'Corniche West',
    location_ar: 'Ø·Ø±ÙŠÙ‚ Ø§Ù„ÙƒÙˆØ±Ù†ÙŠØ´ Ø§Ù„ØºØ±Ø¨ÙŠ',
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
    description_ar: 'Ø§Ù„Ù…Ù‚Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ Ø§Ù„Ù…Ø¹Ù†ÙŠ Ø¨Ø§Ù„Ø¨Ù†ÙŠØ© Ø§Ù„Ù…ÙƒØ§Ù†ÙŠØ© Ù„Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙˆØ§Ù„ØªØ­ÙˆÙ„ Ø§Ù„Ø±Ù‚Ù…ÙŠ ÙˆØ§Ù„ØªÙÙˆÙ‚ Ø§Ù„Ø­ÙƒÙˆÙ…ÙŠ.',
    tags: ['government', 'dge', 'sdi', 'enablement', 'headquarters', 'corniche']
  },
  {
    id: 102,
    name: 'TAMM Customer Service Hub - Al Reem',
    name_ar: 'Ù…Ø±ÙƒØ² ØªÙ… Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù…ØªØ¹Ø§Ù…Ù„ÙŠÙ† - Ø§Ù„Ø±ÙŠÙ…',
    type: 'GOVERNMENT',
    category_en: 'Unified Public Services',
    category_ar: 'Ø®Ø¯Ù…Ø§Øª Ø­ÙƒÙˆÙ…ÙŠØ© Ù…ÙˆØ­Ø¯Ø©',
    location: 'Al Reem Island',
    location_ar: 'Ø¬Ø²ÙŠØ±Ø© Ø§Ù„Ø±ÙŠÙ…',
    district: 'Al Reem Island',
    lat: 24.5028,
    lng: 54.4056,
    rating: 4.8,
    riskLevel: 'Low',
    riskScore: 22,
    capacity: 3500,
    description: 'Unified Abu Dhabi government customer service center providing smart digital transactions.',
    description_ar: 'Ù…Ø±ÙƒØ² Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø­ÙƒÙˆÙ…ÙŠØ© Ø§Ù„Ù…ÙˆØ­Ø¯Ø© ØªÙ… Ø§Ù„Ø®Ø§Ø¯Ù… Ù„Ø³ÙƒØ§Ù† ÙˆØ´Ø±ÙƒØ§Øª Ø¬Ø²ÙŠØ±Ø© Ø§Ù„Ø±ÙŠÙ….',
    tags: ['government', 'tamm', 'public service', 'reem', 'civic']
  },
  {
    id: 103,
    name: 'Abu Dhabi Municipality Service Centre',
    name_ar: 'Ù…Ø±ÙƒØ² Ø¨Ù„Ø¯ÙŠØ© Ø£Ø¨ÙˆØ¸Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ',
    type: 'GOVERNMENT',
    category_en: 'Municipal Services',
    category_ar: 'Ø®Ø¯Ù…Ø§Øª Ø¨Ù„Ø¯ÙŠØ©',
    location: 'Al Zahiyah',
    location_ar: 'Ø§Ù„Ø²Ø§Ù‡ÙŠØ©',
    district: 'Al Zahiyah',
    lat: 24.4920,
    lng: 54.3735,
    rating: 4.7,
    capacity: 2500,
    description: 'Central municipal hub managing urban planning, building permits, and public land GIS registries.',
    description_ar: 'Ø§Ù„Ù…Ø±ÙƒØ² Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø¨Ù„Ø¯ÙŠØ© ÙˆØ§Ù„Ù…Ø¹Ù†ÙŠ Ø¨Ø§Ù„ØªØ®Ø·ÙŠØ· Ø§Ù„Ø¹Ù…Ø±Ø§Ù†ÙŠ ÙˆØªØµØ§Ø±ÙŠØ­ Ø§Ù„Ø£Ø±Ø§Ø¶ÙŠ.',
    tags: ['government', 'municipality', 'permits', 'urban planning', 'zahiyah']
  },

  // 3. PUBLIC SAFETY (Police & Ambulance)
  {
    id: 401,
    name: 'Abu Dhabi Central Police Station',
    name_ar: 'Ù…Ø±ÙƒØ² Ø´Ø±Ø·Ø© Ø£Ø¨ÙˆØ¸Ø¨ÙŠ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ',
    type: 'PUBLIC_SAFETY',
    category_en: 'Police Station',
    category_ar: 'Ù…Ø±ÙƒØ² Ø´Ø±Ø·Ø©',
    location: 'Downtown Abu Dhabi',
    location_ar: 'ÙˆØ³Ø· Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©',
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
    name_ar: 'Ù…Ø±ÙƒØ² Ø´Ø±Ø·Ø© Ø§Ù„Ø¨ØªÙŠÙ†',
    type: 'PUBLIC_SAFETY',
    category_en: 'Police Station',
    category_ar: 'Ù…Ø±ÙƒØ² Ø´Ø±Ø·Ø©',
    location: 'Al Bateen',
    location_ar: 'Ø§Ù„Ø¨ØªÙŠÙ†',
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
    name_ar: 'Ù…Ø­Ø·Ø© Ø§Ù„Ø¥Ø³Ø¹Ø§Ù Ø§Ù„Ù…Ø±ÙƒØ²ÙŠØ© ÙˆØ§Ù„Ø·ÙˆØ§Ø±Ø¦ Ø§Ù„Ø·Ø¨ÙŠØ©',
    type: 'PUBLIC_SAFETY',
    category_en: 'Ambulance Station',
    category_ar: 'Ù…Ø­Ø·Ø© Ø¥Ø³Ø¹Ø§Ù',
    location: 'Al Mushrif',
    location_ar: 'Ø§Ù„Ù…Ø´Ø±Ù',
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
    name_ar: 'Ù…Ø­Ø·Ø© Ø­Ø§ÙÙ„Ø§Øª Ø£Ø¨ÙˆØ¸Ø¨ÙŠ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
    type: 'TRANSPORT',
    category_en: 'Mobility Terminal',
    category_ar: 'Ù…Ø­Ø·Ø© Ù†Ù‚Ù„ Ø¹Ø§Ù…',
    location: 'Al Nahyan',
    location_ar: 'Ø¢Ù„ Ù†Ù‡ÙŠØ§Ù†',
    district: 'Al Nahyan',
    lat: 24.4719,
    lng: 54.3725,
    rating: 4.3,
    capacity: 25000,
    description: 'Primary intercity transit hub connecting Abu Dhabi to regional municipal districts.',
    description_ar: 'Ø§Ù„Ù…Ø­Ø·Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© Ù„Ù„Ù†Ù‚Ù„ Ø§Ù„Ø¹Ø§Ù… ÙˆØ§Ù„Ø­Ø§ÙÙ„Ø§Øª Ø§Ù„ØªÙŠ ØªØ±Ø¨Ø· Ù…Ø¯ÙŠÙ†Ø© Ø£Ø¨ÙˆØ¸Ø¨ÙŠ Ø¨Ø§Ù„Ù…Ø¹Ø§Ù„Ù… Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠØ©.',
    tags: ['transport', 'transit', 'bus', 'nahyan', 'mobility']
  },
  {
    id: 502,
    name: 'Corniche Waterfront Transit Stop #4',
    name_ar: 'Ù…ÙˆÙ‚Ù Ø­Ø§ÙÙ„Ø§Øª Ø§Ù„ÙƒÙˆØ±Ù†ÙŠØ´ Ø±Ù‚Ù… 4',
    type: 'TRANSPORT',
    category_en: 'Bus Stop',
    category_ar: 'Ù…ÙˆÙ‚Ù Ø­Ø§ÙÙ„Ø§Øª',
    location: 'Corniche',
    location_ar: 'Ø§Ù„ÙƒÙˆØ±Ù†ÙŠØ´',
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
    name_ar: 'Ù…Ø­Ù…ÙŠØ© Ø§Ù„Ù‚Ø±Ù… Ø§Ù„Ø´Ø±Ù‚ÙŠ Ø§Ù„ÙˆØ·Ù†ÙŠØ©',
    type: 'ENVIRONMENT',
    category_en: 'Protected Area',
    category_ar: 'Ù…Ø­Ù…ÙŠØ© Ø·Ø¨ÙŠØ¹ÙŠØ©',
    location: 'Eastern Ring Road',
    location_ar: 'Ø·Ø±ÙŠÙ‚ Ø§Ù„ÙƒÙˆØ±Ù†ÙŠØ´ Ø§Ù„Ø´Ø±Ù‚ÙŠ',
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
    name_ar: 'Ø­Ø¯ÙŠÙ‚Ø© Ø£Ù… Ø§Ù„Ø¥Ù…Ø§Ø±Ø§Øª ÙˆØ§Ù„Ù…Ø±ÙƒØ² Ø§Ù„Ø¨ÙŠØ¦ÙŠ',
    type: 'PARK',
    category_en: 'Public Park',
    category_ar: 'Ø­Ø¯ÙŠÙ‚Ø© Ø¹Ø§Ù…Ø© ÙˆÙ…Ø­Ù…ÙŠØ©',
    location: 'Al Mushrif',
    location_ar: 'Ø§Ù„Ù…Ø´Ø±Ù',
    district: 'Al Mushrif',
    lat: 24.4533,
    lng: 54.3879,
    rating: 4.8,
    capacity: 12000,
    description: 'Historic public park featuring shade botanical gardens, shade structures, and eco-learning spaces.',
    description_ar: 'Ø­Ø¯ÙŠÙ‚Ø© ØªØ§Ø±ÙŠØ®ÙŠØ© Ø¨Ø§Ø±Ø²Ø© ØªØ¶Ù… Ø­Ø¯Ø§Ø¦Ù‚ Ù†Ø¨Ø§ØªÙŠØ© ÙˆÙ…Ø³Ø§Ø­Ø§Øª Ø¨ÙŠØ¦ÙŠØ© Ø®Ø¶Ø±Ø§Ø¡ Ù…Ø¸Ù„Ù„Ø©.',
    tags: ['park', 'environment', 'umm al emarat', 'mushrif', 'green']
  },
  {
    id: 12,
    name: 'Yas Gateway Park North',
    name_ar: 'Ø­Ø¯ÙŠÙ‚Ø© ÙŠØ§Ø³ Ø¬ÙŠØªÙˆØ§ÙŠ Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©',
    type: 'PARK',
    category_en: 'Public Park',
    category_ar: 'Ø­Ø¯ÙŠÙ‚Ø© Ø¹Ø§Ù…Ø© ÙˆÙ…Ø­Ù…ÙŠØ©',
    location: 'Yas Island',
    location_ar: 'Ø¬Ø²ÙŠØ±Ø© ÙŠØ§Ø³',
    district: 'Yas Island',
    lat: 24.4920,
    lng: 54.6020,
    rating: 4.8,
    capacity: 8000,
    description: 'Lush green park situated at the entrance of Yas Island with shaded sports tracks.',
    description_ar: 'Ø­Ø¯ÙŠÙ‚Ø© Ø®Ø¶Ø±Ø§Ø¡ ÙˆØ§Ø³Ø¹Ø© Ø¹Ù†Ø¯ Ù…Ø¯Ø®Ù„ Ø¬Ø²ÙŠØ±Ø© ÙŠØ§Ø³ ØªØªÙ…ÙŠØ² Ø¨Ù…Ø³Ø§Ø±Ø§Øª Ø±ÙŠØ§Ø¶ÙŠØ© Ù…Ø¸Ù„Ù„Ø©.',
    tags: ['park', 'yas island', 'green', 'recreation']
  },

  // 6. HEALTHCARE FACILITIES
  {
    id: 301,
    name: 'Cleveland Clinic Abu Dhabi',
    name_ar: 'Ù…Ø³ØªØ´ÙÙ‰ ÙƒÙ„ÙŠÙÙ„Ø§Ù†Ø¯ ÙƒÙ„ÙŠÙ†Ùƒ Ø£Ø¨ÙˆØ¸Ø¨ÙŠ',
    type: 'HOSPITAL',
    category_en: 'Tertiary Hospital',
    category_ar: 'Ù…Ø³ØªØ´ÙÙ‰ ØªØ®ØµØµÙŠ Ø±Ø¦ÙŠØ³ÙŠ',
    location: 'Al Maryah Island',
    location_ar: 'Ø¬Ø²ÙŠØ±Ø© Ø§Ù„Ù…Ø§Ø±ÙŠØ©',
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
    name_ar: 'Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø´ÙŠØ® Ø´Ø®Ø¨ÙˆØ· Ø§Ù„Ø·Ø¨ÙŠØ©',
    type: 'HOSPITAL',
    category_en: 'Government Hospital',
    category_ar: 'Ù…Ø¯ÙŠÙ†Ø© Ø·Ø¨ÙŠØ© Ø­ÙƒÙˆÙ…ÙŠØ©',
    location: 'Al Mafraq',
    location_ar: 'Ø§Ù„Ù…ÙØ±Ù‚',
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
    name_ar: 'Ø¬Ø§Ù…Ø¹Ø© Ø®Ù„ÙŠÙØ© - Ø§Ù„Ù…Ù‚Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ',
    type: 'EDUCATION',
    category_en: 'University',
    category_ar: 'Ø¬Ø§Ù…Ø¹Ø© Ø£Ø¨Ø­Ø§Ø«',
    location: 'Al Saada',
    location_ar: 'Ø§Ù„Ø³Ø¹Ø§Ø¯Ø©',
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
    name_ar: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø³ÙˆØ±Ø¨ÙˆÙ† Ø£Ø¨ÙˆØ¸Ø¨ÙŠ',
    type: 'EDUCATION',
    category_en: 'University',
    category_ar: 'Ø¬Ø§Ù…Ø¹Ø© Ø¯ÙˆÙ„ÙŠØ©',
    location: 'Al Reem Island',
    location_ar: 'Ø¬Ø²ÙŠØ±Ø© Ø§Ù„Ø±ÙŠÙ…',
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
    const rawQ = queryText || '';
    const activeProject = currentState?.activeProject;
    const activeDataset = activeProject?.datasets || LOCATIONS_DB;

    // Parse query intent & compound predicates FIRST before fallback search engines
    const parsedIntent = parseQueryIntent(rawQ, currentState, isArabic);

    // 1. APP CONTROL COMMANDS
    if (parsedIntent && parsedIntent.type === 'APP_CONTROL') {
      let actions = [];
      let reply = "";

      if (parsedIntent.action === 'CHANGE_THEME') {
        const theme = parsedIntent.params.theme;
        actions.push({ type: 'CHANGE_THEME', params: { theme } });
        reply = isArabic 
          ? `ØªÙ… ØªØºÙŠÙŠØ± Ù…Ø¸Ù‡Ø± Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ Ø¥Ù„Ù‰ ${theme === 'dark' ? 'Ø§Ù„ÙˆØ¶Ø¹ Ø§Ù„Ø¯Ø§ÙƒÙ† ðŸŒ™' : 'Ø§Ù„ÙˆØ¶Ø¹ Ø§Ù„ÙØ§ØªØ­ â˜€ï¸'}` 
          : `Switched application color theme to ${theme === 'dark' ? 'Dark Mode ðŸŒ™' : 'Light Mode â˜€ï¸'}`;
        return { reply, actions };
      }

      if (parsedIntent.action === 'CHANGE_BASEMAP') {
        const basemapId = parsedIntent.params.basemapId;
        actions.push({ type: ACTION_TYPES.MAP_SET_BASEMAP, params: { basemapId } });
        reply = isArabic 
          ? `ØªÙ… ØªØºÙŠÙŠØ± Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© Ø¥Ù„Ù‰ **${basemapId}** Ø¨Ù†Ø¬Ø§Ø­. ðŸ—ºï¸` 
          : `Switched active map view to **${basemapId.toUpperCase()}** basemap. ðŸ—ºï¸`;
        return { reply, actions };
      }

      if (parsedIntent.action === 'CHANGE_LANGUAGE') {
        const lang = parsedIntent.params.lang;
        actions.push({ type: ACTION_TYPES.LANGUAGE_SET, params: { lang } });
        reply = lang === 'ar' ? "ØªÙ… ØªØ­ÙˆÙŠÙ„ Ù„ØºØ© Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø¥Ù„Ù‰ Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© (RTL) Ø¨Ù†Ø¬Ø§Ø­ ðŸ‡¦ðŸ‡ª" : "Switched application language to English ðŸ‡¬ðŸ‡§";
        return { reply, actions };
      }

      if (parsedIntent.action === 'NAVIGATE') {
        const view = parsedIntent.params.view;
        actions.push({ type: ACTION_TYPES.NAVIGATION_SWITCH, params: { view } });
        reply = isArabic ? "Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø§Ù†ØªÙ‚Ø§Ù„ Ø¥Ù„Ù‰ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©... ðŸš€" : `Navigating to ${view.toUpperCase()} screen... ðŸš€`;
        return { reply, actions };
      }

      if (parsedIntent.action === 'PRINT_MAP') {
        actions.push({ type: ACTION_TYPES.REPORT_GENERATE, params: { type: 'map-print' } });
        reply = isArabic ? "Ø¬Ø§Ø±ÙŠ ÙØªØ­ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ø·Ø¨Ø§Ø¹Ø© Ø§Ù„Ù…Ø®ØµØµ Ø§Ù„Ø®Ø±ÙŠØ·Ø© ÙˆØ§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª... ðŸ–¨ï¸" : "Opening print layout... ðŸ–¨ï¸";
        return { reply, actions };
      }
    }

    // 2. Check authoritative AI Knowledge Base dictionary
    const kbMatch = matchKnowledgeBaseQuery(queryText, currentState, isArabic);
    if (kbMatch) {
      return kbMatch;
    }

    // 3. Delegate to modular GeoAI Orchestrator ONLY for open-ended/analytics queries
    // that have NO recognized intent type or category â€” never for DIRECTIONS, ANALYTICS,
    // PROXIMITY_RANK, or SPATIAL_SEARCH with a category/subType (those all have dedicated handlers below)
    const hasSpecificHandler = (
      (parsedIntent?.type === 'APP_CONTROL') ||
      (parsedIntent?.type === 'DIRECTIONS') ||
      (parsedIntent?.type === 'ANALYTICS') ||
      (parsedIntent?.type === 'PROXIMITY_RANK') ||
      (parsedIntent?.category) ||
      (parsedIntent?.subType)
    );
    if (!hasSpecificHandler) {
      const orchestratorResult = await aiOrchestrator.processUserQuery(queryText, currentState, isArabic, activeDataset);
      if (orchestratorResult) return orchestratorResult;
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    let actions = [];
    let results = [];
    let reply = "";
    let suggestions = [];
    let chartData = null;

    // Reference location: user location or default project center
    const userLat = currentState?.userLocation?.lat || activeProject?.defaultCenter?.lat || 24.4839;
    const userLng = currentState?.userLocation?.lng || activeProject?.defaultCenter?.lng || 54.3773;
    const userOrigin = { lat: userLat, lng: userLng };

    // 4. PROXIMITY RANKING ("Which one is closest?")
    if (parsedIntent && parsedIntent.type === 'PROXIMITY_RANK') {
      // Only compare the items from the PREVIOUS search result — not the whole dataset
      const contextList = currentState?.activeContext?.activeLocations;
      const comparisonList = (contextList && contextList.length > 0) ? contextList : LOCATIONS_DB.slice(0, 5);

      // Sort by geodesic distance from user origin
      const ranked = [...comparisonList].map(item => {
        const dist = (item.lat && item.lng)
          ? filterByCompoundPredicates([item], {}, userOrigin)[0]?.distanceKm ?? item.distanceKm ?? 999
          : (item.distanceKm ?? 999);
        return { ...item, distanceKm: dist };
      }).sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

      const topMatch = ranked[0];
      if (topMatch) {
        actions.push(
          { type: ACTION_TYPES.FACILITY_SELECT, params: { facility: topMatch } },
          { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topMatch.lat, lng: topMatch.lng, zoom: 16 } }
        );

        const matchName = isArabic && topMatch.name_ar ? topMatch.name_ar : topMatch.name;
        const distDisplay = typeof topMatch.distanceKm === 'number'
          ? `${topMatch.distanceKm.toFixed(1)} km`
          : '—';

        // Build a brief comparison list (all candidates with their distances)
        const comparisonLines = ranked.map(item => {
          const n = isArabic && item.name_ar ? item.name_ar : item.name;
          const d = typeof item.distanceKm === 'number' ? `${item.distanceKm.toFixed(1)} km` : '—';
          const marker = item.id === topMatch.id ? '🏆 ' : '• ';
          return `${marker}**${n}** — ${d}`;
        }).join('\n');

        reply = isArabic
          ? `من بين نتائج البحث الحالية، **${matchName}** هي الأقرب على بعد **${distDisplay}**:\n\n${comparisonLines}`
          : `Out of your current search results, **${matchName}** is the closest at **${distDisplay}**:\n\n${comparisonLines}`;

        // Return ONLY the top match as the result card (not all items)
        return {
          reply,
          results: [topMatch],
          actions,
          activeContext: { ...currentState?.activeContext, selectedFeature: topMatch }
        };
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
          ? `âš ï¸ **Ø­Ø§Ù„Ø© Ø®Ø¯Ù…Ø© Ø§Ù„Ø§ØªØ¬Ø§Ù‡Ø§Øª ÙˆØ§Ù„Ù…Ø³Ø§Ø±Ø§Øª**:\n${routeCheck.message_ar}\n\nØ§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ù…Ø­Ø¯Ø¯: **${destName}** (ÙŠØ¨Ø¹Ø¯ Ù…Ø³Ø§ÙØ© Ù‡ÙˆØ§Ø¦ÙŠØ© Ù‚Ø¯Ø±Ù‡Ø§ **${dist} ÙƒÙ…**). ØªÙ… Ø§Ù„ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙÙŠ Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ø¯ÙˆÙ† Ø±Ø³Ù… Ù…Ø³Ø§Ø±Ø§Øª ÙˆÙ‡Ù…ÙŠØ©.`
          : `âš ï¸ **Routing Service Notice**:\n${routeCheck.message}\n\nTarget location: **${destName}** (approx **${dist} km** geodesic distance). Map focused on the target facility without fabricating unverified route lines.`;
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
          title: isArabic ? "Ù…Ù‚Ø§Ø±Ù†Ø© Ù…Ø¤Ø´Ø± Ø§Ù„Ø§Ù†Ø¨Ø¹Ø§Ø«Ø§Øª Ø§Ù„ØªÙ‚Ø¯ÙŠØ±ÙŠ (Ø·Ù† ÙƒØ±Ø¨ÙˆÙ†/Ø³Ù†Ø©)" : "Comparative Emissions Index (tCO2e/yr)",
          type: 'bar',
          data: activeList.map(item => ({
            label: isArabic && item.name_ar ? item.name_ar : item.name,
            name: isArabic && item.name_ar ? item.name_ar : item.name,
            value: item.emissionsIndex || 15000,
            color: item.riskLevel === 'Critical' ? '#f43f5e' : item.riskLevel === 'High' ? '#f59e0b' : '#3b82f6'
          }))
        };
        reply = isArabic ? "ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø±Ø³Ù… Ø§Ù„Ø¨ÙŠØ§Ù†ÙŠ Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠ Ù„Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø·Ù„Ø¨Ùƒ:" : "Generated interactive comparative graph upon your explicit request:";
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
        const matchName = isArabic && topMatch.name_ar ? topMatch.name_ar : topMatch.name;
        reply = isArabic
          ? `Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ø¨Ø­Ø« Ø§Ù„Ø­Ø§Ù„ÙŠØ© ÙˆÙ…ÙˆÙ‚Ø¹Ùƒ Ø§Ù„Ø¬ØºØ±Ø§ÙÙŠØŒ **${matchName}** Ù‡ÙŠ Ø§Ù„Ù…Ù†Ø´Ø£Ø© Ø§Ù„Ø£Ù‚Ø±Ø¨ Ø¹Ù„Ù‰ Ø¨Ø¹Ø¯ **${topMatch.distanceKm || 1.2} ÙƒÙ…**.`
          : `Based on your current active results, **${matchName}** is the closest location, approximately **${topMatch.distanceKm || 1.2} km** away.`;
        return { reply, results, actions, activeContext: { ...currentState?.activeContext, selectedFeature: topMatch } };
      }
    }

    // 5. STRICT COMPOUND SPATIAL SEARCH
    if (parsedIntent && parsedIntent.type === 'SPATIAL_SEARCH') {

      // Handle queries for things NOT in our Abu Dhabi GIS dataset
      if (parsedIntent.notInDataset) {
        const label = parsedIntent.subType || 'this location type';
        const labelCap = label.charAt(0).toUpperCase() + label.slice(1);
        reply = isArabic
          ? `â„¹ï¸ **"${label}" ØºÙŠØ± Ù…ØªÙˆÙØ± ÙÙŠ Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¬ØºØ±Ø§ÙÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©.**\n\nÙ‡Ø°Ø§ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ ÙŠØ¹Ø±Ø¶ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¨Ù†ÙŠØ© Ø§Ù„ØªØ­ØªÙŠØ© Ù„Ø£Ø¨ÙˆØ¸Ø¨ÙŠ. Ù„Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ ${label}ØŒ ÙŠÙÙ†ØµØ­ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… Google Maps.`
          : `â„¹ï¸ **"${labelCap}s" are not included in this GIS dataset.**\n\nGeoVision covers Abu Dhabi's civic infrastructure: **parks, museums, mosques, hospitals, universities, government centers, police stations,** and **transport hubs**.\n\nFor ${label}s, try Google Maps or a dedicated service app.`;

        suggestions = isArabic
          ? ['Ø¹Ø±Ø¶ Ø§Ù„Ø­Ø¯Ø§Ø¦Ù‚ Ø§Ù„Ù‚Ø±ÙŠØ¨Ø©', 'Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª', 'Ø¹Ø±Ø¶ Ø§Ù„Ù…ØªØ§Ø­Ù', 'Ø¹Ø±Ø¶ Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø´Ø±Ø·Ø©']
          : ['Show parks near me', 'Show hospitals', 'Show museums', 'Show police stations'];

        return { reply, results: [], suggestions, datasetsUsed: ['DGE Spatial SDI 2026'] };
      }

      results = filterByCompoundPredicates(activeDataset, parsedIntent, userOrigin);

      const searchLabel = parsedIntent.subType || parsedIntent.category || 'location';
      const searchLabelCap = searchLabel.charAt(0).toUpperCase() + searchLabel.slice(1);

      if (results.length === 0) {
        reply = isArabic
          ? `âš ï¸ **Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ "${searchLabel}" ÙÙŠ Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø­Ø§Ù„ÙŠØ©.**`
          : `âš ï¸ **No ${searchLabel}s found in the current dataset.**\n\nTry another category or broaden your search.`;

        suggestions = isArabic
          ? ['Ø¹Ø±Ø¶ Ø§Ù„Ø£Ù…Ø§ÙƒÙ† Ø§Ù„Ø³ÙŠØ§Ø­ÙŠØ©', 'Ø¹Ø±Ø¶ Ø§Ù„Ø­Ø¯Ø§Ø¦Ù‚', 'Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª', 'Ø¹Ø±Ø¶ Ø§Ù„Ù…Ù†Ø´Ø¢Øª Ø§Ù„Ø­ÙƒÙˆÙ…ÙŠØ©']
          : ['Show tourism landmarks', 'Show parks', 'Show hospitals', 'Show government centers'];

        return { reply, results: [], suggestions, datasetsUsed: ['DGE Spatial SDI 2026'] };
      }

      const topItem = results[0];
      actions.push(
        { type: ACTION_TYPES.FILTER_APPLY_MULTI, params: { filters: { category: parsedIntent.category || 'ALL' }, matchingResults: results } },
        { type: ACTION_TYPES.MAP_FLY_TO, params: { lat: topItem.lat, lng: topItem.lng, zoom: 14 } }
      );

      reply = isArabic
        ? `ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ ${results.length} ${searchLabel === 'mosque' ? 'Ù…Ø³Ø¬Ø¯' : searchLabel === 'park' ? 'Ø­Ø¯ÙŠÙ‚Ø©' : 'Ù†ØªØ§Ø¦Ø¬'} Ù…Ø±ØªØ¨Ø© Ø­Ø³Ø¨ Ø§Ù„Ù‚Ø±Ø¨ Ø§Ù„Ø¬ØºØ±Ø§ÙÙŠ:`
        : `Found ${results.length} ${searchLabelCap}${results.length > 1 ? 's' : ''} near your location, ordered by proximity:`;

      suggestions = isArabic
        ? ['Ø£ÙŠÙ‡Ø§ Ø§Ù„Ø£Ù‚Ø±Ø¨ Ù„ÙŠØŸ', 'Ø§Ø¹Ø±Ø¶ Ø§Ù„Ø§ØªØ¬Ø§Ù‡Ø§Øª', 'Ø¶Ø¹ Ù‡Ø°Ø§ ÙÙŠ Ø¬Ø¯ÙˆÙ„']
        : ['Which one is closest?', 'Show me directions'];

      return {
        reply,
        results,
        actions,
        suggestions,
        datasetsUsed: ['DGE Spatial SDI 2026'],
        activeContext: { category: parsedIntent.category, activeLocations: results, selectedFeature: topItem }
      };
    }

    // Default Fallback â€” for completely unrecognized queries, guide the user
    reply = isArabic
      ? `ðŸ¤– ÙŠÙ…ÙƒÙ†Ù†ÙŠ Ù…Ø³Ø§Ø¹Ø¯ØªÙƒ ÙÙŠ Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø§Ù„Ù…ÙˆØ§Ù‚Ø¹ Ø§Ù„Ø¬ØºØ±Ø§ÙÙŠØ© ÙÙŠ Ø£Ø¨ÙˆØ¸Ø¨ÙŠ.\n\nØ¬Ø±Ù‘Ø¨ Ø§Ù„Ø¨Ø­Ø« Ø¹Ù†: **Ù…Ø³Ø§Ø¬Ø¯ØŒ Ù…ØªØ§Ø­ÙØŒ Ø­Ø¯Ø§Ø¦Ù‚ØŒ Ù…Ø³ØªØ´ÙÙŠØ§ØªØŒ Ø¬Ø§Ù…Ø¹Ø§ØªØŒ Ù…Ø­Ø·Ø§Øª Ø´Ø±Ø·Ø©ØŒ Ù…Ø±Ø§ÙƒØ² Ø­ÙƒÙˆÙ…ÙŠØ©**.`
      : `ðŸ¤– I can help you explore Abu Dhabi's GIS dataset.\n\nTry searching for: **mosques, museums, parks, hospitals, universities, police stations, government centers, or bus terminals**.`;

    suggestions = isArabic
      ? ['Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø³Ø§Ø¬Ø¯', 'Ø¹Ø±Ø¶ Ø§Ù„Ø­Ø¯Ø§Ø¦Ù‚', 'Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª', 'Ø¹Ø±Ø¶ Ø§Ù„Ù…ØªØ§Ø­Ù']
      : ['Show mosques', 'Show parks', 'Show hospitals', 'Show museums'];

    return {
      reply,
      results: [],
      actions: [],
      suggestions,
      datasetsUsed: ['DGE Spatial SDI 2026']
    };
  }
};
