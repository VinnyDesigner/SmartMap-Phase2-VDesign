import React, { useState } from 'react';
import { Sun, User, HelpCircle } from 'lucide-react';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';

export default function BrandHeader({ onNavigate, currentView }) {
  const [isArabic, setIsArabic] = useState(false);
  return (
    <>
      {/* Top Brand Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-50 bg-gradient-to-r from-dge-light via-dge-tech to-dge-reliable" />

      <header className="absolute top-0 left-0 right-0 z-40 px-8 py-6 mt-1 flex items-center justify-between pointer-events-none">
      {/* Logos */}
      <div className="flex items-center pointer-events-auto gap-5">
        <img src={dgeLogo} alt="Department of Government Enablement" className="h-12 object-contain drop-shadow-sm" />
      </div>

      {/* Navigation */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 p-[1px] rounded-full overflow-hidden shadow-[0_4px_20px_rgba(33,90,158,0.08)] pointer-events-auto group">
        {/* Animated Shiny Stroke Layer - forced square for perfectly smooth rotation */}
        <div className="absolute aspect-square w-[300%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] z-0 opacity-60"
             style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(61, 82, 160, 0.5) 60%, #00e5ff 85%, transparent 100%)' }} 
        />
        <nav className="relative z-10 flex items-center bg-white/90 backdrop-blur-xl p-1.5 rounded-full w-full h-full">
          {['Home', 'Map View'].map((item) => {
            const isActive = (item === 'Home' && currentView === 'landing') || (item === 'Map View' && currentView === 'explorer');
            return (
              <button 
                key={item} 
                onClick={() => {
                  if (item === 'Home') onNavigate?.('landing');
                  else if (item === 'Map View') onNavigate?.('explorer');
                }}
                className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? 'bg-white text-[#3D52A0] shadow-sm' : 'text-slate-600 hover:text-[#3D52A0] hover:bg-white/50'}`}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Actions & Right Logo */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <img src={sdiLogo} alt="Abu Dhabi Spatial Data" className="h-10 object-contain drop-shadow-sm hidden md:block opacity-90 hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4">
          {/* Language Toggle Switch */}
          <div 
            onClick={() => setIsArabic(!isArabic)}
            className="flex items-center bg-white/50 backdrop-blur-md p-1 rounded-full shadow-inner border border-white/40 cursor-pointer w-20 relative"
          >
            <div className={`absolute left-1 top-1 w-8 h-8 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isArabic ? 'translate-x-[36px]' : 'translate-x-0'}`}></div>
            <div className={`w-9 h-8 flex items-center justify-center text-[13px] font-bold z-10 transition-colors ${!isArabic ? 'text-dge-reliable' : 'text-slate-500'}`}>EN</div>
            <div className={`w-9 h-8 flex items-center justify-center text-[16px] font-bold font-sans z-10 transition-colors ${isArabic ? 'text-dge-reliable' : 'text-slate-500'}`}>ع</div>
          </div>
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-dge-reliable bg-white/70 backdrop-blur-md border border-white/60 hover:bg-white hover:shadow-sm transition-all shadow-sm">
            <Sun className="w-[18px] h-[18px] fill-dge-reliable" />
          </button>
          
          <button 
            onClick={() => onNavigate?.('about')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/70 backdrop-blur-md border border-white/60 hover:bg-white hover:shadow-sm transition-all shadow-sm"
          >
            <HelpCircle className="w-[20px] h-[20px] fill-dge-reliable text-white" />
          </button>
          
          <button 
            onClick={() => onNavigate?.('login')}
            className="h-11 px-7 rounded-full bg-gradient-to-r from-dge-tech to-dge-reliable border-none shadow-[0_4px_16px_rgba(6,51,96,0.25)] flex items-center gap-2 text-white hover:shadow-[0_6px_20px_rgba(6,51,96,0.35)] transition-all transform hover:-translate-y-0.5"
          >
            <User className="w-4 h-4" fill="currentColor" />
            <span className="text-sm font-bold tracking-wide">Sign In</span>
          </button>
        </div>
      </div>
    </header>
    </>
  );
}
