// src/data/helpData.js
// Authoritative Help Center Data Model for GeoVision SmartMap V2

export const HELP_CATEGORIES = [
  { id: 'all', label_en: 'All Topics', label_ar: 'جميع المواضيع', icon: 'Sparkles' },
  { id: 'search', label_en: 'GeoAI Search', label_ar: 'البحث الذكي', icon: 'MessageSquare' },
  { id: 'layers', label_en: 'GIS Layers & Data', label_ar: 'الطبقات والبيانات', icon: 'Layers' },
  { id: 'maps', label_en: 'Basemaps & Legend', label_ar: 'الخرائط والمفتاح', icon: 'Map' },
  { id: 'spatial', label_en: 'Spatial Analysis', label_ar: 'التحليل المكاني', icon: 'Compass' },
  { id: 'routing', label_en: 'Navigation & Routes', label_ar: 'الملاحة والمسارات', icon: 'Navigation' },
  { id: 'reports', label_en: 'Risk & Reports', label_ar: 'المخاطر والتقارير', icon: 'ShieldCheck' }
];

export const GETTING_STARTED_STEPS = [
  {
    id: 'gs-1',
    stepNumber: 1,
    shortLabel_en: 'Concepts',
    shortLabel_ar: 'المفاهيم',
    title_en: 'Understand GeoVision V2 Concepts',
    title_ar: 'فهم مفاهيم منصة جيو فيجن V2',
    duration: '2 min',
    summary_en: 'Discover how conversational AI combines with Abu Dhabi Spatial Data Infrastructure (AD-SDI) for real-time geospatial intelligence.',
    summary_ar: 'تعرف على كيفية دمج الذكاء الاصطناعي مع البنية التحتية للبيانات المكانية في أبوظبي لتقديم ذكاء جغرافي فوري.',
    keyPoints_en: [
      'Official spatial data managed by Department of Government Enablement (DGE)',
      'Natural-language querying for multi-criteria facility proximity',
      'Unified risk analysis across coastal flooding, heat islands, and water stress'
    ],
    keyPoints_ar: [
      'بيانات مكانية رسمية تديرها دائرة التمكين الحكومي (DGE)',
      'استعلامات باللغة الطبيعية للبحث عن المرافق بنطاقات جغرافية متعددة المعايير',
      'تحليل مخاطر متكامل يشمل فيضانات السواحل، الجزر الحرارية، وإجهاد المياه'
    ],
    screenshot: '/help/home-overview.png',
    callout: {
      tag_en: 'Architecture',
      tag_ar: 'البنية المعمارية',
      title_en: 'Abu Dhabi SDI Platform',
      title_ar: 'منصة أبوظبي للبيانات المكانية',
      desc_en: 'Official enterprise geospatial data layers and executive intelligence metrics.',
      desc_ar: 'طبقات بيانات مكانية حكومية معتمدة ومؤشرات ذكاء تنفيذي موثوقة.'
    },
    actionLabel_en: 'Explore SmartMap Workspace',
    actionLabel_ar: 'بدء الاستكشاف',
    actionTarget: { view: 'explorer' }
  },
  {
    id: 'gs-2',
    stepNumber: 2,
    shortLabel_en: 'Interface',
    shortLabel_ar: 'الواجهة',
    title_en: 'Explore the Workspace Interface',
    title_ar: 'استكشاف واجهة مساحة العمل',
    duration: '3 min',
    summary_en: 'Master the 5 core areas: Top Navigation, Map Canvas, Control Sidebar, AI Query Bar, and Contextual Intelligence Panels.',
    summary_ar: 'تعرف على المناطق الخمس الرئيسية: شريط التنقل، رقعة الخريطة، الشريط الجانبي للأدوات، شريط الذكاء الاصطناعي، ولوحات التحليل.',
    keyPoints_en: [
      'Left toolbar: GIS Layers, Basemaps, Spatial Drawing, Route Navigation, Legend',
      'Bottom query bar: Natural language input, suggestions chips, voice query',
      'Interactive canvas: Smooth zoom, panning, facility markers with popups'
    ],
    keyPoints_ar: [
      'شريط الأدوات الأيسر: الطبقات، الخرائط، الرسم المكاني، الملاحة، ومفتاح الرموز',
      'شريط البحث السفلي: إدخال اللغة الطبيعية، اقتراحات جاهزة، والبحث الصوتي',
      'الخريطة التفاعلية: تكبير سلس، تحريك، وبطاقات تفاصيل المرافق عند النقر'
    ],
    screenshot: '/help/smart-map.png',
    callout: {
      tag_en: 'Navigation',
      tag_ar: 'واجهة التحكم',
      title_en: 'Interactive Workspace Canvas',
      title_ar: 'رقعة الخريطة التفاعلية',
      desc_en: 'Sidebar tools on the left, map in center, and AI search bar below.',
      desc_ar: 'أدوات التحكم على اليسار، رقعة الخريطة في المنتصف، وشريط البحث بالأسفل.'
    },
    actionLabel_en: 'View Interactive Interface',
    actionLabel_ar: 'معاينة الواجهة',
    actionTarget: { view: 'explorer' }
  },
  {
    id: 'gs-3',
    stepNumber: 3,
    shortLabel_en: 'AI Search',
    shortLabel_ar: 'البحث الذكي',
    title_en: 'Run Your First Conversational Query',
    title_ar: 'تنفيذ استعلامك الأول بالذكاء الاصطناعي',
    duration: '2 min',
    summary_en: 'Type natural questions to find specific locations with spatial boundaries, distance limits, and operational filters.',
    summary_ar: 'اكتب أسئلة عادية بالإنجليزية أو العربية للبحث عن المنشآت ضمن مسافات معينة ومعايير تشغيلية.',
    keyPoints_en: [
      'Proximity: "Hospitals within 5 km of Zayed Sports City"',
      'Category filter: "Show only government hospitals"',
      'District focus: "Parks on Al Reem Island"'
    ],
    keyPoints_ar: [
      'نطاق القرب: "المستشفيات ضمن 5 كم من مدينة زايد الرياضية"',
      'تصفية نوعية: "المستشفيات الحكومية فقط"',
      'نطاق حي محدد: "الحدائق في جزيرة الريم"'
    ],
    screenshot: '/help/ai-search-results.png',
    callout: {
      tag_en: 'GeoAI Search',
      tag_ar: 'البحث الذكي',
      title_en: 'Conversational Query Input',
      title_ar: 'حقل إدخال الاستعلام الذكي',
      desc_en: 'Type natural proximity questions; the map updates live with filtered pins.',
      desc_ar: 'اكتب استعلام القرب بلغة بسيطة، وستتحدث الخريطة فورياً بالمنشآت المطابقة.'
    },
    actionLabel_en: 'Try "Parks on Al Reem Island"',
    actionLabel_ar: 'جرب "الحدائق في جزيرة الريم"',
    actionTarget: { view: 'explorer', pendingQuery: 'Parks on Al Reem Island' }
  },
  {
    id: 'gs-4',
    stepNumber: 4,
    shortLabel_en: 'GIS Layers',
    shortLabel_ar: 'الطبقات المكانية',
    title_en: 'Filter by Official GIS Categories',
    title_ar: 'تصفية الطبقات حسب الفئات المكانية',
    duration: '3 min',
    summary_en: 'Browse 10+ categorized layers including Education, Health, Emergency, Transport, and Government Services.',
    summary_ar: 'تصفح أكثر من 10 فئات مكانية تشمل التعليم، الصحة، الطوارئ، النقل، والخدمات الحكومية.',
    keyPoints_en: [
      'Open the Layers drawer from the left sidebar',
      'Select categories or specific subcategories (e.g., Charter Schools, Public Clinics)',
      'Live count badges update markers instantaneously on the map'
    ],
    keyPoints_ar: [
      'افتح درج الطبقات من الشريط الجانبي الأيسر',
      'حدد الفئات العامة أو الفئات الفرعية المحددة (مثل مدارس الشراكات، العيادات الحكومية)',
      'شارات الأرقام الحية تقوم بتحديث العلامات على الخريطة فورياً'
    ],
    screenshot: '/help/gis-categories.png',
    callout: {
      tag_en: 'GIS Layers',
      tag_ar: 'الطبقات المكانية',
      title_en: 'Official Categories Drawer',
      title_ar: 'لوحة الفئات الرسمية',
      desc_en: 'Hierarchical sectors, subcategories checkboxes, and live marker count badges.',
      desc_ar: 'تصنيفات هرمية، وصناديق اختيار للفئات الفرعية، وشارات الأعداد الحية.'
    },
    actionLabel_en: 'Open Categories Panel in SmartMap',
    actionLabel_ar: 'فتح لوحة الفئات في الخريطة',
    actionTarget: { view: 'explorer', showCategoriesPanel: true, activeMenu: null }
  },
  {
    id: 'gs-5',
    stepNumber: 5,
    shortLabel_en: 'Risk Profiles',
    shortLabel_ar: 'فحص المخاطر',
    title_en: 'Inspect Facilities & Risk Profiles',
    title_ar: 'فحص تفاصيل المنشآت ومؤشرات المخاطر',
    duration: '3 min',
    summary_en: 'Click any map marker to open its comprehensive intelligence sheet with environmental risk indices.',
    summary_ar: 'انقر فوق أي علامة على الخريطة لفتح بطاقة المعلومات الشاملة ومؤشرات المخاطر البيئية.',
    keyPoints_en: [
      'Review operational status, operating hours, capacity, and contact info',
      'Inspect the Environmental Risk Score (0-100) and vulnerability breakdown',
      'Initiate 1-click route directions or download facility summary'
    ],
    keyPoints_ar: [
      'مراجعة حالة التشغيل، ساعات العمل، السعة الاستيعابية، ومعلومات الاتصال',
      'معاينة مؤشر المخاطر البيئية (0-100) وتفاصيل الهشاشة',
      'بدء مسار ملاحة بضغطة واحدة أو تحميل ملخص المنشأة'
    ],
    screenshot: '/help/marker-details.png',
    callout: {
      tag_en: 'Facility Intelligence',
      tag_ar: 'بيانات المنشآت',
      title_en: 'Marker Profile & Risk Gauge',
      title_ar: 'بطاقة المنشأة ومؤشر المخاطر',
      desc_en: 'Full operational data, contact info, and environmental hazard decomposition.',
      desc_ar: 'بيانات تشغيلية شاملة وتفكيك دقيق لمؤشرات المخاطر البيئية.'
    },
    actionLabel_en: 'Inspect Cleveland Clinic & Risk',
    actionLabel_ar: 'فحص كليفلاند كلينك والمخاطر',
    actionTarget: { view: 'explorer', pendingQuery: 'Cleveland Clinic Abu Dhabi' }
  },
  {
    id: 'gs-6',
    stepNumber: 6,
    shortLabel_en: 'Draw Buffers',
    shortLabel_ar: 'رسم النطاقات',
    title_en: 'Calculate Buffers & Measure Distances',
    title_ar: 'رسم النطاقات وحساب المسافات',
    duration: '4 min',
    summary_en: 'Use spatial measurement tools to draw geodesic buffers and assess facility coverage radius.',
    summary_ar: 'استخدم أدوات القياس المكاني لرسم نطاقات عازلة دقيقة وتقييم مدى تغطية المرافق.',
    keyPoints_en: [
      'Select the Draw tool from the left toolbar',
      'Click on the map to define center and radius (e.g., 2.5 km service zone)',
      'Instantly see all intersecting critical infrastructure inside the polygon'
    ],
    keyPoints_ar: [
      'اختر أداة الرسم من شريط الأدوات الأيسر',
      'انقر على الخريطة لتحديد المركز ونصف القطر (مثل نطاق خدمة 2.5 كم)',
      'شاهد فورياً جميع المنشآت الحيوية المتقاطعة داخل النطاق'
    ],
    screenshot: '/help/draw-buffer-panel.png',
    callout: {
      tag_en: 'Spatial Geometry',
      tag_ar: 'الرسم المكاني',
      title_en: 'Draw Tools Panel & Buffer Analysis',
      title_ar: 'لوحة أدوات الرسم وتحليل النطاق',
      desc_en: 'Opened draw tools submenu with Box, Circle Buffer, and Polygon modes.',
      desc_ar: 'لوحة أدوات الرسم المفتوحة مع خيارات رسم المربع، الدائرة العازلة، والمضلع.'
    },
    actionLabel_en: 'Open Drawing & Buffer Tools',
    actionLabel_ar: 'فتح أدوات الرسم والنطاق',
    actionTarget: { view: 'explorer', activeMenu: 'draw', showCategoriesPanel: false }
  },
  {
    id: 'gs-7',
    stepNumber: 7,
    shortLabel_en: 'Export Reports',
    shortLabel_ar: 'التقارير التنفيذية',
    title_en: 'Export Reports & Save Workspaces',
    title_ar: 'تصدير التقارير وحفظ مساحات العمل',
    duration: '2 min',
    summary_en: 'Generate presentation-ready executive PDF intelligence briefs or bookmark your custom spatial views.',
    summary_ar: 'أنشئ تقارير تنفيذية رسمية بصيغة PDF قابلة للطباعة أو احفظ استعلاماتك المفضلة.',
    keyPoints_en: [
      'Print or export PDF dossiers with official AD-SDI watermarks',
      'Save multi-layer queries to your profile for one-click reload',
      'Share deep-links with colleagues and decision makers'
    ],
    keyPoints_ar: [
      'طباعة وتصدير ملفات PDF بعلامة مائية رسمية من AD-SDI',
      'حفظ استعلامات الطبقات المتعددة في ملفك الشخصي لإعادة تحميلها بضغطة واحدة',
      'مشاركة الروابط المباشرة مع زملائك وصناع القرار'
    ],
    screenshot: '/help/print-template-report.png',
    callout: {
      tag_en: 'Executive Reports',
      tag_ar: 'التقارير التنفيذية',
      title_en: 'Official Executive Print Template',
      title_ar: 'نموذج التقرير التنفيذي للطباعة',
      desc_en: 'Official DGE & AD-SDI layout with satellite extent, metadata, and risk summaries.',
      desc_ar: 'النموذج الرسمي من تمكين الحكومية وAD-SDI مع خريطة الأقمار الصناعية والبيانات ومؤشرات المخاطر.'
    },
    actionLabel_en: 'Open Executive Analytics Modal',
    actionLabel_ar: 'فتح لوحة التحليلات التنفيذية',
    actionTarget: { view: 'explorer', showAnalyticsModal: true }
  }
];

