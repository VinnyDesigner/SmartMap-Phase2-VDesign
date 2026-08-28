import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Bookmark, History, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function MenuSlidePanel({ explorerState, setExplorerState }) {
  const menuType = explorerState?.activeMenu; // 'history' | 'saved' | null
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const handleClose = () => setExplorerState(prev => ({ ...prev, activeMenu: null }));

  return (
    <AnimatePresence>
      {menuType && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`absolute inset-0 border-s pointer-events-auto z-50 overflow-hidden flex flex-col transition-colors duration-300 ${
            isDarkMode ? 'bg-[#060a12] border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-800'
          }`}
        >
           {/* Header */}
           <div className={`flex items-center justify-between px-6 py-5 sticky top-0 z-10 border-b transition-colors ${
             isDarkMode ? 'bg-[#0a0f1d] border-slate-800' : 'bg-white border-slate-100'
           }`}>
             <button onClick={handleClose} className={`flex items-center gap-2 transition-colors ${
               isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-800'
             }`}>
               <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
               <span className="text-sm font-medium tracking-tight">{t('Back', 'رجوع')}</span>
             </button>
             <h2 className={`font-bold tracking-tight text-lg ${isDarkMode ? 'text-white' : 'text-[#1e293b]'}`}>
                {menuType === 'history' ? t('Chat History', 'سجل الدردشة') : t('Saved Locations', 'المواقع المحفوظة')}
             </h2>
             <button onClick={handleClose} className={`transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'}`}>
               <X className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto px-6 py-4 sleek-scrollbar space-y-4">
              {menuType === 'history' ? (
                 explorerState.chatHistory?.length > 0 ? (
                     explorerState.chatHistory.map((msg, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${
                          msg.sender === 'user' || msg.role === 'user'
                            ? (isDarkMode ? 'bg-[#1e293b] border-slate-700/80 text-white ms-8' : 'bg-[#f4f7fb] border-[#e2e8f0] ms-8 text-[#333333]')
                            : (isDarkMode ? 'bg-[#0d1424] border-slate-800 text-slate-100 me-8' : 'bg-white border-gray-200 text-[#333333] me-8')
                        }`}>
                           <div className="flex items-center gap-2 mb-2 opacity-60">
                               <MessageSquare className="w-4 h-4" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">{msg.sender === 'user' || msg.role === 'user' ? t('You', 'أنت') : 'GeoVision AI'}</span>
                           </div>
                           <p className="text-sm font-medium tracking-tight leading-relaxed">{msg.text || msg.content}</p>
                        </div>
                     ))
                 ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <History className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm font-medium">{t('No chat history yet', 'لا يوجد سجل محادثات بعد')}</p>
                    </div>
                 )
              ) : (
                explorerState.savedLocations?.length > 0 ? (
                    explorerState.savedLocations.map((item, i) => (
                       <div 
                        key={i} 
                        onClick={() => {
                          setExplorerState(prev => ({ ...prev, selectedDetail: item, activeMenu: null }));
                        }}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isDarkMode 
                            ? 'bg-[#0d1527] border-slate-800 text-slate-100 hover:border-slate-700' 
                            : 'bg-white border-gray-200 text-[#333333] hover:border-[#3D52A0]/40'
                        }`}
                       >
                          <div>
                             <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>{item.name}</h4>
                             <p className="text-xs text-slate-400 mt-1">{item.location || item.district}</p>
                          </div>
                          <Bookmark className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-[#3D52A0]'}`} />
                       </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Bookmark className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm font-medium">{t('No saved items', 'لا توجد عناصر محفوظة')}</p>
                    </div>
                )
              )}
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
