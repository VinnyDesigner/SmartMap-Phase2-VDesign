import React, { useState } from 'react';
import { Code, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AiExecutionTrace({ logs }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();

  if (!logs || logs.length === 0) return null;

  const hasFailed = logs.some(l => l.status === 'failed');

  return (
    <div className={`border rounded-xl p-2.5 my-2 space-y-1 font-mono text-[10px] ${
      isDarkMode 
        ? 'bg-[#0d1527] border-slate-800 text-slate-200' 
        : 'bg-slate-50 border-slate-200/80 text-slate-700'
    }`}>
      <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-widest text-[9px]">
        <span>{t('HOW I DID THIS (EXECUTION TRACE)', 'آلية المعالجة (سجل التنفيذ)')}</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`hover:underline flex items-center gap-1 font-semibold ${isDarkMode ? 'text-sky-400' : 'text-[#3D52A0]'}`}
        >
          <Code className="w-3 h-3" />
          {isOpen ? t('Hide Trace', 'إخفاء السجل') : t('Inspect Trace', 'فحص السجل')}
        </button>
      </div>

      {(isOpen || hasFailed) && (
        <div className={`space-y-1 pt-1.5 border-t ${isDarkMode ? 'border-slate-700/60' : 'border-slate-200/60'}`}>
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <span className={`flex items-center gap-1.5 ${
                log.status === 'failed' 
                  ? 'text-rose-400 font-bold' 
                  : (isDarkMode ? 'text-emerald-400 font-medium' : 'text-emerald-700 font-medium')
              }`}>
                {log.status === 'failed' ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <Check className="w-3 h-3 text-emerald-400" />}
                <span>{log.step}</span>
              </span>
              {log.message && <span className="text-slate-400 text-[9px]">{log.message}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