export const TASK_ARTICLES = [
  {
    id: 'task-nl-search',
    category: 'search',
    title_en: 'Ask Natural Language Proximity Queries',
    title_ar: 'طرح استعلامات القرب باللغة الطبيعية',
    badge: 'Core Workflow',
    readTime: '3 min read',
    overview_en: 'Learn how to query Abu Dhabi geospatial infrastructure using natural everyday language in English or Arabic without writing complex GIS filters.',
    overview_ar: 'تعلم كيفية استعلام البنية التحتية المكانية في أبوظبي بلغة يومية بسيطة باللغتين العربية والإنجليزية دون الحاجة لكتابة استعلامات جغرافية معقدة.',
    beforeYouBegin_en: [
      'Make sure you are on the SmartMap Workspace page',
      'Ensure your map is centered on Abu Dhabi or your area of interest',
      'Familiarize yourself with natural search patterns (Category + Distance + Landmark)'
    ],
    beforeYouBegin_ar: [
      'تأكد من فتح صفحة مساحة عمل الخريطة الذكية (SmartMap)',
      'تأكد من تركيز الخريطة على منطقة أبوظبي أو وجهتك المستهدفة',
      'تعرف على أنماط البحث الطبيعي (الفئة + المسافة + المعلم الشهير)'
    ],
    screenshot: {
      url: '/help/ai-search-results.png',
      caption_en: 'Conversational GeoAI search showing filtered results with active proximity badges and facility count.',
      caption_ar: 'نتائج البحث الذكي توضح المنشآت المصفاة مع شارات القرب وعدد النتائج المتاحة.',
      hotspots: [
        {
          id: 'h1',
          x: 50,
          y: 92,
          label: '①',
          title_en: 'Conversational Query Input',
          title_ar: 'حقل إدخال الاستعلام الذكي',
          desc_en: 'Type your natural question here. Supports voice input and instant clearing.',
          desc_ar: 'اكتب سؤالك الطبيعي هنا، ويدعم الإدخال الصوتي ومسح النص فورياً.'
        },
        {
          id: 'h2',
          x: 82,
          y: 35,
          label: '②',
          title_en: 'Interactive Results Panel',
          title_ar: 'لوحة النتائج التفاعلية',
          desc_en: 'Displays matching facilities with distance, operational status, and 1-click zoom.',
          desc_ar: 'تعرض المنشآت المطابقة مع المسافة، حالة التشغيل، وزر التكبير الفوري.'
        },
        {
          id: 'h3',
          x: 48,
          y: 42,
          label: '③',
          title_en: 'Map Highlight Markers',
          title_ar: 'علامات الخريطة المحددة',
          desc_en: 'Pins represent matching spatial records with category-specific colors and icons.',
          desc_ar: 'دبابيس تمثل السجلات المكانية المطابقة بألوان وأيقونات مميزة لكل فئة.'
        }
      ]
    },
    steps_en: [
      {
        step: 1,
        instruction: 'Click on the AI Map Assistant input box at the bottom of the screen or press the "/" key shortcut.',
        tip: 'You can also tap any of the suggested query chips above the input bar.'
      },
      {
        step: 2,
        instruction: 'Type your request, specifying a category and an optional landmark, e.g., "Show hospitals within 5 km of Zayed Sports City".',
        tip: 'Both English and Arabic prompts are parsed natively with GIS synonym expansion.'
      },
      {
        step: 3,
        instruction: 'Press Enter or click the Send button. The engine parses intent, applies distance buffers, and highlights matching markers on the canvas.',
        tip: 'Look at the top results count badge to see total matching facilities (e.g. "Showing 10 of 42 facilities").'
      },
      {
        step: 4,
        instruction: 'Click on any result in the side list or map pin to center the camera and reveal full attributes.',
        tip: 'Click "Load 10 More" at the bottom of the list to progressively stream additional results.'
      }
    ],
    steps_ar: [
      {
        step: 1,
        instruction: 'انقر فوق صندوق إدخال مساعد الخريطة الذكي في أسفل الشاشة أو اضغط على مفتاح الاختصار "/".',
        tip: 'يمكنك أيضاً النقر على أي من شرائح الاقتراحات السريعة الجاهزة.'
      },
      {
        step: 2,
        instruction: 'اكتب طلبك محدداً الفئة ومعلماً جغرافياً إن وجد، مثل: "المستشفيات ضمن 5 كم من مدينة زايد الرياضية".',
        tip: 'يتم فهم النصوص باللغتين العربية والإنجليزية بدقة عبر معجم المرادفات الجغرافية.'
      },
      {
        step: 3,
        instruction: 'اضغط Enter أو زر الإرسال. يقوم المحرك بتحليل القصد وحساب النطاق وتلوين العلامات على الخريطة.',
        tip: 'شاهد شارة عدد النتائج في أعلى القائمة (مثال: "عرض 10 من 42 منشأة").'
      },
      {
        step: 4,
        instruction: 'انقر على أي منشأة في القائمة الجانبية أو العلامة على الخريطة لتكبير الموقع وعرض التفاصيل.',
        tip: 'انقر على "تحميل 10 إضافية" في نهاية القائمة لتحميل المزيد من المنشآت تدريجياً.'
      }
    ],
    expectedResult_en: 'The map zooms to encapsulate matching facilities. Pins render with active status rings, and a structured panel displays cards with distances, contact info, and navigation links.',
    expectedResult_ar: 'تتكيف الخريطة لتشمل كافة المنشآت المطابقة مع ظهور دبابيس ملونة ولوحة تفاعلية تظهر المسافات والبيانات التشغيلية وروابط التوجيه.',
    troubleshooting_en: 'If no results appear, verify spelling of landmarks, or try a broader prompt like "Show all hospitals in Abu Dhabi" to reset distance filters.',
    troubleshooting_ar: 'في حال عدم ظهور نتائج، تأكد من كتابة اسم المعلم بدقة، أو جرب صياغة أوسع مثل "اعرض جميع المستشفيات في أبوظبي" لإلغاء قيود المسافة.',
    deepLinkAction: {
      label_en: 'Try Search in SmartMap →',
      label_ar: 'تجربة البحث في الخريطة الذكية →',
      target: { view: 'explorer', pendingQuery: 'hospitals within 5 km of Zayed Sports City' }
    },
    relatedTasks: ['task-gis-categories', 'task-spatial-draw', 'task-route-nav']
  },
  {
    id: 'task-gis-categories',
    category: 'layers',
    title_en: 'Filter by Official GIS Categories & Subcategories',
    title_ar: 'تصفية الطبقات حسب الفئات المكانية الرسمية',
    badge: 'Data Management',
    readTime: '4 min read',
    overview_en: 'Explore structured spatial themes curated by Abu Dhabi SDI. Toggle complete sectors or isolate granular facility subcategories with live count badges.',
    overview_ar: 'استكشف الموضوعات المكانية المعتمدة من البنية التحتية للمعلومات الجغرافية بأبوظبي. يمكنك تفعيل قطاعات كاملة أو فئات فرعية دقيقة مع شارات أرقام حية.',
    beforeYouBegin_en: [
      'Ensure the Left Map Toolbar is visible',
      'Clear any active conflicting search filters if you wish to see all category entries'
    ],
    beforeYouBegin_ar: [
      'تأكد من ظهور شريط الأدوات الأيسر بجانب الخريطة',
      'امسح أي استعلامات سابقة إذا رغبت في معاينة جميع منشآت الفئة المختارة'
    ],
    screenshot: {
      url: '/help/gis-categories.png',
      caption_en: 'GIS Categories drawer showing hierarchical sectors with counts, subcategory checkboxes, and live layer toggles.',
      caption_ar: 'لوحة الفئات المكانية توضح القطاعات الرئيسية والفرعية مع صناديق الاختيار وشارات الأعداد.',
      hotspots: [
        {
          id: 'h1',
          x: 24,
          y: 20,
          label: '①',
          title_en: 'Category Selector Drawer',
          title_ar: 'قائمة اختيار الفئات',
          desc_en: 'Click any sector (Health, Education, Emergency, Tourism) to expand sub-layers.',
          desc_ar: 'انقر على أي قطاع (صحة، تعليم، طوارئ، سياحة) لتوسيع الطبقات الفرعية.'
        },
        {
          id: 'h2',
          x: 24,
          y: 52,
          label: '②',
          title_en: 'Subcategory Toggles',
          title_ar: 'مفاتيح الفئات الفرعية',
          desc_en: 'Select specific types such as Charter Schools, Private Clinics, or Mosques.',
          desc_ar: 'حدد أنواعاً محددة مثل مدارس الشراكات، العيادات الخاصة، أو المساجد.'
        },
        {
          id: 'h3',
          x: 24,
          y: 88,
          label: '③',
          title_en: 'Clear All / Reset Filters',
          title_ar: 'مسح وإعادة ضبط الطبقات',
          desc_en: 'Quickly uncheck all selections to return the map canvas to default base state.',
          desc_ar: 'إلغاء تحديد كافة الاختيارات لإعادة الخريطة إلى حالتها الافتراضية بضغطة واحدة.'
        }
      ]
    },
    steps_en: [
      {
        step: 1,
        instruction: 'Click the Layers icon (stacked squares) on the upper-left map control panel.',
        tip: 'The Categories drawer slides out without blocking your active map viewpoint.'
      },
      {
        step: 2,
        instruction: 'Click on a primary sector header, for example "Education (142)" or "Health (86)".',
        tip: 'The drawer expands showing subcategories with individual counts and colored badges.'
      },
      {
        step: 3,
        instruction: 'Check the boxes next to the subcategories you want to view, e.g. "Charter Schools".',
        tip: 'The map instantly refreshes pins, rendering custom icons matching the category color palette.'
      },
      {
        step: 4,
        instruction: 'Close the drawer using the close (X) icon or click anywhere outside to view your map.',
        tip: 'Your active layer selection remains persistent while you navigate and zoom.'
      }
    ],
    steps_ar: [
      {
        step: 1,
        instruction: 'انقر على أيقونة الطبقات (المربعات المتراكبة) في الشريط الجانبي الأيسر للخريطة.',
        tip: 'تنزلق لوحة الفئات بسلاسة دون حجب زاوية الرؤية الحالية للخريطة.'
      },
      {
        step: 2,
        instruction: 'انقر على عنوان القطاع الرئيسي، مثل "التعليم (142)" أو "الصحة (86)".',
        tip: 'تتوسع القائمة لتعرض الفئات الفرعية مع الأعداد الفردية وشارات ملونة.'
      },
      {
        step: 3,
        instruction: 'حدد مربعات الاختيار بجوار الفئات المطلوبة، مثل "مدارس الشراكات".',
        tip: 'تتحدث الخريطة فورياً لتظهر دبابيس خاصة تحمل رموز وألوان الفئة.'
      },
      {
        step: 4,
        instruction: 'أغلق الدرج بالنقر على زر الإغلاق (X) أو بالنقر في أي مساحة بالخريطة.',
        tip: 'تبقى اختيارات الطبقات محفوظة ونشطة أثناء تحريك وتكبير الخريطة.'
      }
    ],
    expectedResult_en: 'Map markers update dynamically to show only facilities belonging to the checked subcategories, with matching symbology on the canvas and in the legend.',
    expectedResult_ar: 'يتم تحديث علامات الخريطة ديناميكياً لتقتصر فقط على المنشآت التابعة للفئات المحددة مع توافق كامل في مفتاح الخريطة.',
    troubleshooting_en: 'If no pins appear, ensure your selected category has facilities in your current viewport or zoom out to see the entire Abu Dhabi Emirate.',
    troubleshooting_ar: 'إذا لم تظهر علامات، تأكد من وجود منشآت للفئة المختارة في نطاق الرؤية الحالي، أو قم بتصغير الخريطة لمعاينة الإمارة كاملة.',
    deepLinkAction: {
      label_en: 'Open GIS Categories in SmartMap →',
      label_ar: 'فتح الفئات في الخريطة الذكية →',
      target: { view: 'explorer', activeMenu: 'categories' }
    },
    relatedTasks: ['task-nl-search', 'task-basemaps-legend', 'task-marker-details']
  },
  {
    id: 'task-basemaps-legend',
    category: 'maps',
    title_en: 'Switch Basemaps & Inspect Map Symbology',
    title_ar: 'تغيير الخرائط الخلفية وفحص مفتاح الرموز',
    badge: 'Visualization',
    readTime: '3 min read',
    overview_en: 'Switch between high-resolution satellite imagery, dark analytics mode, topographic contours, and standard street navigation basemaps.',
    overview_ar: 'التبديل بين صور الأقمار الصناعية عالية الدقة، الوضع الداكن للتحليلات، خطوط الكنتور التضاريسية، وخرائط الشوارع القياسية.',
    beforeYouBegin_en: [
      'Understand that basemaps provide visual context while maintaining all active data overlay layers'
    ],
    beforeYouBegin_ar: [
      'الخريطة الخلفية توفر سياقاً بصرياً ممتازاً دون التأثير على طبقات البيانات المكانية النشطة'
    ],
    screenshot: {
      url: '/help/map-legend.png',
      caption_en: 'Map Legend and Environmental Overlays panel with layer symbology, risk indicators, and basemap controls.',
      caption_ar: 'لوحة مفتاح الخريطة ومؤشرات المخاطر البيئية توضح رموز الطبقات وخيارات التحكم بالخريطة.',
      hotspots: [
        {
          id: 'h1',
          x: 24,
          y: 28,
          label: '①',
          title_en: 'Basemap Style Cards',
          title_ar: 'أنماط الخريطة الخلفية',
          desc_en: 'Choose Satellite, Dark Matter, Topo, or Streets view with 1 click.',
          desc_ar: 'اختر بين الأقمار الصناعية، الوضع الداكن، التضاريس، أو الشوارع بضغطة واحدة.'
        },
        {
          id: 'h2',
          x: 24,
          y: 55,
          label: '②',
          title_en: 'Symbology Legend',
          title_ar: 'دليل رموز الطبقات',
          desc_en: 'Explains marker pin colors, shapes, and category iconography.',
          desc_ar: 'يشرح دلالات ألوان الدبابيس والأشكال والأيقونات المعتمدة لكل قطاع.'
        },
        {
          id: 'h3',
          x: 24,
          y: 78,
          label: '③',
          title_en: 'Environmental Risk Overlays',
          title_ar: 'طبقات المخاطر البيئية',
          desc_en: 'Toggle coastal surge, urban heat island, and groundwater stress zones.',
          desc_ar: 'تفعيل طبقات الفيضانات الساحلية، الجزر الحرارية، ومناطق إجهاد المياه الجوفية.'
        }
      ]
    },
    steps_en: [
      {
        step: 1,
        instruction: 'Click the Basemap icon (folded map) or Legend icon (book) in the left toolbar.',
        tip: 'The panel displays preview thumbnails of all available Carto and Esri basemap layers.'
      },
      {
        step: 2,
        instruction: 'Click on "Satellite" to view real aerial imagery or "Dark" for high-contrast analytics.',
        tip: 'Dark mode is ideal for viewing vibrant risk overlays and heatmaps.'
      },
      {
        step: 3,
        instruction: 'Scroll down to the "Environmental Overlays" section.',
        tip: 'Toggle on "Coastal Flood Surge Zone" or "Urban Heat Island Index" to inspect vulnerabilities.'
      },
      {
        step: 4,
        instruction: 'Observe the Legend section to interpret layer color codes and boundary styles.',
        tip: 'The legend automatically filters to show only symbols currently present in your map view.'
      }
    ],
    steps_ar: [
      {
        step: 1,
        instruction: 'انقر على أيقونة الخرائط (الخريطة المطوية) أو أيقونة المفتاح (الكتاب) في الشريط الأيسر.',
        tip: 'تعرض اللوحة صوراً مصغرة لكافة طبقات خرائط Carto و Esri المعتمدة.'
      },
      {
        step: 2,
        instruction: 'انقر على "الأقمار الصناعية" للصور الجوية الحقيقية أو "الوضع الداكن" للتحليلات عالية التباين.',
        tip: 'الوضع الداكن مثالي جداً لإبراز تدرجات الخرائط الحرارية ومؤشرات المخاطر.'
      },
      {
        step: 3,
        instruction: 'مرر لأسفل إلى قسم "طبقات المخاطر البيئية".',
        tip: 'قم بتفعيل "نطاق فيضانات السواحل" أو "الجزر الحرارية" لمعاينة المناطق الأكثر هشاشة.'
      },
      {
        step: 4,
        instruction: 'راجع قسم المفتاح لقراءة دلالات الألوان وأنماط الحدود المكانية بدقة.',
        tip: 'يتكيف المفتاح تلقائياً ليعرض فقط الرموز الموجودة حالياً ضمن نطاق الرؤية.'
      }
    ],
    expectedResult_en: 'The underlying basemap transitions smoothly. Spatial risk boundaries render with semi-transparent fills, and the symbology key updates.',
    expectedResult_ar: 'تتحول خلفية الخريطة بسلاسة وتظهر طبقات المخاطر بألوان شبه شفافة مع تحديث فوري لدليل الرموز.',
    troubleshooting_en: 'If satellite tiles load slowly, check your internet connectivity or switch temporarily to the lightweight Streets vector basemap.',
    troubleshooting_ar: 'إذا تأخر تحميل صور الأقمار الصناعية، تحقق من سرعة الاتصال أو انتقل مؤقتاً لخريطة الشوارع الخفيفة.',
    deepLinkAction: {
      label_en: 'Open Basemap & Legend Panel →',
      label_ar: 'فتح لوحة الخرائط والمفتاح →',
      target: { view: 'explorer', activeMenu: 'legend' }
    },
    relatedTasks: ['task-gis-categories', 'task-marker-details', 'task-reports-export']
  },
  {
    id: 'task-spatial-draw',
    category: 'spatial',
    title_en: 'Draw Buffers & Measure Geodesic Distances',
    title_ar: 'رسم النطاقات وحساب المسافات الجيوديسية',
    badge: 'Spatial Analytics',
    readTime: '5 min read',
    overview_en: 'Execute precise geospatial measurements on the map canvas. Draw custom geodesic buffer circles, measurement lines, and polygons to analyze infrastructure density.',
    overview_ar: 'قم بتنفيذ قياسات مكانية دقيقة على الخريطة مباشرة. ارسم دوائر النطاقات العازلة، خطوط المسافات، والمضلعات لتحليل كثافة البنية التحتية.',
    beforeYouBegin_en: [
      'Locate your facility of interest or reference point on the map',
      'Ensure you are not currently editing an active route navigation'
    ],
    beforeYouBegin_ar: [
      'حدد المنشأة أو النقطة المرجعية المستهدفة على الخريطة',
      'تأكد من عدم تشغيل وضع الملاحة والمسارات في الوقت نفسه'
    ],
    screenshot: {
      url: '/help/draw-buffer-panel.png',
      caption_en: 'SmartMap drawing tools panel opened showing Draw Box, Draw Circle buffer, and Polygon options.',
      caption_ar: 'لوحة أدوات الرسم مفتوحة في الخريطة الذكية توضح خيارات رسم المربع، الدائرة العازلة، والمضلع.',
      hotspots: [
        {
          id: 'h1',
          x: 10,
          y: 48,
          label: '①',
          title_en: 'Drawing Tools Floating Panel',
          title_ar: 'لوحة أدوات الرسم المفتوحة',
          desc_en: 'Submenu with Draw Box, Draw Circle, and Draw Polygon options.',
          desc_ar: 'قائمة منبثقة تضم أدوات رسم المربع، الدائرة العازلة، والمضلع.'
        },
        {
          id: 'h2',
          x: 50,
          y: 11,
          label: '②',
          title_en: 'Active Drawing Instruction Bar',
          title_ar: 'شريط تعليمات الرسم النشط',
          desc_en: 'Guides you to click & drag or click on map to fix Circle area.',
          desc_ar: 'يوجهك للنقر والسحب أو النقر على الخريطة لتحديد نطاق الدائرة.'
        },
        {
          id: 'h3',
          x: 3,
          y: 43,
          label: '③',
          title_en: 'Left Sidebar Draw Tool',
          title_ar: 'أداة الرسم في الشريط الأيسر',
          desc_en: 'Active pencil tool icon in the expanded map controls sidebar.',
          desc_ar: 'أيقونة قلم الرسم النشطة في شريط أدوات التحكم بالخريطة الموسع.'
        }
      ]
    },
    steps_en: [
      {
        step: 1,
        instruction: 'Click the Draw icon (pencil / shape tool) on the left sidebar.',
        tip: 'The drawing tool floating toolbar will appear at the top of the map.'
      },
      {
        step: 2,
        instruction: 'Select "Buffer Radius" and click on the map location you want as the center point.',
        tip: 'A dynamic radial circle will follow your mouse movement with real-time distance indicators.'
      },
      {
        step: 3,
        instruction: 'Drag to your desired radius (e.g., 3.0 km) and click to lock the buffer.',
        tip: 'You can adjust the radius slider or input a precise numeric distance in the popup dialog.'
      },
      {
        step: 4,
        instruction: 'Review the Spatial Intersection metrics card showing total facilities covered.',
        tip: 'Click "Export Buffer Data" to download a CSV of all facilities within your custom perimeter.'
      }
    ],
    steps_ar: [
      {
        step: 1,
        instruction: 'انقر على أيقونة الرسم (القلم / الأشكال) في الشريط الجانبي الأيسر.',
        tip: 'سيظهر شريط أدوات الرسم العائم في الجزء العلوي من الخريطة.'
      },
      {
        step: 2,
        instruction: 'اختر "نطاق دائري (Buffer)" ثم انقر فوق الموقع الذي تريده كمركز.',
        tip: 'ستتحرك دائرة ديناميكية مع مؤشر الفأرة موضحة المسافة بالأمتار أو الكيلومترات لحظياً.'
      },
      {
        step: 3,
        instruction: 'اسحب للمسافة المطلوبة (مثلاً 3.0 كم) ثم انقر لتثبيت النطاق على الخريطة.',
        tip: 'يمكنك ضبط شريط التمرير أو كتابة رقم دقيق لنصف القطر في النافذة المنبثقة.'
      },
      {
        step: 4,
        instruction: 'راجع بطاقة تقاطع النطاق المكاني لمعاينة إجمالي المرافق التي يغطيها.',
        tip: 'انقر على "تصدير بيانات النطاق" لتحميل جدول CSV بالمنشآت الواقعة داخل هذا المحيط.'
      }
    ],
    expectedResult_en: 'A semi-transparent cyan buffer illuminates the map. A summary card reveals facility counts grouped by category inside the radius.',
    expectedResult_ar: 'يظهر نطاق دائري مضيء شبه شفاف مع بطاقة ملخصة تحصي المنشآت المصنفة حسب القطاع داخل هذا النطاق.',
    troubleshooting_en: 'To cancel or delete an active drawing, click the Trash icon in the drawing toolbar or press Escape.',
    troubleshooting_ar: 'لإلغاء أو حذف الرسم النشط، انقر على أيقونة سلة المهملات في شريط الرسم أو اضغط على مفتاح Esc.',
    deepLinkAction: {
      label_en: 'Open Draw Tools in SmartMap →',
      label_ar: 'فتح أدوات الرسم في الخريطة →',
      target: { view: 'explorer', activeMenu: 'draw' }
    },
    relatedTasks: ['task-nl-search', 'task-marker-details', 'task-reports-export']
  },
  {
    id: 'task-route-nav',
    category: 'routing',
    title_en: 'Calculate Routes & Turn-by-Turn Directions',
    title_ar: 'حساب المسارات والتوجيهات خطوة بخطوة',
    badge: 'Mobility & Routes',
    readTime: '4 min read',
    overview_en: 'Calculate optimal driving and walking routes between any two points in the Abu Dhabi road network with distance, duration, and turn-by-turn guidance.',
    overview_ar: 'احسب المسارات المثلى للقيادة والمشي بين أي نقطتين في شبكة طرق أبوظبي مع حساب المسافة والزمن والخطوات التفصيلية.',
    beforeYouBegin_en: [
      'Have an origin point (e.g. your current location or a specific facility) and destination facility in mind'
    ],
    beforeYouBegin_ar: [
      'حدد نقطة البداية (مثل موقعك الحالي أو منشأة معينة) والمنشأة المستهدفة كنقطة وصول'
    ],
    screenshot: {
      url: '/help/navigation-directions.png',
      caption_en: 'Route Navigation panel showing Origin, Destination, total kilometers, travel duration, and step-by-step turns.',
      caption_ar: 'لوحة الملاحة توضح نقطة الانطلاق والوجهة، إجمالي الكيلومترات، زمن الرحلة، والمسار خطوة بخطوة.',
      hotspots: [
        {
          id: 'h1',
          x: 24,
          y: 24,
          label: '①',
          title_en: 'Origin & Destination Inputs',
          title_ar: 'حقلا نقطة الانطلاق والوصول',
          desc_en: 'Type location names or click "Use My Location" / "Pick on Map".',
          desc_ar: 'اكتب اسم الموقع أو اختر "استخدم موقعي الحالي" أو "حدد على الخريطة".'
        },
        {
          id: 'h2',
          x: 24,
          y: 45,
          label: '②',
          title_en: 'Route Metrics Summary',
          title_ar: 'ملخص بيانات المسار',
          desc_en: 'Shows exact road distance (km) and estimated drive time in minutes.',
          desc_ar: 'يعرض المسافة الطرقية الدقيقة بالكيلومتر وزمن القيادة المتوقع بالدقائق.'
        },
        {
          id: 'h3',
          x: 24,
          y: 75,
          label: '③',
          title_en: 'Turn-by-Turn Instruction List',
          title_ar: 'خطوات المسار التفصيلية',
          desc_en: 'Sequential road names, highway exits, and maneuver directions.',
          desc_ar: 'أسماء الطرق ومخارج الطرق السريعة وإرشادات الالتفاف خطوة بخطوة.'
        }
      ]
    },
    steps_en: [
      {
        step: 1,
        instruction: 'Click the Navigation icon (diamond turn arrow) in the left map toolbar.',
        tip: 'Alternatively, click "Get Directions" directly inside any facility popup card.'
      },
      {
        step: 2,
        instruction: 'Set your Starting Point (A) by typing an address or clicking the "Locate Me" GPS icon.',
        tip: 'You can also click the map pin icon to click any point directly on the canvas.'
      },
      {
        step: 3,
        instruction: 'Select your Destination (B) from search results or recent facilities.',
        tip: 'Switch travel mode between Driving (Car) and Walking (Pedestrian) at the top of the panel.'
      },
      {
        step: 4,
        instruction: 'The optimal polyline path renders in glowing blue on the map canvas.',
        tip: 'Click any step in the turn-by-turn list to zoom and focus on that specific intersection.'
      }
    ],
    steps_ar: [
      {
        step: 1,
        instruction: 'انقر على أيقونة الملاحة (سهم الاتجاهات الماسي) في الشريط الجانبي الأيسر.',
        tip: 'أو انقر على زر "الاتجاهات" مباشرة من داخل بطاقة أي منشأة تختارها.'
      },
      {
        step: 2,
        instruction: 'حدد نقطة الانطلاق (أ) بكتابة العنوان أو النقر على أيقونة تحديد موقعي GPS.',
        tip: 'يمكنك أيضاً النقر على أيقونة الدبوس لتحديد أي نقطة مباشرة على رقعة الخريطة.'
      },
      {
        step: 3,
        instruction: 'اختر وجهة الوصول (ب) من نتائج البحث أو من قائمة المنشآت الأخيرة.',
        tip: 'بدل بين وضع القيادة بالسيارة أو المشي على الأقدام من أعلى لوحة الملاحة.'
      },
      {
        step: 4,
        instruction: 'يتم رسم المسار الأمثل بلون أزرق مضيء واضح على شبكة الطرق بالخريطة.',
        tip: 'انقر على أي خطوة في القائمة للتقريب والتركيز المباشر على التقاطع المعني.'
      }
    ],
    expectedResult_en: 'A highlighted road corridor polyline displays on the map with start and finish pins. Total travel time and distance are prominently displayed.',
    expectedResult_ar: 'يظهر مسار طرقي بارز مع دبابيس البداية والنهاية، مع عرض إجمالي وقت الرحلة والمسافة بدقة متناهية.',
    troubleshooting_en: 'If route calculation fails, verify that both coordinates reside within the Abu Dhabi road network graph.',
    troubleshooting_ar: 'إذا تعذر حساب المسار، تأكد من وجود كلا الإحداثيين ضمن شبكة الطرق المعتمدة في إمارة أبوظبي.',
    deepLinkAction: {
      label_en: 'Open Route Navigation in SmartMap →',
      label_ar: 'فتح الملاحة في الخريطة الذكية →',
      target: { view: 'explorer', activeMenu: 'directions' }
    },
    relatedTasks: ['task-nl-search', 'task-marker-details', 'task-spatial-draw']
  },
  {
    id: 'task-marker-details',
    category: 'reports',
    title_en: 'Inspect Facility Details & Environmental Vulnerability',
    title_ar: 'فحص بطاقة المنشأة ومؤشرات الهشاشة البيئية',
    badge: 'Intelligence',
    readTime: '3 min read',
    overview_en: 'Understand how facility attribute cards display operational parameters, sector tags, contact numbers, and composite environmental risk scores.',
    overview_ar: 'تعرف على محتويات بطاقة المنشأة الشاملة التي تعرض معايير التشغيل، تصنيف القطاع، أرقام التواصل، ودرجات المخاطر البيئية المركبة.',
    beforeYouBegin_en: [
      'Ensure at least one facility marker is visible on the map canvas'
    ],
    beforeYouBegin_ar: [
      'تأكد من ظهور علامة منشأة واحدة على الأقل على رقعة الخريطة'
    ],
    screenshot: {
      url: '/help/marker-details.png',
      caption_en: 'Facility detail intelligence card displaying operational parameters, capacity, and environmental risk gauge.',
      caption_ar: 'بطاقة معلومات المنشأة توضح بيانات التشغيل والسعة ومؤشر قياس المخاطر البيئية.',
      hotspots: [
        {
          id: 'h1',
          x: 68,
          y: 28,
          label: '①',
          title_en: 'Facility Header & Status',
          title_ar: 'عنوان المنشأة وحالة التشغيل',
          desc_en: 'Bilingual name, sector badge, and operational indicator (Open / 24 Hours).',
          desc_ar: 'الاسم بالعربية والإنجليزية، شارة القطاع، ومؤشر التشغيل (مفتوح / 24 ساعة).'
        },
        {
          id: 'h2',
          x: 68,
          y: 52,
          label: '②',
          title_en: 'Environmental Risk Gauge',
          title_ar: 'مؤشر المخاطر البيئية',
          desc_en: 'Decomposes flood risk, urban heat, and water stress into a 0-100 index.',
          desc_ar: 'يفكك مخاطر الفيضانات، الحرارة الحضرية، وإجهاد المياه إلى مؤشر مركب من 0-100.'
        },
        {
          id: 'h3',
          x: 68,
          y: 82,
          label: '③',
          title_en: 'Action Toolbar',
          title_ar: 'شريط الإجراءات السريعة',
          desc_en: '1-click buttons: Get Directions, Add to Favorites, or View Analytics.',
          desc_ar: 'أزرار سريعة: احصل على الاتجاهات، أضف للمفضلة، أو افتح لوحة التحليلات.'
        }
      ]
    },
    steps_en: [
      {
        step: 1,
        instruction: 'Click directly on any facility marker icon on the map canvas or select a card from search results.',
        tip: 'The map centers smoothly on the marker and opens the floating detail intelligence sheet.'
      },
      {
        step: 2,
        instruction: 'Review the official attributes: Authority, Category, Capacity, and Contact Phone.',
        tip: 'Click the phone number or website link to open contact channels directly.'
      },
      {
        step: 3,
        instruction: 'Check the Environmental Vulnerability Score gauge (Green = Low Risk, Amber = Moderate, Red = Elevated).',
        tip: 'Hover over the risk gauge to see the specific component breakdown (e.g. Surge Risk: 12%, Heat Index: 45%).'
      },
      {
        step: 4,
        instruction: 'Click "Route Directions" to navigate to this facility, or "Save" to bookmark for later.',
        tip: 'Saving favorites requires user sign-in to sync across sessions.'
      }
    ],
    steps_ar: [
      {
        step: 1,
        instruction: 'انقر مباشرة على أيقونة المنشأة على الخريطة أو حدد بطاقة من نتائج البحث الجانبية.',
        tip: 'تتحرك الخريطة بسلاسة لتركز على العلامة وتفتح بطاقة المعلومات الذكية العائمة.'
      },
      {
        step: 2,
        instruction: 'راجع البيانات الرسمية: الجهة المشرفة، الفئة، السعة الاستيعابية، وهاتف التواصل.',
        tip: 'انقر على رقم الهاتف أو رابط الموقع الإلكتروني للتواصل المباشر.'
      },
      {
        step: 3,
        instruction: 'تحقق من عداد مؤشر الهشاشة البيئية (أخضر = منخفض، برتقالي = متوسط، أحمر = مرتفع).',
        tip: 'مرر الفأرة فوق المؤشر لمعاينة تفكيك المخاطر (مثال: خطر الفيضان: 12%، الإجهاد الحراري: 45%).'
      },
      {
        step: 4,
        instruction: 'انقر على "الاتجاهات" لحساب المسار إليها، أو "حفظ" لإضافتها لمفضلاتك.',
        tip: 'ميزة حفظ المفضلة تتطلب تسجيل الدخول لمزامنتها عبر جلساتك المختلفة.'
      }
    ],
    expectedResult_en: 'The comprehensive intelligence popup appears with official SDI data tags, risk breakdown, and quick action buttons.',
    expectedResult_ar: 'تظهر النافذة المنبثقة الذكية متضمنة بيانات SDI الرسمية ومؤشرات المخاطر وأزرار الإجراءات السريعة.',
    troubleshooting_en: 'To close the details popup, click the X button in its top-right corner or click any empty area on the map.',
    troubleshooting_ar: 'لإغلاق نافذة التفاصيل، انقر على زر X في الزاوية العلوية أو انقر في أي مساحة فارغة بالخريطة.',
    deepLinkAction: {
      label_en: 'Explore Facilities in SmartMap →',
      label_ar: 'استكشاف المنشآت في الخريطة →',
      target: { view: 'explorer' }
    },
    relatedTasks: ['task-nl-search', 'task-route-nav', 'task-reports-export']
  },
  {
    id: 'task-reports-export',
    category: 'reports',
    title_en: 'Export Executive Intelligence Reports & PDF Dossiers',
    title_ar: 'تصدير التقارير التنفيذية وملفات PDF الذكية',
    badge: 'Executive',
    readTime: '3 min read',
    overview_en: 'Generate presentation-ready executive intelligence reports with official Abu Dhabi SDI watermarks, summary charts, and vulnerability tables.',
    overview_ar: 'أنشئ تقارير تنفيذية رسمية جاهزة للعرض والطباعة تحمل علامة AD-SDI المائية، المخططات البيانية، وجداول تقييم الهشاشة.',
    beforeYouBegin_en: [
      'Perform your search or filter layers so that the desired facilities are active'
    ],
    beforeYouBegin_ar: [
      'قم بتنفيذ بحثك أو تصفية الطبقات حتى تظهر المنشآت المستهدفة في شاشة العمل'
    ],
    screenshot: {
      url: '/help/print-template-report.png',
      caption_en: 'Official executive print template layout with DGE & AD-SDI headers, satellite extent, and metadata.',
      caption_ar: 'نموذج التقرير التنفيذي الرسمي للطباعة متضمناً شعار تمكين وAD-SDI وخريطة الأقمار الصناعية والبيانات.',
      hotspots: [
        {
          id: 'h1',
          x: 10,
          y: 6,
          label: '①',
          title_en: 'Official Government Headers & Logos',
          title_ar: 'الترويسة والشعارات الحكومية الرسمية',
          desc_en: 'Official Department of Government Enablement and Abu Dhabi SDI branding.',
          desc_ar: 'الهوية الرسمية لدائرة التمكين الحكومي وبيانات أبوظبي المكانية.'
        },
        {
          id: 'h2',
          x: 50,
          y: 16,
          label: '②',
          title_en: 'Report Metadata & Viewport Extent',
          title_ar: 'بيانات التقرير ونطاق العرض',
          desc_en: 'Report date/time, project geography, active results count, and basemap details.',
          desc_ar: 'تاريخ ووقت التقرير، النطاق الجغرافي، عدد النتائج النشطة، ومعلومات الخريطة الأساسية.'
        },
        {
          id: 'h3',
          x: 50,
          y: 50,
          label: '③',
          title_en: 'Satellite Map Viewport & Legend',
          title_ar: 'خريطة الأقمار الصناعية ودليل الرموز',
          desc_en: 'Dedicated high-resolution satellite map with north arrow, scale bar, and risk legend.',
          desc_ar: 'خريطة أقمار صناعية عالية الدقة مع سهم الشمال ومقياس الرسم ودليل المخاطر.'
        }
      ]
    },
    steps_en: [
      {
        step: 1,
        instruction: 'Click the "Analytics" button on the top navbar or open it from the Left Sidebar.',
        tip: 'The comprehensive Analytics Modal overlays the workspace with live aggregated metrics.'
      },
      {
        step: 2,
        instruction: 'Review the aggregated figures: Total Assets, Average Risk Score, and Capacity Utilization.',
        tip: 'Use the tab bar to switch between "Overview", "Risk Breakdown", and "Asset Inventory".'
      },
      {
        step: 3,
        instruction: 'Click "Print Executive Report" or "Download PDF".',
        tip: 'The system renders an official AD-SDI formatted PDF document with timestamps and layer metadata.'
      },
      {
        step: 4,
        instruction: 'Choose whether to include map high-resolution snapshots or tabular facility listings.',
        tip: 'You can also copy the direct report URL to share securely with authorized colleagues.'
      }
    ],
    steps_ar: [
      {
        step: 1,
        instruction: 'انقر على زر "التحليلات" في شريط التنقل العلوي أو افتحه من الشريط الجانبي الأيسر.',
        tip: 'تفتح نافذة التحليلات الشاملة فوق مساحة العمل لتعرض أرقاماً مجمعة مباشرة.'
      },
      {
        step: 2,
        instruction: 'راجع الأرقام الإحصائية: إجمالي الأصول، متوسط درجة المخاطر، ومعدل استخدام السعة.',
        tip: 'استخدم ألسنة التبويب للتبديل بين "نظرة عامة"، "تفكيك المخاطر"، و"قائمة الأصول".'
      },
      {
        step: 3,
        instruction: 'انقر على "طباعة التقرير التنفيذي" أو "تحميل PDF".',
        tip: 'ينشئ النظام وثيقة PDF رسمية بتنسيق AD-SDI المعتمد مع الطابع الزمني وبيانات الطبقات.'
      },
      {
        step: 4,
        instruction: 'اختر تضمين لقطة خريطة عالية الدقة أو الاكتفاء بالجداول الإحصائية للأصول.',
        tip: 'يمكنك أيضاً نسخ رابط التقرير المباشر لمشاركته بأمان مع زملائك المصرح لهم.'
      }
    ],
    expectedResult_en: 'A high-resolution PDF document is produced with official branding, charts, coordinates, and layer provenance stamps.',
    expectedResult_ar: 'يتم إصدار مستند PDF عالي الجودة متضمناً الهوية الرسمية والمخططات والإحداثيات وأختام اعتماد البيانات.',
    troubleshooting_en: 'If your browser blocks the print window, ensure pop-ups are permitted for the application domain.',
    troubleshooting_ar: 'إذا حظر المتصفح نافذة الطباعة، تأكد من السماح بالنوافذ المنبثقة لنطاق التطبيق.',
    deepLinkAction: {
      label_en: 'Open Executive Analytics Modal →',
      label_ar: 'فتح لوحة التحليلات التنفيذية →',
      target: { view: 'explorer', showAnalyticsModal: true }
    },
    relatedTasks: ['task-marker-details', 'task-basemaps-legend', 'task-nl-search']
  }
];

