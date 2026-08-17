import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockLocations = [
  { name: 'Al Jimi, Al Ain', lat: 24.2384, lng: 55.7483 },
  { name: 'Abu Dhabi Mall', lat: 24.4947, lng: 54.3824 },
  { name: 'Yas Island', lat: 24.4962, lng: 54.6033 },
  { name: 'Corniche Beach', lat: 24.4721, lng: 54.3213 },
  { name: 'Sheikh Zayed Grand Mosque', lat: 24.4128, lng: 54.4750 },
  { name: 'Louvre Abu Dhabi', lat: 24.5337, lng: 54.3986 },
  { name: 'Masdar City', lat: 24.4284, lng: 54.6190 },
];

export default function LocationSearch({ explorerState, setExplorerState }) {
  const [query, setQuery] = useState('Al Jimi, Al Ain');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredLocations = mockLocations.filter(loc => 
    loc.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (loc) => {
    setQuery(loc.name);
    setShowDropdown(false);
    setExplorerState(prev => ({
      ...prev,
      mapFocus: { lat: loc.lat, lng: loc.lng, zoom: 15 }
    }));
  };

  return (
    <div ref={wrapperRef} className="relative group w-12 hover:w-72 focus-within:w-72 transition-all duration-300 h-12 rounded-[24px] shadow-sm overflow-hidden cursor-pointer pointer-events-auto p-[2px]">
      {/* Base subtle border to give structure when plasma fades out */}
      <div className="absolute inset-0 bg-slate-200/40" />

      {/* Solar Plasma Energy Ring - visible when NOT expanded */}
      <div className="absolute top-1/2 left-1/2 w-[400%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] z-0 pointer-events-none opacity-100 group-hover:opacity-0 group-focus-within:opacity-0 transition-opacity duration-300">
         <div className="absolute inset-0" 
              style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(0, 229, 255, 0.1) 50%, rgba(61, 82, 160, 0.4) 70%, rgba(0, 229, 255, 0.8) 85%, rgba(255, 255, 255, 1) 90%, rgba(0, 229, 255, 0.8) 93%, rgba(61, 82, 160, 0.4) 96%, transparent 98%)' }} />
         <div className="absolute inset-0 opacity-90" 
              style={{ 
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 229, 255, 0.4) 80%, rgba(255, 255, 255, 1) 90%, rgba(0, 229, 255, 0.4) 94%, transparent 97%)',
                filter: 'blur(6px)' 
              }} />
         <div className="absolute inset-0" 
              style={{ 
                background: 'conic-gradient(from 0deg, transparent 85%, rgba(255, 255, 255, 0.6) 88%, #ffffff 90%, rgba(255, 255, 255, 0.6) 92%, transparent 95%)',
                filter: 'blur(2px)' 
              }} />
         <div className="absolute inset-0" 
              style={{ 
                background: 'conic-gradient(from 0deg, transparent 82%, rgba(255, 255, 255, 0.8) 82.2%, transparent 82.5%, transparent 85%, rgba(0, 229, 255, 0.9) 85.2%, transparent 85.5%, transparent 94%, rgba(0, 229, 255, 0.8) 94.2%, transparent 94.5%)',
                filter: 'blur(1px)'
              }} />
      </div>

      <div className="relative flex items-center gap-2 bg-white/95 backdrop-blur-md h-full w-full rounded-[22px] px-[12px]">
        <Search className="w-5 h-5 text-dge-tech shrink-0" />
        <input 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search locations..."
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] font-bold text-dge-reliable tracking-tight placeholder:text-gray-400 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        />
      </div>

      <AnimatePresence>
        {showDropdown && filteredLocations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/60 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 rounded-2xl overflow-hidden z-50 flex flex-col py-1"
          >
            {filteredLocations.map((loc, idx) => (
              <button 
                key={idx}
                onClick={() => handleSelect(loc)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/50 transition-colors text-left border-b border-transparent last:border-0"
              >
                <MapPin className="w-4 h-4 text-dge-grey opacity-50" />
                <span className="text-[13px] font-medium text-dge-reliable tracking-tight">{loc.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
