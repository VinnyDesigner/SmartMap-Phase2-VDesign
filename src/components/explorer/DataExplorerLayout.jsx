import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronsLeftRight } from 'lucide-react';
import MapBackground from '../MapBackground';
import MapControlsSidebar from './MapControlsSidebar';
import BottomDataPanel from './BottomDataPanel';

import { useTheme } from '../../contexts/ThemeContext';

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
  const containerRef = useRef(null);
  const [chatWidth, setChatWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.max(300, Math.round(window.innerWidth * 0.20));
    }
    return 340;
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
    const defaultW = Math.max(300, Math.round(window.innerWidth * 0.20));
    setChatWidth(defaultW);
    if (setExplorerState) {
      setExplorerState(prev => ({ ...prev, resizeTrigger: Date.now() }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      ref={containerRef}
      className={`absolute inset-0 z-20 flex pt-14 md:pt-16 h-full w-full overflow-hidden ${
        isResizing ? 'select-none cursor-col-resize' : ''
      }`}
    >
      {/* Resizable Left Pane: Interactive Map */}
      <div 
        className="h-full relative overflow-hidden flex-none pointer-events-auto"
        style={{ width: `calc(100% - ${chatWidth}px)` }}
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
      </div>

      {/* Sleek Draggable Resizer Handle with Clear Affordance */}
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
        className="w-4 -mx-2 relative z-40 h-full flex items-center justify-center cursor-col-resize select-none pointer-events-auto group"
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

      {/* Resizable Right Pane: Solid 2nd Division Chat Panel */}
      <div 
        className={`h-full relative flex flex-col z-30 border-s pointer-events-auto shrink-0 transition-colors duration-300 ${
          isDarkMode ? 'bg-[#060a12] border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
        style={{ width: `${chatWidth}px` }}
      >
        <BottomDataPanel 
          explorerState={explorerState}
          setExplorerState={setExplorerState}
          onNavigate={onNavigate}
        />
      </div>
    </motion.div>
  );
}


