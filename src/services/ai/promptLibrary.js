// Master Conversational GIS Prompt Library & Data-Aware Rotation Engine
// Source: SmartMap Phase 2 Approved Prompt Specification (Excel "Example of Prompts (1).xlsx")

export const PROMPT_LIBRARY = {
  PUBLIC_SAFETY: [
    { text_en: "Show police stations near me", text_ar: "اعرض مراكز الشرطة بالقرب مني", theme: "PUBLIC_SAFETY", dataset: "police" },
    { text_en: "Find police stations within 5 km", text_ar: "البحث عن مراكز الشرطة في نطاق 5 كم", theme: "PUBLIC_SAFETY", dataset: "police" },
    { text_en: "Which police station is closest to this location?", text_ar: "أيها مركز الشرطة الأقرب لهذا الموقع؟", theme: "PUBLIC_SAFETY", dataset: "police" },
    { text_en: "Which communities have no nearby ambulance station?", text_ar: "أيها المناطق التي لا تتواجد فيها محطة إسعاف قريبة؟", theme: "PUBLIC_SAFETY", dataset: "ambulance" }
  ],
  TRANSPORTATION: [
    { text_en: "Show bus stops near me", text_ar: "اعرض محطات الحافلات بالقرب مني", theme: "TRANSPORTATION", dataset: "transit" },
    { text_en: "Show parking facilities near this location", text_ar: "اعرض مواقف السيارات بالقرب من هذا الموقع", theme: "TRANSPORTATION", dataset: "parking" },
    { text_en: "Show major roads in this area", text_ar: "اعرض الطرق الرئيسية في هذه المنطقة", theme: "TRANSPORTATION", dataset: "roads" },
    { text_en: "Which hospitals have public transport nearby?", text_ar: "أيها المستشفيات التي تتوفر بالقرب منها وسائل نقل عامة؟", theme: "TRANSPORTATION", dataset: "transit" }
  ],
  TOURISM: [
    { text_en: "Show tourist attractions near me", text_ar: "اعرض المعالم السياحية بالقرب مني", theme: "TOURISM", dataset: "tourism" },
    { text_en: "Show beaches near this location", text_ar: "اعرض الشواطئ بالقرب من هذا الموقع", theme: "TOURISM", dataset: "beaches" },
    { text_en: "Show parks near me", text_ar: "اعرض الحدائق العامة بالقرب مني", theme: "TOURISM", dataset: "parks" },
    { text_en: "Show parks and beaches together", text_ar: "اعرض الحدائق والشواطئ معاً", theme: "TOURISM", dataset: "tourism" },
    { text_en: "Which district has the most tourist facilities?", text_ar: "أيها المنطقة الإدارية التي تضم أكثر عدد من المرافق السياحية؟", theme: "TOURISM", dataset: "tourism" }
  ],
  ENVIRONMENT: [
    { text_en: "Show protected areas in Abu Dhabi", text_ar: "اعرض المحميات الطبيعية في أبوظبي", theme: "ENVIRONMENT", dataset: "environment" },
    { text_en: "Show mangrove areas", text_ar: "اعرض مناطق أشجار القرم", theme: "ENVIRONMENT", dataset: "mangroves" },
    { text_en: "Show air-quality monitoring stations", text_ar: "اعرض محطات رصد جودة الهواء", theme: "ENVIRONMENT", dataset: "air_quality" },
    { text_en: "Find urban projects close to protected areas", text_ar: "البحث عن المشاريع العمرانية القريبة من المحميات", theme: "ENVIRONMENT", dataset: "environment" },
    { text_en: "Which communities overlap environmentally protected areas?", text_ar: "أيها المناطق التي تتقاطع مع المحميات الطبيعية البيئية؟", theme: "ENVIRONMENT", dataset: "environment" }
  ],
  UTILITIES: [
    { text_en: "Show petrol stations near me", text_ar: "اعرض محطات الوقود بالقرب مني", theme: "UTILITIES", dataset: "petrol" },
    { text_en: "Show waste-disposal facilities", text_ar: "اعرض مرافق إدارة ومعالجة النفايات", theme: "UTILITIES", dataset: "waste" },
    { text_en: "Show Wi-Fi hotspots near this location", text_ar: "اعرض نقاط الاتصال بالواي فاي المفتوحة", theme: "UTILITIES", dataset: "wifi" },
    { text_en: "Which community has the most utility facilities?", text_ar: "أيها المنطقة التي تضم أكثر عدد من المرافق العامة؟", theme: "UTILITIES", dataset: "utilities" }
  ],
  URBAN: [
    { text_en: "Show parks in this community", text_ar: "اعرض الحدائق في هذه المنطقة", theme: "URBAN", dataset: "parks" },
    { text_en: "Show sports facilities in this district", text_ar: "اعرض المرافق الرياضية والملاعب في هذا القطاع", theme: "URBAN", dataset: "sports" },
    { text_en: "Show urban development projects", text_ar: "اعرض مشاريع التطوير العمراني الحالية", theme: "URBAN", dataset: "development" },
    { text_en: "Find development projects near protected areas", text_ar: "البحث عن مشاريع التطوير بالقرب من المحميات", theme: "URBAN", dataset: "development" },
    { text_en: "Which communities have the most parks?", text_ar: "أيها المناطق التي تحتوى على أكبر المساحات الخضراء؟", theme: "URBAN", dataset: "parks" }
  ],
  ADMINISTRATIVE: [
    { text_en: "Show district boundaries", text_ar: "اعرض حدود القطاعات الإدارية", theme: "ADMINISTRATIVE", dataset: "districts" },
    { text_en: "Show community boundaries", text_ar: "اعرض حدود المناطق والمجتمعات", theme: "ADMINISTRATIVE", dataset: "communities" },
    { text_en: "Which district is this location in?", text_ar: "في أي قطاع إداري يقع هذا الموقع؟", theme: "ADMINISTRATIVE", dataset: "districts" },
    { text_en: "Which community am I currently in?", text_ar: "في أي منطقة إدارية أتواجد حالياً؟", theme: "ADMINISTRATIVE", dataset: "communities" },
    { text_en: "Show communities within this district", text_ar: "اعرض جميع المناطق التابعة لهذا القطاع", theme: "ADMINISTRATIVE", dataset: "communities" }
  ],
  AGRICULTURE: [
    { text_en: "Show agricultural areas in Abu Dhabi", text_ar: "اعرض المناطق الزراعية في أبوظبي", theme: "AGRICULTURE", dataset: "agriculture" },
    { text_en: "Show farms within this district", text_ar: "اعرض المزارع والمرافق الزراعية في هذا القطاع", theme: "AGRICULTURE", dataset: "farms" },
    { text_en: "Show water-related features in this area", text_ar: "اعرض المعالم المائية والهيدروغرافية", theme: "AGRICULTURE", dataset: "water" },
    { text_en: "Show the land-use categories in this district", text_ar: "اعرض تصنيفات استخدام الأراضي في هذا القطاع", theme: "AGRICULTURE", dataset: "land_use" }
  ],
  CROSS_THEME: [
    { text_en: "Which communities have schools, hospitals and parks nearby?", text_ar: "أيها المناطق التي تتواجد فيها مدارس ومستشفيات وحدائق بالقرب منها؟", theme: "CROSS_THEME", dataset: "multi" },
    { text_en: "Find schools within 500 m of bus stops", text_ar: "البحث عن المدارس الواقعة ضمن 500 متر من محطات الحافلات", theme: "CROSS_THEME", dataset: "multi" },
    { text_en: "Show hospitals within 1 km of major roads", text_ar: "اعرض المستشفيات الواقعة ضمن 1 كم من الطرق الرئيسية", theme: "CROSS_THEME", dataset: "multi" }
  ],
  EDUCATION: [
    { text_en: "Show schools in Khalifa City", text_ar: "اعرض المدارس في مدينة خليفة", theme: "EDUCATION", dataset: "schools" },
    { text_en: "Find schools near my location", text_ar: "البحث عن المدارس بالقرب من موقعي", theme: "EDUCATION", dataset: "schools" },
    { text_en: "Which schools have a bus stop within 500 m?", text_ar: "أيها المدارس التي توجد محطة حافلات على مسافة 500م منها؟", theme: "EDUCATION", dataset: "schools" }
  ],
  HEALTHCARE: [
    { text_en: "Show hospitals near my location", text_ar: "اعرض المستشفيات بالقرب من موقعي", theme: "HEALTHCARE", dataset: "hospitals" },
    { text_en: "Find pharmacies within 2 km of this hospital", text_ar: "البحث عن الصيدليات ضمن 2 كم من هذا المستشفى", theme: "HEALTHCARE", dataset: "hospitals" },
    { text_en: "Which hospital is closest to my location?", text_ar: "أيها المستشفى الأقرب لموقعي الحالي؟", theme: "HEALTHCARE", dataset: "hospitals" }
  ]
};

