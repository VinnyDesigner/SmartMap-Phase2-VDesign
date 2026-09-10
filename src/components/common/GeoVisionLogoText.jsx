import React from 'react';
import { motion } from 'framer-motion';
import GeoLogoIcon from './GeoLogoIcon';
import { useTheme } from '../../contexts/ThemeContext';

export default function GeoVisionLogoText({ 
  sizeClass = "text-6xl md:text-[5.5rem]", 
  iconSize = "0.68em",
  isDarkModeOverride,
  className = "" 
}) {
  const { isDarkMode: themeDarkMode } = useTheme();
  const isDarkMode = isDarkModeOverride !== undefined ? isDarkModeOverride : themeDarkMode;

  return (
    <div className={`inline-flex items-center justify-center select-none font-black tracking-tighter leading-none ${sizeClass} ${className}`} dir="ltr">
      {/* "Ge" */}
      <span className={`bg-clip-text text-transparent ${
        isDarkMode 
          ? 'bg-gradient-to-r from-white via-slate-100 to-[#00e5ff] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]' 
          : 'bg-gradient-to-r from-[#1e2749] to-[#215A9E]'
      }`}>
        Ge
      </span>

      {/* Static container matching x-height of 'e' with pure SVG animation */}
      <span 
        className="inline-flex items-center justify-center mx-[0.03em] relative top-[0.01em] shrink-0 overflow-visible"
        style={{ 
          width: iconSize, 
          height: iconSize,
          filter: isDarkMode 
            ? 'drop-shadow(0 0 10px rgba(0,229,255,0.7))' 
            : 'drop-shadow(0 0 8px rgba(33,90,158,0.5))'
        }}
      >
        <GeoLogoIcon className="w-full h-full" color={isDarkMode ? '#00e5ff' : '#215A9E'} animated={true} />
      </span>

      {/* "Vision" */}
      <span className={`bg-clip-text text-transparent ${
        isDarkMode 
          ? 'bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#c084fc] drop-shadow-[0_0_22px_rgba(168,85,247,0.5)]' 
          : 'bg-gradient-to-r from-[#3D52A0] to-[#7c3aed]'
      }`}>
        Vision
      </span>
    </div>
  );
}
