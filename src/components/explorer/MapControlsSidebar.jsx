import React, { useState } from 'react';
import { Layers, Pencil, Grid, Home, Navigation, Compass, MousePointer2, Plus, Minus, Square, Circle, Hexagon, Map, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SidebarButton({ icon, label, onClick, isActive }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center py-1.5 transition-colors ${
        isActive ? 'text-dge-tech bg-blue-50/50' : 'text-dge-reliable hover:text-dge-tech hover:bg-gray-50'
      }`}
    >
      <div className="[&>svg]:w-[16px] [&>svg]:h-[16px]">{icon}</div>
      <span className="text-[8px] mt-1 font-semibold tracking-tight opacity-80">{label}</span>
    </button>
  );
}

function BasemapOption({ label, imgUrl, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
        isActive ? 'border-dge-tech bg-dge-tech/5' : 'border-transparent hover:bg-black/5'
      }`}
    >
      <img src={imgUrl} alt={label} className="w-full h-[60px] object-cover rounded shadow-sm" />
      <span className={`text-[11px] font-medium tracking-tight ${isActive ? 'text-dge-tech' : 'text-dge-grey'}`}>{label}</span>
    </button>
  );
}

function DrawOption({ icon: Icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
        isActive ? 'border-dge-tech bg-dge-tech/5 text-dge-tech' : 'border-transparent hover:bg-black/5 text-dge-grey hover:text-dge-reliable'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[12px] font-medium tracking-tight">{label}</span>
    </button>
  );
}

