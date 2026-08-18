import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import MapControlsSidebar from './MapControlsSidebar';
import BottomDataPanel from './BottomDataPanel';

export default function DataExplorerLayout({ onNavigate, explorerState, setExplorerState }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-20 pointer-events-none flex flex-col pt-24"
    >
      <div className="flex-1 relative w-full h-full">
        <MapControlsSidebar 
          explorerState={explorerState}
          setExplorerState={setExplorerState}
        />
        <div className="absolute inset-0 pointer-events-none z-30 flex">
          <BottomDataPanel 
            explorerState={explorerState}
            setExplorerState={setExplorerState}
          />
        </div>
      </div>
    </motion.div>
  );
}
