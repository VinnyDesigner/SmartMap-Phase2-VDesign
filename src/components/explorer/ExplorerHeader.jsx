import React from 'react';
import { Sun, User, HelpCircle } from 'lucide-react';
import dgeLogo from '../../assets/dge-logo.png';
import sdiLogo from '../../assets/sdilogo.png';

export default function ExplorerHeader({ onNavigate, currentView }) {
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
        <button 
          onClick={() => onNavigate?.('about')}
          className={`px-6 py-2 rounded-full text-[15px] font-bold transition-all ${currentView === 'about' ? 'bg-white text-dge-tech border border-dge-tech/30 shadow-sm' : 'text-dge-reliable hover:text-dge-tech'}`}
        >
          About Us
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center text-dge-reliable hover:bg-gray-50 rounded-full transition-all">
            <span className="font-bold font-sans text-lg">ع</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-dge-reliable hover:bg-gray-50 rounded-full transition-all">
            <Sun className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-dge-reliable hover:bg-gray-50 rounded-full transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <button className="h-10 px-7 rounded-full bg-[#3D52A0] text-white text-sm font-bold tracking-wide hover:opacity-90 transition-all flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Sign In</span>
        </button>
        <img src={sdiLogo} alt="Abu Dhabi Spatial Data" className="h-9 object-contain ml-2" />
      </div>
    </header>
  );
}
