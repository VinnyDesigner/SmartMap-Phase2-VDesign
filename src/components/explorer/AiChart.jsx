import React, { useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { motion } from 'framer-motion';
import { BarChart2, PieChart as PieChartIcon, Star, Bookmark } from 'lucide-react';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;

// Setup Highcharts global theme to match the premium dark/glassmorphic look
Highcharts.setOptions({
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, sans-serif'
    }
  },
  title: {
    style: { color: '#0f172a', fontWeight: '600', fontSize: '14px' }
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderWidth: 0,
    borderRadius: 8,
    shadow: true,
    style: { color: '#334155', fontWeight: '500' }
  },
  credits: { enabled: false },
  plotOptions: {
    series: {
      animation: { duration: 1000, easing: 'easeOutBounce' },
      borderRadius: 4
    }
  }
});

export default function AiChart({ chartData, results, isBookmarked, onBookmark }) {
  const [viewMode, setViewMode] = useState('custom');

  if (!chartData) return null;

  // Process data into Highcharts options
  const options = useMemo(() => {
    // 1. If the AI Engine sent a complete bespoke Highcharts payload, use it directly!
    if (chartData.isHighcharts && chartData.options && viewMode === 'custom') {
      return chartData.options;
    }

    // 2. Otherwise, adapt based on viewMode or legacy chartData format
    let type = chartData.type || 'bar';
    let title = chartData.title || 'Analytics';
    let data = chartData.data || [];

    // Override if toggled by user
    if (viewMode === 'area' && results) {
      type = 'column'; title = 'Distribution by Area';
      const map = {};
      results.forEach(r => { map[r.location || 'Unknown'] = (map[r.location || 'Unknown'] || 0) + 1; });
      data = Object.keys(map).map(k => ({ name: k, value: map[k] }));
    } else if (viewMode === 'type' && results) {
      type = 'pie'; title = 'Distribution by Category';
      const map = {};
      results.forEach(r => { map[r.type || 'Other'] = (map[r.type || 'Other'] || 0) + 1; });
      data = Object.keys(map).map(k => ({ name: k, value: map[k] }));
    } else if (viewMode === 'rating' && results) {
      type = 'column'; title = 'Top Rated';
      data = [...results].sort((a,b)=>b.rating-a.rating).slice(0,5).map(r => ({ name: r.name.split(' ')[0], value: r.rating || 0 }));
    }
    
    if (type === 'pie') {
      return {
        chart: { type: 'pie', margin: [20, 0, 20, 0], spacing: [0, 0, 0, 0] },
        title: { text: title, margin: 10, style: { fontSize: '14px' } },
        plotOptions: {
          pie: {
            innerSize: '60%', // Donut style
            size: '70%', // Balance pie size with label space
            dataLabels: { 
              enabled: true, 
              format: '<b>{point.name}</b>',
              distance: 15,
              style: { fontSize: '11px', textOutline: 'none' }
            }
          }
        },
        series: [{
          name: 'Count',
          colorByPoint: true,
          data: data.map(d => ({ name: d.name, y: d.value })),
          colors: ['#4370f0', '#063360', '#60a5fa', '#3b82f6', '#93c5fd']
        }]
      };
    }

    // Default to Bar / Column
    return {
      chart: { type: 'column' },
      title: { text: title },
      xAxis: {
        categories: data.map(d => d.name),
        labels: { style: { color: '#64748b' } },
        lineColor: '#e2e8f0',
        tickColor: '#e2e8f0'
      },
      yAxis: {
        title: { text: null },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b' } }
      },
      legend: { enabled: false },
      series: [{
        name: 'Metric',
        data: data.map(d => ({
          y: d.value,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#4370f0'], // dge-tech
              [1, '#60a5fa']  // lighter blue
            ]
          }
        }))
      }]
    };
  }, [chartData, viewMode, results]);

  const Toggles = () => (
    <div className="flex items-center gap-2">
      <div className="flex bg-slate-100/50 p-1 rounded-xl w-fit">
        {chartData.isHighcharts && (
           <button onClick={() => setViewMode('custom')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'custom' ? 'bg-white shadow-sm text-dge-tech' : 'text-slate-400 hover:text-slate-600'}`} title="Query Data">
             <Star className="w-4 h-4" />
           </button>
        )}
        <button onClick={() => setViewMode('area')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'area' || (!chartData.isHighcharts && viewMode === 'custom') ? 'bg-white shadow-sm text-dge-tech' : 'text-slate-400 hover:text-slate-600'}`} title="By Area">
          <BarChart2 className="w-4 h-4" />
        </button>
        <button onClick={() => setViewMode('type')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'type' ? 'bg-white shadow-sm text-dge-tech' : 'text-slate-400 hover:text-slate-600'}`} title="By Category">
          <PieChartIcon className="w-4 h-4" />
        </button>
      </div>
      {onBookmark && (
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBookmark}
          className={`p-1.5 rounded-lg transition-all border ${isBookmarked ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Chart"}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-md border border-white/80 rounded-[20px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] mt-3 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interactive Analytics</span>
        <Toggles />
      </div>
      <div className="w-full h-[280px]">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: '100%', height: '100%' } }}
        />
      </div>
    </motion.div>
  );
}
