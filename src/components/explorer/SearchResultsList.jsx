import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, Info, ChevronDown, GraduationCap, PlusSquare, TreePine, Bus, MapPin, Check, Plus, History } from 'lucide-react';

export default function SearchResultsList({ explorerState, setExplorerState }) {
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
    <div className="flex flex-col h-full">
      {/* Main Header with Actions */}
      <div className="px-8 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f0f4ff] text-[#3D52A0] flex items-center justify-center">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <h3 className="font-bold text-[#3D52A0] text-[17px] tracking-tight">Search Results ({filteredResults.length})</h3>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setExplorerState(prev => ({ ...prev, activeMenu: 'saved' }))}
            className="text-gray-400 hover:text-[#3D52A0] transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8faff]"
          >
            <Bookmark className="w-[18px] h-[18px]" />
          </button>
          <button 
            onClick={() => setExplorerState(prev => ({ ...prev, chatHistory: [] }))}
            className="text-gray-400 hover:text-[#3D52A0] transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8faff]"
          >
            <Plus className="w-[18px] h-[18px]" />
          </button>
          <button 
            onClick={() => setExplorerState(prev => ({ ...prev, activeMenu: 'history' }))}
            className="text-gray-400 hover:text-[#3D52A0] transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8faff]"
          >
            <History className="w-[18px] h-[18px]" />
          </button>
          <button 
            onClick={() => setExplorerState(prev => ({ ...prev, isDockerMinimized: true }))}
            className="text-gray-400 hover:text-[#3D52A0] transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8faff]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </button>
        </div>
      </div>

      {/* Filters Sub-header */}
      <div className="px-8 py-3 flex items-center justify-end border-b border-gray-100 mb-2">
        
        <div className="flex items-center gap-5">
          <div className="relative flex items-center gap-2" ref={layerRef}>
            <span className="text-[13px] font-medium text-gray-400">Layer:</span>
            <button 
              onClick={() => { setShowLayerMenu(!showLayerMenu); setShowTypeMenu(false); }}
              className={`text-[13px] font-bold tracking-tight rounded-lg px-3 py-1.5 flex items-center gap-1 transition-colors ${
                showLayerMenu ? 'bg-[#dce6ff] text-[#3D52A0]' : 'bg-[#eef3ff] text-[#3D52A0] hover:bg-[#dce6ff]'
              }`}
            >
              {selectedLayers.length === 6 ? 'All Layers' : `${selectedLayers.length} Layers`} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showLayerMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white/70 backdrop-blur-3xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 p-2 z-50 flex flex-col gap-1">
                {['Education', 'Healthcare', 'Transport', 'Environment', 'Tourism', 'Utilities'].map(layer => (
                  <button key={layer} onClick={() => toggleLayer(layer)} className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 rounded-xl transition-colors text-left">
                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${selectedLayers.includes(layer) ? 'bg-dge-tech' : 'border-2 border-black/20'}`}>
                      {selectedLayers.includes(layer) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-[13px] font-medium text-dge-reliable tracking-tight">{layer}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative flex items-center gap-2" ref={typeRef}>
            <span className="text-[13px] font-medium text-gray-400">Type:</span>
            <button 
              onClick={() => { setShowTypeMenu(!showTypeMenu); setShowLayerMenu(false); }}
              className={`text-[13px] font-bold tracking-tight rounded-lg px-3 py-1.5 flex items-center gap-1 transition-colors ${
                showTypeMenu ? 'bg-[#dce6ff] text-[#3D52A0]' : 'bg-[#eef3ff] text-[#3D52A0] hover:bg-[#dce6ff]'
              }`}
            >
              {selectedType} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showTypeMenu && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-white/70 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 py-1 z-50 flex flex-col rounded-xl overflow-hidden">
                  {['All Types', 'Private', 'Public / Government'].map(type => (
                    <button 
                      key={type} 
                      onClick={() => { setExplorerState(prev => ({ ...prev, typeFilter: type })); setShowTypeMenu(false); }} 
                      className={`px-4 py-2.5 text-left text-[13px] font-medium tracking-tight transition-colors ${selectedType === type ? 'bg-blue-600 text-white' : 'text-dge-reliable hover:bg-black/5'}`}
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
      <div className="flex-1 overflow-y-auto px-6 py-2 sleek-scrollbar">
        {filteredResults.map((item, i) => {
          let CategoryIcon = MapPin;
          if (item.type === 'EDUCATION') CategoryIcon = GraduationCap;
          else if (item.type === 'HOSPITAL') CategoryIcon = PlusSquare;
          else if (item.type === 'PARK') CategoryIcon = TreePine;
          else if (item.type === 'TRANSPORT') CategoryIcon = Bus;

          return (
            <div 
              key={item.id} 
              onClick={() => setExplorerState(prev => ({ ...prev, selectedDetail: item, mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 } }))}
              className={`p-4 flex items-center justify-between transition-colors cursor-pointer border border-white/50 rounded-[16px] mb-3 ${
                explorerState?.selectedDetail?.id === item.id ? 'bg-white/90 shadow-sm ring-1 ring-[#3D52A0]/20 backdrop-blur-sm' : 'bg-white/60 hover:bg-white/80 hover:shadow-sm backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === 'EDUCATION' ? 'bg-[#f0f4ff] text-[#3D52A0]' :
                  item.type === 'HOSPITAL' ? 'bg-[#f0f4ff] text-[#3D52A0]' :
                  item.type === 'PARK' ? 'bg-[#f0f4ff] text-[#3D52A0]' :
                  item.type === 'TRANSPORT' ? 'bg-[#f0f4ff] text-[#3D52A0]' :
                  'bg-[#f0f4ff] text-[#3D52A0]'
                }`}>
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3D52A0] text-[15px] mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="font-bold text-gray-500 bg-[#f4f7fb] px-2 py-0.5 rounded-md tracking-tight">{item.type}</span>
                    <span className="text-gray-400 font-medium">{item.location || 'Custom Selection'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-[#3D52A0] transition-colors w-8 h-8 flex items-center justify-center">
                  <Bookmark className="w-[18px] h-[18px]" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setExplorerState(prev => ({ ...prev, selectedDetail: item })); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
                >
                  <Info className="w-[18px] h-[18px]" />
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setExplorerState(prev => ({ 
                      ...prev, 
                      mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 },
                      isDockerMinimized: true 
                    })); 
                  }}
                  className="text-[#3D52A0] hover:underline text-[13px] font-semibold tracking-tight transition-colors px-2"
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
