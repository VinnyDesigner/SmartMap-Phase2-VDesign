import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, MapPin, ExternalLink, Mail, Phone, Bookmark, Activity, Clock, Crosshair } from 'lucide-react';

export default function DetailSlidePanel({ explorerState, setExplorerState }) {
  const detail = explorerState?.selectedDetail;

  const handleClose = () => {
    setExplorerState(prev => ({ ...prev, selectedDetail: null }));
  };

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 bg-white/95 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border-l border-white/60 pointer-events-auto z-40 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-transparent sticky top-0 z-10">
            <button onClick={handleClose} className="flex items-center gap-2 text-dge-grey/70 hover:text-dge-reliable transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium tracking-tight">Back to results</span>
            </button>
            <button onClick={handleClose} className="text-dge-grey/70 hover:text-dge-reliable">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title Block */}
            <div className="flex items-start gap-4">
              <div className="bg-white/40 border border-white/60 rounded-2xl p-4">
                <Activity className="w-6 h-6 text-dge-tech" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dge-reliable tracking-tight leading-tight">{detail.name}</h2>
                <p className="text-dge-grey opacity-80 tracking-tight font-arabic text-sm mt-1" dir="rtl">مستشفى العين</p>
              </div>
            </div>

            {/* Location & Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-dge-grey opacity-80 tracking-tight text-sm">
                <MapPin className="w-4 h-4 opacity-50" />
                <span>{detail.location}</span>
                <span className="ml-auto text-[10px] font-medium bg-black/5 text-dge-grey px-2 py-0.5 rounded tracking-tight">{detail.type}</span>
              </div>
              <div className="flex items-center gap-2 text-dge-tech text-sm hover:underline cursor-pointer tracking-tight">
                <ExternalLink className="w-4 h-4 opacity-80" />
                <span>www.alain_hospitalhealth.ae</span>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-transparent border border-black/5 rounded-xl py-3 flex flex-col items-center justify-center gap-1 hover:bg-black/5 transition-colors group">
                <Mail className="w-5 h-5 text-dge-grey/50 group-hover:text-dge-tech" />
                <span className="text-xs font-medium tracking-tight text-dge-reliable">Email</span>
              </button>
              <button className="flex-1 bg-transparent border border-black/5 rounded-xl py-3 flex flex-col items-center justify-center gap-1 hover:bg-black/5 transition-colors group">
                <Phone className="w-5 h-5 text-dge-grey/50 group-hover:text-dge-tech" />
                <span className="text-xs font-medium tracking-tight text-dge-reliable">Phone</span>
              </button>
            </div>

            <button className="w-full py-3 bg-transparent border border-black/5 rounded-xl text-sm font-medium tracking-tight text-dge-reliable flex items-center justify-center gap-2 hover:bg-black/5 transition-colors shadow-none">
              <Bookmark className="w-4 h-4 text-dge-grey/50" /> Save to Workspace
            </button>

            {/* Details */}
            <div className="pt-6 border-t border-black/5">
              <h3 className="font-bold tracking-tight text-dge-reliable mb-4">Facility Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col text-sm">
                  <span className="text-dge-grey/70 tracking-tight mb-1">Facility Type</span>
                  <span className="font-medium tracking-tight text-dge-reliable capitalize">{detail.type.toLowerCase()}</span>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-dge-grey/70 tracking-tight mb-1">Medical Audit</span>
                  <span className="font-medium tracking-tight text-dge-reliable">AUDIT REPORT • Q3/2024</span>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-dge-grey/70 tracking-tight mb-1">Operating Hours</span>
                  <span className="font-medium tracking-tight text-dge-reliable">24/7 Emergency</span>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-dge-grey/70 tracking-tight mb-1">Lat / Long</span>
                  <span className="font-medium tracking-tight text-dge-reliable">{detail.lat?.toFixed(5)}, {detail.lng?.toFixed(5)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
