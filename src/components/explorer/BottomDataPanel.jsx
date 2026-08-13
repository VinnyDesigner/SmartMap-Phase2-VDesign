import React, { useRef } from 'react';
import { MessageSquare, Bookmark, Plus, History, Maximize2, Minimize2, Search } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import AiChatInterface from './AiChatInterface';
import SearchResultsList from './SearchResultsList';
import DetailSlidePanel from './DetailSlidePanel';
import MenuSlidePanel from './MenuSlidePanel';

export default function BottomDataPanel({ explorerState, setExplorerState }) {
  const getContextualTitle = () => {
    if (explorerState?.selectedDetail) {
      return explorerState.selectedDetail.name;
    }

    const selectedLayers = explorerState?.layerFilters || ['Education', 'Healthcare', 'Transport', 'Environment', 'Tourism', 'Utilities'];
    const visibleResults = (explorerState?.activeResults || []).filter(item => {
      const typeMap = { 'EDUCATION': 'Education', 'HOSPITAL': 'Healthcare', 'TRANSPORT': 'Transport', 'PARK': 'Environment' };
      return selectedLayers.includes(typeMap[item.type] || 'Utilities');
    });

    if (!visibleResults.length) return 'Explore Abu Dhabi';
    
    const firstItem = visibleResults[0];
    const categoryName = 
      firstItem.type === 'EDUCATION' ? 'Educational Facilities' :
      firstItem.type === 'HOSPITAL' ? 'Healthcare Facilities' :
      firstItem.type === 'PARK' ? 'Parks & Recreation' :
      firstItem.type === 'TRANSPORT' ? 'Transport Hubs' : 'Points of Interest';
    
    const locationName = firstItem.location || 'the area';
    return `${categoryName} in ${locationName}`;
  };

  // Setup for AI Glow Blob
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 25, mass: 1.5 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25, mass: 1.5 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <AnimatePresence mode="wait">
      {explorerState?.isDockerMinimized ? (
        <motion.div 
          key="minimized"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative p-[1.5px] rounded-full shadow-[0_12px_24px_rgba(33,90,158,0.15)] pointer-events-auto overflow-hidden group transition-all hover:shadow-[0_16px_32px_rgba(33,90,158,0.2)] cursor-text"
          onClick={() => setExplorerState(prev => ({ ...prev, isDockerMinimized: false }))}
        >
          {/* Animated Shiny Stroke Layer */}
          <div className="absolute aspect-square w-[500%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] z-0 opacity-100"
               style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(255, 255, 255, 0.6) 80%, #ffffff 95%, transparent 100%)' }} 
          />
          <div className="w-[600px] h-[56px] bg-white rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center px-6 relative z-10">
            <Search className="w-5 h-5 text-dge-tech mr-4" />
            <input 
              type="text" 
              placeholder="Ask GeoVision AI or search locations..." 
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-slate-800 placeholder:text-slate-400 font-medium cursor-text"
              onClick={(e) => {
                e.stopPropagation();
                setExplorerState(prev => ({ ...prev, isDockerMinimized: false }));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                   const text = e.target.value.trim();
                   setExplorerState(prev => ({
                     ...prev,
                     isDockerMinimized: false,
                     chatHistory: [...(prev.chatHistory || []), { sender: 'user', text }]
                   }));
                   e.target.value = '';
                }
              }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          key="expanded"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative p-[1.5px] rounded-[32px] shadow-[0_12px_48px_rgba(0,0,0,0.15)] pointer-events-auto overflow-hidden group z-10"
        >
          {/* Animated Shiny Stroke Layer */}
          <div className="absolute aspect-square w-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] z-0 opacity-100"
               style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(255, 255, 255, 0.6) 80%, #ffffff 95%, transparent 100%)' }} 
          />
          {/* Main Inner Container */}
          <div className="w-[1100px] h-[400px] bg-white rounded-[30.5px] flex overflow-hidden relative z-10">
            {/* AI Glow Blob */}
            <motion.div
              className="pointer-events-none absolute w-[450px] h-[450px] rounded-full blur-[100px] opacity-[0.55] z-0 bg-gradient-to-r from-blue-400 via-indigo-300 to-[#3D52A0]"
              style={{
                x: springX,
                y: springY,
                translateX: '-50%',
                translateY: '-50%'
              }}
            />

            {/* Split Content Area */}
            <div className="w-[45%] h-full flex flex-col relative z-10">
              <AiChatInterface 
                explorerState={explorerState}
                setExplorerState={setExplorerState}
                title={getContextualTitle()}
              />
            </div>
              
            <div className="w-[55%] h-full p-2 relative z-20">
              <div className="w-full h-full bg-white/50 backdrop-blur-md rounded-[24px] shadow-sm border border-white/60 overflow-hidden relative flex flex-col">
                <SearchResultsList 
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