export default function MapControlsSidebar({ explorerState, setExplorerState }) {
  const [showBasemapMenu, setShowBasemapMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const IconBtn = ({ icon: Icon, label, noLabel, onClick, highlight }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center py-1.5 w-full hover:bg-gray-50 transition-colors group ${highlight ? 'text-dge-tech' : 'text-dge-reliable'}`}>
      <Icon className={`w-[16px] h-[16px] ${highlight ? 'text-dge-tech' : 'text-dge-reliable group-hover:text-dge-tech'}`} />
      {!noLabel && <span className="text-[8px] mt-1 opacity-80 font-semibold tracking-tight">{label}</span>}
    </button>
  );

  return (
    <div className="absolute left-8 top-[64px] bottom-6 flex flex-col gap-3 pointer-events-auto z-30 pb-10 items-center">
      
      {/* Brand Colored Hamburger Button */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (isExpanded) {
            setShowBasemapMenu(false); // Close submenus when collapsing
            if (explorerState?.isDrawingMode) {
              setExplorerState(prev => ({ ...prev, isDrawingMode: false, drawingTool: null }));
            }
          }
        }}
        className="w-12 h-12 rounded-full bg-dge-reliable text-white flex items-center justify-center shadow-lg hover:bg-dge-tech hover:shadow-xl transition-all duration-300 z-40 shrink-0 border border-white/20"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(6, 51, 96, 0.3))' }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {isExpanded ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
        </motion.div>
      </button>

      {/* Expandable Navigation Column */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ 
              height: 'auto', 
              opacity: 1, 
              y: 0,
              transitionEnd: { overflow: 'visible' } 
            }}
            exit={{ 
              height: 0, 
              opacity: 0, 
              y: -20,
              overflow: 'hidden' 
            }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full flex justify-center"
            style={{ overflow: 'hidden' }}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-[24px] shadow-sm border border-gray-100 flex flex-col py-2 w-12 gap-1 items-center">
              
              {/* Zoom Controls */}
              <IconBtn icon={Plus} noLabel />
              <IconBtn icon={Minus} noLabel />
              
              <div className="w-8 h-px bg-gray-100 my-1"></div>

              {/* Top Tools */}
              <SidebarButton icon={<Grid className="w-4 h-4" />} label="Browse" />
              
              <div className="relative w-full">
                <SidebarButton 
                  icon={<Pencil className="w-4 h-4" />} 
                  label="Draw" 
                  isActive={explorerState?.isDrawingMode}
                  onClick={() => {
                    setShowBasemapMenu(false);
                    setExplorerState(prev => {
                      const newMode = !prev.isDrawingMode;
                      return { 
                        ...prev, 
                        isDrawingMode: newMode, 
                        drawingTool: null,
                        isDockerMinimized: newMode ? true : false
                      };
                    });
                  }} 
                />
                
                <AnimatePresence>
                  {explorerState?.isDrawingMode && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-[60px] top-0 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 rounded-2xl p-2 w-[160px] flex flex-col gap-1 z-50"
                    >
                      <DrawOption 
                        icon={Square} 
                        label="Draw Box" 
                        isActive={explorerState?.drawingTool === 'rectangle'}
                        onClick={() => {
                          setExplorerState(prev => ({ ...prev, drawingTool: 'rectangle' }));
                        }}
                      />
                      <DrawOption 
                        icon={Circle} 
                        label="Draw Circle" 
                        isActive={explorerState?.drawingTool === 'circle'}
                        onClick={() => {
                          setExplorerState(prev => ({ ...prev, drawingTool: 'circle' }));
                        }}
                      />
                      <DrawOption 
                        icon={Hexagon} 
                        label="Draw Polygon" 
                        isActive={explorerState?.drawingTool === 'polygon'}
                        onClick={() => {
                          setExplorerState(prev => ({ ...prev, drawingTool: 'polygon' }));
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative w-full">
                <SidebarButton 
                  icon={<Map className="w-4 h-4" />} 
                  label="Basemap" 
                  onClick={() => {
                    const newMenu = !showBasemapMenu;
                    setShowBasemapMenu(newMenu);
                    setExplorerState(prev => {
                      const updates = { isDockerMinimized: newMenu ? true : false };
                      if (newMenu && prev.isDrawingMode) {
                        updates.isDrawingMode = false;
                        updates.drawingTool = null;
                      }
                      return { ...prev, ...updates };
                    });
                  }} 
                />
                
                <AnimatePresence>
                  {showBasemapMenu && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-[60px] top-0 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 rounded-2xl p-2 w-[300px] grid grid-cols-2 gap-2 z-50"
                    >
                      <BasemapOption 
                        label="Streets" 
                        imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/4/6/10" 
                        isActive={explorerState?.basemap === 'osm'}
                        onClick={() => { 
                          setExplorerState(prev => ({ ...prev, basemap: 'osm', isDockerMinimized: false })); 
                          setShowBasemapMenu(false); 
                        }}
                      />
                      <BasemapOption 
                        label="Satellite" 
                        imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/6/10" 
                        isActive={explorerState?.basemap === 'satellite'}
                        onClick={() => { 
                          setExplorerState(prev => ({ ...prev, basemap: 'satellite', isDockerMinimized: false })); 
                          setShowBasemapMenu(false); 
                        }}
                      />
                      <BasemapOption 
                        label="Dark Mode" 
                        imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/4/6/10" 
                        isActive={explorerState?.basemap === 'dark'}
                        onClick={() => { 
                          setExplorerState(prev => ({ ...prev, basemap: 'dark', isDockerMinimized: false })); 
                          setShowBasemapMenu(false); 
                        }}
                      />
                      <BasemapOption 
                        label="Light" 
                        imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/4/6/10" 
                        isActive={explorerState?.basemap === 'light'}
                        onClick={() => { 
                          setExplorerState(prev => ({ ...prev, basemap: 'light', isDockerMinimized: false })); 
                          setShowBasemapMenu(false); 
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-8 h-px bg-gray-100 my-1"></div>

              {/* Bottom Tools */}
              <IconBtn icon={Home} label="Home" />
              <IconBtn icon={Navigation} label="Locate" />
              <IconBtn icon={Compass} label="Compass" />
              <IconBtn icon={MousePointer2} label="Select" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
