import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, GraduationCap, PlusSquare, TreePine, Bus, ChevronRight, Bookmark, X, Filter, Navigation, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ResultsListDrawer({ explorerState, setExplorerState }) {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { t, isArabic } = useLanguage();

  const isOpen = explorerState?.activeMenu === 'results';

  const handleClose = () => {
    setExplorerState(prev => ({ ...prev, activeMenu: null }));
  };

  const results = explorerState?.activeResults || [];

  // Filter results by search keyword and category tab
  const filteredResults = results.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.type === selectedCategory;
    const nameStr = (item.name || '').toLowerCase();
    const nameArStr = (item.name_ar || '').toLowerCase();
    const locStr = (item.location || '').toLowerCase();
    const query = searchFilter.toLowerCase().trim();

    const matchesSearch = !query || nameStr.includes(query) || nameArStr.includes(query) || locStr.includes(query);
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'EDUCATION': return GraduationCap;
      case 'HOSPITAL': return PlusSquare;
      case 'PARK': return TreePine;
      case 'TRANSPORT': return Bus;
      default: return MapPin;
    }
  };

  const categories = [
    { id: 'ALL', label: t('All', 'الكل') },
    { id: 'HOSPITAL', label: t('Healthcare', 'رعاية صحية') },
    { id: 'EDUCATION', label: t('Education', 'تعليم') },
    { id: 'PARK', label: t('Parks', 'حدائق') },
    { id: 'TRANSPORT', label: t('Transport', 'نقل') }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="absolute inset-0 bg-white/95 backdrop-blur-2xl border-s border-slate-200/80 shadow-2xl z-50 pointer-events-auto flex flex-col overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#eef3ff] text-[#3D52A0] flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#1e2749] text-sm leading-tight">
                  {t('Search & Active Results', 'نتائج البحث والمواقع')}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {filteredResults.length} {t('facilities active', 'منشأة مفعالة')}
                </p>
              </div>
            </div>

            <button 
              onClick={handleClose}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={t('Filter active results...', 'تصفية النتائج النشطة...')}
                className="w-full bg-white border border-slate-200/80 rounded-xl ps-9 pe-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3D52A0]/30 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto sleek-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-[#3D52A0] text-white shadow-xs' 
                      : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Scroll List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 sleek-scrollbar">
            {filteredResults.length > 0 ? (
              filteredResults.map((item) => {
                const Icon = getCategoryIcon(item.type);
                const itemName = isArabic && item.name_ar ? item.name_ar : item.name;
                const itemLoc = isArabic && item.location_ar ? item.location_ar : item.location;

                return (
                  <div
                    key={item.id}
                    onClick={() => setExplorerState(prev => ({
                      ...prev,
                      selectedLocation: item,
                      activeSlidePanel: 'detail',
                      mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 }
                    }))}
                    className="bg-white border border-slate-200/80 hover:border-[#3D52A0]/40 rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2 relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#eef3ff] text-[#3D52A0] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-[#1e2749] text-xs leading-tight truncate">
                            {itemName}
                          </h4>
                          {item.riskLevel && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.riskLevel === 'Critical' || item.riskLevel === 'High'
                                ? 'bg-rose-100 text-rose-700'
                                : item.riskLevel === 'Moderate'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {item.riskLevel}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {itemLoc}
                        </p>

                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                          {item.rating && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                              ⭐ {item.rating}
                            </span>
                          )}
                          {item.waterConsumption && (
                            <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              💧 {item.waterConsumption.toLocaleString()} m³/d
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-[#3D52A0] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {t('Zoom to location', 'التركيز على الخريطة')}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                <Search className="w-8 h-8 opacity-30" />
                <p className="text-xs font-medium">{t('No matching facilities found', 'لم يتم العثور على مواقع مطابقة')}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
