import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from 'framer-motion';
import MapBackground from './components/MapBackground';
import CustomCursor from './components/CustomCursor';
import SearchInterface from './components/SearchInterface';
import BrandHeader from './components/BrandHeader';
import DataExplorerLayout from './components/explorer/DataExplorerLayout';
import HoverExplorationPopup from './components/HoverExplorationPopup';
import DynamicBackground from './components/DynamicBackground';
import AboutUsPage from './components/AboutUsPage';
import SignInPage from './components/SignInPage';
import WebGLFluidReveal from './components/WebGLFluidReveal';

function App() {
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  // Smooth springs for trailing background effects
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  
  const orbX = useTransform(smoothMouseX, v => v - 400);
  const orbY = useTransform(smoothMouseY, v => v - 400);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHoveringUI, setIsHoveringUI] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'explorer' | 'about' | 'login'
  const [idlePos, setIdlePos] = useState(null);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };
  
const MOCK_DATA = [
  { id: 1, name: 'Al Ain Hospital', name_ar: 'مستشفى العين', type: 'HOSPITAL', location: 'Al Jimi', location_ar: 'الجيمي', lat: 24.2155, lng: 55.7389 },
  { id: 2, name: 'Cleveland Clinic Abu Dhabi', name_ar: 'كليفلاند كلينك أبوظبي', type: 'HOSPITAL', location: 'Al Maryah Island', location_ar: 'جزيرة الماريه', lat: 24.5011, lng: 54.3942 },
  { id: 3, name: 'Zayed University Campus', name_ar: 'حرم جامعة زايد', type: 'EDUCATION', location: 'Khalifa City', location_ar: 'مدينة خليفة', lat: 24.4136, lng: 54.5683 },
  { id: 4, name: 'Bright Riders School', name_ar: 'مدرسة برايت رايدرز', type: 'EDUCATION', location: 'Mohammed Bin Zayed City', location_ar: 'مدينة محمد بن زايد', lat: 24.3297, lng: 54.5361 },
  { id: 5, name: 'Umm Al Emarat Park', name_ar: 'حديقة أم الإمارات', type: 'PARK', location: 'Al Mushrif', location_ar: 'المشرف', lat: 24.4533, lng: 54.3879 },
  { id: 6, name: 'Abu Dhabi Main Bus Terminal', name_ar: 'محطة حافلات أبوظبي الرئيسية', type: 'TRANSPORT', location: 'Al Nahyan', location_ar: 'آل نهيان', lat: 24.4719, lng: 54.3725 },
  { id: 7, name: 'Corniche Beach Park', name_ar: 'حديقة شاطئ الكورنيش', type: 'PARK', location: 'Corniche Road', location_ar: 'طريق الكورنيش', lat: 24.4721, lng: 54.3213 },
  { id: 8, name: 'NMC Specialty Hospital', name_ar: 'مستشفى إن إم سي التخصصي', type: 'HOSPITAL', location: 'Electra Street', location_ar: 'شارع إلكترا', lat: 24.4891, lng: 54.3644 },
  { id: 9, name: 'Abu Dhabi International Airport', name_ar: 'مطار أبوظبي الدولي', type: 'TRANSPORT', location: 'Airport Road', location_ar: 'شارع المطار', lat: 24.4329, lng: 54.6511 },
  { id: 10, name: 'Sorbonne University Abu Dhabi', name_ar: 'جامعة السوربون أبوظبي', type: 'EDUCATION', location: 'Al Reem Island', location_ar: 'جزيرة الريم', lat: 24.5028, lng: 54.4056 }
];

  const [explorerState, setExplorerState] = useState({
    mapFocus: null, // { lat, lng, zoom }
    activeResults: MOCK_DATA,
    selectedDetail: null,
    basemap: 'osm',
    isDrawingMode: false,
    isDockerMinimized: true,
    chatHistory: [],
    layerFilters: ['Education', 'Healthcare', 'Transport', 'Environment', 'Tourism', 'Utilities'],
    typeFilter: 'All Types'
  });

  const idleTimer = useRef(null);
  const hideTimer = useRef(null);
  const activeIdlePos = useRef(null);

  useEffect(() => {
    // Initial position to center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e) => {
      // Handle both touch and mouse events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      mouseX.set(clientX);
      mouseY.set(clientY);
      
      const isOverPopup = e.target.closest && e.target.closest('.idle-popup');
      
      // If popup is currently showing
      if (activeIdlePos.current) {
        if (isOverPopup) {
          // They reached the popup! Cancel any hide timer.
          if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
          }
        } else {
          // They are moving outside the popup. Start a grace period to hide it.
          if (!hideTimer.current) {
            hideTimer.current = setTimeout(() => {
              setIdlePos(null);
              activeIdlePos.current = null;
              hideTimer.current = null;
            }, 300); // Reduced to 300ms for more responsive hiding
          }
        }
      } else {
        // Popup is NOT showing.
        // Clear any existing idle timer because they moved.
        if (idleTimer.current) {
          clearTimeout(idleTimer.current);
        }
        
        if (currentView === 'landing' && !isSearchFocused && !selectedLocation) {
          const isInteractive = e.target.closest && e.target.closest('a, button, input, header, .glass-panel');
          if (!isInteractive) {
             idleTimer.current = setTimeout(() => {
                const pos = { x: clientX, y: clientY };
                setIdlePos(pos);
                activeIdlePos.current = pos;
             }, 4000); // Wait 4 seconds before showing hover popup
          }
        }
      }
    };

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest && e.target.closest('a, button, input, header, .search-ui');
      setIsHoveringUI(!!isInteractive);
    };

    const handleClick = (e) => {
      if (activeIdlePos.current) {
        const isOverPopup = e.target.closest && e.target.closest('.idle-popup');
        if (!isOverPopup) {
          setIdlePos(null);
          activeIdlePos.current = null;
          if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { capture: true });
    window.addEventListener("touchmove", handleMouseMove, { capture: true, passive: false });
    window.addEventListener("touchstart", handleMouseMove, { capture: true, passive: false });
    window.addEventListener("mouseover", handleMouseOver, { capture: true });
    window.addEventListener("click", handleClick, { capture: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove, { capture: true });
      window.removeEventListener("touchmove", handleMouseMove, { capture: true });
      window.removeEventListener("touchstart", handleMouseMove, { capture: true });
      window.removeEventListener("mouseover", handleMouseOver, { capture: true });
      window.removeEventListener("click", handleClick, { capture: true });
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [mouseX, mouseY, currentView, isSearchFocused, selectedLocation]);

  if (currentView === 'login') {
    return <SignInPage onNavigate={handleNavigate} />;
  }

  return (
    <div className={`h-screen w-full font-sans flex flex-col overflow-hidden relative bg-[#F8FAFC] transition-colors duration-300 ${currentView === 'landing' ? 'custom-cursor-active' : ''}`}>
      <BrandHeader onNavigate={handleNavigate} currentView={currentView} />
      
      {currentView === 'explorer' && (
        <MapBackground 
          mouseX={mouseX} 
          mouseY={mouseY} 
          isSearchFocused={isSearchFocused} 
          onMapClick={() => {}}
          selectedLocation={selectedLocation}
          isExplorer={true}
          explorerState={explorerState}
          setExplorerState={setExplorerState}
        />
      )}
      
      {currentView === 'landing' && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <WebGLFluidReveal mouseX={smoothMouseX} mouseY={smoothMouseY} />
        </div>
      )}
      
      {/* Ambient Drifting Orbs */}
      {currentView === 'landing' && (
        <>
          <motion.div 
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(33, 90, 158, 0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}
            animate={{ x: [0, 150, -100, 0], y: [0, -100, 150, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none z-0 right-[10%] bottom-[10%]"
            style={{ background: 'radial-gradient(circle, rgba(67, 112, 240, 0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
            animate={{ x: [0, -150, 100, 0], y: [0, 100, -150, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}
      
      {/* WebGL-like Volumetric Cursor Glow - hide in explorer view to avoid noise */}
      {currentView === 'landing' && (
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-10"
          style={{
            x: orbX,
            y: orbY,
            background: 'radial-gradient(circle, rgba(33, 90, 158, 0.2) 0%, rgba(67, 112, 240, 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
            opacity: isSearchFocused ? 0.3 : 1,
            transition: 'opacity 0.7s ease'
          }}
        />
      )}
      
      {currentView === 'landing' ? (
        <>
          <SearchInterface 
            isFocused={isSearchFocused}
            setIsFocused={setIsSearchFocused}
            onSearch={(query) => {
              setCurrentView('explorer');
              setSelectedLocation(null);
              if (query && query.trim() !== '') {
                setExplorerState(prev => ({
                  ...prev,
                  aiPanelState: 'expanded',
                  pendingQuery: query
                }));
              }
            }}
          />
        </>
      ) : currentView === 'explorer' ? (
        <DataExplorerLayout 
          onNavigate={handleNavigate} 
          explorerState={explorerState}
          setExplorerState={setExplorerState}
        />
      ) : (
        <AboutUsPage onNavigate={handleNavigate} />
      )}
      
      {/* Hover Exploration Popup temporarily disabled as per request */}
      {/* 
      {currentView === 'landing' && idlePos && (
        (() => { ... })()
      )} 
      */}
      
      {/* Hide custom cursor in explorer view so standard interactions work normally */}
      {currentView === 'landing' && (
        <div className="hidden lg:block">
          <CustomCursor 
            mouseX={mouseX} 
            mouseY={mouseY}
            isSearchFocused={isSearchFocused || !!selectedLocation}
            isHoveringSearch={isHoveringUI}
          />
        </div>
      )}
    </div>
  );
}

export default App;
