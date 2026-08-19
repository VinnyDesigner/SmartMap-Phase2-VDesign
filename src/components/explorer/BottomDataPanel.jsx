import React, { useRef, useEffect, useState } from 'react';
import { Minimize2, Maximize2, Sparkles, Mic, X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import AiChatInterface from './AiChatInterface';
import DetailSlidePanel from './DetailSlidePanel';
import MenuSlidePanel from './MenuSlidePanel';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BottomDataPanel({ explorerState, setExplorerState }) {
  // HIDDEN, COMPACT, EXPANDED
  const panelState = explorerState.aiPanelState || 'hidden';
  const [compactInputValue, setCompactInputValue] = useState('');
  const { t, isArabic } = useLanguage();

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 25, mass: 1.5 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25, mass: 1.5 });

  const glowBackground = useMotionTemplate`radial-gradient(800px at ${springX}px ${springY}px, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0))`;

  const handleMouseMove = (e) => {
    if (!containerRef.current || panelState !== 'expanded') return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const setPanelState = (newState) => {
    setExplorerState(prev => ({ ...prev, aiPanelState: newState }));
    if (newState === 'hidden') {
      setCompactInputValue('');
    }
  };

  const handleCompactKeyDown = (e) => {
    if (e.key === 'Enter' && compactInputValue.trim()) {
      setExplorerState(prev => ({ ...prev, aiPanelState: 'expanded', pendingQuery: compactInputValue }));
      setCompactInputValue('');
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex">
      {/* Morphing Components */}
      <AnimatePresence mode="wait">

        {/* 1. HIDDEN STATE (Floating Button) */}
        {panelState === 'hidden' && (
          <motion.div
            key="hidden-btn"
            layoutId="ai-panel"
            className="absolute bottom-6 end-6 md:end-8 w-14 h-14 bg-[#3D52A0] shadow-[0_8px_32px_rgba(61,82,160,0.4)](0,0,0,0.5)] rounded-full flex items-center justify-center pointer-events-auto cursor-pointer z-50 group hover:bg-[#2B3A70] transition-colors"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onMouseEnter={() => setPanelState('compact')}
            onClick={() => setPanelState('compact')}
          >
            {/* Pulsing energy ring behind */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#3D52A0]" style={{ animationDuration: '3s' }} />
            <Sparkles className="w-6 h-6 text-white group-hover:animate-pulse" />
          </motion.div>
        )}

        {/* 2. COMPACT STATE (Search Composer) */}
        {panelState === 'compact' && (
          <motion.div
            key="compact-bar"
            layoutId="ai-panel"
            className="absolute bottom-6 end-6 md:end-8 w-[calc(100vw-3rem)] md:w-[420px] h-[60px] bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_16px_48px_rgba(61,82,160,0.2)](0,0,0,0.3)] rounded-full pointer-events-auto z-50 flex items-center px-5 group overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onMouseLeave={() => {
              if (!compactInputValue.trim()) {
                setPanelState('hidden');
              }
            }}
          >
            <motion.div layoutId="ai-icon" className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-50/50 me-3 cursor-pointer" onClick={() => setPanelState('expanded')}>
              <Sparkles className="w-5 h-5 text-[#3D52A0]" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.15 }}
              className="flex-1 overflow-hidden"
            >
              <input 
                autoFocus
                type="text"
                placeholder={isArabic ? 'اسأل عن أي شيء حول أبوظبي...' : 'Ask anything about Abu Dhabi...'}
                className="w-full bg-transparent border-none outline-none text-[14px] text-[#1e2749] font-medium placeholder:text-slate-400 placeholder:font-normal"
                value={compactInputValue}
                onChange={(e) => setCompactInputValue(e.target.value)}
                onKeyDown={handleCompactKeyDown}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }}
              className="shrink-0 flex items-center gap-0.5"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setPanelState('expanded'); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#3D52A0] hover:bg-slate-100 transition-colors"
                title="Expand AI Assistant"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#3D52A0] hover:bg-slate-100 transition-colors cursor-pointer">
                <Mic className="w-4 h-4" />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setPanelState('hidden'); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ms-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 3. EXPANDED STATE (Full AI Panel) */}
        {panelState === 'expanded' && (
          <motion.div
            key="expanded-panel"
            layoutId="ai-panel"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="absolute bottom-0 md:bottom-6 inset-x-0 md:inset-auto md:end-8 h-[50vh] md:h-auto md:top-[72px] w-[100vw] md:w-[420px] pointer-events-auto z-50 rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-[0_-12px_64px_rgba(0,0,0,0.15)] flex flex-col bg-white/30 backdrop-blur-2xl border-t md:border border-white/40"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            {/* Mobile Dock Handle */}
            <div className="w-full flex items-center justify-center pt-3 pb-1 md:hidden cursor-pointer" onClick={() => setPanelState('compact')}>
              <div className="w-12 h-1.5 rounded-full bg-slate-400/50" />
            </div>

            {/* Subtle Interactive Mouse Glow */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-0"
              style={{ background: glowBackground }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 md:pt-5 pb-4 border-b border-white/30 relative z-20 shrink-0 bg-gradient-to-b from-white/90 to-transparent">
              <div className="flex items-center gap-3">
                <motion.div layoutId="ai-icon" className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-50 to-[#eef3ff] border border-blue-100/50 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4.5 h-4.5 text-[#3D52A0]" />
                </motion.div>
                <div>
                  <h2 className="font-bold text-[#1e2749] text-[15px] tracking-tight leading-tight">{t('AI Map Assistant', 'مساعد الخرائط الذكي')}</h2>
                  <p className="text-[11px] font-medium text-[#3D52A0]/70 tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> {t('Ready to explore', 'جاهز للاستكشاف')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setPanelState('hidden')}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content Area */}
            <div className="flex-1 relative z-10 w-full overflow-hidden flex flex-col bg-transparent">
              <AiChatInterface 
                explorerState={explorerState}
                setExplorerState={setExplorerState}
              />
              <DetailSlidePanel 
                explorerState={explorerState}
                setExplorerState={setExplorerState}
              />
              <MenuSlidePanel 
                explorerState={explorerState}
                setExplorerState={setExplorerState}
              />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
