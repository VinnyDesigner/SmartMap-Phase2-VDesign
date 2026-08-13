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
          className="absolute inset-0 bg-white/40 backdrop-blur-3xl shadow-none border-t border-white/60 pointer-events-auto z-50 overflow-hidden flex flex-col"
        >
           {/* Header */}
           <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-transparent sticky top-0 z-10">
             <button onClick={handleClose} className="flex items-center gap-2 text-dge-grey/70 hover:text-dge-reliable transition-colors">
               <ArrowLeft className="w-4 h-4" />
               <span className="text-sm font-medium tracking-tight">Back</span>
             </button>
             <h2 className="font-bold text-dge-reliable tracking-tight text-lg">
                {menuType === 'history' ? 'Chat History' : 'Saved Locations'}
             </h2>
             <button onClick={handleClose} className="text-dge-grey/70 hover:text-dge-reliable">
               <X className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto px-6 py-4 sleek-scrollbar space-y-4">
              {menuType === 'history' ? (
                 explorerState.chatHistory?.length > 0 ? (
                     explorerState.chatHistory.map((msg, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${msg.sender === 'user' ? 'bg-slate-800/80 border-white/10 ml-8 text-white' : 'bg-white/40 border-white/60 text-dge-reliable mr-8'}`}>
                           <div className="flex items-center gap-2 mb-2 opacity-60">
                               <MessageSquare className="w-4 h-4" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">{msg.sender === 'user' ? 'You' : 'GeoVision AI'}</span>
                           </div>
                           <p className="text-sm font-medium tracking-tight">{msg.text}</p>
                        </div>
                     ))
                 ) : (
                     <div className="flex flex-col items-center justify-center h-full text-dge-grey opacity-50">
                        <History className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium tracking-tight">No history yet.</p>
                     </div>
                 )
              ) : (
                 <div className="flex flex-col items-center justify-center h-full text-dge-grey opacity-50">
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
