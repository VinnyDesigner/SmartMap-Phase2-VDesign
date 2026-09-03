import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown, Play, User, Lock, History, Bookmark, MapPin, Filter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function DemoScenarioSwitcher({ onLaunchScenario }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const scenarios = [
    {
      id: 'acceptance_journey',
      title: isArabic ? '⭐ رحلة القبول النهائية (7 خطوات)' : '⭐ Final Acceptance Journey (7-Step)',
      subtitle: isArabic ? 'مستشفيات ← حكومي ← 5 كم ← الأقرب ← تفاصيلها' : 'Hospitals → Govt → 5km → Closest → Details',
      query: 'Show hospitals in Abu Dhabi',
      icon: Sparkles
    },
    {
      id: 'scene_1_nearby',
      title: isArabic ? '1. استكشاف المستشفيات (5 كم)' : '1. Guest: Nearby Hospitals (5 km)',
      subtitle: isArabic ? 'نطاق 5 كم والموقع الحالي' : 'Proximity radius & location detection',
      query: 'Show hospitals within 5 km of my location',
      icon: MapPin
    },
    {
      id: 'scene_2_government',
      title: isArabic ? '2. التصفية: حكومي فقط' : '2. Refine: Only Government Hospitals',
      subtitle: isArabic ? 'فلترة حسب نوع الملكية' : 'Context-aware ownership filter',
      query: 'Only government hospitals',
      icon: Filter
    },
    {
      id: 'scene_3_nearest',
      title: isArabic ? '3. تحديد الأقرب من موقعي' : '3. Nearest Facility Identification',
      subtitle: isArabic ? 'ترتيب النتائج بالمسافة' : 'Distance ranking & focal card zoom',
      query: 'Which one is nearest to me?',
      icon: Play
    },
    {
      id: 'scene_4_cross_layer',
      title: isArabic ? '4. مدارس + مستشفيات (2 كم)' : '4. Multi-Layer: Schools near Hospitals',
      subtitle: isArabic ? 'تحليل مكاني عابر للطبقات' : 'Cross-layer GIS buffer analysis',
      query: 'Show schools within 2 km of these hospitals',
      icon: Sparkles
    },
    {
      id: 'scene_5_transit_schools',
      title: isArabic ? '5. مدارس + حافلات (مدينة خليفة)' : '5. Cross-Layer: Schools + Bus Stations',
      subtitle: isArabic ? 'نطاق 2 كم في مدينة خليفة' : 'Khalifa City 2 km transit buffer',
      query: 'Show schools within 2 km of bus stations in Khalifa City',
      icon: Bookmark
    },
    {
      id: 'scene_6_auth_transition',
      title: isArabic ? '6. تسجيل الدخول وحفظ البحث' : '6. Guest → Login → Save Search',
      subtitle: isArabic ? 'طلب الهوية الرقمية وتأكيد الحفظ' : 'UAE PASS sign in & auto-save',
      query: 'Save this search',
      icon: Lock
    },
    {
      id: 'scene_7_analytics',
      title: isArabic ? '7. التحليل المكاني التجميعي' : '7. Spatial Aggregation Analytics',
      subtitle: isArabic ? 'ترتيب القطاعات والرسوم البيانية' : 'District ranking table & bar chart',
      query: 'Which area has the highest number of healthcare facilities?',
      icon: History
    },
    {
      id: 'scene_8_arabic',
      title: isArabic ? '8. الاستعلام باللغة العربية' : '8. Arabic Natural Language Query',
      subtitle: isArabic ? 'استعلام عربي وتنسيق RTL' : 'Arabic NLP reasoning & RTL layout',
      query: 'اعرض المستشفيات الموجودة في مدينة خليفة.',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-4 start-4 z-[90] pointer-events-auto">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
          isDarkMode 
            ? 'bg-[#0f172a]/90 border-slate-700/80 text-[#00e5ff] hover:bg-slate-800' 
            : 'bg-white/90 border-slate-200 text-[#215A9E] hover:bg-slate-50'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>{isArabic ? 'سيناريوهات العرض' : 'Demo Journeys'}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute bottom-10 start-0 w-72 sm:w-80 rounded-2xl p-3 shadow-2xl border mb-2 flex flex-col gap-1.5 backdrop-blur-xl ${
              isDarkMode 
                ? 'bg-[#0b132b]/95 border-slate-700/90 text-white' 
                : 'bg-white/95 border-slate-200 text-slate-900'
            }`}
          >
            <div className="px-2 py-1 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-[#3D52A0] dark:text-[#00e5ff] tracking-wide uppercase">
                {isArabic ? 'عرض أصحاب القرار DGE' : 'DGE Stakeholder Demo Scenarios'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                PROTOTYPE
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-1 max-h-72 overflow-y-auto sleek-scrollbar">
              {scenarios.map((sc) => {
                const IconComponent = sc.icon;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setIsOpen(false);
                      onLaunchScenario(sc.query);
                    }}
                    className={`p-2 rounded-xl text-start border transition-all flex items-start gap-2.5 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-[#101a36]/60 border-slate-800/80 hover:bg-[#182645] hover:border-[#7c3aed]/50' 
                        : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 hover:border-[#215A9E]/40'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#215A9E]/10 dark:bg-[#00e5ff]/10 text-[#215A9E] dark:text-[#00e5ff] flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold truncate leading-tight">{sc.title}</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{sc.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
