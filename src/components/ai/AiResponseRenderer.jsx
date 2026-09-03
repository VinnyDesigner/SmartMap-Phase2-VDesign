import React from 'react';
import AiTextBlock from './blocks/AiTextBlock';
import AiKpiGrid from './blocks/AiKpiGrid';
import AiChartBlock from './blocks/AiChartBlock';
import AiRiskBreakdown from './blocks/AiRiskBreakdown';
import AiInsightCard from './blocks/AiInsightCard';
import AiWhyThisResult from './blocks/AiWhyThisResult';
import AiExecutionTrace from './blocks/AiExecutionTrace';
import AiActionSuggestions from './blocks/AiActionSuggestions';
import AiLocationListBlock from './blocks/AiLocationListBlock';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle2, Bot, Database, Sparkles, Layers } from 'lucide-react';

const DATASET_TRANSLATIONS = {
  'DGE Spatial SDI 2026': 'البنية المكانية لـ SDI 2026',
  'DoH Master Healthcare Registry v2.1': 'سجل الرعاية الصحية لدائرة الصحة v2.1',
  'DoH Government Facility Registry': 'سجل المنشآت الحكومية لدائرة الصحة',
  'DoH Proximity Buffer Engine': 'محرك النطاقات المكانية لـ SDI',
  'DGE GPS Location Engine': 'محرك تحديد المواقع الجغرافية GPS',
  'Healthcare Facilities Registry': 'سجل المنشآت الصحية المعتمَد',
  'Abu Dhabi Administrative Boundaries': 'الحدود الإدارية لإمارة أبوظبي',
  'DoH Ownership Category Layer': 'طبقة تصنيف الملكية لدائرة الصحة',
  'Proximity Buffer Analytics Layer': 'طبقة التحليل المكاني والنطاقات',
  'GPS Proximity Engine': 'محرك المسافات المكانية GPS',
  'Healthcare Spatial Network': 'شبكة الرعاية الصحية المكانية',
  'DoH Healthcare Registry 2026': 'سجل دائرة الصحة للمستشفيات 2026',
  'DGE Administrative Boundaries': 'الحدود الإدارية لدائرة التمكين الحكومي'
};