export const TROUBLESHOOTING_GUIDES = [
  {
    id: 'ts-empty-map',
    category: 'map',
    problem_en: 'Map is empty or no facility pins appear',
    problem_ar: 'الخريطة فارغة أو لا تظهر دبابيس المنشآت',
    urgency: 'Common',
    summary_en: 'When the map canvas loads without pins or categories, it usually means filters are too restrictive, categories are unselected, or viewport is outside Abu Dhabi.',
    summary_ar: 'عندما تظهر الخريطة بدون علامات، يكون السبب غالباً تصفية صارمة جداً، أو عدم تحديد أي فئة، أو الابتعاد عن حدود إمارة أبوظبي.',
    decisionTree_en: [
      {
        question: 'Are any GIS categories checked in the Left Drawer?',
        ifYes: 'Proceed to next check.',
        ifNo: 'Solution: Open Categories Drawer (stacked squares icon) and check at least one category like "Health" or "Education".'
      },
      {
        question: 'Is there an active text search filter in the AI input bar?',
        ifYes: 'Solution: Click the "Clear" (X) button in the search bar to remove keyword or distance constraints.',
        ifNo: 'Proceed to next check.'
      },
      {
        question: 'Is your current map viewport centered on Abu Dhabi Emirate?',
        ifYes: 'Layers should be visible. Check internet connection for vector tiles.',
        ifNo: 'Solution: Click the "Center Abu Dhabi" or "Reset View" button to return to standard coordinates (24.4539° N, 54.3773° E).'
      }
    ],
    decisionTree_ar: [
      {
        question: 'هل تم تحديد أي فئة مكانية في لوحة الطبقات اليسرى؟',
        ifYes: 'انتقل للفحص التالي.',
        ifNo: 'الحل: افتح درج الفئات (أيقونة الطبقات) وحدد فئة واحدة على الأقل مثل "الصحة" أو "التعليم".'
      },
      {
        question: 'هل يوجد استعلام نصي نشط في شريط البحث السفلي؟',
        ifYes: 'الحل: انقر على زر المسح (X) في شريط البحث لإلغاء قيود الكلمات المفتاحية أو المسافة.',
        ifNo: 'انتقل للفحص التالي.'
      },
      {
        question: 'هل الخريطة ممركزة حالياً داخل نطاق إمارة أبوظبي؟',
        ifYes: 'يجب أن تظهر الطبقات. تحقق من اتصال الإنترنت لتحميل الخرائط.',
        ifNo: 'الحل: انقر على زر "إعادة التمركز" للعودة إلى إحداثيات أبوظبي القياسية (24.4539° N, 54.3773° E).'
      }
    ],
    quickFixLabel_en: 'Reset Filters & Re-center Abu Dhabi',
    quickFixLabel_ar: 'إلغاء التصفية وإعادة تمركز الخريطة',
    quickFixAction: {
      view: 'explorer',
      pendingQuery: '',
      activeMenu: 'categories'
    }
  },
  {
    id: 'ts-search-no-results',
    category: 'search',
    problem_en: 'Conversational query returns "No matching facilities found"',
    problem_ar: 'البحث الذكي يظهر "لم يتم العثور على منشآت مطابقة"',
    urgency: 'Common',
    summary_en: 'Happens if the distance radius is too narrow, the landmark name is misspelled, or combining conflicting filters.',
    summary_ar: 'يحدث هذا عند تحديد مسافة ضيقة جداً، أو خطأ في كتابة اسم المعلم، أو الدمج بين شروط متناقضة.',
    decisionTree_en: [
      {
        question: 'Did you specify a very small radius (e.g. 500 meters)?',
        ifYes: 'Solution: Expand your radius to 3 km or 5 km (e.g. "Hospitals within 5 km of Al Reem").',
        ifNo: 'Proceed to next check.'
      },
      {
        question: 'Is the landmark a recognized location in Abu Dhabi?',
        ifYes: 'Try using the Arabic or English official name (e.g. "Zayed Sports City", "Corniche", "Yas Marina").',
        ifNo: 'Solution: Search by district or municipality instead of micro-landmarks.'
      }
    ],
    decisionTree_ar: [
      {
        question: 'هل حددت نطاق مسافة صغير جداً (مثل 500 متر)؟',
        ifYes: 'الحل: قم بتوسيع النطاق إلى 3 كم أو 5 كم (مثال: "المستشفيات ضمن 5 كم من جزيرة الريم").',
        ifNo: 'انتقل للفحص التالي.'
      },
      {
        question: 'هل المعلم المذكور معتمد رسمياً في إمارة أبوظبي؟',
        ifYes: 'جرب استخدام الاسم الرسمي الشائع (مثل "مدينة زايد الرياضية"، "الكورنيش"، "مرسى ياس").',
        ifNo: 'الحل: ابحث باسم الحي أو البلدية بدلاً من المعالم الدقيقة غير المسجلة.'
      }
    ],
    quickFixLabel_en: 'Try Sample Search: "Hospitals in Abu Dhabi"',
    quickFixLabel_ar: 'تجربة بحث نموذجي: "المستشفيات في أبوظبي"',
    quickFixAction: {
      view: 'explorer',
      pendingQuery: 'Show hospitals in Abu Dhabi'
    }
  },
  {
    id: 'ts-routing-issue',
    category: 'routing',
    problem_en: 'Route navigation path is unavailable or fails to calculate',
    problem_ar: 'تعذر حساب مسار الملاحة أو المسار غير متاح',
    urgency: 'Moderate',
    summary_en: 'Occurs if GPS location permissions are denied, an offshore coordinate is picked, or start and end points are identical.',
    summary_ar: 'يحدث إذا تم رفض إذن تحديد الموقع GPS، أو اختيار نقطة داخل البحر، أو تطابق نقطتي البداية والنهاية.',
    decisionTree_en: [
      {
        question: 'Did your browser prompt for Geolocation permission?',
        ifYes: 'Ensure you clicked "Allow" so the app can retrieve your current GPS coordinates.',
        ifNo: 'Solution: Instead of "My Location", manually type a known origin facility or click "Pick on Map".'
      },
      {
        question: 'Are both points connected to the Abu Dhabi public road network?',
        ifYes: 'The routing graph should calculate in < 500ms.',
        ifNo: 'Solution: Choose a destination that has road vehicular access.'
      }
    ],
    decisionTree_ar: [
      {
        question: 'هل طلب المتصفح إذناً لتحديد موقعك الجغرافي؟',
        ifYes: 'تأكد من اختيار "سماح" ليتمكن التطبيق من قراءة إحداثياتك بدقة.',
        ifNo: 'الحل: بدلاً من "موقعي الحالي"، اكتب منشأة بداية معروفة أو اختر "حدد على الخريطة".'
      },
      {
        question: 'هل تقع النقطتان على شبكة الطرق المعتمدة في أبوظبي؟',
        ifYes: 'يتم احتساب المسار خلال أقل من 500 ملي ثانية.',
        ifNo: 'الحل: تأكد من اختيار منشأة وصول متصلة بشارع ممهد.'
      }
    ],
    quickFixLabel_en: 'Open Navigation Drawer',
    quickFixLabel_ar: 'فتح لوحة الملاحة والمسارات',
    quickFixAction: {
      view: 'explorer',
      activeMenu: 'directions'
    }
  },
  {
    id: 'ts-buffer-draw',
    category: 'spatial',
    problem_en: 'Buffer circle drawing tool does not respond',
    problem_ar: 'أداة رسم النطاق الدائري لا تستجيب على الخريطة',
    urgency: 'Moderate',
    summary_en: 'Typically occurs if another sidebar drawer (like Categories or Routing) is currently locking the map canvas interaction.',
    summary_ar: 'يحدث هذا عادة عندما تكون لوحة جانبية أخرى (مثل الفئات أو الملاحة) تستحوذ على تفاعل الخريطة.',
    decisionTree_en: [
      {
        question: 'Is another sidebar drawer open on the left?',
        ifYes: 'Solution: Close the active drawer, or click the "Draw" icon directly to switch operational mode.',
        ifNo: 'Proceed to next check.'
      },
      {
        question: 'Did you click once to place the center, and drag outward?',
        ifYes: 'Buffer will render. Click a second time to lock radius.',
        ifNo: 'Solution: Click center on map, drag to expand, click again to finalize.'
      }
    ],
    decisionTree_ar: [
      {
        question: 'هل توجد لوحة جانبية أخرى مفتوحة على اليسار؟',
        ifYes: 'الحل: أغلق اللوحة النشطة، أو انقر مباشرة على أيقونة "الرسم" لتفعيل وضع الرسم.',
        ifNo: 'انتقل للفحص التالي.'
      },
      {
        question: 'هل قمت بالنقر لتحديد المركز ثم السحب نحو الخارج؟',
        ifYes: 'سيظهر النطاق. انقر مرة ثانية لتثبيت نصف القطر.',
        ifNo: 'الحل: انقر على المركز في الخريطة، اسحب لتوسيع الدائرة، ثم انقر مجدداً للتأكيد.'
      }
    ],
    quickFixLabel_en: 'Activate Drawing Tool in SmartMap',
    quickFixLabel_ar: 'تفعيل أداة الرسم في الخريطة',
    quickFixAction: {
      view: 'explorer',
      activeMenu: 'draw'
    }
  },
  {
    id: 'ts-auth-favorites',
    category: 'auth',
    problem_en: 'Cannot save search queries or bookmark favorite facilities',
    problem_ar: 'تعذر حفظ الاستعلامات أو إضافة المنشآت للمفضلة',
    urgency: 'Low',
    summary_en: 'Guest users can explore all public data and analytics, but persistent cross-session bookmarks require user sign-in.',
    summary_ar: 'يمكن للزوار استكشاف كافة البيانات والتحليلات بحرية، لكن حفظ المفضلات وسجل الجلسات يتطلب تسجيل الدخول.',
    decisionTree_en: [
      {
        question: 'Are you currently browsing as a Guest?',
        ifYes: 'Solution: Click the user avatar in the top navbar and log in with your credentials to enable bookmarks.',
        ifNo: 'Ensure local browser storage (localStorage) is not disabled or in private browsing mode.'
      }
    ],
    decisionTree_ar: [
      {
        question: 'هل تتصفح حالياً بصفة زائر (Guest)؟',
        ifYes: 'الحل: انقر على أيقونة المستخدم في شريط التنقل العلوي وسجل الدخول لتفعيل حفظ المفضلات.',
        ifNo: 'تأكد من تمكين مساحة التخزين المحلية في المتصفح وعدم حظرها عبر التصفح المتخفي.'
      }
    ],
    quickFixLabel_en: 'Sign In / Switch Profile',
    quickFixLabel_ar: 'تسجيل الدخول / تبديل الحساب',
    quickFixAction: {
      view: 'explorer'
    }
  }
];

