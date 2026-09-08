import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronDown, Check, Compass, Zap, Building, Bus, Database } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const DOMAIN_ICONS = {
  Tourism: Compass,
  Infrastructure: Zap,
  Government: Building,
  Mobility: Bus
};

export default function ProjectSelectorDropdown({ setExplorerState }) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeProject, projectList, switchProject } = useProject();
  const { isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProject = (projectId) => {
    switchProject(projectId, setExplorerState, isArabic);
    setIsOpen(false);
  };

  const ActiveIcon = DOMAIN_ICONS[activeProject.domain] || Layers;

  return (
    <div className="relative inline-block text-start pointer-events-auto" ref={dropdownRef}>
      {/* Active Project Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-full border shadow-2xs flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
          isDarkMode 
            ? 'bg-[#0f1932]/90 border-slate-700/80 text-white hover:bg-[#182645] hover:border-[#00e5ff]/50' 
            : 'bg-white/90 border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-[#215A9E]/40'
        }`}
        title={isArabic ? 'تغيير نطاق المشروع الحالي' : 'Switch Active Project Scope'}
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-[#00e5ff]/15 text-[#00e5ff]' : 'bg-[#215A9E]/10 text-[#215A9E]'
        }`}>
          <ActiveIcon className="w-3 h-3" />
        </div>
        
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="truncate max-w-[130px] sm:max-w-[170px] text-[12px]">
              {isArabic ? activeProject.name_ar : activeProject.name}
            </span>
            <span className="hidden xl:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {isArabic ? activeProject.badgeLabel_ar : activeProject.badgeLabel}
            </span>
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 ${isArabic ? 'start-0' : 'end-0 sm:start-0'} w-72 sm:w-80 rounded-2xl p-2.5 shadow-2xl border z-[999] backdrop-blur-xl ${
              isDarkMode 
                ? 'bg-[#0b132b]/98 border-slate-700/90 text-white' 
                : 'bg-white/98 border-slate-200 text-slate-900'
            }`}
          >
            {/* Header Title */}
            <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2 mb-1">
              <span className="text-[10px] font-bold text-[#3D52A0] dark:text-[#00e5ff] tracking-wide uppercase flex items-center gap-1">
                <Database className="w-3 h-3" />
                {isArabic ? 'مشاريع الخرائط الذكية المعرفية' : 'Active SmartMap Projects'}
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {projectList.length} {isArabic ? 'مشاريع' : 'Projects'}
              </span>
            </div>

            {/* List of Projects */}
            <div className="flex flex-col gap-1 max-h-72 overflow-y-auto sleek-scrollbar">
              {projectList.map((proj) => {
                const IconComp = DOMAIN_ICONS[proj.domain] || Layers;
                const isSelected = proj.id === activeProject.id;

                return (
                  <button
                    key={proj.id}
                    onClick={() => handleSelectProject(proj.id)}
                    className={`p-2.5 rounded-xl text-start border transition-all flex items-start gap-2.5 cursor-pointer group ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-[#182645] border-[#00e5ff]/60 text-white shadow-xs'
                          : 'bg-[#eef3ff] border-[#215A9E]/40 text-[#215A9E] shadow-xs'
                        : isDarkMode
                          ? 'bg-transparent border-transparent hover:bg-slate-800/60 hover:border-slate-700'
                          : 'bg-transparent border-transparent hover:bg-slate-100/80 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? isDarkMode ? 'bg-[#00e5ff] text-slate-950 font-bold' : 'bg-[#215A9E] text-white'
                        : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold truncate leading-tight">
                          {isArabic ? proj.name_ar : proj.name}
                        </h4>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                        {isArabic ? proj.description_ar : proj.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-semibold text-slate-400">
                          {proj.datasets.length} {isArabic ? 'أصول مكانية' : 'spatial features'}
                        </span>
                      </div>
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
