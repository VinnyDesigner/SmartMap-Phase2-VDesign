import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, PlusSquare, TreePine, Bus, MapPin, Navigation2, Map as MapIcon, Bookmark, ChevronDown } from 'lucide-react';

export default function AttractionsPanel({ selectedLocation, onClose, onCategorySelect }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    {
      id: 'transport',
      categoryLabel: 'TRANSPORT',
      name: 'Transport',
      icon: <Bus className="w-6 h-6 text-amber-500" />,
      attraction: 'Abu Dhabi Main Bus Terminal',
      details: 'Central transportation hub connecting all major districts and intercity routes.',
      bg: 'bg-amber-50',
      textColor: 'text-amber-500'
    },
    {
      id: 'parks',
      categoryLabel: 'PUBLIC PARKS',
      name: 'Parks',
      icon: <TreePine className="w-6 h-6 text-emerald-500" />,
      attraction: 'Umm Al Emarat Park',
      details: 'One of the oldest and largest parks with botanical gardens and an amphitheater.',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-500'
    },
    {
      id: 'health',
      categoryLabel: 'HEALTHCARE',
      name: 'Healthcare',
      icon: <PlusSquare className="w-6 h-6 text-red-500" />,
      attraction: 'Cleveland Clinic Abu Dhabi',
      details: 'Multispecialty hospital offering complex and critical care.',
      bg: 'bg-red-50',
      textColor: 'text-red-500'
    },
    {
      id: 'education',
      categoryLabel: 'EDUCATION',
      name: 'Education',
      icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
      attraction: 'Zayed University Campus',
      details: 'Leading university offering diverse programs and research opportunities.',
      bg: 'bg-blue-50',
      textColor: 'text-blue-500'
    }
  ];

  const locationName = useMemo(() => {
    if (!selectedLocation) return 'Local';
    const { lat, lng } = selectedLocation;
    if (lng < 54.4) return 'Al Maryah Island';
    if (lat > 24.45) return 'Al Reem Island';
    return 'Khalifa City';
  }, [selectedLocation]);

  // Helper for hash
  const hashA = (str, seed) => {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000;
    }
    return hash;
  };

  const displayItems = useMemo(() => {
    if (!selectedLocation) return categories;
    const seed = Math.floor((selectedLocation.lat + selectedLocation.lng) * 10000);
    const sorted = [...categories].sort((a, b) => {
      const hA = (a.id.charCodeAt(0) * seed) % 100;
      const hB = (b.id.charCodeAt(0) * seed) % 100;
      return hA - hB;
    });
    
    // Add realistic distance
    return sorted.map((item) => ({
      ...item,
      distance: ((hashA(item.id, seed) % 40) / 10 + 0.5).toFixed(1) // 0.5 to 4.5 km
    }));
  }, [selectedLocation]);

  const filteredItems = displayItems.filter(item => activeFilter === 'all' || item.id === activeFilter);

  const FilterButton = ({ id, label, icon: Icon, colorClass }) => (
    <button 
      onClick={() => setActiveFilter(id)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border shrink-0 ${
        activeFilter === id 
        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-[0_2px_10px_rgba(59,130,246,0.1)]' 
        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
      }`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${activeFilter === id ? '' : colorClass}`} />}
      {label}
    </button>
  );

  return (
    <AnimatePresence>
      {selectedLocation && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 pointer-events-auto"
            onClick={onClose}
          />

          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-4 top-4 bottom-4 w-[400px] bg-[#f8fafc] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] z-50 flex flex-col pointer-events-auto border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 bg-white border-b border-slate-100">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-[22px] font-black tracking-tight text-[#1e293b]">{locationName} Highlights</h2>
                <div className="flex items-center text-sm text-slate-500 font-medium mt-0.5">
                  <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                  <span>{selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
                </div>
                <p className="text-[12px] text-slate-500 mt-2.5 leading-relaxed max-w-[95%]">
                  Discover the major facilities and attractions surrounding the selected area.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-4 flex flex-wrap items-center gap-2 bg-white/50">
              <FilterButton id="all" label="All" />
              <FilterButton id="transport" label="Transport" icon={Bus} colorClass="text-amber-500" />
              <FilterButton id="parks" label="Parks" icon={TreePine} colorClass="text-emerald-500" />
              <FilterButton id="health" label="Health" icon={PlusSquare} colorClass="text-red-500" />
              <FilterButton id="education" label="Education" icon={GraduationCap} colorClass="text-blue-500" />
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 space-y-4 sleek-scrollbar bg-[#f8fafc]">
              {filteredItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:border-blue-200 flex flex-col gap-3 group"
                >
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${item.textColor}`}>
                          {item.categoryLabel}
                        </span>
                        <div className="flex items-center text-blue-700 font-bold text-[11px] gap-0.5">
                          {item.distance} km <Navigation2 className="w-3 h-3 rotate-45 stroke-[3]" />
                        </div>
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-800 leading-tight mb-1.5 group-hover:text-blue-700 transition-colors">
                        {item.attraction}
                      </h4>
                      <p className="text-[12px] text-slate-500 leading-snug line-clamp-2">
                        {item.details}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => onCategorySelect && onCategorySelect(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#3D52A0] hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                      >
                        <Navigation2 className="w-3.5 h-3.5" /> Directions
                      </button>
                      <button 
                        onClick={() => onCategorySelect && onCategorySelect(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#3D52A0] hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                      >
                        <MapIcon className="w-3.5 h-3.5" /> View on map
                      </button>
                    </div>
                    <button className="w-8 h-8 rounded-full text-slate-300 hover:text-[#3D52A0] hover:bg-blue-50 flex items-center justify-center transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <MapPin className="w-8 h-8 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No highlights found in this category.</p>
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="p-5 bg-white border-t border-slate-100 flex justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-10">
              <button 
                onClick={() => onCategorySelect && onCategorySelect('all')}
                className="flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-[#3D52A0] transition-colors"
              >
                View more places <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
