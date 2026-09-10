import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from 'framer-motion';
import MapBackground from './components/MapBackground';
import CustomCursor from './components/CustomCursor';
import SearchInterface from './components/SearchInterface';
import BrandHeader from './components/BrandHeader';
import DataExplorerLayout from './components/explorer/DataExplorerLayout';
import AboutUsPage from './components/AboutUsPage';
import HelpPage from './components/HelpPage';
import SignInPage from './components/SignInPage';
import WebGLFluidReveal from './components/WebGLFluidReveal';
import LocationPermissionModal from './components/common/LocationPermissionModal';
import MapPrintTemplate from './components/common/MapPrintTemplate';
import AnalyticsModal from './components/common/AnalyticsModal';
import FeedbackModal from './components/common/FeedbackModal';

import { useTheme } from './contexts/ThemeContext';
import { useLanguage } from './contexts/LanguageContext';
import { useProject } from './contexts/ProjectContext';

import { SEED_FAVORITES } from './components/explorer/AiChatInterface';

function App() {
  const { isDarkMode } = useTheme();
  const { isArabic } = useLanguage();
  const { activeProject } = useProject();
  
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  const orbX = useTransform(smoothMouseX, v => v - 400);
  const orbY = useTransform(smoothMouseY, v => v - 400);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHoveringUI, setIsHoveringUI] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'explorer' | 'about' | 'login' | 'help'
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const requestUserLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = { 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy 
          };
          setExplorerState(prev => ({
            ...prev,
            userLocationEnabled: true,
            userLocation: userCoords,
            // When user allows location, smoothly move map to exact user position
            mapFocus: { 
              lat: userCoords.lat, 
              lng: userCoords.lng, 
              zoom: 16, 
              source: 'geolocation-granted',
              timestamp: Date.now() 
            }
          }));
        },
        (err) => {
          console.warn("Browser Geolocation Denied or Unavailable:", err);
          // When denied or unavailable, do NOT move the map, leave at default overview
          setExplorerState(prev => ({
            ...prev,
            userLocationEnabled: false
          }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const handleNavigate = (view) => {
    if (!userAuth.isLoggedIn) {
      setExplorerState(prev => ({
        ...prev,
        chatHistory: [] 
      }));
    }
    setCurrentView(view);
  };

  const [userAuth, setUserAuth] = useState({
    isLoggedIn: false,
    userName: null,
    userEmail: null
  });

  const handleSignIn = () => {
    const authState = {
      isLoggedIn: true,
      userName: 'H.E. Eng. Ahmed Al-Mansoori',
      userNameAr: 'سعادة المهندس أحمد المنصوري',
      userEmail: 'ahmed.almansoori@dge.gov.ae',
      role: 'Senior Geospatial Officer'
    };

    setUserAuth(authState);
    setExplorerState(prev => ({
      ...prev,
      userAuth: authState,
      isLoggedIn: true
    }));

    setCurrentView('explorer');
  };

  const handleSignOut = () => {
    setUserAuth({
      isLoggedIn: false,
      userName: null,
      userEmail: null
    });
    setExplorerState(prev => ({
      ...prev,
      chatHistory: [],
      savedLocations: [],
      savedChatHistory: [],
      userAuth: { isLoggedIn: false },
      isLoggedIn: false
    }));
  };

  const [explorerState, setExplorerState] = useState({
    mapFocus: null,
    activeResults: [],
    showSearchResults: false,
    selectedDetail: null,
    selectedLocation: null,
    basemap: activeProject.mapConfig.defaultBasemap,
    activeBasemap: activeProject.mapConfig.defaultBasemap,
    isDrawingMode: false,
    chatHistory: [],
    savedLocations: SEED_FAVORITES,
    savedChatHistory: [],
    userAuth: { isLoggedIn: false },
    isLoggedIn: false,
    userLocationEnabled: false,
    userLocation: { lat: 24.4839, lng: 54.3773 },
    showLocationModal: false
  });


  useEffect(() => {
    setExplorerState(prev => ({
      ...prev,
      userAuth,
      isLoggedIn: userAuth.isLoggedIn
    }));
  }, [userAuth]);

  // Automatic browser geolocation prompt on app launch & map viewer entry
  useEffect(() => {
    if (currentView === 'explorer') {
      requestUserLocation();
    }
  }, [currentView]);

  if (currentView === 'login') {
    return <SignInPage onNavigate={handleNavigate} onSignIn={handleSignIn} />;
  }

  return (
    <>
      <div className={`no-print h-[100dvh] w-full font-sans flex flex-col overflow-hidden relative bg-[#F8FAFC] dark:bg-[#060a12] transition-colors duration-300 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <BrandHeader 
          onNavigate={handleNavigate} 
          currentView={currentView} 
          userAuth={userAuth} 
          onSignOut={handleSignOut} 
          onSignIn={handleSignIn} 
          setExplorerState={setExplorerState} 
          onOpenFeedback={() => setShowFeedbackModal(true)}
        />
        
        {currentView === 'landing' && (
          <>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <WebGLFluidReveal mouseX={smoothMouseX} mouseY={smoothMouseY} isDarkMode={isDarkMode} />
            </div>
            <CustomCursor 
              isSearchFocused={isSearchFocused} 
            />
          </>
        )}
        
        {currentView === 'landing' ? (
          <SearchInterface 
            isFocused={isSearchFocused}
            setIsFocused={setIsSearchFocused}
            onSearch={(query) => {
              setCurrentView('explorer');
              setSelectedLocation(null);
              if (query && query.trim() !== '') {
                setExplorerState(prev => ({
                  ...prev,
                  pendingQuery: query
                }));
              }
            }}
          />
        ) : currentView === 'explorer' ? (
          <DataExplorerLayout 
            onNavigate={handleNavigate} 
            explorerState={explorerState}
            setExplorerState={setExplorerState}
            mouseX={mouseX} 
            mouseY={mouseY} 
            isSearchFocused={isSearchFocused} 
            selectedLocation={selectedLocation}
          />
        ) : currentView === 'help' ? (
          <HelpPage 
            onNavigate={handleNavigate} 
            explorerState={explorerState}
            setExplorerState={setExplorerState}
            userAuth={explorerState.userAuth}
            setUserAuth={(auth) => setExplorerState(prev => ({ ...prev, userAuth: auth }))}
          />
        ) : (
          <AboutUsPage onNavigate={handleNavigate} />
        )}

        {/* On-Demand Analytics Modal (Wireframe Page 6) */}
        <AnalyticsModal
          isOpen={Boolean(explorerState?.showAnalyticsModal)}
          onClose={() => setExplorerState(prev => ({ ...prev, showAnalyticsModal: false }))}
          title={explorerState?.analyticsTitle}
          results={explorerState?.activeResults}
        />

        {/* User Feedback Modal (Matching Image 1 & 2) */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          userAuth={userAuth}
        />
      </div>

      {/* Map-Centric Dedicated Multi-Page Executive Print Layout */}
      <MapPrintTemplate explorerState={explorerState} />
    </>
  );
}

export default App;
