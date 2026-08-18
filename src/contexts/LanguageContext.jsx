import React, { createContext, useState, useContext, useEffect } from 'react';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    // Apply RTL and Arabic language attributes to the HTML element
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  // Common translation helper for inline use
  const t = (en, ar) => (isArabic ? ar : en);

  return (
    <LanguageContext.Provider value={{ isArabic, setIsArabic, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
