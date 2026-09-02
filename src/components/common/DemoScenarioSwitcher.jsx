import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown, Play, User, Lock, History, Bookmark, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function DemoScenarioSwitcher({ onLaunchScenario }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const scenarios = [
    {
      id: 'nearby_hospitals',
      title: isArabic ? '1. العثور على المستشفيات (5 كم)' : '1. Guest: Nearby Hospitals (5 km)',
      subtitle: isArabic ? 'تحليل النطاق المكاني والموقع' : 'Spatial radius & location analysis',
      query: 'Show hospitals within 5 km of my location',
      icon: MapPin
    },
    {
      id: 'schools_transit',
      title: isArabic ? '2. المدارس + الحافلات (2 كم)' : '2. Guest: Schools + Bus Stations (2 km)',
      subtitle: isArabic ? 'استعلام عابر للطبقات المكانية' : 'Cross-layer GIS buffer query',
      query: 'Show schools within 2 km of bus stations in Khalifa City',
      icon: Play
    },
    {
      id: 'healthcare_analysis',
      title: isArabic ? '3. تحليل المناطق الصحية' : '3. Guest: Healthcare Analysis (Chart)',
      subtitle: isArabic ? 'تحليل تجميعي ومخطط بياني' : 'Spatial aggregation & chart view',
      query: 'Which area has the highest number of healthcare facilities?',
      icon: Sparkles
    },
    {
      id: 'multiturn_context',
      title: isArabic ? '4. المحادثة المتعددة المراحل' : '4. Multi-Turn Context Flow',
      subtitle: isArabic ? 'الاحتفاظ بالسياق والفلاتر النشطة' : 'Context memory & active chips',
      query: 'Show hospitals in Khalifa City',
      icon: History
    },
    {
      id: 'guest_auth_save',
      title: isArabic ? '5. حفظ البحث وتأكيد الهوية' : '5. Guest → Login → Save Search',
      subtitle: isArabic ? 'طلب تسجيل الدخول وتجربة UAE PASS' : 'Sign in prompt & UAE PASS flow',
      query: 'Save this search',
      icon: Lock
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