// Rotates suggestions across diverse themes (Public Safety, Transport, Tourism, Environment, Utilities, Urban, Administrative, Agriculture)
// Keeps Education and Healthcare limited to 1-2 items max in any rotation group.
export function getRotatedPromptSuggestions(isArabic = false, seed = 0) {
  const rotationGroups = [
    // ROTATION A (Government, Tourism, Transport, Public Safety, Environment)
    [
      PROMPT_LIBRARY.PUBLIC_SAFETY[0], // Police stations near me
      PROMPT_LIBRARY.TOURISM[0],       // Tourist attractions near me
      PROMPT_LIBRARY.TRANSPORTATION[0], // Bus stops near me
      PROMPT_LIBRARY.ENVIRONMENT[0],   // Protected areas
      PROMPT_LIBRARY.UTILITIES[0],      // Petrol stations near me
      PROMPT_LIBRARY.PUBLIC_SAFETY[3]   // Ambulance gap analysis
    ],
    // ROTATION B (Parks, Utilities, Urban, Administrative, Agriculture)
    [
      PROMPT_LIBRARY.TOURISM[2],       // Parks near me
      PROMPT_LIBRARY.UTILITIES[1],      // Waste disposal facilities
      PROMPT_LIBRARY.URBAN[2],          // Urban development projects
      PROMPT_LIBRARY.ADMINISTRATIVE[0], // District boundaries
      PROMPT_LIBRARY.AGRICULTURE[0],   // Agricultural areas
      PROMPT_LIBRARY.PUBLIC_SAFETY[1]   // Police stations within 5 km
    ],
    // ROTATION C (Cross-theme, Proximity, Ranking, Gap Analysis)
    [
      PROMPT_LIBRARY.CROSS_THEME[0],    // Communities with schools, hospitals & parks
      PROMPT_LIBRARY.CROSS_THEME[1],    // Schools within 500 m of bus stops
      PROMPT_LIBRARY.ENVIRONMENT[3],   // Urban projects near protected areas
      PROMPT_LIBRARY.TRANSPORTATION[1], // Parking facilities
      PROMPT_LIBRARY.TOURISM[1],       // Beaches near this location
      PROMPT_LIBRARY.HEALTHCARE[0]      // Hospitals near my location (occasional)
    ]
  ];

  const groupIndex = Math.abs(seed) % rotationGroups.length;
  const group = rotationGroups[groupIndex];

  return group.map(p => isArabic ? p.text_ar : p.text_en);
}
