import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from 'framer-motion';
import MapBackground from './components/MapBackground';
import CustomCursor from './components/CustomCursor';
import SearchInterface from './components/SearchInterface';
import BrandHeader from './components/BrandHeader';
import AttractionsPanel from './components/AttractionsPanel';
import DataExplorerLayout from './components/explorer/DataExplorerLayout';
import HoverExplorationPopup from './components/HoverExplorationPopup';
import DynamicBackground from './components/DynamicBackground';
import AboutUsPage from './components/AboutUsPage';
import SignInPage from './components/SignInPage';

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
  { id: 1, name: 'Al Ain Hospital', type: 'HOSPITAL', location: 'Al Jimi', lat: 24.2155, lng: 55.7389 },
  { id: 2, name: 'Cleveland Clinic Abu Dhabi', type: 'HOSPITAL', location: 'Al Maryah Island', lat: 24.5011, lng: 54.3942 },
  { id: 3, name: 'Zayed University Campus', type: 'EDUCATION', location: 'Khalifa City', lat: 24.4136, lng: 54.5683 },
  { id: 4, name: 'Bright Riders School', type: 'EDUCATION', location: 'Mohammed Bin Zayed City', lat: 24.3297, lng: 54.5361 },
  { id: 5, name: 'Umm Al Emarat Park', type: 'PARK', location: 'Al Mushrif', lat: 24.4533, lng: 54.3879 },
  { id: 6, name: 'Abu Dhabi Main Bus Terminal', type: 'TRANSPORT', location: 'Al Nahyan', lat: 24.4719, lng: 54.3725 },
  { id: 7, name: 'Corniche Beach Park', type: 'PARK', location: 'Corniche Road', lat: 24.4721, lng: 54.3213 },
  { id: 8, name: 'NMC Specialty Hospital', type: 'HOSPITAL', location: 'Electra Street', lat: 24.4891, lng: 54.3644 },
  { id: 9, name: 'Abu Dhabi International Airport', type: 'TRANSPORT', location: 'Airport Road', lat: 24.4329, lng: 54.6511 },
  { id: 10, name: 'Sorbonne University Abu Dhabi', type: 'EDUCATION', location: 'Al Reem Island', lat: 24.5028, lng: 54.4056 }
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
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
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
                const pos = { x: e.clientX, y: e.clientY };
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
    window.addEventListener("mouseover", handleMouseOver, { capture: true });
    window.addEventListener("click", handleClick, { capture: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove, { capture: true });
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
    <div className={`h-screen w-full font-sans flex flex-col overflow-hidden relative bg-[#F8FAFC] ${currentView === 'landing' ? 'custom-cursor-active' : ''}`}>
      <BrandHeader onNavigate={handleNavigate} currentView={currentView} />
      
      <MapBackground 
        mouseX={mouseX} 
        mouseY={mouseY} 
        isSearchFocused={isSearchFocused} 
        onMapClick={(latlng) => currentView === 'landing' && setSelectedLocation(latlng)}
        selectedLocation={selectedLocation}
        isExplorer={currentView === 'explorer'}
        explorerState={explorerState}
        setExplorerState={setExplorerState}
      />
      
      {/* Ambient Drifting Orbs */}
      {currentView === 'landing' && (
        <>
          <motion.div 
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(33, 90, 158, 0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}
            animate={{ x: [0, 150, -100, 0], y: [0, -100, 150, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0 right-[10%] bottom-[10%]"
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
            onSearch={() => {
              setCurrentView('explorer');
              setSelectedLocation(null);
            }}
          />
          <AttractionsPanel 
            selectedLocation={selectedLocation}
            onClose={() => setSelectedLocation(null)}
            onCategorySelect={(category) => {
              let newResults = [];
              if (category === 'education') {
                newResults = [
                  { id: 3, name: 'Zayed University Campus', type: 'EDUCATION', location: 'Khalifa City', lat: 24.4136, lng: 54.5683 },
                  { id: 4, name: 'Bright Riders School', type: 'EDUCATION', location: 'Mohammed Bin Zayed City', lat: 24.3297, lng: 54.5361 }
                ];
              } else if (category === 'parks') {
                newResults = [
                  { id: 5, name: 'Umm Al Emarat Park', type: 'PARK', location: 'Al Mushrif', lat: 24.4533, lng: 54.3879 }
                ];
              } else if (category === 'transport') {
                newResults = [
                  { id: 6, name: 'Abu Dhabi Main Bus Terminal', type: 'TRANSPORT', location: 'Al Nahyan', lat: 24.4719, lng: 54.3725 }
                ];
              } else {
                newResults = [
                  { id: 1, name: 'Al Ain Hospital', type: 'HOSPITAL', location: 'Al Jimi', lat: 24.2155, lng: 55.7389 },
                  { id: 2, name: 'Cleveland Clinic Abu Dhabi', type: 'HOSPITAL', location: 'Al Maryah Island', lat: 24.5011, lng: 54.3942 }
                ];
              }
              
              setExplorerState(prev => ({
                ...prev,
                activeResults: MOCK_DATA,
                layerFilters: category === 'education' ? ['Education'] : 
                              category === 'parks' ? ['Environment'] : 
                              category === 'transport' ? ['Transport'] : 
                              ['Education', 'Healthcare', 'Transport', 'Environment', 'Tourism', 'Utilities'],
                mapFocus: newResults.length > 0 ? { lat: newResults[0].lat, lng: newResults[0].lng, zoom: 12 } : null,
                selectedDetail: null
              }));
              setCurrentView('explorer');
              setSelectedLocation(null);
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
      
      {currentView === 'landing' && idlePos && (
        (() => {
          const x = idlePos.x;
          const y = idlePos.y;
          let areaContext = {};
          
          if (x < window.innerWidth / 2 && y < window.innerHeight / 2) {
            areaContext = {
              areaName: 'Al Maryah Island',
              description: "The pulse of luxury and wellness.\\nExperience Abu Dhabi's premier lifestyle destination—where world-class healthcare meets high-end retail and stunning waterfronts.",
              highlights: [
                { id: 2, name: 'Cleveland Clinic', type: 'health', tagline: 'World-class care, redefined' },
                { id: 10, name: 'Sorbonne University', type: 'education', tagline: 'A bridge to global knowledge' },
                { id: 7, name: 'Corniche Beach Park', type: 'parks', tagline: 'Sun, sand, and serenity' }
              ]
            };
          } else if (x > window.innerWidth / 2 && y < window.innerHeight / 2) {
            areaContext = {
              areaName: 'Al Reem Island',
              description: "Modern living, elevated.\\nA dynamic island hub blending stunning architectural skylines with leading education and vital city connections.",
              highlights: [
                { id: 10, name: 'Sorbonne University', type: 'education', tagline: 'A bridge to global knowledge' },
                { id: 8, name: 'NMC Specialty Hospital', type: 'health', tagline: 'Your health, our priority' },
                { id: 6, name: 'Main Bus Terminal', type: 'transport', tagline: 'The gateway to the city' }
              ]
            };
          } else {
            areaContext = {
              areaName: 'Khalifa City',
              description: "Quiet on the map. Full of possibilities.\\nExplore the places that shape everyday life here — from knowledge and culture to green escapes and global connections.",
              highlights: [
                { id: 3, name: 'Zayed University', type: 'education', tagline: 'Where ideas take flight' },
                { id: 5, name: 'Umm Al Emarat Park', type: 'parks', tagline: 'Your green escape awaits' },
                { id: 9, name: 'Intl Airport', type: 'transport', tagline: 'See where the city connects' }
              ]
            };
          }

          return (
            <HoverExplorationPopup 
              x={idlePos.x} 
              y={idlePos.y} 
              areaContext={areaContext}
              onExplore={(category, specificId) => {
                  let newResults = [];
              if (category === 'education') {
                newResults = [
                  { id: 3, name: 'Zayed University Campus', type: 'EDUCATION', location: 'Khalifa City', lat: 24.4136, lng: 54.5683 },
                  { id: 4, name: 'Bright Riders School', type: 'EDUCATION', location: 'Mohammed Bin Zayed City', lat: 24.3297, lng: 54.5361 }
                ];
              } else if (category === 'parks') {
                newResults = [
                  { id: 5, name: 'Umm Al Emarat Park', type: 'PARK', location: 'Al Mushrif', lat: 24.4533, lng: 54.3879 }
                ];
              } else if (category === 'transport') {
                newResults = [
                  { id: 6, name: 'Abu Dhabi Main Bus Terminal', type: 'TRANSPORT', location: 'Al Nahyan', lat: 24.4719, lng: 54.3725 }
                ];
              } else {
                newResults = [
                  { id: 1, name: 'Al Ain Hospital', type: 'HOSPITAL', location: 'Al Jimi', lat: 24.2155, lng: 55.7389 },
                  { id: 2, name: 'Cleveland Clinic Abu Dhabi', type: 'HOSPITAL', location: 'Al Maryah Island', lat: 24.5011, lng: 54.3942 }
                ];
              }
              let focusItem = newResults.length > 0 ? newResults[0] : null;
              let selectedItem = null;
              
              if (specificId) {
                const specificItem = MOCK_DATA.find(item => item.id === specificId);
                if (specificItem) {
                  focusItem = specificItem;
                  selectedItem = specificItem;
                }
              }
              
              setExplorerState(prev => ({
                ...prev,
                activeResults: MOCK_DATA,
                layerFilters: ['Education', 'Healthcare', 'Transport', 'Environment', 'Tourism', 'Utilities'],
                mapFocus: focusItem ? { lat: focusItem.lat, lng: focusItem.lng, zoom: selectedItem ? 16 : 12 } : null,
                selectedDetail: selectedItem,
                isDockerMinimized: false
              }));
              setCurrentView('explorer');
              setSelectedLocation(null);
          }}
        />
        );
      })()
      )}
      
      {/* Hide custom cursor in explorer view so standard interactions work normally */}
      {currentView === 'landing' && (
        <CustomCursor 
          mouseX={mouseX} 
          mouseY={mouseY}
          isSearchFocused={isSearchFocused || !!selectedLocation}
          isHoveringSearch={isHoveringUI}
        />
      )}
    </div>
  );
}

export default App;
