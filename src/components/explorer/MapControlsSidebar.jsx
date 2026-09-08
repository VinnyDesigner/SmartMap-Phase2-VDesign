import React, { useState } from 'react';
import { 
  Layers, Pencil, Grid, Home, Navigation, Compass, Plus, Minus, 
  Square, Circle, Hexagon, Map, Menu, X, Trash2, List, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import GisCategoriesPanel from './GisCategoriesPanel';

function SidebarButton({ icon, label, onClick, isActive, isDarkMode }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center py-2 transition-colors rounded-xl cursor-pointer ${
        isActive 
          ? (isDarkMode ? 'text-white bg-[#131b2e] border border-slate-700/80 shadow-2xs font-bold' : 'text-[#3D52A0] bg-[#eef3ff] font-bold shadow-2xs')
          : (isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-[#3D52A0] hover:bg-slate-50')
      }`}
    >
      <div className="[&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</div>
      <span className="text-[9px] mt-1 font-semibold tracking-tight opacity-90">{label}</span>
    </button>
  );
}

function BasemapOption({ label, imgUrl, isActive, isOfficial, onClick, isDarkMode }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
        isActive 
          ? (isDarkMode ? 'border-slate-700/80 bg-[#131b2e] text-white shadow-sm font-bold' : 'border-[#3D52A0] bg-[#eef3ff] text-[#3D52A0] shadow-sm font-bold')
          : (isDarkMode ? 'border-slate-800 hover:bg-[#111c34] text-slate-300' : 'border-slate-200/80 hover:bg-slate-50 text-slate-600')
      }`}
    >
      {isOfficial && (
        <span className={`absolute top-1.5 end-1.5 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-xs z-10 tracking-wider uppercase ${
          isDarkMode ? 'bg-[#080d1a] border border-slate-800 text-slate-200' : 'bg-[#3D52A0]'
        }`}>
          SDI
        </span>
      )}
      <img src={imgUrl} alt={label} className="w-full h-[54px] object-cover rounded-lg shadow-xs" />
      <span className="text-[11px] font-semibold tracking-tight text-center leading-tight">{label}</span>
    </button>
  );
}

function DrawOption({ icon: Icon, label, isActive, onClick, isDarkMode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all w-full cursor-pointer ${
        isActive 
          ? (isDarkMode ? 'border-slate-700/80 bg-[#131b2e] text-white font-bold' : 'border-[#3D52A0] bg-[#eef3ff] text-[#3D52A0]')
          : (isDarkMode ? 'border-transparent hover:bg-[#111c34] text-slate-300' : 'border-transparent hover:bg-slate-100/80 text-slate-600')
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[11px] font-semibold tracking-tight">{label}</span>
    </button>
  );
}

export default function MapControlsSidebar({ explorerState, setExplorerState }) {
  const [showBasemapMenu, setShowBasemapMenu] = useState(false);
  const [showCategoriesPanel, setShowCategoriesPanel] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const hasActiveDrawings = (explorerState?.drawings && explorerState.drawings.length > 0) || explorerState?.drawnPolygon || explorerState?.drawnCircle || explorerState?.drawnRectangle;

  return (
    <div className="absolute start-4 md:start-6 top-4 flex flex-col gap-2.5 pointer-events-auto z-30 items-center">
      
      {/* 1. ALWAYS VISIBLE COMPACT CONTROLS TOOLBAR */}
      <div className={`backdrop-blur-2xl rounded-2xl p-1.5 shadow-lg border flex flex-col items-center gap-1 z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0b132b]/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200/80 text-slate-700'
      }`}>
        {/* Zoom In */}
        <button 
          onClick={() => setExplorerState(prev => ({ ...prev, mapAction: 'zoomIn' }))}
          title={t('Zoom In', 'تكبير')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-[#3D52A0]'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Zoom Out */}
        <button 
          onClick={() => setExplorerState(prev => ({ ...prev, mapAction: 'zoomOut' }))}
          title={t('Zoom Out', 'تصغير')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-[#3D52A0]'
          }`}
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className={`w-5 h-px my-0.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/80'}`} />

        {/* Home / Reset Map View */}
        <button 
          onClick={() => setExplorerState(prev => ({ ...prev, mapAction: 'home' }))}
          title={t('Home / Default View', 'الرئيسية')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-[#3D52A0]'
          }`}
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Toggle Search Results List Panel Button */}
        {explorerState?.activeResults?.length > 0 && (
          <button
            onClick={() => setExplorerState(prev => ({ 
              ...prev, 
              showSearchResults: !prev.showSearchResults, 
              selectedDetail: null 
            }))}
            title={explorerState?.showSearchResults === false ? t('Show Search Results List', 'إظهار قائمة النتائج') : t('Hide Search Results List', 'إخفاء قائمة النتائج')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
              explorerState?.showSearchResults !== false && !explorerState?.selectedDetail
                ? (isDarkMode ? 'bg-[#7c3aed] text-white shadow-xs' : 'bg-[#215A9E] text-white shadow-xs')
                : (isDarkMode ? 'bg-[#182645] text-[#00e5ff] border border-slate-700/80 hover:bg-[#7c3aed] hover:text-white' : 'bg-[#eef3ff] text-[#215A9E] border border-[#215A9E]/20 hover:bg-[#215A9E] hover:text-white')
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white dark:border-[#0b132b]">
              {explorerState.activeResults.length}
            </span>
          </button>
        )}

        {/* Clear Active Drawing Button */}
        {hasActiveDrawings && (
          <button 
            onClick={() => setExplorerState(prev => ({ ...prev, drawings: [], drawnPolygon: null, drawnCircle: null, drawnRectangle: null, activeResults: [] }))}
            title={t('Clear Drawings', 'مسح الرسم')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isDarkMode ? 'bg-rose-950/50 hover:bg-rose-900/80 text-rose-400' : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className={`w-5 h-px my-0.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/80'}`} />

        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (isExpanded) {
              setShowBasemapMenu(false);
              setShowCategoriesPanel(false);
            }
          }}
          title={isExpanded ? t('Collapse Tools', 'إغلاق الأدوات') : t('Expand Tools', 'فتح الأدوات')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isExpanded 
              ? (isDarkMode ? 'bg-[#1e293b] text-white border border-slate-700 shadow-sm' : 'bg-[#3D52A0] text-white shadow-sm')
              : (isDarkMode ? 'hover:bg-slate-800 text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-[#3D52A0]')
          }`}
        >
          {isExpanded ? <X className="w-4.5 h-4.5 stroke-[2.5]" /> : <Menu className="w-4.5 h-4.5 stroke-[2.5]" />}
        </button>
      </div>

      {/* 2. EXPANDABLE TOOLS MENU */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`backdrop-blur-2xl rounded-2xl p-1.5 shadow-xl border flex flex-col items-center gap-1 z-40 w-[64px] ${
              isDarkMode ? 'bg-[#0b132b]/95 border-slate-800' : 'bg-white/95 border-slate-200/80'
            }`}
          >
            {/* GIS Layers / Categories Tool */}
            <SidebarButton 
              icon={<Layers className="w-4.5 h-4.5" />} 
              label={t('Layers', 'الطبقات')} 
              isActive={showCategoriesPanel}
              isDarkMode={isDarkMode}
              onClick={() => {
                setShowBasemapMenu(false);
                setShowCategoriesPanel(!showCategoriesPanel);
              }} 
            />

            {/* Spatial Analysis / Draw Tool */}
            <div className="relative w-full">
              <SidebarButton 
                icon={<Pencil className="w-4.5 h-4.5" />} 
                label={t('Draw', 'الرسم')} 
                isActive={explorerState?.activeMenu === 'draw'}
                isDarkMode={isDarkMode}
                onClick={() => {
                  setShowBasemapMenu(false);
                  setShowCategoriesPanel(false);
                  setExplorerState(prev => ({
                    ...prev,
                    activeMenu: prev.activeMenu === 'draw' ? null : 'draw'
                  }));
                }} 
              />

              {/* Drawing Tools Submenu */}
              <AnimatePresence>
                {explorerState?.activeMenu === 'draw' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`absolute start-[64px] top-0 backdrop-blur-2xl shadow-2xl border rounded-2xl p-2 w-[160px] flex flex-col gap-1 z-50 ${
                      isDarkMode ? 'bg-[#0f1a36]/95 border-slate-700/60' : 'bg-white/95 border-slate-200/80'
                    }`}
                  >
                    <DrawOption 
                      icon={Square} 
                      label={t('Draw Box', 'رسم مربع')} 
                      isActive={explorerState?.drawingTool === 'rectangle'}
                      isDarkMode={isDarkMode}
                      onClick={() => setExplorerState(prev => ({ ...prev, drawingTool: 'rectangle' }))}
                    />
                    <DrawOption 
                      icon={Circle} 
                      label={t('Draw Circle', 'رسم دائرة')} 
                      isActive={explorerState?.drawingTool === 'circle'}
                      isDarkMode={isDarkMode}
                      onClick={() => setExplorerState(prev => ({ ...prev, drawingTool: 'circle' }))}
                    />
                    <DrawOption 
                      icon={Hexagon} 
                      label={t('Draw Polygon', 'رسم مضلع')} 
                      isActive={explorerState?.drawingTool === 'polygon'}
                      isDarkMode={isDarkMode}
                      onClick={() => setExplorerState(prev => ({ ...prev, drawingTool: 'polygon' }))}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Basemap Switcher Tool */}
            <div className="relative w-full">
              <SidebarButton 
                icon={<Map className="w-4.5 h-4.5" />} 
                label={t('Basemap', 'الخريطة')} 
                isActive={showBasemapMenu}
                isDarkMode={isDarkMode}
                onClick={() => {
                  setShowCategoriesPanel(false);
                  setShowBasemapMenu(!showBasemapMenu);
                }} 
              />
              
              {/* Basemap Submenu */}
              <AnimatePresence>
                {showBasemapMenu && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`absolute start-[64px] top-0 backdrop-blur-2xl shadow-2xl border rounded-2xl p-2 w-[280px] grid grid-cols-2 gap-2 z-50 ${
                      isDarkMode ? 'bg-[#0f1a36]/95 border-slate-700/60' : 'bg-white/95 border-slate-200/80'
                    }`}
                  >
                    <BasemapOption 
                      label={t('Abu Dhabi DGE', 'أبوظبي الرسمية')} 
                      imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/4/6/10" 
                      isActive={!explorerState?.activeBasemap || explorerState?.activeBasemap === 'abu-dhabi-dge'}
                      isOfficial={true}
                      isDarkMode={isDarkMode}
                      onClick={() => { 
                        setExplorerState(prev => ({ ...prev, activeBasemap: 'abu-dhabi-dge' })); 
                        setShowBasemapMenu(false); 
                      }}
                    />
                    <BasemapOption 
                      label={t('Esri Vector', 'الشوارع العالمية')} 
                      imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/4/6/10" 
                      isActive={explorerState?.activeBasemap === 'streets'}
                      isDarkMode={isDarkMode}
                      onClick={() => { 
                        setExplorerState(prev => ({ ...prev, activeBasemap: 'streets' })); 
                        setShowBasemapMenu(false); 
                      }}
                    />
                    <BasemapOption 
                      label={t('Satellite', 'قمر صناعي')} 
                      imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/6/10" 
                      isActive={explorerState?.activeBasemap === 'satellite'}
                      isDarkMode={isDarkMode}
                      onClick={() => { 
                        setExplorerState(prev => ({ ...prev, activeBasemap: 'satellite' })); 
                        setShowBasemapMenu(false); 
                      }}
                    />
                    <BasemapOption 
                      label={t('Dark', 'الوضع الداكن')} 
                      imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/4/6/10" 
                      isActive={explorerState?.activeBasemap === 'dark'}
                      isDarkMode={isDarkMode}
                      onClick={() => { 
                        setExplorerState(prev => ({ ...prev, activeBasemap: 'dark' })); 
                        setShowBasemapMenu(false); 
                      }}
                    />
                    <BasemapOption 
                      label={t('Topo', 'تضاريس')} 
                      imgUrl="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/4/6/10" 
                      isActive={explorerState?.activeBasemap === 'topo'}
                      isDarkMode={isDarkMode}
                      onClick={() => { 
                        setExplorerState(prev => ({ ...prev, activeBasemap: 'topo' })); 
                        setShowBasemapMenu(false); 
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Legend Tool */}
            <SidebarButton 
              icon={<List className="w-4.5 h-4.5" />} 
              label={t('Legend', 'مفتاح الخريطة')} 
              isActive={explorerState?.activeMenu === 'legend'}
              isDarkMode={isDarkMode}
              onClick={() => {
                setShowBasemapMenu(false);
                setShowCategoriesPanel(false);
                setExplorerState(prev => ({
                  ...prev,
                  activeMenu: prev.activeMenu === 'legend' ? null : 'legend'
                }));
              }}
            />

            {/* Locate Tool */}
            <SidebarButton 
              icon={<Navigation className={`w-4.5 h-4.5 ${explorerState?.userLocationEnabled ? 'text-emerald-400' : ''}`} />} 
              label={t('Locate', 'موقعي')} 
              isDarkMode={isDarkMode}
              onClick={() => {
                const loc = explorerState?.userLocation || { lat: 24.4839, lng: 54.3773 };
                setExplorerState(prev => ({ 
                  ...prev, 
                  userLocationEnabled: true,
                  mapFocus: { lat: loc.lat, lng: loc.lng, zoom: 16 }
                }));
              }} 
            />

            {/* Compass Tool */}
            <SidebarButton 
              icon={<Compass className="w-4.5 h-4.5" />} 
              label={t('Compass', 'البوصلة')} 
              isDarkMode={isDarkMode}
              onClick={() => setExplorerState(prev => ({ ...prev, mapAction: 'compass' }))} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER GIS CATEGORIES PANEL WITH SLIM HEIGHT & TOGGLE SWITCHES */}
      <AnimatePresence>
        {showCategoriesPanel && (
          <GisCategoriesPanel
            isOpen={showCategoriesPanel}
            onClose={() => setShowCategoriesPanel(false)}
            explorerState={explorerState}
            setExplorerState={setExplorerState}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
