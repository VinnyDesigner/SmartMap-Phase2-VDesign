import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
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

export default function AiChartBlock({ chartData, onEntityClick }) {
  const { isDarkMode } = useTheme();
  const { t, isArabic } = useLanguage();
  if (!chartData || !chartData.data) return null;

  const { title, type = 'column', data = [], xKey = 'label', yKey = 'value', unit = '' } = chartData;

  const displayTitle = isArabic ? (chartData.title_ar || CATEGORY_MAP[title] || title) : title;
  const displayUnit = isArabic ? (unit === 'tCO2e' ? 'طن مكافئ' : unit === 'pts' ? 'نقاط' : unit) : unit;

  const categories = data.map(item => {
    const rawVal = item[xKey] || item.name || item.label;
    return isArabic ? (item.name_ar || CATEGORY_MAP[rawVal] || rawVal) : rawVal;
  });

  const seriesValues = data.map(item => ({
    y: typeof item[yKey] === 'number' ? item[yKey] : item.value,
    facilityId: item.id || item.facilityId,
    facility: item
  }));

  const options = {
    chart: {
      type: type === 'line' ? 'line' : type === 'bar' ? 'bar' : 'column',
      height: 180,
      backgroundColor: 'transparent',
      style: { fontFamily: 'Inter, sans-serif' }
    },
    title: {
      text: displayTitle || '',
      style: { fontSize: '11px', fontWeight: '700', color: isDarkMode ? '#f8fafc' : '#1e2749' }
    },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: categories,
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
        borderRadius: type === 'line' ? 0 : 4,
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
      data: seriesValues
    }]
  };

  return (
    <div className={`border rounded-xl p-2.5 my-2.5 shadow-2xs transition-all ${
      isDarkMode ? 'bg-[#132042] border-slate-700/70' : 'bg-slate-50 border-slate-200/80'
    }`}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