export const WHAT_IS_THIS_ITEMS = [
  {
    term_en: 'Conversational GeoAI Assistant',
    term_ar: 'مساعد الذكاء الاصطناعي الجغرافي',
    tag: 'Search Engine',
    desc_en: 'An intelligent natural-language parser trained on Abu Dhabi spatial nomenclature. Translates everyday English and Arabic questions into multi-criteria GIS filters, geodesic buffer queries, and category scopes.',
    desc_ar: 'محرك ذكي لتحليل اللغة الطبيعية مدرب على المعجم الجغرافي لإمارة أبوظبي. يحول الأسئلة اليومية بالعربية والإنجليزية إلى استعلامات مكانية دقيقة ونطاقات جغرافية محددة.'
  },
  {
    term_en: 'Environmental Vulnerability Score',
    term_ar: 'مؤشر الهشاشة والمخاطر البيئية',
    tag: 'Analytics Metric',
    desc_en: 'A normalized 0-100 composite index evaluating three primary spatial hazards: coastal flood surge, urban heat island intensity, and groundwater depression cones.',
    desc_ar: 'مؤشر قياسي مركب من 0 إلى 100 يقيم ثلاثة مخاطر مكانية رئيسية: فيضانات السواحل البحرية، شدة الجزر الحرارية في المدن، ومناطق هبوط المياه الجوفية.'
  },
  {
    term_en: 'Geodesic Buffer Radius',
    term_ar: 'نطاق المسافة الجيوديسي',
    tag: 'Spatial Geometry',
    desc_en: 'A true circular perimeter mapped across the curved surface of the Earth according to the WGS84 ellipsoid (EPSG:4326), ensuring exact meter accuracy unlike flat planar projections.',
    desc_ar: 'محيط دائري حقيقي يحسب وفق انحناء سطح الأرض بنظام WGS84 (EPSG:4326)، مما يضمن دقة القياس بالمتر المربع خلافاً للإسقاطات المسطحة التقليدية.'
  },
  {
    term_en: 'AD-SDI Authoritative Layers',
    term_ar: 'الطبقات الرسمية من AD-SDI',
    tag: 'Data Governance',
    desc_en: 'Standardized spatial datasets provided directly by the Abu Dhabi Spatial Data Infrastructure program and certified by the Department of Government Enablement (DGE).',
    desc_ar: 'مجموعات بيانات مكانية معيارية موثوقة تقدمها منصة البنية التحتية للبيانات المكانية وتعتمدها دائرة التمكين الحكومي بأبوظبي.'
  },
  {
    term_en: 'Progressive Pin Clustering',
    term_ar: 'تجميع العلامات التفاعلي',
    tag: 'Visualization',
    desc_en: 'An automatic level-of-detail algorithm that groups nearby facility markers at wide zoom levels to prevent screen clutter, expanding into individual pins as you zoom closer.',
    desc_ar: 'خوارزمية ذكية لتجميع العلامات القريبة عند تصغير الخريطة لمنع الازدحام البصري، وتفكيكها تلقائياً لدبابيس منفصلة كلما اقتربت من الموقع.'
  }
];

