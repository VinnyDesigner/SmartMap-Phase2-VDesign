import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, Info, ChevronDown, GraduationCap, PlusSquare, TreePine, Bus, MapPin, Check, Plus, History } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function SearchResultsList({ explorerState, setExplorerState }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const results = explorerState?.activeResults || [];

  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const layerRef = useRef(null);
  const typeRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (layerRef.current && !layerRef.current.contains(event.target)) setShowLayerMenu(false);
      if (typeRef.current && !typeRef.current.contains(event.target)) setShowTypeMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLayers = explorerState?.layerFilters || [];
  const selectedType = explorerState?.typeFilter || 'All Types';

  const toggleLayer = (layer) => {
    setExplorerState(prev => {
      const filters = prev.layerFilters || [];
      const newFilters = filters.includes(layer) ? filters.filter(l => l !== layer) : [...filters, layer];
      return { ...prev, layerFilters: newFilters };
    });
  };

  const typeMap = { 'EDUCATION': 'Education', 'HOSPITAL': 'Healthcare', 'TRANSPORT': 'Transport', 'PARK': 'Environment' };
  const filteredResults = results.filter(item => {
    const layerName = typeMap[item.type] || 'Utilities';
    return selectedLayers.includes(layerName);
  });

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${isDarkMode ? 'bg-[#060a12] text-slate-100' : 'bg-white text-slate-800'}`}>
      {/* Main Header with Actions */}
      <div className={`px-4 md:px-8 pt-4 md:pt-6 pb-2 md:pb-4 flex items-center justify-between border-b ${
        isDarkMode ? 'border-slate-800' : 'border-black/5'
      }`}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-[#1e293b] border border-slate-700/60 text-sky-300' : 'bg-[#f0f4ff] text-[#3D52A0]'
          }`}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <h3 className={`font-bold text-[15px] tracking-tight ${isDarkMode ? 'text-white' : 'text-[#333333]'}`}>
            {t('Search Results', 'نتائج البحث')} ({filteredResults.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setExplorerState(prev => ({ ...prev, activeMenu: 'saved' }))}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-[#00e5ff] hover:bg-slate-800' : 'text-slate-500 hover:text-[#3D52A0] hover:bg-[#f8faff]'
            }`}
          >
            <Bookmark className="w-[18px] h-[18px]" />
          </button>
          <button 
            onClick={() => setExplorerState(prev => ({ ...prev, chatHistory: [] }))}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-[#333333] hover:bg-[#f8faff]'
            }`}
            title="Clear Chat"
          >
            <History className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className={`px-4 md:px-8 py-3 border-b flex items-center gap-3 overflow-visible z-20 ${
        isDarkMode ? 'border-slate-800 bg-[#0a1128]/60' : 'border-black/5 bg-[#fbfcfd]'
      }`}>
        <div className="flex items-center gap-2 flex-1 overflow-x-auto sleek-scrollbar py-1">
          {/* Multi-Select Layer Dropdown */}
          <div className="relative" ref={layerRef}>
            <button 
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all border ${
                selectedLayers.length > 0 
                  ? (isDarkMode ? 'bg-[#131b2e] text-[#c084fc] border-[#c084fc]/50' : 'bg-[#eef3ff] text-[#3D52A0] border-[#3D52A0]/30')
                  : (isDarkMode ? 'bg-[#0d1424] text-slate-300 border-slate-700/80 hover:border-slate-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300')
              }`}
            >
              <span>Layers ({selectedLayers.length})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showLayerMenu && (
              <div className={`absolute top-full left-0 mt-2 w-56 shadow-2xl border py-1.5 z-50 flex flex-col rounded-2xl overflow-hidden backdrop-blur-2xl ${
                isDarkMode ? 'bg-[#0d1424]/95 border-slate-700/80 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
              }`}>
                {['Education', 'Healthcare', 'Transport', 'Environment', 'Utilities'].map(layer => {
                  const isSelected = selectedLayers.includes(layer);
                  return (
                    <button 
                      key={layer} 
                      onClick={() => toggleLayer(layer)} 
                      className={`px-4 py-2 text-left text-xs font-medium tracking-tight flex items-center justify-between transition-colors ${
                        isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className={isSelected ? (isDarkMode ? 'text-[#c084fc] font-bold' : 'text-[#3D52A0] font-bold') : ''}>{layer}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#c084fc]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Type Filter Dropdown */}
          <div className="relative" ref={typeRef}>
            <button 
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all border ${
                selectedType !== 'All Types' 
                  ? (isDarkMode ? 'bg-[#131b2e] text-[#c084fc] border-[#c084fc]/50' : 'bg-[#eef3ff] text-[#3D52A0] border-[#3D52A0]/30')
                  : (isDarkMode ? 'bg-[#0d1424] text-slate-300 border-slate-700/80 hover:border-slate-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300')
              }`}
            >
              <span>{selectedType}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showTypeMenu && (
               <div className={`absolute top-full left-0 mt-2 w-48 shadow-2xl border py-1.5 z-50 flex flex-col rounded-2xl overflow-hidden backdrop-blur-2xl ${
                 isDarkMode ? 'bg-[#0d1424]/95 border-slate-700/80 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
               }`}>
                  {['All Types', 'Private', 'Public / Government'].map(type => (
                    <button 
                      key={type} 
                      onClick={() => { setExplorerState(prev => ({ ...prev, typeFilter: type })); setShowTypeMenu(false); }} 
                      className={`px-4 py-2.5 text-left text-xs font-medium tracking-tight transition-colors ${
                        selectedType === type 
                          ? (isDarkMode ? 'bg-[#c084fc] text-slate-950 font-bold' : 'bg-[#3D52A0] text-white font-bold') 
                          : (isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50')
                      }`}
                    >
                      {type}
                    </button>
                  ))}
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 sleek-scrollbar">
        {filteredResults.map((item) => {
          let CategoryIcon = MapPin;
          if (item.type === 'EDUCATION') CategoryIcon = GraduationCap;
          else if (item.type === 'HOSPITAL') CategoryIcon = PlusSquare;
          else if (item.type === 'PARK') CategoryIcon = TreePine;
          else if (item.type === 'TRANSPORT') CategoryIcon = Bus;

          const isSelected = explorerState?.selectedDetail?.id === item.id;

          return (
            <div 
              key={item.id} 
              onClick={() => setExplorerState(prev => ({ ...prev, selectedDetail: item, mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 } }))}
              className={`p-3 flex items-center justify-between transition-all cursor-pointer border rounded-2xl mb-2.5 gap-2 ${
                isSelected 
                  ? (isDarkMode ? 'bg-[#131b2e] border-[#c084fc]/60 shadow-[0_0_15px_rgba(192,132,252,0.2)]' : 'bg-white/90 shadow-sm ring-1 ring-slate-300') 
                  : (isDarkMode ? 'bg-[#0d1424] border-slate-800/80 hover:bg-[#131b2e] hover:border-slate-700' : 'bg-white/60 hover:bg-white/80 hover:shadow-sm')
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-[#080d1a] border border-slate-800 text-[#c084fc]' : 'bg-[#f0f4ff] text-[#3D52A0]'
                }`}>
                  <CategoryIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-[13px] mb-0.5 truncate ${isDarkMode ? 'text-white' : 'text-[#333333]'}`}>
                    {isArabic && item.name_ar ? item.name_ar : item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] mt-1">
                    <span className={`font-semibold px-2.5 py-0.5 rounded-full tracking-tight text-[10px] shadow-2xs ${
                      isDarkMode ? 'bg-[#7c3aed]/25 text-[#c084fc] border border-[#7c3aed]/40' : 'bg-[#f3e8ff] text-[#7c3aed] border border-[#7c3aed]/20'
                    }`}>
                      {typeMap[item.type] || item.type}
                    </span>
                    <span className={`font-medium truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isArabic && item.location_ar ? item.location_ar : item.location || 'Custom Selection'}
                    </span>
                    <span className={`hidden sm:flex items-center gap-1 font-mono text-[9px] ms-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                      <span>👁 168</span>
                      <span>📥 62</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className={`transition-colors w-6 h-6 flex items-center justify-center ${isDarkMode ? 'text-slate-400 hover:text-[#c084fc]' : 'text-slate-400 hover:text-[#3D52A0]'}`}>
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setExplorerState(prev => ({ ...prev, selectedDetail: item })); }}
                  className={`transition-colors w-6 h-6 flex items-center justify-center ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                <div className={`w-px h-3 mx-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setExplorerState(prev => ({ 
                      ...prev, 
                      mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 },
                      isDockerMinimized: true
                    })); 
                  }}
                  className={`hover:underline text-[11px] font-semibold tracking-tight transition-colors px-1 whitespace-nowrap ${
                    isDarkMode ? 'text-[#00e5ff]' : 'text-[#333333]'
                  }`}
                >
                  Show on map
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
