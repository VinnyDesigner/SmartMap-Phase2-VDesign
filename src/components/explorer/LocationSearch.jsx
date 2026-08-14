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
    <div ref={wrapperRef} className="relative group">
      <div className="flex items-center gap-3 bg-white h-14 rounded-[28px] shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-dge-tech/20 transition-all duration-300 w-14 hover:w-72 focus-within:w-72 overflow-hidden px-[18px] cursor-pointer">
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
