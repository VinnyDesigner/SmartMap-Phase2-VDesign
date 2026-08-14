import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import ExplorerHeader from './ExplorerHeader';
import MapControlsSidebar from './MapControlsSidebar';
import BottomDataPanel from './BottomDataPanel';
import LocationSearch from './LocationSearch';

export default function DataExplorerLayout({ onNavigate, explorerState, setExplorerState }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-20 pointer-events-none flex flex-col"
    >
      <ExplorerHeader onNavigate={onNavigate} currentView="explorer" />
      
      <div className="flex-1 relative w-full h-full">
        {/* Top Left Search Bar */}
        <div className="absolute top-6 left-8 z-40 pointer-events-auto">
          <LocationSearch 
            explorerState={explorerState}
            setExplorerState={setExplorerState}
          />
        </div>

        <MapControlsSidebar 
          explorerState={explorerState}
          setExplorerState={setExplorerState}
        />
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-30">
          <BottomDataPanel 
            explorerState={explorerState}
            setExplorerState={setExplorerState}
          />
        </div>
      </div>
    </motion.div>
  );
}
