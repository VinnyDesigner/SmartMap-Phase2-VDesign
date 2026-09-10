import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { Maximize2, BarChart3 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;

const CATEGORY_MAP = {
  'Mussafah': 'مصفح',
  'KIZAD / Taweelah': 'كيزاد / الطويلة',
  'Taweelah': 'الطويلة',
  'Abu Dhabi Industrial District Emissions (tCO2e)': 'انبعاثات المناطق الصناعية في أبوظبي (طن مكافئ)',
  '12-Month Historical Risk Trajectory': 'مسار تقييم الخطورة لـ 12 شهراً',
  'Abu Dhabi Regional Risk Comparison': 'مقارنة تقييم المخاطر الإقليمية بأبوظبي'
};

export default function AiChartBlock({ chartData, onEntityClick, onOpenAnalytics }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();

  if (!chartData || !chartData.data) return null;

  const {
    title,
    chartType = 'column',
    type = 'column',
    data = [],
    xKey = 'label',
    yKey = 'value',
    unit = ''
  } = chartData;

  const activeType = (chartType || type).toLowerCase();
  const displayTitle = isArabic ? (chartData.title_ar || CATEGORY_MAP[title] || title) : title;
  const displayUnit = isArabic ? (unit === 'tCO2e' ? 'طن مكافئ' : unit === 'pts' ? 'نقاط' : unit) : unit;

  const totalSum = data.reduce((sum, item) => {
    const val = typeof item[yKey] === 'number' ? item[yKey] : (item.value || item.riskScore || 0);
    return sum + val;
  }, 0) || 1;

  const categories = data.map(item => {
    const rawVal = item[xKey] || item.name || item.label || item.district || item.facility;
    return isArabic ? (item.name_ar || CATEGORY_MAP[rawVal] || rawVal) : rawVal;
  });

  // For category distribution in narrow chat panels, ranked horizontal bar is the clean standard
  const isDistributionChart = (title || '').toLowerCase().includes('distribution') || (title || '').toLowerCase().includes('zone') || activeType === 'distribution';
  const isPieOrDonut = (activeType === 'pie' || activeType === 'donut' || activeType === 'doughnut') && !isDistributionChart;
  const isBar = activeType === 'bar' || activeType === 'horizontal_bar' || activeType === 'ranked_bar' || isDistributionChart || (!isPieOrDonut && activeType !== 'line' && activeType !== 'column');

  const seriesValues = isPieOrDonut
    ? data.map(item => ({
        name: isArabic ? (item.name_ar || item.label) : (item.label || item.name),
        y: typeof item[yKey] === 'number' ? item[yKey] : (item.value || item.riskScore || 0),
        color: item.color,
        facility: item
      }))
    : data.map(item => ({
        y: typeof item[yKey] === 'number' ? item[yKey] : (item.value || item.riskScore || item.emissions || 0),
        color: item.color,
        percentage: item.percentage !== undefined ? item.percentage : (((item[yKey] || item.value || 0) / totalSum) * 100),
        facilityId: item.id || item.facilityId,
        facility: item
      }));

  let hChartType = 'column';
  if (activeType === 'line') hChartType = 'line';
  else if (isBar) hChartType = 'bar';
  else if (isPieOrDonut) hChartType = 'pie';

  // Compute clean responsive height
  const chartHeight = isBar 
    ? Math.max(140, Math.min(320, data.length * 36 + 30))
    : (isPieOrDonut ? 210 : 185);

  const options = {
    chart: {
      type: hChartType,
      height: chartHeight,
      backgroundColor: 'transparent',
      style: { fontFamily: 'Inter, sans-serif' }
    },
    title: {
      text: displayTitle || '',
      style: { fontSize: '11px', fontWeight: '700', color: isDarkMode ? '#f8fafc' : '#1e2749' }
    },
    credits: { enabled: false },
    legend: { 
      enabled: isPieOrDonut,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      itemStyle: {
        fontSize: '9.5px',
        fontWeight: '600',
        color: isDarkMode ? '#cbd5e1' : '#475569'
      }
    },
    xAxis: isPieOrDonut ? undefined : {
      categories: categories,
      labels: { 
        style: { 
          fontSize: '9.5px', 
          fontWeight: '600',
          color: isDarkMode ? '#94a3b8' : '#64748b' 
        } 
      },
      lineColor: isDarkMode ? '#334155' : '#e2e8f0'
    },
    yAxis: isPieOrDonut ? undefined : {
      title: { text: null },
      allowDecimals: false,
      labels: { 
        style: { fontSize: '9px', color: isDarkMode ? '#94a3b8' : '#64748b' } 
      },
      gridLineColor: isDarkMode ? '#1e293b' : '#f1f5f9'
    },
    tooltip: {
      pointFormat: `<b>{point.y} ${displayUnit}</b>`,
      style: { fontSize: '10px' },
      backgroundColor: isDarkMode ? '#0f1a36' : '#ffffff',
      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
      color: isDarkMode ? '#ffffff' : '#000000'
    },
    plotOptions: {
      pie: {
        innerSize: (activeType === 'donut' || activeType === 'doughnut') ? '55%' : '0%',
        size: '80%',
        center: ['35%', '50%'],
        dataLabels: { 
          enabled: true, 
          format: '{point.percentage:.0f}%',
          distance: -16,
          style: { fontSize: '9px', fontWeight: 'bold', color: '#ffffff', textOutline: 'none' }
        },
        showInLegend: true
      },
      bar: {
        colorByPoint: true,
        borderRadius: 4,
        pointWidth: 16,
        dataLabels: {
          enabled: true,
          formatter: function() {
            const pct = this.point.percentage !== undefined ? this.point.percentage : ((this.point.y / totalSum) * 100);
            return `<b>${this.point.y}</b> <span style="opacity:0.75">(${pct.toFixed(0)}%)</span>`;
          },
          style: {
            fontSize: '9.5px',
            fontWeight: '700',
            color: isDarkMode ? '#f8fafc' : '#1e2749',
            textOutline: 'none'
          }
        }
      },
      series: {
        borderRadius: hChartType === 'line' ? 0 : 4,
        color: isDarkMode ? '#00e5ff' : '#3D52A0',
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              if (onEntityClick && this.facility) {
                onEntityClick(this.facility);
              }
            }
          }
        }
      }
    },
    series: [{
      name: displayTitle,
      data: seriesValues
    }]
  };

  return (
    <div className={`border rounded-xl p-2.5 my-2.5 shadow-2xs transition-all relative group ${
      isDarkMode ? 'bg-[#132042] border-slate-700/70' : 'bg-slate-50 border-slate-200/80'
    }`}>
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <BarChart3 className="w-3 h-3 text-[#215A9E] dark:text-[#00e5ff]" />
          <span>{t("Analytics Chart", "رسم بياني تحليلي")}</span>
        </span>

        {onOpenAnalytics && (
          <button
            onClick={onOpenAnalytics}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode ? 'bg-[#182645] border-slate-700 text-[#00e5ff] hover:bg-[#7c3aed] hover:text-white' : 'bg-white border-slate-200 text-[#215A9E] hover:bg-[#215A9E] hover:text-white'
            }`}
            title={t("Expand Full Analytics (On Demand)", "توسيع التحليلات الكاملة")}
          >
            <Maximize2 className="w-3 h-3" />
            <span>{t("On Demand Analytics", "تحليلات تفاعلية")}</span>
          </button>
        )}
      </div>

      {/* Proportional Segmented Progress Strip */}
      {data.length > 1 && (
        <div className="space-y-1 mb-1 px-0.5">
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
            {data.map((item, idx) => {
              const pct = item.percentage !== undefined ? item.percentage : (((item[yKey] || item.value || 0) / totalSum) * 100);
              return (
                <div
                  key={idx}
                  style={{ width: `${Math.max(4, pct)}%`, backgroundColor: item.color || '#3b82f6' }}
                  className="h-full transition-all hover:brightness-110"
                  title={`${item.label || item.name}: ${item.value || 0} (${pct.toFixed(0)}%)`}
                />
              );
            })}
          </div>
        </div>
      )}

      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