export const KEYBOARD_SHORTCUTS = [
  { key: '/', desc_en: 'Focus AI Map Assistant search bar', desc_ar: 'التركيز على شريط البحث الذكي' },
  { key: 'Esc', desc_en: 'Close active drawer / Clear selection', desc_ar: 'إغلاق اللوحة النشطة / إلغاء التحديد' },
  { key: 'L', desc_en: 'Toggle GIS Categories & Layers drawer', desc_ar: 'فتح / إغلاق لوحة الفئات المكانية' },
  { key: 'B', desc_en: 'Toggle Basemaps & Satellite switcher', desc_ar: 'فتح / إغلاق محول الخرائط الخلفية' },
  { key: 'D', desc_en: 'Activate Geodesic Drawing & Buffer tool', desc_ar: 'تفعيل أداة الرسم المكاني والنطاقات' },
  { key: 'R', desc_en: 'Open Route Navigation & Directions', desc_ar: 'فتح لوحة الملاحة وحساب المسارات' },
  { key: '+ / -', desc_en: 'Zoom map in / out smoothly', desc_ar: 'تكبير / تصغير الخريطة بسلاسة' }
];

export const PRO_TIPS = [
  {
    title_en: 'Combine Category & Proximity in One Prompt',
    title_ar: 'ادمج الفئة ونطاق القرب في جملة واحدة',
    text_en: 'You can write "Government hospitals within 4 km of Corniche". GeoVision extracts the category, the ownership filter, the radius, and the landmark in a single step!',
    text_ar: 'يمكنك كتابة "المستشفيات الحكومية ضمن 4 كم من الكورنيش". يتعرف النظام على الفئة والتبعية ونصف القطر والمعلم بضغطة واحدة!'
  },
  {
    title_en: 'Dark Mode for Risk Heatmaps',
    title_ar: 'الوضع الداكن لقراءة خرائط المخاطر',
    text_en: 'When inspecting Environmental Overlays like Urban Heat Islands, switch to the Dark basemap for maximum color contrast and visual clarity.',
    text_ar: 'عند فحص طبقات المخاطر كالجزر الحرارية، انتقل إلى الخريطة ذات الوضع الداكن للحصول على أعلى تباين بصري للألوان.'
  },
  {
    title_en: 'Progressive Results Loading',
    title_ar: 'تحميل النتائج التدريجي',
    text_en: 'The AI chat panel loads the first 10 most relevant facilities first to keep the map fast, with a "Load 10 More" button for larger lists.',
    text_ar: 'تعرض لوحة النتائج أول 10 منشآت الأكثر صلة أولاً للحفاظ على سرعة الخريطة، مع توفير زر "تحميل 10 إضافية" عند الحاجة.'
  },
  {
    title_en: 'One-Click Turn-by-Turn Navigation',
    title_ar: 'الملاحة الفورية بضغطة واحدة',
    text_en: 'Clicking "Directions" in any facility card automatically sets it as your destination and plans the fastest driving route from your current location.',
    text_ar: 'النقر على زر "الاتجاهات" في بطاقة أي منشأة يحددها كوجهة وصول فورية ويبدأ حساب أسرع مسار قيادة من موقعك الحالي.'
  }
];

