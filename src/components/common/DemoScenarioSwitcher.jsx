import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown, Play, User, Lock, History, Bookmark, MapPin, Filter, AlertTriangle, Database, Layers } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function DemoScenarioSwitcher({ onLaunchScenario }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const scenarios = [
    {
      id: 'journey_1',
      number: '1',
      title: isArabic ? '1. بحث بسيط (مضيف)' : '1. Simple Search (Guest)',
      subtitle: isArabic ? 'استعلام بسيط لمستشفيات مدينة خليفة' : 'Basic query for hospitals in Khalifa City',
      query: 'Show hospitals in Khalifa City',
      badge: 'Guest',
      icon: MapPin
    },
    {
      id: 'journey_2',
      number: '2',
      title: isArabic ? '2. بحث الأماكن القريبة (مضيف)' : '2. Nearby Search (Guest)',
      subtitle: isArabic ? 'تحليل نطاق 5 كم ودعم GPS' : '5 km radius buffer & location detection',
      query: 'Show hospitals within 5 km of my location',
      badge: 'Guest',
      icon: Play
    },
    {
      id: 'journey_3',
      number: '3',
      title: isArabic ? '3. المتابعة التراكمية (5 خطوات)' : '3. Progressive Follow-up (5-Step Journey)',
      subtitle: isArabic ? 'مستشفيات ← حكومي ← 5 كم ← الأقرب ← تفاصيلها' : 'Abu Dhabi → Govt → 5km → Closest → Details',
      query: 'Show hospitals in Abu Dhabi',
      badge: 'Guest',
      icon: Sparkles
    },
    {
      id: 'journey_4',
      number: '4',
      title: isArabic ? '4. الاستعلام عابر الطبقات (مضيف)' : '4. Complex Cross-Layer (Guest)',
      subtitle: isArabic ? 'مدارس ضمن 2 كم من محطات الحافلات' : 'Schools within 2 km of bus stations',
      query: 'Show schools within 2 km of bus stations in Khalifa City',
      badge: 'Guest',
      icon: Layers
    },
    {
      id: 'journey_5',
      number: '5',
      title: isArabic ? '5. البحث الأماكن المبهمة (مضيف)' : '5. Ambiguous Search (Guest)',
      subtitle: isArabic ? 'توضيح مواقع "ياس" وتعيين بني ياس' : 'Location disambiguation options for "Yas"',
      query: 'Show parks near Yas',
      badge: 'Guest',
      icon: Filter
    },
    {
      id: 'journey_6',
      number: '6',
      title: isArabic ? '6. التعافي والبيانات المفقودة (مضيف)' : '6. No Results & Unsupported Recovery',
      subtitle: isArabic ? 'خيارات البدائل عند 0 نتائج والبيانات غير المتوفرة' : 'Query-derived alternatives & topic fallback',
      query: 'Show rehabilitation centers within 1 km of Zayed City',
      badge: 'Guest',
      icon: AlertTriangle
    },
    {
      id: 'journey_7',
      number: '7',
      title: isArabic ? '7. التحليل والمفضلة (مسجل)' : '7. Analytics & Personalization (Registered)',
      subtitle: isArabic ? 'ترتيب المناطق وحفظ الاستعلام للمفضلة' : 'Spatial aggregation table & save search',
      query: 'Which area has the highest number of healthcare facilities?',
      badge: 'Registered',
      icon: History
    },
    {
      id: 'journey_8',
      number: '8',
      title: isArabic ? '8. التوصيات باللغة العربية (مسجل)' : '8. Recommendation & Arabic NLP (Registered)',
      subtitle: isArabic ? 'استعلام عربي ومعالجة RTL متكاملة' : 'Arabic natural language & RTL support',
      query: 'اعرض المستشفيات الموجودة في مدينة خليفة.',
      badge: 'Registered',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-4 start-4 z-[90] pointer-events-auto">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2 rounded-full backdrop-blur-md border shadow-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
          isDarkMode 
            ? 'bg-[#0f172a]/95 border-slate-700/80 text-[#00e5ff] hover:bg-slate-800' 
            : 'bg-white/95 border-slate-200 text-[#215A9E] hover:bg-slate-50'
        }`}
      >
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>{isArabic ? 'سيناريوهات العرض الثمانية (8)' : '8 Demo Journeys'}</span>
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
            className={`absolute bottom-12 start-0 w-80 sm:w-96 rounded-2xl p-3.5 shadow-2xl border mb-2 flex flex-col gap-2 backdrop-blur-xl ${
              isDarkMode 
                ? 'bg-[#0b132b]/98 border-slate-700/90 text-white' 
                : 'bg-white/98 border-slate-200 text-slate-900'
            }`}
          >
            <div className="px-2 py-1 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-[#3D52A0] dark:text-[#00e5ff] tracking-wide uppercase">
                {isArabic ? 'رحلات العرض الثمانية المعرفية DGE' : 'DGE 8 Specified Demo Journeys'}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                CLIENT SPEC
              </span>
            </div>

            <div className="flex flex-col gap-1.5 mt-1 max-h-80 overflow-y-auto sleek-scrollbar">
              {scenarios.map((sc) => {
                const IconComponent = sc.icon;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setIsOpen(false);
                      onLaunchScenario(sc.query);
                    }}
                    className={`p-2.5 rounded-xl text-start border transition-all flex items-start gap-3 cursor-pointer group ${
                      isDarkMode 
                        ? 'bg-[#101a36]/60 border-slate-800/80 hover:bg-[#182645] hover:border-[#7c3aed]/50' 
                        : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 hover:border-[#215A9E]/40'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#215A9E]/10 dark:bg-[#00e5ff]/10 text-[#215A9E] dark:text-[#00e5ff] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-bold truncate leading-tight">{sc.title}</h5>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          sc.badge === 'Guest' 
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                        }`}>
                          {sc.badge}
                        </span>
                      </div>
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
