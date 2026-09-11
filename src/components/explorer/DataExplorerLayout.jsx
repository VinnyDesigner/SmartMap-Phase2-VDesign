import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsLeftRight, Sparkles } from 'lucide-react';
import MapBackground from '../MapBackground';
import GeoLogoIcon from '../common/GeoLogoIcon';
import MapControlsSidebar from './MapControlsSidebar';
import BottomDataPanel from './BottomDataPanel';
import MapLegendPanel from './MapLegendPanel';
import DetailSlidePanel from './DetailSlidePanel';
import SearchResultsList from './SearchResultsList';
import FlyingCardOverlay from '../common/FlyingCardOverlay';

import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DemoScenarioSwitcher from '../common/DemoScenarioSwitcher';

export default function DataExplorerLayout({ 
  onNavigate, 
  explorerState, 
  setExplorerState,
  mouseX,
  mouseY,
  isSearchFocused,
  selectedLocation
}) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  const containerRef = useRef(null);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const handleLaunchScenario = (queryText) => {
    setIsRightPanelOpen(true);
    if (setExplorerState) {
      setExplorerState(prev => ({
        ...prev,
        pendingQuery: queryText,
        activeMenu: null,
        showCategoriesPanel: false,
        showBasemapMenu: false
      }));
    }
  };

  const [chatWidth, setChatWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.max(300, Math.round(window.innerWidth * 0.25));
    }
    return 380;
  });
  const [isResizing, setIsResizing] = useState(false);

  const startDragX = useRef(0);
  const startWidth = useRef(340);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    startDragX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startWidth.current = chatWidth;
  };

  const handleTouchStart = (e) => {
    setIsResizing(true);
    startDragX.current = e.touches[0].clientX;
    startWidth.current = chatWidth;
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (e) => {
      const currentX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
      if (currentX === undefined) return;

      const deltaX = startDragX.current - currentX; // Dragging left increases chat width
      const containerW = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
      
      const minW = 260;
      const maxW = Math.round(containerW * 0.65); // Up to 65% of screen width

      const newW = Math.max(minW, Math.min(maxW, startWidth.current + deltaX));
      setChatWidth(newW);

      // Trigger map resize during dragging
      if (setExplorerState) {
        setExplorerState(prev => ({ ...prev, resizeTrigger: Date.now() }));
      }
    };

    const handleUp = () => {
      setIsResizing(false);
      if (setExplorerState) {
        setExplorerState(prev => ({ ...prev, resizeTrigger: Date.now() }));
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isResizing, setExplorerState]);

  const handleDoubleClick = () => {
    const defaultW = Math.max(300, Math.round(window.innerWidth * 0.25));
    setChatWidth(defaultW);
    if (setExplorerState) {
      setExplorerState(prev => ({ ...prev, resizeTrigger: Date.now() }));
    }
  };

  // Auto-reopen right panel if flyingCard is triggered
  useEffect(() => {
    if (explorerState?.flyingCard && !isRightPanelOpen) {
      setIsRightPanelOpen(true);
    }
  }, [explorerState?.flyingCard, isRightPanelOpen]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      ref={containerRef}
      className={`absolute inset-0 z-20 flex flex-row pt-14 md:pt-16 h-full w-full overflow-hidden ${
        isResizing ? 'select-none cursor-col-resize' : ''
      }`}
    >
      <FlyingCardOverlay 
        flyingCard={explorerState?.flyingCard} 
        setExplorerState={setExplorerState} 
      />
      {/* Resizable Left Pane: Interactive Map */}
      <div 
        className={`h-full relative overflow-hidden flex-none pointer-events-auto ${
          isResizing ? 'transition-none' : 'transition-[width] duration-200'
        }`}
        style={{ width: isRightPanelOpen ? `calc(100% - ${chatWidth}px)` : '100%' }}
      >
        <MapBackground 
          mouseX={mouseX} 
          mouseY={mouseY} 
          isSearchFocused={isSearchFocused} 
          onMapClick={() => {}}
          selectedLocation={selectedLocation}
          isExplorer={true}
          explorerState={explorerState}
          setExplorerState={setExplorerState}
        />
        <MapControlsSidebar 
          explorerState={explorerState}
          setExplorerState={setExplorerState}
        />

        {/* Floating Map Legend Panel */}
        <AnimatePresence>
          {explorerState?.activeMenu === 'legend' && 
           !explorerState?.drawingTool &&
           !explorerState?.showCategoriesPanel && 
           !explorerState?.showBasemapMenu && (
            <MapLegendPanel 
              explorerState={explorerState}
              setExplorerState={setExplorerState}
              onClose={() => setExplorerState(prev => ({ ...prev, activeMenu: null }))}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Sleek Draggable Resizer Handle with Clear Affordance (Only visible when right panel is open) */}
      {isRightPanelOpen && (
        <div 
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleDoubleClick}
          className="w-4 -mx-2 relative z-40 h-full flex items-center justify-center cursor-col-resize select-none pointer-events-auto group shrink-0"
          title="Drag left/right to resize panel (Double-click to reset)"
        >
          {/* Subtle 1px Hairline */}
          <div className={`w-px h-full transition-colors duration-200 ${
            isResizing 
              ? 'bg-[#00e5ff]' 
              : isDarkMode 
                ? 'bg-slate-800 group-hover:bg-[#00e5ff]/80' 
                : 'bg-slate-200 group-hover:bg-[#3D52A0]/80'
          }`} />
          
          {/* Affordance Handle Badge with Left-Right Arrows */}
          <div className={`absolute w-5 h-9 rounded-full border shadow-md flex items-center justify-center transition-all duration-200 ${
            isResizing 
              ? 'border-[#00e5ff] bg-[#00e5ff] text-slate-950 scale-110 shadow-lg' 
              : isDarkMode 
                ? 'bg-[#0f1a36] border-slate-700 text-slate-300 group-hover:border-[#00e5ff] group-hover:text-[#00e5ff] group-hover:scale-105 group-hover:shadow-lg'
                : 'bg-white border-slate-200 text-slate-400 group-hover:border-[#3D52A0] group-hover:text-[#3D52A0] group-hover:scale-105 group-hover:shadow-lg'
          }`}>
            <ChevronsLeftRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>
      )}

      {/* Resizable Right Pane: Anchored to Right Edge */}
      {isRightPanelOpen && (
        <div 
          className={`h-full relative flex flex-col z-30 border-s pointer-events-auto shrink-0 flex-none ${
            isResizing ? 'transition-none' : 'transition-[width] duration-200'
          } ${
            isDarkMode ? 'bg-[#0c1427] border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}
          style={{ width: `${chatWidth}px` }}
        >
          <BottomDataPanel 
            explorerState={explorerState}
            setExplorerState={setExplorerState}
            onNavigate={onNavigate}
            onClosePanel={() => {
              setIsRightPanelOpen(false);
              if (setExplorerState) {
                setExplorerState(prev => ({ ...prev, resizeTrigger: Date.now() }));
              }
            }}
          />
        </div>
      )}

      {/* Bottom-Right Floating Button to Re-Open Right AI Panel */}
      <AnimatePresence>
        {!isRightPanelOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsRightPanelOpen(true);
              if (setExplorerState) {
                setExplorerState(prev => ({ ...prev, resizeTrigger: Date.now() }));
              }
            }}
            className={`absolute bottom-6 end-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all cursor-pointer pointer-events-auto ${
              isDarkMode
                ? 'bg-[#0f1932]/95 border-[#00e5ff]/40 text-white shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:border-[#00e5ff]'
                : 'bg-white/95 border-[#215A9E]/30 text-[#1e2749] shadow-[0_10px_30px_rgba(33,90,158,0.25)] hover:border-[#215A9E]'
            }`}
            title={t("Open AI Assistant Panel", "فتح لوحة مساعد الخرائط الذكي")}
          >
            <div className="shrink-0 flex items-center justify-center">
              <GeoLogoIcon className="w-6 h-6 text-[#7c3aed] dark:text-[#c084fc]" />
            </div>
            
            <div className="flex flex-col items-start text-start">
              <span className="font-extrabold text-xs tracking-tight">
                {t('AI Map Assistant', 'مساعد الخرائط الذكي')}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {t('Click to open', 'انقر للفتح')}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stakeholder 8 Demo Journey Switcher */}
      <DemoScenarioSwitcher onLaunchScenario={handleLaunchScenario} />
    </motion.div>
  );
}


