import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Compass, AlertTriangle, ShieldCheck, Lock, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function LocationPermissionModal({ isOpen, onClose, onGrantLocation, onUseDefaultLocation }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const handleRequestBrowserLocation = () => {
    setIsRequesting(true);

    if (typeof window !== 'undefined' && navigator.geolocation) {
      // 1. Fast Wi-Fi / IP / Cell location request (3s timeout)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsRequesting(false);
          if (onGrantLocation) {
            onGrantLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          }
        },
        (error) => {
          console.warn("Fast Geolocation Failed, retrying with fallback:", error);
          // 2. Secondary fallback attempt
          navigator.geolocation.getCurrentPosition(
            (pos2) => {
              setIsRequesting(false);
              if (onGrantLocation) {
                onGrantLocation({
                  lat: pos2.coords.latitude,
                  lng: pos2.coords.longitude,
                  accuracy: pos2.coords.accuracy
                });
              }
            },
            (err2) => {
              console.warn("Browser Geolocation Error / Denied:", err2);
              setIsRequesting(false);
              if (onUseDefaultLocation) onUseDefaultLocation();
            },
            { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
          );
        },
        { enableHighAccuracy: false, timeout: 3000, maximumAge: 60000 }
      );
    } else {
      setIsRequesting(false);
      if (onUseDefaultLocation) onUseDefaultLocation();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md pointer-events-auto cursor-default">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25 }}
          className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border flex flex-col overflow-hidden pointer-events-auto cursor-default ${
            isDarkMode 
              ? 'bg-[#0b132b]/95 border-slate-700/80 text-white shadow-[0_25px_60px_rgba(0,0,0,0.85)]' 
              : 'bg-white border-slate-200/90 text-slate-900 shadow-[0_25px_60px_rgba(33,90,158,0.25)]'
          }`}
        >
          {/* SDI Top Brand Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed]" />

          {/* Close / Dismiss Button */}
          {onClose && (
            <button
              onClick={onClose}
              className={`absolute top-4 end-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Icon Header Badge */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#063360] via-[#215A9E] to-[#7c3aed] flex items-center justify-center text-white shadow-xl shrink-0">
              <MapPin className="w-7 h-7" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0b132b] flex items-center justify-center text-white">
                <Navigation className="w-2.5 h-2.5 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#3D52A0] dark:text-[#00e5ff] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>{t("LOCATION-BASED PLATFORM", "منصة قائمة على الموقع الجغرافي")}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                {t("Enable Location Access", "تفعيل الوصول إلى الموقع الجغرافي")}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 mb-6">
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
              {t(
                "GeoVision is a location-based spatial intelligence platform. Location access is required to perform proximity queries, calculate geodesic buffers, locate nearest facilities, and analyze spatial risks.",
                "GeoVision منصة ذكاء مكاني قائمة على الموقع. يلزم الوصول إلى الموقع لإجراء استعلامات القرب الجغرافي، وحساب النطاقات الجيوديسية، وتحديد أقرب المنشآت، وتحليل المخاطر المكانية."
              )}
            </p>

            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              isDarkMode ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' : 'bg-amber-50/90 border-amber-200/80 text-amber-900'
            }`}>
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-500 mt-0.5" />
              <span>
                {t(
                  "Without location access, proximity routing, nearest facility searches, and spatial buffer features cannot function properly.",
                  "بدون الوصول إلى الموقع، لا يمكن لوظائف توجيه القرب الجغرافي والبحث عن أقرب المنشآت وحساب النطاقات المكانية العمل بشكل صحيح."
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRequestBrowserLocation}
              disabled={isRequesting}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Navigation className={`w-4.5 h-4.5 ${isRequesting ? 'animate-spin' : ''}`} />
              <span>
                {isRequesting 
                  ? (isArabic ? "جاري الحصول على الإحداثيات..." : "Acquiring High-Precision Coordinates...") 
                  : (isArabic ? "السماح بالوصول إلى الموقع (GPS)" : "Allow Location Access (GPS)")}
              </span>
            </button>

            <button
              onClick={onUseDefaultLocation}
              className={`w-full py-3 px-5 rounded-2xl font-bold text-xs border transition-colors cursor-pointer flex items-center justify-center gap-2.5 ${
                isDarkMode 
                  ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white' 
                  : 'border-slate-200 bg-slate-100/90 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              <span>{t("Use Abu Dhabi Center Coordinates (24.4839, 54.3773)", "استخدام إحداثيات مركز أبوظبي (24.4839, 54.3773)")}</span>
            </button>
          </div>

          {/* Privacy Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 text-center">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>
              {isArabic
                ? "تُعالج بيانات الموقع محلياً داخل المتصفح فقط ولا يتم تخزينها أو مشاركتها."
                : "Location data is processed strictly client-side for spatial queries and is never stored."}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