export const WHATS_NEW_ITEMS = [
  {
    version: 'V2.4',
    date: 'September 2026',
    title_en: 'Interactive Help Center & Deep Linking',
    title_ar: 'مركز المساعدة التفاعلي والروابط المباشرة',
    desc_en: 'New task-based visual guides with real application screenshots, clickable hotspots, and 1-click execution inside SmartMap.',
    desc_ar: 'أدلة إرشادية مهام مصورة بلقطات حقيقية ونقاط تفاعلية مع إمكانية التنفيذ الفوري داخل الخريطة بضغطة واحدة.'
  },
  {
    version: 'V2.3',
    date: 'August 2026',
    title_en: 'Enhanced Environmental Risk Decomposition',
    title_ar: 'تحليل متقدم لمؤشرات المخاطر البيئية',
    desc_en: 'Individual breakdown of coastal surge, heat islands, and water stress scores in every facility attribute dossier.',
    desc_ar: 'تفكيك تفصيلي لمخاطر الفيضانات الساحلية والجزر الحرارية وإجهاد المياه لكل منشأة ومرفق حيوي.'
  },
  {
    version: 'V2.2',
    date: 'July 2026',
    title_en: 'Bilingual Natural Language Parsing',
    title_ar: 'معالجة ذكية ثنائية اللغة للاستعلامات',
    desc_en: 'Seamless Arabic and English understanding for proximity, sector filtering, and spatial bounds in Abu Dhabi.',
    desc_ar: 'فهم متكامل باللغتين العربية والإنجليزية لطلبات القرب الجغرافي وتصفية القطاعات وأسماء الأحياء.'
  }
];

