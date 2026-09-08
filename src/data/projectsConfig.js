// Central Configuration Repository for SmartMap Phase 2 Projects
// Defines dynamic datasets, GIS categories, result/detail schemas, map settings, and AI contexts per project

export const PROJECTS_CONFIG = [
  // -------------------------------------------------------------
  // PROJECT 1: TOURISM & CULTURAL HERITAGE
  // -------------------------------------------------------------
  {
    id: 'tourism-culture',
    name: 'Tourism & Cultural Heritage',
    name_ar: 'السياحة والتراث الثقافي',
    description: 'World-class museums, historic forts, cultural palaces, and waterfront landmarks across Abu Dhabi.',
    description_ar: 'المتاحف العالمية والقلاع التاريخية والقلاع الثقافية والمعالم البحرية عبر إمارة أبوظبي.',
    domain: 'Tourism',
    geography: 'Saadiyat & Corniche Cultural Corridor',
    defaultCenter: { lat: 24.5000, lng: 54.3800 },
    defaultZoom: 12,
    badgeLabel: 'Sample project data',
    badgeLabel_ar: 'بيانات مشروع عينة',
    
    // Dynamic GIS Category Drawer
    categories: [
      {
        id: 'cat-tour-1',
        title: 'Cultural Landmarks',
        title_ar: 'معالم وثقافة',
        iconName: 'Building2',
        color: '#8b5cf6',
        subcategories: [
          { id: 'sub-tour-101', label: 'Museums & Galleries', label_ar: 'متاحف ومعارض', filterType: 'TOURISM', filterValue: 'Museum' },
          { id: 'sub-tour-102', label: 'Cultural Palaces', label_ar: 'قصور ثقافية', filterType: 'TOURISM', filterValue: 'Palace' }
        ]
      },
      {
        id: 'cat-tour-2',
        title: 'Architectural Landmarks',
        title_ar: 'معالم معمارية',
        iconName: 'Sparkles',
        color: '#3b82f6',
        subcategories: [
          { id: 'sub-tour-201', label: 'Grand Mosques', label_ar: 'جوامع تاريخية', filterType: 'TOURISM', filterValue: 'Mosque' },
          { id: 'sub-tour-202', label: 'Heritage Sites', label_ar: 'مواقع تراثية', filterType: 'TOURISM', filterValue: 'Heritage' }
        ]
      },
      {
        id: 'cat-tour-3',
        title: 'Parks & Recreation',
        title_ar: 'حدائق ومتنزهات',
        iconName: 'Trees',
        color: '#10b981',
        subcategories: [
          { id: 'sub-tour-301', label: 'Botanical Parks', label_ar: 'حدائق نباتية', filterType: 'PARK', filterValue: 'Park' },
          { id: 'sub-tour-302', label: 'Waterfront Parks', label_ar: 'متنزهات بحرية', filterType: 'PARK', filterValue: 'Waterfront' }
        ]
      }
    ],

    // Project Dataset
    datasets: [
      {
        id: 201,
        name: 'Louvre Abu Dhabi',
        name_ar: 'متحف اللوفر أبوظبي',
        type: 'TOURISM',
        subType: 'Museum',
        category_en: 'Universal Art Museum',
        category_ar: 'متحف عالمي للفنون',
        location: 'Saadiyat Cultural District',
        location_ar: 'المنطقة الثقافية بالسعديات',
        district: 'Saadiyat Island',
        lat: 24.5338,
        lng: 54.3982,
        rating: 4.9,
        annualVisitors: 1250000,
        ticketTier: 'AED 63 Standard',
        ticketTier_ar: '63 درهم تذكرة عادية',
        heritageDesignation: 'Universal Cultural Landmark',
        heritageDesignation_ar: 'معلم عالمي للثقافة والفنون',
        isCoastal: true,
        description: 'Iconic universal museum displaying global art under Jean Nouvel’s rain-of-light dome.',
        description_ar: 'متحف عالمي بارز يعرض الأعمال الفنية والتاريخية تحت قبة النور المعمارية.',
        tags: ['tourism', 'museum', 'louvre', 'saadiyat', 'art', 'culture', 'waterfront']
      },
      {
        id: 202,
        name: 'Qasr Al Watan Cultural Palace',
        name_ar: 'قصر الوطن الثقافي',
        type: 'TOURISM',
        subType: 'Palace',
        category_en: 'Presidential Palace & Library',
        category_ar: 'قصر رئاسي ومكتبة ثقافية',
        location: 'Al Ras Al Akhdar',
        location_ar: 'الرأس الأخضر',
        district: 'Al Ras Al Akhdar',
        lat: 24.4628,
        lng: 54.3056,
        rating: 4.8,
        annualVisitors: 850000,
        ticketTier: 'AED 65 Standard',
        ticketTier_ar: '65 درهم تذكرة عادية',
        heritageDesignation: 'Active Presidential & Cultural Palace',
        heritageDesignation_ar: 'قصر رئاسي وثقافي حي',
        isCoastal: true,
        description: 'Working presidential palace celebrating Arabian heritage, artistry, and governance.',
        description_ar: 'قصر رئاسي حي يحتفي بالتراث المعماري والحوكمة والثقافة العربية.',
        tags: ['tourism', 'palace', 'qasr al watan', 'heritage', 'culture']
      },
      {
        id: 203,
        name: 'Sheikh Zayed Grand Mosque Center',
        name_ar: 'مركز جامع الشيخ زايد الكبير',
        type: 'TOURISM',
        subType: 'Mosque',
        category_en: 'Architectural Landmark',
        category_ar: 'معلم معماري إسلامي',
        location: 'Al Rawdah',
        location_ar: 'الروضة',
        district: 'Al Rawdah',
        lat: 24.4128,
        lng: 54.4750,
        rating: 4.95,
        annualVisitors: 4500000,
        ticketTier: 'Free Entry',
        ticketTier_ar: 'دخول مجاني',
        heritageDesignation: 'Primary Islamic Architectural Landmark',
        heritageDesignation_ar: 'الصرح المعماري والتراثي الأبرز في الإمارة',
        isCoastal: false,
        description: 'Monumental architectural masterpiece and primary cultural landmark of Abu Dhabi.',
        description_ar: 'صرح معماري إسلامي عالمي بارز يعتبر المعلم الديني والثقافي الأكبر في الإمارة.',
        tags: ['tourism', 'mosque', 'sheikh zayed', 'grand mosque', 'heritage']
      },
      {
        id: 204,
        name: 'Umm Al Emarat Park & Eco Hub',
        name_ar: 'حديقة أم الإمارات والمركز البيئي',
        type: 'PARK',
        subType: 'Park',
        category_en: 'Botanical & Eco Park',
        category_ar: 'حديقة نباتية وبيئية',
        location: 'Al Mushrif',
        location_ar: 'المشرف',
        district: 'Al Mushrif',
        lat: 24.4533,
        lng: 54.3879,
        rating: 4.7,
        annualVisitors: 620000,
        ticketTier: 'AED 10 Entry',
        ticketTier_ar: '10 دراهم دخول',
        heritageDesignation: 'Historic Civic & Eco Park',
        heritageDesignation_ar: 'حديقة تاريخية وبيئية',
        isCoastal: false,
        description: 'Historic public park featuring shade botanical gardens, shade structures, and eco-learning spaces.',
        description_ar: 'حديقة تاريخية بارزة تضم حدائق نباتية ومساحات بيئية خضراء مظللة.',
        tags: ['park', 'environment', 'umm al emarat', 'mushrif', 'green']
      },
      {
        id: 205,
        name: 'Yas Gateway Park North',
        name_ar: 'حديقة ياس جيتواي الشمالية',
        type: 'PARK',
        subType: 'Waterfront',
        category_en: 'Recreational Park',
        category_ar: 'حديقة ترفيهية خضراء',
        location: 'Yas Island',
        location_ar: 'جزيرة ياس',
        district: 'Yas Island',
        lat: 24.4920,
        lng: 54.6020,
        rating: 4.6,
        annualVisitors: 410000,
        ticketTier: 'Free Entry',
        ticketTier_ar: 'دخول مجاني',
        heritageDesignation: 'Island Recreational Park',
        heritageDesignation_ar: 'متنزه خضر لجزيرة ياس',
        isCoastal: true,
        description: 'Lush green park situated at the entrance of Yas Island with shaded sports tracks.',
        description_ar: 'حديقة خضراء واسعة عند مدخل جزيرة ياس تتميز بمسارات رياضية مظللة.',
        tags: ['park', 'yas island', 'green', 'recreation']
      }
    ],

    // Search Suggestions
    searchSuggestions: [
      'Show attractions nearby',
      'Highest rated cultural landmarks',
      'Museums in Saadiyat District',
      'Popular heritage destinations'
    ],
    searchSuggestions_ar: [
      'عرض الأماكن السياحية القريبة',
      'أعلى المعالم الثقافية تقييماً',
      'المتاحف في منطقة السعديات',
      'الوجهات التراثية الأكثر زيارة'
    ],

    // Schema Driven Display Rules
    resultSchema: [
      { field: 'name', label: 'Landmark Name', label_ar: 'اسم المعلم' },
      { field: 'category_en', label: 'Category', label_ar: 'الفئة' },
      { field: 'rating', label: 'Visitor Rating', label_ar: 'تقييم الزوار', format: 'rating' },
      { field: 'district', label: 'District', label_ar: 'المنطقة' },
      { field: 'ticketTier', label: 'Ticket Tier', label_ar: 'سعر التذكرة' }
    ],

    detailSchema: [
      { field: 'name', label: 'Official Name', label_ar: 'الاسم الرسمي' },
      { field: 'category_en', label: 'Landmark Classification', label_ar: 'تصنيف المعلم' },
      { field: 'rating', label: 'Visitor Rating', label_ar: 'التقييم العام', format: 'rating' },
      { field: 'annualVisitors', label: 'Est. Annual Visitors', label_ar: 'الزوار السنويون', format: 'number' },
      { field: 'ticketTier', label: 'Admission Fee', label_ar: 'رسوم الدخول' },
      { field: 'heritageDesignation', label: 'Heritage Designation', label_ar: 'التصنيف الثقافي والتراثي' },
      { field: 'district', label: 'District Location', label_ar: 'الموقع' },
      { field: 'description', label: 'Overview', label_ar: 'نبذة عن المعلم' }
    ],

    analyticsConfig: {
      supportedMetrics: ['visitors', 'rating'],
      chartTitle: 'Annual Tourism Visitor Volumes',
      chartTitle_ar: 'أعداد الزوار السنوية للمعالم السياحية',
      unit: 'visitors',
      unit_ar: 'زائر'
    },

    mapConfig: {
      defaultBasemap: 'satellite',
      allowedBasemaps: ['satellite', 'streets', 'dark', 'topo']
    },

    aiContext: {
      welcomeMessage: "Welcome to the **Tourism & Cultural Heritage** GIS Workspace. Explore world-class museums, cultural palaces, and waterfront parks.",
      welcomeMessage_ar: "مرحباً بك في منصة **السياحة والتراث الثقافي**. استكشف المتاحف العالمية والقصور الثقافية والمتنزهات البحرية.",
      persona: "Tourism GIS Advisor"
    }
  },

  // -------------------------------------------------------------
  // PROJECT 2: CIVIC INFRASTRUCTURE & UTILITIES
  // -------------------------------------------------------------
  {
    id: 'civic-infrastructure',
    name: 'Civic Infrastructure & Utilities',
    name_ar: 'البنية التحتية والمرافق العامة',
    description: 'Energy desalination complexes, power substations, waste treatment plants, and critical utility networks.',
    description_ar: 'مجمعات تحلية المياه والطاقة ومحطات التدوير ومعالجة النفايات وشبكات المرافق الاستراتيجية.',
    domain: 'Infrastructure',
    geography: 'Al Taweelah & Mussafah Industrial Corridors',
    defaultCenter: { lat: 24.6000, lng: 54.6000 },
    defaultZoom: 10,
    badgeLabel: 'Sample project data',
    badgeLabel_ar: 'بيانات مشروع عينة',

    // Dynamic GIS Category Drawer
    categories: [
      {
        id: 'cat-infra-1',
        title: 'Power & Desalination',
        title_ar: 'الطاقة والمياه',
        iconName: 'Zap',
        color: '#ef4444',
        subcategories: [
          { id: 'sub-infra-101', label: 'Desalination Complexes', label_ar: 'محطات تحلية المياه', filterType: 'CIVIC_INFRASTRUCTURE', filterValue: 'Desalination' },
          { id: 'sub-infra-102', label: 'Power Grid Substations', label_ar: 'محطات توليد الطاقة', filterType: 'CIVIC_INFRASTRUCTURE', filterValue: 'Power' }
        ]
      },
      {
        id: 'cat-infra-2',
        title: 'Waste & Recycling',
        title_ar: 'إدارة النفايات',
        iconName: 'Recycle',
        color: '#f59e0b',
        subcategories: [
          { id: 'sub-infra-201', label: 'Eco Recycling Hubs', label_ar: 'مجمعات التدوير والبيئة', filterType: 'CIVIC_INFRASTRUCTURE', filterValue: 'Waste' },
          { id: 'sub-infra-202', label: 'Wastewater Treatment', label_ar: 'معالجة المياه العادمة', filterType: 'CIVIC_INFRASTRUCTURE', filterValue: 'Sewerage' }
        ]
      }
    ],

    // Project Dataset
    datasets: [
      {
        id: 901,
        name: 'Al Taweelah Power & Desalination Complex',
        name_ar: 'مجمّع الطويلة للطاقة وتحلية المياه',
        type: 'CIVIC_INFRASTRUCTURE',
        subType: 'Desalination',
        category_en: 'Strategic Water & Power Facility',
        category_ar: 'مجمع استراتيجي للمياه والطاقة',
        location: 'Al Taweelah',
        location_ar: 'الطويلة',
        district: 'Al Taweelah',
        lat: 24.7810,
        lng: 54.7120,
        riskLevel: 'High',
        riskScore: 84,
        waterConsumption: 180000,
        emissionsIndex: 125000,
        capacity: 900000,
        gridLoadIndex: '94% Peak Load',
        gridLoadIndex_ar: '94% الحمل الأقصى',
        substationZone: 'Zone A-4 East',
        substationZone_ar: 'المنطقة أ-4 الشرقية',
        isCoastal: true,
        hasAlerts: true,
        description: 'Major desalinated water supply and power generation facility powering Abu Dhabi Emirate.',
        description_ar: 'المجمع الرئيسي لإمدادات المياه المحلاة وتوليد الطاقة لإمارة أبوظبي.',
        tags: ['infrastructure', 'desalination', 'power', 'taweelah', 'water', 'critical']
      },
      {
        id: 902,
        name: 'Mussafah Eco & Waste Recycling Complex',
        name_ar: 'مجمع مصفح البيئي وإعادة التدوير',
        type: 'CIVIC_INFRASTRUCTURE',
        subType: 'Waste',
        category_en: 'Materials Recovery & Recycling',
        category_ar: 'منشأة تدوير ومعالجة بيئية',
        location: 'Mussafah Industrial',
        location_ar: 'مصفح الصناعية',
        district: 'Mussafah',
        lat: 24.3450,
        lng: 54.5210,
        riskLevel: 'Moderate',
        riskScore: 68,
        waterConsumption: 12400,
        emissionsIndex: 42000,
        capacity: 15000,
        gridLoadIndex: '62% Normal Load',
        gridLoadIndex_ar: '62% تشغيل طبيعي',
        substationZone: 'Zone M-12 South',
        substationZone_ar: 'المنطقة م-12 الجنوبية',
        isCoastal: false,
        hasAlerts: false,
        description: 'Civic environmental waste treatment and materials recovery facility in Mussafah.',
        description_ar: 'منشأة معالجة النفايات البيئية واستعادة المواد بمصفح.',
        tags: ['infrastructure', 'waste', 'recycling', 'mussafah', 'environment']
      },
      {
        id: 903,
        name: 'Abu Dhabi Sewerage Services Center - Al Wathba',
        name_ar: 'مركز أبوظبي لخدمات الصرف الصحي - الوثبة',
        type: 'CIVIC_INFRASTRUCTURE',
        subType: 'Sewerage',
        category_en: 'Wastewater Treatment Complex',
        category_ar: 'محطة معالجة مياه الصرف الصحي',
        location: 'Al Wathba',
        location_ar: 'الوثبة',
        district: 'Al Wathba',
        lat: 24.2389,
        lng: 54.6890,
        riskLevel: 'Moderate',
        riskScore: 54,
        waterConsumption: 95000,
        emissionsIndex: 31000,
        capacity: 300000,
        gridLoadIndex: '78% Capacity',
        gridLoadIndex_ar: '78% السعة الاستيعابية',
        substationZone: 'Zone W-2 Central',
        substationZone_ar: 'المنطقة و-2 الوسطى',
        isCoastal: false,
        hasAlerts: false,
        description: 'Central recycled water production and sanitation treatment plant in Al Wathba.',
        description_ar: 'محطة المعالجة المركزية وإعادة إنتاج المياه المعالجة بالوثبة.',
        tags: ['infrastructure', 'sewerage', 'water', 'wathba']
      }
    ],

    // Search Suggestions
    searchSuggestions: [
      'Show critical infrastructure',
      'Find high-risk utility assets',
      'Compare energy emissions between Mussafah and Taweelah',
      'Show assets requiring attention'
    ],
    searchSuggestions_ar: [
      'عرض منشآت البنية التحتية الحرجة',
      'البحث عن أصول المرافق عالية الخطورة',
      'مقارنة انبعاثات الطاقة بين مصفح والطويلة',
      'عرض المنشآت التي تتطلب صيانة'
    ],

    // Schema Driven Display Rules
    resultSchema: [
      { field: 'name', label: 'Asset Name', label_ar: 'اسم المنشأة' },
      { field: 'category_en', label: 'Category', label_ar: 'الفئة' },
      { field: 'riskLevel', label: 'Risk Level', label_ar: 'مستوى الخطورة', format: 'badge' },
      { field: 'emissionsIndex', label: 'Emissions (tCO2e)', label_ar: 'الانبعاثات (طن مكافئ)', format: 'number' },
      { field: 'district', label: 'District', label_ar: 'المنطقة' }
    ],

    detailSchema: [
      { field: 'name', label: 'Asset Identifier', label_ar: 'اسم المنشأة' },
      { field: 'category_en', label: 'Facility Type', label_ar: 'نوع المنشأة' },
      { field: 'riskLevel', label: 'Risk Rating', label_ar: 'مستوى الخطورة', format: 'badge' },
      { field: 'riskScore', label: 'Composite Risk Score', label_ar: 'مؤشر الخطورة المركب', format: 'score' },
      { field: 'emissionsIndex', label: 'Emissions Index (tCO2e)', label_ar: 'انبعاثات الكربون السنوية', format: 'number' },
      { field: 'waterConsumption', label: 'Water Usage (m³/day)', label_ar: 'استهلاك المياه اليومي', format: 'number' },
      { field: 'gridLoadIndex', label: 'Grid Load Status', label_ar: 'حمل شبكة الكهرباء' },
      { field: 'substationZone', label: 'Substation Grid Zone', label_ar: 'منطقة الشبكة الفرعية' },
      { field: 'district', label: 'District Location', label_ar: 'الموقع' },
      { field: 'description', label: 'Operational Overview', label_ar: 'تفاصيل التشغيل' }
    ],

    analyticsConfig: {
      supportedMetrics: ['emissions', 'riskScore', 'waterConsumption'],
      chartTitle: 'Industrial Utility Emissions & Risk Index',
      chartTitle_ar: 'انبعاثات المرافق الصناعية ومؤشر المخاطر',
      unit: 'tCO2e',
      unit_ar: 'طن كربون'
    },

    mapConfig: {
      defaultBasemap: 'dark',
      allowedBasemaps: ['dark', 'satellite', 'streets', 'topo']
    },

    aiContext: {
      welcomeMessage: "Welcome to the **Civic Infrastructure & Utilities** GIS Workspace. Monitor desalination complexes, energy plants, emissions, and risk levels.",
      welcomeMessage_ar: "مرحباً بك في منصة **البنية التحتية والمرافق العامة**. تابع مجمعات التحلية ومحطات الطاقة والانبعاثات ومستويات الخطورة.",
      persona: "Infrastructure & Risk Analyst"
    }
  },

  // -------------------------------------------------------------
  // PROJECT 3: GOVERNMENT ENABLEMENT & CIVIC HUBS
  // -------------------------------------------------------------
  {
    id: 'government-services',
    name: 'Government Enablement & Civic Hubs',
    name_ar: 'التمكين الحكومي والخدمات العامة',
    description: 'Executive governance headquarters, TAMM customer service centers, municipal hubs, and judicial service facilities.',
    description_ar: 'المقرات الحكومية التنفيذية ومراكز تم لخدمات المتعاملين والمراكز البلدية والدائرية القضائية.',
    domain: 'Government',
    geography: 'Abu Dhabi Capital & Municipal Centers',
    defaultCenter: { lat: 24.4789, lng: 54.3400 },
    defaultZoom: 13,
    badgeLabel: 'Sample project data',
    badgeLabel_ar: 'بيانات مشروع عينة',

    // Dynamic GIS Category Drawer
    categories: [
      {
        id: 'cat-govt-1',
        title: 'Executive Governance',
        title_ar: 'التمكين التنفيذي',
        iconName: 'Building',
        color: '#0284c7',
        subcategories: [
          { id: 'sub-govt-101', label: 'DGE Headquarters', label_ar: 'مقرات التمكين الحكومي', filterType: 'GOVERNMENT', filterValue: 'Executive' },
          { id: 'sub-govt-102', label: 'Judicial & Legal Centers', label_ar: 'دوائر قضائية وعدلية', filterType: 'GOVERNMENT', filterValue: 'Judicial' }
        ]
      },
      {
        id: 'cat-govt-2',
        title: 'Unified Customer Hubs',
        title_ar: 'مراكز الخدمة الموحدة',
        iconName: 'Users',
        color: '#059669',
        subcategories: [
          { id: 'sub-govt-201', label: 'TAMM Customer Hubs', label_ar: 'مراكز تم الموحدة', filterType: 'GOVERNMENT', filterValue: 'TAMM' },
          { id: 'sub-govt-202', label: 'Municipal Service Hubs', label_ar: 'مراكز خدمات البلدية', filterType: 'GOVERNMENT', filterValue: 'Municipal' }
        ]
      }
    ],

    // Project Dataset
    datasets: [
      {
        id: 101,
        name: 'Department of Government Enablement (DGE) HQ',
        name_ar: 'دائرة التمكين الحكومي - المقر الرئيسي',
        type: 'GOVERNMENT',
        subType: 'Executive',
        category_en: 'Executive Governance HQ',
        category_ar: 'منشأة حكومية تنفيذية',
        location: 'Corniche West',
        location_ar: 'طريق الكورنيش الغربي',
        district: 'Corniche West',
        lat: 24.4789,
        lng: 54.3312,
        rating: 4.9,
        dailyVisitorCap: 2100,
        departmentCode: 'DGE-HQ-01',
        serviceCounterStatus: 'Active (24 Counters)',
        serviceCounterStatus_ar: 'نشط (24 كاونتر خدمة)',
        description: 'Headquarters driving Abu Dhabi spatial data infrastructure, digital enablement, and government excellence.',
        description_ar: 'المقر الرئيسي المعني بالبنية المكانية للبيانات والتحول الرقمي والتفوق الحكومي.',
        tags: ['government', 'dge', 'sdi', 'enablement', 'headquarters', 'corniche']
      },
      {
        id: 102,
        name: 'TAMM Customer Service Hub - Al Reem',
        name_ar: 'مركز تم لخدمات المتعاملين - الريم',
        type: 'GOVERNMENT',
        subType: 'TAMM',
        category_en: 'Unified Customer Services',
        category_ar: 'خدمات حكومية موحدة',
        location: 'Al Reem Island',
        location_ar: 'جزيرة الريم',
        district: 'Al Reem Island',
        lat: 24.5028,
        lng: 54.4056,
        rating: 4.8,
        dailyVisitorCap: 3500,
        departmentCode: 'TAMM-REEM-04',
        serviceCounterStatus: 'Active (32 Counters)',
        serviceCounterStatus_ar: 'نشط (32 كاونتر خدمة)',
        description: 'Unified Abu Dhabi government customer service center providing smart digital transactions.',
        description_ar: 'مركز الخدمات الحكومية الموحدة تم الخادم لسكان وشركات جزيرة الريم.',
        tags: ['government', 'tamm', 'public service', 'reem', 'civic']
      },
      {
        id: 103,
        name: 'Abu Dhabi Municipality Main Service Center',
        name_ar: 'مركز بلدية أبوظبي الرئيسي',
        type: 'GOVERNMENT',
        subType: 'Municipal',
        category_en: 'Municipal Permits & Land Registry',
        category_ar: 'خدمات بلدية وتصاريح',
        location: 'Al Zahiyah',
        location_ar: 'الزاهية',
        district: 'Al Zahiyah',
        lat: 24.4920,
        lng: 54.3735,
        rating: 4.7,
        dailyVisitorCap: 2500,
        departmentCode: 'ADM-MAIN-02',
        serviceCounterStatus: 'Active (18 Counters)',
        serviceCounterStatus_ar: 'نشط (18 كاونتر خدمة)',
        description: 'Central municipal hub managing urban planning, building permits, and public land GIS registries.',
        description_ar: 'المركز الرئيسي لخدمات البلدية والمعني بالتخطيط العمراني وتصاريح الأراضي.',
        tags: ['government', 'municipality', 'permits', 'urban planning', 'zahiyah']
      },
      {
        id: 104,
        name: 'Abu Dhabi Judicial Department HQ',
        name_ar: 'مقر دائرة القضاء - أبوظبي',
        type: 'GOVERNMENT',
        subType: 'Judicial',
        category_en: 'Judicial & Legal Services',
        category_ar: 'خدمات قضائية وعدلية',
        location: 'Al Khubeirah',
        location_ar: 'الخبيرة',
        district: 'Al Khubeirah',
        lat: 24.4601,
        lng: 54.3412,
        rating: 4.85,
        dailyVisitorCap: 1800,
        departmentCode: 'ADJD-HQ-01',
        serviceCounterStatus: 'Active (16 Counters)',
        serviceCounterStatus_ar: 'نشط (16 كاونتر خدمة)',
        description: 'Primary judicial complex overseeing civil, commercial, and administrative dispute resolution.',
        description_ar: 'المجمع القضائي الرئيسي المعني بخدمات القضاء والعدل والتوثيق.',
        tags: ['government', 'judicial', 'adjd', 'khubeirah']
      }
    ],

    // Search Suggestions
    searchSuggestions: [
      'Show TAMM centers nearby',
      'Find DGE headquarters',
      'Public service centers in Al Reem',
      'Municipal building permit centers'
    ],
    searchSuggestions_ar: [
      'عرض مراكز تم القريبة',
      'البحث عن مقر دائرة التمكين الحكومي',
      'مراكز الخدمات العامة في جزيرة الريم',
      'مراكز تصاريح البناء التابعة للبلدية'
    ],

    // Schema Driven Display Rules
    resultSchema: [
      { field: 'name', label: 'Center Name', label_ar: 'اسم المركز' },
      { field: 'category_en', label: 'Service Category', label_ar: 'فئة الخدمة' },
      { field: 'dailyVisitorCap', label: 'Daily Capacity', label_ar: 'الطاقة الاستيعابية اليومية', format: 'number' },
      { field: 'district', label: 'District', label_ar: 'المنطقة' }
    ],

    detailSchema: [
      { field: 'name', label: 'Entity Name', label_ar: 'الاسم الرسمي' },
      { field: 'category_en', label: 'Governance Classification', label_ar: 'التصنيف الحكومي' },
      { field: 'departmentCode', label: 'Department Code', label_ar: 'رمز الدائرة' },
      { field: 'dailyVisitorCap', label: 'Daily Visitor Capacity', label_ar: 'الطاقة اليومية لخدمة المتعاملين', format: 'number' },
      { field: 'serviceCounterStatus', label: 'Service Counters Status', label_ar: 'حالة كاونترات الخدمة' },
      { field: 'district', label: 'District Location', label_ar: 'الموقع' },
      { field: 'description', label: 'Mandate Overview', label_ar: 'مهام المركز' }
    ],

    analyticsConfig: {
      supportedMetrics: ['dailyVisitorCap', 'rating'],
      chartTitle: 'Government Service Counter Capacities',
      chartTitle_ar: 'الطاقة الاستيعابية لكاونترات الخدمات الحكومية',
      unit: 'visitors/day',
      unit_ar: 'متعامل/يوم'
    },

    mapConfig: {
      defaultBasemap: 'abu-dhabi-dge',
      allowedBasemaps: ['abu-dhabi-dge', 'streets', 'satellite', 'dark']
    },

    aiContext: {
      welcomeMessage: "Welcome to the **Government Enablement & Civic Hubs** GIS Workspace. Locate TAMM centers, municipal services, and executive headquarters.",
      welcomeMessage_ar: "مرحباً بك في منصة **التمكين الحكومي والخدمات العامة**. حدد موقع مراكز تم والخدمات البلدية والمقرات التنفيذية.",
      persona: "Government Services Navigator"
    }
  },

  // -------------------------------------------------------------
  // PROJECT 4: MOBILITY & PUBLIC TRANSIT NETWORK
  // -------------------------------------------------------------
  {
    id: 'mobility-transit',
    name: 'Mobility & Public Transit Network',
    name_ar: 'شبكة النقل والمواصلات العامة',
    description: 'Intercity bus terminals, international airport hubs, maritime cruise terminals, and public transit interchanges.',
    description_ar: 'محطات الحافلات الرئيسية والمطارات الدولية وموانئ السفن السياحية ومحاور الترانزيت.',
    domain: 'Mobility',
    geography: 'Abu Dhabi Transit Corridors & Transport Hubs',
    defaultCenter: { lat: 24.4500, lng: 54.4500 },
    defaultZoom: 11,
    badgeLabel: 'Sample project data',
    badgeLabel_ar: 'بيانات مشروع عينة',

    // Dynamic GIS Category Drawer
    categories: [
      {
        id: 'cat-mob-1',
        title: 'Intercity & Transit Terminals',
        title_ar: 'محطات النقل والترانزيت',
        iconName: 'Bus',
        color: '#ec4899',
        subcategories: [
          { id: 'sub-mob-101', label: 'Bus Terminals', label_ar: 'محطات الحافلات الرئيسية', filterType: 'TRANSPORT', filterValue: 'Bus' },
          { id: 'sub-mob-102', label: 'Express Transit Hubs', label_ar: 'محاور الحافلات السريعة', filterType: 'TRANSPORT', filterValue: 'Express' }
        ]
      },
      {
        id: 'cat-mob-2',
        title: 'Aviation & Port Terminals',
        title_ar: 'المطارات والموانئ',
        iconName: 'Plane',
        color: '#6366f1',
        subcategories: [
          { id: 'sub-mob-201', label: 'Airport Passenger Hubs', label_ar: 'مطارات الركاب الدولية', filterType: 'TRANSPORT', filterValue: 'Airport' },
          { id: 'sub-mob-202', label: 'Maritime Cruise Ports', label_ar: 'موانئ المحطات البحرية', filterType: 'TRANSPORT', filterValue: 'Port' }
        ]
      }
    ],

    // Project Dataset
    datasets: [
      {
        id: 15,
        name: 'Abu Dhabi Central Bus Terminal',
        name_ar: 'محطة حافلات أبوظبي الرئيسية',
        type: 'TRANSPORT',
        subType: 'Bus',
        category_en: 'Intercity Bus Terminal',
        category_ar: 'محطة حافلات رئيسية',
        location: 'Al Nahyan',
        location_ar: 'آل نهيان',
        district: 'Al Nahyan',
        lat: 24.4719,
        lng: 54.3725,
        rating: 4.4,
        dailyCommuters: 25000,
        transitRoutesServed: '34 Regional Routes',
        transitRoutesServed_ar: '34 خطاً إقليمياً',
        evChargingBays: 12,
        isCoastal: false,
        description: 'Primary intercity transit hub connecting Abu Dhabi to regional municipal districts.',
        description_ar: 'المحطة الرئيسية للنقل العام والحافلات التي تربط مدينة أبوظبي بالمعالم الإقليمية.',
        tags: ['transport', 'transit', 'bus', 'nahyan', 'mobility']
      },
      {
        id: 16,
        name: 'Zayed International Airport Terminal Hub',
        name_ar: 'مركز مطار زايد الدولي',
        type: 'TRANSPORT',
        subType: 'Airport',
        category_en: 'International Aviation Terminal',
        category_ar: 'مطار دولي للركاب',
        location: 'Airport Sector',
        location_ar: 'قطاع المطار',
        district: 'Airport Sector',
        lat: 24.4329,
        lng: 54.6511,
        rating: 4.9,
        dailyCommuters: 120000,
        transitRoutesServed: '110 Aviation Routes',
        transitRoutesServed_ar: '110 وجهات طيران عالمية',
        evChargingBays: 48,
        isCoastal: false,
        description: 'State-of-the-art international aviation gateway connecting Abu Dhabi worldwide.',
        description_ar: 'المبنى الرئيسي لمطار زايد الدولي المربوط بالمحاور المكانية للإمارة.',
        tags: ['transport', 'airport', 'zayed int', 'aviation', 'mobility']
      },
      {
        id: 17,
        name: 'Zayed Port Cruise Terminal',
        name_ar: 'محطة السفن السياحية - ميناء زايد',
        type: 'TRANSPORT',
        subType: 'Port',
        category_en: 'Maritime Cruise Terminal',
        category_ar: 'محطة ميناء سياحي بحري',
        location: 'Mina Zayed',
        location_ar: 'ميناء زايد',
        district: 'Mina Zayed',
        lat: 24.5210,
        lng: 54.3780,
        rating: 4.7,
        dailyCommuters: 18000,
        transitRoutesServed: '14 Maritime Cruise Lines',
        transitRoutesServed_ar: '14 خطاً سياحياً بحرياً',
        evChargingBays: 16,
        isCoastal: true,
        description: 'Modern maritime passenger hub hosting international cruise lines and coastal ferries.',
        description_ar: 'المحطة البحرية الرئيسية لاستقبال السفن السياحية والعبارات الساحلية.',
        tags: ['transport', 'port', 'mina zayed', 'maritime', 'cruise']
      }
    ],

    // Search Suggestions
    searchSuggestions: [
      'Find nearest transit terminal',
      'Show bus terminals in Abu Dhabi',
      'Airport connections near me',
      'Compare commuter volumes'
    ],
    searchSuggestions_ar: [
      'البحث عن أقرب محطة نقل عام',
      'عرض محطات الحافلات في أبوظبي',
      'مواقع الربط بمطار زايد الدولي',
      'مقارنة أعداد الركاب في المحطات'
    ],

    // Schema Driven Display Rules
    resultSchema: [
      { field: 'name', label: 'Terminal Name', label_ar: 'اسم المحطة' },
      { field: 'category_en', label: 'Transit Type', label_ar: 'نوع النقل' },
      { field: 'dailyCommuters', label: 'Daily Commuters', label_ar: 'الركاب اليوميون', format: 'number' },
      { field: 'district', label: 'District', label_ar: 'المنطقة' }
    ],

    detailSchema: [
      { field: 'name', label: 'Terminal Name', label_ar: 'اسم المحطة' },
      { field: 'category_en', label: 'Transit Classification', label_ar: 'تصنيف النقل' },
      { field: 'dailyCommuters', label: 'Est. Daily Commuters', label_ar: 'حجم الركاب اليومي', format: 'number' },
      { field: 'transitRoutesServed', label: 'Routes Served', label_ar: 'الخطوط المسجلة' },
      { field: 'evChargingBays', label: 'EV Charging Bays', label_ar: 'محطات الشحن الكهربائي', format: 'number' },
      { field: 'district', label: 'District Location', label_ar: 'الموقع' },
      { field: 'description', label: 'Connectivity Overview', label_ar: 'تفاصيل الربط والمواصلات' }
    ],

    analyticsConfig: {
      supportedMetrics: ['dailyCommuters'],
      chartTitle: 'Transit Hub Commuter Traffic Volumes',
      chartTitle_ar: 'أعداد الركاب اليومية في محاور النقل',
      unit: 'commuters/day',
      unit_ar: 'راكب/يوم'
    },

    mapConfig: {
      defaultBasemap: 'streets',
      allowedBasemaps: ['streets', 'satellite', 'dark', 'topo']
    },

    aiContext: {
      welcomeMessage: "Welcome to the **Mobility & Public Transit Network** GIS Workspace. Explore bus terminals, airport aviation hubs, and maritime transit.",
      welcomeMessage_ar: "مرحباً بك في منصة **شبكة النقل والمواصلات العامة**. استكشف محطات الحافلات ومطار زايد الدولي والموانئ البحرية.",
      persona: "Transit & Mobility Specialist"
    }
  }
];

// Helper to find a project configuration by ID
export function getProjectConfigById(projectId) {
  return PROJECTS_CONFIG.find(p => p.id === projectId) || PROJECTS_CONFIG[0];
}
