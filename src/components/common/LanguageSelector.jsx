import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSelector({ className = '', isDarkMode = false }) {
  const { isArabic, setIsArabic } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setIsArabic(!isArabic)}
      className={`text-sm md:text-[15px] font-semibold transition-colors duration-200 cursor-pointer px-2 py-1 select-none ${
        isDarkMode 
          ? 'text-slate-200 hover:text-white' 
          : 'text-slate-700 hover:text-dge-tech'
      } ${className}`}
      title={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
      aria-label={isArabic ? 'Switch to English' : 'Switch to Arabic'}
    >
      {isArabic ? 'English' : 'عربي'}
    </button>
  );
}
