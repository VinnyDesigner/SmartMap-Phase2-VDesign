import React, { useRef, useMemo } from 'react';
import { Sparkles, PlusCircle, X, Filter } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import AiChatInterface from './AiChatInterface';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { GIS_CATEGORIES_DATA } from './GisCategoriesPanel';

export default function BottomDataPanel({ explorerState, setExplorerState, onNavigate }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 25, mass: 1.5 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25, mass: 1.5 });

  const glowBackground = useMotionTemplate`radial-gradient(800px at ${springX}px ${springY}px, ${isDarkMode ? 'rgba(0, 229, 255, 0.08)' : 'rgba(61, 82, 160, 0.08)'}, rgba(255, 255, 255, 0))`;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Resolve selected GIS subcategory pills
  const selectedSubcategoryIds = explorerState?.selectedGisSubcategories || [];
  const activeCategoryPills = useMemo(() => {
    const pills = [];
    GIS_CATEGORIES_DATA.forEach(cat => {
      cat.subcategories.forEach(sub => {
        if (selectedSubcategoryIds.includes(sub.id)) {
          pills.push({
            id: sub.id,
            label: isArabic ? sub.label_ar : sub.label,
            categoryTitle: isArabic ? cat.title_ar : cat.title,
            Icon: cat.icon
          });
        }
      });
    });
    return pills;
  }, [selectedSubcategoryIds, isArabic]);

  const handleRemoveSubcategoryPill = (subId) => {
    setExplorerState(prev => ({
      ...prev,
      selectedGisSubcategories: (prev.selectedGisSubcategories || []).filter(id => id !== subId)
    }));
  };

  const handleClearAllCategoryPills = () => {
    setExplorerState(prev => ({
      ...prev,
      selectedGisSubcategories: []
    }));
  };

  const handleNewChat = () => {
    setExplorerState(prev => {
      const currentHistory = prev.chatHistory || [];
      const savedHistory = prev.savedChatHistory || [];
      
      let updatedSaved = savedHistory;
      if (currentHistory.length > 1) {
        updatedSaved = [
          {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            preview: currentHistory[currentHistory.length - 1]?.content?.slice(0, 40) + '...',
            messages: currentHistory
          },
          ...savedHistory
        ];
      }

      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: isArabic 
          ? "مرحباً! بدأت محادثة جديدة. أنا منصة القرار الذكي للمعلومات المكانية أبوظبي GeoAI. عما تبحث؟" 
          : "Hello! Started a new AI conversation. I'm your Abu Dhabi Conversational GeoAI Workspace. What are you looking for?",
        suggestions: isArabic 
          ? ["عرض منشآت التصنيع عالية الخطورة في أبوظبي", "مقارنة الانبعاثات بين مصفح وكيزاد", "لماذا هذه المنشأة عالية الخطورة؟"] 
          : ["Show high-risk manufacturing facilities in Abu Dhabi", "Compare emissions between Mussafah and KIZAD", "Why is this facility high risk?"]
      };

      return {
        ...prev,
        chatHistory: [welcomeMessage],
        savedChatHistory: updatedSaved,
        selectedLocation: null,
        activeFilters: {}
      };
    });
  };

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden pointer-events-auto transition-colors duration-300 ${
      isDarkMode ? 'bg-[#060a12] text-slate-100' : 'bg-white text-slate-800'
    }`}>
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative flex-1 flex flex-col h-full overflow-hidden"
      >
        {/* Subtle Interactive Glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: glowBackground }}
        />

        {/* Panel Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b relative z-20 shrink-0 ${
          isDarkMode ? 'bg-[#0a0f1d] border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-xs ${
              isDarkMode ? 'bg-[#0d1424] border border-slate-800 text-[#c084fc]' : 'bg-gradient-to-br from-blue-50 to-[#eef3ff] border-blue-100/60 text-[#3D52A0]'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`font-bold text-[14px] tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {t('AI Map Assistant', 'مساعد الخرائط الذكي')}
              </h2>
              <p className={`text-[10px] font-medium tracking-tight flex items-center gap-1.5 mt-0.5 ${
                isDarkMode ? 'text-slate-400' : 'text-[#3D52A0]/80'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('Ready to explore', 'جاهز للاستكشاف')}
              </p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all shadow-2xs cursor-pointer group shrink-0 ${
              isDarkMode 
                ? 'bg-[#131b2e] text-white border-slate-700/80 hover:bg-[#1e2a44]' 
                : 'bg-[#eef3ff] text-[#3D52A0] border-[#3D52A0]/20 hover:bg-[#3D52A0] hover:text-white'
            }`}
            title={t("Start New Conversation", "بدء محادثة جديدة")}
          >
            <PlusCircle className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            <span>{t('New Chat', 'محادثة جديدة')}</span>
          </button>
        </div>

        {/* ACTIVE GIS CATEGORY FILTER PILLS */}
        <AnimatePresence>
          {activeCategoryPills.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`border-b px-3.5 py-2 flex items-center gap-1.5 overflow-x-auto sleek-scrollbar shrink-0 relative z-20 ${
                isDarkMode ? 'border-slate-800 bg-[#0a1128]/80' : 'border-slate-200/80 bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 me-1">
                <Filter className={`w-3 h-3 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />
                <span>{t('Active:', 'نشط:')}</span>
              </div>

              {activeCategoryPills.map(pill => (
                <span
                  key={pill.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 shadow-2xs transition-all group ${
                    isDarkMode 
                      ? 'bg-[#1e2e5a] text-[#00e5ff] border-slate-700/80 hover:bg-rose-900/40 hover:text-rose-400 hover:border-rose-700' 
                      : 'bg-[#eef3ff] text-[#3D52A0] border-[#3D52A0]/20 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                  }`}
                >
                  <span>{pill.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategoryPill(pill.id)}
                    className="w-3.5 h-3.5 rounded-full hover:bg-rose-200/80 flex items-center justify-center transition-colors cursor-pointer"
                    title={t('Remove filter', 'إزالة الفلتر')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {activeCategoryPills.length >= 2 && (
                <button
                  onClick={handleClearAllCategoryPills}
                  className="text-[10px] font-bold text-slate-400 hover:text-rose-400 transition-colors shrink-0 ms-auto cursor-pointer"
                >
                  {t('Clear All', 'مسح الكل')}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Content Area */}
        <div className="flex-1 relative z-10 w-full overflow-hidden flex flex-col bg-transparent">
          <AiChatInterface 
            explorerState={explorerState}
            setExplorerState={setExplorerState}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}
