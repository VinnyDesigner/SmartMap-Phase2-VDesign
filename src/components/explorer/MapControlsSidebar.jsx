import React, { useState } from 'react';
import { Layers, Pencil, Grid, Home, Navigation, Compass, MousePointer2, Plus, Minus, Square, Circle, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SidebarButton({ icon, label, onClick, isActive }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center py-2.5 transition-colors ${
        isActive ? 'text-dge-tech bg-blue-50/50' : 'text-dge-reliable hover:text-dge-tech hover:bg-gray-50'
      }`}
    >
      <div className="[&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</div>
      <span className="text-[9px] mt-1 font-semibold tracking-tight opacity-80">{label}</span>
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

  const IconBtn = ({ icon: Icon, label, noLabel, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center py-2.5 w-full hover:bg-gray-50 transition-colors group">
      <Icon className="w-[18px] h-[18px] text-dge-reliable group-hover:text-dge-tech" />
      {!noLabel && <span className="text-[9px] mt-1 text-dge-reliable opacity-80 font-semibold tracking-tight">{label}</span>}
    </button>
  );

  return (
    <div className="absolute left-8 top-[90px] bottom-6 flex flex-col gap-4 pointer-events-auto z-30">
      
      {/* Zoom Controls */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col py-1 w-14">
        <IconBtn icon={Plus} noLabel />
        <IconBtn icon={Minus} noLabel />
      </div>

      {/* Top Tools */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col py-1 w-14 gap-1">
        <SidebarButton icon={<Grid className="w-5 h-5" />} label="Browse" />
        
        <div className="relative">
          <SidebarButton 
            icon={<Pencil className="w-5 h-5" />} 
            label="Draw" 
            isActive={explorerState?.isDrawingMode}
            onClick={() => setExplorerState(prev => {
              const newMode = !prev.isDrawingMode;
              return { 
                ...prev, 
                isDrawingMode: newMode, 
                drawingTool: null,
                isDockerMinimized: newMode ? true : false
              };
            })} 
          />
          
          <AnimatePresence>
            {explorerState?.isDrawingMode && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-[70px] top-0 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 rounded-2xl p-2 w-[160px] flex flex-col gap-1 z-50"
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

        <div className="relative">
          <SidebarButton 
            icon={<Layers className="w-5 h-5" />} 
            label="Basemap" 
            onClick={() => {
              const newMenu = !showBasemapMenu;
              setShowBasemapMenu(newMenu);
              setExplorerState(prev => ({ ...prev, isDockerMinimized: newMenu ? true : false }));
            }} 
          />
          
          <AnimatePresence>
            {showBasemapMenu && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-[70px] top-0 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 rounded-2xl p-2 w-[300px] grid grid-cols-2 gap-2 z-50"
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
      </div>

      {/* Bottom Tools */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col py-1 w-14 gap-1 overflow-hidden">
        <IconBtn icon={Home} label="Home" />
        <IconBtn icon={Navigation} label="Locate" />
        <IconBtn icon={Compass} label="Compass" />
        <IconBtn icon={MousePointer2} label="Select" />
      </div>

    </div>
  );
}
