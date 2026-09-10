// src/components/HelpPage.jsx
// Enterprise Interactive Help Center for GeoVision SmartMap V2
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Search, Map, Layers, ShieldCheck, MessageSquare, 
  ChevronDown, ArrowRight, ArrowLeft, Zap, Database, CheckCircle2, Lock,
  Globe, Compass, Terminal, FileText, UserCheck, AlertTriangle,
  Bot, Sparkles, BookOpen, Wrench, Lightbulb, Check, ExternalLink,
  Sliders, X, ChevronRight, Play, Navigation, CheckCircle, RotateCcw,
  Clock, Award, Sparkle, Tag, Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// Data and subcomponents
import { 
  HELP_CATEGORIES, 
  GETTING_STARTED_STEPS, 
  TASK_ARTICLES, 
  TROUBLESHOOTING_GUIDES, 
  WHAT_IS_THIS_ITEMS, 
  KEYBOARD_SHORTCUTS, 
  PRO_TIPS, 
  WHATS_NEW_ITEMS 
} from '../data/helpData';
import HelpInteractiveScreenshot from './help/HelpInteractiveScreenshot';
import HelpAssistantChat from './help/HelpAssistantChat';
import HelpOnboardingCarousel from './help/HelpOnboardingCarousel';

export default function HelpPage({ onNavigate, explorerState, setExplorerState, userAuth, setUserAuth }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const containerRef = React.useRef(null);

  // Navigation & Mode state
  const [activeMode, setActiveMode] = useState('learn'); // 'learn' | 'do' | 'solve' | 'explore' | 'ai'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState(TASK_ARTICLES[0].id);

  // Reset scroll on mount and mode changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeMode]);
  
  // Interactive Onboarding Progress
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('geovision_help_onboarding');
      return saved ? JSON.parse(saved) : ['gs-1'];
    } catch {
      return ['gs-1'];
    }
  });

  // Interactive Guided Tour Modal
  const [guidedTourTask, setGuidedTourTask] = useState(null);
  const [guidedTourStepIndex, setGuidedTourStepIndex] = useState(0);

  // Troubleshooting Accordion State
  const [activeTroubleshootId, setActiveTroubleshootId] = useState(TROUBLESHOOTING_GUIDES[0].id);

  // Save onboarding progress
  const toggleStepCompleted = (stepId) => {
    setCompletedSteps(prev => {
      const next = prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId];
      try {
        localStorage.setItem('geovision_help_onboarding', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save help progress:', err);
      }
      return next;
    });
  };

  // Deep Link Execution Handler - Specifically opens panels, drawers, modals, or searches in SmartMap
  const handleDeepLink = (targetConfig) => {
    if (!targetConfig) return;
    setExplorerState(prev => {
      const updated = { ...prev };
      if (targetConfig.pendingQuery !== undefined) {
        updated.pendingQuery = targetConfig.pendingQuery;
      }
      if (targetConfig.showCategoriesPanel !== undefined) {
        updated.showCategoriesPanel = targetConfig.showCategoriesPanel;
      }
      if (targetConfig.showBasemapMenu !== undefined) {
        updated.showBasemapMenu = targetConfig.showBasemapMenu;
      }
      if (targetConfig.activeMenu !== undefined) {
        updated.activeMenu = targetConfig.activeMenu;
      }
      if (targetConfig.showAnalyticsModal !== undefined) {
        updated.showAnalyticsModal = targetConfig.showAnalyticsModal;
      }
      return updated;
    });

    if (onNavigate && targetConfig.view) {
      const targetView = (targetConfig.view === 'map' || targetConfig.view === 'smartmap') ? 'explorer' : targetConfig.view;
      onNavigate(targetView);
    }
  };

  // Launch Guided Tour for a task or onboarding step
  const handleStartTour = (taskOrStep) => {
    if (taskOrStep && taskOrStep.steps_en) {
      setGuidedTourTask(taskOrStep);
    } else if (taskOrStep && taskOrStep.stepNumber) {
      const matched = TASK_ARTICLES.find(t => t.id === taskOrStep.id || t.category === taskOrStep.id) || TASK_ARTICLES[0];
      setGuidedTourTask(matched);
    } else {
      setGuidedTourTask(TASK_ARTICLES[0]);
    }
    setGuidedTourStepIndex(0);
  };

  // Currently selected Task Article
  const activeTask = useMemo(() => {
    return TASK_ARTICLES.find(t => t.id === selectedTaskId) || TASK_ARTICLES[0];
  }, [selectedTaskId]);

  // Natural Language Search Filter Engine
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedTasks = TASK_ARTICLES.filter(task => 
      task.title_en.toLowerCase().includes(q) ||
      task.title_ar.includes(q) ||
      task.overview_en.toLowerCase().includes(q) ||
      task.overview_ar.includes(q) ||
      task.category.includes(q)
    );

    const matchedTroubleshoot = TROUBLESHOOTING_GUIDES.filter(guide =>
      guide.problem_en.toLowerCase().includes(q) ||
      guide.problem_ar.includes(q) ||
      guide.summary_en.toLowerCase().includes(q) ||
      guide.summary_ar.includes(q)
    );

    const matchedTerms = WHAT_IS_THIS_ITEMS.filter(item =>
      item.term_en.toLowerCase().includes(q) ||
      item.term_ar.includes(q) ||
      item.desc_en.toLowerCase().includes(q) ||
      item.desc_ar.includes(q)
    );

    return {
      tasks: matchedTasks,
      troubleshoot: matchedTroubleshoot,
      terms: matchedTerms,
      total: matchedTasks.length + matchedTroubleshoot.length + matchedTerms.length
    };
  }, [searchQuery]);

  // Filtered Task List based on Category
  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'all') return TASK_ARTICLES;
    return TASK_ARTICLES.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  const switchToMode = (mode) => {
    setActiveMode(mode);
    setSearchQuery('');
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full flex-1 overflow-y-auto pt-20 md:pt-24 flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-[#060b19] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Mode Navigation Tabs Bar */}
      <section className={`relative border-b py-3.5 px-6 sm:px-10 lg:px-16 ${
        isDarkMode 
          ? 'bg-[#091124] border-slate-800' 
          : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {[
            { id: 'learn', label_en: 'ONBOARDING', label_ar: 'البداية السريعة', sub_en: 'New User Journey', sub_ar: 'رحلة المستخدم الجديد', icon: BookOpen },
            { id: 'do', label_en: 'TASK GUIDES', label_ar: 'أدلة المهام', sub_en: 'Visual Workflows', sub_ar: 'خطوات تفاعلية', icon: Play },
            { id: 'solve', label_en: 'TROUBLESHOOT', label_ar: 'حل المشاكل', sub_en: 'Decision Trees', sub_ar: 'معالجة الأعطال', icon: Wrench },
            { id: 'explore', label_en: 'EXPLORE', label_ar: 'استكشاف', sub_en: 'Tips & Shortcuts', sub_ar: 'اختصارات وميزات', icon: Sparkles },
            { id: 'ai', label_en: 'AI ASSISTANT', label_ar: 'المساعد الذكي', sub_en: 'Ask Anything', sub_ar: 'اسأل الذكاء الاصطناعي', icon: Bot }
          ].map((tab) => {
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchToMode(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? (isDarkMode 
                        ? 'bg-gradient-to-r from-[#063360] to-[#215A9E] border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40' 
                        : 'bg-gradient-to-r from-[#063360] to-[#215A9E] border-[#063360] text-white shadow-md')
                    : (isDarkMode 
                        ? 'bg-[#0e172e]/80 border-slate-800 text-slate-300 hover:bg-[#152244] hover:border-slate-700' 
                        : 'bg-white border-slate-300 text-slate-800 hover:border-[#215A9E]/50 hover:bg-slate-50 shadow-2xs')
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : (isDarkMode ? 'text-cyan-400' : 'text-[#215A9E]')}`} />
                <div className="text-start leading-tight">
                  <div className="text-xs font-black tracking-wide">{t(tab.label_en, tab.label_ar)}</div>
                  <div className={`text-[10px] ${isActive ? 'text-white/80' : (isDarkMode ? 'text-slate-400' : 'text-slate-600')}`}>{t(tab.sub_en, tab.sub_ar)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Navigation Breadcrumb / Back to Onboarding */}
        {!searchResults && activeMode !== 'learn' && (
          <div className="flex items-center justify-between gap-4 p-3.5 px-5 rounded-2xl bg-white/90 dark:bg-[#0c1630]/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <button
              onClick={() => switchToMode('learn')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#063360] hover:bg-[#215A9E] dark:bg-[#215A9E] dark:hover:bg-[#1a4a82] text-white font-bold text-xs transition-all shadow-sm cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 rtl:-scale-x-100 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
              <span>{t("Back to Onboarding Journey", "العودة إلى رحلة الإعداد والترحيب")}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="opacity-60">{t("Help Center", "مركز المساعدة")}</span>
              <span className="opacity-40">/</span>
              <span className="text-[#215A9E] dark:text-cyan-400 font-bold">
                {activeMode === 'do' && t("Visual Task Guides", "أدلة المهام المصورة")}
                {activeMode === 'solve' && t("Troubleshooting Solutions", "حلول المشاكل والأعطال")}
                {activeMode === 'explore' && t("Tips & Shortcuts", "إرشادات واختصارات")}
                {activeMode === 'ai' && t("AI Assistant", "المساعد الذكي")}
              </span>
            </div>
          </div>
        )}

        {/* Search Results Display if Query is Active */}
        {searchResults ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Search className="w-5 h-5 text-cyan-500" />
                  <span>{t("Search Results", "نتائج البحث")}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
                    {searchResults.total}
                  </span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {t(`Showing results for "${searchQuery}"`, `عرض النتائج المطابقة لـ "${searchQuery}"`)}
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-cyan-500 hover:underline cursor-pointer"
              >
                {t("Clear Search", "إلغاء البحث")}
              </button>
            </div>

            {searchResults.total === 0 ? (
              <div className={`p-10 rounded-3xl border text-center space-y-4 ${
                isDarkMode ? 'bg-[#0e172e] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t("Can't find what you're looking for?", "لم تعثر على ما تبحث عنه؟")}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {t("Try using different terminology or ask our AI Help Assistant directly.", "جرب صياغة بكلمات أخرى أو اسأل مساعد الذكاء الاصطناعي الجغرافي مباشرة.")}
                </p>
                <button
                  onClick={() => switchToMode('ai')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#063360] to-[#215A9E] text-white font-bold text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>{t("Ask AI Assistant →", "اسأل المساعد الذكي →")}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Matching Tasks */}
                {searchResults.tasks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#063360] dark:text-cyan-400">
                      {t("Matching Visual Tasks", "المهام الإرشادية المطابقة")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {searchResults.tasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => {
                            setSelectedTaskId(task.id);
                            switchToMode('do');
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                            isDarkMode 
                              ? 'bg-[#0f1932] border-slate-800 hover:border-cyan-500/60' 
                              : 'bg-white border-slate-200 hover:border-[#215A9E]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400">
                              {task.badge}
                            </span>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{task.readTime}</span>
                          </div>
                          <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{t(task.title_en, task.title_ar)}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{t(task.overview_en, task.overview_ar)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Troubleshooting Guides */}
                {searchResults.troubleshoot.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                      {t("Troubleshooting Solutions", "حلول المشاكل والأعطال")}
                    </h3>
                    <div className="space-y-2">
                      {searchResults.troubleshoot.map(guide => (
                        <div
                          key={guide.id}
                          onClick={() => {
                            setActiveTroubleshootId(guide.id);
                            switchToMode('solve');
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            isDarkMode 
                              ? 'bg-[#0f1932] border-slate-800 hover:border-amber-500/60' 
                              : 'bg-white border-slate-200 hover:border-amber-500'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400">
                              {t(guide.problem_en, guide.problem_ar)}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300">{t(guide.summary_en, guide.summary_ar)}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 rtl:-scale-x-100" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Concept Terms */}
                {searchResults.terms.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {t("Concept Glossary", "دليل المصطلحات")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {searchResults.terms.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border ${
                            isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                              {item.tag}
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t(item.term_en, item.term_ar)}</h4>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t(item.desc_en, item.desc_ar)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* MODE 1: LEARN (Getting Started Journey via Interactive Carousel) */}
            {activeMode === 'learn' && (
              <section className="space-y-8">
                <HelpOnboardingCarousel
                  completedSteps={completedSteps}
                  onToggleComplete={toggleStepCompleted}
                  onDeepLink={handleDeepLink}
                  onNavigate={onNavigate}
                  onStartInteractiveTour={handleStartTour}
                  onExploreTasks={() => switchToMode('do')}
                />

                {/* Quick Switch to Tasks or Troubleshooting */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 ${
                    isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <h4 className="font-bold text-base mb-1 text-slate-900 dark:text-white">{t("Want Visual Task Guides?", "تبحث عن أدلة المهام المصورة؟")}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t("Step-by-step instructions with real application screenshots and interactive hotspots.", "إرشادات عملية مع لقطات حقيقية ونقاط تفاعلية.")}</p>
                    </div>
                    <button
                      onClick={() => switchToMode('do')}
                      className="px-4 py-2.5 rounded-xl bg-[#063360] hover:bg-[#215A9E] text-white font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t("Browse Tasks", "تصفح المهام")}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                    </button>
                  </div>

                  <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 ${
                    isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <h4 className="font-bold text-base mb-1 text-slate-900 dark:text-white">{t("Need Quick Troubleshooting?", "تواجه مشكلة أو عطلاً؟")}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t("Solve empty map issues, missing layers, or navigation route calculations with 1 click.", "حل مشاكل الخريطة الفارغة، اختفاء الطبقات، أو احتساب المسارات.")}</p>
                    </div>
                    <button
                      onClick={() => switchToMode('solve')}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t("Troubleshoot", "مركز الحلول")}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* MODE 2: DO (Task-based Visual Workflows) */}
            {activeMode === 'do' && (
              <section className="space-y-6">
                {/* Category Context Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {HELP_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                        selectedCategory === cat.id
                          ? (isDarkMode ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm' : 'bg-[#063360] text-white border-[#063360] shadow-sm')
                          : (isDarkMode ? 'bg-[#0e172e] border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100')
                      }`}
                    >
                      {t(cat.label_en, cat.label_ar)}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Task Navigation List */}
                  <div className="lg:col-span-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 px-1">
                      {t("Step-by-Step Task Guides", "أدلة المهام والخطوات")} ({filteredTasks.length})
                    </h3>

                    <div className="space-y-2">
                      {filteredTasks.map((task) => {
                        const isSelected = selectedTaskId === task.id;
                        return (
                          <button
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className={`w-full p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                              isSelected
                                ? (isDarkMode 
                                    ? 'bg-[#152347] border-cyan-500 shadow-md ring-1 ring-cyan-500/30' 
                                    : 'bg-blue-50/90 border-[#215A9E] shadow-sm ring-1 ring-[#215A9E]/30')
                                : (isDarkMode 
                                    ? 'bg-[#0f1932] border-slate-800 hover:border-slate-700' 
                                    : 'bg-white border-slate-200 hover:border-slate-300')
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isSelected ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-700/40 text-slate-300'
                              }`}>
                                {task.badge}
                              </span>
                              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.readTime}
                              </span>
                            </div>

                            <h4 className={`font-bold text-sm leading-snug mb-1 text-slate-900 dark:text-white ${
                              isSelected ? 'text-[#063360] dark:text-cyan-300' : ''
                            }`}>
                              {t(task.title_en, task.title_ar)}
                            </h4>

                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                              {t(task.overview_en, task.overview_ar)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Active Task Detailed Article */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${
                      isDarkMode ? 'bg-[#0c142b] border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      {/* Task Header & Quick Action */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-[#063360] dark:text-cyan-400 border border-cyan-500/20 font-mono">
                              {activeTask.badge}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">{activeTask.readTime}</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                            {t(activeTask.title_en, activeTask.title_ar)}
                          </h2>
                          <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {t(activeTask.overview_en, activeTask.overview_ar)}
                          </p>
                        </div>

                        {/* Interactive Guided Tour Trigger */}
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setGuidedTourTask(activeTask);
                              setGuidedTourStepIndex(0);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{t("Start Interactive Guide", "بدء الدليل التفاعلي")}</span>
                          </button>

                          {activeTask.deepLinkAction && (
                            <button
                              onClick={() => handleDeepLink(activeTask.deepLinkAction.target)}
                              className="px-4 py-2 rounded-xl bg-[#063360] hover:bg-[#215A9E] text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{t("Open in SmartMap →", "فتح في الخريطة →")}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Before You Begin Prerequisites */}
                      <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          <span>{t("Before you begin", "قبل البدء")}</span>
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside leading-relaxed">
                          {(isArabic ? activeTask.beforeYouBegin_ar : activeTask.beforeYouBegin_en).map((req, rIdx) => (
                            <li key={rIdx}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive Real-Application Screenshot with Hotspots */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {t("Application Interface Reference", "معاينة واجهة التطبيق المباشرة")}
                          </h3>
                          <span className="text-[11px] text-[#215A9E] dark:text-cyan-400 font-bold">
                            {t("Hover / Click Hotspots ① ② ③", "مرر أو انقر فوق العلامات ① ② ③")}
                          </span>
                        </div>

                        <HelpInteractiveScreenshot
                          screenshot={activeTask.screenshot}
                          title={t(activeTask.title_en, activeTask.title_ar)}
                          onDeepLink={handleDeepLink}
                          deepLinkAction={activeTask.deepLinkAction}
                        />
                      </div>

                      {/* Step-by-Step Instructions */}
                      <div className="space-y-3 pt-2">
                        <h3 className="font-bold text-base flex items-center gap-2 text-slate-900 dark:text-white">
                          <Play className="w-4 h-4 text-[#215A9E] dark:text-cyan-500 fill-current" />
                          <span>{t("Step-by-Step Instructions", "الخطوات خطوة بخطوة")}</span>
                        </h3>

                        <div className="space-y-3">
                          {(isArabic ? activeTask.steps_ar : activeTask.steps_en).map((s, idx) => (
                            <div 
                              key={idx}
                              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                                isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="w-7 h-7 rounded-full bg-[#063360] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {s.step}
                              </div>
                              <div className="space-y-1 flex-1">
                                <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                                  {s.instruction}
                                </p>
                                {s.tip && (
                                  <p className="text-xs text-amber-600 dark:text-amber-400/90 font-medium italic">
                                    💡 {t("Tip: ", "تلميح: ")}{s.tip}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Result Card */}
                      <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                        isDarkMode ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}>
                        <div className="font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                          <span>{t("Expected Result", "النتيجة المتوقعة")}</span>
                        </div>
                        <p className="leading-relaxed opacity-90">
                          {t(activeTask.expectedResult_en, activeTask.expectedResult_ar)}
                        </p>
                      </div>

                      {/* Troubleshooting & Tips */}
                      <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                        isDarkMode ? 'bg-slate-800/40 border-slate-700/60 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        <div className="font-bold flex items-center gap-2 text-[#215A9E] dark:text-cyan-400">
                          <HelpCircle className="w-4 h-4" />
                          <span>{t("Common Issue & Quick Fix", "مشكلة شائعة وكيفية حلها")}</span>
                        </div>
                        <p className="leading-relaxed">
                          {t(activeTask.troubleshooting_en, activeTask.troubleshooting_ar)}
                        </p>
                      </div>

                      {/* Related Tasks Navigation */}
                      {activeTask.relatedTasks && (
                        <div className="pt-2 border-t border-white/10 space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            {t("Related Workflows", "مهام ذات صلة")}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {activeTask.relatedTasks.map(relId => {
                              const relTask = TASK_ARTICLES.find(t => t.id === relId);
                              if (!relTask) return null;
                              return (
                                <button
                                  key={relId}
                                  onClick={() => setSelectedTaskId(relId)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isDarkMode 
                                      ? 'bg-[#121c38] border-slate-700 hover:border-cyan-500 text-slate-300' 
                                      : 'bg-white border-slate-300 hover:border-[#215A9E] text-slate-800 shadow-2xs'
                                  }`}
                                >
                                  <span>{t(relTask.title_en, relTask.title_ar)}</span>
                                  <ArrowRight className="w-3 h-3 rtl:-scale-x-100 opacity-60" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Back to Onboarding Footer Card */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-[#0c142b] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-start">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t("Finished reviewing Visual Task Guides?", "هل انتهيت من استعراض أدلة المهام؟")}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t("Return to the New User Onboarding Journey or start your spatial query on the live map.", "عد إلى مسار إعداد المستخدم الجديد أو ابدأ استعلاماتك على الخريطة التفاعلية.")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => switchToMode('learn')}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 rtl:-scale-x-100" />
                      <span>{t("Back to Onboarding", "العودة للبداية")}</span>
                    </button>
                    <button
                      onClick={() => onNavigate('explorer')}
                      className="px-4 py-2.5 rounded-xl bg-[#063360] hover:bg-[#215A9E] text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-2"
                    >
                      <span>{t("Open Live Map", "فتح الخريطة")}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* MODE 3: SOLVE (Troubleshooting Decision Trees) */}
            {activeMode === 'solve' && (
              <section className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{t("Diagnostic Troubleshooting Center", "مركز التشخيص ومعالجة المشاكل")}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {isArabic ? "تواجه مشكلة في المنصة؟" : "Something isn't working as expected?"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {t("Follow our guided decision trees to isolate issues and fix them with 1-click workspace actions.", "اتبع مخططات القرار لتحديد سبب المشكلة وحلها فورياً بضغطة زر واحدة.")}
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  {TROUBLESHOOTING_GUIDES.map((guide) => {
                    const isOpen = activeTroubleshootId === guide.id;
                    return (
                      <div
                        key={guide.id}
                        className={`rounded-3xl border transition-all overflow-hidden shadow-sm ${
                          isOpen
                            ? (isDarkMode ? 'bg-[#0f1932] border-amber-500/50 shadow-amber-500/5' : 'bg-white border-amber-400 shadow-md')
                            : (isDarkMode ? 'bg-[#0b1328] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300')
                        }`}
                      >
                        <button
                          onClick={() => setActiveTroubleshootId(isOpen ? null : guide.id)}
                          className="w-full p-5 text-start flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                                {t(guide.problem_en, guide.problem_ar)}
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{t(guide.summary_en, guide.summary_ar)}</p>
                            </div>
                          </div>

                          <ChevronDown className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/10 p-5 sm:p-6 space-y-5"
                            >
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                  {t("Diagnostic Verification Steps", "خطوات التحقق والتشخيص")}
                                </h4>

                                <div className="space-y-3">
                                  {(isArabic ? guide.decisionTree_ar : guide.decisionTree_en).map((node, nIdx) => (
                                    <div 
                                      key={nIdx}
                                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                                        isDarkMode ? 'bg-[#14203e] border-slate-700' : 'bg-slate-50 border-slate-200'
                                      }`}
                                    >
                                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-[#063360] dark:text-cyan-400 flex items-center justify-center text-[10px] font-black">
                                          {nIdx + 1}
                                        </span>
                                        <span>{node.question}</span>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 rtl:pr-7 text-[11px]">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
                                          <span className="font-bold">{t("If YES: ", "إذا نعم: ")}</span>
                                          <span>{node.ifYes}</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-400">
                                          <span className="font-bold">{t("If NO: ", "إذا لا: ")}</span>
                                          <span>{node.ifNo}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 1-Click Quick Fix Action */}
                              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                <div className="text-xs text-amber-700 dark:text-amber-300">
                                  <span className="font-bold">{t("Recommended Action: ", "الإجراء المقترح: ")}</span>
                                  <span>{t(guide.quickFixLabel_en, guide.quickFixLabel_ar)}</span>
                                </div>
                                <button
                                  onClick={() => handleDeepLink(guide.quickFixAction)}
                                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
                                >
                                  <span>{t("Apply Fix in SmartMap →", "تطبيق الحل في الخريطة →")}</span>
                                  <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Back to Onboarding from Troubleshoot */}
                <div className="max-w-4xl mx-auto p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-[#0c142b] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-start">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t("Issue resolved?", "هل تم حل المشكلة؟")}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t("Return to the onboarding journey to continue exploring GeoVision capabilities.", "عد إلى رحلة الإعداد لمواصلة التعرف على إمكانيات منصة جيو فيجن.")}
                    </p>
                  </div>
                  <button
                    onClick={() => switchToMode('learn')}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer flex items-center gap-2 shadow-2xs shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 rtl:-scale-x-100" />
                    <span>{t("Back to Onboarding", "العودة للبداية")}</span>
                  </button>
                </div>
              </section>
            )}

            {/* MODE 4: EXPLORE (Pro Tips, What is This, Shortcuts & What's New) */}
            {activeMode === 'explore' && (
              <section className="space-y-10">
                {/* Keyboard Shortcuts Cheatsheet */}
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
                  isDarkMode ? 'bg-[#0c142b] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("Keyboard Shortcuts Cheatsheet", "دليل اختصارات لوحة المفاتيح")}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {KEYBOARD_SHORTCUTS.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                          isDarkMode ? 'bg-[#121c38] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{t(item.desc_en, item.desc_ar)}</span>
                        <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-[#063360] dark:text-cyan-400 text-xs shadow-inner">
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>

                {/* "What is this?" Interactive Explanations */}
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
                  isDarkMode ? 'bg-[#0c142b] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('"What is this?" Glossary & Concepts', 'دليل مفاهيم ومصطلحات "ما هذا؟"')}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{t("Concise explanations of critical geospatial architecture terms used in GeoVision.", "شرح مبسط لأهم المفاهيم المكانية المعمارية المستخدمة في المنصة.")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {WHAT_IS_THIS_ITEMS.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border space-y-2 ${
                          isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-[#063360] dark:text-cyan-400">{t(item.term_en, item.term_ar)}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{t(item.desc_en, item.desc_ar)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tips & Tricks */}
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
                  isDarkMode ? 'bg-[#0c142b] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("Pro Tips & Best Practices", "إرشادات الخبراء وأفضل الممارسات")}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PRO_TIPS.map((tip, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border space-y-1.5 ${
                          isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400 font-bold">💡 {t(tip.title_en, tip.title_ar)}</h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{t(tip.text_en, tip.text_ar)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's New in V2 Changelog */}
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
                  isDarkMode ? 'bg-[#0c142b] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("What's New in GeoVision V2", "ما الجديد في جيو فيجن V2")}</h3>
                  </div>

                  <div className="space-y-3">
                    {WHATS_NEW_ITEMS.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                              {item.version}
                            </span>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{t(item.title_en, item.title_ar)}</h4>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{t(item.desc_en, item.desc_ar)}</p>
                        </div>
                        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 shrink-0">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* MODE 5: AI ASSISTANT (Interactive Conversational Helper) */}
            {activeMode === 'ai' && (
              <section className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-slate-900 dark:text-white">
                    <Bot className="w-6 h-6 text-cyan-500" />
                    <span>{t("Conversational Help Assistant", "مساعد الدعم التفاعلي")}</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {t("Ask any question in plain English or Arabic to get step-by-step guidance grounded in the platform.", "اطرح أي سؤال بالإنجليزية أو العربية للحصول على إرشادات فورية مدعومة بروابط مباشرة.")}
                  </p>
                </div>

                <HelpAssistantChat
                  onDeepLink={handleDeepLink}
                  onSelectTask={(taskId) => {
                    setSelectedTaskId(taskId);
                    switchToMode('do');
                  }}
                />
              </section>
            )}
          </>
        )}

        {/* Global Action Banner to Explore Map */}
        <div className="rounded-3xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-start">
            <h3 className="text-xl font-bold">{t("Ready to test these workflows in Abu Dhabi?", "جاهز لتجربة هذه الميزات على خريطة أبوظبي؟")}</h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
              {t("Launch the interactive SmartMap workspace to query spatial layers, view risk decomposition, and analyze locations live.", "افتح مساحة عمل الخريطة الذكية التفاعلية لاستعراض الطبقات المكانية وتحليل المخاطر والمواقع.")}
            </p>
          </div>
          <button
            onClick={() => onNavigate('explorer')}
            className="px-6 py-3 rounded-2xl bg-white text-[#215A9E] hover:bg-slate-100 font-extrabold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>{t("Launch SmartMap Workspace", "بدء مساحة عمل الخريطة")}</span>
            <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
          </button>
        </div>
      </main>

      {/* Interactive Guided Tour Lightbox Modal */}
      <AnimatePresence>
        {guidedTourTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`max-w-2xl w-full rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
                isDarkMode ? 'bg-[#0c142b] border-cyan-500/40' : 'bg-white border-slate-300'
              }`}
            >
              {/* Tour Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-bold text-xs sm:text-sm">
                    {t("Interactive Guide", "الدليل التفاعلي")} • {t(guidedTourTask.title_en, guidedTourTask.title_ar)}
                  </span>
                </div>
                <button
                  onClick={() => setGuidedTourTask(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tour Step Body */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Step Counter Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">
                    {t("Step", "الخطوة")} {guidedTourStepIndex + 1} {t("of", "من")} {guidedTourTask.steps_en.length}
                  </span>
                  <div className="flex gap-1">
                    {guidedTourTask.steps_en.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-5 h-1.5 rounded-full transition-all ${
                          idx === guidedTourStepIndex ? 'bg-amber-400 w-8' : (idx < guidedTourStepIndex ? 'bg-cyan-500' : 'bg-slate-700')
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Screenshot snippet with active highlight marker */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[16/9] bg-black">
                  <img
                    src={guidedTourTask.screenshot.url}
                    alt="Tour Step"
                    className="w-full h-full object-contain"
                  />
                  {/* Highlight callout marker */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                    <div className="p-4 rounded-2xl bg-black/85 border border-amber-400 text-center space-y-2 max-w-sm shadow-2xl">
                      <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm mx-auto flex items-center justify-center">
                        {guidedTourStepIndex + 1}
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {(isArabic ? guidedTourTask.steps_ar : guidedTourTask.steps_en)[guidedTourStepIndex]?.instruction}
                      </p>
                      {(isArabic ? guidedTourTask.steps_ar : guidedTourTask.steps_en)[guidedTourStepIndex]?.tip && (
                        <p className="text-[11px] text-amber-300 italic">
                          💡 {(isArabic ? guidedTourTask.steps_ar : guidedTourTask.steps_en)[guidedTourStepIndex]?.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour Controls Footer */}
              <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setGuidedTourStepIndex(prev => Math.max(0, prev - 1))}
                  disabled={guidedTourStepIndex === 0}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {t("Previous", "السابق")}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGuidedTourTask(null)}
                    className="px-3.5 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    {t("Exit Guide", "إنهاء")}
                  </button>

                  {guidedTourStepIndex < guidedTourTask.steps_en.length - 1 ? (
                    <button
                      onClick={() => setGuidedTourStepIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow cursor-pointer"
                    >
                      {t("Next Step →", "الخطوة التالية →")}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setGuidedTourTask(null);
                        if (guidedTourTask.deepLinkAction) {
                          handleDeepLink(guidedTourTask.deepLinkAction.target);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t("Finish & Try in SmartMap →", "إنهاء وتجربة الميزة →")}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={`py-6 border-t text-center text-xs ${
        isDarkMode ? 'bg-[#040814] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <p>© 2026 Abu Dhabi Spatial Data Infrastructure (AD-SDI) • Department of Government Enablement (DGE)</p>
      </footer>
    </div>
  );
}
