import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Search, Map, Layers, ShieldCheck, MessageSquare, 
  ChevronDown, ArrowRight, Zap, Database, CheckCircle2, Lock,
  Globe, Compass, Terminal, FileText, UserCheck, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';


export default function HelpPage({ onNavigate, explorerState, setExplorerState, userAuth, setUserAuth }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const faqs = [
    {
      id: 1,
      category: 'ai',
      q_en: 'How do I ask natural language GIS questions?',
      q_ar: 'كيف أطرح أسئلة الجغرافيا المكانية بلغة طبيعية؟',
      a_en: 'Simply type your question into the AI Map Assistant input box at the bottom of the screen or select from preset suggestions. You can ask for proximity (e.g., "hospitals within 5 km of Zayed Sports City"), category filtering ("show government hospitals"), or complex multi-layer searches ("schools near bus stations").',
      a_ar: 'ببساطة اكتب سؤالك في صندوق إدخال مساعد الخريطة الذكي في أسفل الشاشة أو اختر من الاقتراحات الجاهزة. يمكنك السؤال عن القرب ("المستشفيات ضمن 5 كم من مدينة زايد الرياضية")، أو تصفية الفئات ("المستشفيات الحكومية فقط")، أو الاستعلامات المركبة متعددة الطبقات ("المدارس بالقرب من محطات الحافلات").'
    },
    {
      id: 2,
      category: 'auth',
      q_en: 'What features require User Authentication?',
      q_ar: 'ما هي الميزات التي تتطلب تسجيل الدخول؟',
      a_en: 'Guest users can freely search locations, switch basemaps, filter GIS categories, view analytics & risk profiles, print executive reports, and navigate pages. Registered users logged in gain access to Saved Searches, Favorites, and Multi-session History.',
      a_ar: 'يمكن للزوار البحث بحرية عن المواقع، استكشاف الخرائط، تصفية الفئات المكانية، عرض التحليلات ومخاطر البيئة، طباعة التقارير التنفيذية، والتنقل بين الصفحات. بينما يحصل المستخدمون المسجلون على ميزات حفظ الاستعلامات والمفضلة وسجل المحادثات.'
    },
    {
      id: 3,
      category: 'map',
      q_en: 'How do I switch map layers and basemaps?',
      q_ar: 'كيف أقوم بالتبديل بين طبقات الخريطة والخرائط الخلفية؟',
      a_en: 'Use the left-hand map controls sidebar. Click the Layers icon to open the GIS Categories drawer, click the Basemap icon to toggle between Satellite, Dark, Topo, and Streets view, or click the Legend icon to inspect layer symbology and toggle spatial risk overlays.',
      a_ar: 'استخدم شريط أدوات الخريطة الأيسر. انقر على أيقونة الطبقات لفتح لوحة الفئات المكانية، أو أيقونة الخرائط الخلفية للتبديل بين الأقمار الصناعية، الوضع الداكن، التضاريس، والشوارع، أو انقر على المفتاح لعرض رموز الطبقات والمخاطر.'
    },
    {
      id: 4,
      category: 'spatial',
      q_en: 'How is spatial risk & buffer analysis calculated?',
      q_ar: 'كيف يتم حساب تحليل المخاطر والنطاقات المكانية؟',
      a_en: 'GeoVision SmartMap V2 executes WGS84 EPSG:4326 Point-in-Polygon spatial algorithms combined with circular geodesic buffer calculations. Compound risk scores (0-100) are evaluated across coastal flood surge zones, urban heat island metrics, and groundwater depletion basins.',
      a_ar: 'تقوم المنصة بتنفيذ خوارزميات مكانية دقيقة وفق نظام WGS84 EPSG:4326 لحساب النطاقات الدائرية وتقاطع النقاط في المضلعات. وتعتمد درجة الخطورة المركبة (0-100) على مخاطر الفيضانات الساحلية، الجزر الحرارية الحضرية، وإجهاد المياه الجوفية.'
    }
  ];

  const sampleQueries = [
    { en: 'Show hospitals in Abu Dhabi', ar: 'اعرض المستشفيات في أبوظبي', icon: '🏥' },
    { en: 'Only government hospitals', ar: 'المستشفيات الحكومية فقط', icon: '🏛️' },
    { en: 'Within 5 km of Zayed Sports City', ar: 'ضمن نطاق 5 كم من مدينة زايد الرياضية', icon: '📏' },
    { en: 'Which one is closest?', ar: 'أيها الأقرب لي؟', icon: '🥇' },
    { en: 'Show parks near Yas', ar: 'اعرض الحدائق بالقرب من ياس', icon: '🌲' },
    { en: 'Show schools near bus stations', ar: 'اعرض المدارس القريبة من محطات الحافلات', icon: '🎓' }
  ];

  return (
    <div className={`w-full flex-1 overflow-y-auto pt-16 md:pt-20 flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-[#060b19] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-8 md:py-12 space-y-10">
        {/* Page Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3D52A0]/10 dark:bg-[#00e5ff]/10 text-[#3D52A0] dark:text-[#00e5ff] border border-[#3D52A0]/20 dark:border-[#00e5ff]/20 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>{t("SmartMap V2 User Guide & Documentation", "دليل المستخدم وتوثيق المنصة")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {isArabic ? "كيف يمكننا مساعدتك اليوم؟" : "How can we help you explore Abu Dhabi?"}
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {isArabic 
              ? "تعلم كيفية استخدام منصة التحليل الجغرافي الذكي، طرح الاستعلامات باللغة الطبيعية، والوصول إلى طبقات البيانات المكانية الرسمية." 
              : "Learn how to query spatial layers using natural language, switch map basemaps, interpret risk analytics, and save custom workspaces."}
          </p>
        </div>

        {/* Quick Features Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: MessageSquare,
              title_en: "Conversational GeoAI",
              title_ar: "الذكاء الاصطناعي الجغرافي",
              desc_en: "Ask questions naturally in English or Arabic for instant spatial answers.",
              desc_ar: "اطرح أسئلتك باللغة العربية أو الإنجليزية للحصول على إجابات مكانية فورية."
            },
            {
              icon: Map,
              title_en: "Basemaps & Layers",
              title_ar: "الخرائط والطبقات المكانية",
              desc_en: "Toggle between Satellite, Dark, Topo, and Streets basemap styles.",
              desc_ar: "قم بالتبديل بين الأقمار الصناعية، الوضع الداكن، التضاريس، والشوارع."
            },
            {
              icon: ShieldCheck,
              title_en: "Authoritative SDI Data",
              title_ar: "بيانات موثوقة من SDI",
              desc_en: "Official geospatial layers provided by Abu Dhabi Government Enablement (DGE).",
              desc_ar: "طبقات مكانية رسمية مقدمة من دائرة التمكين الحكومي في أبوظبي."
            },
            {
              icon: Lock,
              title_en: "Secure User Access",
              title_ar: "تسجيل الدخول الآمن",
              desc_en: "Sign in to unlock Saved Searches, History, and Executive Reports.",
              desc_ar: "سجل الدخول لفتح الاستعلامات المحفوظة، السجل والتقارير التنفيذية."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`p-5 rounded-3xl border transition-all hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-[#0f1932]/90 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200/90 shadow-2xs hover:border-[#3D52A0]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#215A9E] to-[#7c3aed] text-white flex items-center justify-center mb-3 shadow-md">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm mb-1">{t(item.title_en, item.title_ar)}</h3>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t(item.desc_en, item.desc_ar)}</p>
            </div>
          ))}
        </div>

        {/* Natural Language Query Cheatsheet */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${
          isDarkMode ? 'bg-[#0e172e] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("Sample Natural Language Queries", "نماذج الاستعلامات المكانية")}</h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t("Click any query example below to try it directly in the AI Assistant workspace:", "انقر على أي مثال أدناه لتجربته مباشرة في منصة الاستكشاف:")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setExplorerState(prev => ({ ...prev, pendingQuery: isArabic ? item.ar : item.en }));
                  onNavigate('explorer');
                }}
                className={`p-3.5 rounded-2xl border text-start flex items-center gap-3 transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-[#14203e] border-slate-700/80 hover:bg-[#7c3aed] hover:border-[#7c3aed] text-slate-100' 
                    : 'bg-slate-50 border-slate-200 hover:bg-[#215A9E] hover:text-white hover:border-[#215A9E] text-slate-800'
                }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                <span className="text-xs font-semibold flex-1 leading-snug">{t(item.en, item.ar)}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all rtl:-scale-x-100 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold">{t("Frequently Asked Questions", "الأسئلة الشائعة")}</h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t("Everything you need to know about GeoVision SmartMap V2 capabilities.", "كل ما تحتاج معرفته حول قدرات منصة GeoVision SmartMap V2.")}
            </p>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 cursor-pointer font-bold text-xs sm:text-sm"
                  >
                    <span>{t(faq.q_en, faq.q_ar)}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#3D52A0] dark:text-[#00e5ff]' : 'text-slate-400'}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`p-4 sm:p-5 pt-0 text-xs leading-relaxed border-t ${
                          isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                        }`}>
                          {t(faq.a_en, faq.a_ar)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Banner to Explore Map */}
        <div className="rounded-3xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-start">
            <h3 className="text-xl font-bold">{t("Ready to start exploring Abu Dhabi?", "جاهز لبدء استكشاف أبوظبي؟")}</h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
              {t("Launch the interactive GeoAI Map workspace to query spatial layers, view risk decomposition, and analyze locations.", "افتح منصة الخريطة التفاعلية لاختبار الاستعلامات المكانية وتحليل المخاطر والمواقع.")}
            </p>
          </div>
          <button
            onClick={() => onNavigate('explorer')}
            className="px-6 py-3 rounded-2xl bg-white text-[#215A9E] hover:bg-slate-100 font-extrabold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>{t("Open SmartMap Workspace", "فتح منصة الخريطة الذكية")}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </main>

      <footer className={`py-6 border-t text-center text-xs ${
        isDarkMode ? 'bg-[#040814] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <p>© 2026 Abu Dhabi Spatial Data Infrastructure (AD-SDI) • Department of Government Enablement (DGE)</p>
      </footer>
    </div>
  );
}
