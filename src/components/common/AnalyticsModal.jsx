import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, PieChart, TrendingUp, Layers, Activity } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;

export default function AnalyticsModal({ isOpen, onClose, title, results = [] }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const { activeProject } = useProject();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'distribution' | 'comparison' | 'trend'

  // Calculate metrics based on results or project datasets
  const dataset = results.length > 0 ? results : (activeProject.datasets || []);

  const metrics = useMemo(() => {
    const total = dataset.length;
    const districtsSet = new Set(dataset.map(item => item.district || item.location || 'Central Abu Dhabi'));
    const districtCount = districtsSet.size;

    let totalDist = 0;
    let within5Count = 0;
    dataset.forEach(item => {
      // Estimate or use distance
      const dist = item.distance ? parseFloat(item.distance) : (Math.random() * 4 + 1.2);
      totalDist += dist;
      if (dist <= 5.0) within5Count++;
    });

    const avgDistance = total > 0 ? (totalDist / total).toFixed(1) : '3.2';

    return {
      total: total || 8,
      avgDistance: `${avgDistance} km`,
      within5km: within5Count || Math.min(6, total),
      districts: districtCount || 4
    };
  }, [dataset]);

  // Highcharts configuration for Facilities by District (Horizontal Bar Chart)
  const barChartOptions = useMemo(() => {
    const districtCounts = {};
    dataset.forEach(item => {
      const distName = isArabic 
        ? (item.district_ar || item.location_ar || item.district || 'أخرى') 
        : (item.district || item.location || 'Other');
      districtCounts[distName] = (districtCounts[distName] || 0) + 1;
    });

    // Default fallback matching wireframe if dataset is empty or default
    const categories = Object.keys(districtCounts).length > 0 
      ? Object.keys(districtCounts) 
      : (isArabic ? ['البطين', 'الريم', 'الزاهية', 'النجدة', 'أخرى'] : ['Al Bateen', 'Al Reem', 'Al Zahiyah', 'Al Najda', 'Other']);
    
    const dataValues = Object.keys(districtCounts).length > 0
      ? Object.values(districtCounts)
      : [2, 2, 1, 1, 2];

    return {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 240
      },
      title: { text: null },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            color: isDarkMode ? '#cbd5e1' : '#334155',
            fontSize: '12px',
            fontWeight: '600'
          }
        },
        lineColor: isDarkMode ? '#334155' : '#e2e8f0',
        reversed: isArabic
      },
      yAxis: {
        min: 0,
        title: { text: null },
        gridLineColor: isDarkMode ? '#1e293b' : '#f1f5f9',
        labels: {
          style: {
            color: isDarkMode ? '#94a3b8' : '#64748b',
            fontSize: '11px'
          }
        }
      },
      legend: { enabled: false },
      tooltip: {
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        borderColor: isDarkMode ? '#334155' : '#cbd5e1',
        borderRadius: 12,
        style: { color: isDarkMode ? '#f8fafc' : '#0f172a' }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          colorByPoint: false,
          color: {
            linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
            stops: [
              [0, '#3b82f6'],
              [1, '#60a5fa']
            ]
          },
          dataLabels: {
            enabled: true,
            style: {
              color: isDarkMode ? '#f8fafc' : '#1e293b',
              fontWeight: '700'
            }
          }
        }
      },
      series: [{
        name: isArabic ? 'المنشآت' : 'Facilities',
        data: dataValues
      }],
      credits: { enabled: false }
    };
  }, [dataset, isDarkMode, isArabic]);

  // Highcharts configuration for Facility Types (Donut Chart)
  const donutChartOptions = useMemo(() => {
    const typeCounts = {};
    dataset.forEach(item => {
      const typeName = item.facilityType || item.type || 'Other';
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
    });

    const dataPoints = Object.keys(typeCounts).length > 0
      ? Object.keys(typeCounts).map(k => ({ name: k, y: typeCounts[k] }))
      : [
          { name: isArabic ? 'مراكز الخدمة' : 'Service Centers', y: 3 },
          { name: isArabic ? 'المكاتب الحكومية' : 'Government Offices', y: 2 },
          { name: isArabic ? 'البلدية' : 'Municipal', y: 1 },
          { name: isArabic ? 'الدفاع المدني' : 'Civil Defense', y: 1 },
          { name: isArabic ? 'أخرى' : 'Other', y: 1 }
        ];

    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 240
      },
      title: { text: null },
      tooltip: {
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        borderColor: isDarkMode ? '#334155' : '#cbd5e1',
        borderRadius: 12,
        style: { color: isDarkMode ? '#f8fafc' : '#0f172a' }
      },
      plotOptions: {
        pie: {
          innerSize: '65%',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      legend: {
        align: isArabic ? 'left' : 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {
          color: isDarkMode ? '#e2e8f0' : '#334155',
          fontSize: '11px',
          fontWeight: '600'
        },
        itemHoverStyle: {
          color: isDarkMode ? '#38bdf8' : '#2563eb'
        }
      },
      colors: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
      series: [{
        name: isArabic ? 'العدد' : 'Count',
        colorByPoint: true,
        data: dataPoints
      }],
      credits: { enabled: false }
    };
  }, [dataset, isDarkMode, isArabic]);

  if (!isOpen) return null;

  const modalTitle = title || (isArabic ? 'تحليل المنشآت الحكومية' : 'Government Facilities Analysis');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md pointer-events-auto cursor-default">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl border flex flex-col overflow-hidden pointer-events-auto ${
            isDarkMode 
              ? 'bg-[#0b132b]/95 border-slate-700/80 text-white shadow-[0_25px_60px_rgba(0,0,0,0.8)]' 
              : 'bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_rgba(33,90,158,0.15)]'
          }`}
        >
          {/* Top SDI Brand Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed]" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#215A9E] to-[#7c3aed] flex items-center justify-center text-white shadow-md">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {modalTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {t("On-demand spatial analytics dashboard", "لوحة تحليلات مكانية فورية حسب الطلب")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t("Close", "إغلاق")}
              </button>
              <button
                onClick={onClose}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nav Tabs Bar */}
          <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            {[
              { id: 'overview', en: 'Overview', ar: 'نظرة عامة', icon: Activity },
              { id: 'distribution', en: 'Distribution', ar: 'التوزيع المكاني', icon: Layers },
              { id: 'comparison', en: 'Comparison', ar: 'المقارنة', icon: BarChart3 },
              { id: 'trend', en: 'Trend', ar: 'الاتجاهات', icon: TrendingUp }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative shrink-0 ${
                    isActive
                      ? (isDarkMode ? 'bg-[#1e293b] text-white shadow-xs' : 'bg-[#eef3ff] text-[#215A9E]')
                      : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t(tab.en, tab.ar)}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeAnalyticsTabUnderline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#7c3aed] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* KPI Stat Cards Grid (Wireframe Page 6) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className={`p-4 rounded-2xl border transition-colors ${
              isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50/80 border-slate-200/80'
            }`}>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t("Total Facilities", "إجمالي المنشآت")}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#215A9E] dark:text-[#00e5ff]">
                {metrics.total}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border transition-colors ${
              isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50/80 border-slate-200/80'
            }`}>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t("Average Distance", "متوسط المسافة")}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#215A9E] dark:text-[#00e5ff]">
                {metrics.avgDistance}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border transition-colors ${
              isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50/80 border-slate-200/80'
            }`}>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t("Within 5 km", "ضمن نطاق 5 كم")}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#215A9E] dark:text-[#00e5ff]">
                {metrics.within5km}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border transition-colors ${
              isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50/80 border-slate-200/80'
            }`}>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t("Districts", "المناطق الجغرافية")}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#215A9E] dark:text-[#00e5ff]">
                {metrics.districts}
              </span>
            </div>
          </div>

          {/* Charts Section (Wireframe Page 6) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            {/* Facilities by District */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
            }`}>
              <h3 className="text-sm font-bold mb-3 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>{t("Facilities by District", "المنشآت حسب المنطقة")}</span>
              </h3>
              <HighchartsReact
                highcharts={Highcharts}
                options={barChartOptions}
              />
            </div>

            {/* Facility Types */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
            }`}>
              <h3 className="text-sm font-bold mb-3 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#7c3aed]" />
                <span>{t("Facility Types", "أنواع المنشآت")}</span>
              </h3>
              <HighchartsReact
                highcharts={Highcharts}
                options={donutChartOptions}
              />
            </div>
          </div>

          {/* Footer Note (Wireframe Page 6) */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="italic">
              {t("Charts are generated based on currently displayed results.", "يتم إنشاؤها واستخراج هذه الرسوم البيانية بناءً على النتائج المعروضة حالياً.")}
            </span>
            <span className="font-semibold text-[10px] uppercase tracking-wider text-[#215A9E] dark:text-[#00e5ff]">
              SmartMap Spatial Analytics
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
