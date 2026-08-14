import React, { useState } from 'react';
import { Sun, User, HelpCircle } from 'lucide-react';
import dgeLogo from '../../assets/dge-logo.png';
import sdiLogo from '../../assets/sdilogo.png';

export default function ExplorerHeader({ onNavigate, currentView }) {
  const [isArabic, setIsArabic] = useState(false);
  return (
    <header className="pointer-events-auto bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-5">
        <img src={dgeLogo} alt="Department of Government Enablement" className="h-10 object-contain drop-shadow-sm cursor-pointer" onClick={() => onNavigate?.('landing')} />
      </div>

      {/* Center: Segmented Control */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onNavigate?.('landing')}
          className={`px-6 py-2 rounded-full text-[15px] font-bold transition-all ${currentView === 'landing' ? 'bg-white text-dge-tech border border-dge-tech/30 shadow-sm' : 'text-dge-reliable hover:text-dge-tech'}`}
        >
          Home
        </button>
        <button 
          onClick={() => onNavigate?.('explorer')}
          className={`px-6 py-2 rounded-full text-[15px] font-bold transition-all ${currentView === 'explorer' ? 'bg-white text-dge-tech border border-dge-tech/30 shadow-sm' : 'text-dge-reliable hover:text-dge-tech'}`}
        >
          Map View
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          {/* Language Toggle Switch */}
          <div 
            onClick={() => setIsArabic(!isArabic)}
            className="flex items-center bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200 cursor-pointer w-20 relative mr-2"
          >
            <div className={`absolute left-1 top-1 w-8 h-8 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isArabic ? 'translate-x-[36px]' : 'translate-x-0'}`}></div>
            <div className={`w-9 h-8 flex items-center justify-center text-[13px] font-bold z-10 transition-colors ${!isArabic ? 'text-dge-reliable' : 'text-slate-500'}`}>EN</div>
            <div className={`w-9 h-8 flex items-center justify-center text-[16px] font-bold font-sans z-10 transition-colors ${isArabic ? 'text-dge-reliable' : 'text-slate-500'}`}>ع</div>
          </div>
          
          <button className="w-10 h-10 flex items-center justify-center text-dge-reliable hover:bg-gray-50 rounded-full transition-all">
            <Sun className="w-5 h-5 fill-dge-reliable" />
          </button>
          <button 
            onClick={() => onNavigate?.('about')}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all"
          >
            <HelpCircle className="w-6 h-6 fill-dge-reliable text-white" />
          </button>
        </div>
        <button className="h-10 px-7 rounded-full bg-[#3D52A0] text-white text-sm font-bold tracking-wide hover:opacity-90 transition-all flex items-center gap-2 shadow-sm transform hover:-translate-y-0.5">
          <User className="w-4 h-4" fill="currentColor" />
          <span>Sign In</span>
        </button>
        <img src={sdiLogo} alt="Abu Dhabi Spatial Data" className="h-9 object-contain ml-2" />
      </div>
    </header>
  );
}
