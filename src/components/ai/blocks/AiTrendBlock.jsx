import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;

export default function AiTrendBlock({ data, onEntityClick, onOpenAnalytics }) {
  const { isDarkMode } = useTheme();
  const { isArabic } = useLanguage();

  if (!data) return null;

  const {
    title = '12-Month Historical Trend',
    title_ar = 'مسار التغيير عبر 12 شهراً',
    unit = 'tCO2e',
    seriesData = [],
    peakMonth = 'July',
    lowestMonth = 'February',
    averageValue = '1,420 tCO2e',
    changePercentage = '+18%',
    insights = []
  } = data;

  const displayTitle = isArabic ? (title_ar || title) : title;
  const categories = seriesData.map(item => isArabic && item.month_ar ? item.month_ar : item.month);
  const values = seriesData.map(item => item.value !== undefined ? item.value : item.riskScore || item.emissions || 0);

  const options = {
    chart: {
      type: 'line',
      height: 190,
      backgroundColor: 'transparent',
      style: { fontFamily: 'Inter, sans-serif' }
    },
    title: { text: null },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories,
      labels: { style: { fontSize: '9px', color: isDarkMode ? '#94a3b8' : '#64748b' } },
      lineColor: isDarkMode ? '#334155' : '#e2e8f0'
    },
    yAxis: {
      title: { text: null },
      labels: { style: { fontSize: '9px', color: isDarkMode ? '#94a3b8' : '#64748b' } },
      gridLineColor: isDarkMode ? '#1e293b' : '#f1f5f9'
    },
    tooltip: {
      pointFormat: `<b>{point.y} ${unit}</b>`,
      style: { fontSize: '10px' },
      backgroundColor: isDarkMode ? '#0f1a36' : '#ffffff',
      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
      color: isDarkMode ? '#ffffff' : '#000000'
    },
    plotOptions: {
      series: {
        color: isDarkMode ? '#00e5ff' : '#3D52A0',
        lineWidth: 2.5,
        marker: {
          enabled: true,
          radius: 3,
          fillColor: isDarkMode ? '#00e5ff' : '#3D52A0'
        }
      }
    },
    series: [{
      name: displayTitle,
      data: values
    }]
  };

  return (
    <div className={`border rounded-2xl p-3.5 my-2.5 shadow-2xs space-y-3 transition-colors ${
      isDarkMode ? 'bg-[#132042] border-slate-700/80' : 'bg-slate-50 border-slate-200/90'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3D52A0] dark:text-[#00e5ff]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{displayTitle}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>12 Months</span>
        </span>
      </div>

      {/* Primary Highcharts Line Chart */}
      {seriesData.length > 0 && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}

      {/* Trend Insights Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
        <div className="p-2 rounded-xl border bg-white dark:bg-[#18274d] border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[9px] font-bold text-slate-400 block uppercase">{isArabic ? 'الشهر الأعلى' : 'Peak Month'}</span>
          <span className="text-xs font-extrabold text-rose-500 block mt-0.5">{peakMonth}</span>
        </div>

        <div className="p-2 rounded-xl border bg-white dark:bg-[#18274d] border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[9px] font-bold text-slate-400 block uppercase">{isArabic ? 'الشهر الأدنى' : 'Lowest Month'}</span>
          <span className="text-xs font-extrabold text-emerald-500 block mt-0.5">{lowestMonth}</span>
        </div>

        <div className="p-2 rounded-xl border bg-white dark:bg-[#18274d] border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[9px] font-bold text-slate-400 block uppercase">{isArabic ? 'المتوسط العام' : 'Average'}</span>
          <span className="text-xs font-extrabold text-slate-800 dark:text-white block mt-0.5">{averageValue}</span>
        </div>

        <div className="p-2 rounded-xl border bg-white dark:bg-[#18274d] border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[9px] font-bold text-slate-400 block uppercase">{isArabic ? 'نسبة التغير' : 'Change %'}</span>
          <span className={`text-xs font-extrabold block mt-0.5 flex items-center justify-center gap-0.5 ${
            changePercentage.startsWith('+') ? 'text-rose-500' : 'text-emerald-500'
          }`}>
            {changePercentage.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{changePercentage}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
