import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export default function AiTextBlock({ content }) {
  const { isDarkMode } = useTheme();
  if (!content) return null;

  return (
    <div className={`space-y-1.5 text-xs leading-relaxed font-sans ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
      {content.split('\n').map((paragraph, pIdx) => (
        <p key={pIdx} className={pIdx > 0 ? "mt-1.5" : ""}>
          {paragraph.split('**').map((part, i) => 
            i % 2 === 1 ? (
              <strong key={i} className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {part}
              </strong>
            ) : part
          )}
        </p>
      ))}
    </div>
  );
}
