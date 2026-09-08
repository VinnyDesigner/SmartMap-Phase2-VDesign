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

import { useTheme } from './contexts/ThemeContext';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { isDarkMode } = useTheme();
  const { isArabic } = useLanguage();
  
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  
  const orbX = useTransform(smoothMouseX, v => v - 400);
  const orbY = useTransform(smoothMouseY, v => v - 400);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHoveringUI, setIsHoveringUI] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'explorer' | 'about' | 'login' | 'help'

  const handleNavigate = (view) => {
    if (!userAuth.isLoggedIn) {
      setExplorerState(prev => ({
        ...prev,
        chatHistory: [] 
      }));
    }
    setCurrentView(view);
  };
  
  const MOCK_DATA = [
    { id: 201, name: 'Louvre Abu Dhabi', name_ar: 'متحف اللوفر أبوظبي', type: 'TOURISM', location: 'Saadiyat Cultural District', lat: 24.5338, lng: 54.3982 },
    { id: 202, name: 'Qasr Al Watan Cultural Palace', name_ar: 'قصر الوطن الثقافي', type: 'TOURISM', location: 'Al Ras Al Akhdar', lat: 24.4628, lng: 54.3056 },
    { id: 101, name: 'Department of Government Enablement (DGE) HQ', name_ar: 'دائرة التمكين الحكومي - المقر الرئيسي', type: 'GOVERNMENT', location: 'Corniche West', lat: 24.4789, lng: 54.3312 },
    { id: 105, name: 'TAMM Customer Service Hub - Al Reem', name_ar: 'مركز تم لخدمات المتعاملين - الريم', type: 'GOVERNMENT', location: 'Al Reem Island', lat: 24.5028, lng: 54.4056 },
    { id: 901, name: 'Al Taweelah Power & Desalination Complex', name_ar: 'مجمّع الطويلة للطاقة وتحلية المياه', type: 'CIVIC_INFRASTRUCTURE', location: 'Al Taweelah', lat: 24.7810, lng: 54.7120 },
    { id: 12, name: 'Umm Al Emarat Park', name_ar: 'حديقة أم الإمارات', type: 'PARK', location: 'Al Mushrif', lat: 24.4533, lng: 54.3879 },
    { id: 15, name: 'Abu Dhabi Main Bus Terminal', name_ar: 'محطة حافلات أبوظبي الرئيسية', type: 'TRANSPORT', location: 'Al Nahyan', lat: 24.4719, lng: 54.3725 }
  ];

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
    activeResults: MOCK_DATA,
    selectedDetail: null,
    basemap: 'abu-dhabi-dge',
    activeBasemap: 'abu-dhabi-dge',
    isDrawingMode: false,
    chatHistory: [],
    savedLocations: [],
    savedChatHistory: [],
    userAuth: { isLoggedIn: false },
    isLoggedIn: false,
    userLocationEnabled: false,
    userLocation: null,
    showLocationModal: false
  });

  useEffect(() => {
    setExplorerState(prev => ({
      ...prev,
      userAuth,
      isLoggedIn: userAuth.isLoggedIn
    }));
  }, [userAuth]);

  // Automatic browser geolocation on app launch
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setExplorerState(prev => ({
            ...prev,
            userLocationEnabled: true,
            userLocation: userCoords,
            mapFocus: { lat: userCoords.lat, lng: userCoords.lng, zoom: 15 }
          }));
        },
        (err) => {
          console.log("Geolocation prompt denied or unavailable, using Abu Dhabi default extent.");
          setExplorerState(prev => ({
            ...prev,
            userLocationEnabled: true,
            userLocation: { lat: 24.4839, lng: 54.3773 },
            mapFocus: { lat: 24.4839, lng: 54.3773, zoom: 13 }
          }));
        },
        { timeout: 5000 }
      );
    }
  }, []);

  if (currentView === 'login') {
    return <SignInPage onNavigate={handleNavigate} onSignIn={handleSignIn} />;
  }

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden relative bg-[#F8FAFC] dark:bg-[#060a12] transition-colors duration-300 ${isArabic ? 'rtl' : 'ltr'} ${currentView === 'landing' ? 'custom-cursor-active' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <BrandHeader onNavigate={handleNavigate} currentView={currentView} userAuth={userAuth} onSignOut={handleSignOut} onSignIn={handleSignIn} />
      
      {currentView === 'landing' && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <WebGLFluidReveal mouseX={smoothMouseX} mouseY={smoothMouseY} isDarkMode={isDarkMode} />
        </div>
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
      
      {/* Location Permission Enforcement Modal */}
      <LocationPermissionModal 
        isOpen={explorerState?.showLocationModal}
        onClose={() => setExplorerState(prev => ({ ...prev, showLocationModal: false }))}
        onGrantLocation={(pos) => {
          setExplorerState(prev => ({
            ...prev,
            userLocationEnabled: true,
            userLocation: { lat: pos.lat, lng: pos.lng },
            mapFocus: { lat: pos.lat, lng: pos.lng, zoom: 15 },
            showLocationModal: false
          }));
        }}
        onUseDefaultLocation={() => {
          setExplorerState(prev => ({
            ...prev,
            userLocationEnabled: true,
            userLocation: { lat: 24.4839, lng: 54.3773 },
            mapFocus: { lat: 24.4839, lng: 54.3773, zoom: 13 },
            showLocationModal: false
          }));
        }}
      />

      {/* Map-Centric Dedicated Print Layout Container */}
      <MapPrintTemplate explorerState={explorerState} />
    </div>
  );
}

export default App;
