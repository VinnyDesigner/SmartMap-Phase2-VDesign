// src/components/help/HelpOnboardingCarousel.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, Circle, ArrowRight, 
  Play, Clock, Compass, Info, Check, Eye, Maximize2, Rocket
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { GETTING_STARTED_STEPS } from '../../data/helpData';

export default function HelpOnboardingCarousel({ 
  completedSteps = [], 
  onToggleComplete, 
  onDeepLink,
  onNavigate,
  onStartInteractiveTour,
  onExploreTasks
}) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const totalSteps = GETTING_STARTED_STEPS.length;
  const currentStep = GETTING_STARTED_STEPS[currentIndex] || GETTING_STARTED_STEPS[0];
  const isCurrentDone = completedSteps.includes(currentStep.id);
  const allCompleted = totalSteps > 0 && completedSteps.length >= totalSteps;
  const progressPercent = Math.min(100, Math.round((completedSteps.length / totalSteps) * 100));

  // Forward navigation: on step 7, marks complete and redirects directly to SmartMap page
  const goToNext = () => {
    if (currentIndex < totalSteps - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached the end of the journey!
      if (!isCurrentDone && onToggleComplete) {
        onToggleComplete(currentStep.id);
      }
      // Redirect directly to the SmartMap page
      if (onDeepLink) {
        onDeepLink({ view: 'explorer' });
      } else if (onNavigate) {
        onNavigate('explorer');
      }
    }
  };

  // Non-looping backward navigation: stopped at step 0
  const goToPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToIndex = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };


  return (
    <div className={`rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 ${
      isDarkMode 
        ? 'bg-[#0c142b]/95 border-slate-800 shadow-cyan-950/20' 
        : 'bg-white border-slate-200/90 shadow-slate-200/60'
    }`}>
      {/* Top Header & Horizontal Step Selector Pills */}
      <div className={`px-6 py-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {t("New User Onboarding Journey", "مسار تدريب المستخدم الجديد")}
            </h2>
            {allCompleted ? (
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {t("All Steps Completed", "كافة الخطوات مكتملة")}
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                {t(`Step ${currentIndex + 1} of ${totalSteps}`, `الخطوة ${currentIndex + 1} من ${totalSteps}`)}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t("Interactive roadmap designed to help you master GeoVision SmartMap in under 15 minutes.", "دليل تفاعلي مرئي لإتقان جميع قدرات الخريطة الذكية في أقل من 15 دقيقة.")}
          </p>
        </div>

        {/* Progress Bar & Quick Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-end">
            <div className="text-xs font-bold text-cyan-500">
              {progressPercent}% {t("Completed", "مكتمل")}
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
              {completedSteps.length} {t("of", "من")} {totalSteps} {t("done", "منجز")}
            </div>
          </div>
          <div className="w-28 sm:w-36 h-2.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#215A9E] via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Jump Tab Strip */}
      <div className={`px-4 sm:px-6 py-2.5 border-b overflow-x-auto scrollbar-none flex items-center gap-2 ${
        isDarkMode ? 'bg-[#091024] border-slate-800' : 'bg-slate-100/60 border-slate-200'
      }`}>
        {GETTING_STARTED_STEPS.map((step, idx) => {
          const isSelected = idx === currentIndex;
          const isDone = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => goToIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? (isDarkMode 
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black' 
                      : 'bg-[#215A9E] text-white shadow-sm font-black')
                  : (isDarkMode 
                      ? 'bg-[#121c38] text-slate-300 hover:bg-[#18254b] hover:text-white border border-slate-800' 
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs')
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                isDone
                  ? 'bg-emerald-500 text-slate-950'
                  : (isSelected ? 'bg-white/20 text-current' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300')
              }`}>
                {isDone ? '✓' : (idx + 1)}
              </span>
              <span className="truncate max-w-[130px] sm:max-w-none">
                {t(step.shortLabel_en || step.title_en, step.shortLabel_ar || step.title_ar)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Carousel Slide Viewport */}
      <div className="p-6 sm:p-8 relative min-h-[460px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Title, Explanations, Key Points & Actions */}
              <div className="lg:col-span-6 space-y-5">
                {/* Step Meta Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#215A9E] to-cyan-600 text-white shadow-xs">
                    {t(`STEP 0${currentIndex + 1}`, `الخطوة 0${currentIndex + 1}`)}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentStep.duration}
                  </span>
                  {currentIndex === totalSteps - 1 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {t("Final Step", "الخطوة الأخيرة")}
                    </span>
                  )}
                  {isCurrentDone && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      {t("Completed", "منجز")}
                    </span>
                  )}
                </div>

                {/* Step Title */}
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                  {t(currentStep.title_en, currentStep.title_ar)}
                </h3>

                {/* Step Summary */}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {t(currentStep.summary_en, currentStep.summary_ar)}
                </p>

                {/* Key Takeaways Checklist */}
                <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                    {t("What You'll Learn", "ما ستتعلمه في هذه الخطوة")}
                  </div>
                  {(isArabic ? currentStep.keyPoints_ar : currentStep.keyPoints_en).map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons & Completion Toggle */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* Targeted Deep Link Button */}
                  <button
                    onClick={() => {
                      if (onToggleComplete) onToggleComplete(currentStep.id);
                      if (onDeepLink) onDeepLink(currentStep.actionTarget);
                    }}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#215A9E] via-cyan-600 to-cyan-500 hover:opacity-95 text-white font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
                  >
                    <span>{t(currentStep.actionLabel_en, currentStep.actionLabel_ar)}</span>
                    <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                  </button>

                  {/* Interactive Tour Trigger */}
                  <button
                    onClick={() => onStartInteractiveTour && onStartInteractiveTour(currentStep)}
                    className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isDarkMode 
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
                        : 'border-amber-500/40 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-2xs'
                    }`}
                    title={t("Start In-App Tour", "بدء الجولة الإرشادية")}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t("Start Interactive Guide", "بدء الدليل التفاعلي")}</span>
                  </button>

                  {/* Mark as Completed Toggle */}
                  <button
                    onClick={() => onToggleComplete && onToggleComplete(currentStep.id)}
                    className={`px-3.5 py-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCurrentDone
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                        : (isDarkMode ? 'bg-[#121c38] border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100')
                    }`}
                  >
                    {isCurrentDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>{isCurrentDone ? t("Completed", "مكتمل") : t("Mark Completed", "تحديد كمكتمل")}</span>
                  </button>
                </div>

                {/* Slide Navigation Controls (Non-Looping) */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  {/* Previous Button (Disabled on First Step) */}
                  <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentIndex === 0
                        ? 'opacity-35 cursor-not-allowed border-transparent text-slate-500'
                        : (isDarkMode ? 'border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-white/5 cursor-pointer' : 'border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer')
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                    <span>{t("Previous", "السابق")}</span>
                  </button>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1.5">
                    {GETTING_STARTED_STEPS.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => goToIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          dotIdx === currentIndex
                            ? 'w-6 bg-cyan-400'
                            : 'w-2 bg-slate-400/40 hover:bg-slate-400/70'
                        }`}
                        aria-label={`Slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next Step / Complete Journey Button */}
                  {currentIndex === totalSteps - 1 ? (
                    <button
                      onClick={goToNext}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg hover:shadow-amber-500/30 cursor-pointer flex items-center gap-2 ring-2 ring-amber-400/40"
                    >
                      <Rocket className="w-3.5 h-3.5 fill-current" />
                      <span>{t("Finish Journey & Launch SmartMap 🚀", "إنهاء المسار والانطلاق إلى الخريطة الذكية 🚀")}</span>
                    </button>
                  ) : (
                    <button
                      onClick={goToNext}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isDarkMode ? 'border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{t("Next Step", "الخطوة التالية")}</span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Real Application Screenshot with Overlayed Subject Callout */}
              <div className="lg:col-span-6 relative">
                <div className={`relative rounded-3xl overflow-hidden border shadow-2xl group ${
                  isDarkMode ? 'bg-[#080d1c] border-slate-700/80 ring-1 ring-cyan-500/20' : 'bg-slate-950 border-slate-300 shadow-xl'
                }`}>
                  {/* Screenshot Image */}
                  <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden relative select-none">
                    <img
                      src={currentStep.screenshot}
                      alt={t(currentStep.title_en, currentStep.title_ar)}
                      className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Dark gradient overlay at bottom for callout legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Top bar controls on screenshot */}
                    <div className="absolute top-3 end-3 z-20 flex items-center gap-2">
                      <button
                        onClick={() => setIsZoomOpen(true)}
                        className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold hover:bg-black/80 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3 text-cyan-400" />
                        <span>{t("Inspect", "معاينة")}</span>
                      </button>
                    </div>

                    {/* OVERLAYED CALLOUT POINTER BOX POINTING TO THE SUBJECT */}
                    {currentStep.callout && (
                      <div className="absolute bottom-4 inset-x-4 z-20">
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-cyan-500/40 shadow-2xl text-white space-y-1 ring-1 ring-white/10 animate-fade-in">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {t(currentStep.callout.tag_en, currentStep.callout.tag_ar)}
                              </span>
                              <h4 className="font-extrabold text-xs sm:text-sm text-cyan-300 truncate">
                                {t(currentStep.callout.title_en, currentStep.callout.title_ar)}
                              </h4>
                            </div>

                            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
                              {t("Target Subject", "الهدف في الواجهة")}
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 leading-snug">
                            {t(currentStep.callout.desc_en, currentStep.callout.desc_ar)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8"
          >
            <div className="flex items-center justify-between text-white pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  {t(currentStep.title_en, currentStep.title_ar)}
                </h3>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                ✕ {t("Close", "إغلاق")}
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              <img
                src={currentStep.screenshot}
                alt="Enlarged Screenshot"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