export const AI_HELP_KNOWLEDGE = [
  {
    keywords: ['create', 'project', 'start', 'begin', 'onboarding'],
    answer_en: 'To start using GeoVision SmartMap V2: 1. Launch the Explorer workspace. 2. Use the bottom AI search bar to type natural questions (e.g. "Hospitals near Zayed Sports City"). 3. Toggle official layers from the left Categories drawer. 4. Click any marker for risk analytics and route directions.',
    answer_ar: 'لبدء استخدام جيو فيجن V2: 1. افتح مساحة عمل المستكشف. 2. استخدم شريط البحث الذكي بالأسفل لكتابة استعلاماتك. 3. فعل الطبقات الرسمية من لوحة الفئات المكانية اليسرى. 4. انقر فوق أي علامة لعرض تفاصيل المخاطر ومسار الملاحة.',
    actionLabel_en: 'Open SmartMap Workspace →',
    actionLabel_ar: 'فتح مساحة عمل الخريطة →',
    actionTarget: { view: 'explorer' },
    relatedTaskId: 'task-nl-search'
  },
  {
    keywords: ['search', 'query', 'ask', 'ai', 'proximity', 'natural language', 'distance'],
    answer_en: 'You can search using everyday language like "Show government hospitals within 5 km of Zayed Sports City". GeoVision automatically parses the category, ownership, landmark, and radius.',
    answer_ar: 'يمكنك البحث بلغة يومية مثل "المستشفيات الحكومية ضمن 5 كم من مدينة زايد الرياضية". يتعرف النظام على الفئة والتبعية والمعلم ونصف القطر تلقائياً.',
    actionLabel_en: 'Try AI Search →',
    actionLabel_ar: 'تجربة البحث الذكي →',
    actionTarget: { view: 'explorer', pendingQuery: 'hospitals within 5 km of Zayed Sports City' },
    relatedTaskId: 'task-nl-search'
  },
  {
    keywords: ['empty', 'no results', 'missing', 'why', 'disappeared', 'nothing'],
    answer_en: 'If your map appears empty: 1. Check if any category is enabled in the Left Layers drawer. 2. Clear your search text in the bottom bar. 3. Ensure the map is centered on Abu Dhabi.',
    answer_ar: 'إذا ظهرت الخريطة فارغة: 1. تأكد من تفعيل فئة مكانية واحدة على الأقل في لوحة الطبقات. 2. امسح نص البحث في الشريط السفلي. 3. تأكد من تمركز الخريطة داخل إمارة أبوظبي.',
    actionLabel_en: 'Reset Filters & Re-center →',
    actionLabel_ar: 'إلغاء التصفية وإعادة التمركز →',
    actionTarget: { view: 'explorer', pendingQuery: '', activeMenu: 'categories' },
    relatedTaskId: 'ts-empty-map'
  },
  {
    keywords: ['layer', 'categories', 'category', 'filter', 'school', 'hospital', 'clinic'],
    answer_en: 'Open the GIS Categories drawer using the stacked squares icon on the left map sidebar. Check the sectors or specific subcategories (e.g. Charter Schools) you wish to view.',
    answer_ar: 'افتح لوحة الفئات المكانية بالنقر على أيقونة الطبقات في الشريط الجانبي الأيسر. حدد القطاعات أو الفئات الفرعية (مثل مدارس الشراكات) لعرضها فورياً.',
    actionLabel_en: 'Open Categories Drawer →',
    actionLabel_ar: 'فتح لوحة الفئات المكانية →',
    actionTarget: { view: 'explorer', activeMenu: 'categories' },
    relatedTaskId: 'task-gis-categories'
  },
  {
    keywords: ['route', 'direction', 'navigation', 'drive', 'reach', 'walk'],
    answer_en: 'To calculate route directions: Click the Navigation icon (diamond turn arrow) on the left sidebar, set your Start and Destination points, or click "Get Directions" in any facility card.',
    answer_ar: 'لحساب مسار الملاحة: انقر على أيقونة الملاحة في الشريط الأيسر وحدد نقطتي البداية والنهاية، أو انقر على "الاتجاهات" من بطاقة أي منشأة.',
    actionLabel_en: 'Open Navigation →',
    actionLabel_ar: 'فتح لوحة الملاحة →',
    actionTarget: { view: 'explorer', activeMenu: 'directions' },
    relatedTaskId: 'task-route-nav'
  },
  {
    keywords: ['draw', 'buffer', 'measure', 'radius', 'circle', 'polygon'],
    answer_en: 'Select the Draw tool from the left toolbar, click on the map to set a center point, and drag outwards to generate a geodesic buffer circle or measure distance.',
    answer_ar: 'اختر أداة الرسم من الشريط الجانبي الأيسر، انقر على الخريطة لتحديد نقطة المركز واسحب للخارج لإنشاء نطاق دائري أو قياس المسافة بدقة.',
    actionLabel_en: 'Open Draw Tools →',
    actionLabel_ar: 'فتح أدوات الرسم →',
    actionTarget: { view: 'explorer', activeMenu: 'draw' },
    relatedTaskId: 'task-spatial-draw'
  },
  {
    keywords: ['report', 'export', 'pdf', 'analytics', 'risk', 'print'],
    answer_en: 'Click "Analytics" in the top navbar or the left sidebar to open the Executive Intelligence Dashboard. You can inspect aggregate risk metrics and click "Download PDF" for an official report.',
    answer_ar: 'انقر على "التحليلات" في الشريط العلوي أو الجانبي لفتح لوحة الذكاء التنفيذي، حيث يمكنك معاينة مؤشرات المخاطر وتحميل تقرير PDF رسمي.',
    actionLabel_en: 'Open Analytics Modal →',
    actionLabel_ar: 'فتح لوحة التحليلات →',
    actionTarget: { view: 'explorer', showAnalyticsModal: true },
    relatedTaskId: 'task-reports-export'
  },
  {
    keywords: ['basemap', 'satellite', 'dark', 'topo', 'style', 'legend'],
    answer_en: 'Click the Basemap icon on the left toolbar to toggle between Satellite, Dark Analytics, Topographic, and Street views, or open the Legend to inspect risk overlays.',
    answer_ar: 'انقر على أيقونة الخرائط في الشريط الأيسر للتبديل بين الأقمار الصناعية، الوضع الداكن، التضاريس، والشوارع، أو افتح المفتاح لمعاينة طبقات المخاطر.',
    actionLabel_en: 'Open Basemap Selector →',
    actionLabel_ar: 'فتح محول الخرائط →',
    actionTarget: { view: 'explorer', activeMenu: 'legend' },
    relatedTaskId: 'task-basemaps-legend'
  }
];