export default function AiResponseRenderer({ response, onEntityClick, onActionClick, onSuggestionClick, isLoggedIn = false }) {
  const { isArabic } = useLanguage();
  if (!response) return null;

  // Handle fallback flat structure if blocks array is not provided
  const blocks = response.blocks || [];

  if (blocks.length === 0) {
    return (
      <div className="space-y-2">
        {response.content && <AiTextBlock content={isArabic ? (response.content_ar || response.content) : response.content} />}
        {response.kpiGrid && <AiKpiGrid metrics={response.kpiGrid} />}
        {response.chartData && <AiChartBlock chartData={response.chartData} onEntityClick={onEntityClick} />}
        {response.riskDecomposition && <AiRiskBreakdown riskData={response.riskDecomposition} />}
        {response.insightData && <AiInsightCard insightData={response.insightData} />}
        {response.whyThisResult && <AiWhyThisResult data={response.whyThisResult} />}
        {response.executionLogs && <AiExecutionTrace logs={response.executionLogs} />}

        {/* Priority 6: Expandable "HOW THIS RESULT WAS FOUND" Provenance Box */}
        {(response.howThisResultWasFound || response.datasetsUsed) && (
          <details className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 group">
            <summary className="font-bold text-[#3D52A0] dark:text-[#00e5ff] cursor-pointer hover:underline flex items-center justify-between list-none">
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-[#3D52A0] dark:text-[#00e5ff]" />
                <span>{isArabic ? "🔍 كيف تم العثور على هذه النتيجة" : "🔍 HOW THIS RESULT WAS FOUND"}</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            
            <div className="mt-2 space-y-1.5 bg-slate-50/90 dark:bg-[#0b1426]/90 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xs font-mono text-[10px]">
              <div className="flex items-start gap-1.5">
                <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "السؤال:" : "Question:"}</strong>
                <span className="text-slate-600 dark:text-slate-400">{response.howThisResultWasFound?.question || (isArabic ? "عرض المستشفيات الحكومية ضمن 5 كم من مدينة زايد الرياضية" : "Which government hospitals are within 5 km of Zayed Sports City?")}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "مجموعات البيانات:" : "Datasets:"}</strong>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{ (response.howThisResultWasFound?.datasets || response.datasetsUsed || ['Healthcare Facilities', 'Administrative Spatial Limits']).map(d => `✓ ${isArabic ? (DATASET_TRANSLATIONS[d] || d) : d}`).join('  ') }</span>
              </div>
              <div className="flex items-start gap-1.5">
                <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "الفلاتر:" : "Filters:"}</strong>
                <span className="text-slate-600 dark:text-slate-400">{response.howThisResultWasFound?.filters || (isArabic ? "حكومي فقط" : "Government Ownership")}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "الشرط المكاني:" : "Spatial condition:"}</strong>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">{response.howThisResultWasFound?.spatialCondition || (isArabic ? "نطاق 5 كم" : "Within 5 km Radius Buffer")}</span>
              </div>
              <div className="flex items-start gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "النتيجة:" : "Result:"}</strong>
                <span className="text-[#3D52A0] dark:text-[#00e5ff] font-bold">{response.howThisResultWasFound?.resultCount || (response.results?.length ? (isArabic ? `${response.results.length} منشآت مكانية` : `${response.results.length} facilities`) : (isArabic ? '3 منشآت مكانية' : '3 facilities'))}</span>
              </div>
            </div>
          </details>
        )}

        {/* Datasets Used & Provenance Lineage Badge */}
        {(response.datasetsUsed || response.datasets) && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[#3D52A0] dark:text-[#00e5ff]">
                {isArabic ? "المصادر المكانية:" : "Datasets Used:"}
              </span>
              {(response.datasetsUsed || response.datasets).map((ds, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-[9.5px]">
                  {isArabic ? (DATASET_TRANSLATIONS[ds] || ds) : ds}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20 text-[9px] flex items-center gap-1">
                <Bot className="w-2.5 h-2.5" />
                <span>{isArabic ? "تفسير الذكاء الاصطناعي" : "🤖 AI Interpretation"}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 text-[9px] flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>{isArabic ? "بيانات موثقة SDI" : "✓ Authoritative SDI Data"}</span>
              </span>
            </div>
          </div>
        )}

        {(response.actionCards || response.suggestions) && (
          <AiActionSuggestions 
            actionCards={response.actionCards} 
            suggestions={response.suggestions} 
            onActionClick={onActionClick}
            onSuggestionClick={onSuggestionClick}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'TEXT':
            return <AiTextBlock key={idx} content={isArabic ? (block.content_ar || block.content) : block.content} />;
          case 'KPI_GRID':
            return <AiKpiGrid key={idx} metrics={block.metrics} />;
          case 'LOCATION_LIST':
            return <AiLocationListBlock key={idx} locations={block.locations} onEntityClick={onEntityClick} />;
          case 'CHART':
            return <AiChartBlock key={idx} chartData={block.data} onEntityClick={onEntityClick} />;
          case 'RISK_BREAKDOWN':
            return <AiRiskBreakdown key={idx} riskData={block.data} />;
          case 'INSIGHT':
            return <AiInsightCard key={idx} insightData={block.data} />;
          case 'WHY_THIS_RESULT':
            return <AiWhyThisResult key={idx} data={block.data} />;
          case 'EXECUTION_TRACE':
            return <AiExecutionTrace key={idx} logs={block.logs} />;
          case 'ACTION_SUGGESTIONS':
            return (
              <AiActionSuggestions 
                key={idx} 
                actionCards={block.actionCards} 
                suggestions={block.suggestions} 
                onActionClick={onActionClick}
                onSuggestionClick={onSuggestionClick}
                isLoggedIn={isLoggedIn}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
