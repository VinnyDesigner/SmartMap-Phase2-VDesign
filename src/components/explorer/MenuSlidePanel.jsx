import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Bookmark, History, MessageSquare } from 'lucide-react';

export default function MenuSlidePanel({ explorerState, setExplorerState }) {
  const menuType = explorerState?.activeMenu; // 'history' | 'saved' | null
  const handleClose = () => setExplorerState(prev => ({ ...prev, activeMenu: null }));

  return (
    <AnimatePresence>
      {menuType && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] border-l border-slate-100 pointer-events-auto z-50 overflow-hidden flex flex-col"
        >
           {/* Header */}
           <div className="flex items-center justify-between px-6 py-5 bg-white sticky top-0 z-10">
             <button onClick={handleClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
               <ArrowLeft className="w-4 h-4" />
               <span className="text-sm font-medium tracking-tight">Back</span>
             </button>
             <h2 className="font-bold text-[#1e293b] tracking-tight text-lg">
                {menuType === 'history' ? 'Chat History' : 'Saved Locations'}
             </h2>
             <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 transition-colors">
               <X className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto px-6 py-4 sleek-scrollbar space-y-4">
              {menuType === 'history' ? (
                 explorerState.chatHistory?.length > 0 ? (
                     explorerState.chatHistory.map((msg, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${msg.sender === 'user' ? 'bg-[#3D52A0] border-[#3D52A0] ml-8 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-[#1e293b] mr-8 shadow-sm'}`}>
                           <div className="flex items-center gap-2 mb-2 opacity-80">
                               <MessageSquare className="w-4 h-4" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">{msg.sender === 'user' ? 'You' : 'GeoVision AI'}</span>
                           </div>
                           <p className="text-sm font-medium tracking-tight leading-relaxed">{msg.text}</p>
                        </div>
                     ))
                 ) : (
                     <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <History className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium tracking-tight">No history yet.</p>
                     </div>
                 )
              ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Bookmark className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-medium tracking-tight">No saved locations yet.</p>
                 </div>
              )}
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
