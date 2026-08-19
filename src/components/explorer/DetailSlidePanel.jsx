import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, MapPin, ExternalLink, Mail, Phone, Bookmark, Activity, BookOpen, HeartPulse, TreePine, Bus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DetailSlidePanel({ explorerState, setExplorerState }) {
  const detail = explorerState?.selectedDetail;
  const { t, isArabic } = useLanguage();

  const handleClose = () => {
    setExplorerState(prev => ({ ...prev, selectedDetail: null }));
  };

  const getIcon = (type) => {
    if (type === 'EDUCATION') return <BookOpen className="w-8 h-8 text-[#3D52A0]" />;
    if (type === 'HOSPITAL') return <Activity className="w-8 h-8 text-[#3D52A0]" />;
    if (type === 'PARK') return <TreePine className="w-8 h-8 text-[#3D52A0]" />;
    if (type === 'TRANSPORT') return <Bus className="w-8 h-8 text-[#3D52A0]" />;
    return <Activity className="w-8 h-8 text-[#3D52A0]" />;
  };

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          initial={{ x: isArabic ? '-100%' : '100%' }}
          animate={{ x: 0 }}
          exit={{ x: isArabic ? '-100%' : '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)](0,0,0,0.3)] border-s border-slate-100 pointer-events-auto z-40 overflow-hidden flex flex-col transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-white sticky top-0 z-10 transition-colors">
            <button onClick={handleClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
              <span className="text-sm font-medium tracking-tight">{t('Back to results', 'العودة للنتائج')}</span>
            </button>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 sleek-scrollbar">
            {/* Title Block - Compact Horizontal */}
            <div className="flex items-start gap-4 mt-2">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {React.cloneElement(getIcon(detail.type), { className: "w-6 h-6 text-[#3D52A0]" })}
              </div>
              <div className="flex-1 pt-0.5">
                <h2 className="text-[19px] font-bold text-[#1e293b] tracking-tight leading-tight">{isArabic && detail.name_ar ? detail.name_ar : detail.name}</h2>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-slate-500 tracking-tight font-arabic text-[13px]" dir="rtl">{!isArabic && detail.name_ar ? detail.name_ar : ''}</p>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded tracking-widest uppercase">
                    {detail.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info & Actions Compact Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                  <MapPin className="w-4 h-4 opacity-70" />
                  <span>{detail.location || 'Khalifa City'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 text-[13px] font-medium hover:underline cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  <span>{t('Website', 'الموقع الإلكتروني')}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2">
                <button className="flex-1 bg-white border border-slate-200 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-slate-50 shadow-sm transition-all text-[#1e293b] text-[13px] font-bold tracking-tight">
                  <Mail className="w-4 h-4 text-slate-500" /> {t('Email', 'بريد إلكتروني')}
                </button>
                <button className="flex-1 bg-white border border-slate-200 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-slate-50 shadow-sm transition-all text-[#1e293b] text-[13px] font-bold tracking-tight">
                  <Phone className="w-4 h-4 text-slate-500" /> {t('Phone', 'هاتف')}
                </button>
                <button className="w-10 h-[38px] bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 shadow-sm transition-all" title="Save to Workspace">
                  <Bookmark className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="pt-2">
              <h3 className="font-bold tracking-tight text-[#1e293b] text-[15px] mb-4">{t('Facility Details', 'تفاصيل المنشأة')}</h3>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[12px] font-medium tracking-tight mb-1">{t('Facility Type', 'نوع المنشأة')}</span>
                  <span className="font-semibold tracking-tight text-[#1e293b] text-[14px] capitalize">{detail.type.toLowerCase()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[12px] font-medium tracking-tight mb-1">{t('Medical Audit', 'التدقيق الطبي')}</span>
                  <span className="font-semibold tracking-tight text-[#1e293b] text-[14px]">AUDIT REPORT • Q3/2024</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[12px] font-medium tracking-tight mb-1">{t('Operating Hours', 'ساعات العمل')}</span>
                  <span className="font-semibold tracking-tight text-[#1e293b] text-[14px]">24/7 Emergency</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[12px] font-medium tracking-tight mb-1">{t('Lat / Long', 'خط العرض / الطول')}</span>
                  <span className="font-semibold tracking-tight text-[#1e293b] text-[14px]">{detail.lat?.toFixed(5) || '24.41360'}, {detail.lng?.toFixed(5) || '54.56830'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
